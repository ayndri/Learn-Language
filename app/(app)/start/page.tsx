import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages } from '@/lib/db/schema'
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

  const options: LanguageOption[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    nativeName: r.nativeName,
    levels: r.fieldTemplate.levels,
  }))

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ayo mulai</h1>
        <p className="mt-1 text-sm text-muted">
          Jawab tiga hal, lalu jalur belajarmu disusun otomatis.
        </p>
      </div>

      {options.length === 0 ? (
        <p className="card-dashed">
          Belum ada bahasa aktif. Jalankan{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5 text-xs">
            npm run db:seed-languages
          </code>
          .
        </p>
      ) : (
        <StartForm options={options} />
      )}
    </main>
  )
}
