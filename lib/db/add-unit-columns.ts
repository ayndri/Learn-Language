/**
 * Migrasi: kolom-kolom baru di tabel `units`, plus isian untuk baris lama.
 *
 *   npm run db:add-unit-columns
 *
 * Ditulis sebagai script tersendiri, bukan lewat `drizzle-kit push`, karena
 * push meminta konfirmasi untuk seluruh selisih skema — termasuk drop dan
 * create ulang PRIMARY KEY di `exam_answers` dan `item_states` yang sebenarnya
 * tidak berubah apa-apa. Menyentuh constraint yang tidak perlu disentuh bukan
 * harga yang pantas dibayar untuk menambah dua kolom.
 *
 * Aman dijalankan berulang: keduanya IF NOT EXISTS.
 */
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

async function main() {
  await db.execute(sql`ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "word_list_type" text`)
  console.log('✓ units.word_list_type')

  await db.execute(sql`ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "item_plan" text[]`)
  console.log('✓ units.item_plan')

  await db.execute(sql`ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "strand" text`)
  console.log('✓ units.strand')

  // Pelajaran yang dibuat sebelum kolom ini ada tetap harus punya tab. Yang
  // membawa daftar kata itu pelajaran kosakata; sisanya tata bahasa. Hanya
  // baris yang masih kosong yang disentuh, jadi aman dijalankan berulang.
  const filled = await db.execute(sql`
    UPDATE "units"
    SET "strand" = CASE WHEN "word_list" IS NOT NULL THEN 'kosakata' ELSE 'tatabahasa' END
    WHERE "strand" IS NULL
  `)
  console.log(`✓ ${filled.rowCount ?? 0} pelajaran lama diberi bagian materi`)

  console.log('\nSelesai.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
