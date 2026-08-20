/**
 * CETAK BIRU TOEFL ITP
 *
 * Struktur aslinya (paper-based / ITP), 140 soal, ±115 menit:
 *
 *   Seksi 1 — Listening Comprehension          50 soal, ±35 menit
 *     Part A  percakapan pendek                30
 *     Part B  percakapan panjang (2 rekaman)    8
 *     Part C  ceramah/talk (3 rekaman)         12
 *
 *   Seksi 2 — Structure & Written Expression   40 soal, 25 menit
 *     Part A  melengkapi kalimat               15
 *     Part B  menemukan bagian yang salah      25
 *
 *   Seksi 3 — Reading Comprehension            50 soal, 55 menit
 *     5 bacaan × 10 soal
 *
 * Ditulis sebagai data supaya jumlahnya bisa diperiksa, bukan dipercaya.
 * Mode `short` untuk latihan cepat — proporsinya sama, jumlahnya sepertiga.
 */

export type ExamSize = 'full' | 'short'

export type BlueprintBlock = {
  section: 1 | 2 | 3
  part: 'A' | 'B' | 'C'
  type:
    | 'listening_short'
    | 'listening_long'
    | 'listening_talk'
    | 'structure'
    | 'written_expression'
    | 'reading'
  /** jumlah kelompok (bacaan / rekaman panjang). 0 = soal berdiri sendiri */
  groups: number
  /** soal per kelompok, atau total soal kalau `groups` = 0 */
  perGroup: number
  label: string
}

const FULL: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'listening_short', groups: 0, perGroup: 30, label: 'Percakapan pendek' },
  { section: 1, part: 'B', type: 'listening_long', groups: 2, perGroup: 4, label: 'Percakapan panjang' },
  { section: 1, part: 'C', type: 'listening_talk', groups: 3, perGroup: 4, label: 'Ceramah singkat' },
  { section: 2, part: 'A', type: 'structure', groups: 0, perGroup: 15, label: 'Melengkapi kalimat' },
  { section: 2, part: 'B', type: 'written_expression', groups: 0, perGroup: 25, label: 'Menemukan kesalahan' },
  { section: 3, part: 'A', type: 'reading', groups: 5, perGroup: 10, label: 'Bacaan' },
]

const SHORT: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'listening_short', groups: 0, perGroup: 10, label: 'Percakapan pendek' },
  { section: 1, part: 'C', type: 'listening_talk', groups: 1, perGroup: 4, label: 'Ceramah singkat' },
  { section: 2, part: 'A', type: 'structure', groups: 0, perGroup: 6, label: 'Melengkapi kalimat' },
  { section: 2, part: 'B', type: 'written_expression', groups: 0, perGroup: 8, label: 'Menemukan kesalahan' },
  { section: 3, part: 'A', type: 'reading', groups: 1, perGroup: 10, label: 'Bacaan' },
]

export function blueprint(size: ExamSize): BlueprintBlock[] {
  return size === 'full' ? FULL : SHORT
}

export function questionCount(size: ExamSize): number {
  return blueprint(size).reduce(
    (sum, b) => sum + (b.groups === 0 ? b.perGroup : b.groups * b.perGroup),
    0,
  )
}

/** Jumlah soal per seksi — dipakai untuk penilaian dan tampilan */
export function countsBySection(size: ExamSize): Record<1 | 2 | 3, number> {
  const out = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>
  for (const b of blueprint(size)) {
    out[b.section] += b.groups === 0 ? b.perGroup : b.groups * b.perGroup
  }
  return out
}

export const SECTION_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Listening Comprehension',
  2: 'Structure & Written Expression',
  3: 'Reading Comprehension',
}

/** Batas waktu resmi per seksi, dalam menit */
export const SECTION_MINUTES: Record<1 | 2 | 3, number> = { 1: 35, 2: 25, 3: 55 }

export function sectionMinutes(section: 1 | 2 | 3, size: ExamSize): number {
  const full = countsBySection('full')[section]
  const now = countsBySection(size)[section]
  if (now === 0) return 0
  // Mode short memakai waktu proporsional supaya tekanannya tetap terasa sama.
  return Math.max(3, Math.round((SECTION_MINUTES[section] * now) / full))
}
