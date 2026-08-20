import { and, asc, count, eq, gte, lte, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { itemStates, items, reviewLogs } from '@/lib/db/schema'
import { studyDayStart } from '@/lib/srs/day'

/**
 * Batas item BARU per hari.
 *
 * Ini bukan pembatasan sewenang-wenang — ini yang menjaga app-nya tetap dipakai.
 * Tanpa batas, satu pelajaran baru bisa melempar 20 item sekaligus dan besoknya
 * menumpuk jadi ratusan. Item yang sudah pernah dilihat tidak dibatasi.
 */
export const NEW_PER_DAY = 30
export const MAX_REVIEWS_PER_SESSION = 60

export type QueueRow = {
  id: string
  type: string
  fields: unknown
}

/**
 * Sisa kuota item baru untuk hari belajar ini.
 *
 * `stateBefore = 0` menandai review PERTAMA sebuah item — jadi menghitungnya
 * sama dengan menghitung berapa item baru yang sudah diperkenalkan hari ini.
 */
async function newAllowance(userId: string, now: Date): Promise<number> {
  const [{ introduced }] = await db
    .select({ introduced: count() })
    .from(reviewLogs)
    .where(
      and(
        eq(reviewLogs.userId, userId),
        eq(reviewLogs.stateBefore, 0),
        gte(reviewLogs.reviewedAt, studyDayStart(now)),
      ),
    )
  return Math.max(0, NEW_PER_DAY - Number(introduced))
}

/**
 * Antrean latihan untuk satu bahasa: review dulu, baru item baru sebanyak sisa kuota.
 *
 * SATU-SATUNYA sumber kebenaran soal "apa yang harus dilatih sekarang".
 * Dashboard memakai `queueSummary` yang berbagi aturan yang sama — kalau dashboard
 * menghitung sendiri, angkanya akan berbeda dari isi sesi latihan dan itu
 * membingungkan ("katanya 15, kok kosong?").
 */
export async function buildQueue(userId: string, languageId: string, now = new Date()) {
  const reviewRows = await db
    .select({ id: items.id, type: items.type, fields: items.fields })
    .from(itemStates)
    .innerJoin(items, eq(items.id, itemStates.itemId))
    .where(
      and(
        eq(itemStates.userId, userId),
        eq(items.languageId, languageId),
        lte(itemStates.due, now),
        ne(itemStates.state, 0),
      ),
    )
    .orderBy(asc(itemStates.due))
    .limit(MAX_REVIEWS_PER_SESSION)

  const allowance = await newAllowance(userId, now)
  const newRows = allowance
    ? await db
        .select({ id: items.id, type: items.type, fields: items.fields })
        .from(itemStates)
        .innerJoin(items, eq(items.id, itemStates.itemId))
        .where(
          and(
            eq(itemStates.userId, userId),
            eq(items.languageId, languageId),
            eq(itemStates.state, 0),
          ),
        )
        .orderBy(asc(itemStates.due))
        .limit(allowance)
    : []

  return { rows: [...reviewRows, ...newRows], allowance }
}

/** Jumlah saja — untuk dashboard. Aturannya identik dengan `buildQueue`. */
export async function queueSummary(userId: string, languageId: string, now = new Date()) {
  const [[review], allowance] = await Promise.all([
    db
      .select({ n: count() })
      .from(itemStates)
      .innerJoin(items, eq(items.id, itemStates.itemId))
      .where(
        and(
          eq(itemStates.userId, userId),
          eq(items.languageId, languageId),
          lte(itemStates.due, now),
          ne(itemStates.state, 0),
        ),
      ),
    newAllowance(userId, now),
  ])

  const [fresh] = allowance
    ? await db
        .select({ n: count() })
        .from(itemStates)
        .innerJoin(items, eq(items.id, itemStates.itemId))
        .where(
          and(
            eq(itemStates.userId, userId),
            eq(items.languageId, languageId),
            eq(itemStates.state, 0),
          ),
        )
    : [{ n: 0 }]

  const reviewDue = Math.min(Number(review.n), MAX_REVIEWS_PER_SESSION)
  const newDue = Math.min(Number(fresh.n), allowance)

  return { reviewDue, newDue, total: reviewDue + newDue, allowance }
}
