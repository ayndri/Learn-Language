import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUserId } from '@/auth'
import { db } from '@/lib/db'
import { languages } from '@/lib/db/schema'
import { getItemType, primaryKeyOf } from '@/lib/items/registry'
import type { ItemType } from '@/lib/items/types'
import { NEW_PER_DAY, buildQueue } from '@/lib/study/queue'
import { PracticeSession, type PracticeItem } from './PracticeSession'

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

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const userId = await currentUserId()
  if (!userId) redirect('/login')

  const { lang } = await searchParams
  if (!lang) redirect('/')

  const [language] = await db.select().from(languages).where(eq(languages.code, lang)).limit(1)
  if (!language) redirect('/')

  // Antrean dibangun oleh lib/study/queue — sumber kebenaran yang sama dengan
  // yang dipakai dashboard, jadi angka di tombol selalu cocok dengan isi sesi.
  const { rows, allowance } = await buildQueue(userId, language.id)

  const queue: PracticeItem[] = rows.map((r) => {
    // Label & instruksi diambil dari registry di SERVER, supaya komponen client
    // tidak perlu mengimpor registry (dan menarik Zod ke bundle browser).
    const def = getItemType(r.type as ItemType)
    let fields = r.fields as Record<string, unknown>

    if (def.grading === 'choice') {
      // KUNCI JAWABAN DIBUANG sebelum dikirim ke browser.
      //
      // `fields` itu jsonb yang dikirim apa adanya ke komponen client, dan untuk
      // item pilihan ganda kuncinya ada DI DALAM fields. Tanpa langkah ini,
      // jawaban benar bisa dibaca dari DevTools sebelum menjawab — dan latihan
      // yang jawabannya bisa dilihat bukan latihan.
      fields = Object.fromEntries(
        Object.entries(fields).filter(([k]) => k !== 'answer_index' && k !== 'explanation_id'),
      )
    }

    return {
      id: r.id,
      type: r.type,
      label: def.label,
      instruction: def.instruction,
      grading: def.grading,
      inputMode: def.inputMode ?? 'text',
      fields,
    }
  })

  if (queue.length === 0) {
    return (
      <main>
        <div className="card space-y-3 p-8 text-center">
          <p className="text-2xl">✓</p>
          <div>
            <p className="font-medium">Tidak ada yang perlu diulang</p>
            <p className="mt-1 text-[13px] text-muted">
              {language.name} sudah beres untuk sekarang.
              {allowance === 0 &&
                ` Kuota ${NEW_PER_DAY} item baru hari ini juga sudah terpakai — sengaja dibatasi supaya besok tidak menumpuk.`}
            </p>
          </div>
          <div className="pt-1">
            <Link href="/learn" className="btn-primary btn-sm">
              Lanjut ke pelajaran berikutnya
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <PracticeSession
        items={queue}
        vocabFields={language.fieldTemplate.vocab}
        primaryKey={primaryKeyOf(language.fieldTemplate)}
        ttsLang={language.ttsLang}
        script={language.script}
        languageName={language.name}
      />
    </main>
  )
}
