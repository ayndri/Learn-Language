import { createEmptyCard, fsrs, generatorParameters, type Card, type Grade } from 'ts-fsrs'
import type { ItemState } from '@/lib/db/schema'
import type { Rating } from '@/lib/items/types'

/**
 * Satu instance scheduler untuk seluruh aplikasi.
 *
 * `enable_fuzz` menyebar jadwal beberapa persen supaya item yang dibuat bersamaan
 * tidak selamanya jatuh tempo di hari yang sama persis — tanpa ini, satu unit yang
 * digenerate sekaligus akan terus muncul bergerombol.
 */
const scheduler = fsrs(
  generatorParameters({
    enable_fuzz: true,
    enable_short_term: true,
  }),
)

/** Baris DB → Card yang dipahami ts-fsrs */
export function toCard(row: ItemState): Card {
  return {
    due: row.due,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    learning_steps: row.learningSteps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    last_review: row.lastReview ?? undefined,
  }
}

type StateColumns = Omit<ItemState, 'itemId' | 'userId'>

/** Card dari ts-fsrs → kolom-kolom yang disimpan ke DB */
export function toStateColumns(card: Card): StateColumns {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review ?? null,
  }
}

/** State awal untuk item yang baru dibuat */
export function initialState(now: Date): StateColumns {
  return toStateColumns(createEmptyCard(now))
}

/**
 * Terapkan satu penilaian dan hitung jadwal berikutnya.
 * Mengembalikan kolom DB yang baru + interval (hari) untuk ditampilkan ke user.
 */
export function applyRating(
  row: ItemState,
  rating: Rating,
  now: Date,
): { next: StateColumns; scheduledDays: number } {
  const { card } = scheduler.next(toCard(row), now, rating as Grade)
  return { next: toStateColumns(card), scheduledDays: card.scheduled_days }
}

/** Pratinjau interval untuk keempat tombol — dipakai menampilkan "+3 hari" di UI */
export function previewIntervals(row: ItemState, now: Date): Record<Rating, number> {
  const preview = scheduler.repeat(toCard(row), now)
  return {
    1: preview[1].card.scheduled_days,
    2: preview[2].card.scheduled_days,
    3: preview[3].card.scheduled_days,
    4: preview[4].card.scheduled_days,
  }
}
