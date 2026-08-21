/**
 * Ringkasan satu baris sebuah item, untuk daftar koreksi di halaman pelajaran.
 *
 * Ditaruh di sini, bukan di server action, karena file `'use server'` hanya
 * boleh mengekspor fungsi async — dan ini dipakai dua sisi: server action saat
 * menyimpan, dan halaman saat menyusun daftarnya.
 *
 * Urutan field yang dicoba mengikuti "apa yang paling menjelaskan kartunya":
 * kata utamanya dulu, baru kalimat, baru apa pun yang ada.
 */
export function itemPreview(fields: Record<string, unknown>, primaryKey: string): string {
  const pick = [
    fields[primaryKey],
    fields.kanji,
    fields.hanzi,
    fields.symbol,
    fields.glyph,
    fields.phrase,
    fields.sentence,
    fields.source_id,
    fields.text,
    fields.prompt_id,
    fields.question,
    fields.term,
  ].find((v) => typeof v === 'string' && v.trim())

  return String(pick ?? JSON.stringify(fields)).slice(0, 120)
}
