/**
 * Uji asap generator AI — panggilan SUNGGUHAN ke penyedia AI.
 *
 *   npm run ai:smoke            semua
 *   npm run ai:smoke -- jlpt    hanya yang cocok kata kunci
 *
 * Kenapa ada: seluruh generator soal (JLPT lima level, TOPIK I/II, HSK 1–6,
 * DELE A1–C2, kanji, hanzi, kana, hangul, bunyi, penilaian karangan) lolos typecheck
 * dan pemeriksa internal — tapi itu tidak membuktikan apa pun tentang keluaran
 * AI-nya. Yang benar-benar sering rusak justru hal yang tidak bisa dilihat dari
 * tipe: pilihan 漢字読み yang berisi kanji, urutan 文の組み立て yang bukan
 * permutasi, soal 순서 배열 tanpa penanda (가)(나)(다)(라), atau pinyin yang
 * datang sebagai "hao3" alih-alih "hǎo".
 *
 * Jumlah soal per panggilan sengaja kecil (1–3). Ini pemeriksa kesehatan,
 * bukan penghasil bahan — dan kuota free tier tidak gratis-gratis amat.
 */
import { generateExamBlock } from '@/lib/ai/exam'
import { gradeKoreanWriting } from '@/lib/ai/exam-ko'
import { gradeChineseWriting } from '@/lib/ai/exam-zh'
import { gradeSpanishWriting } from '@/lib/ai/exam-es'
import { generateItems } from '@/lib/ai/items'
import { blueprint } from '@/lib/exam/blueprint'
import type { BlockType } from '@/lib/exam/formats'
import type { FieldTemplate } from '@/lib/languages/types'

const filter = process.argv[2]?.toLowerCase()

type Case = { name: string; run: () => Promise<string> }

/** Ambil satu blok dari cetak biru, lalu perkecil jumlah soalnya. */
function block(kind: string, type: BlockType, count: number) {
  const found = blueprint(kind, 'full').find((b) => b.type === type)
  if (!found) throw new Error(`blok ${type} tidak ada di ${kind}`)
  return found.groups === 0
    ? { ...found, perGroup: count }
    : { ...found, groups: 1, perGroup: count }
}

async function exam(kind: string, type: BlockType, count: number): Promise<string> {
  const r = await generateExamBlock(kind, block(kind, type, count))
  const made = r.standalone.length + r.groups.reduce((a, g) => a + g.questions.length, 0)
  const sample =
    r.standalone[0]?.stem ?? r.groups[0]?.questions[0]?.stem ?? '(tidak ada yang lolos)'
  const lines = [`${made} lolos, ${r.rejected.length} ditolak`]
  if (r.rejected.length) lines.push(`   ditolak: ${r.rejected.join(' | ').slice(0, 220)}`)
  lines.push(`   contoh: ${sample.replace(/\n/g, ' ⏎ ').slice(0, 150)}`)
  return lines.join('\n')
}

const JA_TEMPLATE: FieldTemplate = {
  vocab: [
    { key: 'term', label: 'Kanji/Kana', primary: true, required: true },
    { key: 'reading', label: 'Bacaan', required: true },
    { key: 'meaning_id', label: 'Arti', required: true },
    { key: 'example', label: 'Contoh', required: true },
    { key: 'example_id', label: 'Terjemahan', required: true },
  ],
  levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
  itemTypes: ['vocab', 'kanji', 'script'],
}

const ZH_TEMPLATE: FieldTemplate = {
  vocab: [
    { key: 'term', label: 'Hanzi', primary: true, required: true },
    { key: 'pinyin', label: 'Pinyin', required: true },
    { key: 'meaning_id', label: 'Arti', required: true },
    { key: 'example', label: 'Contoh', required: true },
    { key: 'example_id', label: 'Terjemahan', required: true },
  ],
  levels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
  itemTypes: ['vocab', 'hanzi'],
}

const EN_TEMPLATE: FieldTemplate = {
  vocab: [{ key: 'term', label: 'Word', primary: true, required: true }],
  levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  itemTypes: ['vocab', 'sound'],
}

async function items(args: {
  languageName: string
  nativeName: string
  template: FieldTemplate
  type: 'kanji' | 'hanzi' | 'script' | 'sound'
  topic: string
  level: string
  focus: string
  words: string[]
}): Promise<string> {
  const r = await generateItems({ ...args, count: args.words.length, existingKeys: new Set() })
  const lines = [`${r.accepted.length} lolos, ${r.rejected.length} ditolak`]
  if (r.rejected.length) {
    lines.push(`   ditolak: ${r.rejected.map((x) => `${x.preview}: ${x.reason}`).join(' | ').slice(0, 220)}`)
  }
  const f = r.accepted[0]?.fields
  if (f) lines.push(`   contoh: ${JSON.stringify(f).slice(0, 200)}`)
  return lines.join('\n')
}

const CASES: Case[] = [
  // --- JLPT: bentuk soal yang paling khas dan paling mudah meleset ---
  { name: 'jlpt · 漢字読み', run: () => exam('jlpt_n4', 'kanji_reading', 3) },
  { name: 'jlpt · 用法', run: () => exam('jlpt_n2', 'usage', 2) },
  { name: 'jlpt · 文の組み立て', run: () => exam('jlpt_n3', 'sentence_composition', 2) },
  { name: 'jlpt · 文章の文法', run: () => exam('jlpt_n3', 'text_grammar', 3) },
  { name: 'jlpt · 即時応答 (3 pilihan)', run: () => exam('jlpt_n2', 'listening_quick', 2) },

  // --- TOPIK: penanda khusus (가)(나)(다)(라) dan ㉠㉡㉢㉣ ---
  { name: 'topik · 순서 배열', run: () => exam('topik_i', 'ko_read_order', 2) },
  { name: 'topik · 문장 삽입', run: () => exam('topik_ii', 'ko_read_insert', 2) },
  { name: 'topik · 듣기 대화', run: () => exam('topik_i', 'ko_listen_dialog', 2) },
  { name: 'topik · 쓰기 54번', run: () => exam('topik_ii', 'ko_write_essay', 1) },

  // --- HSK: dua pilihan (判断对错), empat kalimat utuh (病句), penanda A B C ---
  { name: 'hsk · 判断对错 (2 pilihan)', run: () => exam('hsk_2', 'zh_listen_judge', 2) },
  { name: 'hsk · 选词填空', run: () => exam('hsk_3', 'zh_read_blank', 3) },
  { name: 'hsk · 排列顺序', run: () => exam('hsk_4', 'zh_read_order', 2) },
  { name: 'hsk · 病句', run: () => exam('hsk_6', 'zh_read_error', 2) },
  { name: 'hsk · 听力 对话', run: () => exam('hsk_4', 'zh_listen_dialog', 2) },
  { name: 'hsk · 书写 完成句子', run: () => exam('hsk_4', 'zh_write_sentence', 2) },
  { name: 'hsk · 书写 缩写', run: () => exam('hsk_6', 'zh_write_summary', 1) },

  // --- DELE: aksen, ¿¡, dan ragam wilayah yang harus konsisten ---
  { name: 'dele · uso de la lengua', run: () => exam('dele_b2', 'es_read_blank', 3) },
  { name: 'dele · anuncios', run: () => exam('dele_a1', 'es_read_notice', 2) },
  { name: 'dele · diálogos', run: () => exam('dele_b1', 'es_listen_short', 2) },
  // Ditambahkan setelah jenis ini lolos DIAM-DIAM tanpa naskah audio.
  { name: 'dele · mensajes', run: () => exam('dele_a2', 'es_listen_notice', 2) },
  { name: 'dele · audios largos', run: () => exam('dele_c1', 'es_listen_talk', 3) },
  { name: 'dele · redacción', run: () => exam('dele_b2', 'es_write_essay', 1) },

  // --- jenis item baru ---
  {
    name: 'item · kanji',
    run: () =>
      items({
        languageName: 'Jepang',
        nativeName: '日本語',
        template: JA_TEMPLATE,
        type: 'kanji',
        topic: 'kanji N5',
        level: 'N5',
        focus: 'Menguasai kanji berikut beserta 音読み dan 訓読み: 日 月 山',
        words: ['日', '月', '山'],
      }),
  },
  {
    name: 'item · hanzi',
    run: () =>
      items({
        languageName: 'Mandarin',
        nativeName: '中文',
        template: ZH_TEMPLATE,
        type: 'hanzi',
        topic: 'hanzi HSK1',
        level: 'HSK1',
        focus: 'Menguasai karakter berikut beserta pinyin, 部首, dan kata contohnya: 好 学 生',
        words: ['好', '学', '生'],
      }),
  },
  {
    name: 'item · script (hangul)',
    run: () =>
      items({
        languageName: 'Korea',
        nativeName: '한국어',
        template: { ...JA_TEMPLATE, levels: ['1급'], itemTypes: ['script'] },
        type: 'script',
        topic: 'hangul dasar',
        level: '1급',
        focus: 'Vokal dasar hangul: ㅏ (a), ㅓ (eo), ㅗ (o)',
        words: ['ㅏ (a)', 'ㅓ (eo)', 'ㅗ (o)'],
      }),
  },
  {
    name: 'item · sound (IPA Inggris)',
    run: () =>
      items({
        languageName: 'Inggris',
        nativeName: 'English',
        template: EN_TEMPLATE,
        type: 'sound',
        topic: 'vokal pendek',
        level: 'A1',
        focus: 'Bunyi /ɪ/ sit, /æ/ cat, /ʌ/ cup',
        words: ['/ɪ/ sit', '/æ/ cat', '/ʌ/ cup'],
      }),
  },

  // --- penilaian karangan ---
  {
    name: 'nilai · 쓰기 (jawaban bagus)',
    run: async () => {
      const r = await gradeKoreanWriting({
        prompt: '다음을 주제로 하여 자신의 생각을 쓰십시오. "인터넷이 우리 생활에 미친 영향"',
        guidance: 'Menulis 600–700자 dalam 문어체, menjawab seluruh pertanyaan panduan.',
        answer:
          '인터넷은 현대 사회에서 없어서는 안 될 존재가 되었다. 우선 인터넷은 정보를 얻는 방식을 완전히 바꾸었다. ' +
          '과거에는 도서관에 가야 했지만 지금은 몇 초 만에 원하는 자료를 찾을 수 있다. 또한 인터넷은 사람들 사이의 ' +
          '거리를 좁혔다. 멀리 떨어진 가족이나 친구와도 실시간으로 연락할 수 있게 되었기 때문이다. 그러나 부정적인 ' +
          '영향도 무시할 수 없다. 잘못된 정보가 빠르게 퍼지고, 사람들이 직접 만나는 시간은 오히려 줄어들었다. ' +
          '따라서 인터넷을 어떻게 사용하는지가 중요하다고 생각한다.',
        maxScore: 50,
      })
      return `${r.score}/50 — ${r.feedback.slice(0, 200)}`
    },
  },
  {
    name: 'nilai · 书写 缩写 (jawaban ringkas)',
    run: async () => {
      const r = await gradeChineseWriting({
        prompt:
          '请把下面的故事缩写成一篇400字左右的短文，并自己拟一个题目。不要写自己的看法。',
        guidance: 'Meringkas cerita jadi ±400 karakter, memakai kalimat sendiri, tanpa pendapat pribadi.',
        answer:
          '一位年轻人常常抱怨自己的生活不如别人。有一天，一位老人给了他一杯水，让他先放一把盐进去喝。' +
          '年轻人喝了以后觉得又咸又苦。老人又带他到湖边，让他放同样多的盐，然后再喝湖水。这一次，' +
          '年轻人说水是甜的。老人告诉他，痛苦就像那把盐，多少是一定的，可是尝到的味道取决于容器的大小。' +
          '从那以后，年轻人不再抱怨，而是努力把自己的心变成一个湖。',
        maxScore: 100,
      })
      return `${r.score}/100 — ${r.feedback.slice(0, 200)}`
    },
  },
  {
    name: 'nilai · expresión escrita (keformalan salah)',
    run: async () => {
      // Sengaja dibuat menjebak: tata bahasanya cukup rapi, tapi memakai `tú`
      // untuk surat resmi dan tidak menyebut semua yang diminta. Kalau nilai
      // adecuación-nya TIDAK jatuh, rubriknya tidak bekerja.
      const r = await gradeSpanishWriting({
        prompt:
          'Escriba una carta formal al director de una escuela de idiomas para solicitar información ' +
          'sobre un curso intensivo. Debe indicar: su nivel actual, las fechas que le interesan, ' +
          'el precio y si hay alojamiento. Entre 120 y 150 palabras.',
        guidance:
          'Surat formal (usted), menyebut keempat hal yang diminta, memakai sapaan dan penutup surat.',
        answer:
          'Hola director, ¿qué tal? Te escribo porque quiero hacer un curso de español en tu escuela. ' +
          'Ahora mismo tengo un nivel intermedio, más o menos B1, y me gustaría empezar en julio. ' +
          'Quiero saber cuánto cuesta el curso. Espero tu respuesta pronto. Un abrazo, Dewi.',
        maxScore: 12,
      })
      return `${r.score}/12 — ${r.feedback.slice(0, 220)}`
    },
  },
  {
    name: 'nilai · 쓰기 (jawaban kosong)',
    run: async () => {
      const r = await gradeKoreanWriting({
        prompt: '다음을 주제로 하여 자신의 생각을 쓰십시오.',
        guidance: 'Menulis 600–700자 dalam 문어체.',
        answer: '나는 인터넷 좋아요.',
        maxScore: 50,
      })
      return `${r.score}/50 — ${r.feedback.slice(0, 160)}`
    },
  },
]

async function main() {
  const picked = filter ? CASES.filter((c) => c.name.toLowerCase().includes(filter)) : CASES
  if (!picked.length) {
    console.log(`Tidak ada uji yang cocok "${filter}".`)
    return
  }

  let failed = 0
  for (const [i, c] of picked.entries()) {
    process.stdout.write(`\n[${i + 1}/${picked.length}] ${c.name}\n`)
    const started = Date.now()
    try {
      const out = await c.run()
      console.log(`   ✓ ${((Date.now() - started) / 1000).toFixed(1)}s · ${out}`)
    } catch (err) {
      failed++
      console.log(`   ✗ GAGAL: ${err instanceof Error ? err.message : err}`)
    }
    // Jeda supaya tidak menabrak batas request per menit di free tier.
    if (i < picked.length - 1) await new Promise((r) => setTimeout(r, 4000))
  }

  console.log(`\n${picked.length - failed}/${picked.length} generator jalan.`)
  if (failed) process.exitCode = 1
}

main().catch((err) => {
  console.error('✗ gagal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
