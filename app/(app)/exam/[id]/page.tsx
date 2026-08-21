import { and, asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { examAnswers, examGroups, examQuestions, exams, languages } from '@/lib/db/schema'
import { countsBySection, questionCount, sectionMinutes } from '@/lib/exam/blueprint'
import { examFormat } from '@/lib/exam/formats'
import { examSteps } from '@/lib/exam/plan'
import { ExamRunner, type RunnerQuestion } from './ExamRunner'
import { PrepareExam } from './PrepareExam'
import { StartExam } from './StartExam'

/**
 * Batas durasi fungsi serverless.
 *
 * Default Vercel 10 detik, dan itu TIDAK cukup: satu panggilan Gemini butuh
 * 5-15 detik, dan koreksi tulisan bisa lebih. Tanpa ini, penyiapan pelajaran
 * dan generate soal akan gagal di produksi padahal jalan mulus di lokal.
 *
 * Server action mewarisi konfigurasi dari route tempat ia dipanggil, jadi
 * nilainya diset di halamannya, bukan di file action.
 */
export const maxDuration = 60

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

  const format = examFormat(row.exam.kind)
  const kind = row.exam.kind

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          {row.exam.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'}
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">
          {format.label} · {questionCount(kind, row.exam.size)} soal
        </p>
      </div>
      <Link href="/exam" className="btn-ghost btn-sm shrink-0">
        ← Simulasi
      </Link>
    </div>
  )

  // --- belum ada soal → susun sekarang ---
  if (row.exam.status === 'planned') {
    const steps = examSteps(kind, row.exam.size).map((s) => ({
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
          totalQuestions={questionCount(kind, row.exam.size)}
        />
      </main>
    )
  }

  const counts = countsBySection(kind, row.exam.size)

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
              name: format.sections[s],
              planned: counts[s],
              actual: actual[s] ?? 0,
              minutes: sectionMinutes(kind, s, row.exam.size),
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
      maxScore: examQuestions.maxScore,
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
    .select({
      questionId: examAnswers.questionId,
      chosen: examAnswers.chosen,
      textAnswer: examAnswers.textAnswer,
    })
    .from(examAnswers)
    .where(eq(examAnswers.examId, id))

  const startedAt = (row.exam.startedAt ?? new Date()).getTime()
  // Batas waktu tiap seksi bersifat kumulatif dari waktu mulai. Tidak ada state
  // timer yang disimpan — cukup satu timestamp, jadi menutup tab tidak mereset jam.
  let acc = startedAt
  const deadlines: Record<number, number> = {}
  for (const sec of [1, 2, 3] as const) {
    if (counts[sec] === 0) continue
    acc += sectionMinutes(kind, sec, row.exam.size) * 60_000
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
        sectionNames={format.sections}
        // Seksi mana yang berisi soal menyimak berbeda tiap format: di TOEFL
        // seksi 1, di JLPT seksi 3. Dulu ini diasumsikan selalu 1, dan itu
        // membuat bacaan JLPT diperlakukan sebagai rekaman.
        listeningSection={format.listeningSection}
        script={row.language.script}
        languageName={row.language.name}
        writing={format.writing}
        initialAnswers={Object.fromEntries(
          saved.filter((s) => s.chosen !== null).map((s) => [s.questionId, s.chosen as number]),
        )}
        initialTexts={Object.fromEntries(
          saved.filter((s) => s.textAnswer).map((s) => [s.questionId, s.textAnswer as string]),
        )}
      />
    </main>
  )
}
