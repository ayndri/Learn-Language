import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '@/lib/db/schema'

/**
 * Koneksi database — dibuat SAAT DIPAKAI, bukan saat modulnya diimpor.
 *
 * Versi pertama memeriksa `DATABASE_URL` di badan modul dan melempar kalau kosong.
 * Itu terlihat aman, tapi bikin `next build` gagal:
 *
 *     Failed to collect page data for /api/auth/[...nextauth]
 *     DATABASE_URL belum diset — cek .env.local
 *
 * Next mengevaluasi modul tiap route saat build untuk membaca konfigurasinya.
 * Route auth mengimpor `auth.ts`, yang mengimpor file ini — jadi build ikut
 * menuntut connection string, padahal build tidak pernah menyentuh database.
 *
 * Akibatnya: build mustahil dijalankan tanpa kredensial produksi. Merepotkan di
 * CI, dan bikin deploy pertama ke Vercel gagal dengan pesan yang menyesatkan
 * (kelihatan seperti bug kode, padahal cuma env yang belum diisi).
 *
 * Sekarang koneksinya dibuat pada pemakaian pertama. Kalau env-nya memang belum
 * ada, errornya muncul saat request — di tempat yang bisa ditangani, bukan saat
 * kompilasi.
 */
let instance: NeonHttpDatabase<typeof schema> | null = null

function connect(): NeonHttpDatabase<typeof schema> {
  if (instance) return instance

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL belum diset. Di lokal: cek .env.local. ' +
        'Di Vercel: Settings → Environment Variables.',
    )
  }

  // Driver serverless + neon-http, bukan node-postgres: koneksi TCP yang
  // persisten tidak cocok di serverless (tiap invocation bisa instance berbeda).
  instance = drizzle(neon(url), { schema })
  return instance
}

/**
 * Proxy supaya pemakaiannya tetap `db.select()...` seperti biasa — tidak ada
 * satu pun callsite yang perlu diubah jadi `db().select()`.
 */
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const real = connect() as unknown as Record<string | symbol, unknown>
    const value = Reflect.get(real, prop, receiver)
    return typeof value === 'function' ? value.bind(real) : value
  },
})
