'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { requireUserId } from '@/auth'
import { db } from '@/lib/db'
import { languages, units } from '@/lib/db/schema'

export type NewUnitState = { error?: string }

export async function createUnit(
  _prev: NewUnitState,
  formData: FormData,
): Promise<NewUnitState> {
  const userId = await requireUserId()

  const languageId = String(formData.get('languageId') ?? '')
  const topic = String(formData.get('topic') ?? '').trim()
  const level = String(formData.get('level') ?? '').trim()

  if (!languageId || !topic || !level) return { error: 'Lengkapi bahasa, topik, dan level.' }
  if (topic.length > 80) return { error: 'Topik terlalu panjang (maks 80 karakter).' }

  const [language] = await db.select().from(languages).where(eq(languages.id, languageId)).limit(1)
  if (!language || !language.enabled) return { error: 'Bahasa tidak tersedia.' }

  // Level divalidasi terhadap template bahasanya — A1 tidak berlaku untuk Jepang,
  // N5 tidak berlaku untuk Inggris. Jangan percaya nilai dari form.
  if (!language.fieldTemplate.levels.includes(level)) {
    return { error: `Level "${level}" tidak berlaku untuk bahasa ${language.name}.` }
  }

  const [unit] = await db
    .insert(units)
    .values({
      userId,
      languageId,
      title: `${topic} (${level})`,
      topic,
      level,
    })
    .returning({ id: units.id })

  // Unit dibuat dulu tanpa materi. Generate materi & item dilakukan dari halaman unit
  // sebagai request terpisah — bukan di sini. Kalau semuanya digabung ke satu request,
  // satu kegagalan AI membatalkan seluruh pembuatan unit.
  redirect(`/unit/${unit.id}`)
}
