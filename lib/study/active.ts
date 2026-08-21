import { cookies } from 'next/headers'

/**
 * BAHASA YANG SEDANG AKTIF
 *
 * Satu orang boleh punya beberapa jalur belajar sekaligus. Dashboard, `/learn`,
 * dan latihan harian tetap harus menunjukkan SATU — kalau semuanya ditampilkan
 * sederajat, "satu tombol yang jelas" hilang dan pengguna kembali harus memilih
 * tiap hari.
 *
 * Pilihannya disimpan di cookie, bukan di URL. Alasannya sederhana: kalau cuma
 * di URL, membuka aplikasi dari layar utama HP besok pagi selalu mendarat di
 * bahasa pertama — dan bahasa yang sedang serius dipelajari justru yang paling
 * sering dibuka.
 *
 * Cookie ini hanya PREFERENSI TAMPILAN, bukan otorisasi. Isinya tidak pernah
 * dipercaya begitu saja: `resolveTrack` mencocokkannya dengan jalur milik
 * pengguna, dan kode yang tidak cocok jatuh ke jalur pertama.
 */
export const ACTIVE_LANG_COOKIE = 'll_lang'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function activeLanguageCode(): Promise<string | null> {
  const store = await cookies()
  return store.get(ACTIVE_LANG_COOKIE)?.value ?? null
}

/**
 * Simpan pilihan bahasa.
 *
 * Hanya bisa dipanggil dari Server Action atau Route Handler — Next tidak
 * mengizinkan menulis cookie saat halaman sedang dirender.
 */
export async function rememberLanguage(code: string): Promise<void> {
  const store = await cookies()
  store.set(ACTIVE_LANG_COOKIE, code, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    httpOnly: true,
  })
}
