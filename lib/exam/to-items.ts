import type { ExamQuestion } from '@/lib/db/schema'
import { getItemType } from '@/lib/items/registry'
import type { ItemType } from '@/lib/items/types'
import { normalizeAnswer } from '@/lib/items/text'

/**
 * Soal simulasi yang SALAH → item latihan harian.
 *
 * Ini yang menutup lingkarannya. Tanpa ini, simulasi cuma mengukur: kamu salah
 * soal parallel structure, dapat skor, selesai. Dengan ini, kesalahanmu jadi
 * bahan latihan yang dijadwalkan FSRS sampai benar-benar nempel.
 *
 * Pemetaannya dipilih supaya latihannya LEBIH SULIT daripada soal aslinya —
 * kalau bisa, produksi mengalahkan pengenalan:
 *
 *   Structure          → `cloze`       kamu MENGETIK jawabannya, bukan memilih
 *                                      dari empat pilihan. Lubangnya sudah ada.
 *   Written Expression → `error_spot`  formatnya memang pilihan ganda; tidak ada
 *                                      cara produktif menirunya.
 *   Reading            → `reading`     bacaan + soal dibawa apa adanya.
 *   Listening          → `listening`   naskahnya jadi latihan dikte, bukan
 *                                      pilihan ganda. Melatih telinga lebih
 *                                      dalam daripada soal aslinya.
 */

export type ConvertedItem = {
  type: ItemType
  fields: Record<string, unknown>
  tags: string[]
  dedupKey: string
}

/** Bersihkan penanda lubang bergaya TOEFL ("______") ke bentuk cloze kita ("___") */
function normalizeBlank(stem: string): string {
  return stem.replace(/_{3,}/g, '___')
}

export function examQuestionToItem(q: ExamQuestion): ConvertedItem | null {
  const answer = q.options[q.answerIndex]
  if (!answer) return null

  const grammarTag = q.grammarPoint
    ? [`grammar:${normalizeAnswer(q.grammarPoint)}`]
    : []
  const fromExam = ['from:exam']

  switch (q.type) {
    case 'structure': {
      const sentence = normalizeBlank(q.stem)
      // Tanpa lubang, cloze-nya tidak bisa dikerjakan.
      if (!sentence.includes('___')) return null
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'struktur kalimat',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    case 'written_expression': {
      const fields = {
        sentence: q.stem,
        options: q.options,
        answer_index: q.answerIndex,
        explanation_id: q.explanationId,
      }
      return {
        type: 'error_spot',
        fields,
        tags: [...grammarTag, ...fromExam, 'skill:grammar'],
        dedupKey: getItemType('error_spot').dedupKey(fields),
      }
    }

    case 'reading': {
      // Bacaannya ada di exam_groups, jadi pemanggil harus menyuntikkannya.
      // Ditangani di `examQuestionToItemWithPassage`.
      return null
    }

    case 'listening_short':
    case 'listening_long':
    case 'listening_talk': {
      const script = q.audioScript
      if (!script) return null
      // Dikte dari naskah percakapan pendek saja. Ceramah dan percakapan panjang
      // terlalu panjang untuk ditulis ulang — itu jadi menghukum, bukan melatih.
      const words = script.trim().split(/\s+/).length
      if (words < 4 || words > 40) return null
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    default:
      return null
  }
}

/** Soal Reading butuh bacaannya, yang tersimpan di `exam_groups` */
export function readingQuestionToItem(
  q: ExamQuestion,
  passage: string,
): ConvertedItem | null {
  if (q.type !== 'reading' || !passage) return null
  const fields = {
    passage,
    question: q.stem,
    options: q.options,
    answer_index: q.answerIndex,
    explanation_id: q.explanationId,
  }
  return {
    type: 'reading',
    fields,
    tags: ['from:exam', 'skill:reading'],
    dedupKey: getItemType('reading').dedupKey(fields),
  }
}
