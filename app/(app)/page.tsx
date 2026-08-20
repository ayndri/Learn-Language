import { and, eq, gte } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { reviewLogs } from '@/lib/db/schema'
import { levelStyle } from '@/lib/languages/levels'
import { currentStreak, daysAgo } from '@/lib/srs/day'
import { decideNext, trackProgress } from '@/lib/study/next'

/**
 * Pintu ke fitur di luar latihan harian.
 *
 * Ditaruh DI BAWAH tombol utama dan peta jalur belajar, bukan di atas — kalau
 * dashboard menawarkan empat pilihan sederajat, tidak ada lagi "satu tombol yang
 * jelas", dan kamu kembali harus memutuskan sendiri mau ngapain hari ini.
 */
const EXTRAS = [
  {
    href: '/exam',
    icon: '📝',
    tint: 'bg-sun-soft',
    title: 'Simulasi TOEFL ITP',
    sub: '140 soal · baru tiap kali · yang salah bisa jadi latihan',
  },
  {
    href: '/statistik',
    icon: '📊',
    tint: 'bg-lv-a2-soft',
    title: 'Statistik',
    sub: 'grammar yang paling sering salah, aktivitas, tren skor',
  },
  {
    href: '/teks',
    icon: '📄',
    tint: 'bg-good-soft',
    title: 'Dari bacaanmu',
    sub: 'tempel abstrak atau artikel → jadi kosakata latihan',
  },
] as const

/**
 * Dashboard. Tugasnya cuma satu: memberi SATU tombol yang jelas.
 *
 * Semua keputusan "hari ini belajar apa" ada di `decideNext` — halaman ini
 * tidak boleh punya pendapat sendiri soal itu, supaya tombolnya tidak pernah
 * mengarah ke tempat yang berbeda dari yang dijanjikan labelnya.
 */
export default async function DashboardPage() {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const progress = await trackProgress(userId)
  if (!progress) redirect('/start')

  const [next, reviewTimes] = await Promise.all([
    decideNext(userId),
    db
      .select({ at: reviewLogs.reviewedAt })
      .from(reviewLogs)
      .where(and(eq(reviewLogs.userId, userId), gte(reviewLogs.reviewedAt, daysAgo(60)))),
  ])

  const streak = currentStreak(reviewTimes.map((r) => r.at))
  const levels = progress.language.fieldTemplate.levels
  const nextPosition = progress.lessons.find((l) => l.status === 'planned')?.position ?? null

  // 60 pelajaran terlalu panjang untuk satu daftar datar — dikelompokkan per level,
  // dan hanya level yang sedang dikerjakan yang terbuka.
  const groups = levels
    .map((level) => {
      const lessons = progress.lessons.filter((l) => l.level === level)
      return {
        level,
        lessons,
        ready: lessons.filter((l) => l.status === 'ready').length,
        active: lessons.some((l) => l.position === nextPosition),
        style: levelStyle(level, levels),
      }
    })
    .filter((g) => g.lessons.length > 0)

  const cta =
    next.kind === 'practice'
      ? { label: 'Ayo latihan', sub: `${next.count} item siap diulang` }
      : next.kind === 'lesson'
        ? { label: 'Buka pelajaran baru', sub: next.title }
        : { label: 'Semua beres', sub: 'Balik lagi besok sesuai jadwal' }

  return (
    <main className="space-y-7">
      {/* --- kartu utama --- */}
      <section className="card animate-rise overflow-hidden">
        <div className="bg-brand-soft/70 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-brand">
                {progress.language.name}
                {progress.track.goal && ` · ${progress.track.goal}`}
              </p>
              <p className="mt-1 truncate text-xl font-bold tracking-tight">{cta.sub}</p>
            </div>

            {streak > 0 && (
              <div className="animate-float flex shrink-0 items-center gap-1 rounded-2xl bg-sun-soft px-3 py-1.5">
                <span className="text-lg leading-none">🔥</span>
                <span className="font-bold text-sun">{streak}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {next.kind === 'done' ? (
            <div className="rounded-2xl bg-good-soft px-4 py-3.5 text-center text-sm font-semibold text-good">
              ✓ {cta.label}
            </div>
          ) : (
            <Link href="/learn" className="btn-primary w-full py-3.5 text-base">
              {cta.label} →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
          <div className="px-2 py-3">
            <p className="text-lg font-bold">{streak}</p>
            <p className="text-[11px] text-faint">hari berturut</p>
          </div>
          <div className="px-2 py-3">
            <p className="text-lg font-bold">
              {progress.ready}
              <span className="text-sm font-medium text-faint">/{progress.total}</span>
            </p>
            <p className="text-[11px] text-faint">pelajaran</p>
          </div>
          <div className="px-2 py-3">
            <p className="text-lg font-bold">{next.kind === 'practice' ? next.count : 0}</p>
            <p className="text-[11px] text-faint">perlu diulang</p>
          </div>
        </div>
      </section>

      {/* --- jalur belajar: peta, bukan panel kontrol --- */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
            Jalur belajarmu
          </h2>
          <span className="text-xs text-faint">{progress.total} pelajaran</span>
        </div>

        <div className="space-y-2.5">
          {groups.map((g) => (
            <details key={g.level} open={g.active} className="card group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition hover:bg-canvas">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${g.style.bg}`}
                >
                  {g.level}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">
                      {g.ready}/{g.lessons.length} selesai
                    </span>
                    {g.active && (
                      <span className="badge bg-brand-soft text-brand">sedang di sini</span>
                    )}
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
                    <span
                      className={`block h-full rounded-full ${g.style.bg} transition-all`}
                      style={{ width: `${(g.ready / g.lessons.length) * 100}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-faint transition group-open:rotate-90">›</span>
              </summary>

              <ol className="divide-y divide-line border-t border-line">
                {g.lessons.map((lesson) => {
                  const isNext = lesson.position === nextPosition
                  const isReady = lesson.status === 'ready'
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/unit/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 transition hover:bg-canvas ${
                          isNext ? 'bg-brand-soft/40' : ''
                        }`}
                      >
                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            isReady
                              ? `${g.style.soft} ${g.style.text}`
                              : isNext
                                ? 'bg-brand text-white'
                                : 'bg-canvas text-faint'
                          }`}
                        >
                          {isReady ? '✓' : lesson.position + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{lesson.title}</span>
                          {lesson.focus && (
                            <span className="block truncate text-xs text-faint">{lesson.focus}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </details>
          ))}
        </div>

        <p className="px-1 text-xs text-faint">
          Materi dan latihan tiap pelajaran disiapkan otomatis saat kamu sampai di sana.
        </p>
      </section>

      {/* --- selain latihan harian --- */}
      <section className="space-y-2.5">
        <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
          Selain latihan
        </h2>

        {EXTRAS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card flex items-center gap-4 p-4 transition hover:shadow-lift"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-xl ${c.tint}`}
            >
              {c.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{c.title}</span>
              <span className="block text-xs text-faint">{c.sub}</span>
            </span>
            <span className="shrink-0 text-faint">›</span>
          </Link>
        ))}
      </section>

      <section className="border-t border-line pt-4">
        <p className="text-xs text-faint">
          Mau belajar topik tertentu di luar jalur ini?{' '}
          <Link href="/new" className="font-medium text-muted underline hover:text-brand">
            Buat pelajaran sendiri
          </Link>
        </p>
      </section>
    </main>
  )
}
