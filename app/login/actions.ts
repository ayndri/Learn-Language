'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { tooManyAttempts, recordAttempt } from '@/lib/auth/throttle'

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim().toLowerCase()

  if (tooManyAttempts(username)) {
    return { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' }
  }

  try {
    await signIn('credentials', {
      username,
      password: String(formData.get('password') ?? ''),
      redirectTo: '/',
    })
    return {}
  } catch (err) {
    // signIn yang berhasil melempar NEXT_REDIRECT — itu bukan error, harus diteruskan.
    if (err instanceof AuthError) {
      recordAttempt(username)
      // Sengaja tidak membedakan "username tidak ada" dan "password salah".
      return { error: 'Username atau password salah.' }
    }
    throw err
  }
}
