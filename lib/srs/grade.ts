import { RATING, type GradeOutcome, type Rating } from '@/lib/items/types'

/** Di bawah ini dianggap "lancar" — jawaban keluar tanpa mikir lama */
const FAST_MS = 6_000

/**
 * Hasil pemeriksaan otomatis → rating FSRS.
 *
 * FSRS hanya mengerti 4 rating, jadi item yang dinilai otomatis harus dipetakan.
 * Aturannya sengaja ditaruh di satu tempat supaya konsisten antar jenis item.
 *
 *   benar + cepat        → Easy
 *   benar                → Good
 *   benar tapi typo      → Hard   (bukan Again — kamu tahu jawabannya, cuma salah ketik)
 *   salah                → Again
 */
export function outcomeToRating(outcome: GradeOutcome, durationMs: number): Rating {
  if (!outcome.correct) return RATING.Again
  if (outcome.nearMiss) return RATING.Hard
  return durationMs <= FAST_MS ? RATING.Easy : RATING.Good
}

export function isValidRating(value: unknown): value is Rating {
  return value === 1 || value === 2 || value === 3 || value === 4
}
