'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { requireUserId } from '@/auth'
import { buildSyllabus } from '@/lib/study/syllabus'
import { db } from '@/lib/db'
import { languages, tracks, units } from '@/lib/db/schema'
import { rememberLanguage } from '@/lib/study/active'

export type StartState = { error?: string }

/**
 * Mulai jalur belajar baru: bikin track + susun silabusnya.
 *
 * Hanya SATU panggilan AI di sini (menyusun daftar pelajaran). Materi dan item
 * tiap pelajaran digenerate belakangan, saat pelajaran itu didatangi.
 */
export async function startTrack(_prev: StartState, formData: FormData): Promise<StartState> {
  const userId = await requireUserId()

  const languageId = String(formData.get('languageId') ?? '')
  const startLevel = String(formData.get('startLevel') ?? '').trim()
  const goalRaw = String(formData.get('goal') ?? '').trim()
  const goal = goalRaw.slice(0, 120) || null

  if (!languageId || !startLevel) return { error: 'Pilih bahasa dan levelnya dulu.' }

  const [language] = await db.select().from(languages).where(eq(languages.id, languageId)).limit(1)
  if (!language?.enabled) return { error: 'Bahasa tidak tersedia.' }
  if (!language.fieldTemplate.levels.includes(startLevel)) {
    return { error: `Level "${startLevel}" tidak berlaku untuk bahasa ${language.name}.` }
  }

  // Penjaga terakhir. Halaman /start sudah menyembunyikan bahasa yang jalurnya
  // ada, tapi form lama di tab yang masih terbuka bisa tetap terkirim — dan
  // akibatnya bukan error, melainkan silabus kedua yang menumpuk diam-diam di
  // atas yang lama.
  const [existing] = await db
    .select({ id: tracks.id })
    .from(tracks)
    .where(and(eq(tracks.userId, userId), eq(tracks.languageId, languageId)))
    .limit(1)
  if (existing) {
    return { error: `Jalur ${language.name} sudah ada. Pilih dari dashboard, bukan dibuat ulang.` }
  }

  let built
  try {
    built = await buildSyllabus({
      languageCode: language.code,
      languageName: language.name,
      nativeName: language.nativeName,
      startLevel,
      levels: language.fieldTemplate.levels,
      goal,
    })
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Gagal menyusun silabus: ${err.message}`
          : 'Gagal menyusun silabus.',
    }
  }

  const [track] = await db
    .insert(tracks)
    .values({ userId, languageId, startLevel, goal })
    .onConflictDoUpdate({
      target: [tracks.userId, tracks.languageId],
      set: { startLevel, goal },
    })
    .returning({ id: tracks.id })

  await db.insert(units).values(
    built.lessons.map((lesson, i) => ({
      userId,
      languageId,
      trackId: track.id,
      position: i,
      status: 'planned' as const,
      title: lesson.title,
      topic: lesson.topic,
      focus: lesson.focus,
      // Daftar kosong disimpan sebagai null, bukan []. Pelajaran "aturan khusus
      // kana" memang tidak punya daftar tanda, dan [] akan membuat generator
      // mengira daftarnya ada tapi isinya nol.
      wordList: lesson.words?.length ? lesson.words : null,
      wordListType: lesson.wordListType ?? (lesson.words ? 'vocab' : null),
      itemPlan: lesson.itemTypes ?? null,
      strand: lesson.strand ?? null,
      level: lesson.level,
    })),
  )

  // Bahasa yang baru dibuat langsung jadi yang aktif. Kalau tidak, dashboard
  // membuka jalur lama dan yang baru dibikin seolah-olah tidak terjadi apa-apa.
  await rememberLanguage(language.code)

  redirect('/')
}
