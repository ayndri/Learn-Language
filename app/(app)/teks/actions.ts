'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { requireUserId } from '@/auth'
import { extractVocabulary } from '@/lib/ai/extract'
import { db } from '@/lib/db'
import { itemStates, items, languages, units } from '@/lib/db/schema'
import { getItemType } from '@/lib/items/registry'
import { initialState } from '@/lib/srs/fsrs'

export type ImportState = { error?: string; rejected?: string[] }

const MIN_CHARS = 200
const MAX_CHARS = 20_000

/**
 * Tempel teks → kosakata baru.
 *
 * Unit hasilnya `trackId: null` supaya tidak mengacaukan urutan kurikulum, tapi
 * itemnya masuk ke antrean latihan harian yang sama — jadi kosakata dari paper
 * yang kamu baca dijadwalkan FSRS persis seperti kosakata bawaan.
 */
export async function importTextAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const userId = await requireUserId()

  const text = String(formData.get('text') ?? '').trim()
  const count = Math.min(Math.max(Number(formData.get('count') ?? 12) || 12, 5), 20)

  if (text.length < MIN_CHARS) {
    return { error: `Teksnya terlalu pendek (${text.length} karakter, minimal ${MIN_CHARS}).` }
  }
  if (text.length > MAX_CHARS) {
    return { error: `Teksnya terlalu panjang (maksimal ${MAX_CHARS} karakter).` }
  }

  const [language] = await db.select().from(languages).where(eq(languages.code, 'en')).limit(1)
  if (!language) return { error: 'Bahasa Inggris belum diaktifkan.' }

  // Kata yang sudah dimiliki dikirim ke prompt supaya tidak diambil ulang.
  const owned = await db
    .select({ dedupKey: items.dedupKey })
    .from(items)
    .where(
      and(eq(items.userId, userId), eq(items.languageId, language.id), eq(items.type, 'vocab')),
    )
  const existingTerms = new Set(
    owned.map((o) => o.dedupKey.replace(/^vocab:/, '')).filter(Boolean),
  )

  let extracted
  try {
    extracted = await extractVocabulary({
      languageName: language.name,
      template: language.fieldTemplate,
      text,
      count,
      existingTerms,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membaca teks.' }
  }

  if (extracted.items.length === 0) {
    return {
      error: 'Tidak ada kata baru yang layak diambil dari teks ini.',
      rejected: extracted.rejected,
    }
  }

  const [unit] = await db
    .insert(units)
    .values({
      userId,
      languageId: language.id,
      trackId: null, // di luar jalur belajar utama
      position: 0,
      status: 'ready',
      title: extracted.title,
      topic: 'kosakata dari bacaanmu',
      focus: 'kosakata yang muncul di teks yang kamu tempel sendiri',
      level: 'B1',
      lessonMd: null,
    })
    .returning({ id: units.id })

  const def = getItemType('vocab')
  let added = 0

  for (const fields of extracted.items) {
    const [created] = await db
      .insert(items)
      .values({
        unitId: unit.id,
        languageId: language.id,
        userId,
        type: 'vocab',
        fields,
        tags: [...def.tags(fields), 'from:text'],
        dedupKey: def.dedupKey(fields),
      })
      .onConflictDoNothing({ target: [items.userId, items.languageId, items.dedupKey] })
      .returning({ id: items.id })

    if (!created) continue
    await db.insert(itemStates).values({
      itemId: created.id,
      userId,
      ...initialState(new Date()),
    })
    added++
  }

  if (added === 0) {
    await db.delete(units).where(eq(units.id, unit.id))
    return { error: 'Semua kata dari teks ini sudah kamu punya.', rejected: extracted.rejected }
  }

  redirect(`/unit/${unit.id}`)
}
