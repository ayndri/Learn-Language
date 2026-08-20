/**
 * Normalisasi jawaban sebelum dibandingkan.
 *
 * `stripAccents` default FALSE dan itu sengaja. Untuk Spanyol nanti,
 * `está` vs `esta` itu dua kata berbeda ("dia sedang" vs "ini") — bukan typo.
 * Mengabaikan aksen akan membuat latihannya mengajarkan hal yang salah.
 */
export function normalizeAnswer(input: string, opts: { stripAccents?: boolean } = {}): string {
  let s = input.trim().toLowerCase().replace(/\s+/g, ' ')
  // buang tanda baca di ujung saja — tanda baca di tengah (apostrof: don't) itu bermakna
  s = s.replace(/^[.,!?;:"'¡¿]+|[.,!?;:"']+$/g, '')
  if (opts.stripAccents) {
    s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  }
  return s
}

/** Jarak Levenshtein, dibatasi agar berhenti lebih awal kalau sudah lewat `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > max) return max + 1

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      rowMin = Math.min(rowMin, curr[j])
    }
    if (rowMin > max) return max + 1
    prev = curr
  }
  return prev[b.length]
}

export const CLOZE_BLANK = '___'

export function countBlanks(sentence: string): number {
  return (sentence.match(/_{3,}/g) ?? []).length
}
