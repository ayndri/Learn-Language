import { and, asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { Celebrate } from '@/components/Celebrate'
import { db } from '@/lib/db'
import { examAnswers, examGroups, examQuestions, exams } from '@/lib/db/schema'
import { SECTION_NAMES } from '@/lib/exam/blueprint'
import { scoreBand, scoreExam } from '@/lib/exam/score'
import { MistakesToItems } from './MistakesToItems'

const LETTERS = ['A', 'B', 'C', 'D']

export default async function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const { id } = await params

  const [exam] = await db
    .select()
    .from(exams)
    .where(and(eq(exams.id, id), eq(exams.userId, userId)))
    .limit(1)

  if (!exam) notFound()
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

  const correctBySection = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>
  for (const a of answers) {
    if (!a.isCorrect) continue
    const q = questions.find((x) => x.id === a.questionId)
    if (q) correctBySection[q.section as 1 | 2 | 3]++
  }

  const score = scoreExam({
    size: exam.size,
    correctBySection,
    answered: answers.filter((a) => a.chosen !== null).length,
  })
  const band = scoreBand(score.total)

  const wrong = questions.filter((q) => {
    const a = byQuestion.get(q.id)
    return !a || !a.isCorrect
  })

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Hasil simulasi</h1>
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
          <p className="animate-pop mt-1 text-5xl font-bold tracking-tight">{score.total}</p>
          <p className="mt-1 text-sm font-semibold">{band.label}</p>
          <p className="mt-0.5 text-xs text-muted">{band.note}</p>
        </div>

        <ul className="divide-y divide-line">
          {score.sections.map((s) => (
            <li key={s.section} className="px-5 py-3">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium">
                  {s.section} · {SECTION_NAMES[s.section]}
                </span>
                <span className="shrink-0">
                  <span className="font-bold">{s.scaled}</span>
                  <span className="ml-2 text-xs text-faint">
                    {s.correct}/{s.total} benar
                  </span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${(s.correct / s.total) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-line bg-canvas/60 px-5 py-3 text-xs text-muted">
          {score.correct} benar dari {score.questions} soal · {score.answered} dijawab.{' '}
          <strong>Angka skor ini perkiraan</strong>, hasil interpolasi dari titik-titik konversi
          yang umum diketahui — bukan konversi resmi ETS. Pakai untuk melihat kemajuan, jangan
          untuk mengklaim skor.
        </div>
      </section>

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
                    <p className="rounded-2xl bg-canvas px-3 py-2 text-[13px] whitespace-pre-line text-muted">
                      {q.audioScript}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-line">{q.stem}</p>

                  <ul className="space-y-1.5 text-[13px]">
                    {q.options.map((opt, i) => {
                      const isAnswer = i === q.answerIndex
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
                          <span className="min-w-0">{opt}</span>
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
