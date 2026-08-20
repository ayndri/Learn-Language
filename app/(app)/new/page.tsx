import { asc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { db } from '@/lib/db'
import { languages } from '@/lib/db/schema'
import { UnitForm, type LanguageOption } from './UnitForm'

export default async function NewUnitPage() {
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
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Pelajaran sendiri</h1>
          <p className="text-[13px] text-muted">
            Di luar jalur belajarmu — untuk topik spesifik yang kamu memang mau.
          </p>
        </div>
        <Link href="/" className="btn-ghost btn-sm shrink-0">
          ← Dashboard
        </Link>
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
        <UnitForm options={options} />
      )}
    </main>
  )
}
