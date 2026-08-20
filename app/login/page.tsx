'use client'

import { useActionState } from 'react'
import { Logo } from '@/components/Logo'
import { login, type LoginState } from './actions'

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      {/* dua noda warna lembut di latar — bikin halaman kosong tidak terasa hampa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-brand-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-32 h-72 w-72 rounded-full bg-warn-soft blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={44} />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Lingua Lab</h1>
            <p className="mt-0.5 text-sm text-muted">Masuk untuk melanjutkan belajar.</p>
          </div>
        </div>

        <form action={formAction} className="card space-y-4 p-6">
          <div>
            <label htmlFor="username" className="field-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              autoFocus
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad"
            >
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  )
}
