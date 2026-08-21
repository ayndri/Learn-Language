'use client'

import { useActionState, useState } from 'react'
import { createUnit, type NewUnitState } from './actions'

export type LanguageOption = {
  id: string
  name: string
  nativeName: string
  levels: string[]
}

const initialState: NewUnitState = {}

export function UnitForm({ options }: { options: LanguageOption[] }) {
  const [state, formAction, pending] = useActionState(createUnit, initialState)
  const [languageId, setLanguageId] = useState(options[0]?.id ?? '')
  const [level, setLevel] = useState('')

  // Level ikut bahasa: CEFR untuk Inggris/Spanyol, JLPT untuk Jepang, 급 untuk
  // Korea, HSK untuk Mandarin.
  // Daftarnya datang dari field template di DB, tidak dihardcode di sini.
  const levels = options.find((o) => o.id === languageId)?.levels ?? []
  const activeLevel = levels.includes(level) ? level : (levels[0] ?? '')

  return (
    <form action={formAction} className="card space-y-5 p-5">
      <div>
        <span className="field-label">Bahasa</span>
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
        <label htmlFor="topic" className="field-label">
          Topik
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          required
          maxLength={80}
          placeholder="perkenalan, memesan makanan, academic writing…"
          className="input"
        />
        <p className="mt-1.5 text-xs text-faint">
          Makin spesifik topiknya, makin tepat materi dan itemnya.
        </p>
      </div>

      <div>
        <span className="field-label">Level</span>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              aria-pressed={activeLevel === l}
              className={`btn btn-sm border ${
                activeLevel === l
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line-strong bg-surface text-muted hover:border-brand hover:text-brand'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <input type="hidden" name="level" value={activeLevel} />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {state.error}
        </p>
      )}

      <div className="space-y-2 border-t border-line pt-4">
        <button type="submit" disabled={pending || !languageId} className="btn-primary w-full">
          {pending ? 'Membuat…' : 'Buat unit'}
        </button>
        <p className="text-xs text-faint">
          Materi dan latihannya disiapkan otomatis setelah ini. Pelajaran buatan sendiri
          tidak masuk ke jalur belajar utamamu.
        </p>
      </div>
    </form>
  )
}
