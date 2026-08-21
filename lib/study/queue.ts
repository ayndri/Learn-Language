import { and, asc, count, eq, gte, lte, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { itemStates, items, reviewLogs } from '@/lib/db/schema'
import { studyDayStart } from '@/lib/srs/day'

/**
 * Batas item BARU per hari — DUA batas, dan keduanya perlu.
 *
 * Ini bukan pembatasan sewenang-wenang: ini yang menjaga app-nya tetap dipakai.
 * Tanpa batas, satu pelajaran baru bisa melempar 20 item sekaligus dan besoknya
 * menumpuk jadi ratusan. Item yang sudah pernah dilihat tidak dibatasi.
 *
 * `NEW_PER_DAY` adalah pagu TOTAL lintas semua bahasa, karena yang punya batas
 * sebenarnya adalah kepalamu — bukan bahasanya. Tiga puluh kartu baru sehari
 * sudah banyak, mau itu semuanya Mandarin atau tersebar di lima bahasa.
 *
 * `NEW_PER_LANGUAGE_PER_DAY` ada karena pagu total SENDIRIAN ternyata tidak
 * cukup, dan ini baru kelihatan setelah ada lima bahasa aktif: kalau cuma ada
 * pagu total, bahasa yang kamu buka PERTAMA menghabiskan seluruh kuota hari itu,
 * dan empat bahasa lain dapat nol. Bukan karena kamu memilih begitu — cuma
 * karena urutan membuka aplikasi. Jalur yang paling serius dikerjakan justru
 * yang paling sering jadi korban, karena dialah yang punya paling banyak item
 * siap.
 *
 * Angkanya dipilih supaya keduanya masuk akal bersamaan: fokus ke satu bahasa
 * tetap dapat 12 kartu baru, dua bahasa 24, dan dari tiga bahasa ke atas pagu
 * totallah yang berlaku.
 */
export const NEW_PER_DAY = 30
export const NEW_PER_LANGUAGE_PER_DAY = 12
export const MAX_REVIEWS_PER_SESSION = 60

export type QueueRow = {
  id: string
  type: string
  fields: unknown
}

/**
 * Sisa kuota item baru untuk hari belajar ini — yang paling kecil di antara
 * pagu total dan pagu bahasa ini.
 *
 * `stateBefore = 0` menandai review PERTAMA sebuah item — jadi menghitungnya
 * sama dengan menghitung berapa item baru yang sudah diperkenalkan hari ini.
 *
 * Hitungan per bahasa lewat join ke `items`, karena `review_logs` sengaja tidak
 * menyimpan `language_id`: bahasa sebuah item tidak pernah berubah, jadi
 * menyalinnya ke setiap baris log cuma menciptakan dua sumber kebenaran.
 */
async function newAllowance(userId: string, languageId: string, now: Date): Promise<number> {
  const dayStart = studyDayStart(now)

  const [[all], [here]] = await Promise.all([
    db
      .select({ n: count() })
      .from(reviewLogs)
      .where(
        and(
          eq(reviewLogs.userId, userId),
          eq(reviewLogs.stateBefore, 0),
          gte(reviewLogs.reviewedAt, dayStart),
        ),
      ),
    db
      .select({ n: count() })
      .from(reviewLogs)
      .innerJoin(items, eq(items.id, reviewLogs.itemId))
      .where(
        and(
          eq(reviewLogs.userId, userId),
          eq(items.languageId, languageId),
          eq(reviewLogs.stateBefore, 0),
          gte(reviewLogs.reviewedAt, dayStart),
        ),
      ),
  ])

  return Math.max(
    0,
    Math.min(NEW_PER_DAY - Number(all.n), NEW_PER_LANGUAGE_PER_DAY - Number(here.n)),
  )
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
    .select({ id: items.id, type: items.type, fields: items.fields, unitId: items.unitId })
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

  const allowance = await newAllowance(userId, languageId, now)
  const newRows = allowance
    ? await db
        .select({ id: items.id, type: items.type, fields: items.fields, unitId: items.unitId })
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
    newAllowance(userId, languageId, now),
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

/**
 * Jumlah kartu jatuh tempo untuk SETIAP bahasa sekaligus, dalam satu query.
 *
 * Ini menutup lubang yang cuma muncul kalau seseorang punya beberapa jalur:
 * dashboard hanya menampilkan satu bahasa, jadi jalur yang tidak sedang dibuka
 * bisa menumpuk puluhan kartu terlambat TANPA satu pun tanda di layar. Kamu baru
 * tahu waktu kebetulan mengklik bahasa itu — dan pada saat itu tumpukannya sudah
 * cukup besar untuk membuatmu menyerah, yang persis kebalikan dari tujuan SRS.
 *
 * Yang dihitung REVIEW saja, bukan item baru, dan itu keputusan sadar: item baru
 * dibatasi kuota dan selalu ada sisanya di jalur yang panjang, jadi angkanya
 * tidak pernah nol dan berhenti berarti apa-apa. Kartu terlambat berbeda —
 * angkanya nol kalau kamu rajin, dan membengkak kalau tidak. Itu yang layak
 * ditampilkan.
 *
 * Satu query dengan `group by`, bukan satu query per bahasa: yang memanggilnya
 * dashboard, dan dashboard sudah punya cukup banyak query.
 */
export async function dueByLanguage(
  userId: string,
  now = new Date(),
): Promise<Map<string, number>> {
  const rows = await db
    .select({ languageId: items.languageId, n: count() })
    .from(itemStates)
    .innerJoin(items, eq(items.id, itemStates.itemId))
    .where(
      and(eq(itemStates.userId, userId), lte(itemStates.due, now), ne(itemStates.state, 0)),
    )
    .groupBy(items.languageId)

  return new Map(rows.map((r) => [r.languageId, Number(r.n)]))
}
