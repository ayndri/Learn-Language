/**
 * Seed / update tabel `languages`.
 *
 *   npm run db:seed-user      (sekali)
 *   npm run db:seed-languages
 *
 * ==> INI FILE YANG DIEDIT KALAU MAU NAMBAH BAHASA. <==
 *
 * Nambah bahasa = tambah satu entri di array di bawah lalu jalankan ulang script ini.
 * Tidak ada tabel baru, tidak ada komponen baru, tidak ada kode yang perlu diubah.
 * Kalau ternyata ada yang harus diubah di luar file ini, berarti ada `if (lang === ...)`
 * yang menyelinap ke dalam kode — cari dan buang.
 */
// Env dimuat lewat `tsx --env-file=.env.local` di package.json, BUKAN di sini:
// import ESM di-hoist ke atas, jadi loadEnv() di badan file akan jalan SETELAH
// lib/db dievaluasi — dan lib/db butuh DATABASE_URL saat diimpor.

import { db } from '@/lib/db'
import { languages } from '@/lib/db/schema'
import type { FieldTemplate } from '@/lib/languages/types'

type LanguageSeed = {
  code: string
  name: string
  nativeName: string
  script: string
  ttsLang: string
  enabled: boolean
  sortOrder: number
  fieldTemplate: FieldTemplate
}

const SEEDS: LanguageSeed[] = [
  {
    code: 'en',
    name: 'Inggris',
    nativeName: 'English',
    script: 'latin',
    ttsLang: 'en-US',
    enabled: true,
    sortOrder: 0,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Word', primary: true, required: true, speakable: true },
        { key: 'ipa', label: 'IPA', hint: 'mis. /ɪkˈzɑːmpl/' },
        {
          key: 'pos',
          label: 'Word class',
          // Enum yang kurang lengkap memaksa AI memilih yang salah: tanpa
          // 'pronoun', kata "I" dilabeli 'noun'. Kelas kata yang salah bukan
          // cuma jelek dilihat — kamu ikut menghafalnya.
          enum: [
            'noun', 'pronoun', 'verb', 'adjective', 'adverb',
            'preposition', 'conjunction', 'determiner', 'phrase',
          ],
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      // C2 ada karena kurikulumnya memang sampai situ. Berhenti di C1 berarti
      // "mahir" jadi level tertinggi yang bisa dicapai, padahal masih ada
      // register, idiom, dan penyuntingan di atasnya.
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      // `sound`, bukan `script`: yang dilatih lambang bunyi (IPA), dan itu
      // dinilai sendiri — bahasa Inggris tidak punya romanisasi yang bisa
      // diketik seperti kana atau hangul.
      itemTypes: ['vocab', 'sound', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },

  // ------------------------------------------------------------------
  // Jepang — aktif. Kurikulumnya lengkap dari N5 sampai N1:
  //   grammar  lib/languages/ja/grammar.ts     (128 pelajaran)
  //   kana     lib/languages/ja/kana.ts        (208 tanda)
  //   kanji    lib/languages/ja/kanji.ts       (1.400+ karakter)
  //   kosakata lib/languages/ja/vocabulary.ts  (1.000+ kata inti)
  // Ketiganya dirangkai jadi satu silabus di lib/languages/tracks.ts.
  //
  // Perhatikan bedanya dengan Inggris: field `reading`/`romaji`, level JLPT,
  // dan itemTypes yang menyertakan `script` (kana) serta `kanji`. Semuanya
  // data, bukan kode.
  // ------------------------------------------------------------------
  {
    code: 'ja',
    name: 'Jepang',
    nativeName: '日本語',
    script: 'japanese',
    ttsLang: 'ja-JP',
    enabled: true,
    sortOrder: 1,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Kanji/Kana', primary: true, required: true, speakable: true },
        { key: 'reading', label: 'Bacaan (kana)', required: true },
        { key: 'romaji', label: 'Romaji' },
        {
          key: 'pos',
          label: 'Kelas kata',
          // Golongan kata kerja IKUT di sini, bukan jadi catatan terpisah:
          // tanpa tahu 五段 atau 一段, kamu tidak bisa membentuk satu pun
          // konjugasinya. Untuk bahasa Jepang itu bagian dari katanya.
          enum: [
            '名詞', '動詞(五段)', '動詞(一段)', '動詞(不規則)', 'する動詞',
            'い形容詞', 'な形容詞', '副詞', '助詞', '接続詞', '表現',
          ],
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      itemTypes: ['vocab', 'script', 'kanji', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
  // ------------------------------------------------------------------
  // Korea — aktif. Kurikulumnya lengkap TOPIK 1 sampai 6:
  //   hangul    lib/languages/ko/hangul.ts       (jamo + 7 aturan bunyi)
  //   grammar   lib/languages/ko/grammar.ts      (조사·어미 + 문법)
  //   kosakata  lib/languages/ko/vocabulary.ts   (per tema)
  //   percakapan lib/languages/ko/conversation.ts
  //
  // Tidak ada bagian hanja: TOPIK tidak mengujinya, dan koran Korea modern
  // praktis tidak memakainya lagi. Kata Sino-Korea tetap masuk, tapi lewat
  // kosakata dan pola pembentukan kata — bukan lewat hafalan karakter.
  // ------------------------------------------------------------------
  {
    code: 'ko',
    name: 'Korea',
    nativeName: '한국어',
    script: 'hangul',
    ttsLang: 'ko-KR',
    enabled: true,
    sortOrder: 2,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Hangul', primary: true, required: true, speakable: true },
        { key: 'romanization', label: 'Romanisasi' },
        {
          key: 'pos',
          label: 'Kelas kata',
          // 동사 dan 형용사 dipisah, dan itu penting: kata sifat Korea
          // berkonjugasi seperti kata kerja (춥다 → 추워요), tidak seperti
          // bahasa Indonesia. Tanpa label ini kamu tidak tahu harus
          // memperlakukannya sebagai apa.
          enum: [
            '명사', '동사', '형용사', '부사', '조사', '어미',
            '수사', '관형사', '감탄사', '표현',
          ],
        },
        {
          key: 'register',
          label: 'Tingkat bahasa',
          enum: ['formal', 'polite', 'casual'],
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      // Enam tingkat sertifikat (급), bukan nama ujian.
      //
      // UJIAN TOPIK cuma ada dua: TOPIK I dan TOPIK II. Yang enam adalah
      // tingkatnya — TOPIK I memberi 1급/2급, TOPIK II memberi 3급–6급. Menulis
      // level sebagai "TOPIK 1…6" membuat orang mengira ada enam ujian, dan
      // "TOPIK 2" tertukar dengan ujian TOPIK II.
      levels: ['1급', '2급', '3급', '4급', '5급', '6급'],
      itemTypes: ['vocab', 'script', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
  // ------------------------------------------------------------------
  // Mandarin — aktif. Kurikulumnya lengkap HSK 1 sampai HSK 6:
  //   pinyin     lib/languages/zh/pinyin.ts       (nada, 声母·韵母, ejaan)
  //   hanzi      lib/languages/zh/hanzi.ts        (karakter per level)
  //   grammar    lib/languages/zh/grammar.ts      (虚词 + 语法)
  //   kosakata   lib/languages/zh/vocabulary.ts   (per tema)
  //   percakapan lib/languages/zh/conversation.ts
  //
  // Tiga hal yang membedakannya dari tiga bahasa di atas, dan semuanya DATA:
  //
  //   `sound`, bukan `script`, untuk bagian aksara. Pinyin itu sendiri sudah
  //   romanisasi, jadi tidak ada yang bisa diketik sebagai jawaban — sama
  //   persis dengan alasan bahasa Inggris memakai `sound`.
  //
  //   `hanzi`, bukan `kanji`. Bukan soal nama: kartunya berisi 部首, bentuk
  //   tradisional, dan 多音字 — bukan 音読み/訓読み. Lihat catatan di registry.
  //
  //   量词 sebagai field kartu kosakata. Sama seperti gender pada bahasa
  //   Spanyol: 一本书 benar dan 一个书 salah, dan itu bagian dari KATANYA,
  //   bukan catatan tata bahasa terpisah.
  // ------------------------------------------------------------------
  {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文',
    script: 'chinese',
    ttsLang: 'zh-CN',
    enabled: true,
    sortOrder: 3,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Hanzi', primary: true, required: true, speakable: true },
        { key: 'pinyin', label: 'Pinyin', required: true, hint: 'pakai tanda nada: nǐ hǎo, bukan ni3 hao3' },
        { key: 'traditional', label: 'Tradisional', hint: 'isi hanya kalau bentuk 繁体-nya berbeda' },
        {
          key: 'pos',
          label: 'Kelas kata',
          // 量词 IKUT sebagai kelas kata tersendiri, dan itu perlu: bahasa
          // Indonesia tidak punya kelas ini, jadi tanpa labelnya kata seperti
          // 本 atau 张 akan dihafal sebagai kata benda dan dipakai salah.
          enum: [
            '名词', '动词', '形容词', '副词', '量词', '代词', '数词',
            '介词', '连词', '助词', '叹词', '成语', '表达',
          ],
        },
        {
          key: 'measure',
          label: '量词',
          hint: 'kata bantu bilangan yang lazim, mis. 本 untuk 书. Kosongkan kalau bukan kata benda.',
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      // HSK 2.0 — enam tingkat. Standar HSK 3.0 (2021) memakai sembilan
      // tingkat, tapi hampir seluruh buku, kursus, dan syarat beasiswa yang
      // dipakai pelajar Indonesia masih ditulis dalam tingkat 2.0. Ditulis
      // rapat ("HSK1") supaya tetap muat di badge level di dashboard.
      levels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
      itemTypes: ['vocab', 'hanzi', 'sound', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
  // ------------------------------------------------------------------
  // Spanyol — aktif. Kurikulumnya lengkap A1 sampai C2:
  //   bunyi      lib/languages/es/sounds.ts       (huruf menipu, r/rr, tekanan)
  //   grammar    lib/languages/es/grammar.ts      (konjugasi + pola kalimat)
  //   kosakata   lib/languages/es/vocabulary.ts   (per tema)
  //   percakapan lib/languages/es/conversation.ts
  //
  // Bahasa ini kebalikan dari Mandarin dalam satu hal yang menentukan seluruh
  // bentuk kartunya: Mandarin tidak berkonjugasi sama sekali, Spanyol
  // berkonjugasi sampai satu verba punya lebih dari lima puluh bentuk. Karena
  // itu dua field yang tidak dipunyai bahasa lain di daftar ini:
  //
  //   `gender`      bagian dari kata bendanya, bukan catatan tambahan —
  //                 la mano yang berakhir -o tapi feminin adalah jenis kata
  //                 yang paling sering dihafal salah.
  //   `conjugation` golongan verbanya. Ini persis alasan yang sama dengan
  //                 五段/一段 pada bahasa Jepang: tanpa tahu golongannya, kamu
  //                 tidak bisa membentuk satu pun konjugasinya. Untuk verba
  //                 Spanyol itu bagian dari katanya.
  //
  // Levelnya CEFR, dan untuk bahasa ini itu langsung sepadan dengan ujiannya:
  // DELE diselenggarakan per tingkat CEFR, satu ujian untuk tiap tingkat dari
  // A1 sampai C2. Karena itu C2 ikut — berhenti di C1 berarti tingkat DELE
  // tertinggi tidak punya kurikulum yang menuju ke sana.
  // ------------------------------------------------------------------
  {
    code: 'es',
    name: 'Spanyol',
    nativeName: 'Español',
    script: 'latin',
    ttsLang: 'es-ES',
    enabled: true,
    sortOrder: 4,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Palabra', primary: true, required: true, speakable: true },
        // Gender itu bagian dari kata dalam bahasa Spanyol, bukan catatan tambahan.
        { key: 'gender', label: 'Gender', enum: ['el', 'la', '-'] },
        {
          key: 'pos',
          label: 'Clase de palabra',
          enum: [
            'sustantivo', 'pronombre', 'verbo', 'adjetivo', 'adverbio',
            'preposición', 'conjunción', 'artículo', 'locución', 'frase',
          ],
        },
        {
          key: 'conjugation',
          label: 'Golongan verba',
          // Sama alasannya dengan 五段/一段 di bahasa Jepang: tanpa tahu
          // golongannya, satu pun konjugasi tidak bisa dibentuk.
          enum: ['-ar', '-er', '-ir', 'irregular', 'reflexivo', '-'],
          hint: 'isi hanya untuk verba; "-" untuk kelas kata lain',
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      // C2 ikut karena DELE memang sampai C2 — lihat catatan di atas.
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      // `sound` untuk bagian bunyi & ejaan, alasannya sama dengan bahasa
      // Inggris: aksara Latin tidak punya romanisasi yang bisa diketik.
      itemTypes: ['vocab', 'sound', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
]

async function main() {
  for (const seed of SEEDS) {
    await db
      .insert(languages)
      .values(seed)
      .onConflictDoUpdate({
        target: languages.code,
        set: {
          name: seed.name,
          nativeName: seed.nativeName,
          script: seed.script,
          fieldTemplate: seed.fieldTemplate,
          ttsLang: seed.ttsLang,
          sortOrder: seed.sortOrder,
          // `enabled` hanya bisa NAIK lewat seed, tidak pernah turun: bahasa
          // yang di sini ditandai aktif akan diaktifkan, tapi bahasa yang kamu
          // aktifkan sendiri lewat UI/DB tidak akan dimatikan oleh jalan ulang.
          ...(seed.enabled ? { enabled: true } : {}),
        },
      })
    console.log(`${seed.enabled ? '✓' : '·'} ${seed.code} — ${seed.name}`)
  }
  console.log('\nSelesai. Yang bertanda · masih disabled, aktifkan kalau sudah siap.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
