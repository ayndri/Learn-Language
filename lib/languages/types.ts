import type { ItemType } from '@/lib/items/types'

/**
 * Definisi satu field pada kartu vocab sebuah bahasa.
 * Ini yang bikin multi-bahasa mungkin tanpa `if (lang === 'ja')` di mana pun:
 * komponen render membaca template ini, bukan menghardcode nama field.
 */
export type FieldDef = {
  key: string
  label: string
  /** field utama yang ditanyakan (sisi depan kartu) */
  primary?: boolean
  required?: boolean
  /** boleh dibacakan lewat Web Speech API */
  speakable?: boolean
  /** kalau diisi, nilainya dibatasi ke daftar ini */
  enum?: string[]
  hint?: string
}

export type FieldTemplate = {
  /** field untuk item bertipe `vocab` — beda tiap bahasa */
  vocab: FieldDef[]
  /** level yang berlaku di bahasa ini: CEFR untuk Inggris/Spanyol, JLPT untuk Jepang, dst */
  levels: string[]
  /**
   * jenis item yang relevan untuk bahasa ini — Jepang butuh `script`, Inggris tidak.
   * (`ttsLang` TIDAK di sini: itu kolom tersendiri di tabel `languages` supaya bisa
   * diquery langsung. Satu nilai, satu tempat.)
   */
  itemTypes: ItemType[]
}

/**
 * Field kartu kosakata yang berisi CARA MEMBACA kata, kalau bahasa itu punya.
 *
 * Dipakai untuk memberi tahu AI cara baca macam apa yang harus ditulis di materi
 * pelajaran: kana untuk Jepang, pinyin bertanda nada untuk Mandarin, romanisasi
 * RR untuk Korea, IPA untuk Inggris. Bahasa Spanyol tidak punya — ejaannya sudah
 * nyaris fonemis, jadi cara baca per kata cuma mengulang kata yang sama.
 *
 * Diturunkan dari template yang SUDAH ADA, bukan ditulis sebagai daftar baru.
 * Itu keputusan sadar: daftar kedua berarti dua tempat yang harus diubah
 * bersamaan setiap kali ada bahasa baru, dan yang kedua akan lupa. Template
 * kosakata sudah memuat jawabannya (`reading`, `pinyin`, `romanization`, `ipa`)
 * beserta label dan petunjuk penulisannya — itu persis yang perlu diteruskan ke
 * prompt.
 *
 * Kalau bahasa berikutnya memakai nama field lain, cukup tambahkan namanya di
 * `READING_KEYS`. Yang tidak cocok mengembalikan null, dan materinya tetap
 * dibuat — cuma tanpa cara baca, yang untuk aksara Latin memang benar.
 */
const READING_KEYS = ['reading', 'pinyin', 'romanization', 'romaji', 'ipa'] as const

export function readingFieldOf(template: FieldTemplate): FieldDef | null {
  for (const key of READING_KEYS) {
    const found = template.vocab.find((f) => f.key === key)
    if (found) return found
  }
  return null
}
