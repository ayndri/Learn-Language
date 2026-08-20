import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import { RATING, type Rating } from '@/lib/items/types'

/**
 * Koreksi karangan bebas.
 *
 * Ini satu-satunya jenis item yang butuh panggilan AI setiap kali dijawab — jadi
 * jumlahnya sengaja sedikit (2 per pelajaran). Sebagai gantinya, ini satu-satunya
 * latihan yang benar-benar melatih PRODUKSI bahasa, bukan pengenalan.
 *
 * Yang diminta bukan sekadar benar/salah, tapi versi perbaikan + alasan tiap
 * koreksi. Tanpa alasan, koreksi tidak mengajarkan apa pun.
 */

const SYSTEM = [
  'Kamu guru bahasa yang mengoreksi tulisan pelajar Indonesia.',
  'ATURAN KETAT:',
  '- Koreksi hanya yang benar-benar SALAH atau tidak wajar. Jangan mengubah gaya yang sudah benar.',
  '- Setiap koreksi harus disertai alasan singkat dalam bahasa Indonesia.',
  '- Nilai sesuai LEVEL pelajar. Kesalahan di luar level yang sedang dipelajari jangan dihitung berat.',
  '- Kalau tulisannya sudah benar, katakan begitu. Jangan mencari-cari kesalahan.',
  '- Kalau pelajar menulis dalam bahasa yang salah atau isinya tidak menjawab instruksi, beri skor 1.',
].join('\n')

const gradeSchema = z.object({
  score: z
    .number()
    .int()
    .min(1)
    .max(4)
    .describe(
      '1 = tidak menjawab instruksi atau banyak kesalahan mendasar, ' +
        '2 = maksudnya sampai tapi banyak yang perlu dibetulkan, ' +
        '3 = benar dengan sedikit kesalahan kecil, ' +
        '4 = benar dan terdengar wajar',
    ),
  corrected: z
    .string()
    .min(1)
    .describe('Versi perbaikan tulisan pelajar. Kalau sudah benar, tulis ulang apa adanya.'),
  notes_id: z
    .array(z.string().min(1))
    .max(5)
    .describe('Tiap poin: apa yang dibetulkan dan kenapa, dalam bahasa Indonesia. Kosong kalau sudah benar.'),
  praise_id: z
    .string()
    .min(1)
    .describe('Satu kalimat: hal yang sudah dilakukan dengan baik. Harus spesifik, bukan pujian kosong.'),
})

export type WritingFeedback = z.infer<typeof gradeSchema>

export type GradeWritingRequest = {
  languageName: string
  level: string
  promptId: string
  guidanceId?: string | null
  minWords: number
  answer: string
}

export async function gradeWriting(req: GradeWritingRequest): Promise<WritingFeedback> {
  const prompt = [
    `Bahasa yang dipelajari: ${req.languageName}`,
    `Level pelajar: ${req.level}`,
    `Instruksi yang diberikan: ${req.promptId}`,
    req.guidanceId ? `Arahan: ${req.guidanceId}` : '',
    `Panjang minimal yang diminta: ${req.minWords} kata`,
    '',
    'Tulisan pelajar:',
    '"""',
    req.answer,
    '"""',
  ]
    .filter(Boolean)
    .join('\n')

  return ai().generate({
    // Koreksi harus akurat — pakai model yang lebih kuat, sama seperti materi.
    task: 'lesson',
    schema: gradeSchema,
    system: SYSTEM,
    prompt,
    temperature: 0.2,
  })
}

/**
 * Skor rubrik → rating FSRS.
 *
 * Pemetaannya langsung karena rubriknya sudah dirancang untuk empat tingkat yang
 * sama artinya dengan Again/Hard/Good/Easy.
 */
export function scoreToRating(score: number): Rating {
  if (score <= 1) return RATING.Again
  if (score === 2) return RATING.Hard
  if (score === 3) return RATING.Good
  return RATING.Easy
}
