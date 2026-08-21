/**
 * Migrasi: dukungan soal karangan (쓰기) di simulasi ujian.
 *
 *   npm run db:add-exam-writing
 *
 * TOPIK II menilai 쓰기 sepertiga dari total nilainya, dan jawabannya karangan —
 * bukan pilihan ganda. Sampai sebelum ini, seluruh tabel ujian mengasumsikan
 * tiap soal punya `answer_index`. Tiga hal yang berubah:
 *
 *   answer_index  boleh NULL   soal karangan tidak punya kunci
 *   max_score     kolom baru   bobot soal (쓰기: 10, 10, 30, 50 poin)
 *   text_answer, score, feedback_id  jawaban karangan + penilaian AI
 *
 * Aman dijalankan berulang.
 */
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

async function main() {
  await db.execute(sql`ALTER TABLE "exam_questions" ALTER COLUMN "answer_index" DROP NOT NULL`)
  console.log('✓ exam_questions.answer_index boleh null')

  await db.execute(sql`ALTER TABLE "exam_questions" ADD COLUMN IF NOT EXISTS "max_score" smallint`)
  console.log('✓ exam_questions.max_score')

  for (const [col, type] of [
    ['text_answer', 'text'],
    ['score', 'smallint'],
    ['feedback_id', 'text'],
  ]) {
    await db.execute(
      sql`ALTER TABLE "exam_answers" ADD COLUMN IF NOT EXISTS ${sql.raw(`"${col}" ${type}`)}`,
    )
    console.log(`✓ exam_answers.${col}`)
  }

  console.log('\nSelesai.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
