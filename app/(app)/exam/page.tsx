import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { exams, languages } from '@/lib/db/schema'
import { countsBySection, questionCount, sectionMinutes, totalMinutes } from '@/lib/exam/blueprint'
import { examFormat, formatsForLanguages, type ExamSection } from '@/lib/exam/formats'
import { CreateExam, type FormatChoice } from './CreateExam'

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  planned: { text: 'belum disiapkan', cls: 'bg-warn-soft text-warn' },
  ready: { text: 'siap dikerjakan', cls: 'bg-brand-soft text-brand' },
  in_progress: { text: 'sedang dikerjakan', cls: 'bg-sun-soft text-sun' },
  done: { text: 'selesai', cls: 'bg-good-soft text-good' },
}

export default async function ExamListPage() {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const rows = await db
    .select()
    .from(exams)
    .where(eq(exams.userId, userId))
    .orderBy(desc(exams.createdAt))
    .limit(20)

  // Hanya format untuk bahasa yang sudah diaktifkan. Menawarkan simulasi JLPT
  // saat bahasa Jepang masih mati cuma menghasilkan pesan error setelah diklik.
  const enabled = await db
    .select({ code: languages.code })
    .from(languages)
    .where(eq(languages.enabled, true))

  const choices: FormatChoice[] = formatsForLanguages(enabled.map((l) => l.code)).map((f) => {
    const counts = countsBySection(f.id, 'full')
    return {
      id: f.id,
      label: f.label,
      note: f.note,
      sections: ([1, 2, 3] as ExamSection[])
        .filter((s) => counts[s] > 0)
        .map((s) => ({
          name: f.sections[s],
          questions: counts[s],
          minutes: sectionMinutes(f.id, s, 'full'),
        })),
      sizes: (['full', 'short'] as const).map((size) => ({
        size,
        questions: questionCount(f.id, size),
        minutes: totalMinutes(f.id, size),
      })),
    }
  })

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Simulasi ujian</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Soalnya dibuat baru tiap kali, jadi tidak bisa dihafal.
          </p>
        </div>
        <Link href="/" className="btn-ghost btn-sm shrink-0">
          ← Dashboard
        </Link>
      </div>

      <CreateExam formats={choices} />

      <section className="space-y-3">
        <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">Riwayat</h2>

        {rows.length === 0 ? (
          <p className="card-dashed">Belum ada simulasi. Bikin yang pertama di atas.</p>
        ) : (
          <ul className="card divide-y divide-line overflow-hidden">
            {rows.map((e) => {
              const st = STATUS_LABEL[e.status] ?? STATUS_LABEL.planned
              const format = examFormat(e.kind)
              return (
                <li key={e.id}>
                  <Link
                    href={e.status === 'done' ? `/exam/${e.id}/hasil` : `/exam/${e.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-canvas"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {format.short} ·{' '}
                        {e.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'}
                        <span className="ml-1.5 text-xs font-normal text-faint">
                          {questionCount(e.kind, e.size)} soal
                        </span>
                      </span>
                      <span className="block text-xs text-faint">
                        {new Intl.DateTimeFormat('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Asia/Jakarta',
                        }).format(e.createdAt)}
                      </span>
                    </span>
                    <span className={`badge shrink-0 ${st.cls}`}>{st.text}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
