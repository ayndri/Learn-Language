/**
 * Pembatas percobaan login — sederhana, in-memory.
 *
 * JUJUR SOAL BATASANNYA: di Vercel tiap serverless instance punya memori sendiri,
 * jadi ini bukan rate limit yang benar-benar global. Penyerang yang beruntung bisa
 * kena instance yang counter-nya masih kosong.
 *
 * Tetap berguna karena memotong percobaan brute force yang naif, dan biayanya nol.
 * Pertahanan yang SEBENARNYA di sini adalah passphrase panjang (dipaksa minimal 12
 * karakter di seed-user) plus bcrypt cost 12 yang membuat tiap percobaan mahal.
 *
 * Kalau nanti mau serius: pindahkan counter ini ke tabel Postgres atau Upstash Redis.
 */

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

const attempts = new Map<string, number[]>()

function recent(key: string, now: number): number[] {
  const list = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length === 0) attempts.delete(key)
  else attempts.set(key, list)
  return list
}

export function tooManyAttempts(username: string, now = Date.now()): boolean {
  return recent(username || '(kosong)', now).length >= MAX_ATTEMPTS
}

export function recordAttempt(username: string, now = Date.now()): void {
  const key = username || '(kosong)'
  attempts.set(key, [...recent(key, now), now])
}
