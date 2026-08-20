import { generateSyllabus, type SyllabusLesson } from '@/lib/ai/syllabus'
import { curriculumFor } from '@/lib/languages/curriculum'
import { vocabLessons } from '@/lib/languages/vocabulary'

/**
 * Susun daftar pelajaran untuk sebuah jalur belajar.
 *
 * Dua sumber, dan urutannya penting:
 *
 * 1. **Kurikulum tetap** (`lib/languages/curriculum.ts`) kalau bahasanya punya.
 *    Nol panggilan AI, hasilnya sama setiap kali, dan kelengkapannya bisa diaudit
 *    dengan membaca daftarnya. Inggris memakai jalur ini — 60 pelajaran.
 *
 * 2. **Silabus buatan AI** untuk bahasa yang belum punya kurikulum tetap
 *    (Jepang, Korea, Spanyol). Lebih fleksibel, tapi tidak ada jaminan lengkap.
 *
 * `goal` tidak mengubah daftar pelajaran pada jalur kurikulum tetap — ia dipakai
 * belakangan sebagai konteks saat menulis materi & latihan tiap pelajaran. Tujuan
 * pelajar boleh memengaruhi CONTOH dan KOSAKATA, tapi tidak boleh membuat sebuah
 * pola grammar terlewat.
 */
export type SyllabusSource = 'curriculum' | 'ai'

export type BuiltSyllabus = {
  source: SyllabusSource
  lessons: SyllabusLesson[]
}

export async function buildSyllabus(args: {
  languageCode: string
  languageName: string
  nativeName: string
  startLevel: string
  levels: string[]
  goal?: string | null
}): Promise<BuiltSyllabus> {
  const curriculum = curriculumFor(args.languageCode)

  if (curriculum) {
    // Ambil dari level awal ke atas. Tidak ada gunanya mengulang pelajaran
    // di bawah level yang sudah dikuasai.
    const startIndex = Math.max(0, args.levels.indexOf(args.startLevel))
    const allowed = new Set(args.levels.slice(startIndex))

    const grammar: SyllabusLesson[] = curriculum
      .filter((e) => allowed.has(e.level))
      .map((e) => ({
        title: e.title,
        topic: e.context,
        focus: e.focus,
        level: e.level,
      }))

    // Kosakata akademik disisipkan, bukan ditumpuk di belakang.
    //
    // Kalau 38 pelajaran kosakata ditaruh setelah 60 pelajaran grammar, praktis
    // tidak akan pernah sampai ke sana. Diselipkan merata, keduanya jalan
    // berdampingan — dan variasinya juga bikin belajar tidak monoton.
    const vocab: SyllabusLesson[] = args.languageCode === 'en'
      ? vocabLessons()
          .map((v) => ({
            title: v.title,
            topic: `kosakata akademik: ${v.words.slice(0, 3).join(', ')}, dst`,
            focus: `Menguasai ${v.words.length} kata AWL Sublist ${v.sublist}: ${v.words.join(', ')}`,
            level: awlLevel(v.sublist, args.levels),
            words: v.words,
          }))
          .filter((v) => allowed.has(v.level))
      : []

    const lessons = interleave(grammar, vocab)
    if (lessons.length > 0) return { source: 'curriculum', lessons }
  }

  const lessons = await generateSyllabus({
    languageName: args.languageName,
    nativeName: args.nativeName,
    startLevel: args.startLevel,
    levels: args.levels,
    goal: args.goal,
  })
  return { source: 'ai', lessons }
}

/**
 * Sublist AWL → level.
 *
 * Makin tinggi nomor sublist, makin jarang katanya dipakai, jadi makin sulit.
 * Dipetakan ke daftar level bahasanya (bukan nama level yang dihardcode) supaya
 * tetap benar kalau daftar levelnya berubah.
 */
function awlLevel(sublist: number, levels: string[]): string {
  const slot = sublist <= 2 ? 1 : sublist <= 5 ? 2 : sublist <= 8 ? 3 : 4
  return levels[Math.min(slot, levels.length - 1)] ?? levels[0]
}

/**
 * Selipkan dua daftar secara MERATA menurut proporsinya.
 *
 * Bukan sekadar bergantian: 60 grammar dan 38 kosakata kalau dibuat bergantian
 * satu-satu akan menyisakan 22 grammar menumpuk di belakang. Cara ini selalu
 * mengambil dari daftar yang progresnya paling tertinggal, jadi keduanya habis
 * di waktu yang bersamaan.
 */
function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    const aDone = i >= a.length
    const bDone = j >= b.length
    if (bDone || (!aDone && i / a.length <= j / b.length)) {
      out.push(a[i++])
    } else {
      out.push(b[j++])
    }
  }
  return out
}
