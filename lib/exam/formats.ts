/**
 * FORMAT UJIAN
 *
 * Satu tempat untuk semua cetak biru simulasi. Sebelum ada file ini, seluruh
 * modul ujian mengasumsikan TOEFL ITP: tiga seksi dengan nama itu, 140 soal,
 * dan skala 310–677. Begitu bahasa kedua masuk, asumsi itu tidak lagi benar.
 *
 * Nambah format ujian baru = nambah satu entri di `EXAM_FORMATS`, ditambah
 * generator soalnya di `lib/ai/exam.ts`. Tidak ada `if (kind === ...)` yang
 * tersebar di halaman.
 *
 * Semua jumlah soal ditulis sebagai DATA supaya bisa dihitung, bukan dipercaya.
 */

export type ExamSize = 'full' | 'short'
export type ExamSection = 1 | 2 | 3

export type BlockType =
  // --- TOEFL ITP ---
  | 'listening_short'
  | 'listening_long'
  | 'listening_talk'
  | 'structure'
  | 'written_expression'
  | 'reading'
  // --- JLPT: 文字・語彙 ---
  | 'kanji_reading'
  | 'orthography'
  | 'word_formation'
  | 'contextual'
  | 'paraphrase'
  | 'usage'
  // --- JLPT: 文法 ---
  | 'grammar_form'
  | 'sentence_composition'
  | 'text_grammar'
  // --- JLPT: 読解 ---
  | 'reading_short'
  | 'reading_mid'
  | 'reading_long'
  | 'info_search'
  // --- JLPT: 聴解 ---
  | 'listening_task'
  | 'listening_point'
  | 'listening_summary'
  | 'listening_utterance'
  | 'listening_quick'
  // --- TOPIK: 듣기 ---
  | 'ko_listen_reply'
  | 'ko_listen_dialog'
  | 'ko_listen_talk'
  // --- TOPIK: 읽기 ---
  | 'ko_read_topic'
  | 'ko_read_blank'
  | 'ko_read_notice'
  | 'ko_read_passage'
  | 'ko_read_order'
  | 'ko_read_insert'
  // --- TOPIK: 쓰기 (karangan, bukan pilihan ganda) ---
  | 'ko_write_blank'
  | 'ko_write_short'
  | 'ko_write_essay'
  // --- HSK: 听力 ---
  | 'zh_listen_judge'
  | 'zh_listen_reply'
  | 'zh_listen_dialog'
  | 'zh_listen_talk'
  // --- HSK: 阅读 ---
  | 'zh_read_match'
  | 'zh_read_blank'
  | 'zh_read_notice'
  | 'zh_read_order'
  | 'zh_read_error'
  | 'zh_read_insert'
  | 'zh_read_passage'
  // --- HSK: 书写 (karangan, bukan pilihan ganda) ---
  | 'zh_write_sentence'
  | 'zh_write_hanzi'
  | 'zh_write_essay'
  | 'zh_write_summary'
  // --- DELE: comprensión de lectura ---
  | 'es_read_match'
  | 'es_read_blank'
  | 'es_read_notice'
  | 'es_read_passage'
  // --- DELE: comprensión auditiva ---
  | 'es_listen_notice'
  | 'es_listen_short'
  | 'es_listen_talk'
  // --- DELE: expresión escrita (karangan, bukan pilihan ganda) ---
  | 'es_write_form'
  | 'es_write_letter'
  | 'es_write_essay'

export type BlueprintBlock = {
  section: ExamSection
  part: string
  type: BlockType
  /** jumlah kelompok (bacaan / rekaman panjang). 0 = soal berdiri sendiri */
  groups: number
  /** soal per kelompok, atau total soal kalau `groups` = 0 */
  perGroup: number
  label: string
  /**
   * Bobot tiap soal di blok ini. Kosong = 1 poin.
   *
   * Hampir semua ujian memberi bobot sama untuk tiap soal, jadi menghitung
   * "jumlah benar" sudah cukup. TOPIK 쓰기 tidak: 51–52 bernilai 10 poin,
   * 53 bernilai 30, dan 54 bernilai 50 — mengarang esai 700 kata tidak sepadan
   * dengan mengisi satu kalimat rumpang.
   */
  points?: number
  /**
   * Soal karangan: dijawab dengan teks bebas dan dinilai AI, bukan dipilih.
   * Halaman ujian memakai penanda ini untuk menampilkan kotak tulis.
   */
  writing?: boolean
}

/** Skor TOEFL: tiap seksi punya kurva sendiri, lalu (jumlah × 10) ÷ 3. */
export type ToeflScoring = {
  type: 'toefl'
  curve: Record<ExamSection, [number, number][]>
  range: [number, number]
}

/**
 * Skor JLPT: 得点区分 (bagian penilaian).
 *
 * N1–N3 dinilai dalam tiga bagian 0–60. N4 dan N5 hanya dua: 言語知識・読解
 * digabung jadi 0–120, dan 聴解 0–60. Itu sebabnya bagian penilaian ditulis
 * sebagai daftar, bukan diasumsikan sama dengan seksi.
 */
export type JlptScoring = {
  type: 'jlpt'
  bands: { sections: ExamSection[]; label: string; max: number; passMin: number }[]
  /** nilai total minimum untuk lulus */
  pass: number
  range: [number, number]
}

/**
 * Skor TOPIK.
 *
 * Berbeda dari JLPT: tidak ada nilai minimum per bagian, dan yang ditentukan
 * bukan lulus/tidak melainkan TINGKAT yang diperoleh. Satu lembar soal yang
 * sama memberi 1급 atau 2급 (TOPIK I), atau 3급 sampai 6급 (TOPIK II),
 * tergantung total nilainya. Di bawah ambang terendah: tidak dapat tingkat.
 */
export type TopikScoring = {
  type: 'topik'
  bands: { sections: ExamSection[]; label: string; max: number }[]
  /** ambang tiap tingkat, urut dari yang tertinggi */
  grades: { level: string; min: number }[]
  range: [number, number]
}

/**
 * Skor HSK.
 *
 * Bentuknya di antara JLPT dan TOPIK, dan itu yang membuatnya butuh tipe
 * sendiri: seperti JLPT ada ambang LULUS (bukan tingkat seperti TOPIK), tapi
 * TIDAK ada nilai minimum per bagian — cukup totalnya. Peserta HSK 4 yang
 * mendapat 0 di 书写 tetap lulus kalau 听力 dan 阅读-nya cukup tinggi, dan
 * memaksakan tipe JLPT ke sini berarti memasang batas minimum per bagian yang
 * tidak pernah ada di aturannya.
 *
 * Angka ambangnya resmi: 60% dari nilai penuh — 120 dari 200 (HSK 1–2, dua
 * bagian) dan 180 dari 300 (HSK 3–6, tiga bagian).
 */
export type HskScoring = {
  type: 'hsk'
  bands: { sections: ExamSection[]; label: string; max: number }[]
  /** nilai total minimum untuk lulus */
  pass: number
  range: [number, number]
}

/**
 * Skor DELE.
 *
 * Bentuknya IDENTIK dengan JLPT, dan itu bukan kebetulan yang dimanfaatkan
 * asal-asalan: aturannya memang sama persis. Ada ambang lulus untuk totalnya,
 * DAN nilai minimum per bagian penilaian, dan gagal satu bagian membuat seluruh
 * ujian tidak lulus sekalipun totalnya jauh di atas batas. Di DELE syaratnya
 * 30 dari 50 di TIAP grupo; di JLPT 19 dari 60 di tiap 得点区分.
 *
 * Karena itu tipenya diturunkan dari `JlptScoring`, bukan ditulis ulang — kalau
 * ditulis ulang, dua tempat harus diubah bersamaan setiap kali penilaian
 * berbasis-bagian disentuh. Yang berbeda cuma penandanya, dan penanda itu ada
 * karena keterangan di layar berbeda: pembaca perlu tahu ini bukan 尺度得点.
 */
export type DeleScoring = Omit<JlptScoring, 'type'> & { type: 'dele' }

export type ExamFormat = {
  id: string
  /** nama panjang, dipakai di judul halaman */
  label: string
  /** nama pendek untuk daftar & badge */
  short: string
  languageCode: string
  /** level JLPT-nya, kalau ada — dipakai sebagai konteks prompt soal */
  level?: string
  /** satu kalimat: format ini mengukur apa */
  note: string
  sections: Record<ExamSection, string>
  minutes: Record<ExamSection, number>
  /**
   * Seksi yang berisi soal menyimak.
   *
   * Berbeda tiap format — TOEFL menaruhnya di seksi 1, JLPT di seksi 3 — dan
   * halaman ujian perlu tahu untuk memutuskan mana yang ditampilkan sebagai
   * teks bacaan dan mana yang hanya boleh diperdengarkan.
   */
  listeningSection: ExamSection
  blocks: Record<ExamSize, BlueprintBlock[]>
  scoring: ToeflScoring | JlptScoring | TopikScoring | HskScoring | DeleScoring
  /**
   * Keterangan kotak jawaban karangan — hanya untuk format yang punya soal
   * `writing`.
   *
   * Ditaruh di sini sebagai DATA, bukan di komponen, karena halaman ujian
   * dipakai semua format: sebelum ini kotak karangannya memuat placeholder
   * berbahasa Korea dan menyebut rubrik TOPIK, apa pun ujian yang sedang
   * dikerjakan. Satu bahasa kedua dengan soal karangan langsung membuat
   * teks itu salah.
   */
  writing?: {
    /** contoh isi kotak, ditulis dalam bahasa target */
    placeholder: string
    /** satuan panjang yang dihitung, mis. '자' atau '字' */
    unit: string
    /** satu kalimat: nilainya diberikan dengan rubrik apa */
    rubric: string
  }
}

/**
 * Versi pendek: sepertiga soal, proporsi antarbagian tetap.
 *
 * Tiap jenis soal disisakan minimal satu. Menghapus jenis tertentu akan
 * mengubah latihan cepat jadi ujian yang berbeda — dan justru jenis yang jarang
 * (用法, 文の組み立て, 쓰기 54번) yang paling sering bikin orang kehilangan nilai.
 *
 * Soal karangan TIDAK dilipat: 쓰기 cuma empat soal dan tiap satunya bernilai
 * 10–50 poin. Memotongnya jadi "sepertiga" berarti membuang seluruh bagian.
 */
function shrink(blocks: BlueprintBlock[]): BlueprintBlock[] {
  return blocks.map((b) => {
    if (b.writing) return b
    return b.groups === 0
      ? { ...b, perGroup: Math.max(2, Math.round(b.perGroup / 3)) }
      : { ...b, groups: Math.max(1, Math.round(b.groups / 3)) }
  })
}

// ===========================================================================
// TOEFL ITP
// ===========================================================================

/**
 * Struktur asli TOEFL ITP (paper-based), 140 soal, ±115 menit:
 *
 *   Seksi 1 — Listening Comprehension          50 soal, ±35 menit
 *   Seksi 2 — Structure & Written Expression   40 soal, 25 menit
 *   Seksi 3 — Reading Comprehension            50 soal, 55 menit
 */
const TOEFL_FULL: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'listening_short', groups: 0, perGroup: 30, label: 'Percakapan pendek' },
  { section: 1, part: 'B', type: 'listening_long', groups: 2, perGroup: 4, label: 'Percakapan panjang' },
  { section: 1, part: 'C', type: 'listening_talk', groups: 3, perGroup: 4, label: 'Ceramah singkat' },
  { section: 2, part: 'A', type: 'structure', groups: 0, perGroup: 15, label: 'Melengkapi kalimat' },
  { section: 2, part: 'B', type: 'written_expression', groups: 0, perGroup: 25, label: 'Menemukan kesalahan' },
  { section: 3, part: 'A', type: 'reading', groups: 5, perGroup: 10, label: 'Bacaan' },
]

const TOEFL_SHORT: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'listening_short', groups: 0, perGroup: 10, label: 'Percakapan pendek' },
  { section: 1, part: 'C', type: 'listening_talk', groups: 1, perGroup: 4, label: 'Ceramah singkat' },
  { section: 2, part: 'A', type: 'structure', groups: 0, perGroup: 6, label: 'Melengkapi kalimat' },
  { section: 2, part: 'B', type: 'written_expression', groups: 0, perGroup: 8, label: 'Menemukan kesalahan' },
  { section: 3, part: 'A', type: 'reading', groups: 1, perGroup: 10, label: 'Bacaan' },
]

const TOEFL_ITP: ExamFormat = {
  id: 'toefl_itp',
  label: 'TOEFL ITP',
  short: 'TOEFL ITP',
  languageCode: 'en',
  note: 'Tes bahasa Inggris akademik, skala 310–677.',
  sections: {
    1: 'Listening Comprehension',
    2: 'Structure & Written Expression',
    3: 'Reading Comprehension',
  },
  minutes: { 1: 35, 2: 25, 3: 55 },
  listeningSection: 1,
  blocks: { full: TOEFL_FULL, short: TOEFL_SHORT },
  scoring: {
    type: 'toefl',
    /**
     * Titik acuan: [proporsi benar, skor skala] per seksi.
     *
     * Rentang resmi TOEFL ITP Level 1: tiap seksi 31–68 (seksi 3 maksimum 67),
     * total 310–677. Batas BAWAHNYA 31, bukan 0. Titik di antaranya interpolasi
     * dari angka yang umum diketahui — ETS tidak menerbitkan tabelnya lengkap.
     */
    curve: {
      1: [[0, 31], [0.2, 38], [0.4, 45], [0.6, 51], [0.8, 57], [0.94, 63], [1, 68]],
      2: [[0, 31], [0.2, 40], [0.4, 47], [0.6, 53], [0.8, 58], [0.95, 64], [1, 68]],
      3: [[0, 31], [0.2, 38], [0.4, 44], [0.6, 50], [0.8, 56], [0.94, 62], [1, 67]],
    },
    range: [310, 677],
  },
}

// ===========================================================================
// JLPT
// ===========================================================================

/**
 * Susunan 問題 tiap level.
 *
 * Jumlah soal JLPT resmi BERVARIASI sedikit tiap sesi — situs resminya sendiri
 * menulis "jumlah soal bisa berubah". Angka di sini adalah susunan yang paling
 * lazim pada beberapa sesi terakhir, jadi latihannya terasa sepadan.
 *
 * Yang TIDAK diikutsertakan dan alasannya:
 *   統合理解 (menggabungkan dua sumber) — dilebur ke 長文, karena bentuk soalnya
 *   butuh dua teks yang saling menanggapi dan kualitas buatan AI-nya tidak
 *   cukup bisa dipercaya untuk dijadikan alat ukur.
 */
type JlptSpec = {
  level: string
  minutes: [number, number, number]
  /** 言語知識: [jenis, jumlah] */
  chars: Partial<Record<BlockType, number>>
  grammar: Partial<Record<BlockType, number>>
  /** 読解 & 聴解 berkelompok: [jenis, jumlah kelompok, soal per kelompok] */
  reading: [BlockType, number, number][]
  listening: Partial<Record<BlockType, number>>
}

/**
 * Nama bagian untuk tiap jenis soal.
 *
 * Satu tabel untuk SEMUA format, bukan satu per format: `Record<BlockType, …>`
 * memaksa setiap jenis soal punya nama, jadi jenis baru yang lupa diberi label
 * gagal saat typecheck, bukan muncul sebagai bagian tanpa nama di halaman ujian.
 *
 * Dipakai oleh cetak biru yang dirakit dari spesifikasi (JLPT dan HSK); format
 * yang bloknya ditulis satu per satu (TOEFL, TOPIK) menulis labelnya di tempat.
 */
const BLOCK_LABELS: Record<BlockType, string> = {
  kanji_reading: 'Bacaan kanji (漢字読み)',
  orthography: 'Penulisan (表記)',
  word_formation: 'Bentukan kata (語形成)',
  contextual: 'Kata yang tepat (文脈規定)',
  paraphrase: 'Padanan makna (言い換え類義)',
  usage: 'Pemakaian kata (用法)',
  grammar_form: 'Bentuk tata bahasa (文法形式)',
  sentence_composition: 'Menyusun kalimat (文の組み立て)',
  text_grammar: 'Tata bahasa teks (文章の文法)',
  reading_short: 'Bacaan pendek (短文)',
  reading_mid: 'Bacaan sedang (中文)',
  reading_long: 'Bacaan panjang (長文)',
  info_search: 'Mencari informasi (情報検索)',
  listening_task: 'Memahami tugas (課題理解)',
  listening_point: 'Memahami inti (ポイント理解)',
  listening_summary: 'Memahami garis besar (概要理解)',
  listening_utterance: 'Ungkapan yang tepat (発話表現)',
  listening_quick: 'Respons cepat (即時応答)',
  // TOEFL & TOPIK — tidak dipakai di JLPT, tapi Record harus utuh
  ko_listen_reply: 'Jawaban yang tepat',
  ko_listen_dialog: 'Isi percakapan',
  ko_listen_talk: 'Pembicaraan pendek',
  ko_read_topic: 'Topik bacaan',
  ko_read_blank: 'Isian rumpang',
  ko_read_notice: 'Pengumuman & iklan',
  ko_read_passage: 'Bacaan',
  ko_read_order: 'Urutan kalimat',
  ko_read_insert: 'Menyisipkan kalimat',
  ko_write_blank: 'Melengkapi kalimat',
  ko_write_short: 'Karangan data',
  ko_write_essay: 'Esai',
  zh_listen_judge: 'Benar atau salah (判断对错)',
  zh_listen_reply: 'Jawaban yang tepat (选择答语)',
  zh_listen_dialog: 'Isi percakapan (对话理解)',
  zh_listen_talk: 'Pembicaraan & wawancara (短文)',
  zh_read_match: 'Memasangkan kalimat (句子配对)',
  zh_read_blank: 'Isian rumpang (选词填空)',
  zh_read_notice: 'Pengumuman & berita (短文信息)',
  zh_read_order: 'Urutan kalimat (排列顺序)',
  zh_read_error: 'Kalimat yang salah (病句)',
  zh_read_insert: 'Menyisipkan kalimat (选句填空)',
  zh_read_passage: 'Bacaan (阅读理解)',
  zh_write_sentence: 'Menyusun kalimat (完成句子)',
  zh_write_hanzi: 'Menulis karakter (写汉字)',
  zh_write_essay: 'Karangan pendek (写作文)',
  zh_write_summary: 'Ringkasan (缩写)',
  es_read_match: 'Memasangkan teks (relacionar)',
  es_read_blank: 'Isian rumpang (uso de la lengua)',
  es_read_notice: 'Pengumuman & iklan (anuncios)',
  es_read_passage: 'Bacaan (comprensión de lectura)',
  es_listen_notice: 'Pesan & pengumuman (mensajes)',
  es_listen_short: 'Percakapan pendek (diálogos)',
  es_listen_talk: 'Wawancara & berita (audios largos)',
  es_write_form: 'Mengisi formulir & catatan (nota)',
  es_write_letter: 'Surat & email (carta)',
  es_write_essay: 'Karangan (redacción)',
  listening_short: 'Percakapan pendek',
  listening_long: 'Percakapan panjang',
  listening_talk: 'Ceramah singkat',
  structure: 'Melengkapi kalimat',
  written_expression: 'Menemukan kesalahan',
  reading: 'Bacaan',
}

const SPECS: JlptSpec[] = [
  {
    level: 'N5',
    minutes: [35, 25, 30],
    chars: { kanji_reading: 7, orthography: 5, contextual: 6, paraphrase: 3 },
    grammar: { grammar_form: 9, sentence_composition: 4, text_grammar: 4 },
    reading: [
      ['reading_short', 3, 1],
      ['reading_mid', 1, 2],
      ['info_search', 1, 1],
    ],
    listening: { listening_task: 7, listening_point: 6, listening_utterance: 5, listening_quick: 6 },
  },
  {
    level: 'N4',
    minutes: [45, 35, 35],
    chars: { kanji_reading: 7, orthography: 5, contextual: 8, paraphrase: 4, usage: 4 },
    grammar: { grammar_form: 13, sentence_composition: 4, text_grammar: 4 },
    reading: [
      ['reading_short', 4, 1],
      ['reading_mid', 2, 2],
      ['info_search', 1, 2],
    ],
    listening: { listening_task: 8, listening_point: 7, listening_utterance: 5, listening_quick: 8 },
  },
  {
    level: 'N3',
    minutes: [55, 45, 40],
    chars: { kanji_reading: 8, orthography: 6, contextual: 11, paraphrase: 5, usage: 5 },
    grammar: { grammar_form: 13, sentence_composition: 5, text_grammar: 5 },
    reading: [
      ['reading_short', 4, 1],
      ['reading_mid', 2, 3],
      ['reading_long', 1, 4],
      ['info_search', 1, 2],
    ],
    listening: {
      listening_task: 6,
      listening_point: 6,
      listening_summary: 3,
      listening_utterance: 4,
      listening_quick: 9,
    },
  },
  {
    level: 'N2',
    minutes: [55, 50, 50],
    chars: {
      kanji_reading: 5,
      orthography: 5,
      word_formation: 5,
      contextual: 7,
      paraphrase: 5,
      usage: 5,
    },
    grammar: { grammar_form: 12, sentence_composition: 5, text_grammar: 5 },
    reading: [
      ['reading_short', 5, 1],
      ['reading_mid', 3, 3],
      ['reading_long', 1, 4],
      ['info_search', 1, 2],
    ],
    listening: {
      listening_task: 5,
      listening_point: 6,
      listening_summary: 5,
      listening_quick: 11,
    },
  },
  {
    level: 'N1',
    minutes: [55, 55, 55],
    chars: { kanji_reading: 6, contextual: 7, paraphrase: 6, usage: 6 },
    grammar: { grammar_form: 10, sentence_composition: 5, text_grammar: 5 },
    reading: [
      ['reading_short', 4, 1],
      ['reading_mid', 3, 3],
      ['reading_long', 2, 4],
      ['info_search', 1, 2],
    ],
    listening: {
      listening_task: 6,
      listening_point: 7,
      listening_summary: 6,
      listening_quick: 13,
    },
  },
]

const PART_LETTERS = 'ABCDEFGHIJKLMN'

function jlptBlocks(spec: JlptSpec): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  let part = 0
  const next = () => PART_LETTERS[part++] ?? 'Z'

  for (const [type, count] of Object.entries(spec.chars) as [BlockType, number][]) {
    blocks.push({ section: 1, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }
  for (const [type, count] of Object.entries(spec.grammar) as [BlockType, number][]) {
    // 文章の文法 memakai satu teks utuh berisi beberapa lubang — itu kelompok,
    // bukan soal berdiri sendiri.
    if (type === 'text_grammar') {
      blocks.push({ section: 1, part: next(), type, groups: 1, perGroup: count, label: BLOCK_LABELS[type] })
    } else {
      blocks.push({ section: 1, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
    }
  }

  part = 0
  for (const [type, groups, perGroup] of spec.reading) {
    blocks.push({ section: 2, part: next(), type, groups, perGroup, label: BLOCK_LABELS[type] })
  }

  part = 0
  for (const [type, count] of Object.entries(spec.listening) as [BlockType, number][]) {
    blocks.push({ section: 3, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }

  return blocks
}

/**
 * Nilai lulus resmi JLPT: total minimum + minimum tiap bagian penilaian.
 * Gagal salah satu minimum bagian = tidak lulus, sekalipun totalnya cukup.
 */
const PASS: Record<string, number> = { N5: 80, N4: 90, N3: 95, N2: 90, N1: 100 }

function jlptFormat(spec: JlptSpec): ExamFormat {
  const merged = spec.level === 'N5' || spec.level === 'N4'

  return {
    id: `jlpt_${spec.level.toLowerCase()}`,
    label: `JLPT ${spec.level}`,
    short: `JLPT ${spec.level}`,
    languageCode: 'ja',
    level: spec.level,
    note:
      spec.level === 'N5'
        ? 'Bisa memahami bahasa Jepang dasar: kalimat sederhana, hiragana, katakana, dan kanji dasar.'
        : spec.level === 'N4'
          ? 'Bisa memahami bahasa Jepang sehari-hari yang ditulis dengan kosakata dan kanji dasar.'
          : spec.level === 'N3'
            ? 'Bisa memahami bahasa Jepang sehari-hari sampai tingkat tertentu, termasuk berita ringan.'
            : spec.level === 'N2'
              ? 'Bisa memahami bahasa Jepang sehari-hari dan tulisan yang cakupannya lebih luas.'
              : 'Bisa memahami bahasa Jepang dalam berbagai keadaan, termasuk tulisan abstrak.',
    sections: {
      1: '言語知識 (文字・語彙・文法)',
      2: '読解',
      3: '聴解',
    },
    minutes: { 1: spec.minutes[0], 2: spec.minutes[1], 3: spec.minutes[2] },
    listeningSection: 3,
    blocks: { full: jlptBlocks(spec), short: shrink(jlptBlocks(spec)) },
    scoring: {
      type: 'jlpt',
      bands: merged
        ? [
            { sections: [1, 2], label: '言語知識・読解', max: 120, passMin: 38 },
            { sections: [3], label: '聴解', max: 60, passMin: 19 },
          ]
        : [
            { sections: [1], label: '言語知識', max: 60, passMin: 19 },
            { sections: [2], label: '読解', max: 60, passMin: 19 },
            { sections: [3], label: '聴解', max: 60, passMin: 19 },
          ],
      pass: PASS[spec.level],
      range: [0, 180],
    },
  }
}

// ===========================================================================
// TOPIK
// ===========================================================================

/**
 * Struktur resmi TOPIK.
 *
 *   TOPIK I  (초급)  듣기 30 soal / 40 menit · 읽기 40 soal / 60 menit
 *                    Nilai 0–200. 1급 mulai 80, 2급 mulai 140. Tidak ada 쓰기.
 *
 *   TOPIK II (중고급) 듣기 50 / 60 menit · 쓰기 4 / 50 menit · 읽기 50 / 70 menit
 *                    Nilai 0–300. 3급 120, 4급 150, 5급 190, 6급 230.
 *
 * Ujiannya memang cuma dua — yang enam itu TINGKAT hasilnya, bukan nama ujian.
 * Itu sebabnya `grades` berisi ambang, bukan satu angka lulus seperti JLPT.
 */
const TOPIK_I_FULL: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'ko_listen_reply', groups: 0, perGroup: 8, label: 'Jawaban yang tepat (알맞은 대답)' },
  { section: 1, part: 'B', type: 'ko_listen_dialog', groups: 0, perGroup: 14, label: 'Isi percakapan (대화 이해)' },
  { section: 1, part: 'C', type: 'ko_listen_talk', groups: 4, perGroup: 2, label: 'Pembicaraan pendek (담화)' },
  { section: 2, part: 'A', type: 'ko_read_topic', groups: 0, perGroup: 8, label: 'Topik bacaan (화제 고르기)' },
  { section: 2, part: 'B', type: 'ko_read_blank', groups: 0, perGroup: 10, label: 'Isian rumpang (빈칸 채우기)' },
  { section: 2, part: 'C', type: 'ko_read_notice', groups: 0, perGroup: 8, label: 'Pengumuman & iklan (안내문)' },
  { section: 2, part: 'D', type: 'ko_read_order', groups: 0, perGroup: 4, label: 'Urutan kalimat (순서 배열)' },
  { section: 2, part: 'E', type: 'ko_read_passage', groups: 5, perGroup: 2, label: 'Bacaan (지문 이해)' },
]

const TOPIK_II_FULL: BlueprintBlock[] = [
  { section: 1, part: 'A', type: 'ko_listen_dialog', groups: 0, perGroup: 20, label: 'Percakapan (대화 이해)' },
  { section: 1, part: 'B', type: 'ko_listen_talk', groups: 10, perGroup: 2, label: 'Pembicaraan & wawancara (담화)' },
  { section: 1, part: 'C', type: 'ko_listen_talk', groups: 5, perGroup: 2, label: 'Ceramah (강연)' },
  // 쓰기 — empat soal, seratus poin, dan tidak satu pun berupa pilihan ganda.
  { section: 2, part: 'A', type: 'ko_write_blank', groups: 0, perGroup: 2, label: 'Melengkapi kalimat (51–52번)', points: 10, writing: true },
  { section: 2, part: 'B', type: 'ko_write_short', groups: 0, perGroup: 1, label: 'Karangan data 200–300자 (53번)', points: 30, writing: true },
  { section: 2, part: 'C', type: 'ko_write_essay', groups: 0, perGroup: 1, label: 'Esai 600–700자 (54번)', points: 50, writing: true },
  { section: 3, part: 'A', type: 'ko_read_blank', groups: 0, perGroup: 12, label: 'Isian rumpang (빈칸 채우기)' },
  { section: 3, part: 'B', type: 'ko_read_notice', groups: 0, perGroup: 10, label: 'Berita & pengumuman (신문 기사)' },
  { section: 3, part: 'C', type: 'ko_read_order', groups: 0, perGroup: 3, label: 'Urutan kalimat (순서 배열)' },
  { section: 3, part: 'D', type: 'ko_read_insert', groups: 0, perGroup: 5, label: 'Menyisipkan kalimat (문장 삽입)' },
  { section: 3, part: 'E', type: 'ko_read_passage', groups: 10, perGroup: 2, label: 'Bacaan panjang (지문 이해)' },
]

const TOPIK_I: ExamFormat = {
  id: 'topik_i',
  label: 'TOPIK I',
  short: 'TOPIK I',
  languageCode: 'ko',
  note: 'Ujian tingkat dasar. Hasilnya 1급 atau 2급 — tidak ada bagian menulis.',
  sections: { 1: '듣기 (Menyimak)', 2: '읽기 (Membaca)', 3: '—' },
  minutes: { 1: 40, 2: 60, 3: 0 },
  listeningSection: 1,
  blocks: { full: TOPIK_I_FULL, short: shrink(TOPIK_I_FULL) },
  scoring: {
    type: 'topik',
    bands: [
      { sections: [1], label: '듣기', max: 100 },
      { sections: [2], label: '읽기', max: 100 },
    ],
    grades: [
      { level: '2급', min: 140 },
      { level: '1급', min: 80 },
    ],
    range: [0, 200],
  },
}

const TOPIK_II: ExamFormat = {
  id: 'topik_ii',
  label: 'TOPIK II',
  short: 'TOPIK II',
  languageCode: 'ko',
  note: 'Ujian tingkat menengah–mahir. Hasilnya 3급 sampai 6급, termasuk 쓰기.',
  sections: { 1: '듣기 (Menyimak)', 2: '쓰기 (Menulis)', 3: '읽기 (Membaca)' },
  minutes: { 1: 60, 2: 50, 3: 70 },
  listeningSection: 1,
  blocks: { full: TOPIK_II_FULL, short: shrink(TOPIK_II_FULL) },
  writing: {
    placeholder: '한국어로 답을 쓰세요…',
    unit: '자',
    rubric: 'rubrik TOPIK (내용 · 전개 · 언어 사용)',
  },
  scoring: {
    type: 'topik',
    bands: [
      { sections: [1], label: '듣기', max: 100 },
      { sections: [2], label: '쓰기', max: 100 },
      { sections: [3], label: '읽기', max: 100 },
    ],
    grades: [
      { level: '6급', min: 230 },
      { level: '5급', min: 190 },
      { level: '4급', min: 150 },
      { level: '3급', min: 120 },
    ],
    range: [0, 300],
  },
}

// ===========================================================================
// HSK
// ===========================================================================

/**
 * Struktur resmi HSK (2.0), enam tingkat, satu lembar soal per tingkat:
 *
 *   HSK 1  听力 20 / 阅读 20                     — 200 poin, lulus 120
 *   HSK 2  听力 35 / 阅读 25                     — 200 poin, lulus 120
 *   HSK 3  听力 40 / 阅读 30 / 书写 10           — 300 poin, lulus 180
 *   HSK 4  听力 45 / 阅读 40 / 书写 15           — 300 poin, lulus 180
 *   HSK 5  听力 45 / 阅读 45 / 书写 10           — 300 poin, lulus 180
 *   HSK 6  听力 50 / 阅读 50 / 书写 1 (缩写)     — 300 poin, lulus 180
 *
 * Berbeda dari JLPT dan TOPIK: tiap tingkat punya lembar soalnya sendiri (jadi
 * enam format, seperti JLPT), tapi lulusnya ditentukan TOTAL saja tanpa minimum
 * per bagian — lihat `HskScoring`.
 *
 * SATU PENYESUAIAN yang harus dinyatakan terus terang: HSK 1–3 sungguhan punya
 * beberapa bagian yang soalnya berupa GAMBAR — 看图判断对错, memilih gambar yang
 * cocok dengan kalimat yang didengar. Bagian itu tidak bisa dibuat di sini,
 * bukan karena sulit tapi karena tidak ada gambarnya, dan menyulapnya jadi soal
 * teks yang mirip lebih jujur daripada menyodorkan soal yang mustahil dikerjakan.
 * Jadi bagian bergambar diganti padanan teks yang menguji hal yang sama:
 *
 *   看图判断对错  → 判断对错 dari kalimat yang didengar (tanpa gambar)
 *   图片匹配      → memasangkan kalimat dengan tanggapan/kalimat yang berkaitan
 *   看图写句子    → menulis kalimat dari kata yang diberikan
 *
 * Sisanya mengikuti bentuk aslinya, termasuk 病句 (HSK 6 阅读 第1部分) dan
 * 缩写 — dua bagian yang paling menentukan nilai dan paling sering dilewatkan
 * simulasi buatan.
 */
type HskSpec = {
  level: string
  minutes: [number, number, number]
  /** 听力 & 阅读: [jenis, jumlah] untuk soal berdiri sendiri */
  listening: Partial<Record<BlockType, number>>
  /** 听力 berkelompok: [jenis, jumlah kelompok, soal per kelompok] */
  listeningGroups?: [BlockType, number, number][]
  reading: Partial<Record<BlockType, number>>
  readingGroups?: [BlockType, number, number][]
  /** 书写: [jenis, jumlah soal, poin per soal] — poinnya berbeda tiap bagian */
  writing?: [BlockType, number, number][]
}

const HSK_SPECS: HskSpec[] = [
  {
    level: 'HSK1',
    minutes: [15, 17, 0],
    listening: { zh_listen_judge: 5, zh_listen_reply: 5, zh_listen_dialog: 10 },
    reading: { zh_read_match: 10, zh_read_blank: 10 },
  },
  {
    level: 'HSK2',
    minutes: [25, 22, 0],
    listening: { zh_listen_judge: 10, zh_listen_reply: 10, zh_listen_dialog: 15 },
    reading: { zh_read_match: 10, zh_read_blank: 10, zh_read_notice: 5 },
  },
  {
    level: 'HSK3',
    minutes: [35, 30, 15],
    listening: { zh_listen_reply: 10, zh_listen_dialog: 20 },
    listeningGroups: [['zh_listen_talk', 5, 2]],
    reading: { zh_read_match: 10, zh_read_blank: 10 },
    readingGroups: [['zh_read_passage', 5, 2]],
    writing: [
      ['zh_write_sentence', 5, 10],
      ['zh_write_hanzi', 5, 10],
    ],
  },
  {
    level: 'HSK4',
    minutes: [30, 40, 25],
    listening: { zh_listen_dialog: 25 },
    listeningGroups: [['zh_listen_talk', 5, 4]],
    reading: { zh_read_blank: 10, zh_read_order: 10 },
    readingGroups: [['zh_read_passage', 10, 2]],
    writing: [
      ['zh_write_sentence', 10, 6],
      ['zh_write_essay', 5, 8],
    ],
  },
  {
    level: 'HSK5',
    minutes: [30, 40, 40],
    listening: { zh_listen_dialog: 20 },
    listeningGroups: [['zh_listen_talk', 5, 5]],
    reading: { zh_read_blank: 15, zh_read_notice: 10 },
    readingGroups: [['zh_read_passage', 10, 2]],
    writing: [
      ['zh_write_sentence', 8, 5],
      ['zh_write_essay', 2, 30],
    ],
  },
  {
    level: 'HSK6',
    minutes: [35, 50, 45],
    listening: { zh_listen_dialog: 15 },
    listeningGroups: [['zh_listen_talk', 7, 5]],
    reading: { zh_read_error: 10, zh_read_blank: 10, zh_read_insert: 10 },
    readingGroups: [['zh_read_passage', 10, 2]],
    // Satu soal, seratus poin, dan 45 menit: baca teks ±1.000 karakter lalu
    // ringkas jadi ±400 karakter. Tidak ada bagian lain di 书写 HSK 6.
    writing: [['zh_write_summary', 1, 100]],
  },
]

function hskBlocks(spec: HskSpec): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  let part = 0
  const next = () => PART_LETTERS[part++] ?? 'Z'

  for (const [type, count] of Object.entries(spec.listening) as [BlockType, number][]) {
    blocks.push({ section: 1, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }
  for (const [type, groups, perGroup] of spec.listeningGroups ?? []) {
    blocks.push({ section: 1, part: next(), type, groups, perGroup, label: BLOCK_LABELS[type] })
  }

  part = 0
  for (const [type, count] of Object.entries(spec.reading) as [BlockType, number][]) {
    blocks.push({ section: 2, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }
  for (const [type, groups, perGroup] of spec.readingGroups ?? []) {
    blocks.push({ section: 2, part: next(), type, groups, perGroup, label: BLOCK_LABELS[type] })
  }

  part = 0
  for (const [type, count, points] of spec.writing ?? []) {
    blocks.push({
      section: 3,
      part: next(),
      type,
      groups: 0,
      perGroup: count,
      label: BLOCK_LABELS[type],
      points,
      writing: true,
    })
  }

  return blocks
}

/** Keterangan tiap tingkat — diambil dari deskripsi resmi Hanban per level. */
const HSK_NOTES: Record<string, string> = {
  HSK1: 'Bisa memahami dan memakai kata serta kalimat Mandarin yang paling sederhana (150 kata).',
  HSK2: 'Bisa berkomunikasi sederhana tentang hal sehari-hari yang akrab (300 kata).',
  HSK3: 'Bisa mengurus keperluan dasar dalam hidup, belajar, dan bekerja (600 kata).',
  HSK4: 'Bisa berdiskusi tentang cakupan topik yang cukup luas dengan lancar (1.200 kata).',
  HSK5: 'Bisa membaca surat kabar, menonton film, dan berpidato singkat (2.500 kata).',
  HSK6: 'Bisa memahami apa pun yang didengar dan dibaca, serta menyatakan pendapat dengan lancar (5.000 kata).',
}

function hskFormat(spec: HskSpec): ExamFormat {
  const hasWriting = (spec.writing?.length ?? 0) > 0
  const label = `HSK ${spec.level.replace('HSK', '')}`

  return {
    id: `hsk_${spec.level.replace('HSK', '').toLowerCase()}`,
    label,
    short: label,
    languageCode: 'zh',
    level: spec.level,
    note: HSK_NOTES[spec.level] ?? '',
    sections: {
      1: '听力 (Menyimak)',
      2: '阅读 (Membaca)',
      3: hasWriting ? '书写 (Menulis)' : '—',
    },
    minutes: { 1: spec.minutes[0], 2: spec.minutes[1], 3: spec.minutes[2] },
    listeningSection: 1,
    blocks: { full: hskBlocks(spec), short: shrink(hskBlocks(spec)) },
    ...(hasWriting
      ? {
          writing: {
            placeholder: '请用中文写你的答案…',
            // 字, bukan kata: bahasa Mandarin tidak dipisah spasi, dan syarat
            // panjang di HSK memang dihitung per karakter.
            unit: '字',
            rubric: 'rubrik HSK 书写 (内容 · 结构 · 语言)',
          },
        }
      : {}),
    scoring: {
      type: 'hsk',
      bands: hasWriting
        ? [
            { sections: [1], label: '听力', max: 100 },
            { sections: [2], label: '阅读', max: 100 },
            { sections: [3], label: '书写', max: 100 },
          ]
        : [
            { sections: [1], label: '听力', max: 100 },
            { sections: [2], label: '阅读', max: 100 },
          ],
      // 60% dari nilai penuh — angka resmi, dan sama untuk semua tingkat.
      pass: hasWriting ? 180 : 120,
      range: [0, hasWriting ? 300 : 200],
    },
  }
}

// ===========================================================================
// DELE
// ===========================================================================

/**
 * Struktur resmi DELE (Instituto Cervantes), satu ujian per tingkat CEFR.
 *
 * Ujian aslinya punya EMPAT prueba, dan yang keempat tidak dibuat di sini:
 *
 *   Prueba 1  Comprensión de lectura
 *   Prueba 2  Comprensión auditiva
 *   Prueba 3  Expresión e interacción escritas
 *   Prueba 4  Expresión e interacción ORALES   ← tidak dibuat
 *
 * Alasannya bukan kemalasan dan bukan keterbatasan tipe: tidak ada cara menilai
 * bicara di modul simulasi ini. Jawaban lisan tidak bisa dinilai otomatis, dan
 * menyodorkan soal yang tidak bisa dinilai lebih buruk daripada tidak
 * menyodorkannya. Kemampuan itu tetap dilatih — di jenis item `speaking` pada
 * latihan harian, yang memang dinilai sendiri lewat transkrip.
 *
 * Akibatnya pada penilaian harus dinyatakan, karena ini mengubah artinya:
 * DELE mengelompokkan empat prueba jadi DUA grupo yang masing-masing bernilai
 * 0–50 dan masing-masing WAJIB mencapai 30 —
 *
 *   Grupo 1  destrezas de lectura y escritura   = Prueba 1 + Prueba 3
 *   Grupo 2  destrezas orales                   = Prueba 2 + Prueba 4
 *
 * Grupo 1 di sini utuh. Grupo 2 tinggal separuh: comprensión auditiva memikul
 * seluruh bobot grupo itu sendirian. Jadi "Apto" di sini berarti *kemungkinan
 * besar Apto kalau bagian lisanmu sepadan dengan bagian lainnya* — bukan Apto.
 *
 * Satu lagi yang disederhanakan: di DELE C1 dan C2 sungguhan, prueba-nya berupa
 * DESTREZAS INTEGRADAS — satu tugas yang menggabungkan menyimak dan menulis
 * sekaligus. Di sini ketiganya tetap dipisah, karena soal terpadu menuntut
 * peserta menulis dari rekaman yang tidak boleh dilihat teksnya, dan itu tidak
 * bisa dijamin adil dengan TTS.
 */
type DeleSpec = {
  level: string
  /** [lectura, auditiva, escritura] dalam menit */
  minutes: [number, number, number]
  reading: Partial<Record<BlockType, number>>
  readingGroups?: [BlockType, number, number][]
  listening: Partial<Record<BlockType, number>>
  listeningGroups?: [BlockType, number, number][]
  /** [jenis, jumlah tugas, poin per tugas] */
  writing: [BlockType, number, number][]
}

/**
 * Kenapa poin bagian menulis selalu SAMA BESAR dengan jumlah soal bacaan.
 *
 * Karena keduanya satu grupo. Grupo 1 di DELE berisi lectura dan escritura
 * dengan bobot yang sama, jadi kalau bacaannya 36 soal (36 poin) dan
 * karangannya cuma 3 × 10 poin, bagian menulis tinggal 45% dari grupo itu —
 * dan peserta yang lemah menulis akan terlihat lebih baik daripada
 * seharusnya. Angka poin di `writing` di bawah dipilih supaya totalnya persis
 * menyamai jumlah soal `reading` pada tingkat yang sama.
 */
const DELE_SPECS: DeleSpec[] = [
  {
    level: 'A1',
    minutes: [45, 20, 25],
    reading: { es_read_notice: 10, es_read_match: 8, es_read_blank: 7 },
    listening: { es_listen_notice: 10, es_listen_short: 15 },
    writing: [
      ['es_write_form', 1, 12],
      ['es_write_letter', 1, 13],
    ],
  },
  {
    level: 'A2',
    minutes: [60, 35, 50],
    reading: { es_read_notice: 10, es_read_match: 8, es_read_blank: 12 },
    listening: { es_listen_notice: 12, es_listen_short: 18 },
    writing: [
      ['es_write_form', 1, 10],
      ['es_write_letter', 2, 10],
    ],
  },
  {
    level: 'B1',
    minutes: [70, 40, 60],
    reading: { es_read_match: 6, es_read_blank: 10 },
    readingGroups: [['es_read_passage', 2, 7]],
    listening: { es_listen_notice: 6, es_listen_short: 12 },
    listeningGroups: [['es_listen_talk', 2, 6]],
    writing: [
      ['es_write_letter', 1, 15],
      ['es_write_essay', 1, 15],
    ],
  },
  {
    level: 'B2',
    minutes: [70, 40, 80],
    reading: { es_read_blank: 12, es_read_match: 6 },
    readingGroups: [['es_read_passage', 3, 6]],
    listening: { es_listen_short: 12 },
    listeningGroups: [['es_listen_talk', 3, 6]],
    writing: [
      ['es_write_letter', 1, 12],
      ['es_write_essay', 2, 12],
    ],
  },
  {
    level: 'C1',
    minutes: [90, 50, 80],
    reading: { es_read_blank: 14, es_read_match: 6 },
    readingGroups: [['es_read_passage', 4, 5]],
    listening: { es_listen_short: 10 },
    listeningGroups: [['es_listen_talk', 4, 5]],
    writing: [['es_write_essay', 2, 20]],
  },
  {
    level: 'C2',
    minutes: [105, 45, 150],
    reading: { es_read_blank: 20, es_read_match: 8 },
    readingGroups: [['es_read_passage', 4, 6]],
    listening: { es_listen_short: 8 },
    listeningGroups: [['es_listen_talk', 3, 6]],
    writing: [
      ['es_write_essay', 2, 20],
      ['es_write_letter', 1, 12],
    ],
  },
]

function deleBlocks(spec: DeleSpec): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  let part = 0
  const next = () => PART_LETTERS[part++] ?? 'Z'

  for (const [type, count] of Object.entries(spec.reading) as [BlockType, number][]) {
    blocks.push({ section: 1, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }
  for (const [type, groups, perGroup] of spec.readingGroups ?? []) {
    blocks.push({ section: 1, part: next(), type, groups, perGroup, label: BLOCK_LABELS[type] })
  }

  part = 0
  for (const [type, count] of Object.entries(spec.listening) as [BlockType, number][]) {
    blocks.push({ section: 2, part: next(), type, groups: 0, perGroup: count, label: BLOCK_LABELS[type] })
  }
  for (const [type, groups, perGroup] of spec.listeningGroups ?? []) {
    blocks.push({ section: 2, part: next(), type, groups, perGroup, label: BLOCK_LABELS[type] })
  }

  part = 0
  for (const [type, count, points] of spec.writing) {
    blocks.push({
      section: 3,
      part: next(),
      type,
      groups: 0,
      perGroup: count,
      label: BLOCK_LABELS[type],
      points,
      writing: true,
    })
  }

  return blocks
}

/** Keterangan tiap tingkat, diringkas dari deskripsi CEFR Instituto Cervantes. */
const DELE_NOTES: Record<string, string> = {
  A1: 'Bisa memakai ungkapan sehari-hari yang paling dasar untuk kebutuhan konkret.',
  A2: 'Bisa memahami kalimat tentang hal yang akrab: keluarga, belanja, pekerjaan, tempat.',
  B1: 'Bisa mengurus perjalanan dan pekerjaan sendiri, serta bercerita dan menjelaskan rencana.',
  B2: 'Bisa berdiskusi dengan lancar tentang topik yang luas, termasuk yang abstrak.',
  C1: 'Bisa memakai bahasa dengan lentur untuk keperluan akademik dan profesional.',
  C2: 'Bisa memahami hampir semua yang dibaca dan didengar, serta menyatakan nuansa yang halus.',
}

function deleFormat(spec: DeleSpec): ExamFormat {
  return {
    id: `dele_${spec.level.toLowerCase()}`,
    label: `DELE ${spec.level}`,
    short: `DELE ${spec.level}`,
    languageCode: 'es',
    level: spec.level,
    note: DELE_NOTES[spec.level] ?? '',
    sections: {
      1: 'Comprensión de lectura',
      2: 'Comprensión auditiva',
      3: 'Expresión e interacción escritas',
    },
    minutes: { 1: spec.minutes[0], 2: spec.minutes[1], 3: spec.minutes[2] },
    // Seksi 2, bukan 1 — dan inilah gunanya field ini ada: di TOEFL menyimak di
    // seksi 1, di JLPT seksi 3, di DELE seksi 2.
    listeningSection: 2,
    blocks: { full: deleBlocks(spec), short: shrink(deleBlocks(spec)) },
    writing: {
      placeholder: 'Escribe tu respuesta en español…',
      unit: ' palabras',
      rubric: 'skala DELE (adecuación · coherencia · corrección)',
    },
    scoring: {
      type: 'dele',
      bands: [
        // Grupo 1 memang menggabungkan dua seksi yang tidak berurutan (lectura
        // di seksi 1, escritura di seksi 3) — itu sebabnya `sections` berupa
        // daftar, bukan satu angka.
        { sections: [1, 3], label: 'Grupo 1 · Lectura y escritura', max: 50, passMin: 30 },
        { sections: [2], label: 'Grupo 2 · Comprensión auditiva', max: 50, passMin: 30 },
      ],
      pass: 60,
      range: [0, 100],
    },
  }
}

// ===========================================================================

export const EXAM_FORMATS: Record<string, ExamFormat> = Object.fromEntries(
  [
    TOEFL_ITP,
    ...SPECS.map(jlptFormat),
    TOPIK_I,
    TOPIK_II,
    ...HSK_SPECS.map(hskFormat),
    ...DELE_SPECS.map(deleFormat),
  ].map((f) => [f.id, f]),
)

export const DEFAULT_FORMAT = 'toefl_itp'

export function examFormat(kind: string): ExamFormat {
  return EXAM_FORMATS[kind] ?? EXAM_FORMATS[DEFAULT_FORMAT]
}

/** Format yang tersedia untuk bahasa yang sudah diaktifkan */
export function formatsForLanguages(codes: string[]): ExamFormat[] {
  const set = new Set(codes)
  return Object.values(EXAM_FORMATS).filter((f) => set.has(f.languageCode))
}
