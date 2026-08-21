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
 * GENERATOR SOAL SIMULASI TOPIK
 *
 * Dua hal yang membedakannya dari generator TOEFL dan JLPT:
 *
 * 1. **Tingkatnya ditentukan skor, bukan lembar soalnya.** Satu paket TOPIK II
 *    yang sama bisa menghasilkan 3급 atau 6급. Jadi soalnya TIDAK dibuat "untuk
 *    4급" — yang diminta adalah rentang kesulitan yang wajar untuk ujian itu,
 *    dari yang mudah sampai yang sulit dalam satu paket.
 *
 * 2. **Ada soal karangan.** 쓰기 bukan pilihan ganda: 51–52 melengkapi kalimat
 *    di dalam teks pendek, 53 menulis 200–300자 dari data, 54 menulis esai
 *    600–700자. Semuanya dinilai AI dengan rubrik, dan bobotnya tidak sama —
 *    lihat `gradeKoreanWriting` di bawah.
 */

const SYSTEM = (exam: string, band: string) =>
  [
    `Kamu penyusun soal ${exam} yang berpengalaman.`,
    `Soal ditulis dalam bahasa Korea setingkat ${band}. PENJELASAN jawaban ditulis dalam bahasa Indonesia.`,
    'ATURAN KETAT:',
    '- Tepat satu pilihan yang benar. Tiga pengecoh harus masuk akal, bukan konyol.',
    '- Jangan buat pilihan yang duplikat atau bermakna sama.',
    '- Tulis bahasa Korea yang wajar. Kalimat hasil terjemahan harfiah dari bahasa Inggris terasa aneh.',
    '- Pakai 존댓말 atau 문어체 sesuai konteks soalnya, jangan campur aduk.',
    '- Penjelasan menyebut ALASANNYA, bukan sekadar "karena itu yang benar".',
    '- Sebar tingkat kesulitan dalam satu paket: ada yang mudah, ada yang sulit.',
  ].join('\n')

const baseQuestion = {
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).length(4).describe('Tepat empat pilihan, urutan 1 2 3 4'),
  answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = pilihan pertama'),
  explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
}

// ---------------------------------------------------------------------------
// 읽기 & 듣기 — soal pilihan ganda berdiri sendiri
// ---------------------------------------------------------------------------

type StandaloneSpec = {
  name: string
  rules: string[]
  task: string
  /** naskah yang dibacakan TTS; kalau ada, soal ini masuk bagian 듣기 */
  audio?: 'dialog' | 'mono'
  check?: (q: { stem: string; options: string[] }) => string[]
}

const hasBlank = (s: string) => /\(\s*\)|（\s*）|_{3,}|＿{2,}/.test(s)

const STANDALONE: Partial<Record<BlockType, StandaloneSpec>> = {
  ko_listen_reply: {
    name: '알맞은 대답 고르기',
    audio: 'dialog',
    rules: [
      '- `audio_script` berisi SATU kalimat yang diucapkan lawan bicara, diawali "남자:" atau "여자:".',
      '- Empat pilihan adalah tanggapan; tepat satu yang wajar sebagai jawaban langsung.',
      '- Pengecoh salah karena tidak nyambung, salah tingkat tutur, atau menjawab pertanyaan lain.',
    ],
    task: 'Tiap soal: satu ucapan, lalu empat kemungkinan jawaban.',
  },
  ko_listen_dialog: {
    name: '대화 듣고 내용 파악',
    audio: 'dialog',
    rules: [
      '- `audio_script` berisi percakapan 4–8 giliran, tiap giliran diawali "남자:" atau "여자:".',
      '- Yang ditanyakan: isi percakapan, alasan, tempat, atau apa yang akan dilakukan berikutnya.',
      '- Jawabannya harus berupa simpulan atau parafrasa, bukan pengulangan kata yang terdengar.',
    ],
    task: 'Tiap soal: satu percakapan, satu pertanyaan, empat pilihan.',
  },
  ko_read_topic: {
    name: '무엇에 대한 이야기인지 고르기',
    rules: [
      '- `stem` berisi dua kalimat pendek yang saling berkaitan.',
      '- Empat pilihan adalah KATA BENDA topik (mis. 날씨, 가족, 취미, 값) — pilih yang paling tepat.',
      '- Kalimatnya tidak boleh menyebut kata topiknya secara langsung.',
    ],
    task: 'Tiap soal: dua kalimat pendek, empat pilihan kata topik.',
  },
  ko_read_blank: {
    name: '빈칸에 알맞은 것 고르기',
    rules: [
      '- `stem` berisi kalimat atau teks pendek dengan satu bagian kosong ditulis "( )".',
      '- Empat pilihan bisa berupa partikel, akhiran, kata sambung, atau kosakata — sebar jenisnya.',
      '- Yang menentukan jawaban harus konteksnya, bukan tebakan tata bahasa asal.',
    ],
    task: 'Tiap soal: teks dengan satu "( )", empat pilihan pengisi.',
    check: (q) => (hasBlank(q.stem) ? [] : ['tidak ada bagian kosong "( )"']),
  },
  ko_read_notice: {
    name: '안내문·기사 내용 일치',
    rules: [
      '- `stem` berisi bahan informasi pendek: pengumuman, iklan, jadwal, atau judul berita — ' +
        'ditulis dalam baris terpisah, bukan paragraf.',
      '- Pertanyaannya: mana yang SESUAI dengan isinya.',
      '- Tiga pengecoh harus bisa dibantah dari isi bahan itu, bukan dari pengetahuan umum.',
    ],
    task: 'Tiap soal: satu bahan informasi, empat pernyataan, satu yang benar.',
  },
  ko_read_order: {
    name: '순서대로 배열한 것 고르기',
    rules: [
      '- `stem` berisi empat kalimat bertanda (가) (나) (다) (라) dengan urutan ACAK.',
      '- Empat pilihan adalah urutan yang mungkin, mis. "(가)-(다)-(나)-(라)".',
      '- Hanya SATU urutan yang menghasilkan paragraf runtut; penanda urutan (그래서, 하지만, 그런데) yang menentukan.',
    ],
    task: 'Tiap soal: empat kalimat acak, empat kemungkinan urutan.',
    check: (q) => {
      const problems: string[] = []
      for (const tag of ['(가)', '(나)', '(다)', '(라)']) {
        if (!q.stem.includes(tag)) problems.push(`tidak ada kalimat ${tag}`)
      }
      return problems
    },
  },
  ko_read_insert: {
    name: '문장이 들어갈 위치 고르기',
    rules: [
      '- `stem` berisi satu paragraf dengan empat titik sisip bertanda (㉠) (㉡) (㉢) (㉣), ' +
        'lalu satu kalimat yang harus disisipkan (ditulis di dalam <보기>).',
      '- Empat pilihan adalah keempat titik itu.',
      '- Yang menentukan: kata penunjuk dan kata sambung di kalimat sisipannya.',
    ],
    task: 'Tiap soal: satu paragraf bertanda posisi, satu kalimat sisipan.',
    check: (q) => (q.stem.includes('㉠') ? [] : ['tidak ada penanda posisi ㉠㉡㉢㉣']),
  },
}

async function generateStandalone(
  type: BlockType,
  exam: string,
  band: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = STANDALONE[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          ...(spec.audio
            ? { audio_script: z.string().min(1).describe('Naskah yang dibacakan, bahasa Korea') }
            : {}),
          ...baseQuestion,
        }),
      )
      .min(1),
  })

  const { questions } = await ai().generate({
    task: 'items',
    schema,
    system: [SYSTEM(exam, band), ...spec.rules].join('\n'),
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
    if (spec.audio === 'dialog' && type === 'ko_listen_dialog' && turns.length < 2) {
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
// 담화/강연 — satu rekaman, beberapa soal
// ---------------------------------------------------------------------------

async function generateTalk(
  exam: string,
  band: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const topics = [
    '인터뷰', '뉴스', '강연', '안내 방송', '토론', '대담',
    '라디오 프로그램', '설명회', '기자 회견', '다큐멘터리',
  ]
  const topic = topics[index % topics.length]

  const schema = z.object({
    title: z.string().min(1).describe('Judul singkat dalam bahasa Korea'),
    script: z
      .string()
      .min(1)
      .describe('Naskah yang dibacakan. Kalau berupa dialog, tiap giliran diawali "남자:" atau "여자:".'),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, band),
      `- Bentuknya ${topic}: satu rekaman, lalu beberapa soal tentang isinya.`,
      '- Panjang naskah 150–250 karakter Korea.',
      '- Sebar jenis pertanyaan: inti pembicaraan, sikap pembicara, dan detail yang tersirat.',
      '- Semua soal harus terjawab HANYA dari isi rekaman itu.',
    ].join('\n'),
    prompt: `Buat satu ${topic} untuk ${exam} 듣기 beserta ${perGroup} soal.`,
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
// 읽기 지문 — satu bacaan, beberapa soal
// ---------------------------------------------------------------------------

async function generateReading(
  exam: string,
  band: string,
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const long = exam.includes('II')
  const topics = long
    ? ['환경 문제', '기술 발전', '교육 제도', '건강과 생활', '경제 현상', '사회 변화', '문화 차이', '심리 연구', '도시와 농촌', '언론과 여론']
    : ['취미 생활', '여행 경험', '가족 이야기', '학교 생활', '동네 소개']
  const topic = topics[index % topics.length]

  const schema = z.object({
    title: z.string().min(1),
    body: z
      .string()
      .min(1)
      .describe(long ? 'Bacaan 400–600 karakter Korea' : 'Bacaan 150–250 karakter Korea'),
    questions: z.array(z.object(baseQuestion)).min(1),
  })

  const g = await ai().generate({
    task: 'items',
    schema,
    system: [
      SYSTEM(exam, band),
      '- Satu bacaan dipakai untuk beberapa soal.',
      long
        ? '- Sebar jenis soal: maksud penulis, sikap penulis, isi yang sesuai, dan makna ungkapan dalam konteks.'
        : '- Sebar jenis soal: isi yang sesuai, alasan, dan perasaan penulis.',
      '- Semua soal harus terjawab HANYA dari bacaan itu.',
    ].join('\n'),
    prompt: `Buat satu bacaan ${exam} 읽기 tentang ${topic}, beserta ${perGroup} soal.`,
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
// 쓰기 — soal karangan
// ---------------------------------------------------------------------------

const WRITING: Partial<Record<BlockType, { name: string; rules: string[]; task: string }>> = {
  ko_write_blank: {
    name: '51–52번 문장 완성',
    rules: [
      '- Bentuknya: satu teks pendek (pengumuman, e-mail, atau penjelasan) dengan DUA bagian kosong ' +
        'bertanda (㉠) dan (㉡).',
      '- Peserta menulis sendiri kalimat yang pas — bukan memilih.',
      '- Yang diuji: menangkap alur teks dan menulis kalimat yang gramatikal serta cocok tingkat tuturnya.',
      '- `guidance_id` menjelaskan apa yang dinilai, dalam bahasa Indonesia.',
    ],
    task: 'Satu teks pendek dengan (㉠) dan (㉡) yang harus diisi peserta.',
  },
  ko_write_short: {
    name: '53번 자료 설명',
    rules: [
      '- Bentuknya: DATA yang harus dijelaskan — hasil survei, grafik, atau perbandingan angka, ' +
        'ditulis sebagai daftar poin.',
      '- Peserta menulis 200–300 karakter Korea dalam 문어체 (-ㄴ다/는다), bukan 존댓말.',
      '- Datanya harus konkret: sebutkan angka, tahun, dan kelompok yang dibandingkan.',
    ],
    task: 'Satu kumpulan data beserta instruksi menulisnya.',
  },
  ko_write_essay: {
    name: '54번 논술',
    rules: [
      '- Bentuknya: satu topik argumentatif beserta 2–3 pertanyaan panduan yang WAJIB dijawab.',
      '- Peserta menulis 600–700 karakter Korea dalam 문어체.',
      '- Topiknya harus bisa didebat dari dua sisi, bukan pertanyaan yang jawabannya jelas.',
    ],
    task: 'Satu topik esai beserta pertanyaan panduannya.',
  },
}

async function generateWriting(
  type: BlockType,
  exam: string,
  band: string,
  count: number,
): Promise<GenerateExamResult> {
  const spec = WRITING[type]
  if (!spec) return { standalone: [], groups: [], rejected: [`jenis ${type} tidak dikenal`] }

  const schema = z.object({
    questions: z
      .array(
        z.object({
          prompt: z.string().min(1).describe('Soalnya, ditulis dalam bahasa Korea apa adanya'),
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
    system: [SYSTEM(exam, band), ...spec.rules].join('\n'),
    prompt: [`Buat ${count} soal ${exam} 쓰기 「${spec.name}」.`, spec.task].join('\n'),
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
  content: z.number().int().min(0).max(100).describe('내용 및 과제 수행: isi menjawab tugas, 0–100'),
  organisation: z.number().int().min(0).max(100).describe('글의 전개 구조: alur dan keterpaduan, 0–100'),
  language: z.number().int().min(0).max(100).describe('언어 사용: tata bahasa, kosakata, 문어체, 0–100'),
  feedback_id: z
    .string()
    .min(1)
    .describe('Penilaian singkat dalam bahasa Indonesia: yang sudah baik dan yang harus diperbaiki'),
})

export type WritingScore = { score: number; feedback: string }

/**
 * Nilai satu jawaban 쓰기 dengan rubrik resmi TOPIK.
 *
 * Rubriknya tiga sisi — 내용, 전개 구조, 언어 사용 — dan itu disengaja: karangan
 * yang tata bahasanya rapi tapi tidak menjawab soal tetap kehilangan sepertiga
 * nilainya, persis seperti di ujian sungguhan.
 *
 * Angka yang keluar dari sini adalah bagian PALING tidak bisa dipercaya di
 * seluruh simulasi. Penilai manusia pun berbeda-beda pada karangan yang sama;
 * yang berguna di sini komentarnya, bukan angkanya.
 */
export async function gradeKoreanWriting(args: {
  prompt: string
  guidance: string
  answer: string
  maxScore: number
}): Promise<WritingScore> {
  const r = await ai().generate({
    task: 'lesson',
    schema: rubricSchema,
    system: [
      'Kamu penilai resmi TOPIK 쓰기.',
      'Nilai dengan rubrik TOPIK: 내용 및 과제 수행, 글의 전개 구조, 언어 사용.',
      'ATURAN KETAT:',
      '- Jawaban kosong atau di luar topik mendapat 0.',
      '- Jawaban yang tidak memakai 문어체 (-ㄴ다/는다) pada soal 53–54 kehilangan nilai 언어 사용.',
      '- Panjang yang jauh di bawah syarat menurunkan nilai 내용, bukan cuma 언어.',
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

  const average = (r.content + r.organisation + r.language) / 3
  return {
    score: Math.round((average / 100) * args.maxScore),
    feedback: [
      `내용 ${r.content} · 전개 ${r.organisation} · 언어 ${r.language}`,
      r.feedback_id,
    ].join(' — '),
  }
}

// ---------------------------------------------------------------------------

/** Generate satu blok cetak biru TOPIK. */
export async function generateTopikBlock(
  block: BlueprintBlock,
  exam: string,
  groupIndex = 0,
): Promise<GenerateExamResult> {
  // Rentang tingkat yang wajar untuk paket ini — TOPIK tidak punya "soal 4급".
  const band = exam.includes('II') ? '3급–6급' : '1급–2급'

  if (WRITING[block.type]) return generateWriting(block.type, exam, band, block.perGroup)
  if (STANDALONE[block.type]) return generateStandalone(block.type, exam, band, block.perGroup)
  if (block.type === 'ko_listen_talk') return generateTalk(exam, band, block.perGroup, groupIndex)
  if (block.type === 'ko_read_passage') {
    return generateReading(exam, band, block.perGroup, groupIndex)
  }

  return {
    standalone: [],
    groups: [],
    rejected: [`jenis soal "${block.type}" belum punya generator TOPIK`],
  }
}
