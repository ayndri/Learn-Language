import { asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { languages } from '@/lib/db/schema'
import { listTracks } from '@/lib/study/next'
import { StartForm, type LanguageOption } from './StartForm'

/**
 * Batas durasi fungsi serverless.
 *
 * Default Vercel 10 detik, dan itu TIDAK cukup: satu panggilan Gemini butuh
 * 5-15 detik, dan koreksi tulisan bisa lebih. Tanpa ini, penyiapan pelajaran
 * dan generate soal akan gagal di produksi padahal jalan mulus di lokal.
 *
 * Server action mewarisi konfigurasi dari route tempat ia dipanggil, jadi
 * nilainya diset di halamannya, bukan di file action.
 */
export const maxDuration = 60

export default async function StartPage() {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  // Bahasa yang jalurnya sudah ada tidak ditawarkan lagi. Memulai ulang jalur
  // yang sama akan menumpuk silabus kedua di atas yang lama — 356 pelajaran
  // Jepang jadi 712, setengahnya kembar.
  const existing = await listTracks(userId)
  const taken = new Set(existing.map((t) => t.languageId))

  const rows = await db
    .select({
      id: languages.id,
      name: languages.name,
      nativeName: languages.nativeName,
      fieldTemplate: languages.fieldTemplate,
    })
    .from(languages)
    .where(eq(languages.enabled, true))
    .orderBy(asc(languages.sortOrder))

  const options: LanguageOption[] = rows
    .filter((r) => !taken.has(r.id))
    .map((r) => ({
      id: r.id,
      name: r.name,
      nativeName: r.nativeName,
      levels: r.fieldTemplate.levels,
    }))

  return (
    <main className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {existing.length > 0 ? 'Tambah bahasa' : 'Ayo mulai'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Jawab tiga hal, lalu jalur belajarmu disusun otomatis.
          </p>
        </div>
        {existing.length > 0 && (
          <Link href="/" className="btn-ghost btn-sm shrink-0">
            ← Dashboard
          </Link>
        )}
      </div>

      {existing.length > 0 && (
        <p className="text-[13px] text-faint">
          Sudah jalan: {existing.map((t) => t.name).join(', ')}. Jalur lama tetap utuh — kamu
          tinggal berpindah lewat pemilih bahasa di dashboard.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="card-dashed">
          Belum ada bahasa aktif. Jalankan{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5 text-xs">
            npm run db:seed-languages
          </code>
          .
        </p>
      ) : options.length === 0 ? (
        <p className="card-dashed">
          Semua bahasa yang aktif sudah punya jalur belajar. Mau bahasa lain? Aktifkan dulu di{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5 text-xs">lib/db/seed-languages.ts</code>.
        </p>
      ) : (
        <StartForm options={options} />
      )}
    </main>
  )
}
