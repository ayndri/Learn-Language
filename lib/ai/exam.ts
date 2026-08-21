import { z } from 'zod'
import { ai } from '@/lib/ai/provider'
import type { WritingScore } from '@/lib/ai/exam-zh'
import { generateJlptBlock } from '@/lib/ai/exam-ja'
import { gradeKoreanWriting, generateTopikBlock } from '@/lib/ai/exam-ko'
import { gradeChineseWriting, generateHskBlock } from '@/lib/ai/exam-zh'
import { gradeSpanishWriting, generateDeleBlock } from '@/lib/ai/exam-es'
import {
  checkChoice,
  splitDialogue,
  type GenerateExamResult,
  type GeneratedQuestion,
} from '@/lib/ai/exam-shared'
import { examFormat } from '@/lib/exam/formats'
import type { BlueprintBlock } from '@/lib/exam/blueprint'

// Diteruskan supaya pemanggil lama (lib/exam/plan.ts) tidak perlu tahu bahwa
// bagian bersama sekarang tinggal di file lain.
export { splitCount, splitDialogue, MAX_PER_CALL } from '@/lib/ai/exam-shared'
export type {
  GenerateExamResult,
  GeneratedGroup,
  GeneratedQuestion,
} from '@/lib/ai/exam-shared'
export type { WritingScore } from '@/lib/ai/exam-zh'

/**
 * Generator soal simulasi TOEFL ITP.
 *
 * Satu panggilan per blok cetak biru (atau per kelompok bacaan/rekaman), bukan
 * satu panggilan raksasa untuk 140 soal: keluaran besar rawan terpotong di tengah,
 * dan kalau gagal hilang semuanya.
 *
 * Setiap keluaran divalidasi ulang — bukan cuma bentuknya. Soal pilihan ganda
 * punya cacat khas yang lolos JSON Schema: pilihan yang duplikat, `answer_index`
 * di luar jangkauan, atau soal Structure tanpa bagian yang harus dilengkapi.
 */

const SYSTEM = [
  'Kamu penyusun soal TOEFL ITP (paper-based) yang berpengalaman.',
  'Soal ditulis dalam bahasa Inggris, PENJELASAN jawaban ditulis dalam bahasa Indonesia.',
  'ATURAN KETAT:',
  '- Tepat satu pilihan yang benar. Tiga pengecoh harus masuk akal, bukan konyol.',
  '- Jangan buat pilihan yang duplikat atau bermakna sama.',
  '- Tingkat kesulitan setara TOEFL ITP asli, jangan disederhanakan.',
  '- Penjelasan menyebutkan ATURAN yang berlaku, bukan hanya "karena itu yang benar".',
  '- Jangan memberi petunjuk jawaban lewat panjang pilihan atau pola urutan.',
]

const optionsField = z
  .array(z.string().min(1))
  .length(4)
  .describe('Tepat empat pilihan, urutan A B C D')

const baseQuestion = {
  stem: z.string().min(1),
  options: optionsField,
  answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = A'),
  explanation_id: z.string().min(1).describe('Penjelasan dalam bahasa Indonesia'),
}

// ---------------------------------------------------------------------------
// validasi yang tidak bisa diungkapkan JSON Schema
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Seksi 2 Part A — melengkapi kalimat
// ---------------------------------------------------------------------------

const structureSchema = z.object({
  questions: z
    .array(
      z.object({
        ...baseQuestion,
        grammar_point: z
          .string()
          .min(1)
          .describe('Nama pola grammar yang diuji, mis. "inversi setelah negative adverbial"'),
      }),
    )
    .min(1),
})

async function generateStructure(count: number, focus: string[]): Promise<GenerateExamResult> {
  const { questions } = await ai().generate({
    task: 'items',
    schema: structureSchema,
    system: [
      ...SYSTEM,
      '- Format Structure: satu kalimat dengan bagian yang HILANG, ditandai "______".',
      '- Yang diuji struktur kalimat: subject-verb agreement, klausa, paralel, inversi, participle, artikel.',
    ].join('\n'),
    prompt: [
      `Buat ${count} soal TOEFL ITP Section 2 Part A (Structure).`,
      'Setiap soal: satu kalimat dengan tepat satu "______", empat pilihan pengisi.',
      `Sebar pola yang diuji di antara: ${focus.join(', ')}.`,
    ].join('\n'),
    temperature: 0.6,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []
  for (const q of questions) {
    const problems = checkChoice(q)
    // Tanpa bagian yang hilang, ini bukan soal Structure.
    if (!/_{3,}/.test(q.stem)) problems.push('tidak ada bagian yang harus dilengkapi ("______")')
    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 60)} — ${problems.join('; ')}`)
      continue
    }
    standalone.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      grammarPoint: q.grammar_point,
    })
  }
  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// Seksi 2 Part B — menemukan bagian yang salah
// ---------------------------------------------------------------------------

const writtenSchema = z.object({
  questions: z
    .array(
      z.object({
        sentence: z
          .string()
          .min(1)
          .describe('Kalimat utuh; empat bagian yang ditandai ditulis apa adanya di dalamnya'),
        parts: z
          .array(z.string().min(1))
          .length(4)
          .describe('Empat potongan dari kalimat itu, ditulis PERSIS seperti di kalimatnya'),
        answer_index: z.number().int().min(0).max(3).describe('Indeks potongan yang SALAH'),
        grammar_point: z
          .string()
          .min(1)
          .describe('Jenis kesalahan tata bahasanya, mis. "subject-verb agreement"'),
        explanation_id: z
          .string()
          .min(1)
          .describe('Kenapa bagian itu salah dan bentuk benarnya, dalam bahasa Indonesia'),
      }),
    )
    .min(1),
})

async function generateWritten(count: number, focus: string[]): Promise<GenerateExamResult> {
  const { questions } = await ai().generate({
    task: 'items',
    schema: writtenSchema,
    system: [
      ...SYSTEM,
      '- Format Written Expression: satu kalimat dengan EMPAT bagian ditandai; tepat satu bagian salah.',
      '- Kesalahannya harus kesalahan tata bahasa nyata, bukan salah ejaan atau gaya.',
      '- Ketiga bagian lain harus benar-benar BENAR.',
    ].join('\n'),
    prompt: [
      `Buat ${count} soal TOEFL ITP Section 2 Part B (Written Expression).`,
      'Tiap soal: satu kalimat, empat potongan darinya, satu di antaranya salah secara tata bahasa.',
      `Sebar jenis kesalahan di antara: ${focus.join(', ')}.`,
      'Setiap potongan di `parts` harus muncul PERSIS seperti itu di dalam `sentence`.',
    ].join('\n'),
    temperature: 0.6,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []
  for (const q of questions) {
    const problems = checkChoice({ stem: q.sentence, options: q.parts, answer_index: q.answer_index })
    // Potongan yang tidak ada di kalimatnya membuat soalnya tidak bisa dikerjakan.
    const missing = q.parts.filter((p) => !q.sentence.toLowerCase().includes(p.trim().toLowerCase()))
    if (missing.length) problems.push(`potongan tidak ada di kalimat: ${missing.join(' / ')}`)
    if (problems.length) {
      rejected.push(`${q.sentence.slice(0, 60)} — ${problems.join('; ')}`)
      continue
    }
    standalone.push({
      stem: q.sentence,
      options: q.parts,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      grammarPoint: q.grammar_point,
    })
  }
  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// Seksi 1 Part A — percakapan pendek
// ---------------------------------------------------------------------------

const shortTalkSchema = z.object({
  questions: z
    .array(
      z.object({
        script: z
          .string()
          .min(1)
          .describe(
            'Percakapan dua baris. Tiap baris diawali penanda pembicara diikuti titik dua, ' +
              'mis. "Man: …" lalu "Woman: …". Tanpa baris lain.',
          ),
        ...baseQuestion,
      }),
    )
    .min(1),
})

async function generateListeningShort(count: number): Promise<GenerateExamResult> {
  const { questions } = await ai().generate({
    task: 'items',
    schema: shortTalkSchema,
    system: [
      ...SYSTEM,
      '- Format Listening Part A: percakapan dua baris, lalu satu pertanyaan tentang isinya.',
      '- Tiap baris naskah diawali "Man:" atau "Woman:" — itu konvensi TOEFL, dan dipakai untuk memilih suara.',
      '- Jawabannya harus berupa SIMPULAN atau parafrasa, bukan pengulangan kata yang terdengar.',
      '- Konteksnya kehidupan kampus: kuliah, tugas, perpustakaan, asrama, jadwal.',
    ].join('\n'),
    prompt: [
      `Buat ${count} soal TOEFL ITP Section 1 Part A.`,
      'Tiap soal: percakapan dua baris ("Man: …" dan "Woman: …"), satu pertanyaan, empat pilihan.',
      'Pertanyaan biasanya: "What does the man mean?", "What will the woman probably do?", dsb.',
    ].join('\n'),
    temperature: 0.7,
  })

  const rejected: string[] = []
  const standalone: GeneratedQuestion[] = []
  for (const q of questions) {
    const problems = checkChoice(q)

    // Validasi berbasis PENANDA PEMBICARA, bukan berbasis baris.
    //
    // Pelajaran mahal: versi pertama memeriksa "apakah setiap BARIS diawali
    // Man:/Woman:" dan menolak 100% soal — karena model menaruh kedua giliran
    // dalam satu baris tanpa newline:
    //   "Man: I heard the exam was hard. Woman: Difficult is an understatement…"
    // Naskahnya benar; pemeriksanya yang salah asumsi.
    const turns = splitDialogue(q.script)
    if (turns.length < 2) {
      problems.push(`naskah bukan percakapan dua giliran: "${q.script.slice(0, 50)}…"`)
    }

    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 60)} — ${problems.join('; ')}`)
      continue
    }
    standalone.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
      // Disimpan sudah ternormalisasi (satu giliran per baris) supaya tampilan
      // pembahasan rapi dan TTS berhenti sejenak di antara pembicara.
      audioScript: turns.join('\n'),
    })
  }
  return { standalone, groups: [], rejected }
}

// ---------------------------------------------------------------------------
// Kelompok: bacaan (Seksi 3), percakapan panjang & ceramah (Seksi 1 B/C)
// ---------------------------------------------------------------------------

function groupSchema(min: number) {
  return z.object({
    title: z.string().min(1).describe('Judul singkat'),
    body: z.string().min(1),
    questions: z.array(z.object(baseQuestion)).min(min),
  })
}

async function generateGroup(
  kind: 'passage' | 'conversation' | 'talk',
  perGroup: number,
  index: number,
): Promise<GenerateExamResult> {
  const spec = {
    passage: {
      bodyDesc: 'Bacaan akademik 280–350 kata, gaya buku teks, satu topik utuh.',
      system:
        '- Format Reading: satu bacaan, lalu beberapa soal. Sertakan variasi jenis: gagasan utama, ' +
        'detail tersurat, rujukan kata ganti, makna kosakata dalam konteks, simpulan, dan yang TIDAK disebutkan.',
      topics: [
        'sejarah alam', 'astronomi', 'biologi laut', 'antropologi', 'geologi',
        'sejarah teknologi', 'ekologi', 'seni dan arsitektur',
      ],
    },
    conversation: {
      bodyDesc:
        'Percakapan 12–18 baris antara dua orang di lingkungan kampus. Tiap baris diawali ' +
        '"Man:" atau "Woman:".',
      system:
        '- Format Listening Part B: satu percakapan panjang, lalu beberapa soal tentang inti, ' +
        'alasan, dan langkah berikutnya.',
      topics: ['jadwal kuliah', 'tugas kelompok', 'pindah asrama', 'beasiswa', 'praktikum'],
    },
    talk: {
      bodyDesc: 'Ceramah/talk satu pembicara, 180–260 kata, gaya kuliah singkat.',
      system:
        '- Format Listening Part C: satu ceramah singkat, lalu beberapa soal tentang topik utama, ' +
        'detail, dan tujuan pembicara.',
      topics: ['pengumuman kampus', 'sejarah singkat', 'proses ilmiah', 'panduan penelitian'],
    },
  }[kind]

  const topic = spec.topics[index % spec.topics.length]

  const g = await ai().generate({
    task: 'items',
    schema: groupSchema(Math.max(1, perGroup - 2)),
    system: [...SYSTEM, spec.system].join('\n'),
    prompt: [
      `Buat satu ${kind === 'passage' ? 'bacaan' : kind === 'talk' ? 'ceramah' : 'percakapan panjang'} beserta ${perGroup} soal.`,
      `Topik: ${topic}.`,
      spec.bodyDesc,
      'Semua soal harus bisa dijawab HANYA dari isi teks itu.',
    ].join('\n'),
    temperature: 0.6,
  })

  const rejected: string[] = []
  const questions: GeneratedQuestion[] = []
  for (const q of g.questions) {
    const problems = checkChoice(q)
    if (problems.length) {
      rejected.push(`${q.stem.slice(0, 60)} — ${problems.join('; ')}`)
      continue
    }
    questions.push({
      stem: q.stem,
      options: q.options,
      answerIndex: q.answer_index,
      explanationId: q.explanation_id,
    })
  }

  if (questions.length === 0) return { standalone: [], groups: [], rejected }
  return {
    standalone: [],
    groups: [{ kind, title: g.title, body: g.body, questions }],
    rejected,
  }
}

// ---------------------------------------------------------------------------

const STRUCTURE_FOCUS = [
  'subject–verb agreement', 'klausa relatif', 'participle clause', 'paralelisme',
  'inversi', 'artikel dan determiner', 'kata hubung', 'gerund vs infinitive',
  'perbandingan', 'urutan kata pada pertanyaan tersirat',
]
const WRITTEN_FOCUS = [
  'kesesuaian subjek–verba', 'bentuk kata (word form)', 'urutan kata', 'artikel',
  'preposisi', 'kata ganti', 'paralelisme', 'perbandingan', 'bentuk tense', 'countable/uncountable',
]

/**
 * Generate satu blok cetak biru.
 *
 * Format menentukan generator mana yang dipakai. Soal JLPT dibuat di
 * `lib/ai/exam-ja.ts`, TOPIK di `exam-ko.ts`, HSK di `exam-zh.ts`, DELE di
 * `exam-es.ts` — bukan sekadar beda bahasa, tapi beda BENTUK soal, jadi
 * memaksakannya ke generator ini hanya akan menghasilkan soal TOEFL berbahasa
 * Jepang. `groupIndex` dipakai untuk memvariasikan topik antar kelompok, dan
 * pada DELE juga untuk menggilir ragam wilayahnya.
 */
export async function generateExamBlock(
  kind: string,
  block: BlueprintBlock,
  groupIndex = 0,
): Promise<GenerateExamResult> {
  const format = examFormat(kind)
  if (format.scoring.type === 'jlpt') {
    return generateJlptBlock(block, format.level ?? 'N5', groupIndex)
  }
  if (format.scoring.type === 'topik') {
    return generateTopikBlock(block, format.label, groupIndex)
  }
  if (format.scoring.type === 'hsk') {
    return generateHskBlock(block, format.label, format.level ?? 'HSK3', groupIndex)
  }
  if (format.scoring.type === 'dele') {
    return generateDeleBlock(block, format.label, format.level ?? 'B1', groupIndex)
  }

  switch (block.type) {
    case 'structure':
      return generateStructure(block.perGroup, STRUCTURE_FOCUS)
    case 'written_expression':
      return generateWritten(block.perGroup, WRITTEN_FOCUS)
    case 'listening_short':
      return generateListeningShort(block.perGroup)
    case 'reading':
      return generateGroup('passage', block.perGroup, groupIndex)
    case 'listening_long':
      return generateGroup('conversation', block.perGroup, groupIndex)
    case 'listening_talk':
      return generateGroup('talk', block.perGroup, groupIndex)
    default:
      return {
        standalone: [],
        groups: [],
        rejected: [`jenis soal "${block.type}" bukan bagian dari ${format.label}`],
      }
  }
}


/**
 * Nilai satu jawaban karangan.
 *
 * Pemilihan rubriknya ditaruh DI SINI, bukan di server action, dengan alasan
 * yang sama seperti `generateExamBlock`: satu tempat yang tahu format mana
 * memakai generator mana. Sebelum ada bahasa kedua yang punya soal karangan,
 * server action memanggil `gradeKoreanWriting` langsung — dan itu berarti
 * jawaban 书写 HSK akan dinilai dengan rubrik TOPIK, dalam bahasa Korea,
 * tanpa satu pun error yang kelihatan.
 *
 * Format tanpa soal karangan tidak pernah sampai ke sini: soalnya semua punya
 * `answerIndex`, jadi server action menolaknya lebih dulu. Kalau ternyata
 * sampai, rubrik TOPIK dipakai sebagai jaring — lebih baik dinilai dengan
 * rubrik yang salah daripada gagal menyimpan tulisan yang sudah dikerjakan.
 */
export async function gradeExamWriting(
  kind: string,
  args: { prompt: string; guidance: string; answer: string; maxScore: number },
): Promise<WritingScore> {
  switch (examFormat(kind).scoring.type) {
    case 'hsk':
      return gradeChineseWriting(args)
    case 'dele':
      return gradeSpanishWriting(args)
    default:
      return gradeKoreanWriting(args)
  }
}
