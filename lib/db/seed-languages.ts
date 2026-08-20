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
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      itemTypes: ['vocab', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },

  // ------------------------------------------------------------------
  // Bahasa berikutnya. Sengaja `enabled: false` — aktifkan kalau jenis
  // item `script` sudah ada (ROADMAP v2) dan kamu memang siap mulai.
  // Perhatikan bedanya: field `reading`/`romaji`, level JLPT, dan itemTypes
  // yang menyertakan `script`. Semuanya data, bukan kode.
  // ------------------------------------------------------------------
  {
    code: 'ja',
    name: 'Jepang',
    nativeName: '日本語',
    script: 'japanese',
    ttsLang: 'ja-JP',
    enabled: false,
    sortOrder: 1,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Kanji/Kana', primary: true, required: true, speakable: true },
        { key: 'reading', label: 'Bacaan (kana)', required: true },
        { key: 'romaji', label: 'Romaji' },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      itemTypes: ['vocab', 'script', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
  {
    code: 'ko',
    name: 'Korea',
    nativeName: '한국어',
    script: 'hangul',
    ttsLang: 'ko-KR',
    enabled: false,
    sortOrder: 2,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Hangul', primary: true, required: true, speakable: true },
        { key: 'romanization', label: 'Romanisasi' },
        {
          key: 'register',
          label: 'Tingkat bahasa',
          enum: ['formal', 'polite', 'casual'],
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      levels: ['TOPIK 1', 'TOPIK 2', 'TOPIK 3', 'TOPIK 4'],
      itemTypes: ['vocab', 'script', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
    },
  },
  {
    code: 'es',
    name: 'Spanyol',
    nativeName: 'Español',
    script: 'latin',
    ttsLang: 'es-ES',
    enabled: false,
    sortOrder: 3,
    fieldTemplate: {
      vocab: [
        { key: 'term', label: 'Palabra', primary: true, required: true, speakable: true },
        // Gender itu bagian dari kata dalam bahasa Spanyol, bukan catatan tambahan.
        { key: 'gender', label: 'Gender', enum: ['el', 'la', '-'] },
        {
          key: 'pos',
          label: 'Clase de palabra',
          enum: ['sustantivo', 'pronombre', 'verbo', 'adjetivo', 'adverbio', 'preposición', 'frase'],
        },
        { key: 'meaning_id', label: 'Arti', required: true },
        { key: 'example', label: 'Contoh', required: true, speakable: true },
        { key: 'example_id', label: 'Terjemahan contoh', required: true },
      ],
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      itemTypes: ['vocab', 'cloze', 'phrase', 'sentence', 'listening', 'speaking', 'writing', 'reading'],
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
          // `enabled` sengaja TIDAK di-update: kalau kamu sudah mengaktifkan
          // sebuah bahasa lewat UI/DB, jalan ulang seed tidak boleh mematikannya.
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
