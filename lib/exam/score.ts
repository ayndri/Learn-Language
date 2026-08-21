import { countsBySection, pointsBySection } from '@/lib/exam/blueprint'
import { examFormat, type ExamSection, type ExamSize } from '@/lib/exam/formats'

/**
 * PERKIRAAN SKOR SIMULASI
 *
 * Dua format, dua cara hitung — dan keduanya PERKIRAAN. Ini dinyatakan
 * terus-terusan di UI juga: angka yang terasa resmi padahal perkiraan itu lebih
 * menyesatkan daripada tidak ada angka sama sekali.
 *
 * TOEFL ITP  ETS memakai tabel konversi resmi yang berbeda tiap bentuk tes dan
 *            tidak dipublikasikan lengkap. Yang dipakai di sini interpolasi dari
 *            titik-titik yang umum diketahui (lihat `curve` di formats.ts).
 *
 * JLPT       Skor resminya memakai 尺度得点 — penilaian berbasis IRT, di mana
 *            bobot tiap soal bergantung pada tingkat kesulitannya dan tidak
 *            pernah diterbitkan. Mustahil ditiru. Yang dipakai di sini
 *            PROPORSIONAL: 70% benar di 聴解 → 42 dari 60. Nilai lulusnya
 *            (80/90/95/100) dan minimum tiap bagian (19 atau 38) memang angka
 *            resmi, tapi karena skalanya proporsional, "lulus" di sini berarti
 *            "kemungkinan besar lulus", bukan lulus.
 *
 * TOPIK      Tiap bagian bernilai 0–100 dan hasilnya berupa TINGKAT (급), bukan
 *            lulus/tidak. Ambangnya (1급 80, 2급 140, 3급 120…) angka resmi.
 *            Bagian 듣기/읽기 proporsional terhadap jumlah benar; 쓰기 memakai
 *            poin yang diberikan AI dengan rubrik, dan itu bagian yang paling
 *            tidak bisa dipercaya sebagai angka — penilai manusia pun berbeda.
 *
 * HSK        Tiap bagian 0–100, lulus kalau TOTALNYA mencapai 60% (120 dari 200
 *            untuk HSK 1–2, 180 dari 300 untuk HSK 3–6). Tidak ada minimum per
 *            bagian, jadi bedanya dengan JLPT bukan cuma angkanya. Nilai resmi
 *            HSK juga memakai penyetaraan antarsesi yang tidak diterbitkan;
 *            yang di sini proporsional terhadap jumlah benar.
 *
 * DELE       Empat prueba dikelompokkan jadi dua GRUPO yang masing-masing
 *            bernilai 0–50 dan masing-masing wajib mencapai 30 — aturan yang
 *            persis sama dengan JLPT, jadi dihitung di cabang yang sama.
 *            Bedanya: bagian lisan tidak dibuat di sini, jadi comprensión
 *            auditiva memikul seluruh Grupo 2 sendirian. "Apto" di sini berarti
 *            kemungkinan besar Apto kalau bagian lisanmu sepadan.
 *
 * Semua hitungan memakai POIN, bukan jumlah soal. Untuk TOEFL dan JLPT keduanya
 * identik (satu soal = satu poin); yang membedakan TOPIK 쓰기, HSK 书写, dan
 * DELE expresión escrita.
 */

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
  /** seksi yang dinilai; untuk JLPT N4/N5 satu bagian bisa mencakup dua seksi */
  sections: ExamSection[]
  label: string
  correct: number
  total: number
  scaled: number
  max: number
  /** JLPT: batas minimum bagian ini. null kalau formatnya tidak punya. */
  passMin: number | null
}

/**
 * Nilai tiap bagian penilaian, proporsional terhadap poin yang didapat.
 *
 * Dipakai bersama oleh JLPT, TOPIK, dan HSK — ketiganya menghitung bagian
 * dengan cara yang persis sama, dan bedanya cuma ada di apa yang dilakukan
 * dengan TOTALNYA (lulus/tidak, tingkat, atau keduanya). Ditulis satu kali
 * supaya format keempat tidak perlu menyalinnya lagi.
 *
 * `passMin` hanya dipunyai JLPT; untuk yang lain nilainya null dan halaman
 * hasil tidak menggambar garis batas apa pun.
 */
function bandScores(
  bands: { sections: ExamSection[]; label: string; max: number; passMin?: number }[],
  totals: Record<ExamSection, number>,
  correctBySection: Record<ExamSection, number>,
): SectionScore[] {
  return bands.map((band) => {
    const total = band.sections.reduce((a, sec) => a + totals[sec], 0)
    const correct = band.sections.reduce(
      (a, sec) => a + Math.min(correctBySection[sec] ?? 0, totals[sec]),
      0,
    )
    return {
      sections: band.sections,
      label: band.label,
      correct,
      total,
      scaled: total === 0 ? 0 : Math.round((band.max * correct) / total),
      max: band.max,
      passMin: band.passMin ?? null,
    }
  })
}

export type ExamScore = {
  sections: SectionScore[]
  total: number
  /** rentang skala format ini, untuk grafik dan konteks */
  range: [number, number]
  correct: number
  answered: number
  questions: number
  /** JLPT: lulus atau tidak menurut perkiraan ini. null untuk format tanpa batas lulus. */
  passed: boolean | null
  passMark: number | null
  /** TOPIK: tingkat (급) yang diperoleh. null untuk format tanpa tingkat. */
  grade?: string | null
}

export function scoreExam(args: {
  kind: string
  size: ExamSize
  /**
   * Poin yang diperoleh per seksi. Untuk soal pilihan ganda satu jawaban benar
   * = satu poin, jadi ini sama dengan jumlah benar; untuk 쓰기 ini nilai dari AI.
   */
  correctBySection: Record<ExamSection, number>
  answered: number
}): ExamScore {
  const format = examFormat(args.kind)
  const totals = pointsBySection(args.kind, args.size)
  const questions = countsBySection(args.kind, args.size)
  const scoring = format.scoring

  if (scoring.type === 'topik') {
    const sections = bandScores(scoring.bands, totals, args.correctBySection)
    const total = sections.reduce((a, sec) => a + sec.scaled, 0)
    const lowest = scoring.grades[scoring.grades.length - 1]

    return {
      sections,
      total,
      range: scoring.range,
      correct: sections.reduce((a, sec) => a + sec.correct, 0),
      answered: args.answered,
      questions: ([1, 2, 3] as const).reduce((a, sec) => a + questions[sec], 0),
      passed: total >= lowest.min,
      passMark: lowest.min,
      grade: scoring.grades.find((g) => total >= g.min)?.level ?? null,
    }
  }

  if (scoring.type === 'hsk') {
    const sections = bandScores(scoring.bands, totals, args.correctBySection)
    const total = sections.reduce((a, sec) => a + sec.scaled, 0)

    return {
      sections,
      total,
      range: scoring.range,
      correct: sections.reduce((a, sec) => a + sec.correct, 0),
      answered: args.answered,
      questions: ([1, 2, 3] as const).reduce((a, sec) => a + questions[sec], 0),
      // Cukup totalnya: HSK tidak punya nilai minimum per bagian, jadi tidak
      // ada syarat kedua seperti di JLPT.
      passed: total >= scoring.pass,
      passMark: scoring.pass,
    }
  }

  // JLPT dan DELE dihitung bersama karena aturannya memang sama: ambang total
  // PLUS minimum tiap bagian. Yang berbeda cuma angkanya (19 dari 60 vs 30 dari
  // 50) dan itu sudah ada di datanya.
  if (scoring.type === 'jlpt' || scoring.type === 'dele') {
    const sections = bandScores(scoring.bands, totals, args.correctBySection)
    const total = sections.reduce((a, s) => a + s.scaled, 0)
    // Lulus butuh DUA syarat: total di atas batas DAN tiap bagian di atas
    // minimumnya. Gagal satu bagian saja tetap tidak lulus, sekalipun totalnya
    // jauh di atas — ini aturan JLPT yang paling sering bikin orang kaget.
    const passed = total >= scoring.pass && sections.every((s) => s.scaled >= (s.passMin ?? 0))

    return {
      sections,
      total,
      range: scoring.range,
      correct: sections.reduce((a, s) => a + s.correct, 0),
      answered: args.answered,
      questions: ([1, 2, 3] as const).reduce((a, sec) => a + questions[sec], 0),
      passed,
      passMark: scoring.pass,
    }
  }

  const sections: SectionScore[] = ([1, 2, 3] as const)
    .filter((sec) => totals[sec] > 0)
    .map((sec) => {
      const total = totals[sec]
      const correct = Math.min(args.correctBySection[sec] ?? 0, total)
      return {
        sections: [sec],
        label: format.sections[sec],
        correct,
        total,
        scaled: Math.round(interpolate(scoring.curve[sec], correct / total)),
        max: scoring.curve[sec][scoring.curve[sec].length - 1][1],
        passMin: null,
      }
    })

  // Rumus ITP: (jumlah tiga skor seksi) × 10 ÷ 3.
  // Kalau ada seksi yang tidak ikut (mode short), rata-ratanya dipakai sebagai
  // pengganti supaya skornya tetap berada di rentang yang bisa dibandingkan.
  const avg = sections.reduce((a, s) => a + s.scaled, 0) / (sections.length || 1)
  const sum = ([1, 2, 3] as const).reduce(
    (a, sec) => a + (sections.find((s) => s.sections[0] === sec)?.scaled ?? avg),
    0,
  )

  return {
    sections,
    total: Math.round((sum * 10) / 3),
    range: scoring.range,
    correct: sections.reduce((a, s) => a + s.correct, 0),
    answered: args.answered,
    questions: ([1, 2, 3] as const).reduce((a, sec) => a + questions[sec], 0),
    passed: null,
    passMark: null,
  }
}

/** Keterangan kasar untuk sebuah skor — konteks, bukan penilaian resmi. */
export function scoreBand(kind: string, score: ExamScore): { label: string; note: string } {
  const format = examFormat(kind)

  if (format.scoring.type === 'topik') {
    if (!score.grade) {
      return {
        label: 'Belum dapat tingkat',
        note: `Kurang ${(score.passMark ?? 0) - score.total} poin dari ambang terendah.`,
      }
    }
    const next = [...format.scoring.grades].reverse().find((g) => g.min > score.total)
    return {
      label: `Setara ${score.grade}`,
      note: next
        ? `Kurang ${next.min - score.total} poin lagi untuk ${next.level}.`
        : 'Tingkat tertinggi. Tidak ada lagi di atas ini.',
    }
  }

  if (format.scoring.type === 'hsk') {
    const short = format.short
    if (score.passed) {
      const margin = score.total - (score.passMark ?? 0)
      return margin >= score.range[1] * 0.15
        ? { label: `Lulus ${short} dengan aman`, note: 'Boleh mulai melirik tingkat berikutnya.' }
        : { label: `Lulus ${short}`, note: 'Lewat batas, tapi belum lebar — mantapkan dulu.' }
    }
    // Bagian terlemah disebut, bukan cuma selisih totalnya: HSK tidak punya
    // minimum per bagian, jadi satu bagian yang jatuh masih bisa ditutup oleh
    // yang lain — dan yang berguna diketahui adalah bagian mana itu.
    const weakest = [...score.sections].sort((a, b) => a.scaled / a.max - b.scaled / b.max)[0]
    return {
      label: `Belum lulus ${short}`,
      note: weakest
        ? `Kurang ${(score.passMark ?? 0) - score.total} poin. Yang paling tertinggal: ${weakest.label}.`
        : `Kurang ${(score.passMark ?? 0) - score.total} poin dari batas lulus.`,
    }
  }

  if (format.scoring.type === 'jlpt' || format.scoring.type === 'dele') {
    const short = format.short
    if (score.passed) {
      const margin = score.total - (score.passMark ?? 0)
      return margin >= 25
        ? { label: `Lulus ${short} dengan aman`, note: 'Boleh mulai melirik level berikutnya.' }
        : { label: `Lulus ${short}`, note: 'Batasnya belum lebar — mantapkan dulu sebelum naik.' }
    }
    const weak = score.sections.filter((s) => s.scaled < (s.passMin ?? 0))
    if (weak.length) {
      return {
        label: `Belum lulus ${short}`,
        note: `Bagian ${weak.map((w) => w.label).join(' & ')} masih di bawah batas minimum.`,
      }
    }
    return {
      label: `Belum lulus ${short}`,
      note: `Kurang ${(score.passMark ?? 0) - score.total} poin dari batas lulus.`,
    }
  }

  const total = score.total
  if (total >= 600) return { label: 'Sangat tinggi', note: 'Di atas syarat hampir semua beasiswa.' }
  if (total >= 550) return { label: 'Tinggi', note: 'Umumnya cukup untuk syarat LPDP jalur ITP.' }
  if (total >= 500) return { label: 'Menengah atas', note: 'Cukup untuk banyak program S2 dalam negeri.' }
  if (total >= 450) return { label: 'Menengah', note: 'Perlu naik lagi untuk sebagian besar beasiswa.' }
  if (total >= 400) return { label: 'Dasar', note: 'Fondasinya ada, tinggal diperbanyak latihannya.' }
  return { label: 'Awal', note: 'Fokus dulu ke pelajaran di jalur belajarmu.' }
}
