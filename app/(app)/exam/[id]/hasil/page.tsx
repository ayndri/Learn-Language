import { and, asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { Celebrate } from '@/components/Celebrate'
import { db } from '@/lib/db'
import { examAnswers, examGroups, examQuestions, exams, languages } from '@/lib/db/schema'
import { examFormat } from '@/lib/exam/formats'
import { scoreBand, scoreExam } from '@/lib/exam/score'
import { MistakesToItems } from './MistakesToItems'

const LETTERS = ['A', 'B', 'C', 'D']

/**
 * Kenapa skornya cuma perkiraan — alasannya berbeda tiap ujian, dan itu bukan
 * detail sepele: yang membuat angka TOEFL tidak resmi (tabel konversi ETS yang
 * tidak diterbitkan) sama sekali bukan yang membuat angka JLPT tidak resmi
 * (penilaian IRT).
 *
 * Ditulis sebagai tabel per jenis penilaian, bukan rangkaian syarat, karena
 * sebelumnya format apa pun yang bukan JLPT mendapat keterangan TOEFL —
 * termasuk TOPIK, yang tidak ada hubungannya dengan ETS.
 */
const SCORE_NOTES: Record<string, string> = {
  toefl:
    'Hasil interpolasi dari titik-titik konversi yang umum diketahui, bukan konversi resmi ETS.',
  jlpt:
    'JLPT asli memakai 尺度得点 berbasis IRT: bobot tiap soal bergantung tingkat kesulitannya dan tidak pernah diterbitkan. Skor di sini proporsional terhadap jumlah benar, jadi "lulus" di sini berarti kemungkinan besar lulus, bukan lulus.',
  topik:
    'Tiap bagian dihitung proporsional terhadap jumlah benar, dan nilai 쓰기 diberikan AI dengan rubrik. Ambang tingkatnya (급) angka resmi, tapi angka yang dibandingkan dengannya perkiraan.',
  hsk:
    'HSK asli menyetarakan nilai antarsesi dengan cara yang tidak diterbitkan. Skor di sini proporsional terhadap jumlah benar, dan nilai 书写 diberikan AI dengan rubrik. Ambang lulusnya (60%) angka resmi, tapi angka yang dibandingkan dengannya perkiraan.',
  dele:
    'Bagian lisan (Prueba 4) tidak ada di simulasi ini, jadi Grupo 2 dipikul comprensión auditiva sendirian — "Apto" di sini berarti kemungkinan besar Apto kalau bagian lisanmu sepadan dengan bagian lainnya. Nilai expresión escrita diberikan AI dengan skala DELE. Ambang 30 per grupo angka resmi.',
}

export default async function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const { id } = await params

  const [row] = await db
    .select({ exam: exams, language: languages })
    .from(exams)
    .innerJoin(languages, eq(languages.id, exams.languageId))
    .where(and(eq(exams.id, id), eq(exams.userId, userId)))
    .limit(1)

  if (!row) notFound()
  const exam = row.exam
  const format = examFormat(exam.kind)
  const script = row.language.script
  if (exam.status !== 'done') redirect(`/exam/${id}`)

  const questions = await db
    .select()
    .from(examQuestions)
    .where(eq(examQuestions.examId, id))
    .orderBy(asc(examQuestions.position))

  const answers = await db
    .select()
    .from(examAnswers)
    .where(eq(examAnswers.examId, id))

  const groups = await db.select().from(examGroups).where(eq(examGroups.examId, id))
  const groupTitle = new Map(groups.map((g) => [g.id, g.title ?? g.kind]))

  const byQuestion = new Map(answers.map((a) => [a.questionId, a]))

  // POIN, bukan jumlah benar.
  //
  // Untuk pilihan ganda keduanya sama: satu benar = satu poin. Untuk soal
  // karangan (TOPIK 쓰기, HSK 书写) nilainya bisa 0–100 per soal, dan
  // menghitungnya sebagai "satu benar" akan membuat seluruh bagian menulis
  // nyaris tidak berpengaruh ke total.
  const correctBySection = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>
  for (const a of answers) {
    const q = questions.find((x) => x.id === a.questionId)
    if (!q) continue
    const earned = a.score ?? (a.isCorrect ? 1 : 0)
    correctBySection[q.section as 1 | 2 | 3] += earned
  }

  const score = scoreExam({
    kind: exam.kind,
    size: exam.size,
    correctBySection,
    answered: answers.filter((a) => a.chosen !== null).length,
  })
  const band = scoreBand(exam.kind, score)

  // Soal karangan tidak masuk daftar "salah": jawabannya bukan benar/salah,
  // dan pembahasannya berupa komentar penilai — ditampilkan terpisah di bawah.
  const writing = questions.filter((q) => q.answerIndex === null)
  const wrong = questions.filter((q) => {
    if (q.answerIndex === null) return false
    const a = byQuestion.get(q.id)
    return !a || !a.isCorrect
  })

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Hasil {format.short}</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            {exam.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'} ·{' '}
            {new Intl.DateTimeFormat('id-ID', {
              dateStyle: 'medium',
              timeZone: 'Asia/Jakarta',
            }).format(exam.createdAt)}
          </p>
        </div>
        <Link href="/exam" className="btn-ghost btn-sm shrink-0">
          ← Simulasi
        </Link>
      </div>

      {/* --- skor --- */}
      <section className="card animate-rise overflow-hidden">
        <div className="bg-brand-soft/70 px-5 py-6 text-center">
          <Celebrate />
          <p className="text-[13px] font-medium text-brand">Perkiraan skor</p>
          <p className="animate-pop mt-1 text-5xl font-bold tracking-tight">
            {score.total}
            <span className="ml-1 align-baseline text-base font-semibold text-muted">
              / {score.range[1]}
            </span>
          </p>
          {score.grade && (
            <p className="animate-pop mt-1 text-sm font-bold text-brand">
              setara {score.grade}
            </p>
          )}
          {score.passMark !== null && !score.grade && (
            <p className="mt-1 text-xs text-muted">batas lulus {score.passMark}</p>
          )}
          <p className="mt-1 text-sm font-semibold">{band.label}</p>
          <p className="mt-0.5 text-xs text-muted">{band.note}</p>
        </div>

        <ul className="divide-y divide-line">
          {score.sections.map((s) => {
            // Bagian yang tidak lolos batas minimumnya ditandai merah, bukan
            // dibiarkan menyatu. Di JLPT satu bagian di bawah minimum membuat
            // seluruh ujian tidak lulus sekalipun totalnya jauh di atas batas —
            // itu harus terlihat, bukan tersembunyi di dalam angka total.
            const below = s.passMin !== null && s.scaled < s.passMin
            return (
              <li key={s.label} className="px-5 py-3">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className={`min-w-0 truncate font-medium ${below ? 'text-bad' : ''}`}>
                    {s.label}
                  </span>
                  <span className="shrink-0">
                    <span className={`font-bold ${below ? 'text-bad' : ''}`}>{s.scaled}</span>
                    <span className="text-xs text-faint">/{s.max}</span>
                    <span className="ml-2 text-xs text-faint">
                      {s.correct}/{s.total} benar
                    </span>
                  </span>
                </div>
                <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full ${below ? 'bg-bad' : 'bg-brand'}`}
                    style={{ width: `${(s.correct / s.total) * 100}%` }}
                  />
                  {s.passMin !== null && (
                    <span
                      title={`batas minimum ${s.passMin}`}
                      className="absolute top-0 h-full w-0.5 bg-ink/40"
                      style={{ left: `${(s.passMin / s.max) * 100}%` }}
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-line bg-canvas/60 px-5 py-3 text-xs text-muted">
          {score.correct} benar dari {score.questions} soal · {score.answered} dijawab.{' '}
          <strong>Angka skor ini perkiraan.</strong>{' '}
          {SCORE_NOTES[format.scoring.type]}{' '}
          Pakai untuk melihat kemajuan, jangan untuk mengklaim skor.
        </div>
      </section>

      {/* --- karangan: nilai + komentar penilai --- */}
      {writing.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
            Karangan · {writing.length} soal
          </h2>
          <ul className="space-y-2.5">
            {writing.map((q) => {
              const a = byQuestion.get(q.id)
              const max = q.maxScore ?? 10
              return (
                <li key={q.id} className="card space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="badge bg-canvas text-faint">
                      Soal {questions.findIndex((x) => x.id === q.id) + 1}
                    </span>
                    <span className="shrink-0 text-sm font-bold">
                      {a?.score ?? 0}
                      <span className="text-xs font-medium text-faint">/{max}</span>
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed whitespace-pre-line script-${script}`}>
                    {q.stem}
                  </p>

                  {a?.textAnswer ? (
                    <p
                      className={`rounded-2xl bg-canvas px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-line script-${script}`}
                    >
                      {a.textAnswer}
                    </p>
                  ) : (
                    <p className="text-xs text-faint">Tidak kamu jawab.</p>
                  )}

                  {a?.feedbackId && (
                    <p className="rounded-2xl bg-brand-soft px-3 py-2 text-[13px] leading-relaxed text-brand">
                      {a.feedbackId}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="px-1 text-xs text-faint">
            Nilai karangan diberikan AI dengan {format.writing?.rubric ?? 'rubrik resmi ujiannya'}.
            Ini bagian yang paling tidak bisa dipercaya sebagai angka — penilai manusia pun berbeda
            pada tulisan yang sama. Yang berguna komentarnya.
          </p>
        </section>
      )}

      <MistakesToItems examId={id} wrongCount={wrong.length} />

      {/* --- pembahasan yang salah --- */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
          Pembahasan · {wrong.length} soal belum tepat
        </h2>

        {wrong.length === 0 ? (
          <p className="card-dashed text-center">Semua benar. Serius.</p>
        ) : (
          <ul className="space-y-2.5">
            {wrong.map((q) => {
              const a = byQuestion.get(q.id)
              const chosen = a?.chosen ?? null
              const pos = questions.findIndex((x) => x.id === q.id) + 1
              return (
                <li key={q.id} className="card space-y-3 p-4">
                  <div className="flex items-center gap-2 text-xs text-faint">
                    <span className="badge bg-canvas text-faint">Soal {pos}</span>
                    <span>
                      S{q.section} Part {q.part}
                    </span>
                    {q.groupId && <span>· {groupTitle.get(q.groupId)}</span>}
                  </div>

                  {q.audioScript && (
                    <p
                      className={`rounded-2xl bg-canvas px-3 py-2 text-[13px] whitespace-pre-line text-muted script-${script}`}
                    >
                      {q.audioScript}
                    </p>
                  )}

                  <p className={`text-sm leading-relaxed whitespace-pre-line script-${script}`}>
                    {q.stem}
                  </p>

                  <ul className="space-y-1.5 text-[13px]">
                    {q.options.map((opt, i) => {
                      const isAnswer = q.answerIndex !== null && i === q.answerIndex
                      const isChosen = i === chosen
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-2 rounded-xl px-2.5 py-1.5 ${
                            isAnswer
                              ? 'bg-good-soft text-good'
                              : isChosen
                                ? 'bg-bad-soft text-bad'
                                : 'text-muted'
                          }`}
                        >
                          <span className="font-bold">{LETTERS[i]}</span>
                          <span className={`min-w-0 script-${script}`}>{opt}</span>
                          {isAnswer && <span className="ml-auto shrink-0 text-xs">benar</span>}
                          {isChosen && !isAnswer && (
                            <span className="ml-auto shrink-0 text-xs">pilihanmu</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>

                  {chosen === null && (
                    <p className="text-xs text-faint">Soal ini tidak kamu jawab.</p>
                  )}

                  <p className="rounded-2xl bg-brand-soft px-3 py-2 text-[13px] text-brand">
                    {q.explanationId}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="flex gap-2">
        <Link href="/exam" className="btn-outline btn-sm flex-1">
          Simulasi lain
        </Link>
        <Link href="/" className="btn-primary btn-sm flex-1">
          Kembali belajar
        </Link>
      </div>
    </main>
  )
}
