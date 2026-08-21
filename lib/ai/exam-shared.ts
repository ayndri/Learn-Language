/**
 * Bagian yang dipakai bersama oleh semua generator soal simulasi.
 *
 * Dipisah dari `lib/ai/exam.ts` supaya generator TOEFL dan generator JLPT bisa
 * hidup di file masing-masing tanpa saling mengimpor — dua format, dua berkas,
 * satu bentuk hasil.
 */

export type GeneratedQuestion = {
  stem: string
  /** kosong untuk soal karangan — tidak ada yang bisa dipilih */
  options: string[]
  /** null untuk soal karangan: tidak ada satu jawaban benar */
  answerIndex: number | null
  explanationId: string
  /** naskah yang dibacakan TTS untuk soal menyimak */
  audioScript?: string
  /** pola grammar yang diuji — jadi tag saat soal salah diubah jadi item latihan */
  grammarPoint?: string
}

export type GeneratedGroup = {
  kind: 'passage' | 'conversation' | 'talk'
  title: string | null
  body: string
  questions: GeneratedQuestion[]
}

export type GenerateExamResult = {
  standalone: GeneratedQuestion[]
  groups: GeneratedGroup[]
  /** Soal yang dibuang beserta alasannya — SELALU dilaporkan, tidak pernah disembunyikan */
  rejected: string[]
}

export const EMPTY_RESULT: GenerateExamResult = { standalone: [], groups: [], rejected: [] }

/**
 * Pemeriksaan pilihan ganda yang tidak bisa diungkapkan lewat JSON Schema.
 *
 * Soal pilihan ganda punya cacat khas yang lolos validasi bentuk: pilihan yang
 * duplikat, `answer_index` di luar jangkauan, atau stem kosong. JSON-nya valid;
 * soalnya tidak bisa dikerjakan.
 */
export function checkChoice(q: { stem: string; options: string[]; answer_index: number }): string[] {
  const problems: string[] = []
  const norm = q.options.map((o) => o.trim().toLowerCase())
  if (new Set(norm).size !== norm.length) problems.push('ada pilihan yang duplikat')
  if (norm.some((o) => !o)) problems.push('ada pilihan kosong')
  if (q.answer_index < 0 || q.answer_index >= q.options.length) {
    problems.push('answer_index di luar jangkauan')
  }
  if (!q.stem.trim()) problems.push('stem kosong')
  return problems
}

/**
 * Pecah naskah percakapan menjadi giliran bicara.
 *
 * Pemisahnya PENANDA PEMBICARA ("Man:", "Woman:", "男:", "女:", "店員:"), bukan
 * newline — model sering menaruh seluruh percakapan dalam satu baris.
 *
 * Pelajaran mahal dari versi pertama: pemeriksa yang menuntut satu giliran per
 * BARIS menolak 100% soal, karena modelnya menulis kedua giliran dalam satu
 * baris. Naskahnya benar; pemeriksanya yang salah asumsi.
 *
 * Penanda Jepang dan Korea ikut dikenali: naskah JLPT memakai 男/女/店員/先生
 * dan naskah TOPIK memakai 남자/여자/직원 — dengan titik dua lebar (：) maupun
 * biasa, bukan huruf Latin.
 *
 * Hangul sempat terlewat, dan akibatnya persis seperti pelajaran mahal di atas:
 * SELURUH soal 듣기 대화 ditolak karena naskahnya dikira bukan percakapan,
 * padahal naskahnya benar. Ini ketahuan lewat `npm run ai:smoke`, bukan lewat
 * typecheck — bentuknya valid, isinya yang tidak terbaca.
 */
export function splitDialogue(script: string): string[] {
  return script
    .replace(/\s*\b([A-Z][A-Za-z]{0,14}\s*:)/g, '\n$1')
    .replace(/\s*([぀-ヿ一-鿿가-힣]{1,6}\s*[:：])/g, '\n$1')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/**
 * Blok besar dipecah jadi beberapa panggilan.
 *
 * Meminta 30 soal sekaligus membuat keluarannya panjang, mudah terpotong, dan
 * kualitasnya menurun di bagian akhir. Sepuluh per panggilan jauh lebih stabil.
 */
export const MAX_PER_CALL = 10

export function splitCount(total: number): number[] {
  const parts: number[] = []
  let left = total
  while (left > 0) {
    parts.push(Math.min(MAX_PER_CALL, left))
    left -= MAX_PER_CALL
  }
  return parts
}
