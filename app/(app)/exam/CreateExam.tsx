'use client'

import { useState, useTransition } from 'react'
import { createExamAction } from './actions'

export type FormatChoice = {
  id: string
  label: string
  note: string
  languageCode: string
  languageName: string
  /** nama seksi + jumlah soal + menit, untuk versi penuh */
  sections: { name: string; questions: number; minutes: number }[]
  sizes: { size: 'full' | 'short'; questions: number; minutes: number }[]
}

/**
 * Pemilih simulasi: format dulu, baru ukurannya.
 *
 * Formatnya datang dari server (`lib/exam/formats.ts` disaring ke bahasa yang
 * sudah aktif), bukan didaftar ulang di sini — kalau nanti ada JLPT N0 atau
 * IELTS, komponen ini tidak perlu disentuh.
 *
 * DIKELOMPOKKAN PER BAHASA, dan itu bukan sekadar kerapian. Waktu formatnya cuma
 * TOEFL plus lima JLPT, satu baris lencana masih terbaca. Dua puluh lencana dari
 * lima bahasa tidak: "DELE B2" berdiri sederajat di sebelah "HSK 3" tanpa
 * petunjuk itu bahasa apa, dan kamu harus mengenali nama tiap ujian untuk tahu
 * mana yang relevan. Yang kamu cari hampir selalu "ujian untuk bahasa yang
 * sedang kupelajari" — jadi bahasanya yang jadi judul, bukan sekadar keterangan.
 *
 * Urutan bahasanya mengikuti urutan format dari server (`sortOrder` di tabel
 * `languages`), bukan abjad — supaya sama dengan urutan di dashboard.
 */
/**
 * Format → dikelompokkan per bahasa, urutan bahasa mengikuti kemunculan
 * pertamanya di daftar dari server.
 *
 * `Map` dipakai justru karena ia mempertahankan urutan penyisipan — itu yang
 * membuat urutan `sortOrder` dari server ikut terbawa tanpa perlu menyortir
 * ulang di sini (dan tanpa risiko urutannya berbeda dari dashboard).
 */
function groupByLanguage(formats: FormatChoice[]): [string, FormatChoice[]][] {
  const byLanguage = new Map<string, FormatChoice[]>()
  for (const f of formats) {
    const list = byLanguage.get(f.languageName)
    if (list) list.push(f)
    else byLanguage.set(f.languageName, [f])
  }
  return [...byLanguage]
}

export function CreateExam({ formats }: { formats: FormatChoice[] }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [picked, setPicked] = useState(formats[0]?.id ?? '')

  const format = formats.find((f) => f.id === picked) ?? formats[0]
  if (!format) {
    return (
      <p className="card-dashed">
        Belum ada bahasa yang aktif, jadi belum ada simulasi yang bisa dikerjakan.
      </p>
    )
  }

  return (
    <section className="space-y-2.5">
      <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">Mulai simulasi</h2>

      {formats.length > 1 && (
        <div className="space-y-2">
          {groupByLanguage(formats).map(([language, group]) => (
            <div key={language} className="flex flex-wrap items-center gap-1.5">
              <span className="w-16 shrink-0 text-[11px] font-semibold tracking-wide text-faint uppercase">
                {language}
              </span>
              {group.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPicked(f.id)}
                  className={`badge px-3 py-1.5 transition ${
                    f.id === picked ? 'bg-brand text-white' : 'bg-canvas text-muted hover:text-ink'
                  }`}
                >
                  {/*
                    Nama bahasanya sudah jadi judul baris, jadi dibuang dari
                    lencananya: "DELE A1" bukan "Spanyol DELE A1". Yang tersisa
                    justru bagian yang membedakan satu format dari yang lain.
                  */}
                  {f.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="bg-brand-soft/70 px-5 py-3">
          <p className="text-sm font-bold">{format.label}</p>
          <p className="mt-0.5 text-[13px] text-brand">{format.note}</p>
        </div>
        <ul className="divide-y divide-line text-sm">
          {format.sections.map((s, i) => (
            <li key={s.name} className="flex items-center justify-between gap-3 px-5 py-2.5">
              <span className="min-w-0 truncate">
                {i + 1} · {s.name}
              </span>
              <span className="shrink-0 text-faint">
                {s.questions} soal · {s.minutes} mnt
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {format.sizes.map((s) => (
          <button
            key={s.size}
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null)
                const r = await createExamAction(format.id, s.size)
                if (r?.error) setError(r.error)
              })
            }
            className="card p-4 text-left transition hover:shadow-lift disabled:opacity-50"
          >
            <p className="font-bold">{s.size === 'full' ? 'Simulasi penuh' : 'Latihan cepat'}</p>
            <p className="mt-0.5 text-[13px] font-medium text-brand">
              {s.questions} soal · ±{s.minutes} menit
            </p>
            <p className="mt-1.5 text-xs text-faint">
              {s.size === 'full'
                ? `Persis struktur ${format.label}. Butuh beberapa menit untuk disiapkan.`
                : 'Proporsi tiap bagian sama, jumlahnya sepertiga. Siap lebih cepat.'}
            </p>
          </button>
        ))}
      </div>

      {pending && <p className="text-xs text-brand">Membuat paket…</p>}
      {error && (
        <p role="alert" className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
          {error}
        </p>
      )}
    </section>
  )
}
