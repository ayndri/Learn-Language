import type { z } from 'zod'
import type { FieldTemplate } from '@/lib/languages/types'

export const ITEM_TYPES = [
  'vocab',
  'cloze',
  'phrase',
  'sentence',
  'listening',
  'speaking',
  'writing',
  'reading',
  'error_spot',
  'script',
] as const
export type ItemType = (typeof ITEM_TYPES)[number]

/** Rating FSRS. Angkanya sengaja sama dengan enum Rating di ts-fsrs. */
export const RATING = { Again: 1, Hard: 2, Good: 3, Easy: 4 } as const
export type Rating = (typeof RATING)[keyof typeof RATING]

/**
 * Cara sebuah item dinilai. Ini yang menentukan UI dan alur penyimpanannya.
 *
 * `self`        kamu lihat jawabannya lalu menilai sendiri (Lupa/Susah/Bisa/Gampang).
 *               Untuk item yang tujuannya mengenali, bukan memproduksi.
 *
 * `typed`       kamu taip jawaban, dicocokkan otomatis. Hanya untuk item yang
 *               jawabannya TUNGGAL — cloze, huruf, dikte.
 *
 * `typed-self`  kamu taip jawaban; kalau sama dengan acuan langsung lolos, kalau beda
 *               acuannya ditampilkan dan kamu menilai sendiri. WAJIB untuk item
 *               produksi bebas seperti terjemahan kalimat: "Saya dari Surabaya" bisa
 *               jadi "I'm from Surabaya" / "I am from Surabaya" / "I come from Surabaya",
 *               semuanya benar. Mencocokkan teks di situ akan menghukum jawaban benar.
 *
 * `ai`          karangan bebas, dinilai AI dengan rubrik. Satu panggilan AI per jawaban,
 *               jadi hanya untuk item yang jumlahnya sedikit (writing).
 *
 * `choice`      pilihan ganda A–D. Kunci disimpan di `fields.answer_index`, dan
 *               TIDAK boleh ikut terkirim ke klien sebelum dijawab — lihat
 *               catatan di app/(app)/practice/page.tsx.
 */
export type GradingMode = 'self' | 'typed' | 'typed-self' | 'ai' | 'choice'

export type GradeOutcome = {
  correct: boolean
  /** benar tapi ada typo kecil (jarak edit 1) → dipetakan ke Hard, bukan Again */
  nearMiss: boolean
  /** jawaban yang diharapkan, buat ditampilkan setelah dijawab */
  expected: string
}

/**
 * Satu jenis item = satu entri di registry.
 *
 * `schema` berupa FUNGSI dari field template, bukan schema statis, karena bentuk
 * item `vocab` berbeda tiap bahasa (Inggris punya `ipa`, Jepang punya `reading`+`romaji`).
 * Jenis lain mengabaikan argumennya.
 */
export type ItemTypeDef = {
  label: string
  /** kalimat singkat untuk ditampilkan sebagai instruksi di kartu latihan */
  instruction: string
  grading: GradingMode
  /**
   * Item yang TIDAK digenerate AI, tapi diturunkan dari item lain yang sudah ada.
   * `listening` memakai teks dari kalimat & ungkapan yang sudah dibuat — nol panggilan AI.
   */
  derived?: boolean
  /** butuh voice TTS tersedia; kalau tidak ada, item jenis ini dilewati */
  needsAudio?: boolean
  /**
   * Cara jawaban dimasukkan. Default mengetik.
   *
   * `voice` memakai Web Speech Recognition: kamu mengucapkannya, hasil transkrip
   * dipakai sebagai jawaban. Penilaiannya TETAP `typed-self` — pengenalan suara
   * tidak cukup akurat untuk aksen non-penutur-asli, jadi transkrip itu petunjuk,
   * bukan hakim. Kamu yang memutuskan benar atau tidak.
   */
  inputMode?: 'text' | 'voice'
  /** butuh mikrofon + SpeechRecognition; kalau tidak ada, item ini dilewati */
  needsMic?: boolean
  schema: (template: FieldTemplate) => z.ZodObject<z.ZodRawShape>
  /**
   * Pemeriksaan yang tidak bisa diungkapkan lewat JSON Schema, jadi tidak bisa
   * dipaksakan ke AI lewat responseSchema. Balikan array pesan masalah; kosong = lolos.
   * Contoh nyata: cloze yang datang dengan dua lubang — JSON-nya valid, isinya sampah.
   */
  check?: (fields: Record<string, unknown>) => string[]
  grader?: (answer: string, fields: Record<string, unknown>) => GradeOutcome
  /** Kunci ternormalisasi untuk unique constraint anti-duplikat */
  dedupKey: (fields: Record<string, unknown>) => string
  /** Tag untuk analisis kelemahan (mis. `grammar:present simple`) */
  tags: (fields: Record<string, unknown>) => string[]
  /** Instruksi tambahan yang disisipkan ke prompt AI untuk jenis ini */
  aiHint: string
  /** berapa item yang diminta per pelajaran saat penyiapan otomatis */
  perLesson: number
}
