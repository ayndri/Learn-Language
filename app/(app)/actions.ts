'use server'

import { requireUserId } from '@/auth'
import { rememberLanguage } from '@/lib/study/active'
import { listTracks } from '@/lib/study/next'

/**
 * Pindah bahasa aktif dari dashboard.
 *
 * Berupa server action dengan `<form>`, bukan tombol client + fetch: tidak ada
 * state yang perlu dipegang di browser, dan pemilih bahasa jadi tetap berfungsi
 * sebelum JavaScript selesai dimuat.
 *
 * Kode bahasanya divalidasi terhadap jalur belajar MILIK pengguna, bukan
 * terhadap daftar bahasa aktif. Menyimpan kode bahasa yang jalurnya tidak dia
 * punya cuma menghasilkan dashboard yang diam-diam menampilkan bahasa lain
 * daripada yang tertulis di tombolnya.
 *
 * ==> JANGAN TAMBAHKAN `redirect('/')` DI SINI. <==
 *
 * Versi pertama melakukannya, dan akibatnya seluruh pemilih bahasa TIDAK
 * BERFUNGSI — tombolnya bisa diklik, tapi dashboard tetap menampilkan bahasa
 * yang sama. Gejalanya terlihat seperti tombol mati, padahal cookie-nya
 * tersimpan dengan benar.
 *
 * Sebabnya ada di dokumen Next 16 (`01-getting-started/07-mutating-data.md`):
 * menyetel cookie di dalam Server Action SUDAH membuat Next me-render ulang
 * halaman dan layout-nya di server supaya UI mencerminkan nilai cookie yang
 * baru. Tapi `redirect()` melempar control-flow exception yang memotong
 * mekanisme itu — dan karena tujuannya rute yang sama (`/`), browser menavigasi
 * memakai Router Cache dan menampilkan payload SEBELUM pindah bahasa.
 *
 * Jadi tidak ada yang perlu dilakukan setelah cookie disimpan: cukup selesai.
 * Untuk kode yang tidak sah pun cukup `return` — tidak ada yang berubah, jadi
 * tidak ada yang perlu di-render ulang.
 */
export async function switchLanguageAction(formData: FormData): Promise<void> {
  const userId = await requireUserId()
  const code = String(formData.get('code') ?? '').trim()

  const tracks = await listTracks(userId)
  if (!tracks.some((t) => t.code === code)) return

  await rememberLanguage(code)
}
