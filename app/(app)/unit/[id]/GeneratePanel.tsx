'use client'

import { useState, useTransition } from 'react'
import { generateItemsAction, generateLessonAction, type ActionResult } from './actions'

export type TypeSlot = { type: string; label: string; count: number }

export function GeneratePanel({
  unitId,
  hasLesson,
  slots,
}: {
  unitId: string
  hasLesson: boolean
  slots: TypeSlot[]
}) {
  const [pending, startTransition] = useTransition()
  const [running, setRunning] = useState<string | null>(null)
  const [result, setResult] = useState<ActionResult | null>(null)

  const run = (key: string, fn: () => Promise<ActionResult>) =>
    startTransition(async () => {
      setResult(null)
      setRunning(key)
      const r = await fn()
      setRunning(null)
      setResult(r)
    })

  return (
    <section className="card space-y-3 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-wide text-faint uppercase">Generate</h2>
        {pending && <span className="text-xs text-brand">memanggil AI…</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run('lesson', () => generateLessonAction(unitId))}
          className="btn-outline btn-sm"
        >
          {running === 'lesson' ? 'Menulis…' : hasLesson ? 'Buat ulang materi' : 'Buat materi'}
        </button>

        {slots.map((slot) => (
          <button
            key={slot.type}
            type="button"
            disabled={pending}
            onClick={() => run(slot.type, () => generateItemsAction(unitId, slot.type, 10))}
            className="btn-outline btn-sm"
          >
            {running === slot.type ? 'Menyusun…' : `+10 ${slot.label.toLowerCase()}`}
            {slot.count > 0 && running !== slot.type && (
              <span className="pill-count">{slot.count}</span>
            )}
          </button>
        ))}
      </div>

      {result?.ok && (
        <p className="rounded-xl bg-good-soft px-3 py-2 text-[13px] font-medium text-good">
          {result.ok}
        </p>
      )}
      {result?.error && (
        <p className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {result.error}
        </p>
      )}

      {result?.rejected && result.rejected.length > 0 && (
        <details className="rounded-xl bg-warn-soft px-3 py-2 text-[13px] text-warn">
          <summary className="cursor-pointer font-medium">
            {result.rejected.length} item ditolak — lihat alasannya
          </summary>
          <ul className="mt-2 space-y-1 pl-4">
            {result.rejected.map((r, i) => (
              <li key={i} className="list-disc">
                {r}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
