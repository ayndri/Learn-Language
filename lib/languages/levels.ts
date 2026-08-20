/**
 * Warna per level.
 *
 * Dipetakan lewat POSISI level di dalam daftar bahasanya, bukan lewat namanya —
 * supaya Jepang (N5…N1) dan Korea (TOPIK 1…4) ikut dapat warna tanpa perlu
 * tabel nama sendiri. Tidak ada `if (lang === …)` di sini.
 *
 * Nama class ditulis literal karena Tailwind memindai kode sumber; class yang
 * dirakit lewat template string tidak akan ikut terkompilasi.
 */
export type LevelStyle = {
  text: string
  bg: string
  soft: string
  ring: string
}

const PALETTE: LevelStyle[] = [
  { text: 'text-lv-a1', bg: 'bg-lv-a1', soft: 'bg-lv-a1-soft', ring: 'ring-lv-a1' },
  { text: 'text-lv-a2', bg: 'bg-lv-a2', soft: 'bg-lv-a2-soft', ring: 'ring-lv-a2' },
  { text: 'text-lv-b1', bg: 'bg-lv-b1', soft: 'bg-lv-b1-soft', ring: 'ring-lv-b1' },
  { text: 'text-lv-b2', bg: 'bg-lv-b2', soft: 'bg-lv-b2-soft', ring: 'ring-lv-b2' },
  { text: 'text-lv-c1', bg: 'bg-lv-c1', soft: 'bg-lv-c1-soft', ring: 'ring-lv-c1' },
]

export function levelStyle(level: string, levels: string[]): LevelStyle {
  const i = levels.indexOf(level)
  return PALETTE[Math.min(Math.max(i, 0), PALETTE.length - 1)]
}
