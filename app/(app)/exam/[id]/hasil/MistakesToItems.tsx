'use client'

import { useState, useTransition } from 'react'
import { examMistakesToItemsAction, type ExamActionResult } from '../../actions'

/**
 * Tombol yang mengubah kesalahan simulasi jadi latihan harian.
 *
 * Sengaja tombol, bukan otomatis. Alasannya: menambah 40 item baru ke antrean
 * harian itu keputusan besar — bisa membuat beberapa hari ke depan berat. Kamu
 * yang memutuskan kapan siap.
 */
export function MistakesToItems({ examId, wrongCount }: { examId: string; wrongCount: number }) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ExamActionResult | null>(null)

  if (wrongCount === 0) return null

  return (
    <section className="card space-y-3 p-5">
      <div>
        <p className="font-bold">Jadikan latihan</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {wrongCount} soal yang salah bisa diubah jadi item latihan harian, dan dijadwalkan
          ulang oleh SRS sampai benar-benar nempel.
        </p>
      </div>

      <ul className="space-y-1 pl-4 text-xs text-faint">
        <li className="list-disc">
          Soal <strong>Structure</strong> jadi latihan <strong>mengisi kosong</strong> — kamu
          mengetik jawabannya, bukan memilih dari empat pilihan. Lebih sulit dari soal aslinya.
        </li>
        <li className="list-disc">
          Soal <strong>Listening</strong> jadi <strong>dikte</strong>, bukan pilihan ganda.
        </li>
        <li className="list-disc">
          Soal <strong>Written Expression</strong> dan <strong>Reading</strong> dibawa apa adanya.
        </li>
      </ul>

      {result?.ok && (
        <p className="rounded-2xl bg-good-soft px-3 py-2 text-[13px] font-medium text-good">
          {result.ok}
        </p>
      )}
      {result?.error && (
        <p className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {result.error}
        </p>
      )}
      {result?.rejected?.map((r, i) => (
        <p key={i} className="rounded-2xl bg-warn-soft px-3 py-2 text-xs text-warn">
          {r}
        </p>
      ))}

      <button
        type="button"
        disabled={pending || Boolean(result?.ok)}
        onClick={() =>
          startTransition(async () => {
            setResult(null)
            setResult(await examMistakesToItemsAction(examId))
          })
        }
        className="btn-primary w-full"
      >
        {pending
          ? 'Membuat latihan…'
          : result?.ok
            ? 'Sudah ditambahkan'
            : `Tambahkan ${wrongCount} latihan`}
      </button>
    </section>
  )
}
