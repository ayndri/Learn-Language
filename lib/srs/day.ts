/**
 * Batas hari untuk "jatuh tempo hari ini" dan perhitungan streak.
 *
 * Dua keputusan yang penting di sini:
 *
 * 1. Zona waktunya `Asia/Jakarta`, bukan UTC. Kalau pakai UTC, hari baru dimulai
 *    jam 07:00 WIB — jadi review pagi masuk ke hitungan "hari kemarin".
 *
 * 2. Hari baru mulai jam 04:00, bukan tengah malam (kebiasaan Anki). Belajar
 *    jam 1 pagi itu masih bagian dari "hari ini", bukan hari baru yang memutus streak.
 */
export const TIME_ZONE = 'Asia/Jakarta'
export const DAY_START_HOUR = 4

/** Ambil komponen tanggal/jam sebuah Date di zona waktu yang ditentukan */
function partsInZone(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Intl bisa mengembalikan "24" untuk tengah malam pada beberapa runtime
    hour: Number(parts.hour) % 24,
  }
}

/**
 * "Hari belajar" untuk sebuah waktu, sebagai string `YYYY-MM-DD`.
 * Jam 02:00 tanggal 5 masih dihitung sebagai hari belajar tanggal 4.
 */
export function studyDay(at: Date = new Date(), timeZone = TIME_ZONE): string {
  const { year, month, day, hour } = partsInZone(at, timeZone)
  const d = new Date(Date.UTC(year, month - 1, day))
  if (hour < DAY_START_HOUR) d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Instan N hari yang lalu.
 *
 * Ada di sini, bukan inline di komponen, karena aturan lint purity React 19
 * melarang memanggil `Date.now()` langsung di badan render.
 */
export function daysAgo(days: number, from: Date = new Date()): Date {
  return new Date(from.getTime() - days * 24 * 60 * 60 * 1000)
}

/** Selisih antara zona waktu target dan UTC pada suatu instan, dalam milidetik */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const p = Object.fromEntries(fmt.formatToParts(instant).map((x) => [x.type, x.value]))
  const asIfUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  )
  return asIfUtc - instant.getTime()
}

/**
 * Instan mulainya hari belajar saat ini — dipakai untuk menghitung
 * "berapa item baru yang sudah diperkenalkan hari ini".
 */
export function studyDayStart(now: Date = new Date(), timeZone = TIME_ZONE): Date {
  const [y, m, d] = studyDay(now, timeZone).split('-').map(Number)
  const naive = Date.UTC(y, m - 1, d, DAY_START_HOUR)
  // Dua langkah: offset bisa berbeda di sekitar pergantian DST. Asia/Jakarta tidak
  // punya DST, tapi fungsi ini tetap benar kalau TIME_ZONE nanti diganti.
  const first = naive - zoneOffsetMs(new Date(naive), timeZone)
  return new Date(naive - zoneOffsetMs(new Date(first), timeZone))
}

/**
 * Hitung streak dari daftar waktu review (urutan bebas).
 * Streak dianggap masih hidup kalau review terakhir terjadi hari ini atau kemarin.
 */
export function currentStreak(reviewTimes: Date[], now: Date = new Date()): number {
  if (reviewTimes.length === 0) return 0

  const days = new Set(reviewTimes.map((t) => studyDay(t)))
  const today = studyDay(now)

  const shift = (isoDay: string, byDays: number) => {
    const d = new Date(`${isoDay}T00:00:00Z`)
    d.setUTCDate(d.getUTCDate() + byDays)
    return d.toISOString().slice(0, 10)
  }

  // Kalau hari ini belum review, streak masih boleh dihitung dari kemarin.
  let cursor = days.has(today) ? today : shift(today, -1)
  if (!days.has(cursor)) return 0

  let streak = 0
  while (days.has(cursor)) {
    streak++
    cursor = shift(cursor, -1)
  }
  return streak
}
