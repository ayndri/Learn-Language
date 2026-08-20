import { ai } from '@/lib/ai/provider'

/**
 * Generate materi penjelasan (Markdown) untuk satu unit.
 *
 * Ini bagian paling berisiko di seluruh aplikasi. Penjelasan grammar yang salah
 * tidak bisa dideteksi oleh pelajar pemula — dan SRS akan rajin mengulang yang salah.
 *
 * Karena itu prompt-nya sengaja MEMBATASI, bukan membebaskan:
 * - pendek dan berbasis pola, bukan esai teori (makin panjang, makin banyak ruang ngawur)
 * - dilarang mengarang aturan; kalau ragu, sederhanakan
 * - dilarang memakai istilah linguistik yang tidak dijelaskan
 */

const SYSTEM = [
  'Kamu menyusun materi belajar bahasa untuk SATU pelajar dewasa berbahasa Indonesia.',
  'Tulis dalam bahasa Indonesia yang lugas. Jelaskan pola, jangan berteori.',
  'ATURAN KETAT:',
  '- Jangan pernah mengarang aturan tata bahasa. Kalau sebuah pola punya banyak pengecualian, sebutkan pola utamanya saja dan katakan ada pengecualian.',
  '- Jangan pakai istilah linguistik tanpa menjelaskannya dalam tanda kurung.',
  '- Setiap contoh harus disertai terjemahan Indonesia.',
  '- Ringkas. Materi yang panjang tidak dibaca, dan makin panjang makin besar peluang keliru.',
].join('\n')

export type LessonRequest = {
  languageName: string
  nativeName: string
  topic: string
  level: string
  /** dari silabus: pola/kemampuan yang harus dilatih pelajaran ini */
  focus?: string | null
}

export async function generateLesson(req: LessonRequest): Promise<string> {
  const prompt = [
    `Bahasa yang dipelajari: ${req.languageName} (${req.nativeName})`,
    `Topik: ${req.topic}`,
    `Level: ${req.level}`,
    ...(req.focus ? [`Yang harus dikuasai setelah pelajaran ini: ${req.focus}`] : []),
    '',
    'Tulis materi singkat dalam Markdown dengan struktur TEPAT seperti ini:',
    '',
    '## Pola inti',
    'Maksimal 4 poin. Tiap poin: pola/rumusnya, lalu satu contoh + terjemahannya.',
    '',
    '## Contoh dalam kalimat',
    'Tepat 3 kalimat. Format: kalimat bahasa target — terjemahan Indonesia.',
    '',
    '## Gampang keliru',
    'Tepat 2 poin kesalahan yang umum dilakukan orang Indonesia pada topik ini, dengan bentuk yang benar.',
    '',
    'Jangan tulis judul utama (h1), jangan tulis pembuka atau penutup. Mulai langsung dari "## Pola inti".',
    'Total maksimal 250 kata.',
  ].join('\n')

  const md = await ai().generateText({ task: 'lesson', system: SYSTEM, prompt, temperature: 0.3 })
  return md.trim()
}
