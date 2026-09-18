import { ai } from '@/lib/ai/provider'
import { readingFieldOf, type FieldTemplate } from '@/lib/languages/types'

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

/**
 * Aturan anotasi kata, disisipkan ke prompt.
 *
 * Ini yang membuat materi bahasa berkarakter asing bisa dibaca sejak pelajaran
 * pertama. Tanpa cara baca, satu kalimat Jepang di materi N5 adalah GAMBAR —
 * pelajarnya belum bisa mengeja apa pun dari situ, jadi contohnya tidak
 * mengajarkan apa-apa. Dan tanpa arti per kata, "私は学生です — Saya pelajar"
 * cuma memberi tahu arti KESELURUHANNYA; bagian mana yang berarti "saya" tetap
 * harus ditebak.
 *
 * Cara bacanya TIDAK ditulis di sini, tapi diambil dari template kosakata
 * bahasanya (`readingFieldOf`). Jadi Jepang otomatis diminta kana, Mandarin
 * pinyin bertanda nada, Korea romanisasi RR, Inggris IPA — dan Spanyol tidak
 * diminta apa pun, karena ejaannya sudah fonemis dan cara baca per kata hanya
 * akan mengulang kata yang sama. Satu daftar, satu tempat.
 */
function annotationRules(template: FieldTemplate, languageName: string, script: string): string[] {
  const reading = readingFieldOf(template)

  return [
    '',
    'ANOTASI KATA — WAJIB, dan ini bagian yang paling menentukan:',
    `- Setiap kata ${languageName} yang muncul di materi ditulis sebagai {{kata|cara baca|arti}}.`,
    ...(reading
      ? [`- Bagian "cara baca" memakai ${reading.label}${reading.hint ? ` (${reading.hint})` : ''}.`]
      : [
          '- Bahasa ini memakai aksara Latin dan ejaannya sudah menunjukkan bunyinya,',
          '  jadi bagian "cara baca" DIKOSONGKAN: {{kata||arti}}.',
        ]),
    '- Bagian "arti" ditulis dalam bahasa Indonesia, satu-dua kata saja, bukan kalimat.',
    '- Pada CONTOH KALIMAT, pecah PER KATA — satu {{...}} untuk tiap kata, bukan satu',
    '  {{...}} untuk seluruh kalimat. Inilah yang membuat pelajar bisa melihat bagian',
    '  mana yang berarti apa. Partikel dan imbuhan ikut dipecah sendiri.',
    '- Terjemahan utuh kalimatnya TETAP ditulis sesudahnya, di luar anotasi.',
    '- JANGAN memberi anotasi pada kata bahasa Indonesia. Hanya kata bahasa target.',
    '- Tanda baca ditulis di luar anotasi.',
    '',
    'Bentuk yang benar untuk bagian contoh kalimat:',
    '{{私|わたし|saya}}{{は|wa|partikel topik}}{{学生|がくせい|pelajar}}{{です|desu|adalah}}。 — Saya seorang pelajar.',
    ...ambiguityRules(script),
  ]
}

/**
 * Bidang KEEMPAT anotasi: catatan untuk kata yang tidak sesederhana kelihatannya.
 *
 * Tiga kasus, dan ketiganya sebenarnya satu masalah — satu bentuk tertulis yang
 * membawa lebih dari satu kemungkinan. Yang membuat ketiganya berbahaya juga
 * sama: pelajar tidak punya cara MENGETAHUI ada kemungkinan lain. Ia melihat
 * 行 dibaca xíng, lalu menghafalnya sebagai satu-satunya bacaan; ia melihat
 * 妈 mā, dan telinganya belum bisa membedakannya dari 马 mǎ.
 *
 * Aturan lintas bahasa hanya disisipkan untuk bahasa yang memakai aksara Han
 * (`script` japanese atau chinese), dan pasangannya ditentukan dari situ. Ini
 * perangkap yang HANYA kena orang yang belajar keduanya — dan aplikasi ini
 * memang membuat itu mudah terjadi, jadi ia ikut bertanggung jawab
 * memperingatkannya.
 */
function ambiguityRules(script: string): string[] {
  const han = script === 'japanese' || script === 'chinese'
  const other = script === 'japanese' ? 'Mandarin' : 'Jepang'

  return [
    '',
    'BIDANG KEEMPAT — catatan. Format lengkapnya {{kata|cara baca|arti|catatan}}.',
    'Isi bidang ini HANYA kalau salah satu dari ini berlaku, dan biarkan kosong kalau tidak:',
    '',
    '1. Kata itu punya BACAAN LAIN dengan arti berbeda. Sebutkan bacaan lain itu',
    '   beserta artinya. Contoh: {{行|xíng|jalan|juga háng = baris, deret}}',
    '',
    '2. Ada kata lain yang bunyinya HAMPIR SAMA dan mudah tertukar — beda nada,',
    '   beda panjang, atau beda satu bunyi saja. Sebutkan pembandingnya.',
    '   Contoh: {{妈|mā|ibu|bandingkan má 麻 rami · mǎ 马 kuda · mà 骂 memarahi}}',
    ...(han
      ? [
          '',
          `3. Kata itu ditulis dengan aksara yang SAMA di bahasa ${other} tapi artinya`,
          `   BERBEDA. Sebutkan arti di bahasa ${other} beserta tanda ⚠.`,
          '   Contoh: {{手紙|shǒuzhǐ|tisu toilet|⚠ di bahasa Jepang 手紙 (てがみ) = surat}}',
          `   Ini penting: pelajar aplikasi ini sering belajar ${other} sekaligus, dan`,
          '   kata seperti ini yang paling sering dipakai salah tanpa disadari.',
        ]
      : []),
    '',
    'Kalau pelajaran ini MEMANG tentang bunyi, nada, atau kata yang mudah tertukar,',
    'sajikan pasangan pembandingnya sebagai DAFTAR bersebelahan di bagian "Pola inti"',
    '— satu poin per kata, berurutan — supaya kontrasnya terlihat sekali pandang,',
    'bukan tersebar di beberapa alinea.',
  ]
}

export type LessonRequest = {
  languageName: string
  nativeName: string
  topic: string
  level: string
  /** dari silabus: pola/kemampuan yang harus dilatih pelajaran ini */
  focus?: string | null
  /** penentu cara baca macam apa yang diminta — lihat `annotationRules` */
  template: FieldTemplate
  /**
   * Sistem tulisan bahasanya ('japanese', 'chinese', 'latin', …).
   *
   * Dipakai untuk memutuskan perlu-tidaknya peringatan lintas bahasa: kata yang
   * ditulis dengan aksara Han yang sama bisa berarti lain di bahasa Han yang
   * lain, dan itu perangkap yang hanya ada di antara Jepang dan Mandarin.
   */
  script: string
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
    'Tepat 3 kalimat. Format: kalimat bahasa target (beranotasi per kata) — terjemahan Indonesia.',
    '',
    '## Gampang keliru',
    'Tepat 2 poin kesalahan yang umum dilakukan orang Indonesia pada topik ini, dengan bentuk yang benar.',
    '',
    'Jangan tulis judul utama (h1), jangan tulis pembuka atau penutup. Mulai langsung dari "## Pola inti".',
    'Total maksimal 250 kata.',
  ].join('\n')

  const md = await ai().generateText({
    task: 'lesson',
    system: [SYSTEM, ...annotationRules(req.template, req.languageName, req.script)].join('\n'),
    prompt,
    temperature: 0.3,
  })
  return md.trim()
}
