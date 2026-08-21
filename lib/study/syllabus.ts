import { generateSyllabus, type SyllabusLesson } from '@/lib/ai/syllabus'
import { curriculumFor } from '@/lib/languages/curriculum'
import { extraTracks, grammarItemTypes, type LessonTrack } from '@/lib/languages/tracks'

/**
 * Susun daftar pelajaran untuk sebuah jalur belajar.
 *
 * Dua sumber, dan urutannya penting:
 *
 * 1. **Kurikulum tetap** (`lib/languages/curriculum.ts`) kalau bahasanya punya.
 *    Nol panggilan AI, hasilnya sama setiap kali, dan kelengkapannya bisa diaudit
 *    dengan membaca daftarnya. Inggris (A1–C2), Jepang (N5–N1), Korea (1급–6급),
 *    dan Mandarin (HSK 1–6) memakai jalur ini.
 *
 * 2. **Silabus buatan AI** untuk bahasa yang belum punya kurikulum tetap
 *    (Spanyol). Lebih fleksibel, tapi tidak ada jaminan lengkap.
 *
 * Di atas kurikulum grammar ada JALUR TAMBAHAN per bahasa (`lib/languages/tracks.ts`):
 * kosakata akademik untuk Inggris; kana, kanji, dan kosakata inti untuk Jepang;
 * hangul untuk Korea; pinyin dan hanzi untuk Mandarin. Semuanya diselipkan,
 * bukan ditumpuk di belakang — lihat `interleave`.
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
    const allowedLevels = args.levels.slice(startIndex)
    const allowed = new Set(allowedLevels)

    const grammar: SyllabusLesson[] = curriculum
      .filter((e) => allowed.has(e.level))
      .map((e) => ({
        title: e.title,
        topic: e.context,
        focus: e.focus,
        level: e.level,
        itemTypes: grammarItemTypes(args.languageCode, e.level, args.levels),
        strand: e.strand ?? 'tatabahasa',
      }))

    const extra = extraTracks(args.languageCode, allowedLevels, args.levels)

    const prefix = extra.filter((t) => t.mode === 'prefix').flatMap((t) => t.lessons)

    // Grammar dipecah dulu per bagian materi (imbuhan vs pola kalimat) sebelum
    // dianyam. Kalau tidak, bagian yang isinya sedikit ikut hanyut di dalam
    // daftar besar dan urutannya jadi menumpuk di satu tempat.
    const grammarStrands = [...new Set(grammar.map((l) => l.strand))].map((id) =>
      grammar.filter((l) => l.strand === id),
    )

    const woven = [
      ...grammarStrands,
      ...extra.filter((t) => t.mode === 'interleave').map((t: LessonTrack) => t.lessons),
    ]

    // Diselipkan PER LEVEL, bukan sekali untuk seluruh silabus.
    //
    // Kalau seluruh daftar dianyam sekaligus, jalur yang pelajarannya lebih
    // sedikit di level itu akan "mendahului" ke level berikutnya: kanji N4
    // muncul di pelajaran ke-38 sementara grammar masih N5. Level yang tertulis
    // di kartu jadi bohong, dan kosakatanya melompat lebih cepat daripada
    // grammar yang seharusnya menopangnya.
    const lessons = [...prefix]
    for (const level of allowedLevels) {
      const atLevel = (list: SyllabusLesson[]) => list.filter((l) => l.level === level)
      lessons.push(...interleave(woven.map(atLevel)))
    }

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
 * Selipkan beberapa daftar secara MERATA menurut proporsinya.
 *
 * Bukan sekadar bergantian: 60 grammar dan 38 kosakata kalau dibuat bergantian
 * satu-satu akan menyisakan 22 grammar menumpuk di belakang. Cara ini selalu
 * mengambil dari daftar yang progresnya paling tertinggal, jadi semuanya habis
 * di waktu yang bersamaan.
 *
 * Untuk bahasa Jepang ada tiga daftar sekaligus (grammar, kanji, kosakata), dan
 * itu justru bagus: tiga hari berturut-turut mengerjakan kartu kanji saja
 * membosankan, dan yang membosankan tidak dikerjakan.
 */
function interleave<T>(lists: T[][]): T[] {
  const active = lists.filter((l) => l.length > 0)
  const cursor = active.map(() => 0)
  const out: T[] = []

  const total = active.reduce((a, l) => a + l.length, 0)
  for (let n = 0; n < total; n++) {
    let pick = -1
    let worst = Infinity
    for (let i = 0; i < active.length; i++) {
      if (cursor[i] >= active[i].length) continue
      // Progres relatif, bukan jumlah mutlak — daftar 130 pelajaran dan daftar
      // 14 pelajaran harus sama-sama habis di ujung, bukan yang pendek duluan.
      const progress = cursor[i] / active[i].length
      if (progress < worst) {
        worst = progress
        pick = i
      }
    }
    if (pick < 0) break
    out.push(active[pick][cursor[pick]++])
  }

  return out
}
