import { and, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { items, languages, units } from '@/lib/db/schema'
import { hasAnnotations } from '@/lib/items/annotate'
import { itemPreview } from '@/lib/items/preview'
import {
  ITEM_REGISTRY,
  generatedItemTypes,
  implementedItemTypes,
  primaryKeyOf,
} from '@/lib/items/registry'
import { levelStyle } from '@/lib/languages/levels'
import { EditItems, type EditableItem } from './EditItems'
import { EditLesson } from './EditLesson'
import { PrepareUnit } from './PrepareUnit'

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

export default async function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const { id } = await params

  const [row] = await db
    .select({ unit: units, language: languages })
    .from(units)
    .innerJoin(languages, eq(languages.id, units.languageId))
    .where(and(eq(units.id, id), eq(units.userId, userId)))
    .limit(1)

  if (!row) notFound()

  const template = row.language.fieldTemplate
  // Rencana item pelajaran ini, kalau silabusnya menentukan. Selalu disaring
  // ulang terhadap kemampuan bahasanya — rencana yang menyebut jenis yang tidak
  // berlaku (mis. `kanji` untuk bahasa Inggris) diabaikan, bukan dipercaya.
  const planned = row.unit.itemPlan?.length
    ? template.itemTypes.filter((t) => row.unit.itemPlan!.includes(t))
    : template.itemTypes
  // Jenis yang berlaku = irisan antara yang direncanakan untuk unit ini dan yang
  // sudah diimplementasikan di registry. Tidak ada daftar hardcoded di sini.
  const usable = planned
    .filter((t) => implementedItemTypes().includes(t))
    .map((type) => ({ type, label: ITEM_REGISTRY[type]?.label ?? type }))
  // Yang digenerate AI saja — `listening` diturunkan dari kalimat & ungkapan.
  const generated = generatedItemTypes({ ...template, itemTypes: planned }).map((type) => ({
    type,
    label: ITEM_REGISTRY[type]?.label ?? type,
  }))

  const lv = levelStyle(row.unit.level, template.levels)

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <span className={`badge ${lv.soft} ${lv.text}`}>{row.unit.level}</span>
          <span>
            Pelajaran {row.unit.position + 1} · {row.language.name}
          </span>
        </p>
        <h1 className="mt-1.5 truncate text-lg font-bold tracking-tight">{row.unit.title}</h1>
      </div>
      <Link href="/" className="btn-ghost btn-sm shrink-0">
        ← Dashboard
      </Link>
    </div>
  )

  // Belum disiapkan → siapkan sendiri sekarang. Pengguna tidak menekan apa pun.
  if (row.unit.status === 'planned' || !row.unit.lessonMd) {
    return (
      <main className="space-y-5">
        {header}
        <PrepareUnit
          unitId={id}
          itemTypes={generated}
          hasDerived={planned.includes('listening') || planned.includes('speaking')}
          title={row.unit.title}
        />
      </main>
    )
  }

  const itemRows = await db
    .select({ id: items.id, type: items.type, fields: items.fields })
    .from(items)
    .where(and(eq(items.unitId, id), eq(items.userId, userId)))

  const primary = primaryKeyOf(template)
  const editable: EditableItem[] = itemRows.map((r) => ({
    id: r.id,
    type: r.type,
    label: ITEM_REGISTRY[r.type as keyof typeof ITEM_REGISTRY]?.label ?? r.type,
    preview: itemPreview(r.fields as Record<string, unknown>, primary),
    fields: r.fields as Record<string, unknown>,
  }))

  const counts = usable
    .map((u) => ({ ...u, n: itemRows.filter((r) => r.type === u.type).length }))
    .filter((u) => u.n > 0)

  return (
    <main className="space-y-6">
      {header}

      {row.unit.focus && (
        <p className="rounded-xl bg-brand-soft px-4 py-3 text-[13px] text-brand">
          <span className="font-medium">Target: </span>
          {row.unit.focus}
        </p>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-wide text-faint uppercase">Materi</h2>
          {!row.unit.lessonEdited && (
            <span
              title="Materi ini belum kamu periksa. Untuk bahasa yang kamu mulai dari nol, cek sekali ke referensi tepercaya."
              className="badge bg-warn-soft text-warn"
            >
              belum diverifikasi
            </span>
          )}
        </div>

        <EditLesson
          unitId={id}
          initial={row.unit.lessonMd}
          verified={row.unit.lessonEdited}
          ttsLang={row.language.ttsLang}
          languageName={row.language.name}
          hasAnnotations={hasAnnotations(row.unit.lessonMd)}
        />
      </section>

      <EditItems items={editable} />

      <div className="card space-y-3 p-5">
        <p className="text-sm">Sudah dibaca? Latihannya mencakup:</p>
        <ul className="flex flex-wrap gap-2">
          {counts.map((c) => (
            <li key={c.type} className="badge bg-canvas text-muted">
              {c.label}
              <span className="ml-1.5 font-semibold text-ink">{c.n}</span>
            </li>
          ))}
        </ul>
        <Link href={`/practice?lang=${row.language.code}`} className="btn-primary w-full">
          Mulai latihan
        </Link>
      </div>
    </main>
  )
}
