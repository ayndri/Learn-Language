import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import type { FieldTemplate } from '@/lib/languages/types'
import { getItemType } from '@/lib/items/registry'
import type { ItemType } from '@/lib/items/types'

/**
 * Generate item latihan untuk satu unit, satu jenis per panggilan.
 *
 * Sengaja satu jenis per request (bukan semua sekaligus): satu request besar
 * rawan kena limit token per menit, lambat, dan kalau gagal hilang semuanya.
 * Terpisah begini, gagal sebagian bisa diulang sebagian.
 */

const SYSTEM = [
  'Kamu menyusun bahan latihan bahasa untuk SATU pelajar berbahasa Indonesia.',
  'Semua penjelasan dan arti ditulis dalam bahasa Indonesia.',
  'ATURAN KETAT:',
  '- Patuhi level yang diminta. Kata di luar level itu membuat latihannya tidak berguna.',
  '- Jangan mengulang entri yang sudah ada di daftar "sudah dimiliki".',
  '- Kalau kamu tidak yakin sebuah bentuk itu benar, jangan pakai. Kurang banyak lebih baik daripada salah.',
].join('\n')

export type GeneratedItem = {
  fields: Record<string, unknown>
  tags: string[]
  dedupKey: string
}

export type GenerateItemsResult = {
  accepted: GeneratedItem[]
  /** Ditolak beserta alasannya — SELALU dilaporkan ke UI, tidak pernah dibuang diam-diam */
  rejected: { reason: string; preview: string }[]
}

export type GenerateItemsRequest = {
  languageName: string
  nativeName: string
  template: FieldTemplate
  type: ItemType
  topic: string
  level: string
  /** dari silabus: pola/kemampuan yang dilatih — menjaga item tetap pada sasaran */
  focus?: string | null
  /**
   * Kata yang WAJIB dipakai (pelajaran kosakata AWL).
   *
   * Kalau diisi, AI tidak boleh mengarang kata lain — cakupan kurikulum harus
   * bisa dihitung, bukan bergantung pada apa yang kebetulan muncul.
   */
  words?: string[] | null
  count: number
  /** dedupKey yang sudah dimiliki user untuk bahasa ini */
  existingKeys: Set<string>
}

export async function generateItems(req: GenerateItemsRequest): Promise<GenerateItemsResult> {
  const def = getItemType(req.type)
  const itemSchema = def.schema(req.template)

  // Gemini mengembalikan objek, bukan array telanjang — bungkus dalam properti `items`.
  const wrapper = z.object({
    items: z.array(itemSchema).min(1).max(Math.max(req.count, 1)),
  })

  const existing = [...req.existingKeys].slice(0, 200)
  const prompt = [
    `Bahasa: ${req.languageName} (${req.nativeName})`,
    `Topik: ${req.topic}`,
    `Level: ${req.level}`,
    ...(req.focus ? [`Fokus latihan: ${req.focus}`] : []),
    ...(req.words?.length
      ? [
          '',
          `WAJIB: pakai TEPAT kata-kata ini, satu entri per kata, jangan ganti dan jangan tambah:`,
          req.words.join(', '),
        ]
      : []),
    `Jumlah yang diminta: ${req.count}`,
    '',
    `Instruksi khusus jenis latihan ini: ${def.aiHint}`,
    '',
    existing.length
      ? `Sudah dimiliki (JANGAN diulang):\n${existing.join(', ')}`
      : 'Belum ada entri sebelumnya.',
  ].join('\n')

  const raw = await ai().generate({
    task: 'items',
    schema: wrapper,
    system: SYSTEM,
    prompt,
    temperature: 0.5,
  })

  const accepted: GeneratedItem[] = []
  const rejected: GenerateItemsResult['rejected'] = []
  const seen = new Set(req.existingKeys)

  for (const fields of raw.items as Record<string, unknown>[]) {
    const preview = String(fields.term ?? fields.sentence ?? JSON.stringify(fields)).slice(0, 60)

    // responseSchema membatasi BENTUK, bukan isi. Di sinilah isi yang tidak masuk
    // akal ketangkap — mis. cloze dengan dua lubang, atau jawaban yang sudah
    // kelihatan di kalimatnya. JSON-nya valid; itemnya sampah.
    const problems = def.check?.(fields) ?? []
    if (problems.length) {
      rejected.push({ reason: problems.join('; '), preview })
      continue
    }

    const dedupKey = def.dedupKey(fields)
    if (!dedupKey) {
      rejected.push({ reason: 'dedupKey kosong', preview })
      continue
    }
    if (seen.has(dedupKey)) {
      rejected.push({ reason: 'duplikat', preview })
      continue
    }

    seen.add(dedupKey)
    accepted.push({ fields, tags: def.tags(fields), dedupKey })
  }

  return { accepted, rejected }
}
