'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { generateExamStepAction, markExamReadyAction } from '../actions'

type StepState = 'waiting' | 'running' | 'done' | 'failed'

/**
 * Menyiapkan paket soal, satu langkah satu panggilan AI.
 *
 * Simulasi penuh butuh ~18 panggilan (±3 menit). Digabung jadi satu request akan
 * kena batas durasi serverless dan tidak menunjukkan tanda kehidupan apa pun.
 * Dipecah begini kamu melihat progresnya, dan langkah yang gagal bisa diulang
 * tanpa membuang yang sudah jadi.
 */
export function PrepareExam({
  examId,
  steps,
  totalQuestions,
}: {
  examId: string
  steps: { key: string; label: string; section: number; count: number }[]
  totalQuestions: number
}) {
  const router = useRouter()
  const started = useRef(false)

  const [states, setStates] = useState<Record<string, StepState>>(() =>
    Object.fromEntries(steps.map((s) => [s.key, 'waiting' as StepState])),
  )
  const [error, setError] = useState<string | null>(null)
  const [failedAt, setFailedAt] = useState<number | null>(null)
  const [notes, setNotes] = useState<string[]>([])

  const run = useCallback(
    async (from = 0) => {
      setError(null)
      setFailedAt(null)
      const mark = (key: string, v: StepState) => setStates((p) => ({ ...p, [key]: v }))

      for (let i = from; i < steps.length; i++) {
        const step = steps[i]
        mark(step.key, 'running')
        const res = await generateExamStepAction(examId, i)
        if (res.error) {
          mark(step.key, 'failed')
          setError(res.error)
          setFailedAt(i)
          return
        }
        mark(step.key, 'done')
        if (res.rejected?.length) {
          setNotes((p) => [...p, `${step.label}: ${res.rejected!.length} soal dibuang`])
        }
      }

      const ready = await markExamReadyAction(examId)
      if (ready.error) {
        setError(ready.error)
        return
      }
      router.refresh()
    },
    [examId, steps, router],
  )

  useEffect(() => {
    if (started.current) return
    started.current = true
    void run(0)
  }, [run])

  const doneCount = steps.filter((s) => states[s.key] === 'done').length
  const pct = Math.round((doneCount / steps.length) * 100)

  return (
    <div className="card animate-rise space-y-5 p-6">
      <div className="text-center">
        <p className="animate-float text-4xl">📝</p>
        <p className="mt-2 font-bold">Menyusun soal</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {doneCount}/{steps.length} bagian · target {totalQuestions} soal
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="space-y-2">
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
                className={`flex-1 ${
                  st === 'waiting' ? 'text-faint' : st === 'running' ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className="text-faint">S{s.section}</span> {s.label}
                {st === 'running' && '…'}
              </span>
              <span className="text-xs text-faint">{s.count}</span>
            </li>
          )
        })}
      </ul>

      {notes.length > 0 && <p className="text-xs text-faint">{notes.join(' · ')}</p>}

      {error && (
        <div className="space-y-3">
          <p role="alert" className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void run(failedAt ?? 0)}
            className="btn-outline btn-sm w-full"
          >
            Lanjutkan dari bagian yang gagal
          </button>
        </div>
      )}

      {!error && (
        <p className="text-center text-xs text-faint">
          Soalnya dibuat baru khusus untuk paket ini, jadi tidak bisa dihafal dari simulasi
          sebelumnya.
        </p>
      )}
    </div>
  )
}
