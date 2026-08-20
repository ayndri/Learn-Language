import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

// Poppins bukan variable font, jadi bobotnya harus disebutkan eksplisit.
// next/font mengunduh & menghosting sendiri — tidak ada request ke Google saat runtime.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lingua Lab',
  description: 'Belajar bahasa dengan spaced repetition',
  robots: { index: false, follow: false }, // app pribadi — jangan diindeks
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Harus SAMA dengan --color-canvas di globals.css. Kalau beda, warna bar
  // browser di HP tidak menyambung dengan latar halaman dan kelihatan seperti
  // garis salah warna di atas layar.
  themeColor: '#faf7f5',
  // maximumScale sengaja tidak dibatasi — memblokir zoom itu masalah
  // aksesibilitas, dan di app berisi teks bahasa asing zoom sering dibutuhkan.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>{children}</body>
    </html>
  )
}
