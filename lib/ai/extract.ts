import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import type { FieldTemplate } from '@/lib/languages/types'

/**
 * Ambil kosakata yang layak dipelajari dari teks yang kamu tempel sendiri.
 *
 * Ini yang membuat app-nya bisa mengikuti bacaanmu, bukan cuma kurikulum bawaan.
 * Untuk konteks akademik (abstrak jurnal, artikel), justru kosakata dari paper
 * yang beneran kamu baca yang paling terpakai.
 *
 * Yang dihindari: mengambil kata yang terlalu umum. Kartu untuk "the" atau "study"
 * cuma jadi sampah di antrean harian, dan sampah di antrean membuat SRS terasa
 * membuang waktu.
 */

const SYSTEM = [
  'Kamu membantu satu pelajar Indonesia membangun kosakata dari teks yang dia baca.',
  'ATURAN KETAT:',
  '- Ambil HANYA kata yang layak dihafal: cukup umum untuk berguna lagi, cukup jarang untuk belum dikuasai.',
  '- JANGAN ambil 1.000 kata paling umum (the, make, good, study, people) — itu sudah dikuasai.',
  '- JANGAN ambil nama orang, nama tempat, angka, atau singkatan khusus bidang tertentu.',
  '- Bentuk dasarnya yang diambil (running → run), bukan bentuk yang muncul di teks.',
  '- Contoh kalimat diambil ATAU diadaptasi dari teks aslinya, supaya konteksnya nyata.',
  '- Arti dan penjelasan dalam bahasa Indonesia.',
].join('\n')

export type ExtractRequest = {
  languageName: string
  template: FieldTemplate
  text: string
  /** berapa kata yang diminta */
  count: number
  /** dedupKey yang sudah dimiliki — supaya tidak mengambil yang sudah ada */
  existingTerms: Set<string>
}

export type ExtractResult = {
  title: string
  items: Record<string, unknown>[]
  rejected: string[]
}

export async function extractVocabulary(req: ExtractRequest): Promise<ExtractResult> {
  // Schema vocab-nya dibangun dari field template bahasanya — sama seperti
  // generator biasa, jadi kartunya identik dengan kartu dari kurikulum.
  const shape: Record<string, z.ZodType> = {}
  for (const f of req.template.vocab) {
    const base = f.enum ? z.enum(f.enum as [string, ...string[]]) : z.string().min(1)
    shape[f.key] = f.required ? base.describe(f.label) : base.describe(f.label).optional()
  }

  const schema = z.object({
    title: z
      .string()
      .min(1)
      .describe('Judul singkat berbahasa Indonesia yang menggambarkan isi teks, maks 6 kata'),
    words: z.array(z.object(shape)).min(1).max(Math.max(req.count, 1)),
  })

  const known = [...req.existingTerms].slice(0, 200)
  const trimmed = req.text.slice(0, 12_000)

  const result = await ai().generate({
    task: 'items',
    schema,
    system: SYSTEM,
    prompt: [
      `Bahasa teks: ${req.languageName}`,
      `Ambil maksimal ${req.count} kata yang paling layak dipelajari.`,
      known.length ? `Sudah dikuasai, JANGAN diambil: ${known.join(', ')}` : '',
      '',
      'TEKS:',
      '"""',
      trimmed,
      '"""',
    ]
      .filter(Boolean)
      .join('\n'),
    temperature: 0.3,
  })

  const primary = req.template.vocab.find((f) => f.primary)?.key ?? 'term'
  const rejected: string[] = []
  const items: Record<string, unknown>[] = []
  const seen = new Set(req.existingTerms)

  for (const w of result.words as Record<string, unknown>[]) {
    const term = String(w[primary] ?? '').trim().toLowerCase()
    if (!term) {
      rejected.push('kata tanpa bentuk dasar')
      continue
    }
    if (seen.has(term)) {
      rejected.push(`${term} — sudah dimiliki`)
      continue
    }
    // Kata yang tidak ada di teksnya berarti dikarang, bukan diambil.
    if (!trimmed.toLowerCase().includes(term.slice(0, Math.max(4, term.length - 3)))) {
      rejected.push(`${term} — tidak ditemukan di teks`)
      continue
    }
    seen.add(term)
    items.push(w)
  }

  return { title: result.title, items, rejected }
}
