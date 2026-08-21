'use server'

import { and, asc, count, eq, max } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUserId } from '@/auth'
import { generateExamBlock, gradeExamWriting } from '@/lib/ai/exam'
import { db } from '@/lib/db'
import {
  examAnswers,
  examGroups,
  examQuestions,
  exams,
  itemStates,
  items,
  languages,
  units,
} from '@/lib/db/schema'
import { questionCount, type ExamSize } from '@/lib/exam/blueprint'
import { EXAM_FORMATS, examFormat } from '@/lib/exam/formats'
import { examSteps } from '@/lib/exam/plan'
import { GROUPED_TYPES, examQuestionToItem, readingQuestionToItem } from '@/lib/exam/to-items'
import { initialState } from '@/lib/srs/fsrs'

export type ExamActionResult = { ok?: string; error?: string; rejected?: string[] }

async function loadOwnedExam(examId: string, userId: string) {
  const [row] = await db
    .select()
    .from(exams)
    .where(and(eq(exams.id, examId), eq(exams.userId, userId)))
    .limit(1)
  return row
}

/** Bikin paket simulasi baru (masih kosong) lalu buka halamannya. */
export async function createExamAction(kind: string, size: ExamSize): Promise<ExamActionResult> {
  const userId = await requireUserId()

  if (size !== 'full' && size !== 'short') return { error: 'Ukuran tidak dikenal.' }
  if (!EXAM_FORMATS[kind]) return { error: 'Jenis simulasi tidak dikenal.' }
  const format = EXAM_FORMATS[kind]

  // Tiap format ujian terikat ke satu bahasa — TOEFL memang tes bahasa Inggris,
  // JLPT memang tes bahasa Jepang. Yang dicek di sini bahasanya sudah aktif,
  // bukan kamu sudah punya jalur belajarnya: simulasi boleh dikerjakan
  // kapan saja sebagai pengukur.
  const [language] = await db
    .select()
    .from(languages)
    .where(eq(languages.code, format.languageCode))
    .limit(1)
  if (!language?.enabled) return { error: `Bahasa untuk ${format.label} belum diaktifkan.` }

  const [exam] = await db
    .insert(exams)
    .values({ userId, languageId: language.id, kind, size, status: 'planned' })
    .returning({ id: exams.id })

  redirect(`/exam/${exam.id}`)
}

/**
 * Generate satu langkah soal.
 *
 * Dipanggil berulang dari klien sampai semua langkah selesai — bukan satu request
 * besar. Simulasi penuh butuh ~18 panggilan AI; digabung jadi satu, request-nya
 * berjalan beberapa menit tanpa tanda kehidupan dan kena batas durasi serverless.
 */
export async function generateExamStepAction(
  examId: string,
  stepIndex: number,
): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }

  const steps = examSteps(exam.kind, exam.size)
  const step = steps[stepIndex]
  if (!step) return { error: 'Langkah tidak ada.' }

  let result
  try {
    result = await generateExamBlock(exam.kind, step.block, step.groupIndex)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal membuat soal.' }
  }

  // Posisi soal berlanjut dari yang sudah ada, jadi langkah bisa dijalankan ulang
  // tanpa mengacaukan urutan.
  const [{ maxPos }] = await db
    .select({ maxPos: max(examQuestions.position) })
    .from(examQuestions)
    .where(eq(examQuestions.examId, examId))
  let position = (maxPos ?? -1) + 1

  let inserted = 0

  for (const q of result.standalone) {
    await db.insert(examQuestions).values({
      examId,
      section: step.section,
      part: step.block.part,
      position: position++,
      type: step.block.type,
      audioScript: q.audioScript ?? null,
      stem: q.stem,
      grammarPoint: q.grammarPoint ?? null,
      options: q.options,
      answerIndex: q.answerIndex,
      // Bobot diambil dari cetak biru, bukan dari AI: nilai soal itu aturan
      // ujian, bukan sesuatu yang boleh dikarang saat membuat soalnya.
      maxScore: step.block.points ?? null,
      explanationId: q.explanationId,
    })
    inserted++
  }

  for (const g of result.groups) {
    const [group] = await db
      .insert(examGroups)
      .values({
        examId,
        section: step.section,
        part: step.block.part,
        position: step.groupIndex,
        kind: g.kind,
        title: g.title,
        body: g.body,
      })
      .returning({ id: examGroups.id })

    for (const q of g.questions) {
      await db.insert(examQuestions).values({
        examId,
        groupId: group.id,
        section: step.section,
        part: step.block.part,
        position: position++,
        type: step.block.type,
        stem: q.stem,
        options: q.options,
        answerIndex: q.answerIndex,
        explanationId: q.explanationId,
      })
      inserted++
    }
  }

  revalidatePath(`/exam/${examId}`)
  return {
    ok: `${inserted} soal ditambahkan.`,
    // Soal yang ditolak selalu dilaporkan — jumlah soal yang kurang dari cetak
    // biru harus terlihat, bukan disembunyikan.
    rejected: result.rejected,
  }
}

export async function markExamReadyAction(examId: string): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }

  const [{ n }] = await db
    .select({ n: count() })
    .from(examQuestions)
    .where(eq(examQuestions.examId, examId))

  if (Number(n) === 0) return { error: 'Belum ada soal.' }

  await db.update(exams).set({ status: 'ready' }).where(eq(exams.id, examId))
  revalidatePath(`/exam/${examId}`)
  return { ok: `Siap: ${n} dari ${questionCount(exam.kind, exam.size)} soal.` }
}

export async function startExamAction(examId: string): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }
  if (exam.status === 'done') return { error: 'Simulasi ini sudah selesai.' }

  await db
    .update(exams)
    .set({ status: 'in_progress', startedAt: exam.startedAt ?? new Date() })
    .where(eq(exams.id, examId))
  revalidatePath(`/exam/${examId}`)
  return { ok: 'Mulai.' }
}

/** Simpan satu jawaban. Idempoten — memilih ulang menimpa pilihan sebelumnya. */
export async function answerExamAction(
  examId: string,
  questionId: string,
  chosen: number,
): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }
  if (exam.status === 'done') return { error: 'Simulasi sudah selesai.' }

  const [q] = await db
    .select({ answerIndex: examQuestions.answerIndex, options: examQuestions.options })
    .from(examQuestions)
    .where(and(eq(examQuestions.id, questionId), eq(examQuestions.examId, examId)))
    .limit(1)
  if (!q) return { error: 'Soal tidak ditemukan.' }
  if (q.answerIndex === null) return { error: 'Soal ini dijawab dengan tulisan, bukan pilihan.' }
  if (chosen < 0 || chosen >= q.options.length) return { error: 'Pilihan tidak valid.' }

  // Kebenaran dihitung di server dan disimpan. Klien tidak pernah menerima
  // `answerIndex` selama ujian berjalan — kunci jawaban tidak boleh ada di browser.
  const isCorrect = chosen === q.answerIndex

  await db
    .insert(examAnswers)
    .values({ examId, questionId, chosen, isCorrect })
    .onConflictDoUpdate({
      target: [examAnswers.examId, examAnswers.questionId],
      set: { chosen, isCorrect, answeredAt: new Date() },
    })

  return { ok: 'ok' }
}

/**
 * Simpan DAN nilai satu jawaban karangan (TOPIK 쓰기).
 *
 * Dinilai saat disimpan, bukan menunggu ujian selesai. Dua alasan: menilai empat
 * karangan sekaligus di akhir butuh empat panggilan AI berturut-turut dalam satu
 * request — cukup lama untuk kena batas durasi serverless — dan peserta yang
 * kehabisan waktu di soal terakhir tetap mendapat nilai untuk yang sudah ditulis.
 *
 * Idempoten: menyimpan ulang menimpa nilai dan komentar sebelumnya.
 */
export async function answerExamWritingAction(
  examId: string,
  questionId: string,
  text: string,
): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }
  if (exam.status === 'done') return { error: 'Simulasi sudah selesai.' }

  const [q] = await db
    .select({
      stem: examQuestions.stem,
      explanationId: examQuestions.explanationId,
      maxScore: examQuestions.maxScore,
      answerIndex: examQuestions.answerIndex,
    })
    .from(examQuestions)
    .where(and(eq(examQuestions.id, questionId), eq(examQuestions.examId, examId)))
    .limit(1)
  if (!q) return { error: 'Soal tidak ditemukan.' }
  if (q.answerIndex !== null) return { error: 'Soal ini pilihan ganda, bukan karangan.' }

  const answer = text.trim().slice(0, 4000)
  const maxScore = q.maxScore ?? 10

  let graded
  try {
    graded = await gradeExamWriting(exam.kind, {
      prompt: q.stem,
      guidance: q.explanationId,
      answer,
      maxScore,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal menilai tulisan.' }
  }

  await db
    .insert(examAnswers)
    .values({
      examId,
      questionId,
      textAnswer: answer,
      score: graded.score,
      feedbackId: graded.feedback,
      // `isCorrect` tidak bermakna untuk karangan — nilainya bertingkat, bukan
      // benar/salah. Diisi true kalau dapat lebih dari separuh, semata supaya
      // hitungan "berapa yang benar" di halaman hasil tidak kosong.
      isCorrect: graded.score * 2 >= maxScore,
    })
    .onConflictDoUpdate({
      target: [examAnswers.examId, examAnswers.questionId],
      set: {
        textAnswer: answer,
        score: graded.score,
        feedbackId: graded.feedback,
        isCorrect: graded.score * 2 >= maxScore,
        answeredAt: new Date(),
      },
    })

  return { ok: `${graded.score}/${maxScore} — ${graded.feedback}` }
}

export async function finishExamAction(examId: string): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }

  await db
    .update(exams)
    .set({ status: 'done', finishedAt: new Date() })
    .where(eq(exams.id, examId))

  revalidatePath(`/exam/${examId}`)
  redirect(`/exam/${examId}/hasil`)
}

/**
 * Ubah semua soal yang SALAH (atau tidak dijawab) jadi item latihan harian.
 *
 * Inilah yang membuat simulasi bukan cuma alat ukur. Item hasil konversi diberi
 * tag `from:exam` supaya bisa dibedakan, dan masuk ke unit khusus di luar jalur
 * belajar utama — biar tidak mengacaukan urutan kurikulum.
 *
 * Idempoten: unique constraint `(user, language, dedup_key)` membuat menekan
 * tombolnya dua kali tidak menghasilkan duplikat.
 */
export async function examMistakesToItemsAction(examId: string): Promise<ExamActionResult> {
  const userId = await requireUserId()
  const exam = await loadOwnedExam(examId, userId)
  if (!exam) return { error: 'Simulasi tidak ditemukan.' }
  if (exam.status !== 'done') return { error: 'Selesaikan simulasinya dulu.' }

  const questions = await db
    .select()
    .from(examQuestions)
    .where(eq(examQuestions.examId, examId))
    .orderBy(asc(examQuestions.position))

  const answers = await db.select().from(examAnswers).where(eq(examAnswers.examId, examId))

  // "Sudah benar" berbeda artinya untuk karangan: bukan benar/salah, tapi
  // seberapa tinggi nilainya. Karangan yang dapat 90% ke atas tidak perlu
  // dilatih ulang; di bawah itu perlu — dan itu ambang yang lebih masuk akal
  // daripada `is_correct` yang cuma menandai "lebih dari separuh".
  const byId = new Map(answers.map((a) => [a.questionId, a]))
  const correctIds = new Set(answers.filter((a) => a.isCorrect).map((a) => a.questionId))

  const groups = await db.select().from(examGroups).where(eq(examGroups.examId, examId))
  const passageOf = new Map(groups.map((g) => [g.id, g.body]))

  const wrong = questions.filter((q) => {
    if (q.answerIndex === null) {
      const a = byId.get(q.id)
      const max = q.maxScore ?? 10
      return !a?.score || a.score < max * 0.9
    }
    return !correctIds.has(q.id)
  })
  if (wrong.length === 0) return { ok: 'Tidak ada yang salah — tidak ada yang perlu dilatih.' }

  // Semua item hasil konversi dikumpulkan dalam satu unit per simulasi, supaya
  // bisa dilihat sebagai satu kesatuan ("kesalahan simulasi 20 Agustus").
  const format = examFormat(exam.kind)

  // Level unit hasil koreksi harus level yang BENAR-BENAR ADA di bahasa itu.
  // Sebelumnya jatuh ke 'B1' untuk format tanpa level (TOEFL, TOPIK) — dan 'B1'
  // tidak ada di daftar level bahasa Korea, jadi unitnya memakai level hantu
  // yang tidak cocok dengan warna, urutan, maupun penyaringan mana pun.
  const [language] = await db
    .select({ fieldTemplate: languages.fieldTemplate })
    .from(languages)
    .where(eq(languages.id, exam.languageId))
    .limit(1)
  const levels = language?.fieldTemplate.levels ?? []
  const fallbackLevel = levels[Math.floor(levels.length / 2)] ?? levels[0] ?? 'B1'

  const label = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(exam.createdAt)

  const [unit] = await db
    .insert(units)
    .values({
      userId,
      languageId: exam.languageId,
      trackId: null, // di luar jalur belajar utama
      position: 0,
      status: 'ready',
      title: `Kesalahan simulasi ${format.short} — ${label}`,
      topic: `perbaikan dari simulasi ${format.label}`,
      focus: 'pola yang masih salah saat simulasi',
      // Level unitnya mengikuti level format ujiannya kalau ada (JLPT), atau
      // level menengah bahasa itu kalau tidak (TOEFL & TOPIK tidak berjenjang
      // per paket soal).
      level: format.level ?? fallbackLevel,
      lessonMd: null,
    })
    .returning({ id: units.id })

  let added = 0
  const skipped: string[] = []

  for (const q of wrong) {
    const converted = GROUPED_TYPES.includes(q.type)
      ? readingQuestionToItem(q, passageOf.get(q.groupId ?? '') ?? '')
      : examQuestionToItem(q)

    if (!converted) {
      skipped.push(`soal ${q.position + 1} (${q.type})`)
      continue
    }

    const [created] = await db
      .insert(items)
      .values({
        unitId: unit.id,
        languageId: exam.languageId,
        userId,
        type: converted.type,
        fields: converted.fields,
        tags: converted.tags,
        dedupKey: converted.dedupKey,
      })
      .onConflictDoNothing({ target: [items.userId, items.languageId, items.dedupKey] })
      .returning({ id: items.id })

    if (!created) continue
    await db.insert(itemStates).values({
      itemId: created.id,
      userId,
      ...initialState(new Date()),
    })
    added++
  }

  // Unit tanpa item cuma jadi sampah di daftar.
  if (added === 0) {
    await db.delete(units).where(eq(units.id, unit.id))
  }

  revalidatePath(`/exam/${examId}/hasil`)
  revalidatePath('/')

  return {
    ok:
      added === 0
        ? 'Tidak ada soal yang bisa diubah jadi latihan (kemungkinan sudah pernah ditambahkan).'
        : `${added} latihan baru dibuat dari ${wrong.length} soal yang salah.`,
    // Jenis soal yang tidak bisa dikonversi selalu disebut — jangan sampai kamu
    // menyangka semua kesalahan sudah ditindaklanjuti padahal belum.
    rejected: skipped.length ? [`Dilewati: ${skipped.join(', ')}`] : undefined,
  }
}
