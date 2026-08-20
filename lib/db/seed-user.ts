/**
 * Bikin (atau ganti password) satu user.
 *
 *   npm run db:seed-user
 *
 * Isi SEED_USERNAME & SEED_PASSWORD di .env.local dulu, lalu HAPUS SEED_PASSWORD
 * setelah script ini jalan — password mentah tidak perlu tersimpan di mana pun.
 */
// Env dimuat lewat `tsx --env-file=.env.local` di package.json, BUKAN di sini:
// import ESM di-hoist ke atas, jadi loadEnv() di badan file akan jalan SETELAH
// lib/db dievaluasi — dan lib/db butuh DATABASE_URL saat diimpor.

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const MIN_PASSWORD_LENGTH = 12

async function main() {
  const username = (process.env.SEED_USERNAME ?? '').trim().toLowerCase()
  const password = process.env.SEED_PASSWORD ?? ''
  /**
   * Jalan keluar yang HARUS disengaja: `SEED_ALLOW_WEAK=1`.
   *
   * Pengamannya tidak dihapus, cuma dibuat bisa dilewati secara sadar. Password
   * pendek masuk akal selama app-nya cuma jalan di localhost. Yang berbahaya
   * adalah lupa menaikkannya SETELAH dideploy — halaman login terbuka di
   * internet, dan kuota AI menempel di belakangnya.
   */
  const allowWeak = process.env.SEED_ALLOW_WEAK === '1'

  if (!username) throw new Error('SEED_USERNAME kosong — isi dulu di .env.local')
  if (!password) throw new Error('SEED_PASSWORD kosong — isi dulu di .env.local')

  if (password.length < MIN_PASSWORD_LENGTH && !allowWeak) {
    throw new Error(
      `SEED_PASSWORD cuma ${password.length} karakter, minimal ${MIN_PASSWORD_LENGTH}. ` +
        'Halaman login ini akan terbuka di internet begitu dideploy — pakai passphrase panjang. ' +
        'Kalau memang cuma untuk dipakai di localhost, jalankan dengan SEED_ALLOW_WEAK=1.',
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const [user] = await db
    .insert(users)
    .values({ username, passwordHash })
    .onConflictDoUpdate({ target: users.username, set: { passwordHash } })
    .returning({ id: users.id, username: users.username })

  console.log(`✓ user siap: ${user.username} (${user.id})`)
  console.log('  Sekarang hapus SEED_PASSWORD dari .env.local.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
