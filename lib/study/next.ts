import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, tracks, units } from '@/lib/db/schema'
import { queueSummary } from '@/lib/study/queue'

/**
 * Satu-satunya tempat yang menjawab "sekarang ngapain?".
 *
 * Pengguna tidak memilih topik dan tidak menekan tombol generate. Dia menekan
 * satu tombol; fungsi ini yang memutuskan tujuannya.
 *
 * Urutan prioritasnya:
 *   1. belum punya jalur belajar   → onboarding
 *   2. ada yang jatuh tempo        → latihan  (ingatan yang mau luntur lebih penting
 *                                              daripada materi baru)
 *   3. ada pelajaran berikutnya    → pelajaran itu (disiapkan otomatis kalau perlu)
 *   4. tidak ada apa-apa           → selesai untuk hari ini
 *
 * Keputusan itu selalu untuk SATU jalur belajar. Satu orang boleh punya beberapa
 * (Inggris dan Jepang sekaligus), tapi "sekarang ngapain?" tidak punya jawaban
 * yang masuk akal kalau ditanyakan untuk dua bahasa sekaligus — jadi bahasa
 * aktifnya ditentukan lebih dulu oleh `resolveTrack`, dan halaman tinggal
 * meneruskan pilihannya.
 */
export type NextStep =
  | { kind: 'onboard' }
  | { kind: 'practice'; languageCode: string; count: number }
  | { kind: 'lesson'; unitId: string; title: string; position: number; prepared: boolean }
  | { kind: 'done'; languageName: string }

/**
 * Semua jalur belajar milik seseorang, urut dari yang paling dulu dibuat.
 *
 * Dipakai pemilih bahasa di dashboard. Dulu tidak ada: seluruh app memanggil
 * `.limit(1)` pada tracks, jadi jalur kedua tetap tersimpan di database tapi
 * tidak pernah bisa dibuka. Bahasa yang tidak bisa dibuka sama saja dengan
 * bahasa yang tidak ada.
 */
export async function listTracks(userId: string) {
  return db
    .select({
      trackId: tracks.id,
      languageId: languages.id,
      code: languages.code,
      name: languages.name,
      nativeName: languages.nativeName,
    })
    .from(tracks)
    .innerJoin(languages, eq(languages.id, tracks.languageId))
    .where(eq(tracks.userId, userId))
    .orderBy(asc(tracks.createdAt))
}

/**
 * Jalur belajar yang sedang aktif.
 *
 * `preferredCode` datang dari cookie pilihan pengguna. Kalau kosong atau
 * menunjuk bahasa yang jalurnya sudah tidak ada, jatuh ke jalur pertama —
 * jangan pernah menampilkan halaman kosong hanya karena cookie basi.
 */
export async function resolveTrack(userId: string, preferredCode?: string | null) {
  const rows = await db
    .select({ track: tracks, language: languages })
    .from(tracks)
    .innerJoin(languages, eq(languages.id, tracks.languageId))
    .where(eq(tracks.userId, userId))
    .orderBy(asc(tracks.createdAt))

  if (rows.length === 0) return null
  return rows.find((r) => r.language.code === preferredCode) ?? rows[0]
}

export async function decideNext(
  userId: string,
  preferredCode?: string | null,
): Promise<NextStep> {
  const track = await resolveTrack(userId, preferredCode)

  if (!track) return { kind: 'onboard' }

  const summary = await queueSummary(userId, track.language.id)
  if (summary.total > 0) {
    return { kind: 'practice', languageCode: track.language.code, count: summary.total }
  }

  // Pelajaran berikutnya = posisi terkecil yang belum punya materi & item.
  const [next] = await db
    .select({ id: units.id, title: units.title, position: units.position, status: units.status })
    .from(units)
    .where(and(eq(units.userId, userId), eq(units.trackId, track.track.id), eq(units.status, 'planned')))
    .orderBy(asc(units.position))
    .limit(1)

  if (next) {
    return {
      kind: 'lesson',
      unitId: next.id,
      title: next.title,
      position: next.position,
      prepared: false,
    }
  }

  return { kind: 'done', languageName: track.language.name }
}

/** Progres jalur belajar untuk ditampilkan di dashboard */
export async function trackProgress(userId: string, preferredCode?: string | null) {
  const track = await resolveTrack(userId, preferredCode)

  if (!track) return null

  const lessons = await db
    .select({
      id: units.id,
      title: units.title,
      level: units.level,
      focus: units.focus,
      position: units.position,
      status: units.status,
      strand: units.strand,
    })
    .from(units)
    .where(and(eq(units.userId, userId), eq(units.trackId, track.track.id)))
    .orderBy(asc(units.position))

  const ready = lessons.filter((l) => l.status === 'ready').length

  return {
    track: track.track,
    language: track.language,
    lessons,
    ready,
    total: lessons.length,
  }
}
