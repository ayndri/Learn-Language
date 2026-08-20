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
