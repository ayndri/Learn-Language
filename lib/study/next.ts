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
 */
export type NextStep =
  | { kind: 'onboard' }
  | { kind: 'practice'; languageCode: string; count: number }
  | { kind: 'lesson'; unitId: string; title: string; position: number; prepared: boolean }
  | { kind: 'done'; languageName: string }

export async function decideNext(userId: string): Promise<NextStep> {
  const [track] = await db
    .select({ track: tracks, language: languages })
    .from(tracks)
    .innerJoin(languages, eq(languages.id, tracks.languageId))
    .where(eq(tracks.userId, userId))
    .orderBy(asc(tracks.createdAt))
    .limit(1)

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
export async function trackProgress(userId: string) {
  const [track] = await db
    .select({ track: tracks, language: languages })
    .from(tracks)
    .innerJoin(languages, eq(languages.id, tracks.languageId))
    .where(eq(tracks.userId, userId))
    .orderBy(asc(tracks.createdAt))
    .limit(1)

  if (!track) return null

  const lessons = await db
    .select({
      id: units.id,
      title: units.title,
      level: units.level,
      focus: units.focus,
      position: units.position,
      status: units.status,
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
