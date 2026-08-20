'use client'

import { useActionState, useState } from 'react'
import { importTextAction, type ImportState } from './actions'

const initialState: ImportState = {}
const MIN_CHARS = 200

export function ImportForm() {
  const [state, formAction, pending] = useActionState(importTextAction, initialState)
  const [text, setText] = useState('')
  const [count, setCount] = useState(12)

  const chars = text.trim().length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const tooShort = chars > 0 && chars < MIN_CHARS

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <div>
        <label htmlFor="text" className="field-label">
          Teks bahasa Inggris
        </label>
        <textarea
          id="text"
          name="text"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tempel abstrak, paragraf artikel, atau bagian buku…"
          className="input resize-y font-normal"
        />
        <p className={`mt-1.5 text-xs ${tooShort ? 'text-warn' : 'text-faint'}`}>
          {chars === 0
            ? `Minimal ${MIN_CHARS} karakter.`
            : tooShort
              ? `${chars} karakter — masih kurang ${MIN_CHARS - chars}.`
              : `${words} kata · ${chars} karakter`}
        </p>
      </div>

      <div>
        <span className="field-label">Berapa kata yang diambil</span>
        <div className="flex flex-wrap gap-2">
          {[8, 12, 16, 20].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              aria-pressed={count === n}
              className={`btn btn-sm border ${
                count === n
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line-strong bg-surface text-muted hover:border-brand hover:text-brand'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <input type="hidden" name="count" value={count} />
      </div>

      {state.error && (
        <p role="alert" className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {state.error}
        </p>
      )}

      {state.rejected && state.rejected.length > 0 && (
        <details className="rounded-2xl bg-warn-soft px-3 py-2 text-[13px] text-warn">
          <summary className="cursor-pointer font-medium">
            {state.rejected.length} kata dilewati — lihat alasannya
          </summary>
          <ul className="mt-2 space-y-1 pl-4">
            {state.rejected.map((r, i) => (
              <li key={i} className="list-disc">
                {r}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="space-y-2 border-t border-line pt-4">
        <button
          type="submit"
          disabled={pending || chars < MIN_CHARS}
          className="btn-primary w-full"
        >
          {pending ? 'Membaca teksmu…' : `Ambil ${count} kata`}
        </button>
        <p className="text-xs text-faint">
          Hasilnya langsung masuk antrean latihan harian, dijadwalkan sama seperti kosakata
          dari kurikulum.
        </p>
      </div>
    </form>
  )
}
