import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import type { FieldTemplate } from '@/lib/languages/types'
import type { ItemType } from '@/lib/items/types'

/**
 * users — single-user app, tapi user_id tetap dipakai di semua tabel.
 * Murah sekarang, dan menghindari migrasi menyakitkan kalau nanti berubah pikiran.
 * Login: username + password (hash bcrypt). Tidak ada tabel accounts/sessions
 * karena Credentials provider Auth.js memakai sesi JWT, bukan sesi database.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * languages — CONFIG, bukan data user.
 * Nambah bahasa baru = nambah satu baris di sini. Tidak ada kode yang perlu diubah.
 */
export const languages = pgTable('languages', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // 'en', 'ko', 'ja', 'es'
  name: text('name').notNull(), // "Inggris"
  nativeName: text('native_name').notNull(), // "English"
  script: text('script').notNull(), // 'latin' | 'hangul' | 'japanese' → penentu font
  fieldTemplate: jsonb('field_template').$type<FieldTemplate>().notNull(),
  ttsLang: text('tts_lang').notNull(), // BCP-47: 'en-US', 'ja-JP'
  enabled: boolean('enabled').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
})

/**
 * tracks — satu jalur belajar: "aku belajar bahasa X, mulai dari level Y".
 *
 * Ini yang membuat app-nya jadi aplikasi BELAJAR, bukan alat menyusun materi.
 * Silabusnya dibuat sekali oleh AI saat track dibuat, lalu app yang menentukan
 * pelajaran berikutnya. Pengguna tidak pernah memilih topik.
 */
export const tracks = pgTable(
  'tracks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'restrict' }),
    /** level awal saat mendaftar — tiap unit punya levelnya sendiri */
    startLevel: text('start_level').notNull(),
    /** opsional: "mau ngobrol sehari-hari", "persiapan TOEFL" — membentuk silabus */
    goal: text('goal'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  // Satu track per bahasa per orang. Mau ganti level? Silabusnya yang menyesuaikan.
  (t) => [uniqueIndex('tracks_user_lang_idx').on(t.userId, t.languageId)],
)

/**
 * units — satu pelajaran: materi penjelasan + kumpulan item latihan.
 *
 * Dibuat dalam dua tahap:
 *   `planned` — baru judul & topik dari silabus, isinya belum digenerate
 *   `ready`   — materi & item sudah ada, siap dipelajari
 *
 * Unit `planned` dibuat sekaligus banyak saat track dibuat (murah: cuma teks),
 * lalu diisi satu per satu begitu kamu sampai ke sana (mahal: beberapa panggilan AI).
 * Kalau semuanya digenerate di awal, kuota harian habis untuk pelajaran yang
 * belum tentu kamu sentuh.
 */
export const units = pgTable(
  'units',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'restrict' }),
    /** null untuk unit yang kamu buat sendiri di luar silabus */
    trackId: uuid('track_id').references(() => tracks.id, { onDelete: 'cascade' }),
    /** urutan dalam silabus; menentukan pelajaran berikutnya */
    position: integer('position').notNull().default(0),
    status: text('status').$type<'planned' | 'ready'>().notNull().default('planned'),
    title: text('title').notNull(),
    topic: text('topic').notNull(),
    level: text('level').notNull(), // 'A1' | 'N5' | dst — divalidasi terhadap fieldTemplate.levels
    /** apa yang dilatih di unit ini — dipakai sebagai konteks prompt */
    focus: text('focus'),
    /**
     * Daftar kata yang HARUS dipelajari di unit ini.
     *
     * Diisi untuk pelajaran kosakata dari AWL. Kalau ada, generator vocab tidak
     * boleh mengarang kata sendiri — cakupan kurikulum jadi bisa dihitung, bukan
     * bergantung pada apa yang kebetulan kepikiran AI.
     */
    wordList: text('word_list').array(),
    /**
     * Jenis item yang dikendalikan `wordList`.
     *
     * Tanpa ini, daftar kanji pada pelajaran kanji akan ikut dipaksakan ke
     * generator kosakata — dan kamu dapat sepuluh kartu kosakata berisi satu
     * karakter kanji. Satu daftar, satu jenis yang memakainya.
     */
    wordListType: text('word_list_type').$type<ItemType>(),
    /**
     * Jenis latihan yang dibuat untuk unit ini. null = semua jenis yang
     * berlaku untuk bahasanya.
     *
     * Ada karena tidak semua pelajaran butuh semua jenis: pelajaran kana cuma
     * butuh kartu cara baca, pelajaran kanji cuma butuh kartu kanji. Tiap jenis
     * yang tidak perlu adalah satu panggilan AI yang terbuang — dan pada
     * silabus 200-an pelajaran, itu bukan penghematan kecil.
     */
    itemPlan: text('item_plan').array().$type<ItemType[]>(),
    /**
     * Bagian materi: aksara, kanji, kosakata, imbuhan, tata bahasa, percakapan.
     *
     * Dashboard menampilkannya sebagai tab. Disimpan per unit, bukan dihitung
     * ulang dari judulnya, supaya pelajaran yang kamu buat sendiri lewat `/new`
     * juga punya tempat yang jelas.
     */
    strand: text('strand'),
    lessonMd: text('lesson_md'), // null selama status masih 'planned'
    /** true kalau materi sudah kamu koreksi manual — penanda "sudah diverifikasi" */
    lessonEdited: boolean('lesson_edited').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('units_user_lang_idx').on(t.userId, t.languageId),
    // Query terpanas alur belajar: "pelajaran berikutnya di track ini"
    index('units_track_position_idx').on(t.trackId, t.position),
  ],
)

/**
 * items — SEMUA jenis latihan dalam satu tabel.
 * Bentuk `fields` ditentukan oleh `type` dan divalidasi Zod lewat lib/items/registry.
 */
export const items = pgTable(
  'items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'cascade' }),
    /**
     * Sengaja didenormalisasi dari units.language_id.
     * Query terpanas aplikasi ini adalah "semua item bahasa X yang jatuh tempo" —
     * tanpa kolom ini, query itu harus join units setiap kali.
     */
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'restrict' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<ItemType>().notNull(),
    fields: jsonb('fields').$type<Record<string, unknown>>().notNull(),
    /** grammar point, register, dsb → dipakai buat analisis "apa yang masih lemah" */
    tags: text('tags').array().notNull().default([]),
    /** kunci ternormalisasi untuk cegah duplikat (lihat lib/items/registry) */
    dedupKey: text('dedup_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('items_unit_idx').on(t.unitId),
    index('items_lang_type_idx').on(t.languageId, t.type),
    // Jaring pengaman duplikat. Prompt AI juga diberi daftar dedupKey yang sudah ada,
    // tapi prompt bukan jaminan — constraint ini yang jaminan.
    uniqueIndex('items_dedup_idx').on(t.userId, t.languageId, t.dedupKey),
    index('items_tags_idx').using('gin', t.tags),
  ],
)

/**
 * item_states — state FSRS per item.
 * Dipisah dari `items` supaya progres bisa di-reset tanpa menghapus itemnya.
 */
export const itemStates = pgTable(
  'item_states',
  {
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** kolom paling sering diquery di seluruh aplikasi */
    due: timestamp('due', { withTimezone: true }).notNull(),
    stability: real('stability').notNull().default(0),
    difficulty: real('difficulty').notNull().default(0),
    elapsedDays: integer('elapsed_days').notNull().default(0),
    scheduledDays: integer('scheduled_days').notNull().default(0),
    reps: integer('reps').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    /**
     * Posisi dalam learning/relearning steps. WAJIB dipersist — ts-fsrs v5
     * memakainya untuk penjadwalan jangka pendek; kalau hilang, tiap kali
     * item dimuat ulang ia balik ke langkah pertama.
     */
    learningSteps: integer('learning_steps').notNull().default(0),
    /** 0 new, 1 learning, 2 review, 3 relearning (sesuai enum State ts-fsrs) */
    state: smallint('state').notNull().default(0),
    lastReview: timestamp('last_review', { withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.itemId, t.userId] }),
    index('item_states_due_idx').on(t.userId, t.due),
  ],
)

/**
 * review_logs — riwayat mentah. Dipakai untuk streak, grafik, analisis grammar point
 * terlemah, dan nanti optimasi parameter FSRS.
 */
export const reviewLogs = pgTable(
  'review_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** 1 again, 2 hard, 3 good, 4 easy */
    rating: smallint('rating').notNull(),
    /** null untuk item yang dinilai sendiri (self-rated) */
    answerGiven: text('answer_given'),
    wasCorrect: boolean('was_correct'),
    stateBefore: smallint('state_before').notNull(),
    dueBefore: timestamp('due_before', { withTimezone: true }),
    durationMs: integer('duration_ms'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('review_logs_user_time_idx').on(t.userId, t.reviewedAt)],
)

export type User = typeof users.$inferSelect
export type Language = typeof languages.$inferSelect
export type Track = typeof tracks.$inferSelect
export type Unit = typeof units.$inferSelect
export type Item = typeof items.$inferSelect
export type ItemState = typeof itemStates.$inferSelect
export type ReviewLog = typeof reviewLogs.$inferSelect

// ===========================================================================
// SIMULASI UJIAN (TOEFL ITP)
//
// Terpisah dari `items`/`item_states` dan itu disengaja. Latihan SRS tujuannya
// MENGINGAT jangka panjang — jadwalnya per item, tidak ada batas waktu, tidak ada
// skor. Simulasi ujian tujuannya MENGUKUR dalam kondisi mirip aslinya: 140 soal,
// berbatas waktu, dikerjakan sekali, lalu dinilai.
//
// Memaksa keduanya ke dalam satu tabel akan merusak keduanya.
// ===========================================================================

/** Satu paket simulasi ujian. */
export const exams = pgTable(
  'exams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'restrict' }),
    /** 'toefl_itp' — nanti bisa 'toefl_ibt', 'ielts', dst */
    kind: text('kind').notNull(),
    /** 'full' (140 soal) atau 'short' (latihan cepat) */
    size: text('size').$type<'full' | 'short'>().notNull().default('full'),
    status: text('status')
      .$type<'planned' | 'ready' | 'in_progress' | 'done'>()
      .notNull()
      .default('planned'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('exams_user_idx').on(t.userId, t.createdAt)],
)

/**
 * Bahan bersama untuk beberapa soal: satu bacaan, satu rekaman percakapan panjang.
 *
 * Dipisah dari `exam_questions` supaya bacaan 300 kata tidak disalin ulang
 * sepuluh kali untuk sepuluh soal yang menanyakannya.
 */
export const examGroups = pgTable(
  'exam_groups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),
    section: smallint('section').notNull(),
    part: text('part').notNull(),
    position: integer('position').notNull(),
    /** 'passage' | 'conversation' | 'talk' */
    kind: text('kind').notNull(),
    title: text('title'),
    /** teks bacaan, atau naskah yang dibacakan TTS */
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('exam_groups_exam_idx').on(t.examId, t.position)],
)

export const examQuestions = pgTable(
  'exam_questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),
    /** null untuk soal yang berdiri sendiri (Structure, Written Expression, Listening Part A) */
    groupId: uuid('group_id').references(() => examGroups.id, { onDelete: 'cascade' }),
    section: smallint('section').notNull(),
    part: text('part').notNull(),
    /** urutan global dalam ujian, 0-based */
    position: integer('position').notNull(),
    type: text('type').notNull(),
    /** naskah yang dibacakan TTS untuk Listening Part A (percakapan pendek) */
    audioScript: text('audio_script'),
    stem: text('stem').notNull(),
    /**
     * Pola grammar yang diuji. Diisi untuk soal Structure & Written Expression.
     * Dipakai dua kali: sebagai tag saat soal salah diubah jadi item latihan,
     * dan untuk analisis kelemahan di halaman statistik.
     */
    grammarPoint: text('grammar_point'),
    /** kosong untuk soal karangan (쓰기) — lihat `maxScore` */
    options: text('options').array().notNull(),
    /**
     * Kunci jawaban. NULL untuk soal karangan, yang tidak punya satu jawaban
     * benar dan dinilai AI dengan rubrik.
     */
    answerIndex: smallint('answer_index'),
    /**
     * Bobot nilai soal ini. NULL = 1 poin, seperti semua soal pilihan ganda.
     *
     * Ada karena TOPIK 쓰기 tidak memberi bobot yang sama: soal 51–52 bernilai
     * 10 poin, 53 bernilai 30, dan 54 bernilai 50. Menganggap semuanya satu
     * poin membuat esai 700 kata sama berharganya dengan mengisi satu kalimat.
     */
    maxScore: smallint('max_score'),
    explanationId: text('explanation_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('exam_questions_exam_idx').on(t.examId, t.position)],
)

export const examAnswers = pgTable(
  'exam_answers',
  {
    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => examQuestions.id, { onDelete: 'cascade' }),
    /** null = dilewati, atau soal ini memang bukan pilihan ganda */
    chosen: smallint('chosen'),
    isCorrect: boolean('is_correct').notNull().default(false),
    /** jawaban karangan (쓰기) apa adanya */
    textAnswer: text('text_answer'),
    /** nilai yang diberikan AI untuk jawaban karangan, 0..maxScore */
    score: smallint('score'),
    /** komentar AI dalam bahasa Indonesia — ditampilkan di halaman hasil */
    feedbackId: text('feedback_id'),
    answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.examId, t.questionId] })],
)

export type Exam = typeof exams.$inferSelect
export type ExamGroup = typeof examGroups.$inferSelect
export type ExamQuestion = typeof examQuestions.$inferSelect
export type ExamAnswer = typeof examAnswers.$inferSelect
