'use client'

import { useState, useTransition } from 'react'
import { createExamAction } from './actions'

const CHOICES = [
  {
    size: 'full' as const,
    title: 'Simulasi penuh',
    detail: '140 soal · ±115 menit',
    note: 'Persis struktur TOEFL ITP. Butuh ~3 menit untuk disiapkan.',
  },
  {
    size: 'short' as const,
    title: 'Latihan cepat',
    detail: '38 soal · ±32 menit',
    note: 'Proporsi seksinya sama, jumlahnya sepertiga. Siap dalam ~1 menit.',
  },
]

export function CreateExam() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <section className="space-y-2.5">
      <h2 className="text-[13px] font-bold tracking-wide text-faint uppercase">Mulai simulasi</h2>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {CHOICES.map((c) => (
          <button
            key={c.size}
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null)
                const r = await createExamAction(c.size)
                if (r?.error) setError(r.error)
              })
            }
            className="card p-4 text-left transition hover:shadow-lift disabled:opacity-50"
          >
            <p className="font-bold">{c.title}</p>
            <p className="mt-0.5 text-[13px] font-medium text-brand">{c.detail}</p>
            <p className="mt-1.5 text-xs text-faint">{c.note}</p>
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
