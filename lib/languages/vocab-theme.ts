/**
 * Bentuk bersama untuk kurikulum kosakata bertema.
 *
 * Dipakai bahasa Inggris dan Jepang. Logika dedupe-nya ditaruh di sini karena
 * dua-duanya butuh jaminan yang sama: satu kata tidak boleh muncul di dua
 * pelajaran. Kartu kembar membuat kurikulum terlihat lebih panjang daripada
 * isinya, dan bikin hitungan cakupan bohong.
 */

export type VocabTheme = {
  level: string
  /** judul pelajaran dalam bahasa Indonesia */
  title: string
  /** situasi pemakaiannya — jadi konteks prompt materi & contoh kalimat */
  context: string
  words: string[]
}

/** Tema untuk level yang diminta, tanpa kata yang sudah muncul sebelumnya. */
export function pickThemes(all: VocabTheme[], levels: string[]): VocabTheme[] {
  const allowed = new Set(levels)
  const seen = new Set<string>()
  const out: VocabTheme[] = []

  for (const theme of all) {
    if (!allowed.has(theme.level)) continue
    const words = theme.words.filter((w) => {
      const key = w.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (words.length) out.push({ ...theme, words })
  }
  return out
}

export function countWords(all: VocabTheme[]): number {
  return new Set(all.flatMap((t) => t.words.map((w) => w.toLowerCase()))).size
}
