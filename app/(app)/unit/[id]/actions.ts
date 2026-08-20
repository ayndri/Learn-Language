'use server'

import { and, count, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUserId } from '@/auth'
import { generateItems } from '@/lib/ai/items'
import { generateLesson } from '@/lib/ai/lesson'
import { db } from '@/lib/db'
import { itemStates, items, languages, units } from '@/lib/db/schema'
import { getItemType, implementedItemTypes } from '@/lib/items/registry'
import { ITEM_TYPES, type ItemType } from '@/lib/items/types'
import { initialState } from '@/lib/srs/fsrs'

export type ActionResult = { ok?: string; error?: string; rejected?: string[] }

/**
 * Tandai unit siap dipelajari.
 *
 * Dipanggil terakhir oleh alur penyiapan otomatis, setelah materi & item ada.
 * Sengaja terpisah: kalau salah satu langkah generate gagal, unit tetap `planned`
 * dan penyiapannya bisa dicoba lagi dari awal tanpa meninggalkan pelajaran
 * setengah jadi yang tampak siap padahal isinya bolong.
 */
export async function markUnitReadyAction(unitId: string): Promise<ActionResult> {
  const userId = await requireUserId()
  const row = await loadOwnedUnit(unitId, userId)
  if (!row) return { error: 'Unit tidak ditemukan.' }

  const [{ n }] = await db
    .select({ n: count() })
    .from(items)
    .where(and(eq(items.unitId, unitId), eq(items.userId, userId)))

  if (!row.unit.lessonMd) return { error: 'Materi belum ada.' }
  if (Number(n) === 0) return { error: 'Belum ada item latihan.' }

  await db.update(units).set({ status: 'ready' }).where(eq(units.id, unitId))
  revalidatePath(`/unit/${unitId}`)
  revalidatePath('/')
  return { ok: 'Pelajaran siap.' }
}

/** Ambil unit + bahasanya, pastikan memang milik user yang login */
async function loadOwnedUnit(unitId: string, userId: string) {
  const [row] = await db
    .select({ unit: units, language: languages })
    .from(units)
    .innerJoin(languages, eq(languages.id, units.languageId))
    .where(and(eq(units.id, unitId), eq(units.userId, userId)))
    .limit(1)
  return row
}

export async function generateLessonAction(unitId: string): Promise<ActionResult> {
  const userId = await requireUserId()
  const row = await loadOwnedUnit(unitId, userId)
  if (!row) return { error: 'Unit tidak ditemukan.' }

  try {
    const lessonMd = await generateLesson({
      languageName: row.language.name,
      nativeName: row.language.nativeName,
      topic: row.unit.topic,
      level: row.unit.level,
      focus: row.unit.focus,
    })

    await db
      .update(units)
      // lessonEdited direset: materi baru berarti belum diverifikasi lagi
      .set({ lessonMd, lessonEdited: false })
      .where(eq(units.id, unitId))

    revalidatePath(`/unit/${unitId}`)
    return { ok: 'Materi dibuat. Baca dulu, dan cek kalau ada yang terasa aneh.' }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate materi.' }
  }
}

export async function generateItemsAction(
  unitId: string,
  type: string,
  count: number,
): Promise<ActionResult> {
  const userId = await requireUserId()

  if (!ITEM_TYPES.includes(type as ItemType)) return { error: 'Jenis item tidak dikenal.' }
  const itemType = type as ItemType
  if (!implementedItemTypes().includes(itemType)) {
    return { error: `Jenis "${itemType}" belum diimplementasikan.` }
  }
  // Jumlahnya milik definisi jenis itu, bukan keputusan pemanggil — supaya
  // "berapa kosakata per pelajaran" cuma diatur di satu tempat (registry).
  const def = getItemType(itemType)
  if (def.derived) return { error: `Jenis "${itemType}" diturunkan, bukan digenerate.` }
  const wanted = Math.min(Math.max(Math.trunc(count) || def.perLesson, 1), 20)

  const row = await loadOwnedUnit(unitId, userId)
  if (!row) return { error: 'Unit tidak ditemukan.' }
  if (!row.language.fieldTemplate.itemTypes.includes(itemType)) {
    return { error: `Jenis "${itemType}" tidak berlaku untuk bahasa ${row.language.name}.` }
  }

  // Daftar yang sudah dimiliki dikirim ke prompt supaya AI tidak mengulang.
  // Unique constraint di DB tetap jadi jaring pengaman — prompt bukan jaminan.
  const owned = await db
    .select({ dedupKey: items.dedupKey })
    .from(items)
    .where(and(eq(items.userId, userId), eq(items.languageId, row.language.id)))
  const existingKeys = new Set(owned.map((o) => o.dedupKey))

  let result
  try {
    result = await generateItems({
      languageName: row.language.name,
      nativeName: row.language.nativeName,
      template: row.language.fieldTemplate,
      type: itemType,
      topic: row.unit.topic,
      level: row.unit.level,
      focus: row.unit.focus,
      // Pelajaran kosakata membawa daftar katanya sendiri; jumlah itemnya
      // mengikuti panjang daftar itu, bukan angka bawaan registry.
      words: itemType === 'vocab' ? row.unit.wordList : null,
      count:
        itemType === 'vocab' && row.unit.wordList?.length ? row.unit.wordList.length : wanted,
      existingKeys,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate item.' }
  }

  let inserted = 0
  for (const gen of result.accepted) {
    const [created] = await db
      .insert(items)
      .values({
        unitId,
        languageId: row.language.id,
        userId,
        type: itemType,
        fields: gen.fields,
        tags: gen.tags,
        dedupKey: gen.dedupKey,
      })
      .onConflictDoNothing({
        target: [items.userId, items.languageId, items.dedupKey],
      })
      .returning({ id: items.id })

    // conflict → item sudah ada, tidak perlu state baru
    if (!created) continue

    await db.insert(itemStates).values({
      itemId: created.id,
      userId,
      ...initialState(new Date()),
    })
    inserted++
  }

  revalidatePath(`/unit/${unitId}`)

  // Jangan pernah membuang hasil yang ditolak secara diam-diam: kalau AI dimintai 10
  // dan cuma 6 yang layak, kamu harus tahu — itu sinyal prompt atau level perlu disetel.
  return {
    ok: `${inserted} item ditambahkan dari ${wanted} yang diminta.`,
    rejected: result.rejected.map((r) => `${r.preview} — ${r.reason}`),
  }
}


/**
 * Buat item yang DITURUNKAN dari item yang sudah ada di unit ini.
 *
 * Nol panggilan AI. Dua jenis dibuat di sini:
 *
 *   `listening` — teks bahasa target dibacakan, kamu tulis yang kamu dengar.
 *                 Sumbernya kalimat, ungkapan, dan contoh kalimat pada kartu kosakata.
 *   `speaking`  — kalimat Indonesia muncul, kamu ucapkan dalam bahasa target.
 *                 Sumbernya item `sentence` yang acuannya sudah ada.
 *
 * Selain gratis, ini juga bagus secara pedagogis: materi yang sama diulang lewat
 * indra dan arah yang berbeda — baca, dengar, tulis, ucapkan.
 */
export async function deriveItemsAction(unitId: string): Promise<ActionResult> {
  const userId = await requireUserId()
  const row = await loadOwnedUnit(unitId, userId)
  if (!row) return { error: 'Unit tidak ditemukan.' }

  const template = row.language.fieldTemplate
  const sources = await db
    .select({ type: items.type, fields: items.fields })
    .from(items)
    .where(and(eq(items.unitId, unitId), eq(items.userId, userId)))

  const insert = async (type: ItemType, fields: Record<string, unknown>) => {
    const def = getItemType(type)
    const [created] = await db
      .insert(items)
      .values({
        unitId,
        languageId: row.language.id,
        userId,
        type,
        fields,
        tags: def.tags(fields),
        dedupKey: def.dedupKey(fields),
      })
      .onConflictDoNothing({ target: [items.userId, items.languageId, items.dedupKey] })
      .returning({ id: items.id })
    if (!created) return false
    await db.insert(itemStates).values({ itemId: created.id, userId, ...initialState(new Date()) })
    return true
  }

  // Teks yang terlalu pendek tidak melatih apa pun sebagai dikte.
  const longEnough = (t: string) => t.trim().split(/\s+/).length >= 3

  let listening = 0
  if (template.itemTypes.includes('listening')) {
    const seen = new Set<string>()
    const candidates: { text: string; translation_id: string }[] = []

    for (const s of sources) {
      const f = s.fields as Record<string, unknown>
      let cand: { text: string; translation_id: string } | null = null
      if (s.type === 'sentence') {
        cand = { text: String(f.target ?? ''), translation_id: String(f.source_id ?? '') }
      } else if (s.type === 'phrase') {
        cand = { text: String(f.phrase ?? ''), translation_id: String(f.meaning_id ?? '') }
      } else if (s.type === 'vocab') {
        // Contoh kalimat di kartu kosakata sudah berupa kalimat lengkap
        // berpasangan dengan terjemahannya — sayang kalau tidak dipakai.
        cand = { text: String(f.example ?? ''), translation_id: String(f.example_id ?? '') }
      }
      if (!cand?.text || !cand.translation_id || !longEnough(cand.text)) continue
      const k = cand.text.toLowerCase().trim()
      if (seen.has(k)) continue
      seen.add(k)
      candidates.push(cand)
    }

    for (const fields of candidates.slice(0, 12)) {
      if (await insert('listening', fields)) listening++
    }
  }

  let speaking = 0
  if (template.itemTypes.includes('speaking')) {
    const candidates = sources
      .filter((s) => s.type === 'sentence')
      .map((s) => {
        const f = s.fields as Record<string, unknown>
        return { source_id: String(f.source_id ?? ''), target: String(f.target ?? '') }
      })
      .filter((c) => c.source_id && c.target)

    for (const fields of candidates.slice(0, 8)) {
      if (await insert('speaking', fields)) speaking++
    }
  }

  revalidatePath(`/unit/${unitId}`)
  return {
    ok: `${listening} dikte + ${speaking} latihan bicara dibuat dari materi yang sudah ada.`,
  }
}
