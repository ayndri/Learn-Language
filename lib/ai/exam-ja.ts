import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import {
  checkChoice,
  splitDialogue,
  type GenerateExamResult,
  type GeneratedGroup,
  type GeneratedQuestion,
} from '@/lib/ai/exam-shared'
import type { BlueprintBlock, BlockType } from '@/lib/exam/formats'

/**
 * GENERATOR SOAL SIMULASI JLPT
 *
 * Satu panggilan AI per blok cetak biru (atau per bacaan/rekaman), sama seperti
 * generator TOEFL — keluaran besar rawan terpotong, dan kalau gagal hilang semua.
 *
 * Yang berbeda dan membuat file ini tidak bisa dipakai bersama: BENTUK SOALNYA.
 * JLPT bukan satu bentuk pilihan ganda yang diulang-ulang. 漢字読み memberi kata
 * bertanda lalu menanyakan bacaannya; 表記 kebalikannya; 用法 memberi satu kata
 * lalu empat kalimat, dan yang dicari kalimat yang memakainya dengan benar;
 * 文の組み立て meminta menyusun empat potongan lalu menanyakan isi kotak ★.
 * Masing-masing punya cacat khasnya sendiri kalau AI meleset, jadi masing-masing
 * punya pemeriksanya sendiri di bawah.
 *
 * Penanda yang dipakai (dan diperiksa):
 *   【…】  kata/bagian yang disorot pada soal
 *   ＿＿＿  bagian yang harus diisi
 *   ★      kotak yang ditanyakan pada soal menyusun kalimat
 */

const SYSTEM = (level: string) =>
  [
    `Kamu penyusun soal JLPT ${level} yang berpengalaman.`,
    `Soal ditulis dalam bahasa Jepang setara ${level}. PENJELASAN jawaban ditulis dalam bahasa Indonesia.`,
    'ATURAN KETAT:',
    `- Kosakata, kanji, dan pola tata bahasa TIDAK BOLEH melebihi tingkat ${level}.`,
    '- Tepat satu pilihan yang benar. Tiga pengecoh harus masuk akal, bukan konyol.',
    '- Jangan buat pilihan yang duplikat atau bermakna sama.',
    '- Penjelasan menyebut ATURAN atau alasannya, bukan sekadar "karena itu yang benar".',
    '- Jangan memberi petunjuk jawaban lewat panjang pilihan atau pola urutan.',
    '- Tulis bahasa Jepang yang wajar. Kalimat hasil terjemahan harfiah dari bahasa Inggris terasa aneh dan mengajarkan yang salah.',
  ].join('\n')

/** N5 dan N4 memakai spasi antarkata dan furigana di soal aslinya. */
const KANA_HINT = (level: string) =>
  level === 'N5' || level === 'N4'
    ? '- Tulis kalimat dengan spasi antarkata seperti pada soal JLPT N5/N4 asli, dan pakai kanji seperlunya saja.'
    : '- Tulis kalimat tanpa spasi antarkata, seperti tulisan Jepang normal.'

const baseQuestion = {
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).length(4).describe('Tepat empat pilihan, urutan A B C D'),
  answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = A'),
  explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
}

// ---------------------------------------------------------------------------
// 文字・語彙 dan 文法形式 — semuanya soal berdiri sendiri berbasis satu kalimat
// ---------------------------------------------------------------------------

type StandaloneSpec = {
  /** nama resmi 問題-nya, dipakai di prompt */
  name: string
  rules: string[]
  task: string
  /** pemeriksaan khas bentuk soal ini */
  check: (q: { stem: string; options: string[] }) => string[]
  /** minta AI menyebut pola grammar yang diuji */
  grammar?: boolean
}

const hasMark = (s: string) => /【.+?】/.test(s)
const hasBlank = (s: string) => /＿{2,}|_{3,}|（\s*）|\(\s*\)/.test(s)

const STANDALONE: Partial<Record<BlockType, StandaloneSpec>> = {
  kanji_reading: {
    name: '問題1 漢字読み',
    rules: [
      '- Bentuknya: satu kalimat, satu kata DITULIS KANJI dan diapit 【 】.',
      '- Empat pilihan adalah cara baca kata itu, semuanya ditulis HIRAGANA.',
      '- Pengecoh dibuat dari kesalahan baca yang nyata: bunyi panjang/pendek, さ vs ざ, っ ada/tidak, atau tertukar 音読み dan 訓読み.',
    ],
    task: 'Tiap soal: satu kalimat berisi satu kata berkanji di dalam 【 】, lalu empat cara baca dalam hiragana.',
    check: (q) => {
      const problems: string[] = []
      if (!hasMark(q.stem)) problems.push('tidak ada kata bertanda 【 】')
      if (!/[一-鿿]/.test(q.stem.match(/【(.+?)】/)?.[1] ?? '')) {
        problems.push('kata di dalam 【 】 tidak mengandung kanji')
      }
      const notKana = q.options.filter((o) => /[一-鿿]/.test(o))
      if (notKana.length) problems.push(`pilihan harus hiragana: ${notKana.join(' / ')}`)
      return problems
    },
  },
  orthography: {
    name: '問題2 表記',
    rules: [
      '- Bentuknya: satu kalimat, satu kata DITULIS HIRAGANA dan diapit 【 】.',
      '- Empat pilihan adalah cara menulis kata itu dengan kanji.',
      '- Pengecoh memakai kanji yang mirip bentuknya atau sama bacaannya.',
    ],
    task: 'Tiap soal: satu kalimat berisi satu kata berhiragana di dalam 【 】, lalu empat penulisan kanji.',
    check: (q) => {
      const problems: string[] = []
      if (!hasMark(q.stem)) problems.push('tidak ada kata bertanda 【 】')
      if (/[一-鿿]/.test(q.stem.match(/【(.+?)】/)?.[1] ?? '')) {
        problems.push('kata di dalam 【 】 seharusnya hiragana, bukan kanji')
      }
      return problems
    },
  },
  word_formation: {
    name: '問題3 語形成',
    rules: [
      '- Bentuknya: satu kalimat dengan satu bagian kosong ＿＿＿ yang harus diisi imbuhan atau unsur kata majemuk.',
      '- Yang diuji unsur pembentuk kata: 〜的, 〜性, 〜化, 〜中, 〜料, 〜費, 不〜, 未〜, 再〜, 高〜, dan sejenisnya.',
    ],
    task: 'Tiap soal: satu kalimat dengan satu ＿＿＿, empat unsur pembentuk kata sebagai pilihan.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong ＿＿＿']),
  },
  contextual: {
    name: '問題 文脈規定',
    rules: [
      '- Bentuknya: satu kalimat dengan satu bagian kosong ＿＿＿.',
      '- Empat pilihan adalah kata yang sekelas (semuanya kata kerja, atau semuanya kata sifat, dst).',
      '- Yang menentukan jawaban harus KONTEKS kalimatnya, bukan tata bahasanya — ketiga pengecoh harus sama-sama benar secara tata bahasa.',
    ],
    task: 'Tiap soal: satu kalimat dengan satu ＿＿＿, empat kata sekelas sebagai pilihan.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong ＿＿＿']),
  },
  paraphrase: {
    name: '問題 言い換え類義',
    rules: [
      '- Bentuknya: satu kalimat dengan satu bagian diapit 【 】.',
      '- Empat pilihan adalah kalimat atau frasa pengganti; yang benar adalah yang PALING DEKAT maknanya.',
      '- Pengecoh harus sama-sama masuk akal sebagai kalimat, bedanya di makna.',
    ],
    task: 'Tiap soal: satu kalimat dengan bagian bertanda 【 】, lalu empat kalimat pengganti.',
    check: (q) => (hasMark(q.stem) ? [] : ['tidak ada bagian bertanda 【 】']),
  },
  usage: {
    name: '問題 用法',
    rules: [
      '- Bentuknya BERBEDA dari yang lain: `stem` berisi SATU KATA saja (kata yang diuji), tanpa kalimat.',
      '- Empat pilihan adalah empat kalimat utuh yang semuanya memakai kata itu; tepat satu memakainya dengan benar.',
      '- Tiga kalimat pengecoh harus memakai kata itu di tempat yang salah — kalimatnya tetap terbaca wajar, tapi katanya tidak cocok.',
    ],
    task: 'Tiap soal: satu kata sebagai `stem`, empat kalimat sebagai pilihan.',
    check: (q) => {
      const word = q.stem.replace(/【|】|\s/g, '').trim()
      const problems: string[] = []
      if (word.length > 12) problems.push('stem harus satu kata saja, bukan kalimat')
      const missing = q.options.filter((o) => !o.includes(word.slice(0, Math.max(2, word.length - 2))))
      if (missing.length > 1) problems.push(`${missing.length} pilihan tidak memakai kata "${word}"`)
      return problems
    },
  },
  grammar_form: {
    name: '問題 文法形式の判断',
    rules: [
      '- Bentuknya: satu kalimat dengan satu bagian kosong ＿＿＿.',
      '- Empat pilihan adalah bentuk tata bahasa (partikel, akhiran, pola ungkapan), bukan kosakata.',
      '- Sebar polanya: jangan empat soal berturut-turut menguji partikel.',
    ],
    task: 'Tiap soal: satu kalimat dengan satu ＿＿＿, empat bentuk tata bahasa sebagai pilihan.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong ＿＿＿']),
    grammar: true,
  },
}

async function generateStandalone(
  type: BlockType,
  level: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = STANDALONE[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          ...baseQuestion,
          ...(spec.grammar
            ? {
                grammar_point: z
                  .string()
                  .min(1)
                  .describe('Nama pola tata bahasa yang diuji, mis. "〜ば〜ほど"'),
              }
            : {}),
        }),
      )
      .min(1),
  })

  const { questions } = await ai().generate({
    task: 'items',
    schema,
    system: [SYSTEM(level), ...spec.rules, KANA_HINT(level)].join('\n'),
    prompt: [
      `Buat ${count} soal JLPT ${level} ${spec.name}.`,
      spec.task,
      'Sebar topik kalimatnya: keseharian, sekolah, kantor, perjalanan — jangan semuanya bertema sama.',
    ].join('\n'),
    temperature: 0.65,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []
  for (const q of questions) {
    const problems = [...checkChoice(q), ...spec.check(q)]
    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 40)} — ${problems.join('; ')}`)
      continue
    }
    standalone.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      grammarPoint: 'grammar_point' in q ? String(q.grammar_point) : undefined,
    })
  }
  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// 文の組み立て — menyusun empat potongan, lalu ditanya isi kotak ★
// ---------------------------------------------------------------------------

const compositionSchema = z.object({
  questions: z
    .array(
      z.object({
        before: z.string().describe('Bagian kalimat SEBELUM keempat kotak. Boleh kosong.'),
        after: z.string().describe('Bagian kalimat SESUDAH keempat kotak. Boleh kosong.'),
        options: z
          .array(z.string().min(1))
          .length(4)
          .describe('Empat potongan kalimat, URUTANNYA SUDAH DIACAK'),
        order: z
          .array(z.number().int().min(0).max(3))
          .length(4)
          .describe(
            'Urutan yang BENAR, berisi indeks ke `options`. Contoh [2,0,3,1] artinya ' +
              'potongan ke-3 lebih dulu, lalu ke-1, lalu ke-4, lalu ke-2.',
          ),
        star: z
          .number()
          .int()
          .min(0)
          .max(3)
          .describe('Kotak keberapa yang diberi tanda ★ (0 = kotak pertama)'),
        grammar_point: z.string().min(1).describe('Pola tata bahasa yang diuji'),
        explanation_id: z
          .string()
          .min(1)
          .describe('Kalimat utuh yang benar, lalu kenapa urutannya begitu. Bahasa Indonesia.'),
      }),
    )
    .min(1),
})

async function generateComposition(level: string, count: number): Promise<GenerateExamResult> {
  const { questions } = await ai().generate({
    task: 'items',
    schema: compositionSchema,
    system: [
      SYSTEM(level),
      '- Bentuk soal 文の組み立て: satu kalimat dipotong jadi empat bagian yang urutannya diacak.',
      '- Peserta menyusunnya kembali, lalu ditanya potongan mana yang jatuh di kotak ★.',
      '- Potongannya harus berupa satuan yang wajar (frasa + partikel), bukan potongan asal di tengah kata.',
      '- Hanya boleh ada SATU urutan yang menghasilkan kalimat benar. Kalau dua urutan sama-sama benar, soalnya rusak.',
      KANA_HINT(level),
    ].join('\n'),
    prompt: [
      `Buat ${count} soal JLPT ${level} 問題 文の組み立て.`,
      'Tiap soal: `before` + empat kotak + `after`, empat potongan yang sudah diacak, urutan benarnya, dan posisi ★.',
      'Letakkan ★ berpindah-pindah antar soal, jangan selalu di kotak yang sama.',
    ].join('\n'),
    temperature: 0.7,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []

  for (const q of questions) {
    const problems: string[] = []
    // `order` harus permutasi 0–3. Kalau ada indeks kembar, jawabannya jadi
    // ambigu dan kalimat rakitannya kehilangan satu potongan.
    if (new Set(q.order).size !== 4) problems.push('urutan bukan permutasi 0–3')
    if (new Set(q.options.map((o) => o.trim())).size !== 4) problems.push('ada potongan duplikat')

    if (problems.length) {
      rejected.push(`${q.explanation_id.slice(0, 40)} — ${problems.join('; ')}`)
      continue
    }

    const boxes = ['＿＿＿', '＿＿＿', '＿＿＿', '＿＿＿']
    boxes[q.star] = '＿★＿'
    const stem = [
      `${q.before} ${boxes.join(' ')} ${q.after}`.replace(/\s+/g, ' ').trim(),
      '',
      'Potongan mana yang masuk ke kotak ★?',
    ].join('\n')

    standalone.push({
      stem,
      options: q.options,
      // Jawabannya bukan `star`, tapi potongan mana yang MENDARAT di kotak itu.
      answerIndex: q.order[q.star],
      explanationId: q.explanation_id,
      grammarPoint: q.grammar_point,
    })
  }

  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// 文章の文法 — satu teks dengan beberapa lubang bernomor
// ---------------------------------------------------------------------------

const textGrammarSchema = z.object({
  title: z.string().min(1).describe('Judul singkat teksnya'),
  body: z
    .string()
    .min(1)
    .describe('Teks 200–320 karakter dengan lubang bernomor ditulis 【1】, 【2】, dan seterusnya'),
  questions: z
    .array(
      z.object({
        number: z.number().int().min(1).describe('Nomor lubang yang dimaksud'),
        options: z.array(z.string().min(1)).length(4),
        answer_index: z.number().int().min(0).max(3),
        explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
      }),
    )
    .min(1),
})

async function generateTextGrammar(level: string, count: number): Promise<GenerateExamResult> {
  const g = await ai().generate({
    task: 'items',
    schema: textGrammarSchema,
    system: [
      SYSTEM(level),
      '- Bentuk soal 文章の文法: satu teks utuh dengan beberapa lubang bernomor.',
      '- Yang diuji ALIRAN teksnya: kata sambung, kata penunjuk (それ・そう), bentuk kalimat yang cocok dengan konteks sebelum-sesudahnya.',
      '- Tiap lubang harus hanya punya satu jawaban yang wajar KALAU dibaca bersama kalimat sekitarnya.',
      KANA_HINT(level),
    ].join('\n'),
    prompt: [
      `Buat satu teks JLPT ${level} 問題 文章の文法 dengan tepat ${count} lubang.`,
      'Teksnya berupa karangan pendek orang pertama (pengalaman, kesan, kebiasaan).',
      `Tulis lubangnya persis sebagai 【1】 sampai 【${count}】 di dalam teks.`,
    ].join('\n'),
    temperature: 0.65,
  })

  const rejected: string[] = []
  const questions: GeneratedQuestion[] = []

  for (const q of g.questions) {
    const problems = checkChoice({ stem: `【${q.number}】`, ...q })
    // Lubang yang disebut soal tapi tidak ada di teksnya = soal tanpa konteks.
    if (!g.body.includes(`【${q.number}】`)) problems.push(`lubang 【${q.number}】 tidak ada di teks`)
    if (problems.length) {
      rejected.push(`文章の文法 【${q.number}】 — ${problems.join('; ')}`)
      continue
    }
    questions.push({
      stem: `【${q.number}】 diisi dengan…`,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      grammarPoint: '文章の文法',
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
// 読解 — bacaan berkelompok
// ---------------------------------------------------------------------------

const READING_SPEC: Partial<Record<BlockType, { chars: string; kind: string; topics: string[] }>> = {
  reading_short: {
    chars: '120–200 karakter',
    kind: 'satu teks pendek: pengumuman, memo, e-mail, atau catatan singkat',
    topics: ['pengumuman kelas', 'memo di kantor', 'e-mail ke teman', 'catatan tempel di kulkas', 'papan informasi'],
  },
  reading_mid: {
    chars: '350–500 karakter',
    kind: 'satu esai atau tulisan penjelasan',
    topics: ['kebiasaan sehari-hari', 'pengalaman pindah kota', 'perubahan cara belanja', 'hubungan dengan tetangga', 'kebiasaan membaca'],
  },
  reading_long: {
    chars: '700–900 karakter',
    kind: 'satu tulisan panjang berisi pendapat penulis',
    topics: ['peran teknologi', 'cara belajar', 'lingkungan hidup', 'budaya kerja', 'kota dan desa'],
  },
  info_search: {
    chars: '200–350 karakter',
    kind:
      'satu bahan informasi yang berbentuk DAFTAR atau TABEL: jadwal, brosur, syarat pendaftaran, ' +
      'daftar harga. Tulis dalam baris-baris terpisah, bukan paragraf',
    topics: ['jadwal kelas', 'brosur wisata', 'syarat pendaftaran lomba', 'daftar harga kursus', 'jadwal bus'],
  },
}

async function generateReading(
  type: BlockType,
  level: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const spec = READING_SPEC[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const topic = spec.topics[index % spec.topics.length]

  const schema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(level),
      `- Bentuk soal 読解: ${spec.kind}, panjang ${spec.chars}.`,
      '- Semua soal harus terjawab HANYA dari isi teks itu, bukan dari pengetahuan umum.',
      type === 'info_search'
        ? '- Soal 情報検索 menanyakan hal yang harus DICARI di dalam daftar, misalnya "orang dengan syarat X harus mendaftar lewat mana".'
        : '- Sebar jenis pertanyaannya: gagasan utama, detail, rujukan kata penunjuk, dan maksud penulis.',
      KANA_HINT(level),
    ].join('\n'),
    prompt: [
      `Buat satu bahan bacaan JLPT ${level} beserta ${perGroup} soal.`,
      `Topik: ${topic}.`,
    ].join('\n'),
    temperature: 0.6,
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
// 聴解 — semua butuh naskah yang dibacakan TTS
// ---------------------------------------------------------------------------

type ListeningSpec = {
  name: string
  /** berapa pilihan; 発話表現 dan 即時応答 aslinya cuma tiga */
  choices: 3 | 4
  rules: string[]
  script: string
  question: string
}

const LISTENING: Partial<Record<BlockType, ListeningSpec>> = {
  listening_task: {
    name: '問題 課題理解',
    choices: 4,
    rules: [
      '- Naskahnya percakapan dua orang; tiap giliran diawali "男：" atau "女：".',
      '- Yang ditanyakan: setelah percakapan ini, orang yang disebut HARUS MELAKUKAN APA lebih dulu.',
      '- Percakapan harus menyebut beberapa kemungkinan tindakan lalu menyisihkannya, sehingga jawabannya baru jelas di akhir.',
    ],
    script: 'Percakapan 6–10 giliran di kantor, kampus, atau toko.',
    question: 'Pertanyaannya seperti 「女の人はこのあと何をしますか」.',
  },
  listening_point: {
    name: '問題 ポイント理解',
    choices: 4,
    rules: [
      '- Naskahnya percakapan dua orang; tiap giliran diawali "男：" atau "女：".',
      '- Yang ditanyakan satu titik tertentu: alasan, waktu, harga, atau perasaan pembicara.',
      '- Jawabannya harus disebut secara tersirat, jangan diulang persis sebagai salah satu pilihan.',
    ],
    script: 'Percakapan 5–8 giliran tentang rencana, keluhan, atau pilihan.',
    question: 'Pertanyaannya seperti 「男の人はどうして遅れましたか」.',
  },
  listening_summary: {
    name: '問題 概要理解',
    choices: 4,
    rules: [
      '- Naskahnya SATU orang berbicara: pengumuman, siaran, atau penjelasan singkat.',
      '- Yang ditanyakan inti pembicaraan secara keseluruhan, bukan detailnya.',
      '- Karena yang diuji tangkapan menyeluruh, jangan menaruh kata kunci jawaban secara harfiah di naskah.',
    ],
    script: 'Monolog 4–7 kalimat.',
    question: 'Pertanyaannya seperti 「この人は何について話していますか」.',
  },
  listening_utterance: {
    name: '問題 発話表現',
    choices: 3,
    rules: [
      '- `audio_script` berisi PENJELASAN SITUASI dalam bahasa Jepang, satu-dua kalimat, seperti yang dibacakan penguji.',
      '- Tiga pilihan adalah kalimat yang mungkin diucapkan dalam situasi itu; tepat satu yang wajar.',
      '- Pengecoh harus salah karena TIDAK SOPAN, salah arah (bicara ke diri sendiri), atau salah waktu — bukan karena salah tata bahasa.',
    ],
    script: 'Deskripsi situasi sehari-hari yang konkret.',
    question: 'Stem-nya: apa yang sebaiknya diucapkan.',
  },
  listening_quick: {
    name: '問題 即時応答',
    choices: 3,
    rules: [
      '- `audio_script` berisi SATU kalimat yang diucapkan lawan bicara.',
      '- Tiga pilihan adalah tanggapan langsung; tepat satu yang wajar.',
      '- Kalimatnya pendek dan alami seperti percakapan sungguhan, termasuk ungkapan tetap.',
    ],
    script: 'Satu kalimat ucapan.',
    question: 'Stem-nya: tanggapan yang tepat.',
  },
}

function listeningSchema(choices: 3 | 4) {
  return z.object({
    questions: z
      .array(
        z.object({
          audio_script: z.string().min(1).describe('Naskah yang dibacakan. Bahasa Jepang.'),
          stem: z.string().min(1).describe('Pertanyaannya, dalam bahasa Jepang'),
          options: z.array(z.string().min(1)).length(choices),
          answer_index: z.number().int().min(0).max(choices - 1),
          explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
        }),
      )
      .min(1),
  })
}

async function generateListening(
  type: BlockType,
  level: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = LISTENING[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const { questions } = await ai().generate({
    task: 'items',
    schema: listeningSchema(spec.choices),
    system: [SYSTEM(level), ...spec.rules].join('\n'),
    prompt: [
      `Buat ${count} soal JLPT ${level} ${spec.name}.`,
      spec.script,
      spec.question,
      'Variasikan tempat dan pembicaranya antar soal.',
    ].join('\n'),
    temperature: 0.7,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []

  for (const q of questions) {
    const problems = checkChoice(q)

    // Untuk yang bentuknya percakapan, naskah satu giliran berarti bukan
    // percakapan — dan soalnya jadi tidak bisa dijawab.
    const needsDialogue = type === 'listening_task' || type === 'listening_point'
    const turns = splitDialogue(q.audio_script)
    if (needsDialogue && turns.length < 2) {
      problems.push(`naskah bukan percakapan: "${q.audio_script.slice(0, 40)}…"`)
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
      // Disimpan sudah ternormalisasi (satu giliran per baris) supaya TTS
      // berhenti sejenak di antara pembicara.
      audioScript: needsDialogue ? turns.join('\n') : q.audio_script,
    })
  }

  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------

/** Generate satu blok cetak biru JLPT. `groupIndex` dipakai memvariasikan topik. */
export async function generateJlptBlock(
  block: BlueprintBlock,
  level: string,
  groupIndex = 0,
): Promise<GenerateExamResult> {
  if (STANDALONE[block.type]) return generateStandalone(block.type, level, block.perGroup)
  if (LISTENING[block.type]) return generateListening(block.type, level, block.perGroup)
  if (READING_SPEC[block.type]) {
    return generateReading(block.type, level, block.perGroup, groupIndex)
  }
  if (block.type === 'sentence_composition') return generateComposition(level, block.perGroup)
  if (block.type === 'text_grammar') return generateTextGrammar(level, block.perGroup)

  return {
    standalone: [],
    groups: [] as GeneratedGroup[],
    rejected: [`jenis soal "${block.type}" belum punya generator JLPT`],
  }
}
