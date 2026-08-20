import { countsBySection, type ExamSize } from '@/lib/exam/blueprint'

/**
 * Perkiraan skor TOEFL ITP.
 *
 * ETS memakai tabel konversi resmi yang berbeda tiap bentuk tes dan tidak
 * dipublikasikan lengkap. Yang di sini adalah **interpolasi dari titik-titik yang
 * umum diketahui** — cukup untuk melihat kemajuan dari waktu ke waktu, TIDAK
 * untuk mengklaim skor sebenarnya.
 *
 * Ini dinyatakan terus-terusan di UI juga. Angka yang terasa resmi padahal
 * perkiraan itu lebih menyesatkan daripada tidak ada angka sama sekali.
 */

/**
 * Titik acuan: [proporsi benar, skor skala] per seksi.
 *
 * Rentang resmi TOEFL ITP Level 1: tiap seksi 31–68 (seksi 3 maksimum 67),
 * total 310–677. Batas BAWAHNYA 31, bukan 0 — jawaban salah semua tetap
 * menghasilkan 310, bukan nol. (Angka 24/20/21 yang beredar itu dari tabel
 * TOEFL PBT lama, bukan ITP.)
 *
 * Titik di antaranya interpolasi — lihat catatan di atas.
 */
const CURVE: Record<1 | 2 | 3, [number, number][]> = {
  1: [
    [0, 31],
    [0.2, 38],
    [0.4, 45],
    [0.6, 51],
    [0.8, 57],
    [0.94, 63],
    [1, 68],
  ],
  2: [
    [0, 31],
    [0.2, 40],
    [0.4, 47],
    [0.6, 53],
    [0.8, 58],
    [0.95, 64],
    [1, 68],
  ],
  3: [
    [0, 31],
    [0.2, 38],
    [0.4, 44],
    [0.6, 50],
    [0.8, 56],
    [0.94, 62],
    [1, 67],
  ],
}

function interpolate(points: [number, number][], x: number): number {
  const clamped = Math.min(1, Math.max(0, x))
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    if (clamped <= x1) {
      const t = x1 === x0 ? 0 : (clamped - x0) / (x1 - x0)
      return y0 + t * (y1 - y0)
    }
  }
  return points[points.length - 1][1]
}

export type SectionScore = {
  section: 1 | 2 | 3
  correct: number
  total: number
  scaled: number
}

export type ExamScore = {
  sections: SectionScore[]
  /** total skala TOEFL ITP, rentang ±310–677 */
  total: number
  correct: number
  answered: number
  questions: number
}

export function scoreExam(args: {
  size: ExamSize
  /** jumlah benar per seksi */
  correctBySection: Record<1 | 2 | 3, number>
  answered: number
}): ExamScore {
  const totals = countsBySection(args.size)

  const sections: SectionScore[] = ([1, 2, 3] as const)
    .filter((sec) => totals[sec] > 0)
    .map((sec) => {
      const total = totals[sec]
      const correct = Math.min(args.correctBySection[sec] ?? 0, total)
      return {
        section: sec,
        correct,
        total,
        scaled: Math.round(interpolate(CURVE[sec], correct / total)),
      }
    })

  // Rumus ITP: (jumlah tiga skor seksi) × 10 ÷ 3.
  // Kalau ada seksi yang tidak ikut (mode short), rata-ratanya dipakai sebagai
  // pengganti supaya skornya tetap berada di rentang yang bisa dibandingkan.
  const avg = sections.reduce((a, s) => a + s.scaled, 0) / (sections.length || 1)
  const sum = ([1, 2, 3] as const).reduce(
    (a, sec) => a + (sections.find((s) => s.section === sec)?.scaled ?? avg),
    0,
  )

  return {
    sections,
    total: Math.round((sum * 10) / 3),
    correct: sections.reduce((a, s) => a + s.correct, 0),
    answered: args.answered,
    questions: sections.reduce((a, s) => a + s.total, 0),
  }
}

/** Keterangan kasar untuk sebuah skor total — konteks, bukan penilaian resmi. */
export function scoreBand(total: number): { label: string; note: string } {
  if (total >= 600) return { label: 'Sangat tinggi', note: 'Di atas syarat hampir semua beasiswa.' }
  if (total >= 550) return { label: 'Tinggi', note: 'Umumnya cukup untuk syarat LPDP jalur ITP.' }
  if (total >= 500) return { label: 'Menengah atas', note: 'Cukup untuk banyak program S2 dalam negeri.' }
  if (total >= 450) return { label: 'Menengah', note: 'Perlu naik lagi untuk sebagian besar beasiswa.' }
  if (total >= 400) return { label: 'Dasar', note: 'Fondasinya ada, tinggal diperbanyak latihannya.' }
  return { label: 'Awal', note: 'Fokus dulu ke pelajaran di jalur belajarmu.' }
}
