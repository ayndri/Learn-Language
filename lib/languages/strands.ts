/**
 * BAGIAN MATERI (strand)
 *
 * Satu jalur belajar bahasa Jepang isinya 356 pelajaran dari empat jenis bahan
 * yang sebenarnya tidak sejenis: aksara, kanji, kosakata, dan tata bahasa.
 * Ditumpuk jadi satu daftar panjang, semuanya kelihatan sama rata — padahal
 * "hafal 12 kanji" dan "paham pola 〜ば〜ほど" itu pekerjaan yang berbeda, dan
 * orang sering ingin fokus ke salah satunya dulu.
 *
 * Karena itu tiap pelajaran punya `strand`, dan dashboard menampilkannya
 * sebagai tab. Tiap tab berdiri sendiri: punya daftar pelajarannya sendiri,
 * progresnya sendiri, dan tombol lanjutnya sendiri.
 *
 * Ini DATA, bukan kode: bahasa yang tidak punya aksara khusus (Inggris,
 * Spanyol) otomatis cuma memunculkan tab yang memang dipakainya. Tidak ada
 * `if (lang === 'ja')` di halaman mana pun.
 */

export type StrandId =
  | 'aksara'
  | 'kanji'
  | 'kosakata'
  | 'imbuhan'
  | 'tatabahasa'
  | 'percakapan'

export type Strand = {
  id: StrandId
  /** nama tab */
  label: string
  /** satu kalimat: bagian ini melatih apa */
  note: string
  icon: string
}

/**
 * Urutannya sengaja begini, dan itu urutan belajar, bukan abjad:
 * aksara dulu (tanpa itu tidak ada yang bisa dibaca), lalu bahan mentah
 * (kanji & kosakata), lalu cara merangkainya (imbuhan → tata bahasa), lalu
 * pemakaiannya di situasi nyata (percakapan).
 *
 * Keterangan di sini sengaja NETRAL bahasa. Yang khas per bahasa ada di
 * `OVERRIDES` di bawah — kalau tidak dipisah begini, tab "Aksara" pada bahasa
 * Korea akan berbunyi "Hiragana dan katakana", dan itu bukan cuma salah, tapi
 * membingungkan orang yang baru mulai.
 */
export const STRANDS: Strand[] = [
  {
    id: 'aksara',
    label: 'Aksara',
    note: 'Sistem tulisan dan bunyinya — pondasi sebelum bisa membaca apa pun.',
    icon: 'Aa',
  },
  {
    id: 'kanji',
    label: 'Kanji',
    note: 'Karakter kanji: arti, 音読み, 訓読み, dan kata contohnya.',
    icon: '漢',
  },
  {
    id: 'kosakata',
    label: 'Kosakata',
    note: 'Kata per tema: perkenalan, keluarga, profesi, waktu, dan seterusnya.',
    icon: '語',
  },
  {
    id: 'imbuhan',
    label: 'Imbuhan',
    note: 'Bagian yang menempel pada kata lain dan mengubah bentuk atau perannya.',
    icon: '+',
  },
  {
    id: 'tatabahasa',
    label: 'Tata Bahasa',
    note: 'Pola kalimat: bagaimana kata-kata disusun jadi kalimat yang benar.',
    icon: '文',
  },
  {
    id: 'percakapan',
    label: 'Percakapan',
    note: 'Kalimat siap pakai untuk situasi nyata: berkenalan, memesan, menelepon.',
    icon: '会',
  },
]

/**
 * Yang khas per bahasa.
 *
 * Hanya field yang memang berbeda yang ditulis ulang — sisanya diwarisi dari
 * `STRANDS`. Ikonnya memakai aksara bahasa itu sendiri, karena tab yang bisa
 * dikenali sekilas jauh lebih berguna daripada tab yang seragam.
 */
const OVERRIDES: Record<string, Partial<Record<StrandId, Partial<Strand>>>> = {
  en: {
    aksara: {
      label: 'Bunyi',
      note: 'IPA, tekanan kata, dan hubungan ejaan↔bunyi yang tidak beraturan.',
      icon: 'æ',
    },
    kosakata: { note: 'Kata inti per tema, lalu kosakata akademik (AWL).', icon: 'Aa' },
    imbuhan: { note: 'Awalan, akhiran, dan keluarga kata: decide → decision → decisive.', icon: 're-' },
    tatabahasa: { icon: 'S+V' },
    percakapan: { note: 'Kalimat siap pakai: berkenalan, menelepon, wawancara kerja.', icon: 'Hi' },
  },
  ja: {
    aksara: { label: 'Kana', note: 'Hiragana dan katakana — bentuk, bunyi, dan aturan bacanya.', icon: 'あ' },
    imbuhan: { note: '助詞 dan perubahan bentuk kata: て形, ない形, 受身, 使役, 敬語.', icon: 'を' },
  },
  ko: {
    aksara: {
      label: 'Hangul',
      note: '자음·모음, 받침, dan tujuh aturan perubahan bunyi (연음, 비음화, 경음화…).',
      icon: '가',
    },
    kosakata: { icon: '어' },
    imbuhan: {
      label: 'Imbuhan',
      note: '조사 dan 어미 — partikel dan akhiran yang menempel berlapis pada satu kata.',
      icon: '는',
    },
    tatabahasa: { icon: '문' },
    percakapan: { note: 'Kalimat siap pakai, lengkap dengan tingkat tutur yang tepat.', icon: '말' },
  },
  zh: {
    // Untuk bahasa Mandarin "aksara" BUKAN karakternya — karakter punya tabnya
    // sendiri. Yang di sini pinyin dan nada, dan itu memang pondasi yang harus
    // lewat lebih dulu: satu suku kata tanpa nada yang benar adalah kata lain,
    // bukan kata yang beraksen.
    aksara: {
      label: 'Pinyin',
      note: 'Empat nada, 声母·韵母, dan aturan ejaan pinyin — pondasi sebelum satu karakter pun.',
      icon: 'ā',
    },
    // Tab karakter memakai id `kanji` karena bagiannya sama: satu kartu = satu
    // karakter Han beserta arti, bacaan, dan kata contohnya. Yang berbeda cuma
    // namanya, dan itu memang urusan label — bukan alasan menambah jalur baru.
    kanji: { label: 'Hanzi', note: 'Karakter Han: arti, pinyin, 部首, goresan, dan kata contohnya.', icon: '汉' },
    kosakata: { note: 'Kata per tema, lengkap dengan 量词 dan pasangan kata yang lazim.', icon: '词' },
    imbuhan: {
      label: 'Kata Fungsi',
      note: '虚词 — 了·着·过·的·得·把·被 dan 补语: seluruh "morfologi" bahasa yang tidak berkonjugasi.',
      icon: '了',
    },
    tatabahasa: { note: 'Pola dan URUTAN kata — tanpa konjugasi, urutanlah yang menentukan arti.', icon: '语' },
    percakapan: { note: 'Kalimat siap pakai, termasuk partikel akhir yang menentukan nadanya.', icon: '话' },
  },
  es: {
    // Ejaan Spanyol nyaris fonemis, jadi bagian ini KECIL — tapi tidak kosong:
    // r/rr membedakan kata, dan tekanan suku kata membedakan KALA (hablo vs
    // habló). Yang dilatih bunyi dan tanda aksennya, bukan hurufnya.
    aksara: {
      label: 'Bunyi & Ejaan',
      note: 'Huruf yang menipu (h, j, v, ñ), r vs rr, dan aturan tekanan serta tanda aksen.',
      icon: 'á',
    },
    kosakata: { note: 'Kata per tema — kata benda selalu dengan artikelnya, karena gender itu bagian dari katanya.', icon: 'ñ' },
    // Bahasa Spanyol adalah kebalikan dari Mandarin: satu kata kerja punya
    // lebih dari lima puluh bentuk, dan bentuk itu MENGGANTIKAN kata ganti.
    // Salah akhiran bukan salah ejaan — itu salah orang.
    imbuhan: {
      label: 'Konjugasi',
      note: 'Akhiran kata kerja (kala, persona, subjuntivo) dan imbuhan pembentuk kata.',
      icon: '-ar',
    },
    tatabahasa: { note: 'Pola kalimat: kapan memakai bentuk yang mana, dan bagaimana kata disusun.', icon: 'S+V' },
    percakapan: { note: 'Kalimat siap pakai, lengkap dengan negara tempat kalimat itu wajar.', icon: '¡H!' },
  },
}

const BY_ID = new Map(STRANDS.map((s) => [s.id, s]))

export function strandOf(id: string | null | undefined, languageCode?: string): Strand {
  const base = BY_ID.get((id ?? '') as StrandId) ?? FALLBACK
  const override = languageCode ? OVERRIDES[languageCode]?.[base.id] : undefined
  return override ? { ...base, ...override } : base
}

/**
 * Untuk pelajaran yang dibuat sebelum kolom `strand` ada, dan untuk silabus
 * buatan AI yang tidak mengelompokkan apa pun. Bukan error — tetap ada
 * tempatnya, cuma tanpa nama bagian yang spesifik.
 */
const FALLBACK: Strand = {
  id: 'tatabahasa',
  label: 'Pelajaran',
  note: 'Materi jalur belajarmu.',
  icon: '•',
}

/** Urutan tab mengikuti urutan di `STRANDS`, bukan urutan kemunculan di data. */
export function sortStrands(ids: string[], languageCode?: string): Strand[] {
  const seen = new Set(ids)
  return STRANDS.filter((s) => seen.has(s.id)).map((s) => strandOf(s.id, languageCode))
}
