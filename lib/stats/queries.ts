import { and, asc, eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { exams } from '@/lib/db/schema'
import { scoreExam } from '@/lib/exam/score'
import { DAY_START_HOUR, TIME_ZONE } from '@/lib/srs/day'

/**
 * Statistik dari data yang SUDAH lama dikumpulkan tapi belum pernah dibaca.
 *
 * `items.tags` (dengan GIN index), `review_logs.was_correct`, dan
 * `review_logs.duration_ms` semuanya ditulis sejak awal, tapi satu-satunya yang
 * membacanya cuma penghitung streak. Artinya app-nya sudah tahu pola grammar mana
 * yang paling sering salah — cuma belum pernah memberitahu.
 *
 * Catatan soal "benar": item yang dinilai sendiri (`vocab`, `phrase`) tidak punya
 * `was_correct`, jadi dipakai `rating >= 3` (Bisa/Gampang) sebagai penggantinya.
 * Tanpa itu, separuh riwayat latihan tidak ikut terhitung.
 */

const CORRECT_EXPR = sql`coalesce(rl.was_correct, rl.rating >= 3)`

type Row = Record<string, unknown>

async function rows(query: ReturnType<typeof sql>): Promise<Row[]> {
  const res = (await db.execute(query)) as unknown
  // Driver neon-http mengembalikan { rows }, driver lain mengembalikan array.
  if (Array.isArray(res)) return res as Row[]
  return ((res as { rows?: Row[] }).rows ?? []) as Row[]
}

export type TagStat = {
  tag: string
  label: string
  total: number
  correct: number
  accuracy: number
}

/**
 * Ketepatan per tag, diurutkan dari yang paling lemah.
 *
 * Minimal 3 kali dijawab supaya satu kesalahan kebetulan tidak langsung tampil
 * sebagai "kelemahan terbesar".
 */
export async function weakestTags(userId: string, prefix = 'grammar:'): Promise<TagStat[]> {
  const data = await rows(sql`
    SELECT tag,
           count(*)::int AS total,
           count(*) FILTER (WHERE ${CORRECT_EXPR})::int AS correct
    FROM review_logs rl
    JOIN items i ON i.id = rl.item_id
    CROSS JOIN LATERAL unnest(i.tags) AS tag
    WHERE rl.user_id = ${userId}
      AND tag LIKE ${prefix + '%'}
    GROUP BY tag
    HAVING count(*) >= 3
    ORDER BY (count(*) FILTER (WHERE ${CORRECT_EXPR}))::float / count(*) ASC, count(*) DESC
    LIMIT 12
  `)

  return data.map((r) => {
    const tag = String(r.tag)
    const total = Number(r.total)
    const correct = Number(r.correct)
    return {
      tag,
      label: tag.slice(prefix.length),
      total,
      correct,
      accuracy: total ? correct / total : 0,
    }
  })
}

export type TypeStat = { type: string; total: number; correct: number; accuracy: number }

/** Ketepatan per jenis latihan — menunjukkan keterampilan mana yang tertinggal */
export async function accuracyByType(userId: string): Promise<TypeStat[]> {
  const data = await rows(sql`
    SELECT i.type,
           count(*)::int AS total,
           count(*) FILTER (WHERE ${CORRECT_EXPR})::int AS correct
    FROM review_logs rl
    JOIN items i ON i.id = rl.item_id
    WHERE rl.user_id = ${userId}
    GROUP BY i.type
    ORDER BY count(*) DESC
  `)

  return data.map((r) => {
    const total = Number(r.total)
    const correct = Number(r.correct)
    return { type: String(r.type), total, correct, accuracy: total ? correct / total : 0 }
  })
}

export type DayStat = { day: string; reviews: number; correct: number }

/**
 * Aktivitas harian.
 *
 * Batas harinya sama dengan yang dipakai streak — zona Asia/Jakarta, hari baru
 * mulai jam 04:00. Kalau di sini pakai UTC, grafiknya akan bercerita lain
 * daripada angka streak di dashboard, dan salah satunya pasti salah.
 */
export async function dailyActivity(userId: string, days = 30): Promise<DayStat[]> {
  const data = await rows(sql`
    SELECT to_char(
             ((rl.reviewed_at AT TIME ZONE ${TIME_ZONE})
               - (${DAY_START_HOUR} * interval '1 hour'))::date,
             'YYYY-MM-DD'
           ) AS day,
           count(*)::int AS reviews,
           count(*) FILTER (WHERE ${CORRECT_EXPR})::int AS correct
    FROM review_logs rl
    WHERE rl.user_id = ${userId}
      AND rl.reviewed_at > now() - (${days} * interval '1 day')
    GROUP BY 1
    ORDER BY 1
  `)

  return data.map((r) => ({
    day: String(r.day),
    reviews: Number(r.reviews),
    correct: Number(r.correct),
  }))
}

export type ExamPoint = {
  id: string
  date: Date
  size: 'full' | 'short'
  total: number
  sections: { section: number; scaled: number }[]
}

/** Tren skor simulasi — riwayatnya sudah tersimpan, cuma belum pernah dibaca */
export async function examTrend(userId: string): Promise<ExamPoint[]> {
  const done = await db
    .select({ id: exams.id, createdAt: exams.createdAt, size: exams.size })
    .from(exams)
    .where(and(eq(exams.userId, userId), eq(exams.status, 'done')))
    .orderBy(asc(exams.createdAt))

  if (done.length === 0) return []

  const out: ExamPoint[] = []
  for (const e of done) {
    const per = await rows(sql`
      SELECT q.section::int AS section,
             count(*) FILTER (WHERE a.is_correct)::int AS correct,
             count(a.question_id)::int AS answered
      FROM exam_questions q
      LEFT JOIN exam_answers a ON a.question_id = q.id
      WHERE q.exam_id = ${e.id}
      GROUP BY q.section
    `)

    const correctBySection = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>
    let answered = 0
    for (const r of per) {
      correctBySection[Number(r.section) as 1 | 2 | 3] = Number(r.correct)
      answered += Number(r.answered)
    }

    const score = scoreExam({ size: e.size, correctBySection, answered })
    out.push({
      id: e.id,
      date: e.createdAt,
      size: e.size,
      total: score.total,
      sections: score.sections.map((s) => ({ section: s.section, scaled: s.scaled })),
    })
  }
  return out
}

export type Totals = { reviews: number; items: number; avgSeconds: number }

export async function totals(userId: string): Promise<Totals> {
  const [r] = await rows(sql`
    SELECT count(*)::int AS reviews,
           count(DISTINCT rl.item_id)::int AS items,
           coalesce(avg(rl.duration_ms), 0)::float AS avg_ms
    FROM review_logs rl
    WHERE rl.user_id = ${userId}
  `)
  return {
    reviews: Number(r?.reviews ?? 0),
    items: Number(r?.items ?? 0),
    avgSeconds: Number(r?.avg_ms ?? 0) / 1000,
  }
}
