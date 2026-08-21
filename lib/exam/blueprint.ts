import {
  examFormat,
  type BlueprintBlock,
  type ExamSection,
  type ExamSize,
} from '@/lib/exam/formats'

/**
 * Pembacaan cetak biru — tipis di atas `lib/exam/formats.ts`.
 *
 * Semua fungsi di sini menerima `kind` (id format) sebagai argumen pertama.
 * Dulu tidak: seluruh modul ujian mengasumsikan TOEFL ITP, dan asumsi itu ikut
 * menyebar ke halaman. Sekarang halaman cukup meneruskan `exam.kind` yang
 * memang sudah tersimpan di database sejak awal.
 */

export type { BlueprintBlock, ExamSection, ExamSize }

export function blueprint(kind: string, size: ExamSize): BlueprintBlock[] {
  return examFormat(kind).blocks[size]
}

export function questionCount(kind: string, size: ExamSize): number {
  return blueprint(kind, size).reduce(
    (sum, b) => sum + (b.groups === 0 ? b.perGroup : b.groups * b.perGroup),
    0,
  )
}

/** Jumlah soal per seksi — dipakai untuk penilaian dan tampilan */
export function countsBySection(kind: string, size: ExamSize): Record<ExamSection, number> {
  const out = { 1: 0, 2: 0, 3: 0 } as Record<ExamSection, number>
  for (const b of blueprint(kind, size)) {
    out[b.section] += b.groups === 0 ? b.perGroup : b.groups * b.perGroup
  }
  return out
}

/**
 * POIN maksimum per seksi — bukan jumlah soal.
 *
 * Untuk hampir semua ujian keduanya sama: satu soal, satu poin. TOPIK 쓰기
 * memecah kesamaan itu — empat soal, seratus poin — jadi penilaian memakai
 * fungsi ini, sementara tampilan tetap memakai `countsBySection`.
 */
export function pointsBySection(kind: string, size: ExamSize): Record<ExamSection, number> {
  const out = { 1: 0, 2: 0, 3: 0 } as Record<ExamSection, number>
  for (const b of blueprint(kind, size)) {
    const questions = b.groups === 0 ? b.perGroup : b.groups * b.perGroup
    out[b.section] += questions * (b.points ?? 1)
  }
  return out
}

export function sectionNames(kind: string): Record<ExamSection, string> {
  return examFormat(kind).sections
}

/** Batas waktu resmi per seksi, dalam menit */
export function sectionMinutes(kind: string, section: ExamSection, size: ExamSize): number {
  const format = examFormat(kind)
  const full = countsBySection(kind, 'full')[section]
  const now = countsBySection(kind, size)[section]
  if (now === 0 || full === 0) return 0
  // Mode short memakai waktu proporsional supaya tekanannya tetap terasa sama.
  return Math.max(3, Math.round((format.minutes[section] * now) / full))
}

export function totalMinutes(kind: string, size: ExamSize): number {
  return ([1, 2, 3] as const).reduce((a, s) => a + sectionMinutes(kind, s, size), 0)
}
