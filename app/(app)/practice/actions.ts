'use server'

import { and, eq } from 'drizzle-orm'
import { requireUserId } from '@/auth'
import { gradeWriting, scoreToRating, type WritingFeedback } from '@/lib/ai/writing'
import { db } from '@/lib/db'
import { itemStates, items, languages, reviewLogs } from '@/lib/db/schema'
import { getItemType } from '@/lib/items/registry'
import type { ItemType, Rating } from '@/lib/items/types'
import { applyRating } from '@/lib/srs/fsrs'
import { isValidRating, outcomeToRating } from '@/lib/srs/grade'

export type ReviewResult = {
  error?: string
  rating?: Rating
  /** hari sampai item ini muncul lagi */
  scheduledDays?: number
  correct?: boolean
  expected?: string
  /** true kalau jawaban belum dicatat dan menunggu penilaian sendiri (mode typed-self) */
  needsSelfRating?: boolean
  /** mode choice: indeks pilihan yang benar, baru dikirim SETELAH dijawab */
  answerIndex?: number
  /** mode choice: pembahasan, baru dikirim SETELAH dijawab */
  explanation?: string
  feedback?: WritingFeedback
}

/**
 * Terapkan satu penilaian: hitung jadwal FSRS baru, simpan state, catat log.
 *
 * Penilaian dilakukan di SERVER, bukan di klien. Bukan soal curang — ini app
 * pribadi — tapi supaya cuma ada satu implementasi grader, dan `review_logs`
 * mencatat apa yang benar-benar terjadi.
 */
async function record(
  userId: string,
  itemId: string,
  rating: Rating,
  durationMs: number,
  extra: { answerGiven?: string; wasCorrect?: boolean } = {},
) {
  const [row] = await db
    .select({ state: itemStates })
    .from(itemStates)
    .where(and(eq(itemStates.itemId, itemId), eq(itemStates.userId, userId)))
    .limit(1)

  if (!row) return null

  const now = new Date()
  const { next, scheduledDays } = applyRating(row.state, rating, now)

  await db
    .update(itemStates)
    .set(next)
    .where(and(eq(itemStates.itemId, itemId), eq(itemStates.userId, userId)))

  await db.insert(reviewLogs).values({
    itemId,
    userId,
    rating,
    answerGiven: extra.answerGiven ?? null,
    wasCorrect: extra.wasCorrect ?? null,
    stateBefore: row.state.state,
    dueBefore: row.state.due,
    durationMs: Math.max(0, Math.trunc(durationMs)),
    reviewedAt: now,
  })

  return { scheduledDays }
}

/** Ambil item + bahasanya, pastikan milik user yang login */
async function loadItem(userId: string, itemId: string) {
  const [row] = await db
    .select({ item: items, language: languages })
    .from(items)
    .innerJoin(languages, eq(languages.id, items.languageId))
    .where(and(eq(items.id, itemId), eq(items.userId, userId)))
    .limit(1)
  return row
}

// ---------------------------------------------------------------------------

/** Item `self` (vocab, phrase) — dan langkah kedua mode `typed-self` */
export async function submitSelfRating(
  itemId: string,
  rating: number,
  durationMs: number,
  answerGiven?: string,
): Promise<ReviewResult> {
  const userId = await requireUserId()
  if (!isValidRating(rating)) return { error: 'Rating tidak valid.' }

  const done = await record(userId, itemId, rating, durationMs, {
    answerGiven: answerGiven || undefined,
  })
  if (!done) return { error: 'Item tidak ditemukan.' }
  return { rating, scheduledDays: done.scheduledDays }
}

/** Item `typed` (cloze, listening, script) — jawaban tunggal, dicocokkan otomatis */
export async function submitTypedAnswer(
  itemId: string,
  answer: string,
  durationMs: number,
): Promise<ReviewResult> {
  const userId = await requireUserId()
  const row = await loadItem(userId, itemId)
  if (!row) return { error: 'Item tidak ditemukan.' }

  const def = getItemType(row.item.type as ItemType)
  if (!def.grader) return { error: `Jenis "${row.item.type}" tidak punya pemeriksa otomatis.` }

  const outcome = def.grader(answer, row.item.fields)
  const rating = outcomeToRating(outcome, durationMs)

  const done = await record(userId, itemId, rating, durationMs, {
    answerGiven: answer,
    wasCorrect: outcome.correct,
  })
  if (!done) return { error: 'State item tidak ditemukan.' }

  return {
    rating,
    scheduledDays: done.scheduledDays,
    correct: outcome.correct,
    expected: outcome.expected,
  }
}

/**
 * Item `typed-self` (sentence) — produksi bebas.
 *
 * Kalau jawabanmu sama dengan acuan, langsung dicatat. Kalau beda, TIDAK dicatat:
 * acuannya ditampilkan dan kamu yang menilai. Ini disengaja — "I am from Surabaya"
 * dan "I'm from Surabaya" dua-duanya benar, dan mesin pencocok teks tidak bisa
 * memutuskan itu tanpa menghukum jawaban yang sebenarnya betul.
 */
export async function submitProducedAnswer(
  itemId: string,
  answer: string,
  durationMs: number,
): Promise<ReviewResult> {
  const userId = await requireUserId()
  const row = await loadItem(userId, itemId)
  if (!row) return { error: 'Item tidak ditemukan.' }

  const def = getItemType(row.item.type as ItemType)
  if (!def.grader) return { error: `Jenis "${row.item.type}" tidak punya acuan jawaban.` }

  const outcome = def.grader(answer, row.item.fields)

  if (!outcome.correct) {
    // Belum dicatat — tunggu penilaian sendiri.
    return { correct: false, expected: outcome.expected, needsSelfRating: true }
  }

  const rating = outcomeToRating(outcome, durationMs)
  const done = await record(userId, itemId, rating, durationMs, {
    answerGiven: answer,
    wasCorrect: true,
  })
  if (!done) return { error: 'State item tidak ditemukan.' }

  return { rating, scheduledDays: done.scheduledDays, correct: true, expected: outcome.expected }
}

/**
 * Item `choice` (bacaan, cari kesalahan) — pilihan ganda.
 *
 * Kunci jawabannya ada di `fields.answer_index` dan dibandingkan DI SINI.
 * Klien menerima daftar pilihan tanpa kuncinya (lihat practice/page.tsx), jadi
 * jawaban benar tidak bisa dibaca dari DevTools sebelum menjawab.
 */
export async function submitChoice(
  itemId: string,
  chosen: number,
  durationMs: number,
): Promise<ReviewResult> {
  const userId = await requireUserId()
  if (!Number.isInteger(chosen) || chosen < 0 || chosen > 3) {
    return { error: 'Pilihan tidak valid.' }
  }

  const row = await loadItem(userId, itemId)
  if (!row) return { error: 'Item tidak ditemukan.' }

  const f = row.item.fields as Record<string, unknown>
  const answerIndex = Number(f.answer_index)
  const options = (f.options as string[] | undefined) ?? []
  if (!Number.isInteger(answerIndex)) return { error: 'Item ini tidak punya kunci jawaban.' }

  const correct = chosen === answerIndex
  // Pilihan ganda tidak punya "typo", jadi tidak ada nearMiss.
  const rating = outcomeToRating({ correct, nearMiss: false, expected: '' }, durationMs)

  const done = await record(userId, itemId, rating, durationMs, {
    answerGiven: options[chosen] ?? String(chosen),
    wasCorrect: correct,
  })
  if (!done) return { error: 'State item tidak ditemukan.' }

  return {
    rating,
    scheduledDays: done.scheduledDays,
    correct,
    expected: options[answerIndex] ?? '',
    answerIndex,
    explanation: typeof f.explanation_id === 'string' ? f.explanation_id : undefined,
  }
}

/** Item `ai` (writing) — dikoreksi AI dengan rubrik */
export async function submitWriting(
  itemId: string,
  answer: string,
  durationMs: number,
): Promise<ReviewResult> {
  const userId = await requireUserId()

  const trimmed = answer.trim()
  if (trimmed.length < 5) return { error: 'Tulisanmu terlalu pendek.' }
  if (trimmed.length > 2000) return { error: 'Tulisanmu terlalu panjang (maks 2000 karakter).' }

  const row = await loadItem(userId, itemId)
  if (!row) return { error: 'Item tidak ditemukan.' }

  const f = row.item.fields as Record<string, unknown>

  let feedback: WritingFeedback
  try {
    feedback = await gradeWriting({
      languageName: row.language.name,
      level: 'sesuai pelajaran',
      promptId: String(f.prompt_id ?? ''),
      guidanceId: f.guidance_id ? String(f.guidance_id) : null,
      minWords: Number(f.min_words ?? 25),
      answer: trimmed,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengoreksi tulisan.' }
  }

  const rating = scoreToRating(feedback.score)
  const done = await record(userId, itemId, rating, durationMs, {
    answerGiven: trimmed,
    wasCorrect: feedback.score >= 3,
  })
  if (!done) return { error: 'State item tidak ditemukan.' }

  return {
    rating,
    scheduledDays: done.scheduledDays,
    correct: feedback.score >= 3,
    feedback,
  }
}
