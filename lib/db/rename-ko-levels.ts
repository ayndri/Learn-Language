/**
 * Migrasi satu kali: ganti nama level Korea dari "TOPIK 1–6" jadi "1급–6급".
 *
 *   npm run db:rename-ko-levels
 *
 * Kenapa: penamaan lama salah menggambarkan sistemnya. UJIAN TOPIK cuma ada
 * DUA — TOPIK I dan TOPIK II. Yang enam adalah TINGKAT SERTIFIKAT-nya (급):
 * TOPIK I memberi 1급/2급, TOPIK II memberi 3급–6급. Menulis level sebagai
 * "TOPIK 2" membuatnya terbaca sebagai nama ujian, bukan tingkat.
 *
 * Harus dijalankan SEBELUM `db:sync-track`. Sync mencocokkan pelajaran lama
 * dengan kurikulum lewat pasangan judul+level; kalau levelnya belum diganti,
 * tidak ada yang cocok dan seluruh 199 pelajaran akan ditambahkan lagi sebagai
 * duplikat.
 *
 * Aman dijalankan berulang: baris yang sudah bernama 급 tidak tersentuh.
 */
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, tracks, units } from '@/lib/db/schema'

async function main() {
  const [ko] = await db.select().from(languages).where(eq(languages.code, 'ko')).limit(1)
  if (!ko) {
    console.log('Bahasa Korea belum ada di database.')
    return
  }

  // Ekspresinya sengaja generik: 'TOPIK 3' → '3급', apa pun angkanya.
  const renamed = sql`regexp_replace(level, '^TOPIK ([1-6])$', '\\1급')`

  const u = await db
    .update(units)
    .set({ level: renamed })
    .where(sql`${units.languageId} = ${ko.id} AND ${units.level} LIKE 'TOPIK %'`)
  console.log(`✓ ${u.rowCount ?? 0} pelajaran diganti namanya`)

  const t = await db
    .update(tracks)
    .set({ startLevel: sql`regexp_replace(start_level, '^TOPIK ([1-6])$', '\\1급')` })
    .where(sql`${tracks.languageId} = ${ko.id} AND ${tracks.startLevel} LIKE 'TOPIK %'`)
  console.log(`✓ ${t.rowCount ?? 0} jalur belajar disesuaikan level awalnya`)

  console.log('\nSelesai. Jalankan db:seed-languages lalu db:sync-track.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
