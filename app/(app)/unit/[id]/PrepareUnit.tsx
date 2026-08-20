'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deriveItemsAction,
  generateItemsAction,
  generateLessonAction,
  markUnitReadyAction,
} from './actions'

type StepState = 'waiting' | 'running' | 'done' | 'failed'

/**
 * Menyiapkan pelajaran secara otomatis: materi → item → tandai siap.
 *
 * Kenapa langkahnya dijalankan satu per satu dari klien, bukan satu server action
 * besar: tiap panggilan AI butuh 5–10 detik. Digabung jadi satu request, totalnya
 * ~25 detik tanpa tanda kehidupan apa pun — dan di serverless bisa kena batas
 * durasi. Dipecah begini, tiap request pendek dan kamu melihat progresnya.
 *
 * Pengguna tidak menekan tombol apa pun. Ini berjalan sendiri saat halaman dibuka.
 */
export function PrepareUnit({
  unitId,
  itemTypes,
  hasDerived,
  title,
}: {
  unitId: string
  /** jenis item yang DIGENERATE AI untuk bahasa ini (tanpa yang diturunkan) */
  itemTypes: { type: string; label: string }[]
  /** bahasa ini memakai latihan turunan (dikte & berbicara) */
  hasDerived: boolean
  title: string
}) {
  const router = useRouter()
  const started = useRef(false)

  const steps = [
    { key: 'lesson', label: 'Menulis materi' },
    ...itemTypes.map((t) => ({ key: t.type, label: `Menyusun ${t.label.toLowerCase()}` })),
    ...(hasDerived ? [{ key: 'derived', label: 'Menyiapkan dikte & latihan bicara' }] : []),
  ]

  const [states, setStates] = useState<Record<string, StepState>>(() =>
    Object.fromEntries(steps.map((s) => [s.key, 'waiting' as StepState])),
  )
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<string[]>([])

  const run = useCallback(async () => {
    setError(null)
    const mark = (key: string, v: StepState) => setStates((p) => ({ ...p, [key]: v }))

    mark('lesson', 'running')
    const lesson = await generateLessonAction(unitId)
    if (lesson.error) {
      mark('lesson', 'failed')
      setError(lesson.error)
      return
    }
    mark('lesson', 'done')

    for (const t of itemTypes) {
      mark(t.type, 'running')
      // 0 = pakai jumlah bawaan jenis itu dari registry
      const res = await generateItemsAction(unitId, t.type, 0)
      if (res.error) {
        mark(t.type, 'failed')
        setError(res.error)
        return
      }
      mark(t.type, 'done')
      // Penolakan tetap dilaporkan, tapi tidak menghentikan penyiapan.
      if (res.rejected?.length) {
        setNotes((p) => [...p, `${res.rejected!.length} item dilewati karena tidak lolos periksa`])
      }
    }

    // Harus SETELAH kalimat, ungkapan, dan kosakata ada — item ini diturunkan
    // dari ketiganya, bukan digenerate.
    if (hasDerived) {
      mark('derived', 'running')
      const res = await deriveItemsAction(unitId)
      mark('derived', res.error ? 'failed' : 'done')
      if (res.error) setNotes((p) => [...p, `latihan turunan dilewati: ${res.error}`])
    }

    const ready = await markUnitReadyAction(unitId)
    if (ready.error) {
      setError(ready.error)
      return
    }
    router.refresh()
  }, [unitId, itemTypes, hasDerived, router])

  useEffect(() => {
    if (started.current) return
    started.current = true
    void run()
  }, [run])

  const retry = () => {
    setStates(Object.fromEntries(steps.map((s) => [s.key, 'waiting' as StepState])))
    setNotes([])
    void run()
  }

  const doneCount = steps.filter((s) => states[s.key] === 'done').length
  const pct = Math.round((doneCount / steps.length) * 100)

  return (
    <div className="card animate-rise space-y-5 p-6">
      <div className="text-center">
        <p className="animate-float text-4xl">✏️</p>
        <p className="mt-2 font-bold">Menyiapkan pelajaranmu</p>
        <p className="mt-0.5 text-[13px] text-muted">{title}</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="space-y-2.5">
        {steps.map((s) => {
          const st = states[s.key]
          return (
            <li key={s.key} className="flex items-center gap-3 text-sm">
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                  st === 'done'
                    ? 'bg-good-soft text-good'
                    : st === 'running'
                      ? 'bg-brand text-white'
                      : st === 'failed'
                        ? 'bg-bad-soft text-bad'
                        : 'bg-canvas text-faint'
                }`}
              >
                {st === 'done' ? '✓' : st === 'failed' ? '✕' : st === 'running' ? '•' : ''}
              </span>
              <span
                className={
                  st === 'waiting' ? 'text-faint' : st === 'running' ? 'text-ink' : 'text-muted'
                }
              >
                {s.label}
                {st === 'running' && '…'}
              </span>
            </li>
          )
        })}
      </ul>

      {notes.length > 0 && (
        <p className="text-xs text-faint">{notes.join(' · ')}</p>
      )}

      {error && (
        <div className="space-y-3">
          <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
            {error}
          </p>
          <button type="button" onClick={retry} className="btn-outline btn-sm w-full">
            Coba lagi
          </button>
        </div>
      )}

      {!error && (
        <p className="text-center text-xs text-faint">
          Sekitar {15 + itemTypes.length * 8} detik — dan cuma sekali untuk pelajaran ini.
          Habis ini kamu tinggal belajar.
        </p>
      )}
    </div>
  )
}
