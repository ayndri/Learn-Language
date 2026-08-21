import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import {
  checkChoice,
  splitDialogue,
  type GenerateExamResult,
  type GeneratedQuestion,
} from '@/lib/ai/exam-shared'
import type { BlockType, BlueprintBlock } from '@/lib/exam/formats'

/**
 * GENERATOR SOAL SIMULASI DELE
 *
 * Tiga hal yang membedakannya dari generator TOEFL, JLPT, TOPIK, dan HSK:
 *
 * 1. **Tingkatnya CEFR, dan itu langsung bisa dipakai sebagai perintah.** JLPT
 *    dan HSK harus diterjemahkan dulu ("N3 setara…", "600 kata pertama"), tapi
 *    "tulis teks setingkat B2" adalah kalimat yang sudah punya arti presisi —
 *    CEFR mendefinisikan apa yang bisa dilakukan pemakai bahasa di tiap
 *    tingkat, bukan cuma berapa katanya. Itu keuntungan yang dipakai di sini.
 *
 * 2. **Ragam wilayah harus diminta secara sadar.** Dua puluh negara memakai
 *    bahasa ini, dan DELE menerima semuanya. Tapi satu paket soal yang
 *    mencampur `vosotros` Spanyol dengan `vos` Argentina di teks yang sama
 *    terbaca seperti kesalahan, bukan keberagaman. Jadi tiap paket memilih SATU
 *    ragam dan konsisten di dalamnya, sementara antar paket ragamnya bergilir.
 *
 * 3. **Tidak ada bagian lisan.** Prueba 4 (expresión e interacción orales)
 *    tidak dibuat — lihat catatan panjang di `lib/exam/formats.ts`. Yang ada di
 *    sini tiga prueba: lectura, auditiva, dan escritura.
 */

const SYSTEM = (exam: string, can: string, variety: string) =>
  [
    `Kamu penyusun soal ${exam} (Instituto Cervantes) yang berpengalaman.`,
    'Soal ditulis dalam bahasa Spanyol. PENJELASAN jawaban ditulis dalam bahasa Indonesia.',
    'ATURAN KETAT:',
    `- Tingkatnya ${exam}: ${can}. Kosakata dan struktur di luar tingkat itu membuat soalnya tidak mengukur apa pun.`,
    `- Pakai ragam ${variety} dan KONSISTEN di seluruh soal ini. Jangan mencampur vosotros dan ustedes dalam satu teks.`,
    '- Tepat satu pilihan yang benar. Pengecoh harus masuk akal, bukan konyol.',
    '- Jangan buat pilihan yang duplikat atau bermakna sama.',
    '- Tulis bahasa Spanyol yang wajar. Kalimat hasil terjemahan harfiah dari bahasa Inggris terasa aneh.',
    '- Pakai tanda tanya dan tanda seru pembuka (¿ ¡) serta tanda aksen dengan benar. Teks tanpa aksen bukan bahasa Spanyol.',
    '- Penjelasan menyebut ALASANNYA, bukan sekadar "karena itu yang benar".',
    '- Sebar tingkat kesulitan dalam satu paket: ada yang mudah, ada yang sulit.',
  ].join('\n')

/**
 * Deskriptor CEFR, dipakai apa adanya di dalam prompt.
 *
 * Ditulis sebagai kemampuan ("bisa melakukan apa"), bukan sebagai daftar
 * struktur, karena itu memang cara CEFR mendefinisikan tingkat — dan karena
 * "bisa memahami inti berita radio" menghasilkan soal yang jauh lebih tepat
 * sasaran daripada "pakai subjuntivo".
 */
const CAN_DO: Record<string, string> = {
  A1: 'ungkapan sehari-hari paling dasar, kalimat sangat pendek, presente saja, topik: diri sendiri, keluarga, tempat, harga',
  A2: 'kalimat sederhana tentang hal yang akrab (belanja, pekerjaan, keluarga), pretérito dan futuro dengan ir a',
  B1: 'teks sehari-hari yang jelas, bisa bercerita dan menjelaskan rencana, sudah memakai subjuntivo dasar dan condicional',
  B2: 'teks kompleks tentang topik konkret maupun abstrak, argumen yang runtut, subjuntivo penuh',
  C1: 'teks panjang dan menuntut, makna tersirat, bahasa lentur untuk keperluan akademik dan profesional',
  C2: 'apa pun yang dibaca dan didengar, termasuk idiom, nuansa halus, dan teks dengan struktur padat',
}

/**
 * Ragam yang dipakai satu paket soal.
 *
 * Digilir menurut nomor kelompok supaya satu simulasi tidak selalu memakai
 * ragam Spanyol, tapi tetap konsisten DI DALAM satu paket. DELE menerima semua
 * ragam, dan pelajar yang cuma pernah mendengar satu ragam akan kaget di ujian
 * sungguhan.
 */
const VARIETIES = [
  'español de España (vosotros, distinción c/z)',
  'español de México (ustedes, seseo)',
  'español rioplatense de Argentina (voseo: vos tenés, ustedes)',
  'español de Colombia (ustedes, seseo, usted yang lazim antarteman)',
  'español de España (vosotros, distinción c/z)',
  'español de Chile (ustedes, seseo)',
]

const baseQuestion = {
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).length(4).describe('Tepat empat pilihan, urutan A B C D'),
  answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = A'),
  explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
}

// ---------------------------------------------------------------------------
// Comprensión de lectura & auditiva — soal pilihan ganda berdiri sendiri
// ---------------------------------------------------------------------------

type StandaloneSpec = {
  name: string
  rules: string[]
  task: string
  /** naskah yang dibacakan TTS; kalau ada, soal ini masuk bagian auditiva */
  audio?: 'dialog' | 'mono'
  check?: (q: { stem: string; options: string[] }) => string[]
}

const hasBlank = (s: string) => /_{3,}|\(\s*\)|\[\s*\]/.test(s)

const STANDALONE: Partial<Record<BlockType, StandaloneSpec>> = {
  es_read_notice: {
    name: 'anuncios y carteles',
    rules: [
      '- `stem` berisi satu bahan informasi pendek yang benar-benar ditemui di jalan: papan pengumuman, ' +
        'iklan, jadwal, catatan tempel, atau pesan singkat — ditulis dalam baris terpisah, bukan paragraf.',
      '- Pertanyaannya menanyakan informasi PRAKTIS: di mana, kapan, berapa, boleh atau tidak.',
      '- Tiga pengecoh harus bisa dibantah dari bahan itu sendiri, bukan dari pengetahuan umum.',
    ],
    task: 'Tiap soal: satu papan/iklan/pesan, satu pertanyaan, empat pilihan.',
  },
  es_read_match: {
    name: 'relacionar textos y enunciados',
    rules: [
      '- `stem` berisi SATU teks pendek (iklan singkat, profil orang, atau kebutuhan seseorang).',
      '- Empat pilihan adalah pernyataan/kebutuhan; tepat satu yang cocok dengan teks itu.',
      '- Kecocokannya ditentukan ISI, bukan kata yang sama-sama muncul — pengecoh justru sebaiknya ' +
        'memakai kata yang ada di teks tapi salah maksudnya.',
    ],
    task: 'Tiap soal: satu teks pendek, empat pernyataan.',
  },
  es_read_blank: {
    name: 'uso de la lengua',
    rules: [
      '- `stem` berisi satu kalimat atau teks pendek dengan satu bagian kosong ditulis "______".',
      '- Empat pilihan menguji SATU hal: pilihan modus (indicativo vs subjuntivo), preposisi, ' +
        'kala, pronomina, kata penghubung, atau kolokasi. Sebar jenisnya antar soal.',
      '- Yang menentukan jawaban harus konteksnya, bukan tebakan tata bahasa asal.',
      '- Semua pilihan harus BERBENTUK BENAR sebagai kata; yang salah adalah pemakaiannya di kalimat itu.',
    ],
    task: 'Tiap soal: teks dengan satu "______", empat pilihan pengisi.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong "______"']),
  },
  es_listen_notice: {
    name: 'mensajes y avisos',
    audio: 'mono',
    rules: [
      '- `audio_script` berisi satu pesan monolog: pesan suara, pengumuman stasiun, atau iklan radio. ' +
        'Tanpa penanda pembicara.',
      '- Pertanyaannya menanyakan informasi praktis dari pesan itu.',
      '- Jawabannya harus berupa parafrasa, bukan pengulangan kata yang terdengar.',
    ],
    task: 'Tiap soal: satu pesan pendek, satu pertanyaan, empat pilihan.',
  },
  es_listen_short: {
    name: 'diálogos breves',
    audio: 'dialog',
    rules: [
      '- `audio_script` berisi percakapan 2–6 giliran; tiap giliran diawali "Hombre:" atau "Mujer:".',
      '- Yang ditanyakan: maksud pembicara, hubungan mereka, tempat, atau apa yang akan dilakukan.',
      '- Jawabannya harus berupa simpulan atau parafrasa, bukan pengulangan kata yang terdengar.',
    ],
    task: 'Tiap soal: satu percakapan, satu pertanyaan, empat pilihan.',
  },
}

async function generateStandalone(
  type: BlockType,
  exam: string,
  can: string,
  variety: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = STANDALONE[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          ...(spec.audio
            ? { audio_script: z.string().min(1).describe('Naskah yang dibacakan, bahasa Spanyol') }
            : {}),
          ...baseQuestion,
        }),
      )
      .min(1),
  })

  const { questions } = await ai().generate({
    task: 'items',
    schema,
    system: [SYSTEM(exam, can, variety), ...spec.rules].join('\n'),
    prompt: [
      `Buat ${count} soal ${exam} 「${spec.name}」.`,
      spec.task,
      'Variasikan tempat, pembicara, dan topiknya antar soal.',
    ].join('\n'),
    temperature: 0.68,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []

  for (const q of questions) {
    const problems = [...checkChoice(q), ...(spec.check?.(q) ?? [])]
    const script = 'audio_script' in q ? String(q.audio_script) : null

    // Soal menyimak TANPA naskah adalah kegagalan yang paling mahal di seluruh
    // modul ini, karena ia tidak terlihat seperti kegagalan: soalnya lolos, lalu
    // halaman ujian menampilkan stem-nya sebagai teks — dan bagian menyimak
    // berubah jadi bagian membaca tanpa satu pun error.
    //
    // Ini bukan kemungkinan teoretis. Versi pertama file ini lupa menandai
    // `audio` pada kedua spec 听力 DELE, jadi `audio_script` tidak pernah masuk
    // schema. Yang ketahuan lewat `npm run ai:smoke` cuma `es_listen_short`,
    // karena cuma dia yang punya pemeriksa percakapan; `es_listen_notice` lolos
    // mulus sebagai soal bacaan. Pemeriksa inilah yang seharusnya ada sejak awal.
    if (spec.audio && !script) problems.push('soal menyimak tanpa naskah audio')

    // Percakapan satu giliran bukan percakapan, dan soalnya jadi tidak terjawab.
    const turns = script ? splitDialogue(script) : []
    if (type === 'es_listen_short' && script && turns.length < 2) {
      problems.push(`naskah bukan percakapan: "${script?.slice(0, 40)}…"`)
    }

    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 40)} — ${problems.join('; ')}`)
      continue
    }

    standalone.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      audioScript: script ? (turns.length > 1 ? turns.join('\n') : script) : undefined,
    })
  }

  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// Audios largos — satu rekaman, beberapa soal
// ---------------------------------------------------------------------------

async function generateTalk(
  exam: string,
  can: string,
  variety: string,
  level: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const topics = [
    'una entrevista de radio',
    'un boletín de noticias',
    'una conferencia breve',
    'un programa cultural',
    'una tertulia entre dos personas',
    'un reportaje',
    'una presentación de empresa',
    'un podcast divulgativo',
  ]
  const topic = topics[index % topics.length]
  const long = level === 'C1' || level === 'C2'

  const schema = z.object({
    title: z.string().min(1).describe('Judul singkat dalam bahasa Spanyol'),
    script: z
      .string()
      .min(1)
      .describe('Naskah yang dibacakan. Kalau berupa dialog, tiap giliran diawali "Hombre:" atau "Mujer:".'),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, can, variety),
      `- Bentuknya ${topic}: satu rekaman, lalu beberapa soal tentang isinya.`,
      long ? '- Panjang naskah 300–450 kata.' : '- Panjang naskah 150–250 kata.',
      '- Sebar jenis pertanyaan: gagasan utama, detail, sikap pembicara, dan maksud tersirat.',
      '- Semua soal harus terjawab HANYA dari isi rekaman itu.',
    ].join('\n'),
    prompt: `Buat ${topic} untuk ${exam} comprensión auditiva beserta ${perGroup} soal.`,
    temperature: 0.65,
  })

  const rejected: string[] = []
  const questions: GeneratedQuestion[] = []
  const turns = splitDialogue(g.script)
  const script = turns.length > 1 ? turns.join('\n') : g.script

  for (const q of g.questions) {
    const problems = checkChoice(q)
    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 40)} — ${problems.join('; ')}`)
      continue
    }
    questions.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      // Naskah ditempel ke tiap soal, bukan disimpan sebagai kelompok: bagian
      // menyimak tidak boleh menampilkan teksnya sebagai bacaan.
      audioScript: script,
    })
  }

  return { standalone: questions, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// Comprensión de lectura — satu bacaan, beberapa soal
// ---------------------------------------------------------------------------

async function generateReading(
  exam: string,
  can: string,
  variety: string,
  level: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const advanced = level === 'B2' || level === 'C1' || level === 'C2'
  const topics = advanced
    ? ['medio ambiente', 'tecnología y sociedad', 'educación', 'salud pública', 'economía', 'migración', 'patrimonio cultural', 'psicología', 'ciudad y transporte', 'medios de comunicación']
    : ['viajes', 'la familia', 'el trabajo', 'la comida', 'un barrio', 'el deporte', 'una fiesta local', 'la vida diaria', 'los estudios', 'una anécdota']
  const topic = topics[index % topics.length]

  const schema = z.object({
    title: z.string().min(1),
    body: z
      .string()
      .min(1)
      .describe(advanced ? 'Bacaan 350–500 kata' : 'Bacaan 150–250 kata'),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, can, variety),
      '- Satu bacaan dipakai untuk beberapa soal.',
      advanced
        ? '- Sebar jenis soal: maksud penulis, sikap penulis, informasi yang sesuai, makna ungkapan dalam konteks, dan simpulan.'
        : '- Sebar jenis soal: informasi yang sesuai, alasan, dan gagasan utama.',
      '- Semua soal harus terjawab HANYA dari bacaan itu, bukan dari pengetahuan umum.',
    ].join('\n'),
    prompt: `Buat satu bacaan ${exam} comprensión de lectura tentang ${topic}, beserta ${perGroup} soal.`,
    temperature: 0.62,
  })

  const rejected: string[] = []
  const questions: GeneratedQuestion[] = []
  for (const q of g.questions) {
    const problems = checkChoice(q)
    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 40)} — ${problems.join('; ')}`)
      continue
    }
    questions.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
    })
  }

  if (!questions.length) return { standalone: [], groups: [], rejected }
  return {
    standalone: [],
    groups: [{ kind: 'passage', title: g.title, body: g.body, questions }],
    rejected,
  }
}

// ---------------------------------------------------------------------------
// Expresión escrita — soal karangan
// ---------------------------------------------------------------------------

const WRITING: Partial<Record<BlockType, { name: string; rules: string[]; task: string }>> = {
  es_write_form: {
    name: 'nota o formulario',
    rules: [
      '- Bentuknya: satu situasi konkret yang menuntut tulisan SANGAT pendek — catatan tempel untuk ' +
        'teman sekamar, pesan singkat, formulir pendaftaran, atau kartu pos.',
      '- Sebutkan 3–4 hal yang WAJIB ada di jawabannya (siapa, kapan, di mana, kenapa).',
      '- Panjang yang diminta 20–40 kata. Ini tugas tingkat pemula; jangan menuntut argumen.',
      '- `guidance_id` menyebut apa yang dinilai, dalam bahasa Indonesia.',
    ],
    task: 'Satu situasi beserta daftar hal yang wajib disebutkan.',
  },
  es_write_letter: {
    name: 'carta o correo electrónico',
    rules: [
      '- Bentuknya: satu situasi yang menuntut surat atau email — mengundang, meminta informasi, ' +
        'mengeluh, melamar, atau membalas undangan. Sertakan KEPADA SIAPA, karena itu yang ' +
        'menentukan tú atau usted.',
      '- Sebutkan 3–4 hal yang wajib ada, dan panjang yang diminta (80–150 kata tergantung tingkat).',
      '- Yang diuji juga bentuk suratnya: sapaan, penutup, dan keformalan yang cocok.',
    ],
    task: 'Satu situasi beserta penerima dan daftar hal yang wajib disebutkan.',
  },
  es_write_essay: {
    name: 'redacción argumentativa',
    rules: [
      '- Bentuknya: satu topik yang bisa didebat dari dua sisi, beserta 2–3 pertanyaan panduan ' +
        'yang WAJIB dijawab. Untuk tingkat menengah ke atas, sertakan juga satu bahan pemicu ' +
        '(kutipan pendek, data survei, atau kutipan pendapat) yang harus ditanggapi.',
      '- Sebutkan panjang yang diminta (150–250 kata) dan bahwa tulisannya harus punya pembuka, ' +
        'isi, dan penutup.',
      '- Topiknya harus bisa ditulis oleh siapa pun, bukan menuntut pengetahuan khusus.',
    ],
    task: 'Satu topik argumentatif beserta pertanyaan panduannya.',
  },
}

async function generateWriting(
  type: BlockType,
  exam: string,
  can: string,
  variety: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = WRITING[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          prompt: z.string().min(1).describe('Soalnya, ditulis dalam bahasa Spanyol apa adanya'),
          guidance_id: z
            .string()
            .min(1)
            .describe('Apa yang harus ada di jawaban dan apa yang dinilai. Bahasa Indonesia.'),
        }),
      )
      .min(1),
  })

  const { questions } = await ai().generate({
    task: 'items',
    schema,
    system: [SYSTEM(exam, can, variety), ...spec.rules].join('\n'),
    prompt: [
      `Buat ${count} soal ${exam} expresión escrita 「${spec.name}」.`,
      spec.task,
    ].join('\n'),
    temperature: 0.7,
  })

  return {
    standalone: questions.map((q) => ({
      stem: q.prompt,
      // Kosong = tidak ada yang bisa dipilih. Halaman ujian memakai ini untuk
      // memutuskan menampilkan kotak tulis, bukan daftar pilihan.
      options: [],
      answerIndex: null,
      explanationId: q.guidance_id,
    })),
    groups: [],
    rejected: [],
  }
}

// ---------------------------------------------------------------------------
// Penilaian karangan
// ---------------------------------------------------------------------------

const rubricSchema = z.object({
  adecuacion: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Adecuación al género y a la tarea: menjawab tugas, bentuk & keformalan tepat, 0–100'),
  coherencia: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Coherencia textual: alur, keterpaduan, penanda wacana, 0–100'),
  correccion: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Corrección y alcance lingüístico: tata bahasa, kosakata, aksen, 0–100'),
  feedback_id: z
    .string()
    .min(1)
    .describe('Penilaian singkat dalam bahasa Indonesia: yang sudah baik dan yang harus diperbaiki'),
})

export type WritingScore = { score: number; feedback: string }

/**
 * Nilai satu jawaban expresión escrita dengan skala DELE.
 *
 * Instituto Cervantes menilai dengan dua skala — holística dan analítica — dan
 * yang analítica itulah yang dipecah jadi tiga di sini: adecuación al género,
 * coherencia textual, dan corrección/alcance lingüístico.
 *
 * Pemisahan itu bukan kerapian. Bagian ADECUACIÓN adalah yang paling sering
 * membuat peserta kehilangan nilai tanpa menyadarinya: karangan yang tata
 * bahasanya rapi tapi memakai `tú` untuk surat resmi, atau tidak menyebut satu
 * dari empat hal yang diminta, kehilangan sepertiga nilainya — dan satu angka
 * gabungan tidak akan pernah memperlihatkan itu.
 *
 * Angka yang keluar dari sini adalah bagian PALING tidak bisa dipercaya di
 * seluruh simulasi, sama seperti pada TOPIK dan HSK. Yang berguna komentarnya,
 * bukan angkanya.
 */
export async function gradeSpanishWriting(args: {
  prompt: string
  guidance: string
  answer: string
  maxScore: number
}): Promise<WritingScore> {
  const r = await ai().generate({
    task: 'lesson',
    schema: rubricSchema,
    system: [
      'Kamu penilai resmi DELE (Instituto Cervantes) untuk expresión e interacción escritas.',
      'Nilai dengan skala analítica DELE: adecuación al género discursivo, coherencia textual, corrección y alcance lingüístico.',
      'ATURAN KETAT:',
      '- Jawaban kosong atau di luar topik mendapat 0.',
      '- Hal yang DIMINTA tapi tidak disebut menurunkan nilai adecuación, bukan coherencia.',
      '- Keformalan yang salah (tú untuk surat resmi, atau sebaliknya) menurunkan nilai adecuación walaupun tata bahasanya benar.',
      '- Panjang yang jauh di bawah syarat menurunkan nilai adecuación.',
      '- Tulisan tanpa tanda aksen, atau tanpa ¿ dan ¡, menurunkan nilai corrección — itu bukan hal kecil dalam bahasa Spanyol.',
      '- Mencampur ragam (vosotros dan vos dalam satu tulisan) menurunkan nilai corrección.',
      '- Komentar ditulis dalam bahasa Indonesia, sebut contoh konkret dari tulisannya.',
      '- Jangan murah hati. Nilai yang terlalu tinggi membuat simulasinya tidak berguna.',
    ].join('\n'),
    prompt: [
      `Soal: ${args.prompt}`,
      `Yang dinilai: ${args.guidance}`,
      '',
      'Jawaban peserta:',
      args.answer || '(kosong)',
    ].join('\n'),
    temperature: 0.2,
  })

  const average = (r.adecuacion + r.coherencia + r.correccion) / 3
  return {
    score: Math.round((average / 100) * args.maxScore),
    feedback: [
      `adecuación ${r.adecuacion} · coherencia ${r.coherencia} · corrección ${r.correccion}`,
      r.feedback_id,
    ].join(' — '),
  }
}

// ---------------------------------------------------------------------------

/** Generate satu blok cetak biru DELE. */
export async function generateDeleBlock(
  block: BlueprintBlock,
  exam: string,
  level: string,
  groupIndex = 0,
): Promise<GenerateExamResult> {
  const can = CAN_DO[level] ?? CAN_DO.B1
  const variety = VARIETIES[groupIndex % VARIETIES.length]

  if (WRITING[block.type]) {
    return generateWriting(block.type, exam, can, variety, block.perGroup)
  }
  if (STANDALONE[block.type]) {
    return generateStandalone(block.type, exam, can, variety, block.perGroup)
  }
  if (block.type === 'es_listen_talk') {
    return generateTalk(exam, can, variety, level, block.perGroup, groupIndex)
  }
  if (block.type === 'es_read_passage') {
    return generateReading(exam, can, variety, level, block.perGroup, groupIndex)
  }

  return {
    standalone: [],
    groups: [],
    rejected: [`jenis soal "${block.type}" belum punya generator DELE`],
  }
}
