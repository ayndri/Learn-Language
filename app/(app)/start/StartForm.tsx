'use client'

import { useActionState, useState } from 'react'
import { startTrack, type StartState } from './actions'

export type LanguageOption = {
  id: string
  name: string
  nativeName: string
  levels: string[]
}

const initialState: StartState = {}

/** Pilihan level dibuat manusiawi — orang jarang tahu dirinya "A2" atau "N4". */
const LEVEL_HINTS = ['Belum bisa apa-apa', 'Tahu dasar-dasarnya', 'Sudah agak lancar']

export function StartForm({ options }: { options: LanguageOption[] }) {
  const [state, formAction, pending] = useActionState(startTrack, initialState)
  const [languageId, setLanguageId] = useState(options[0]?.id ?? '')
  const [levelIndex, setLevelIndex] = useState(0)

  const levels = options.find((o) => o.id === languageId)?.levels ?? []
  // Tiga pilihan saja, dipetakan ke level sebenarnya di balik layar.
  const choices = [levels[0], levels[1] ?? levels[0], levels[2] ?? levels.at(-1)].filter(
    Boolean,
  ) as string[]
  const startLevel = choices[levelIndex] ?? choices[0] ?? ''

  return (
    <form action={formAction} className="card space-y-6 p-6">
      <div>
        <span className="field-label">Mau belajar bahasa apa?</span>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setLanguageId(o.id)}
              aria-pressed={languageId === o.id}
              className={`btn btn-sm border ${
                languageId === o.id
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line-strong bg-surface text-muted hover:border-brand hover:text-brand'
              }`}
            >
              {o.name}
              <span className="text-xs opacity-60">{o.nativeName}</span>
            </button>
          ))}
        </div>
        <input type="hidden" name="languageId" value={languageId} />
      </div>

      <div>
        <span className="field-label">Sekarang kemampuanmu di mana?</span>
        <div className="space-y-2">
          {choices.map((lvl, i) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelIndex(i)}
              aria-pressed={levelIndex === i}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                levelIndex === i
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line-strong bg-surface hover:border-brand'
              }`}
            >
              <span>{LEVEL_HINTS[i] ?? lvl}</span>
              <span className="text-xs opacity-60">{lvl}</span>
            </button>
          ))}
        </div>
        <input type="hidden" name="startLevel" value={startLevel} />
      </div>

      <div>
        <label htmlFor="goal" className="field-label">
          Buat apa? <span className="font-normal text-faint">(boleh dikosongkan)</span>
        </label>
        <input
          id="goal"
          name="goal"
          type="text"
          maxLength={120}
          placeholder="ngobrol sehari-hari, persiapan TOEFL, baca manga…"
          className="input"
        />
        <p className="mt-1.5 text-xs text-faint">
          Kalau diisi, urutan pelajarannya disesuaikan dengan tujuan itu.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {state.error}
        </p>
      )}

      <div className="space-y-2 border-t border-line pt-4">
        <button type="submit" disabled={pending || !languageId} className="btn-primary w-full">
          {pending ? 'Menyusun jalur belajarmu…' : 'Mulai belajar'}
        </button>
        <p className="text-xs text-faint">
          {pending
            ? 'Sedang menyusun urutan pelajaran. Beberapa detik.'
            : 'Setelah ini kamu tidak perlu memilih topik lagi — app yang menentukan pelajaran berikutnya.'}
        </p>
      </div>
    </form>
  )
}
