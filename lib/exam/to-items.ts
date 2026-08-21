import type { ExamQuestion } from '@/lib/db/schema'
import { getItemType } from '@/lib/items/registry'
import type { ItemType } from '@/lib/items/types'
import { normalizeAnswer } from '@/lib/items/text'

/**
 * Soal simulasi yang SALAH → item latihan harian.
 *
 * Ini yang menutup lingkarannya. Tanpa ini, simulasi cuma mengukur: kamu salah
 * soal parallel structure, dapat skor, selesai. Dengan ini, kesalahanmu jadi
 * bahan latihan yang dijadwalkan FSRS sampai benar-benar nempel.
 *
 * Pemetaannya dipilih supaya latihannya LEBIH SULIT daripada soal aslinya —
 * kalau bisa, produksi mengalahkan pengenalan:
 *
 *   Structure          → `cloze`       kamu MENGETIK jawabannya, bukan memilih
 *                                      dari empat pilihan. Lubangnya sudah ada.
 *   Written Expression → `error_spot`  formatnya memang pilihan ganda; tidak ada
 *                                      cara produktif menirunya.
 *   Reading            → `reading`     bacaan + soal dibawa apa adanya.
 *   Listening          → `listening`   naskahnya jadi latihan dikte, bukan
 *                                      pilihan ganda. Melatih telinga lebih
 *                                      dalam daripada soal aslinya.
 *
 * JLPT mengikuti aturan yang sama:
 *
 *   文法形式・語形成・文脈規定 → `cloze`   lubangnya sudah ada di soalnya
 *   表記                      → `cloze`   kata bertanda 【】 dijadikan lubang,
 *                                        jawabannya kanji yang benar — ditulis,
 *                                        bukan dipilih
 *   漢字読み                   → `script`  kata kanji → ketik bacaannya
 *   読解・情報検索             → `reading` bacaan + soal apa adanya
 *   即時応答                   → `listening` satu kalimat, pas untuk dikte
 *
 * TOPIK mengikuti pola yang sama: 빈칸 채우기 → `cloze`, 지문 → `reading`,
 * 알맞은 대답 → `listening`, dan 쓰기 → `writing` — soal karangannya dibawa
 * utuh jadi tugas menulis harian yang dikoreksi AI. Itu satu-satunya jenis
 * yang dikonversi berdasarkan NILAI, bukan benar/salah: karangan yang dapat
 * 45 dari 50 tidak perlu diulang, yang dapat 12 perlu.
 *
 * DELE juga: uso de la lengua → `cloze`, comprensión de lectura → `reading`,
 * mensajes pendek → `listening`, expresión escrita → `writing`.
 *
 * HSK juga: 选词填空 → `cloze`, 阅读理解 → `reading`, 选择答语 → `listening`,
 * dan 书写 → `writing`. Satu yang perlu dijelaskan: 病句 TIDAK dipetakan ke
 * `error_spot` walaupun keduanya soal "cari yang salah". Bentuknya berbeda —
 * `error_spot` menyorot empat POTONGAN dari satu kalimat, sementara 病句
 * menyodorkan empat KALIMAT utuh dan salah satunya rusak. Memaksakannya akan
 * menghasilkan kartu yang menampilkan satu kalimat lalu meminta memilih di
 * antara empat kalimat lain yang tidak ada hubungannya dengan yang ditampilkan.
 *   sisanya                    → `quiz`    jaring terakhir; lihat catatan di
 *                                        registry. Lebih baik pilihan ganda
 *                                        daripada soal itu hilang.
 */

export type ConvertedItem = {
  type: ItemType
  fields: Record<string, unknown>
  tags: string[]
  dedupKey: string
}

/**
 * Samakan penanda lubang ke bentuk yang dipakai item cloze ("___").
 *
 * Empat gaya penanda harus ditangani: "______" (TOEFL), "＿＿＿" (JLPT, garis
 * bawah lebar), "（　）" (kurung lebar, lazim di soal Jepang), dan "( )" —
 * kurung biasa dengan SATU spasi, yang dipakai soal TOPIK 빈칸.
 *
 * Yang terakhir sempat terlewat: polanya menuntut dua spasi atau lebih, jadi
 * seluruh soal isian rumpang Korea gagal jadi cloze dan diam-diam turun jadi
 * pilihan ganda — kehilangan justru latihan mengetiknya.
 */
function normalizeBlank(stem: string): string {
  return stem
    .replace(/[＿_]{2,}/g, '___')
    .replace(/（\s*）/g, '___')
    .replace(/\(\s*\)/g, '___')
}

/** Isi tanda 【…】, dipakai soal 漢字読み dan 表記 untuk menyorot satu kata */
function marked(stem: string): string | null {
  return stem.match(/【(.+?)】/)?.[1]?.trim() ?? null
}

/**
 * Panjang teks, dihitung dengan cara yang benar untuk tulisannya.
 *
 * Menghitung "kata" dengan memisah spasi menghasilkan angka 1 untuk kalimat
 * Jepang mana pun — dan pembatas panjang jadi menolak semuanya. Kalau teksnya
 * tidak berspasi, yang dihitung karakternya.
 */
function lengthOf(text: string): { value: number; unit: 'word' | 'char' } {
  const trimmed = text.trim()
  const words = trimmed.split(/\s+/).length
  return words >= 3 ? { value: words, unit: 'word' } : { value: [...trimmed].length, unit: 'char' }
}

/** Naskah yang cukup pendek untuk ditulis ulang sebagai dikte */
function dictatable(text: string): boolean {
  const { value, unit } = lengthOf(text)
  return unit === 'word' ? value >= 4 && value <= 40 : value >= 6 && value <= 60
}

function quizItem(
  q: ExamQuestion,
  tags: string[],
  passage?: string,
): ConvertedItem {
  const fields = {
    question: q.stem,
    options: q.options,
    answer_index: q.answerIndex ?? 0,
    explanation_id: q.explanationId,
    ...(passage ? { passage } : {}),
  }
  return {
    type: 'quiz',
    fields,
    tags,
    dedupKey: getItemType('quiz').dedupKey(fields),
  }
}

export function examQuestionToItem(q: ExamQuestion): ConvertedItem | null {
  // Soal karangan tidak punya kunci jawaban — dibawa utuh jadi tugas menulis.
  if (q.answerIndex === null) return writingQuestionToItem(q)

  const answer = q.options[q.answerIndex]
  if (!answer) return null

  const grammarTag = q.grammarPoint
    ? [`grammar:${normalizeAnswer(q.grammarPoint)}`]
    : []
  const fromExam = ['from:exam']

  switch (q.type) {
    case 'structure': {
      const sentence = normalizeBlank(q.stem)
      // Tanpa lubang, cloze-nya tidak bisa dikerjakan.
      if (!sentence.includes('___')) return null
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'struktur kalimat',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    case 'written_expression': {
      const fields = {
        sentence: q.stem,
        options: q.options,
        answer_index: q.answerIndex,
        explanation_id: q.explanationId,
      }
      return {
        type: 'error_spot',
        fields,
        tags: [...grammarTag, ...fromExam, 'skill:grammar'],
        dedupKey: getItemType('error_spot').dedupKey(fields),
      }
    }

    // --- JLPT: soal berlubang → cloze, karena jawabannya diketik ---
    case 'grammar_form':
    case 'word_formation':
    case 'contextual': {
      const sentence = normalizeBlank(q.stem)
      if (!sentence.includes('___')) return quizItem(q, [...grammarTag, ...fromExam])
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'pola kalimat',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    // --- 表記: kata bertanda dijadikan lubang, jawabannya penulisan kanji ---
    case 'orthography': {
      const word = marked(q.stem)
      if (!word) return quizItem(q, [...fromExam, 'skill:kanji'])
      const sentence = q.stem.replace(/【.+?】/, '___')
      const fields = {
        sentence,
        answer,
        grammar_point: 'penulisan kanji',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...fromExam, 'skill:kanji'],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    // --- 漢字読み: kata kanji → ketik bacaannya ---
    case 'kanji_reading': {
      const word = marked(q.stem)
      if (!word) return quizItem(q, [...fromExam, 'skill:kanji'])
      const fields = {
        glyph: word,
        sound: answer,
        example: q.stem.replace(/【|】/g, ''),
        example_meaning_id: q.explanationId,
      }
      return {
        type: 'script',
        fields,
        tags: [...fromExam, 'skill:kanji'],
        dedupKey: getItemType('script').dedupKey(fields),
      }
    }

    // --- 即時応答: satu kalimat, panjangnya pas untuk dikte ---
    case 'listening_quick': {
      const script = q.audioScript
      if (!script || !dictatable(script)) {
        return script ? quizItem(q, [...fromExam, 'skill:listening'], script) : null
      }
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    // --- Menyimak JLPT lainnya: naskahnya terlalu panjang untuk dikte ---
    case 'listening_task':
    case 'listening_point':
    case 'listening_summary':
    case 'listening_utterance':
      return quizItem(q, [...fromExam, 'skill:listening'], q.audioScript ?? undefined)

    // --- TOPIK: isian rumpang → cloze, karena jawabannya diketik ---
    case 'ko_read_blank': {
      const sentence = normalizeBlank(q.stem)
      if (!sentence.includes('___')) return quizItem(q, [...grammarTag, ...fromExam])
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'pola kalimat',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    // --- TOPIK 듣기: naskah pendek jadi dikte, sisanya pilihan ganda ---
    case 'ko_listen_reply': {
      const script = q.audioScript
      if (!script || !dictatable(script)) {
        return script ? quizItem(q, [...fromExam, 'skill:listening'], script) : null
      }
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    case 'ko_listen_dialog':
    case 'ko_listen_talk':
      return quizItem(q, [...fromExam, 'skill:listening'], q.audioScript ?? undefined)

    case 'ko_read_topic':
    case 'ko_read_notice':
    case 'ko_read_order':
    case 'ko_read_insert':
      return quizItem(q, [...fromExam, 'skill:reading'])

    // --- HSK: 选词填空 → cloze, karena jawabannya diketik ---
    case 'zh_read_blank': {
      const sentence = normalizeBlank(q.stem)
      if (!sentence.includes('___')) return quizItem(q, [...grammarTag, ...fromExam])
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'pola kalimat',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    // --- HSK 听力: naskah pendek jadi dikte, sisanya pilihan ganda ---
    case 'zh_listen_reply':
    case 'zh_listen_judge': {
      const script = q.audioScript
      if (!script || !dictatable(script)) {
        return script ? quizItem(q, [...fromExam, 'skill:listening'], script) : null
      }
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    case 'zh_listen_dialog':
    case 'zh_listen_talk':
      return quizItem(q, [...fromExam, 'skill:listening'], q.audioScript ?? undefined)

    case 'zh_read_match':
    case 'zh_read_notice':
    case 'zh_read_order':
    case 'zh_read_insert':
      return quizItem(q, [...fromExam, 'skill:reading'])

    // 病句: bentuknya empat kalimat utuh, bukan empat potongan satu kalimat —
    // lihat catatan di atas. Dibawa apa adanya sebagai pilihan ganda.
    case 'zh_read_error':
      return quizItem(q, [...grammarTag, ...fromExam, 'skill:grammar'])

    // --- DELE: uso de la lengua → cloze, karena jawabannya diketik ---
    case 'es_read_blank': {
      const sentence = normalizeBlank(q.stem)
      if (!sentence.includes('___')) return quizItem(q, [...grammarTag, ...fromExam])
      const fields = {
        sentence,
        answer,
        grammar_point: q.grammarPoint ?? 'uso de la lengua',
        explanation_id: q.explanationId,
      }
      return {
        type: 'cloze',
        fields,
        tags: [...grammarTag, ...fromExam],
        dedupKey: getItemType('cloze').dedupKey(fields),
      }
    }

    // --- DELE comprensión auditiva: pesan pendek jadi dikte ---
    case 'es_listen_notice': {
      const script = q.audioScript
      if (!script || !dictatable(script)) {
        return script ? quizItem(q, [...fromExam, 'skill:listening'], script) : null
      }
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    case 'es_listen_short':
    case 'es_listen_talk':
      return quizItem(q, [...fromExam, 'skill:listening'], q.audioScript ?? undefined)

    case 'es_read_match':
    case 'es_read_notice':
      return quizItem(q, [...fromExam, 'skill:reading'])

    // --- Sisanya tetap pilihan ganda, tapi tidak hilang ---
    case 'paraphrase':
    case 'usage':
      return quizItem(q, [...fromExam, 'skill:vocab'])

    case 'sentence_composition':
      return quizItem(q, [...grammarTag, ...fromExam, 'skill:grammar'])

    case 'reading':
    case 'reading_short':
    case 'reading_mid':
    case 'reading_long':
    case 'info_search':
    case 'text_grammar':
    case 'ko_read_passage':
    case 'zh_read_passage':
    case 'es_read_passage': {
      // Bacaannya ada di exam_groups, jadi pemanggil harus menyuntikkannya.
      // Ditangani di `readingQuestionToItem`.
      return null
    }

    case 'listening_short':
    case 'listening_long':
    case 'listening_talk': {
      const script = q.audioScript
      if (!script) return null
      // Dikte dari naskah percakapan pendek saja. Ceramah dan percakapan panjang
      // terlalu panjang untuk ditulis ulang — itu jadi menghukum, bukan melatih.
      const words = script.trim().split(/\s+/).length
      if (words < 4 || words > 40) return null
      const fields = { text: script, translation_id: q.explanationId }
      return {
        type: 'listening',
        fields,
        tags: [...fromExam, 'skill:listening'],
        dedupKey: getItemType('listening').dedupKey(fields),
      }
    }

    default:
      return null
  }
}

/**
 * Soal karangan (TOPIK 쓰기, HSK 书写, DELE expresión escrita) → tugas menulis
 * harian.
 *
 * Soalnya dibawa apa adanya, termasuk seluruh instruksi dalam bahasa targetnya,
 * karena di ujian pun bunyinya begitu. `guidance_id` diisi dari penjelasan soal — yang
 * pada soal karangan memang berisi "apa yang dinilai", bukan kunci jawaban.
 *
 * Panjang minimalnya diturunkan dari bobot nilai: soal 10 poin itu melengkapi
 * kalimat, soal 50 poin itu esai. Ini perkiraan kasar, tapi lebih baik daripada
 * satu angka yang sama untuk keduanya.
 */
function writingQuestionToItem(q: ExamQuestion): ConvertedItem | null {
  const prompt = q.stem.trim()
  if (!prompt) return null

  const max = q.maxScore ?? 10
  const minWords = max >= 50 ? 80 : max >= 30 ? 50 : 15

  const fields = {
    prompt_id: prompt,
    guidance_id: q.explanationId,
    // Batas atas 80 mengikuti schema item `writing`. Untuk bahasa Korea dan
    // Mandarin satuan resminya karakter, bukan kata — tapi kartu latihannya
    // memakai kata, dan memaksakan 700 di situ cuma akan membuat
    // penghitungnya bohong. Untuk DELE satuannya memang kata, jadi angkanya
    // langsung berarti.
    min_words: Math.min(80, minWords),
  }

  return {
    type: 'writing',
    fields,
    tags: ['from:exam', 'skill:writing'],
    dedupKey: getItemType('writing').dedupKey(fields),
  }
}

/** Jenis soal yang bahan bacaannya tersimpan terpisah di `exam_groups` */
export const GROUPED_TYPES = [
  'reading',
  'reading_short',
  'reading_mid',
  'reading_long',
  'info_search',
  'text_grammar',
  'ko_read_passage',
  'zh_read_passage',
  'es_read_passage',
]

/** Soal berbacaan butuh teksnya, yang tersimpan di `exam_groups` */
export function readingQuestionToItem(
  q: ExamQuestion,
  passage: string,
): ConvertedItem | null {
  if (!GROUPED_TYPES.includes(q.type) || !passage) return null
  if (q.answerIndex === null) return null

  const fields = {
    passage,
    question: q.stem,
    options: q.options,
    answer_index: q.answerIndex ?? 0,
    explanation_id: q.explanationId,
  }

  // Item `reading` menuntut tepat empat pilihan. 文章の文法 selalu empat, tapi
  // kalau suatu saat ada yang tiga, jangan bikin kartu yang gagal divalidasi —
  // turunkan saja jadi `quiz` yang menerima 2–4 pilihan.
  if (q.options.length !== 4) {
    return quizItem(q, ['from:exam', 'skill:reading'], passage)
  }

  return {
    type: 'reading',
    fields,
    tags: ['from:exam', 'skill:reading'],
    dedupKey: getItemType('reading').dedupKey(fields),
  }
}
