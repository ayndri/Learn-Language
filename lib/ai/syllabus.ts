import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import type { ItemType } from '@/lib/items/types'

/**
 * Susun silabus: daftar pelajaran berurutan dari mudah ke sulit.
 *
 * Ini yang membuat pengguna tidak perlu memikirkan "hari ini belajar apa".
 * Dibuat SEKALI saat track dibuat, dan isinya cuma teks (judul + topik + fokus),
 * jadi murah — satu panggilan AI untuk seluruh jalur belajar.
 *
 * Materi & item per pelajaran digenerate belakangan, satu per satu, hanya saat
 * pelajaran itu benar-benar didatangi.
 */

const SYSTEM = [
  'Kamu perancang kurikulum bahasa untuk SATU pelajar dewasa berbahasa Indonesia.',
  'Susun urutan pelajaran yang benar secara pedagogis: prasyarat selalu lebih dulu.',
  'ATURAN KETAT:',
  '- Pelajaran pertama harus bisa dikerjakan orang yang benar-benar nol di bahasa itu.',
  '- Satu pelajaran = satu tema sempit yang bisa dituntaskan dalam 15 menit. Bukan bab buku.',
  '- Naikkan kesulitan secara bertahap, jangan melompat.',
  '- Judul ditulis dalam bahasa Indonesia, singkat, dan konkret.',
  '- Gunakan HANYA level dari daftar yang diberikan.',
  '- WAJIB mencakup progresi TENSES & struktur inti bahasa itu secara berurutan, bukan hanya tema situasional.',
  '  Untuk bahasa Inggris misalnya: to be → present simple → present continuous → past simple →',
  '  future (going to/will) → present perfect → comparative → modals → conditional.',
  '- Tiap pelajaran menyebutkan pola grammar yang dilatih di field `focus`, bukan cuma temanya.',
  '- Tujuan pelajar menentukan KONTEKS & kosakata pelajaran, bukan menggantikan progresi grammar.',
].join('\n')

const syllabusSchema = z.object({
  lessons: z
    .array(
      z.object({
        title: z.string().min(1).describe('Judul pelajaran dalam bahasa Indonesia, maks 6 kata'),
        topic: z
          .string()
          .min(1)
          .describe('Topik konkretnya untuk dipakai sebagai konteks generate materi'),
        focus: z
          .string()
          .min(1)
          .describe('Satu kalimat: pola grammar / kemampuan yang dilatih di pelajaran ini'),
        level: z.string().min(1).describe('Salah satu dari daftar level yang diberikan'),
      }),
    )
    .min(8)
    .max(20),
})

/**
 * Satu pelajaran dalam silabus.
 *
 * Tiga field terakhir hanya terisi untuk pelajaran dari kurikulum tetap —
 * silabus buatan AI tidak pernah menghasilkannya.
 *
 * `words`         daftar yang WAJIB tercakup (kosakata AWL, kanji, kana)
 * `wordListType`  jenis item yang dikendalikan daftar itu; tanpa ini, daftar
 *                 kanji akan ikut dipakai generator kosakata dan sebaliknya
 * `itemTypes`     jenis latihan yang dibuat untuk pelajaran ini. Kalau kosong,
 *                 dipakai semua jenis yang berlaku untuk bahasanya. Pelajaran
 *                 kana tidak butuh soal bacaan, pelajaran grammar tidak butuh
 *                 kartu kana — dan tiap jenis yang tidak perlu itu satu
 *                 panggilan AI yang terbuang.
 */
export type SyllabusLesson = z.infer<typeof syllabusSchema>['lessons'][number] & {
  words?: string[]
  wordListType?: ItemType
  itemTypes?: ItemType[]
  /** bagian materi tempat pelajaran ini muncul — lihat `lib/languages/strands.ts` */
  strand?: string
}

export type SyllabusRequest = {
  languageName: string
  nativeName: string
  startLevel: string
  levels: string[]
  goal?: string | null
  count?: number
}

export async function generateSyllabus(req: SyllabusRequest): Promise<SyllabusLesson[]> {
  const count = req.count ?? 16

  // Hanya level dari titik mulai ke atas — tidak ada gunanya menyusun pelajaran
  // di bawah level yang sudah dikuasai.
  const startIndex = Math.max(0, req.levels.indexOf(req.startLevel))
  const allowed = req.levels.slice(startIndex, startIndex + 3)

  const prompt = [
    `Bahasa: ${req.languageName} (${req.nativeName})`,
    `Level awal pelajar: ${req.startLevel}`,
    `Level yang boleh dipakai: ${allowed.join(', ')}`,
    req.goal ? `Tujuan pelajar: ${req.goal}` : 'Tujuan pelajar: penggunaan sehari-hari secara umum.',
    '',
    `Susun ${count} pelajaran berurutan, dari yang paling dasar.`,
    'Mulai dari hal yang paling sering dipakai lebih dulu, bukan dari yang paling mudah secara teori.',
    'Pastikan seluruh rangkaian membentuk progresi grammar yang utuh — kalau seseorang',
    'menyelesaikan semuanya, tenses inti dan struktur kalimat dasar harus sudah tercakup.',
  ].join('\n')

  const { lessons } = await ai().generate({
    task: 'lesson',
    schema: syllabusSchema,
    system: SYSTEM,
    prompt,
    temperature: 0.4,
  })

  // AI bisa mengarang level di luar daftar walau sudah diminta — jatuhkan ke level
  // terdekat yang valid daripada menyimpan nilai yang nanti gagal divalidasi.
  return lessons.map((l) => ({
    ...l,
    level: req.levels.includes(l.level) ? l.level : req.startLevel,
  }))
}
