import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { exams } from '@/lib/db/schema'
import { SECTION_MINUTES, questionCount } from '@/lib/exam/blueprint'
import { CreateExam } from './CreateExam'

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

  const totalMinutes = SECTION_MINUTES[1] + SECTION_MINUTES[2] + SECTION_MINUTES[3]

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Simulasi TOEFL ITP</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Soalnya dibuat baru tiap kali, jadi tidak bisa dihafal.
          </p>
        </div>
        <Link href="/" className="btn-ghost btn-sm shrink-0">
          ← Dashboard
        </Link>
      </div>

      <section className="card overflow-hidden">
        <div className="bg-brand-soft/70 px-5 py-4">
          <p className="text-sm font-bold">Struktur tes aslinya</p>
          <p className="mt-0.5 text-[13px] text-brand">
            {questionCount('full')} soal · ±{totalMinutes} menit
          </p>
        </div>
        <ul className="divide-y divide-line text-sm">
          <li className="flex items-center justify-between px-5 py-2.5">
            <span>1 · Listening Comprehension</span>
            <span className="text-faint">50 soal · {SECTION_MINUTES[1]} mnt</span>
          </li>
          <li className="flex items-center justify-between px-5 py-2.5">
            <span>2 · Structure &amp; Written Expression</span>
            <span className="text-faint">40 soal · {SECTION_MINUTES[2]} mnt</span>
          </li>
          <li className="flex items-center justify-between px-5 py-2.5">
            <span>3 · Reading Comprehension</span>
            <span className="text-faint">50 soal · {SECTION_MINUTES[3]} mnt</span>
          </li>
        </ul>
      </section>

      <CreateExam />

      <section className="space-y-3">
        <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">Riwayat</h2>

        {rows.length === 0 ? (
          <p className="card-dashed">Belum ada simulasi. Bikin yang pertama di atas.</p>
        ) : (
          <ul className="card divide-y divide-line overflow-hidden">
            {rows.map((e) => {
              const st = STATUS_LABEL[e.status] ?? STATUS_LABEL.planned
              return (
                <li key={e.id}>
                  <Link
                    href={e.status === 'done' ? `/exam/${e.id}/hasil` : `/exam/${e.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-canvas"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {e.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'}
                        <span className="ml-1.5 text-xs font-normal text-faint">
                          {questionCount(e.size)} soal
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
