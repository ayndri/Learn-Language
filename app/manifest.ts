import type { MetadataRoute } from 'next'

/**
 * Manifest supaya app-nya bisa dipasang di layar utama HP.
 *
 * Ini penting bukan karena keren: SRS hanya bekerja kalau dibuka SETIAP HARI.
 * App yang harus dicari lewat mengetik URL di browser jauh lebih mudah terlupa
 * daripada ikon di layar utama.
 *
 * `display: standalone` menghilangkan address bar — layarnya jadi lebih lega,
 * yang terasa nyata di HP saat mengerjakan simulasi 140 soal.
 *
 * Catatan: ikonnya SVG. Chrome menerimanya untuk ikon biasa, tapi untuk ikon
 * *maskable* (yang dipotong bulat/rounded oleh Android) idealnya PNG 512×512.
 * Belum dibuat karena butuh alat gambar — untuk sekarang cukup.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lingua Lab',
    short_name: 'Lingua Lab',
    description: 'Belajar bahasa dengan spaced repetition',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf7f5',
    theme_color: '#faf7f5',
    lang: 'id',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
