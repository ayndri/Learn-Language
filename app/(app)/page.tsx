import { and, eq, gte } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { languages, reviewLogs } from '@/lib/db/schema'
import { EXAM_FORMATS } from '@/lib/exam/formats'
import { levelStyle } from '@/lib/languages/levels'
import { sortStrands, strandOf } from '@/lib/languages/strands'
import { currentStreak, daysAgo } from '@/lib/srs/day'
import { activeLanguageCode } from '@/lib/study/active'
import { decideNext, listTracks, trackProgress } from '@/lib/study/next'
import { dueByLanguage } from '@/lib/study/queue'
import { switchLanguageAction } from './actions'
import { LanguageChips } from './LanguageChips'

/**
 * Ujian apa saja yang tersedia, DITURUNKAN dari daftar formatnya.
 *
 * Sebelumnya kalimat ini ditulis tangan: "TOEFL ITP & JLPT N5–N1". Lalu TOPIK
 * masuk, HSK masuk, DELE masuk — dan kalimatnya tetap menjanjikan dua dari lima.
 * Ini satu-satunya tempat fitur simulasi diperkenalkan di dashboard, jadi tiga
 * ujian praktis tidak pernah diumumkan ke pemakainya sendiri.
 *
 * Nama keluarganya diambil dari kata PERTAMA `short` tiap format: "JLPT N5" →
 * JLPT, "TOPIK I" → TOPIK, "DELE A1" → DELE. Terlihat seperti trik, tapi inilah
 * yang membuat kalimatnya tidak bisa basi lagi — format keenam akan muncul di
 * sini tanpa ada yang perlu ingat memperbaruinya. Kalau suatu saat ada format
 * yang namanya tidak diawali nama keluarganya, yang muncul cuma kata pertamanya,
 * dan itu tetap benar — bukan salah.
 */
function examFamilies(): string {
  const names = [...new Set(Object.values(EXAM_FORMATS).map((f) => f.short.split(' ')[0]))]
  return names.join(' · ')
}

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
    title: 'Simulasi ujian',
    sub: `${examFamilies()} · baru tiap kali · yang salah bisa jadi latihan`,
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
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const { tab } = await searchParams

  // Bahasa aktif ditentukan sekali di sini, lalu diteruskan ke semua yang
  // butuh — supaya kartu utama, peta jalur, dan tombolnya tidak mungkin
  // menunjuk ke bahasa yang berbeda-beda.
  const active = await activeLanguageCode()

  const progress = await trackProgress(userId, active)
  if (!progress) redirect('/start')

  const [tracks, enabled, next, reviewTimes, duePerLanguage] = await Promise.all([
    listTracks(userId),
    db
      .select({ id: languages.id })
      .from(languages)
      .where(eq(languages.enabled, true)),
    decideNext(userId, active),
    db
      .select({ at: reviewLogs.reviewedAt })
      .from(reviewLogs)
      .where(and(eq(reviewLogs.userId, userId), gte(reviewLogs.reviewedAt, daysAgo(60)))),
    dueByLanguage(userId),
  ])

  const streak = currentStreak(reviewTimes.map((r) => r.at))
  const levels = progress.language.fieldTemplate.levels
  const nextLesson = progress.lessons.find((l) => l.status === 'planned') ?? null
  const nextPosition = nextLesson?.position ?? null

  /**
   * BAGIAN MATERI SEBAGAI TAB
   *
   * 380 pelajaran bahasa Jepang dalam satu daftar datar tidak bisa dibaca, dan
   * lebih buruk lagi: menyamaratakan empat jenis bahan yang sebenarnya berbeda.
   * "Hafal 12 kanji" dan "paham pola 〜ば〜ほど" itu pekerjaan yang berbeda.
   *
   * Tiap tab berdiri sendiri — daftar pelajarannya sendiri, progresnya sendiri,
   * tombol lanjutnya sendiri. Tab yang terbuka disimpan di URL (`?tab=`), bukan
   * di state klien, supaya halamannya tetap bisa di-bookmark dan tidak butuh
   * JavaScript untuk berpindah.
   */
  const strands = sortStrands(
    [...new Set(progress.lessons.map((l) => strandOf(l.strand).id))],
    progress.language.code,
  ).map((strand) => {
    const lessons = progress.lessons.filter((l) => strandOf(l.strand).id === strand.id)
    return {
      strand,
      lessons,
      ready: lessons.filter((l) => l.status === 'ready').length,
      // Pelajaran berikutnya DI DALAM bagian ini — bukan pelajaran berikutnya
      // secara keseluruhan. Itu yang membuat tiap tab bisa dikerjakan sendiri.
      next: lessons.find((l) => l.status === 'planned') ?? null,
    }
  })

  // Tab yang terbuka: pilihan di URL kalau valid, kalau tidak bagian tempat
  // pelajaran berikutnya berada — jadi membuka dashboard selalu mendarat di
  // tempat kamu berhenti, bukan di tab pertama.
  const openTab =
    strands.find((s) => s.strand.id === tab) ??
    strands.find((s) => s.strand.id === strandOf(nextLesson?.strand).id) ??
    strands[0]

  // Di dalam satu bagian, pelajaran tetap dikelompokkan per level.
  const groups = levels
    .map((level) => {
      const lessons = openTab?.lessons.filter((l) => l.level === level) ?? []
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

  // Bahasa yang belum punya jalur belajar — jadi tombol "tambah", bukan daftar
  // yang berdiri sederajat dengan jalur yang sedang jalan.
  const canAdd = enabled.length > tracks.length

  return (
    <main className="space-y-7">
      {/* --- pemilih bahasa: hanya muncul kalau memang ada pilihan --- */}
      {(tracks.length > 1 || canAdd) && (
        <form action={switchLanguageAction} className="flex flex-wrap items-center gap-1.5">
          {/*
            Tombolnya dipisah ke komponen client supaya bisa memperlihatkan
            keadaan "sedang pindah" — lihat catatan di LanguageChips.tsx.
            `<form>` dan server action-nya TETAP di sini, jadi pemilih bahasa
            masih berfungsi sebelum JavaScript selesai dimuat.
          */}
          <LanguageChips
            activeCode={progress.language.code}
            chips={tracks.map((t) => ({
              trackId: t.trackId,
              code: t.code,
              name: t.name,
              nativeName: t.nativeName,
              due: duePerLanguage.get(t.languageId) ?? 0,
            }))}
          />
          {canAdd && (
            <Link
              href="/start"
              className="badge bg-canvas px-3 py-1.5 text-muted transition hover:text-brand"
            >
              + bahasa
            </Link>
          )}
        </form>
      )}

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
            <Link
              href={`/learn?lang=${progress.language.code}`}
              className="btn-primary w-full py-3.5 text-base"
            >
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

        {/* --- tab bagian materi --- */}
        {strands.length > 1 && (
          <div className="scroll-row -mx-4 px-4">
            <div className="flex w-max gap-1.5">
              {strands.map((s) => {
                const on = s.strand.id === openTab?.strand.id
                return (
                  <Link
                    key={s.strand.id}
                    href={`/?tab=${s.strand.id}`}
                    aria-current={on ? 'page' : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm transition ${
                      on
                        ? 'border-brand bg-brand-soft text-brand'
                        : 'border-line-strong bg-surface text-muted hover:border-brand'
                    }`}
                  >
                    <span className="text-base leading-none">{s.strand.icon}</span>
                    <span className="font-semibold">{s.strand.label}</span>
                    <span className="text-xs opacity-70">
                      {s.ready}/{s.lessons.length}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* --- ringkasan bagian yang sedang dibuka --- */}
        {openTab && (
          <div className="card space-y-3 p-4">
            <div>
              <p className="text-sm font-bold">{openTab.strand.label}</p>
              <p className="mt-0.5 text-xs text-muted">{openTab.strand.note}</p>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${(openTab.ready / openTab.lessons.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-faint">
                {openTab.ready} dari {openTab.lessons.length} pelajaran selesai
              </span>
              {openTab.next ? (
                <Link href={`/unit/${openTab.next.id}`} className="btn-outline btn-sm shrink-0">
                  Lanjutkan →
                </Link>
              ) : (
                <span className="badge bg-good-soft text-good">tuntas</span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {groups.map((g) => (
            <details key={g.level} open={g.active} className="card group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition hover:bg-canvas">
                {/*
                  Lebarnya IKUT ISI, bukan kotak tetap.
                  Awalnya `size-9` — pas untuk "A1" dan "N5", tapi nama level
                  bukan selalu dua huruf: "TOPIK 1" langsung meluber keluar
                  kotaknya. Tingginya tetap 36px supaya barisnya sejajar.
                */}
                <span
                  className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl px-2.5 text-xs font-bold whitespace-nowrap text-white ${g.style.bg}`}
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
          {strands.length > 1 && ' Tombol utama di atas tetap memutuskan urutan hariannya lintas bagian.'}
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
