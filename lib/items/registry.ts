import { z } from 'zod'
import type { FieldTemplate } from '@/lib/languages/types'
import type { ItemType, ItemTypeDef } from '@/lib/items/types'
import { CLOZE_BLANK, countBlanks, editDistance, normalizeAnswer } from '@/lib/items/text'

/**
 * REGISTRY JENIS ITEM
 *
 * Ini file yang disentuh kalau mau nambah jenis latihan baru — dan idealnya
 * hanya file ini. Mesin SRS, skema database, dan halaman latihan tidak perlu tahu
 * ada jenis apa saja.
 *
 * Catatan penting: file ini SENGAJA tidak mengimpor komponen React.
 * Route API & server action mengimpor registry untuk validasi; kalau registry
 * menarik komponen client, seluruh pohon komponen ikut terbawa ke bundle server.
 */

// ---------------------------------------------------------------------------
// helper
// ---------------------------------------------------------------------------

/**
 * dedupKey SELALU diawali nama jenisnya.
 *
 * Tanpa prefiks, kalimat yang sama bisa tabrakan antar jenis: item `sentence`
 * dan item `listening` yang memakai teks yang sama akan menghasilkan kunci
 * identik, dan unique constraint (user, language, dedup_key) akan menolak yang
 * kedua — padahal keduanya latihan yang berbeda.
 */
function key(type: ItemType, ...parts: string[]): string {
  return `${type}:${parts.map((p) => normalizeAnswer(p)).join('|')}`
}

/** Pencocokan teks + toleransi typo. Dipakai semua item yang jawabannya tunggal. */
function matchExact(answer: string, expected: string) {
  const a = normalizeAnswer(answer)
  const b = normalizeAnswer(expected)
  if (a === b) return { correct: true, nearMiss: false, expected }
  // Toleransi typo hanya untuk jawaban panjang: pada kata pendek, satu huruf beda
  // biasanya KATA LAIN (`am` vs `is`, `el` vs `la`), bukan salah ketik.
  if (b.length >= 4 && editDistance(a, b, 1) <= 1) {
    return { correct: true, nearMiss: true, expected }
  }
  return { correct: false, nearMiss: false, expected }
}

// ---------------------------------------------------------------------------
// vocab — bentuk fieldnya beda tiap bahasa, jadi schema-nya dibangun dari template
// ---------------------------------------------------------------------------

function vocabSchema(template: FieldTemplate): z.ZodObject<z.ZodRawShape> {
  // Record biasa, bukan z.ZodRawShape — index signature-nya readonly di Zod 4.
  const shape: Record<string, z.ZodType> = {}
  for (const f of template.vocab) {
    const base = f.enum ? z.enum(f.enum as [string, ...string[]]) : z.string().min(1)
    const described = base.describe(f.hint ? `${f.label} — ${f.hint}` : f.label)
    shape[f.key] = f.required ? described : described.optional()
  }
  return z.object(shape)
}

function primaryKeyOf(template: FieldTemplate): string {
  return template.vocab.find((f) => f.primary)?.key ?? template.vocab[0]?.key ?? 'term'
}

// ---------------------------------------------------------------------------

export const ITEM_REGISTRY: Record<ItemType, ItemTypeDef | null> = {
  /* ---------------------------------------------------------------- vocab */
  vocab: {
    label: 'Kosakata',
    instruction: 'Apa artinya?',
    grading: 'self',
    perLesson: 10,
    schema: vocabSchema,
    dedupKey: (f) => key('vocab', String(f.term ?? '')),
    tags: (f) => (f.pos ? [`pos:${String(f.pos)}`] : []),
    aiHint:
      'Satu entri = satu kata atau frasa tetap. Contoh kalimatnya harus memakai kata itu ' +
      'secara alami dan sesuai level yang diminta. Arti ditulis dalam bahasa Indonesia.',
  },

  /* ---------------------------------------------------------------- cloze */
  cloze: {
    label: 'Grammar',
    instruction: 'Isi bagian yang kosong',
    grading: 'typed',
    perLesson: 10,
    schema: () =>
      z.object({
        sentence: z
          .string()
          .min(1)
          .describe(`Kalimat bahasa target dengan TEPAT SATU lubang, ditulis "${CLOZE_BLANK}"`),
        answer: z.string().min(1).describe('Kata atau frasa yang mengisi lubang'),
        grammar_point: z
          .string()
          .min(1)
          .describe(
            'Nama pola grammar yang diuji, mis. "present simple -s orang ketiga". ' +
              'BUKAN nama topik seperti "perkenalan".',
          ),
        explanation_id: z.string().min(1).describe('Penjelasan singkat dalam bahasa Indonesia'),
        translation_id: z.string().min(1).describe('Terjemahan kalimat utuh ke bahasa Indonesia'),
      }),
    check: (f) => {
      const problems: string[] = []
      const sentence = String(f.sentence ?? '')
      const answer = String(f.answer ?? '')
      const blanks = countBlanks(sentence)
      if (blanks !== 1) problems.push(`sentence punya ${blanks} lubang, harus tepat 1`)
      if (!answer.trim()) problems.push('answer kosong')
      const withoutBlank = sentence.replace(/_{3,}/g, ' ')
      if (
        answer.trim().length > 2 &&
        normalizeAnswer(withoutBlank).includes(normalizeAnswer(answer))
      ) {
        problems.push('answer sudah tampak di dalam sentence')
      }
      return problems
    },
    grader: (answer, f) => matchExact(answer, String(f.answer ?? '')),
    dedupKey: (f) => key('cloze', String(f.sentence ?? ''), String(f.answer ?? '')),
    tags: (f) =>
      f.grammar_point ? [`grammar:${normalizeAnswer(String(f.grammar_point))}`] : [],
    aiHint:
      'Setiap kalimat menguji SATU pola grammar dan berisi tepat satu "___". ' +
      'Jangan buat lubang yang jawabannya bisa bermacam-macam. ' +
      'grammar_point harus nama pola tata bahasa, bukan nama topik. ' +
      'Sebar variasi tense sesuai level, jangan semua kalimat pakai tense yang sama.',
  },

  /* --------------------------------------------------------------- phrase */
  phrase: {
    label: 'Ungkapan',
    instruction: 'Apa maksudnya, dan kapan dipakai?',
    grading: 'self',
    perLesson: 6,
    schema: () =>
      z.object({
        phrase: z.string().min(1).describe('Ungkapan utuh dalam bahasa target, apa adanya'),
        meaning_id: z.string().min(1).describe('Arti/fungsinya dalam bahasa Indonesia'),
        register: z
          .enum(['formal', 'netral', 'kasual'])
          .describe('Tingkat kesopanan ungkapan ini'),
        situation_id: z
          .string()
          .min(1)
          .describe('Satu kalimat: dalam situasi apa ungkapan ini wajar dipakai'),
      }),
    grader: undefined,
    dedupKey: (f) => key('phrase', String(f.phrase ?? '')),
    tags: (f) => (f.register ? [`register:${String(f.register)}`] : []),
    aiHint:
      'Ungkapan siap pakai yang benar-benar diucapkan penutur asli, bukan kalimat rakitan ' +
      'hasil terjemahan kata per kata. Sertakan tingkat kesopanannya karena memakai ungkapan ' +
      'kasual di situasi formal itu kesalahan yang tidak terasa oleh pemula.',
  },

  /* ------------------------------------------------------------- sentence */
  sentence: {
    label: 'Menyusun kalimat',
    instruction: 'Terjemahkan ke bahasa yang kamu pelajari',
    // Produksi bebas: banyak jawaban benar, jadi cocokkan dulu — kalau beda,
    // tampilkan acuan dan biarkan kamu menilai sendiri.
    grading: 'typed-self',
    perLesson: 10,
    schema: () =>
      z.object({
        source_id: z.string().min(1).describe('Kalimat dalam bahasa Indonesia untuk diterjemahkan'),
        target: z.string().min(1).describe('Terjemahan acuan dalam bahasa target'),
        grammar_point: z
          .string()
          .min(1)
          .describe('Pola grammar yang dilatih kalimat ini'),
        note_id: z
          .string()
          .describe('Opsional: catatan singkat kalau ada bentuk lain yang juga benar')
          .optional(),
      }),
    check: (f) => {
      const src = String(f.source_id ?? '')
      const tgt = String(f.target ?? '')
      const problems: string[] = []
      if (!src.trim() || !tgt.trim()) problems.push('source_id atau target kosong')
      if (normalizeAnswer(src) === normalizeAnswer(tgt)) {
        problems.push('source_id dan target identik — tidak ada yang diterjemahkan')
      }
      return problems
    },
    grader: (answer, f) => matchExact(answer, String(f.target ?? '')),
    dedupKey: (f) => key('sentence', String(f.source_id ?? '')),
    tags: (f) => (f.grammar_point ? [`grammar:${normalizeAnswer(String(f.grammar_point))}`] : []),
    aiHint:
      'Kalimat sumber ditulis dalam bahasa Indonesia yang wajar, bukan hasil terjemahan kaku. ' +
      'Panjangnya 5–12 kata. Setiap kalimat melatih pola grammar yang sedang dipelajari.',
  },

  /* ------------------------------------------------------------ listening */
  listening: {
    label: 'Dikte',
    instruction: 'Dengarkan, lalu tulis yang kamu dengar',
    grading: 'typed',
    perLesson: 0, // diturunkan, bukan digenerate
    derived: true,
    needsAudio: true,
    schema: () =>
      z.object({
        text: z.string().min(1).describe('Teks bahasa target yang dibacakan'),
        translation_id: z.string().min(1).describe('Terjemahan Indonesia, ditampilkan setelah dijawab'),
      }),
    grader: (answer, f) => matchExact(answer, String(f.text ?? '')),
    dedupKey: (f) => key('listening', String(f.text ?? '')),
    tags: () => ['skill:listening'],
    aiHint: '', // tidak dipakai — item ini tidak digenerate AI
  },

  /* ------------------------------------------------------------- speaking */
  speaking: {
    label: 'Berbicara',
    instruction: 'Ucapkan dalam bahasa yang kamu pelajari',
    // Sama seperti `sentence`: banyak jawaban benar, jadi transkrip dicocokkan
    // dulu — kalau beda, kamu yang menilai. Aksen non-penutur-asli sering salah
    // dikenali, dan menghukum jawaban benar karena itu jauh lebih merusak.
    grading: 'typed-self',
    inputMode: 'voice',
    needsMic: true,
    perLesson: 0, // diturunkan dari item `sentence`
    derived: true,
    schema: () =>
      z.object({
        source_id: z.string().min(1).describe('Kalimat bahasa Indonesia yang harus diucapkan'),
        target: z.string().min(1).describe('Kalimat acuan dalam bahasa target'),
      }),
    grader: (answer, f) => matchExact(answer, String(f.target ?? '')),
    dedupKey: (f) => key('speaking', String(f.source_id ?? '')),
    tags: () => ['skill:speaking'],
    aiHint: '', // tidak dipakai — item ini tidak digenerate AI
  },

  /* -------------------------------------------------------------- writing */
  writing: {
    label: 'Menulis',
    instruction: 'Tulis jawabanmu, nanti dikoreksi',
    grading: 'ai',
    perLesson: 4,
    schema: () =>
      z.object({
        prompt_id: z
          .string()
          .min(1)
          .describe('Instruksi menulis dalam bahasa Indonesia, konkret dan bisa dikerjakan'),
        guidance_id: z
          .string()
          .min(1)
          .describe('Satu kalimat: pola/kosakata apa yang sebaiknya dipakai'),
        min_words: z
          .number()
          .int()
          .min(10)
          .max(80)
          .describe('Jumlah kata minimal yang wajar untuk level ini'),
      }),
    dedupKey: (f) => key('writing', String(f.prompt_id ?? '')),
    tags: () => ['skill:writing'],
    aiHint:
      'Tugas menulis pendek yang bisa diselesaikan dalam 2–4 kalimat. Harus konkret ' +
      '("tulis 3 kalimat tentang rutinitas paginya"), bukan abstrak ("tulis tentang kebiasaan"). ' +
      'min_words disesuaikan level: pemula 20–30 kata, menengah 40–60.',
  },

  /* -------------------------------------------------------------- reading */
  reading: {
    label: 'Bacaan',
    instruction: 'Baca, lalu jawab',
    grading: 'choice',
    perLesson: 3,
    schema: () =>
      z.object({
        passage: z.string().min(1).describe('Bacaan 110–150 kata, gaya buku teks'),
        question: z.string().min(1).describe('Pertanyaan tentang isi bacaan'),
        options: z.array(z.string().min(1)).length(4).describe('Empat pilihan, urutan A B C D'),
        answer_index: z.number().int().min(0).max(3).describe('Indeks pilihan benar, 0 = A'),
        explanation_id: z
          .string()
          .min(1)
          .describe('Kenapa jawabannya itu, dengan menunjuk bagian bacaannya. Bahasa Indonesia.'),
        skill: z
          .enum(['gagasan utama', 'detail', 'rujukan', 'kosakata dalam konteks', 'simpulan'])
          .describe('Keterampilan baca yang diuji'),
      }),
    check: (f) => {
      const problems: string[] = []
      const opts = (f.options as string[] | undefined) ?? []
      if (new Set(opts.map((o) => o.trim().toLowerCase())).size !== opts.length) {
        problems.push('ada pilihan duplikat')
      }
      const words = String(f.passage ?? '').trim().split(/\s+/).length
      if (words < 60) problems.push(`bacaan cuma ${words} kata, terlalu pendek`)
      return problems
    },
    dedupKey: (f) => key('reading', String(f.question ?? '')),
    tags: (f) => ['skill:reading', ...(f.skill ? [`reading:${String(f.skill)}`] : [])],
    aiHint:
      'Satu bacaan dipakai untuk beberapa soal. Sebar keterampilan yang diuji: gagasan utama, ' +
      'detail tersurat, rujukan kata ganti, makna kosakata dalam konteks, dan simpulan. ' +
      'Semua soal harus terjawab HANYA dari bacaan itu, bukan dari pengetahuan umum.',
  },

  /* ------------------------------------------------------------ error_spot */
  error_spot: {
    label: 'Cari kesalahan',
    instruction: 'Bagian mana yang salah?',
    grading: 'choice',
    // Tidak digenerate langsung: item ini muncul dari soal simulasi yang kamu
    // salah jawab. Lihat lib/exam/to-items.ts.
    perLesson: 0,
    derived: true,
    schema: () =>
      z.object({
        sentence: z.string().min(1),
        options: z.array(z.string().min(1)).length(4),
        answer_index: z.number().int().min(0).max(3).describe('Indeks potongan yang SALAH'),
        explanation_id: z.string().min(1),
      }),
    dedupKey: (f) => key('error_spot', String(f.sentence ?? '')),
    tags: () => ['skill:grammar'],
    aiHint: '',
  },

  /* --------------------------------------------------------------- script */
  script: {
    label: 'Cara baca',
    instruction: 'Bagaimana bunyinya?',
    grading: 'typed',
    perLesson: 6,
    schema: () =>
      z.object({
        glyph: z.string().min(1).describe('Satu huruf atau suku kata dalam sistem tulisan target'),
        sound: z
          .string()
          .min(1)
          .describe('Bunyinya dalam romanisasi baku (Hepburn untuk Jepang, RR untuk Korea)'),
        example: z.string().min(1).describe('Satu kata yang memakai huruf ini'),
        example_meaning_id: z.string().min(1).describe('Arti kata contoh dalam bahasa Indonesia'),
      }),
    grader: (answer, f) => matchExact(answer, String(f.sound ?? '')),
    dedupKey: (f) => key('script', String(f.glyph ?? '')),
    tags: () => ['skill:reading'],
    aiHint:
      'Hanya huruf/suku kata dasar yang benar-benar ada di sistem tulisan itu. ' +
      'Romanisasi harus memakai standar baku, jangan mengarang ejaan sendiri.',
  },
}

export function getItemType(type: ItemType): ItemTypeDef {
  const def = ITEM_REGISTRY[type]
  if (!def) throw new Error(`Jenis item "${type}" belum diimplementasikan`)
  return def
}

export function implementedItemTypes(): ItemType[] {
  return (Object.keys(ITEM_REGISTRY) as ItemType[]).filter((t) => ITEM_REGISTRY[t] !== null)
}

/** Jenis yang digenerate AI saat penyiapan pelajaran (tanpa yang diturunkan) */
export function generatedItemTypes(template: FieldTemplate): ItemType[] {
  return template.itemTypes.filter((t) => {
    const def = ITEM_REGISTRY[t]
    return def !== null && !def.derived
  })
}

export { primaryKeyOf }
