/**
 * Selaraskan jalur belajar yang SUDAH ADA dengan kurikulum terbaru.
 *
 *   npm run db:sync-track
 *
 * Kenapa perlu: kurikulum di `lib/languages/` bertambah dari waktu ke waktu —
 * bagian Percakapan muncul belakangan, dan kolom `strand` baru ada sesudah
 * beberapa jalur terlanjur dibuat. Tanpa script ini, satu-satunya cara
 * mendapatkan materi baru adalah menghapus jalur lama beserta seluruh
 * progresnya. Itu harga yang tidak masuk akal untuk menambah 24 pelajaran.
 *
 * Yang dilakukan, dan yang TIDAK:
 *
 *   ✓ pelajaran yang belum ada  → ditambahkan
 *   ✓ bagian materi (`strand`), rencana item, dan daftar kata → diperbarui
 *   ✓ urutan (`position`)       → disusun ulang mengikuti anyaman terbaru
 *   ✗ pelajaran yang sudah ada  → TIDAK pernah dihapus
 *   ✗ materi & item yang sudah digenerate → TIDAK disentuh sama sekali
 *
 * Pencocokannya lewat judul + level. Pelajaran yang ada di database tapi tidak
 * ada di kurikulum (mis. unit buatan sendiri, atau judul yang sempat berubah)
 * dibiarkan utuh dan ditaruh di belakang — dilaporkan, bukan dibuang diam-diam.
 */
import { and, eq, isNotNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, tracks, units } from '@/lib/db/schema'
import { curriculumFor } from '@/lib/languages/curriculum'
import { buildSyllabus } from '@/lib/study/syllabus'

const DRY = process.argv.includes('--dry')

async function syncOne(track: {
  id: string
  userId: string
  languageId: string
  startLevel: string
  goal: string | null
}) {
  const [language] = await db
    .select()
    .from(languages)
    .where(eq(languages.id, track.languageId))
    .limit(1)

  // Hanya bahasa yang punya kurikulum tetap. Silabus buatan AI tidak bisa
  // disusun ulang tanpa memanggil AI lagi, dan hasilnya belum tentu sama —
  // menyelaraskannya justru akan mengacak-acak jalur yang sedang jalan.
  if (!curriculumFor(language.code)) {
    console.log(`· ${language.name}: silabus buatan AI, dilewati`)
    return
  }

  const built = await buildSyllabus({
    languageCode: language.code,
    languageName: language.name,
    nativeName: language.nativeName,
    startLevel: track.startLevel,
    levels: language.fieldTemplate.levels,
    goal: track.goal,
  })

  const existing = await db
    .select()
    .from(units)
    .where(and(eq(units.trackId, track.id), eq(units.userId, track.userId)))

  const key = (title: string, level: string) => `${level}::${title}`
  const byKey = new Map(existing.map((u) => [key(u.title, u.level), u]))
  const matched = new Set<string>()

  let updated = 0
  let inserted = 0

  // Posisi digeser jauh dulu supaya penyusunan ulang tidak sempat menabrak
  // posisi lama yang belum dipindah. Tanpa ini, urutan sementara bisa kembar
  // dan "pelajaran berikutnya" salah pilih di tengah proses.
  if (!DRY) {
    for (const u of existing) {
      await db.update(units).set({ position: u.position + 100_000 }).where(eq(units.id, u.id))
    }
  }

  for (const [i, lesson] of built.lessons.entries()) {
    const found = byKey.get(key(lesson.title, lesson.level))

    if (found) {
      matched.add(found.id)
      updated++
      if (DRY) continue
      await db
        .update(units)
        .set({
          position: i,
          strand: lesson.strand ?? null,
          itemPlan: lesson.itemTypes ?? null,
          wordList: lesson.words?.length ? lesson.words : null,
          wordListType: lesson.wordListType ?? null,
          topic: lesson.topic,
          focus: lesson.focus,
        })
        .where(eq(units.id, found.id))
      continue
    }

    inserted++
    if (DRY) continue
    await db.insert(units).values({
      userId: track.userId,
      languageId: track.languageId,
      trackId: track.id,
      position: i,
      status: 'planned',
      title: lesson.title,
      topic: lesson.topic,
      focus: lesson.focus,
      level: lesson.level,
      wordList: lesson.words?.length ? lesson.words : null,
      wordListType: lesson.wordListType ?? null,
      itemPlan: lesson.itemTypes ?? null,
      strand: lesson.strand ?? null,
    })
  }

  // Yang tidak dikenali kurikulum ditaruh di belakang, tetap bisa dibuka.
  const orphans = existing.filter((u) => !matched.has(u.id))
  if (!DRY) {
    for (const [i, u] of orphans.entries()) {
      await db
        .update(units)
        .set({ position: built.lessons.length + i, strand: u.strand ?? 'tatabahasa' })
        .where(eq(units.id, u.id))
    }
  }

  console.log(
    `${DRY ? '· (dry)' : '✓'} ${language.name}: ${updated} diperbarui, ${inserted} ditambahkan` +
      (orphans.length ? `, ${orphans.length} di luar kurikulum ditaruh di belakang` : ''),
  )
  if (orphans.length) {
    console.log('   di luar kurikulum:', orphans.map((o) => o.title).join(' · '))
  }
}

async function main() {
  const rows = await db
    .select({
      id: tracks.id,
      userId: tracks.userId,
      languageId: tracks.languageId,
      startLevel: tracks.startLevel,
      goal: tracks.goal,
    })
    .from(tracks)
    .where(isNotNull(tracks.id))

  if (rows.length === 0) {
    console.log('Belum ada jalur belajar.')
    return
  }

  for (const track of rows) await syncOne(track)
  console.log(DRY ? '\nItu simulasi saja — tidak ada yang diubah.' : '\nSelesai.')
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
