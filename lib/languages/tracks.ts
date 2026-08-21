import type { SyllabusLesson } from '@/lib/ai/syllabus'
import type { ItemType } from '@/lib/items/types'
import { EN_AFFIXES, EN_CONVERSATION, EN_SOUNDS } from '@/lib/languages/en/foundations'
import { EN_VOCAB_THEMES } from '@/lib/languages/en/vocabulary'
import { ES_CONVERSATION } from '@/lib/languages/es/conversation'
import { ES_SOUNDS } from '@/lib/languages/es/sounds'
import { ES_VOCAB_THEMES } from '@/lib/languages/es/vocabulary'
import { JA_CONVERSATION } from '@/lib/languages/ja/conversation'
import { KO_CONVERSATION } from '@/lib/languages/ko/conversation'
import { hangulLessons } from '@/lib/languages/ko/hangul'
import { KO_VOCAB_THEMES } from '@/lib/languages/ko/vocabulary'
import { kanaLessons } from '@/lib/languages/ja/kana'
import { kanjiLessons } from '@/lib/languages/ja/kanji'
import { vocabThemes } from '@/lib/languages/ja/vocabulary'
import { ZH_CONVERSATION } from '@/lib/languages/zh/conversation'
import { hanziLessons } from '@/lib/languages/zh/hanzi'
import { pinyinLessons } from '@/lib/languages/zh/pinyin'
import { ZH_VOCAB_THEMES } from '@/lib/languages/zh/vocabulary'
import { pickThemes } from '@/lib/languages/vocab-theme'
import { vocabLessons } from '@/lib/languages/vocabulary'

/**
 * JALUR PELAJARAN DI LUAR GRAMMAR
 *
 * Kurikulum grammar (`lib/languages/curriculum.ts`) hanya separuh cerita. Tiap
 * bahasa punya jalur lain yang harus jalan berdampingan:
 *
 *   Inggris  — bunyi & ejaan, kosakata inti + AWL, imbuhan, percakapan
 *   Jepang   — kana, kanji, kosakata inti, percakapan
 *   Korea    — hangul & aturan bunyi, kosakata inti, percakapan
 *   Mandarin — pinyin & nada, hanzi, kosakata inti, percakapan
 *   Spanyol  — bunyi & ejaan, kosakata inti, percakapan
 *
 * Semuanya dinyatakan di file ini sebagai DATA yang bentuknya sama, supaya
 * `lib/study/syllabus.ts` tidak perlu tahu bahasa apa yang sedang disusun.
 * Nambah jalur baru untuk bahasa lain = nambah satu entri di `TRACKS`.
 */

export type PlannedLesson = SyllabusLesson

export type LessonTrack = {
  key: string
  /**
   * `prefix`      seluruh pelajaran jalur ini ditaruh di depan, berurutan.
   * `interleave`  diselipkan merata di antara pelajaran grammar.
   *
   * Kana WAJIB `prefix`. Kalau ikut diselipkan merata, kamu baru selesai
   * belajar katakana di pelajaran ke-200 — padahal semua pelajaran sebelumnya
   * ditulis dengan kana.
   */
  mode: 'prefix' | 'interleave'
  lessons: PlannedLesson[]
}

// ---------------------------------------------------------------------------
// Inggris
// ---------------------------------------------------------------------------

function englishTracks(allowed: Set<string>, levels: string[]): LessonTrack[] {
  const tracks: LessonTrack[] = []
  const beginner = levels[0] // 'A1'

  // Bunyi & ejaan = bagian "aksara" untuk bahasa Inggris.
  //
  // Ditaruh di depan sama seperti kana, tapi TIDAK seluruhnya: berbeda dengan
  // kana yang mustahil dilewati, orang bisa mulai bicara sebelum menguasai
  // seluruh sistem bunyi. Yang wajib di depan cuma level pemula; sisanya
  // (tekanan kata, schwa, connected speech) menyusul di levelnya sendiri.
  const sounds = EN_SOUNDS.filter((l) => allowed.has(l.level))
  const early = sounds.filter((l) => l.level === beginner)
  const later = sounds.filter((l) => l.level !== beginner)

  const soundLesson = (l: (typeof EN_SOUNDS)[number]) => ({
    title: l.title,
    topic: l.context,
    focus: l.focus,
    level: l.level,
    words: l.words,
    wordListType: 'sound' as ItemType,
    // `sound`, bukan `script`: bunyi bahasa Inggris tidak bisa diketik sebagai
    // romanisasi — lihat catatan di registry.
    itemTypes: ['sound'] as ItemType[],
    strand: 'aksara',
  })

  if (early.length) tracks.push({ key: 'sounds', mode: 'prefix', lessons: early.map(soundLesson) })
  if (later.length) {
    tracks.push({ key: 'sounds-later', mode: 'interleave', lessons: later.map(soundLesson) })
  }

  // Kosakata inti dulu, AWL menyusul. Keduanya masuk tab yang sama dan
  // berurutan menurut level — AWL memang sengaja tidak memuat kata dasar.
  const core = pickThemes(EN_VOCAB_THEMES, [...allowed]).map((v) => ({
    title: `Kosakata: ${v.title}`,
    topic: v.context,
    focus: `Menguasai ${v.words.length} kata: ${v.words.join(', ')}`,
    level: v.level,
    words: v.words,
    wordListType: 'vocab' as ItemType,
    itemTypes: ['vocab', 'listening'] as ItemType[],
    strand: 'kosakata',
  }))

  const awl = vocabLessons()
    .map((v) => ({
      title: v.title,
      topic: `kosakata akademik: ${v.words.slice(0, 3).join(', ')}, dst`,
      focus: `Menguasai ${v.words.length} kata AWL Sublist ${v.sublist}: ${v.words.join(', ')}`,
      level: awlLevel(v.sublist, levels),
      words: v.words,
      wordListType: 'vocab' as ItemType,
      itemTypes: ['vocab', 'listening'] as ItemType[],
      strand: 'kosakata',
    }))
    .filter((v) => allowed.has(v.level))

  if (core.length || awl.length) {
    tracks.push({ key: 'kosakata', mode: 'interleave', lessons: [...core, ...awl] })
  }

  const affixes = EN_AFFIXES.filter((l) => allowed.has(l.level))
  if (affixes.length) {
    tracks.push({
      key: 'affixes',
      mode: 'interleave',
      lessons: affixes.map((l) => ({
        title: l.title,
        topic: l.context,
        focus: l.focus,
        level: l.level,
        itemTypes: ['vocab', 'cloze', 'sentence', 'listening'] as ItemType[],
        strand: 'imbuhan',
      })),
    })
  }

  const talk = EN_CONVERSATION.filter((l) => allowed.has(l.level))
  if (talk.length) {
    tracks.push({
      key: 'talk',
      mode: 'interleave',
      lessons: talk.map((l) => ({
        title: l.title,
        topic: l.context,
        focus: l.focus,
        level: l.level,
        itemTypes: ['phrase', 'sentence', 'listening', 'speaking'] as ItemType[],
        strand: 'percakapan',
      })),
    })
  }

  return tracks
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

// ---------------------------------------------------------------------------
// Jepang
// ---------------------------------------------------------------------------

function japaneseTracks(allowed: Set<string>, levels: string[]): LessonTrack[] {
  const tracks: LessonTrack[] = []
  const beginner = levels[0] // 'N5'

  // Kana hanya relevan kalau kamu memang mulai dari nol. Pelajar yang memulai
  // dari N3 sudah membaca kana bertahun-tahun; menyodorkannya lagi cuma
  // membuang waktu dan panggilan AI.
  if (allowed.has(beginner)) {
    tracks.push({
      key: 'kana',
      mode: 'prefix',
      lessons: kanaLessons().map((k) => ({
        title: k.title,
        topic: k.context,
        focus: k.focus,
        level: beginner,
        words: k.glyphs,
        wordListType: 'script' as ItemType,
        // Pelajaran kana tidak butuh soal bacaan atau mengarang: kamu belum
        // punya satu pun kata untuk dipakai.
        itemTypes: ['script'] as ItemType[],
        strand: 'aksara',
      })),
    })
  }

  const kanji = kanjiLessons(levels.filter((l) => allowed.has(l)))
  if (kanji.length) {
    tracks.push({
      key: 'kanji',
      mode: 'interleave',
      lessons: kanji.map((k) => ({
        title: k.title,
        topic: `kanji ${k.level}: ${k.kanji.slice(0, 4).join('')} dst`,
        focus:
          `Menguasai ${k.kanji.length} kanji berikut — bentuk, arti, 音読み dan 訓読み, ` +
          `serta satu kata contoh untuk tiap bacaan: ${k.kanji.join(' ')}`,
        level: k.level,
        words: k.kanji,
        wordListType: 'kanji' as ItemType,
        itemTypes: ['kanji'] as ItemType[],
        strand: 'kanji',
      })),
    })
  }

  const vocab = vocabThemes(levels.filter((l) => allowed.has(l)))
  if (vocab.length) {
    tracks.push({
      key: 'goi',
      mode: 'interleave',
      lessons: vocab.map((v) => ({
        title: `Kosakata: ${v.title}`,
        topic: v.context,
        focus: `Menguasai ${v.words.length} kata: ${v.words.join('、')}`,
        level: v.level,
        words: v.words,
        wordListType: 'vocab' as ItemType,
        // Kosakata + dikte turunan dari contoh kalimatnya sudah cukup padat.
        // `listening` ikut disebut karena item dikte DITURUNKAN dari contoh
        // kalimat kartu kosakata — nol panggilan AI tambahan.
        itemTypes: ['vocab', 'listening'] as ItemType[],
        strand: 'kosakata',
      })),
    })
  }

  const conversation = JA_CONVERSATION.filter((c) => allowed.has(c.level))
  if (conversation.length) {
    tracks.push({
      key: 'kaiwa',
      mode: 'interleave',
      lessons: conversation.map((c) => ({
        title: c.title,
        topic: c.context,
        focus: c.focus,
        level: c.level,
        // Tidak ada `cloze` di sini, dan itu disengaja. Yang dilatih bukan
        // "bagian mana yang hilang", tapi mengeluarkan kalimat utuh — jadi
        // ungkapan, terjemahan, dikte, dan berbicara.
        itemTypes: ['phrase', 'sentence', 'listening', 'speaking'] as ItemType[],
        strand: 'percakapan',
      })),
    })
  }

  return tracks
}

// ---------------------------------------------------------------------------
// Korea
// ---------------------------------------------------------------------------

function koreanTracks(allowed: Set<string>, levels: string[]): LessonTrack[] {
  const tracks: LessonTrack[] = []
  const [beginner, second] = levels

  // Hangul di depan, sama seperti kana — tapi TIDAK seluruhnya. Empat pelajaran
  // aturan bunyi (비음화, 유음화, 경음화, 구개음화) ditaruh di level kedua:
  // sebelum punya kosakata, aturan itu cuma daftar rumus tanpa contoh yang
  // berarti apa-apa.
  const hangul = hangulLessons(beginner, second ?? beginner)
  const toLesson = (l: (typeof hangul)[number]) => ({
    title: l.title,
    topic: l.context,
    focus: l.focus,
    level: l.level,
    words: l.glyphs,
    wordListType: 'script' as ItemType,
    itemTypes: ['script'] as ItemType[],
    strand: 'aksara',
  })

  const early = hangul.filter((l) => l.level === beginner && allowed.has(l.level))
  const later = hangul.filter((l) => l.level !== beginner && allowed.has(l.level))
  if (early.length) tracks.push({ key: 'hangul', mode: 'prefix', lessons: early.map(toLesson) })
  if (later.length) {
    tracks.push({ key: 'hangul-rules', mode: 'interleave', lessons: later.map(toLesson) })
  }

  const vocab = pickThemes(KO_VOCAB_THEMES, [...allowed])
  if (vocab.length) {
    tracks.push({
      key: 'eohwi',
      mode: 'interleave',
      lessons: vocab.map((v) => ({
        title: `Kosakata: ${v.title}`,
        topic: v.context,
        focus: `Menguasai ${v.words.length} kata: ${v.words.join(', ')}`,
        level: v.level,
        words: v.words,
        wordListType: 'vocab' as ItemType,
        itemTypes: ['vocab', 'listening'] as ItemType[],
        strand: 'kosakata',
      })),
    })
  }

  const talk = KO_CONVERSATION.filter((c) => allowed.has(c.level))
  if (talk.length) {
    tracks.push({
      key: 'daehwa',
      mode: 'interleave',
      lessons: talk.map((c) => ({
        title: c.title,
        topic: c.context,
        focus: c.focus,
        level: c.level,
        itemTypes: ['phrase', 'sentence', 'listening', 'speaking'] as ItemType[],
        strand: 'percakapan',
      })),
    })
  }

  return tracks
}

// ---------------------------------------------------------------------------
// Mandarin
// ---------------------------------------------------------------------------

function chineseTracks(allowed: Set<string>, levels: string[]): LessonTrack[] {
  const tracks: LessonTrack[] = []
  const [beginner, second] = levels

  // Pinyin di depan, dan seluruhnya — sama seperti kana, bukan seperti bunyi
  // bahasa Inggris. Alasannya: nada bukan penyempurnaan yang bisa ditunda.
  // Pelajar yang menunda nada sampai "nanti setelah punya kosakata" akan
  // menghafal seluruh kosakata itu dengan nada yang salah, dan memperbaikinya
  // jauh lebih mahal daripada mempelajarinya dari awal.
  //
  // Dua pelajaran terakhir (nada netral, 儿化) ditaruh di level kedua: keduanya
  // soal bagaimana nada BERUBAH saat kata bertemu kata, dan sebelum punya kata
  // itu cuma daftar aturan tanpa contoh.
  const pinyin = pinyinLessons(beginner, second ?? beginner)
  const toSound = (l: (typeof pinyin)[number]) => ({
    title: l.title,
    topic: l.context,
    focus: l.focus,
    level: l.level,
    words: l.glyphs,
    wordListType: 'sound' as ItemType,
    // `sound`, bukan `script`: pinyin ITU SENDIRI romanisasinya, jadi tidak ada
    // yang bisa diketik sebagai jawaban — lihat catatan di zh/pinyin.ts.
    itemTypes: ['sound'] as ItemType[],
    strand: 'aksara',
  })

  const early = pinyin.filter((l) => l.level === beginner && allowed.has(l.level))
  const later = pinyin.filter((l) => l.level !== beginner && allowed.has(l.level))
  if (early.length) tracks.push({ key: 'pinyin', mode: 'prefix', lessons: early.map(toSound) })
  if (later.length) {
    tracks.push({ key: 'pinyin-tone', mode: 'interleave', lessons: later.map(toSound) })
  }

  // Pelajaran pengantar (urutan goresan, 部首) hanya untuk yang memulai dari
  // nol — alasannya sama dengan kana: pelajar yang mulai dari HSK 4 sudah
  // menulis 一二三 bertahun-tahun.
  const hanzi = hanziLessons(
    levels.filter((l) => allowed.has(l)),
    allowed.has(beginner),
  )
  if (hanzi.length) {
    tracks.push({
      key: 'hanzi',
      mode: 'interleave',
      lessons: hanzi.map((h) => ({
        title: h.title,
        topic: h.context ?? `hanzi ${h.level}: ${h.hanzi.slice(0, 4).join('')} dst`,
        focus:
          h.focus ??
          `Menguasai ${h.hanzi.length} karakter berikut — bentuk, arti pokok, pinyin, 部首, ` +
            `jumlah goresan, dan dua kata contoh: ${h.hanzi.join(' ')}`,
        level: h.level,
        words: h.hanzi,
        wordListType: 'hanzi' as ItemType,
        itemTypes: ['hanzi'] as ItemType[],
        strand: 'kanji',
      })),
    })
  }

  const vocab = pickThemes(ZH_VOCAB_THEMES, [...allowed])
  if (vocab.length) {
    tracks.push({
      key: 'cihui',
      mode: 'interleave',
      lessons: vocab.map((v) => ({
        title: `Kosakata: ${v.title}`,
        topic: v.context,
        focus: `Menguasai ${v.words.length} kata: ${v.words.join('、')}`,
        level: v.level,
        words: v.words,
        wordListType: 'vocab' as ItemType,
        itemTypes: ['vocab', 'listening'] as ItemType[],
        strand: 'kosakata',
      })),
    })
  }

  const talk = ZH_CONVERSATION.filter((c) => allowed.has(c.level))
  if (talk.length) {
    tracks.push({
      key: 'huihua',
      mode: 'interleave',
      lessons: talk.map((c) => ({
        title: c.title,
        topic: c.context,
        focus: c.focus,
        level: c.level,
        itemTypes: ['phrase', 'sentence', 'listening', 'speaking'] as ItemType[],
        strand: 'percakapan',
      })),
    })
  }

  return tracks
}

// ---------------------------------------------------------------------------
// Spanyol
// ---------------------------------------------------------------------------

function spanishTracks(allowed: Set<string>, levels: string[]): LessonTrack[] {
  const tracks: LessonTrack[] = []
  const beginner = levels[0] // 'A1'

  // Bunyi & ejaan = bagian "aksara" untuk bahasa Spanyol, dan bentuknya sama
  // dengan bahasa Inggris: level pemula di depan, sisanya menyusul di levelnya.
  //
  // Bagiannya jauh lebih KECIL daripada bahasa Inggris (8 pelajaran, bukan 12),
  // dan itu memang seharusnya: ejaan Spanyol nyaris fonemis, jadi yang tersisa
  // cuma huruf yang menipu, r vs rr, dan aturan tekanan. Menggelembungkannya
  // supaya "setara" cuma akan menghabiskan panggilan AI untuk hal yang sudah
  // jelas sejak hari pertama.
  const sounds = ES_SOUNDS.filter((l) => allowed.has(l.level))
  const early = sounds.filter((l) => l.level === beginner)
  const later = sounds.filter((l) => l.level !== beginner)

  const toSound = (l: (typeof ES_SOUNDS)[number]) => ({
    title: l.title,
    topic: l.context,
    focus: l.focus,
    level: l.level,
    words: l.words,
    wordListType: 'sound' as ItemType,
    // `sound`, bukan `script`: yang dilatih bunyi dan tekanannya, dan aksara
    // Latin tidak punya romanisasi yang bisa diketik sebagai jawaban.
    itemTypes: ['sound'] as ItemType[],
    strand: 'aksara',
  })

  if (early.length) tracks.push({ key: 'sonidos', mode: 'prefix', lessons: early.map(toSound) })
  if (later.length) {
    tracks.push({ key: 'sonidos-mas', mode: 'interleave', lessons: later.map(toSound) })
  }

  const vocab = pickThemes(ES_VOCAB_THEMES, [...allowed])
  if (vocab.length) {
    tracks.push({
      key: 'vocabulario',
      mode: 'interleave',
      lessons: vocab.map((v) => ({
        title: `Kosakata: ${v.title}`,
        topic: v.context,
        focus: `Menguasai ${v.words.length} kata: ${v.words.join(', ')}`,
        level: v.level,
        words: v.words,
        wordListType: 'vocab' as ItemType,
        itemTypes: ['vocab', 'listening'] as ItemType[],
        strand: 'kosakata',
      })),
    })
  }

  const talk = ES_CONVERSATION.filter((c) => allowed.has(c.level))
  if (talk.length) {
    tracks.push({
      key: 'conversacion',
      mode: 'interleave',
      lessons: talk.map((c) => ({
        title: c.title,
        topic: c.context,
        focus: c.focus,
        level: c.level,
        itemTypes: ['phrase', 'sentence', 'listening', 'speaking'] as ItemType[],
        strand: 'percakapan',
      })),
    })
  }

  return tracks
}

// ---------------------------------------------------------------------------

const TRACKS: Record<string, (allowed: Set<string>, levels: string[]) => LessonTrack[]> = {
  en: englishTracks,
  ja: japaneseTracks,
  ko: koreanTracks,
  zh: chineseTracks,
  es: spanishTracks,
}

export function extraTracks(
  languageCode: string,
  allowedLevels: string[],
  levels: string[],
): LessonTrack[] {
  return TRACKS[languageCode]?.(new Set(allowedLevels), levels) ?? []
}

/**
 * Jenis latihan untuk satu pelajaran GRAMMAR.
 *
 * `undefined` = pakai semua jenis yang berlaku untuk bahasa itu — dipakai
 * bahasa yang silabusnya dibuat AI dan tidak punya pembagian bagian materi.
 *
 * Bahasa berkurikulum tetap perlu daftar yang lebih sempit karena dua alasan:
 * kartu kosakata, kanji, dan bunyi sudah punya pelajarannya sendiri (tidak
 * perlu diulang di tiap pelajaran grammar), dan soal bacaan 110–150 kata di
 * level pemula hanya menghasilkan teks yang mustahil dikerjakan orang yang
 * baru belajar dua bulan.
 */
export function grammarItemTypes(
  languageCode: string,
  level: string,
  levels: string[],
): ItemType[] | undefined {
  if (!TRACKS[languageCode]) return undefined

  // `listening` dan `speaking` diturunkan dari kalimat & ungkapan, bukan
  // digenerate — menyebutnya di sini gratis dan membuat langkah turunan jalan.
  const base: ItemType[] = ['cloze', 'phrase', 'sentence', 'writing', 'listening', 'speaking']
  const index = levels.indexOf(level)
  // Bacaan mulai dari level ketiga (B1 / N3) ke atas.
  return index >= 2 ? [...base, 'reading'] : base
}
