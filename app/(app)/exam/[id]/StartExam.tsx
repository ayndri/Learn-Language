'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { startExamAction } from '../actions'

export type SectionInfo = {
  section: number
  name: string
  planned: number
  actual: number
  minutes: number
}

export function StartExam({
  examId,
  total,
  sections,
}: {
  examId: string
  total: number
  sections: SectionInfo[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const minutes = sections.reduce((a, s) => a + s.minutes, 0)
  const shortfall = sections.filter((s) => s.actual < s.planned)

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="bg-brand-soft/70 px-5 py-4 text-center">
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-[13px] font-medium text-brand">soal · ±{minutes} menit</p>
        </div>

        <ul className="divide-y divide-line text-sm">
          {sections.map((s) => (
            <li key={s.section} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="min-w-0">
                <span className="block truncate font-medium">
                  {s.section} · {s.name}
                </span>
                <span className="text-xs text-faint">{s.minutes} menit</span>
              </span>
              <span className="shrink-0 text-sm">
                {s.actual}
                {s.actual < s.planned && (
                  <span className="text-faint">/{s.planned}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {shortfall.length > 0 && (
        // Jumlah soal yang kurang dari cetak biru harus terlihat. Skor dari 46 soal
        // tidak sebanding dengan skor dari 50 soal, dan itu perlu kamu tahu.
        <p className="rounded-2xl bg-warn-soft px-4 py-3 text-[13px] text-warn">
          Sebagian soal tidak lolos pemeriksaan dan dibuang, jadi jumlahnya kurang dari cetak
          biru. Skornya tetap dihitung proporsional, tapi angkanya jadi kurang sebanding dengan
          simulasi yang lengkap.
        </p>
      )}

      <div className="card space-y-3 p-5 text-sm">
        <p className="font-semibold">Sebelum mulai</p>
        <ul className="space-y-1.5 pl-4 text-[13px] text-muted">
          <li className="list-disc">
            Waktunya berjalan sejak kamu menekan tombol dan <strong>tidak bisa dijeda</strong>.
            Menutup tab tidak menghentikan jam — jawaban yang sudah dipilih tersimpan.
          </li>
          <li className="list-disc">
            Seksi Listening dibacakan lewat suara perangkatmu. Pakai headphone, dan pastikan
            suara Inggris tersedia.
          </li>
          <li className="list-disc">
            Kalau waktu satu seksi habis, kamu otomatis dibawa ke seksi berikutnya.
          </li>
          <li className="list-disc">
            Skor yang keluar nanti adalah <strong>perkiraan</strong>, bukan skor resmi ETS.
          </li>
        </ul>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={pending || total === 0}
        onClick={() =>
          startTransition(async () => {
            setError(null)
            const r = await startExamAction(examId)
            if (r.error) setError(r.error)
            else router.refresh()
          })
        }
        className="btn-primary w-full py-3.5 text-base"
      >
        {pending ? 'Memulai…' : 'Mulai sekarang'}
      </button>
    </div>
  )
}
