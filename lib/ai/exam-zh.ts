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
 * GENERATOR SOAL SIMULASI HSK
 *
 * Tiga hal yang membedakannya dari generator TOEFL, JLPT, dan TOPIK:
 *
 * 1. **Soalnya memang dibuat untuk SATU tingkat.** Kebalikan dari TOPIK, di mana
 *    satu lembar soal bisa memberi 3급 sampai 6급. HSK punya enam lembar soal
 *    yang berbeda, jadi tingkatnya diteruskan ke prompt sebagai batas: soal
 *    HSK 2 yang memuat kata HSK 5 bukan soal yang sulit, tapi soal yang salah.
 *
 * 2. **Batas kosakata itu bagian dari soalnya.** HSK menerbitkan daftar kosakata
 *    resmi per tingkat — 150 kata di HSK 1 sampai 5.000 di HSK 6 — dan inilah
 *    satu-satunya ujian di antara keempatnya yang batasnya sekaku itu. Karena
 *    itu tiap prompt menyebutkan batas kata secara eksplisit, dan menyebut
 *    berapa jumlahnya, supaya modelnya punya patokan yang bisa dipakai.
 *
 * 3. **Ada dua macam soal karangan yang bentuknya sangat berbeda.** 完成句子
 *    (menyusun kata jadi kalimat) itu satu kalimat; 缩写 HSK 6 itu membaca teks
 *    seribu karakter lalu meringkasnya jadi empat ratus. Keduanya dinilai AI,
 *    tapi rubriknya tidak sama beratnya — lihat `gradeChineseWriting`.
 *
 * Satu penyesuaian yang harus dinyatakan terus terang: bagian bergambar di
 * HSK 1–3 diganti padanan teks (lihat catatan di `lib/exam/formats.ts`). Yang
 * diuji tetap hal yang sama; yang hilang gambarnya.
 */

const SYSTEM = (exam: string, words: string) =>
  [
    `Kamu penyusun soal ${exam} yang berpengalaman.`,
    `Soal ditulis dalam bahasa Mandarin (汉字 sederhana). PENJELASAN jawaban ditulis dalam bahasa Indonesia.`,
    'ATURAN KETAT:',
    `- Pakai HANYA kosakata dan tata bahasa setingkat ${exam} (${words}). Kata di luar tingkat itu membuat soalnya tidak mengukur apa pun.`,
    '- Tepat satu pilihan yang benar. Pengecoh harus masuk akal, bukan konyol.',
    '- Jangan buat pilihan yang duplikat atau bermakna sama.',
    '- Tulis bahasa Mandarin yang wajar. Kalimat hasil terjemahan harfiah dari bahasa Inggris terasa aneh.',
    '- JANGAN menyertakan pinyin di dalam soal, kecuali soal 写汉字 yang memang membutuhkannya.',
    '- Pakai tanda baca Tionghoa (，。？！、) bukan tanda baca Latin.',
    '- Penjelasan menyebut ALASANNYA, bukan sekadar "karena itu yang benar".',
    '- Sebar tingkat kesulitan dalam satu paket: ada yang mudah, ada yang sulit.',
  ].join('\n')

/**
 * Batas kosakata resmi per tingkat, dipakai apa adanya di dalam prompt.
 *
 * Angkanya kumulatif dan resmi. Menyebutnya ke model jauh lebih berguna
 * daripada menulis "gunakan bahasa yang sederhana": "5.000 kata" dan "150 kata"
 * menghasilkan dua soal yang benar-benar berbeda, "sederhana" tidak.
 */
const WORD_LIMIT: Record<string, string> = {
  HSK1: '150 kata pertama, kalimat sangat pendek, tanpa klausa majemuk',
  HSK2: '300 kata pertama, kalimat sederhana, boleh 因为/所以 dan 虽然/但是',
  HSK3: '600 kata pertama, boleh 把/被 dan 补语 sederhana',
  HSK4: '1.200 kata pertama, boleh kalimat majemuk dan kosakata abstrak dasar',
  HSK5: '2.500 kata pertama, gaya surat kabar dan esai populer',
  HSK6: '5.000 kata, termasuk 成语 dan bahasa tulis (书面语)',
}

const baseQuestion = {
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).length(4).describe('Tepat empat pilihan, urutan A B C D'),
  answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = A'),
  explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
}

// ---------------------------------------------------------------------------
// 听力 & 阅读 — soal pilihan ganda berdiri sendiri
// ---------------------------------------------------------------------------

type StandaloneSpec = {
  name: string
  rules: string[]
  task: string
  /** naskah yang dibacakan TTS; kalau ada, soal ini masuk bagian 听力 */
  audio?: 'dialog' | 'mono'
  /**
   * Jumlah pilihan. Default empat.
   *
   * 判断对错 memang hanya punya DUA (对 / 错), dan memaksakannya jadi empat
   * berarti dua pilihan karangan yang tidak berarti apa-apa. Jenis item `quiz`
   * di registry sudah menerima 2–4 pilihan justru untuk kasus seperti ini.
   */
  options?: 2 | 4
  check?: (q: { stem: string; options: string[] }) => string[]
}

const hasBlank = (s: string) => /\(\s*\)|（\s*）|_{3,}|＿{2,}/.test(s)

const STANDALONE: Partial<Record<BlockType, StandaloneSpec>> = {
  zh_listen_judge: {
    name: '判断对错',
    audio: 'mono',
    options: 2,
    rules: [
      '- `audio_script` berisi SATU atau DUA kalimat yang dibacakan, tanpa penanda pembicara.',
      '- `stem` berisi satu PERNYATAAN tentang isi rekaman itu, diawali "★".',
      '- Pilihannya tepat dua: "对" (benar) dan "错" (salah), dengan urutan itu.',
      '- Setengah soal jawabannya 对 dan setengahnya 错 — jangan semua sama.',
      '- Pernyataan yang salah harus BERTENTANGAN dengan rekaman, bukan cuma tidak disebutkan.',
    ],
    task: 'Tiap soal: satu rekaman pendek, satu pernyataan, pilih 对 atau 错.',
  },
  zh_listen_reply: {
    name: '选择答语',
    audio: 'dialog',
    rules: [
      '- `audio_script` berisi SATU ucapan, diawali "男：" atau "女：".',
      '- Empat pilihan adalah tanggapan; tepat satu yang wajar sebagai jawaban langsung.',
      '- Pengecoh salah karena tidak nyambung, menjawab pertanyaan lain, atau salah bentuk.',
    ],
    task: 'Tiap soal: satu ucapan, lalu empat kemungkinan jawaban.',
  },
  zh_listen_dialog: {
    name: '对话理解',
    audio: 'dialog',
    rules: [
      '- `audio_script` berisi percakapan 2–6 giliran, tiap giliran diawali "男：" atau "女：".',
      '- Yang ditanyakan: isi percakapan, hubungan pembicara, tempat, waktu, atau apa yang akan dilakukan.',
      '- Jawabannya harus berupa simpulan atau parafrasa, bukan pengulangan kata yang terdengar.',
    ],
    task: 'Tiap soal: satu percakapan, satu pertanyaan, empat pilihan.',
  },
  zh_read_match: {
    name: '句子配对',
    rules: [
      '- `stem` berisi SATU kalimat (pertanyaan, sapaan, atau pernyataan).',
      '- Empat pilihan adalah kalimat lain; tepat satu yang berpasangan wajar dengan `stem`.',
      '- Pasangannya ditentukan isi dan bentuknya, bukan cuma kata yang sama-sama muncul.',
    ],
    task: 'Tiap soal: satu kalimat, empat kalimat pasangan.',
  },
  zh_read_blank: {
    name: '选词填空',
    rules: [
      '- `stem` berisi satu kalimat atau percakapan pendek dengan satu bagian kosong ditulis "（ ）".',
      '- Empat pilihan bisa berupa kata benda, kata kerja, kata sifat, 量词, atau 虚词 — sebar jenisnya antar soal.',
      '- Yang menentukan jawaban harus konteksnya dan pasangan kata yang lazim (搭配), bukan tebakan.',
    ],
    task: 'Tiap soal: teks dengan satu "（ ）", empat pilihan pengisi.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong "（ ）"']),
  },
  zh_read_notice: {
    name: '短文信息',
    rules: [
      '- `stem` berisi bahan informasi pendek: pengumuman, iklan, jadwal, pesan singkat, atau kutipan berita.',
      '- Pertanyaannya: mana yang SESUAI dengan isinya.',
      '- Tiga pengecoh harus bisa dibantah dari isi bahan itu, bukan dari pengetahuan umum.',
    ],
    task: 'Tiap soal: satu bahan informasi, empat pernyataan, satu yang benar.',
  },
  zh_read_order: {
    name: '排列顺序',
    rules: [
      '- `stem` berisi TIGA kalimat bertanda A、B、C dengan urutan ACAK, masing-masing di baris sendiri.',
      '- Empat pilihan adalah urutan yang mungkin, mis. "BAC" atau "B-A-C".',
      '- Hanya SATU urutan yang menghasilkan paragraf runtut; penanda urutan (于是, 后来, 但是) ' +
        'dan kata rujukan (这, 那, 他) yang menentukan.',
    ],
    task: 'Tiap soal: tiga kalimat acak, empat kemungkinan urutan.',
    check: (q) => {
      const problems: string[] = []
      for (const tag of ['A', 'B', 'C']) {
        if (!q.stem.includes(tag)) problems.push(`tidak ada kalimat bertanda ${tag}`)
      }
      return problems
    },
  },
  zh_read_error: {
    name: '病句',
    rules: [
      '- `stem` berisi instruksi "请选出有语病的一项。" saja, tanpa kalimat.',
      '- Empat pilihan adalah empat KALIMAT UTUH; tepat satu di antaranya cacat secara tata bahasa.',
      '- Cacatnya harus salah satu dari: 成分残缺 (unsur hilang), 搭配不当 (pasangan kata tidak cocok), ' +
        '语序不当 (urutan salah), 重复啰嗦 (mengulang, mis. "大约…左右"), atau 逻辑混乱.',
      '- Tiga kalimat lainnya harus benar-benar BENAR dan wajar, bukan cuma "kurang bagus".',
      '- Penjelasan menyebut JENIS cacatnya dan bentuk benarnya.',
    ],
    task: 'Tiap soal: empat kalimat, satu di antaranya cacat.',
  },
  zh_read_insert: {
    name: '选句填空',
    rules: [
      '- `stem` berisi satu paragraf pendek dengan satu tempat kosong ditulis "（ ）".',
      '- Empat pilihan adalah KALIMAT utuh; tepat satu yang pas di tempat itu.',
      '- Yang menentukan: kata sambung, kata rujukan, dan alur pikiran paragrafnya.',
    ],
    task: 'Tiap soal: satu paragraf berlubang, empat kalimat pilihan.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada tempat kosong "（ ）"']),
  },
}

async function generateStandalone(
  type: BlockType,
  exam: string,
  words: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = STANDALONE[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const optionCount = spec.options ?? 4
  const schema = z.object({
    questions: z
      .array(
        z.object({
          ...(spec.audio
            ? { audio_script: z.string().min(1).describe('Naskah yang dibacakan, bahasa Mandarin') }
            : {}),
          ...baseQuestion,
          options: z
            .array(z.string().min(1))
            .length(optionCount)
            .describe(
              optionCount === 2
                ? 'Tepat dua pilihan: "对" lalu "错"'
                : 'Tepat empat pilihan, urutan A B C D',
            ),
          answer_index: z
            .number()
            .int()
            .min(0)
            .max(optionCount - 1)
            .describe('Indeks pilihan benar, 0 = pilihan pertama'),
        }),
      )
      .min(1),
  })

  const { questions } = await ai().generate({
    task: 'items',
    schema,
    system: [SYSTEM(exam, words), ...spec.rules].join('\n'),
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

    // Soal menyimak tanpa naskah = bagian menyimak yang diam-diam berubah jadi
    // bagian membaca. Lihat catatan panjang di lib/ai/exam-es.ts: ini pernah
    // kejadian di sana karena satu spec lupa ditandai `audio`.
    if (spec.audio && !script) problems.push('soal menyimak tanpa naskah audio')

    // Percakapan satu giliran bukan percakapan, dan soalnya jadi tidak terjawab.
    const turns = script ? splitDialogue(script) : []
    if (type === 'zh_listen_dialog' && turns.length < 2) {
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
// 听力 短文 — satu rekaman, beberapa soal
// ---------------------------------------------------------------------------

async function generateTalk(
  exam: string,
  words: string,
  level: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const topics = [
    '采访', '新闻', '讲座', '广播通知', '访谈', '故事',
    '产品介绍', '科普说明', '记者会', '课堂讲解',
  ]
  const topic = topics[index % topics.length]
  const long = level === 'HSK5' || level === 'HSK6'

  const schema = z.object({
    title: z.string().min(1).describe('Judul singkat dalam bahasa Mandarin'),
    script: z
      .string()
      .min(1)
      .describe('Naskah yang dibacakan. Kalau berupa dialog, tiap giliran diawali "男：" atau "女：".'),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, words),
      `- Bentuknya ${topic}: satu rekaman, lalu beberapa soal tentang isinya.`,
      long
        ? '- Panjang naskah 350–500 karakter Tionghoa.'
        : '- Panjang naskah 120–220 karakter Tionghoa.',
      '- Sebar jenis pertanyaan: inti pembicaraan, detail, sikap pembicara, dan simpulan.',
      '- Semua soal harus terjawab HANYA dari isi rekaman itu.',
    ].join('\n'),
    prompt: `Buat satu ${topic} untuk ${exam} 听力 beserta ${perGroup} soal.`,
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
// 阅读理解 — satu bacaan, beberapa soal
// ---------------------------------------------------------------------------

async function generateReading(
  exam: string,
  words: string,
  level: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const advanced = level === 'HSK5' || level === 'HSK6'
  const topics = advanced
    ? ['环境保护', '科技发展', '教育问题', '健康生活', '经济现象', '社会变化', '文化差异', '心理研究', '城市与乡村', '传统与创新']
    : ['爱好', '旅行', '家庭', '学校生活', '工作', '天气', '朋友', '运动', '习惯', '小故事']
  const topic = topics[index % topics.length]

  const schema = z.object({
    title: z.string().min(1),
    body: z
      .string()
      .min(1)
      .describe(
        advanced ? 'Bacaan 400–600 karakter Tionghoa' : 'Bacaan 120–250 karakter Tionghoa',
      ),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, words),
      '- Satu bacaan dipakai untuk beberapa soal.',
      advanced
        ? '- Sebar jenis soal: maksud penulis, sikap penulis, isi yang sesuai, dan makna ungkapan dalam konteks.'
        : '- Sebar jenis soal: isi yang sesuai, alasan, dan hal yang paling tepat menggambarkan teks.',
      '- Semua soal harus terjawab HANYA dari bacaan itu, bukan dari pengetahuan umum.',
    ].join('\n'),
    prompt: `Buat satu bacaan ${exam} 阅读 tentang ${topic}, beserta ${perGroup} soal.`,
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
// 书写 — soal karangan
// ---------------------------------------------------------------------------

const WRITING: Partial<Record<BlockType, { name: string; rules: string[]; task: string }>> = {
  zh_write_sentence: {
    name: '完成句子',
    rules: [
      '- Bentuknya: beberapa kata atau frasa yang urutannya DIACAK, dipisah spasi — peserta menyusunnya ' +
        'jadi satu kalimat yang benar.',
      '- Yang diuji URUTAN KATA, bagian tata bahasa Mandarin yang paling tidak boleh salah: ' +
        'letak keterangan waktu dan tempat, letak 把/被, dan urutan beberapa penerang.',
      '- Sertakan 4–6 potongan, dan pastikan hanya ada satu susunan yang benar-benar wajar.',
      '- `guidance_id` menyebut pola apa yang dinilai, dalam bahasa Indonesia.',
    ],
    task: 'Satu kumpulan kata acak yang harus disusun jadi kalimat.',
  },
  zh_write_hanzi: {
    name: '写汉字',
    rules: [
      '- Bentuknya: satu kalimat dengan satu karakter dihilangkan, ditulis "（ ）", ' +
        'dan pinyin karakter yang hilang ditulis DI ATAS tanda itu — mis. "我去（ shū ）店买书。".',
      '- Peserta menulis karakternya sendiri; ini SATU-SATUNYA soal yang boleh memuat pinyin.',
      '- Karakternya harus karakter yang memang ada di daftar tingkat ini.',
      '- `guidance_id` menyebut karakter yang benar dan artinya, dalam bahasa Indonesia.',
    ],
    task: 'Satu kalimat berlubang beserta pinyin karakter yang harus ditulis.',
  },
  zh_write_essay: {
    name: '写作文',
    rules: [
      '- Bentuknya: 4–5 kata yang WAJIB dipakai, atau satu situasi yang harus diceritakan.',
      '- Peserta menulis karangan ±80 karakter Tionghoa yang runtut, bukan lima kalimat lepas.',
      '- Kata yang diberikan harus bisa dirangkai jadi satu cerita yang wajar, bukan kata acak.',
    ],
    task: 'Satu daftar kata wajib beserta instruksi menulisnya.',
  },
  zh_write_summary: {
    name: '缩写',
    rules: [
      '- Bentuknya: satu cerita 800–1.000 karakter Tionghoa, lalu instruksi meringkasnya jadi ' +
        '±400 karakter dengan judul sendiri.',
      '- Ceritanya harus punya alur yang jelas (tokoh → masalah → jalan keluar → akhir), karena ' +
        'yang dinilai adalah alur itu yang bertahan setelah diringkas.',
      '- Peserta TIDAK boleh menyalin kalimat panjang dari aslinya, dan tidak boleh menambahkan ' +
        'pendapat sendiri — sebutkan itu di instruksinya.',
      '- Di ujian sungguhan teksnya diambil setelah 10 menit membaca; sebutkan itu di instruksinya.',
    ],
    task: 'Satu cerita panjang beserta instruksi meringkasnya.',
  },
}

async function generateWriting(
  type: BlockType,
  exam: string,
  words: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = WRITING[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          prompt: z.string().min(1).describe('Soalnya, ditulis dalam bahasa Mandarin apa adanya'),
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
    system: [SYSTEM(exam, words), ...spec.rules].join('\n'),
    prompt: [`Buat ${count} soal ${exam} 书写 「${spec.name}」.`, spec.task].join('\n'),
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
  content: z.number().int().min(0).max(100).describe('内容: isi menjawab tugas dan lengkap, 0–100'),
  structure: z.number().int().min(0).max(100).describe('结构: alur, keterpaduan, dan panjang, 0–100'),
  language: z.number().int().min(0).max(100).describe('语言: tata bahasa, kosakata, urutan kata, tanda baca, 0–100'),
  feedback_id: z
    .string()
    .min(1)
    .describe('Penilaian singkat dalam bahasa Indonesia: yang sudah baik dan yang harus diperbaiki'),
})

export type WritingScore = { score: number; feedback: string }

/**
 * Nilai satu jawaban 书写 dengan rubrik HSK.
 *
 * Rubriknya tiga sisi — 内容, 结构, 语言 — dan pembagian itu penting justru
 * karena soal 书写 HSK bentuknya bermacam-macam. Satu jawaban 完成句子 yang
 * kata-katanya benar semua tapi urutannya salah kehilangan nilai 语言 tanpa
 * kehilangan 内容; satu 缩写 yang bahasanya rapi tapi membuang alur ceritanya
 * kehilangan 内容 tanpa kehilangan 语言. Satu angka gabungan menyembunyikan
 * kedua kasus itu.
 *
 * Angka yang keluar dari sini adalah bagian PALING tidak bisa dipercaya di
 * seluruh simulasi — sama seperti pada TOPIK. Penilai manusia pun berbeda-beda
 * pada karangan yang sama; yang berguna di sini komentarnya, bukan angkanya.
 */
export async function gradeChineseWriting(args: {
  prompt: string
  guidance: string
  answer: string
  maxScore: number
}): Promise<WritingScore> {
  const r = await ai().generate({
    task: 'lesson',
    schema: rubricSchema,
    system: [
      'Kamu penilai resmi HSK 书写.',
      'Nilai dengan rubrik HSK: 内容 (isi), 结构 (struktur), 语言 (bahasa).',
      'ATURAN KETAT:',
      '- Jawaban kosong atau di luar topik mendapat 0.',
      '- Soal 完成句子: urutan kata yang salah menurunkan nilai 语言 secara berat, sekalipun semua katanya terpakai.',
      '- Soal 完成句子: kata yang diberikan TIDAK boleh dibuang atau ditambah; kalau dibuang, nilai 内容 turun.',
      '- Soal 缩写: menyalin kalimat panjang dari teks asli, atau menambahkan pendapat sendiri, menurunkan nilai 内容.',
      '- Panjang yang jauh di bawah syarat menurunkan nilai 内容, bukan cuma 结构.',
      '- Pemakaian huruf Latin atau pinyin sebagai ganti karakter menurunkan nilai 语言.',
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

  const average = (r.content + r.structure + r.language) / 3
  return {
    score: Math.round((average / 100) * args.maxScore),
    feedback: [
      `内容 ${r.content} · 结构 ${r.structure} · 语言 ${r.language}`,
      r.feedback_id,
    ].join(' — '),
  }
}

// ---------------------------------------------------------------------------

/** Generate satu blok cetak biru HSK. */
export async function generateHskBlock(
  block: BlueprintBlock,
  exam: string,
  level: string,
  groupIndex = 0,
): Promise<GenerateExamResult> {
  const words = WORD_LIMIT[level] ?? WORD_LIMIT.HSK3

  if (WRITING[block.type]) return generateWriting(block.type, exam, words, block.perGroup)
  if (STANDALONE[block.type]) {
    return generateStandalone(block.type, exam, words, block.perGroup)
  }
  if (block.type === 'zh_listen_talk') {
    return generateTalk(exam, words, level, block.perGroup, groupIndex)
  }
  if (block.type === 'zh_read_passage') {
    return generateReading(exam, words, level, block.perGroup, groupIndex)
  }

  return {
    standalone: [],
    groups: [],
    rejected: [`jenis soal "${block.type}" belum punya generator HSK`],
  }
}
