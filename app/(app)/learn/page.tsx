import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { activeLanguageCode } from '@/lib/study/active'
import { decideNext } from '@/lib/study/next'

/**
 * Satu pintu masuk: "Lanjutkan belajar".
 *
 * Halaman ini tidak menampilkan pilihan apa pun — ia memutuskan lalu mengarahkan.
 * Pengguna tidak perlu tahu apakah dia sedang mengulang atau memulai pelajaran baru.
 */
export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  // `?lang=` menang atas cookie: tombol di dashboard membawanya secara eksplisit,
  // jadi tombol yang bertuliskan "Ayo latihan" di bawah kartu Jepang tidak akan
  // pernah mendarat di latihan bahasa Inggris — sekalipun cookienya basi.
  const { lang } = await searchParams
  const next = await decideNext(userId, lang ?? (await activeLanguageCode()))

  switch (next.kind) {
    case 'onboard':
      redirect('/start')
    case 'practice':
      redirect(`/practice?lang=${next.languageCode}`)
    case 'lesson':
      redirect(`/unit/${next.unitId}`)
    case 'done':
      return (
        <main>
          <div className="card space-y-3 p-8 text-center">
            <p className="text-2xl">✓</p>
            <div>
              <p className="font-medium">Beres untuk hari ini</p>
              <p className="mt-1 text-[13px] text-muted">
                Tidak ada yang jatuh tempo, dan seluruh pelajaran {next.languageName} di jalurmu
                sudah selesai. Balik lagi besok — jadwal pengulangannya yang menentukan.
              </p>
            </div>
            <div className="pt-1">
              <Link href="/" className="btn-outline btn-sm">
                ← Dashboard
              </Link>
            </div>
          </div>
        </main>
      )
  }
}
