import { and, asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { examAnswers, examGroups, examQuestions, exams, languages } from '@/lib/db/schema'
import {
  SECTION_NAMES,
  countsBySection,
  questionCount,
  sectionMinutes,
} from '@/lib/exam/blueprint'
import { examSteps } from '@/lib/exam/plan'
import { ExamRunner, type RunnerQuestion } from './ExamRunner'
import { PrepareExam } from './PrepareExam'
import { StartExam } from './StartExam'

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
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
  if (row.exam.status === 'done') redirect(`/exam/${id}/hasil`)

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          {row.exam.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'}
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">
          TOEFL ITP · {questionCount(row.exam.size)} soal
        </p>
      </div>
      <Link href="/exam" className="btn-ghost btn-sm shrink-0">
        ← Simulasi
      </Link>
    </div>
  )

  // --- belum ada soal → susun sekarang ---
  if (row.exam.status === 'planned') {
    const steps = examSteps(row.exam.size).map((s) => ({
      key: s.key,
      label: s.label,
      section: s.section,
      count: s.count,
    }))
    return (
      <main className="space-y-5">
        {header}
        <PrepareExam
          examId={id}
          steps={steps}
          totalQuestions={questionCount(row.exam.size)}
        />
      </main>
    )
  }

  const counts = countsBySection(row.exam.size)

  // --- siap, belum dimulai → halaman pembuka ---
  if (row.exam.status === 'ready') {
    const all = await db
      .select({ section: examQuestions.section })
      .from(examQuestions)
      .where(eq(examQuestions.examId, id))

    const actual = all.reduce<Record<number, number>>(
      (a, q) => ({ ...a, [q.section]: (a[q.section] ?? 0) + 1 }),
      {},
    )

    return (
      <main className="space-y-5">
        {header}
        <StartExam
          examId={id}
          total={all.length}
          sections={([1, 2, 3] as const)
            .filter((s) => counts[s] > 0)
            .map((s) => ({
              section: s,
              name: SECTION_NAMES[s],
              planned: counts[s],
              actual: actual[s] ?? 0,
              minutes: sectionMinutes(s, row.exam.size),
            }))}
        />
      </main>
    )
  }

  // --- sedang dikerjakan → jalankan ---
  const questions = await db
    .select({
      id: examQuestions.id,
      section: examQuestions.section,
      part: examQuestions.part,
      type: examQuestions.type,
      audioScript: examQuestions.audioScript,
      stem: examQuestions.stem,
      options: examQuestions.options,
      groupId: examQuestions.groupId,
      // `answerIndex` dan `explanationId` SENGAJA tidak diambil: selama ujian
      // berjalan, kunci jawaban tidak boleh sampai ke browser.
    })
    .from(examQuestions)
    .where(eq(examQuestions.examId, id))
    .orderBy(asc(examQuestions.position))

  const groups = await db
    .select({
      id: examGroups.id,
      kind: examGroups.kind,
      title: examGroups.title,
      body: examGroups.body,
    })
    .from(examGroups)
    .where(eq(examGroups.examId, id))

  const saved = await db
    .select({ questionId: examAnswers.questionId, chosen: examAnswers.chosen })
    .from(examAnswers)
    .where(eq(examAnswers.examId, id))

  const startedAt = (row.exam.startedAt ?? new Date()).getTime()
  // Batas waktu tiap seksi bersifat kumulatif dari waktu mulai. Tidak ada state
  // timer yang disimpan — cukup satu timestamp, jadi menutup tab tidak mereset jam.
  let acc = startedAt
  const deadlines: Record<number, number> = {}
  for (const sec of [1, 2, 3] as const) {
    if (counts[sec] === 0) continue
    acc += sectionMinutes(sec, row.exam.size) * 60_000
    deadlines[sec] = acc
  }

  return (
    <main>
      <ExamRunner
        examId={id}
        ttsLang={row.language.ttsLang}
        questions={questions as RunnerQuestion[]}
        groups={groups}
        deadlines={deadlines}
        sectionNames={SECTION_NAMES}
        initialAnswers={Object.fromEntries(
          saved.filter((s) => s.chosen !== null).map((s) => [s.questionId, s.chosen as number]),
        )}
      />
    </main>
  )
}
