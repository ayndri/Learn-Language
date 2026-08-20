import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { ITEM_REGISTRY } from '@/lib/items/registry'
import type { ItemType } from '@/lib/items/types'
import {
  accuracyByType,
  dailyActivity,
  examTrend,
  totals,
  weakestTags,
} from '@/lib/stats/queries'
import { ActivityChart, ExamTrendChart } from './Charts'

function pct(x: number): string {
  return `${Math.round(x * 100)}%`
}

/** Warna bar ketepatan: merah di bawah 60%, kuning sampai 80%, hijau di atasnya */
function accuracyClass(a: number): string {
  if (a < 0.6) return 'bg-bad'
  if (a < 0.8) return 'bg-warn'
  return 'bg-good'
}

export default async function StatistikPage() {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const [weak, byType, activity, exams, sum] = await Promise.all([
    weakestTags(userId),
    accuracyByType(userId),
    dailyActivity(userId, 30),
    examTrend(userId),
    totals(userId),
  ])

  const trend = exams.map((e, i) => ({
    label: `#${i + 1}`,
    total: e.total,
  }))

  return (
    <main className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Statistik</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Dihitung dari seluruh riwayat latihanmu.
          </p>
        </div>
        <Link href="/" className="btn-ghost btn-sm shrink-0">
          ← Dashboard
        </Link>
      </div>

      {sum.reviews === 0 ? (
        <p className="card-dashed text-center">
          Belum ada riwayat latihan. Kerjakan beberapa sesi dulu, baru angkanya jadi berarti.
        </p>
      ) : (
        <>
          {/* --- ringkasan --- */}
          <section className="card grid grid-cols-3 divide-x divide-line text-center">
            <div className="px-2 py-4">
              <p className="text-xl font-bold">{sum.reviews}</p>
              <p className="text-[11px] text-faint">jawaban</p>
            </div>
            <div className="px-2 py-4">
              <p className="text-xl font-bold">{sum.items}</p>
              <p className="text-[11px] text-faint">item disentuh</p>
            </div>
            <div className="px-2 py-4">
              <p className="text-xl font-bold">{sum.avgSeconds.toFixed(1)}s</p>
              <p className="text-[11px] text-faint">rata-rata per item</p>
            </div>
          </section>

          {/* --- yang paling lemah --- */}
          <section className="space-y-3">
            <div>
              <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Paling sering salah
              </h2>
              <p className="mt-0.5 text-xs text-faint">
                Pola grammar dengan ketepatan terendah, minimal 3× dijawab.
              </p>
            </div>

            {weak.length === 0 ? (
              <p className="card-dashed">
                Belum cukup data. Setiap pola perlu dijawab minimal 3× dulu — supaya satu
                kesalahan kebetulan tidak langsung tampil sebagai kelemahan terbesar.
              </p>
            ) : (
              <ul className="card divide-y divide-line overflow-hidden">
                {weak.map((t) => (
                  <li key={t.tag} className="px-4 py-3">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-medium">{t.label}</span>
                      <span className="shrink-0 text-xs text-faint">
                        {t.correct}/{t.total} · {pct(t.accuracy)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full ${accuracyClass(t.accuracy)}`}
                        style={{ width: `${Math.max(3, t.accuracy * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* --- per jenis latihan --- */}
          <section className="space-y-3">
            <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
              Per jenis latihan
            </h2>
            <ul className="card divide-y divide-line overflow-hidden">
              {/*
                Di HP barisnya DITUMPUK: label di atas, bar di bawah.
                Kalau tetap sebaris, label 128px + angka 80px menyisakan cuma ~40px
                untuk bar di layar 320px — barnya jadi serpihan yang tidak terbaca.
              */}
              {byType.map((t) => (
                <li
                  key={t.type}
                  className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="flex items-baseline justify-between gap-2 sm:w-32 sm:shrink-0">
                    <span className="truncate text-sm font-medium">
                      {ITEM_REGISTRY[t.type as ItemType]?.label ?? t.type}
                    </span>
                    <span className="shrink-0 text-xs text-faint sm:hidden">
                      {pct(t.accuracy)} · {t.total}
                    </span>
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className={`block h-full rounded-full ${accuracyClass(t.accuracy)}`}
                      style={{ width: `${Math.max(3, t.accuracy * 100)}%` }}
                    />
                  </span>
                  <span className="hidden w-20 shrink-0 text-right text-xs text-faint sm:block">
                    {pct(t.accuracy)} · {t.total}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* --- aktivitas --- */}
          <section className="space-y-3">
            <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
              30 hari terakhir
            </h2>
            <div className="card p-4">
              <ActivityChart data={activity} />
              <p className="mt-2 text-center text-xs text-faint">
                <span className="inline-block size-2 rounded-sm bg-good align-middle" /> benar ·{' '}
                <span className="inline-block size-2 rounded-sm bg-line align-middle" /> salah
              </p>
            </div>
          </section>
        </>
      )}

      {/* --- tren simulasi --- */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">
          Tren skor simulasi
        </h2>

        {trend.length === 0 ? (
          <p className="card-dashed">
            Belum ada simulasi yang selesai.{' '}
            <Link href="/exam" className="font-medium text-brand hover:underline">
              Kerjakan satu
            </Link>{' '}
            dan trennya mulai kelihatan.
          </p>
        ) : trend.length === 1 ? (
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold">{trend[0].total}</p>
            <p className="mt-1 text-[13px] text-muted">
              Satu simulasi belum jadi tren. Kerjakan lagi beberapa minggu ke depan.
            </p>
          </div>
        ) : (
          <div className="card p-4">
            <ExamTrendChart data={trend} />
            <p className="mt-2 text-center text-xs text-faint">
              skala TOEFL ITP 310–677 · angka ini perkiraan, bukan skor resmi
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
