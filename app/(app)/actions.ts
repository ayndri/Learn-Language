'use server'

import { redirect } from 'next/navigation'
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
 */
export async function switchLanguageAction(formData: FormData): Promise<void> {
  const userId = await requireUserId()
  const code = String(formData.get('code') ?? '').trim()

  const tracks = await listTracks(userId)
  if (!tracks.some((t) => t.code === code)) redirect('/')

  await rememberLanguage(code)
  redirect('/')
}
