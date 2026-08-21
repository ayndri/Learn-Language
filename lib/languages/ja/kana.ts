/**
 * KANA — hiragana & katakana, lengkap.
 *
 * Ditulis sebagai data karena inilah satu-satunya bagian bahasa Jepang yang
 * benar-benar TERTUTUP: jumlahnya tetap, tidak bertambah, dan bisa dihitung.
 * Kalau daftar ini diserahkan ke AI, yang hilang biasanya justru yang jarang
 * dipakai tapi tetap muncul di ujian — ゐ・ゑ sudah tidak dipakai (dan memang
 * tidak dimasukkan), tapi を, ん, づ, ぢ, dan seluruh baris 拗音 wajib ada.
 *
 * Romanisasi memakai Hepburn yang dimodifikasi — yang dipakai buku pelajaran
 * dan papan nama di Jepang: し=shi, ち=chi, つ=tsu, ふ=fu, じ=ji, を=o.
 *
 * Cakupannya bisa dihitung:
 *   清音 46 + 濁音/半濁音 25 + 拗音 33 = 104 per aksara × 2 = 208 tanda.
 */

export type Kana = {
  /** hiragana */
  h: string
  /** katakana */
  k: string
  /** bunyinya dalam Hepburn */
  romaji: string
}

/** 清音 — 46 tanda dasar */
export const GOJUON: Kana[] = [
  { h: 'あ', k: 'ア', romaji: 'a' }, { h: 'い', k: 'イ', romaji: 'i' },
  { h: 'う', k: 'ウ', romaji: 'u' }, { h: 'え', k: 'エ', romaji: 'e' },
  { h: 'お', k: 'オ', romaji: 'o' },

  { h: 'か', k: 'カ', romaji: 'ka' }, { h: 'き', k: 'キ', romaji: 'ki' },
  { h: 'く', k: 'ク', romaji: 'ku' }, { h: 'け', k: 'ケ', romaji: 'ke' },
  { h: 'こ', k: 'コ', romaji: 'ko' },

  { h: 'さ', k: 'サ', romaji: 'sa' }, { h: 'し', k: 'シ', romaji: 'shi' },
  { h: 'す', k: 'ス', romaji: 'su' }, { h: 'せ', k: 'セ', romaji: 'se' },
  { h: 'そ', k: 'ソ', romaji: 'so' },

  { h: 'た', k: 'タ', romaji: 'ta' }, { h: 'ち', k: 'チ', romaji: 'chi' },
  { h: 'つ', k: 'ツ', romaji: 'tsu' }, { h: 'て', k: 'テ', romaji: 'te' },
  { h: 'と', k: 'ト', romaji: 'to' },

  { h: 'な', k: 'ナ', romaji: 'na' }, { h: 'に', k: 'ニ', romaji: 'ni' },
  { h: 'ぬ', k: 'ヌ', romaji: 'nu' }, { h: 'ね', k: 'ネ', romaji: 'ne' },
  { h: 'の', k: 'ノ', romaji: 'no' },

  { h: 'は', k: 'ハ', romaji: 'ha' }, { h: 'ひ', k: 'ヒ', romaji: 'hi' },
  { h: 'ふ', k: 'フ', romaji: 'fu' }, { h: 'へ', k: 'ヘ', romaji: 'he' },
  { h: 'ほ', k: 'ホ', romaji: 'ho' },

  { h: 'ま', k: 'マ', romaji: 'ma' }, { h: 'み', k: 'ミ', romaji: 'mi' },
  { h: 'む', k: 'ム', romaji: 'mu' }, { h: 'め', k: 'メ', romaji: 'me' },
  { h: 'も', k: 'モ', romaji: 'mo' },

  { h: 'や', k: 'ヤ', romaji: 'ya' }, { h: 'ゆ', k: 'ユ', romaji: 'yu' },
  { h: 'よ', k: 'ヨ', romaji: 'yo' },

  { h: 'ら', k: 'ラ', romaji: 'ra' }, { h: 'り', k: 'リ', romaji: 'ri' },
  { h: 'る', k: 'ル', romaji: 'ru' }, { h: 'れ', k: 'レ', romaji: 're' },
  { h: 'ろ', k: 'ロ', romaji: 'ro' },

  { h: 'わ', k: 'ワ', romaji: 'wa' }, { h: 'を', k: 'ヲ', romaji: 'o' },
  { h: 'ん', k: 'ン', romaji: 'n' },
]

/** 濁音・半濁音 — 25 tanda bertanda dakuten/handakuten */
export const DAKUON: Kana[] = [
  { h: 'が', k: 'ガ', romaji: 'ga' }, { h: 'ぎ', k: 'ギ', romaji: 'gi' },
  { h: 'ぐ', k: 'グ', romaji: 'gu' }, { h: 'げ', k: 'ゲ', romaji: 'ge' },
  { h: 'ご', k: 'ゴ', romaji: 'go' },

  { h: 'ざ', k: 'ザ', romaji: 'za' }, { h: 'じ', k: 'ジ', romaji: 'ji' },
  { h: 'ず', k: 'ズ', romaji: 'zu' }, { h: 'ぜ', k: 'ゼ', romaji: 'ze' },
  { h: 'ぞ', k: 'ゾ', romaji: 'zo' },

  { h: 'だ', k: 'ダ', romaji: 'da' }, { h: 'ぢ', k: 'ヂ', romaji: 'ji' },
  { h: 'づ', k: 'ヅ', romaji: 'zu' }, { h: 'で', k: 'デ', romaji: 'de' },
  { h: 'ど', k: 'ド', romaji: 'do' },

  { h: 'ば', k: 'バ', romaji: 'ba' }, { h: 'び', k: 'ビ', romaji: 'bi' },
  { h: 'ぶ', k: 'ブ', romaji: 'bu' }, { h: 'べ', k: 'ベ', romaji: 'be' },
  { h: 'ぼ', k: 'ボ', romaji: 'bo' },

  { h: 'ぱ', k: 'パ', romaji: 'pa' }, { h: 'ぴ', k: 'ピ', romaji: 'pi' },
  { h: 'ぷ', k: 'プ', romaji: 'pu' }, { h: 'ぺ', k: 'ペ', romaji: 'pe' },
  { h: 'ぽ', k: 'ポ', romaji: 'po' },
]

/** 拗音 — 33 gabungan dengan ゃ・ゅ・ょ kecil */
export const YOON: Kana[] = [
  { h: 'きゃ', k: 'キャ', romaji: 'kya' }, { h: 'きゅ', k: 'キュ', romaji: 'kyu' },
  { h: 'きょ', k: 'キョ', romaji: 'kyo' },
  { h: 'しゃ', k: 'シャ', romaji: 'sha' }, { h: 'しゅ', k: 'シュ', romaji: 'shu' },
  { h: 'しょ', k: 'ショ', romaji: 'sho' },
  { h: 'ちゃ', k: 'チャ', romaji: 'cha' }, { h: 'ちゅ', k: 'チュ', romaji: 'chu' },
  { h: 'ちょ', k: 'チョ', romaji: 'cho' },
  { h: 'にゃ', k: 'ニャ', romaji: 'nya' }, { h: 'にゅ', k: 'ニュ', romaji: 'nyu' },
  { h: 'にょ', k: 'ニョ', romaji: 'nyo' },
  { h: 'ひゃ', k: 'ヒャ', romaji: 'hya' }, { h: 'ひゅ', k: 'ヒュ', romaji: 'hyu' },
  { h: 'ひょ', k: 'ヒョ', romaji: 'hyo' },
  { h: 'みゃ', k: 'ミャ', romaji: 'mya' }, { h: 'みゅ', k: 'ミュ', romaji: 'myu' },
  { h: 'みょ', k: 'ミョ', romaji: 'myo' },
  { h: 'りゃ', k: 'リャ', romaji: 'rya' }, { h: 'りゅ', k: 'リュ', romaji: 'ryu' },
  { h: 'りょ', k: 'リョ', romaji: 'ryo' },
  { h: 'ぎゃ', k: 'ギャ', romaji: 'gya' }, { h: 'ぎゅ', k: 'ギュ', romaji: 'gyu' },
  { h: 'ぎょ', k: 'ギョ', romaji: 'gyo' },
  { h: 'じゃ', k: 'ジャ', romaji: 'ja' }, { h: 'じゅ', k: 'ジュ', romaji: 'ju' },
  { h: 'じょ', k: 'ジョ', romaji: 'jo' },
  { h: 'びゃ', k: 'ビャ', romaji: 'bya' }, { h: 'びゅ', k: 'ビュ', romaji: 'byu' },
  { h: 'びょ', k: 'ビョ', romaji: 'byo' },
  { h: 'ぴゃ', k: 'ピャ', romaji: 'pya' }, { h: 'ぴゅ', k: 'ピュ', romaji: 'pyu' },
  { h: 'ぴょ', k: 'ピョ', romaji: 'pyo' },
]

export const ALL_KANA: Kana[] = [...GOJUON, ...DAKUON, ...YOON]

export type KanaLesson = {
  title: string
  /** 'hiragana' | 'katakana' */
  syllabary: 'hiragana' | 'katakana'
  /** entri "tanda (romaji)" — dikirim apa adanya ke generator item `script` */
  glyphs: string[]
  focus: string
  context: string
}

/**
 * Kana → daftar pelajaran.
 *
 * Hiragana lebih dulu sampai tuntas, baru katakana. Bukan selang-seling:
 * dua aksara yang mirip bentuknya kalau dipelajari bersamaan justru saling
 * mengacaukan (シ/ツ, ソ/ン sudah cukup menyusahkan tanpa ditambah ちらり).
 *
 * Baris 拗音 disatukan jadi satu pelajaran per aksara karena polanya seragam:
 * begitu paham き+ゃ=kya, sisanya mengikuti aturan yang sama.
 */
export function kanaLessons(): KanaLesson[] {
  const out: KanaLesson[] = []

  for (const syllabary of ['hiragana', 'katakana'] as const) {
    const label = syllabary === 'hiragana' ? 'Hiragana' : 'Katakana'
    const pick = (kana: Kana) =>
      `${syllabary === 'hiragana' ? kana.h : kana.k} (${kana.romaji})`

    // 清音 dipecah per 10 tanda — dua baris gojūon sekali duduk.
    for (let i = 0; i < GOJUON.length; i += 10) {
      const chunk = GOJUON.slice(i, i + 10)
      out.push({
        title: `${label} ${i / 10 + 1}`,
        syllabary,
        glyphs: chunk.map(pick),
        focus: `Membaca dan menulis ${label.toLowerCase()} ${chunk.map(pick).join(', ')}`,
        context: `mengenali tanda ${label.toLowerCase()} di kata sehari-hari`,
      })
    }

    out.push({
      title: `${label}: Dakuten`,
      syllabary,
      glyphs: DAKUON.map(pick),
      focus:
        `Tanda 濁点 (゛) dan 半濁点 (゜) pada ${label.toLowerCase()}: ` +
        `k→g, s→z, t→d, h→b, h→p. Termasuk ぢ/づ yang bunyinya sama dengan じ/ず.`,
      context: 'membaca kata yang memakai bunyi bersuara',
    })

    out.push({
      title: `${label}: Yōon`,
      syllabary,
      glyphs: YOON.map(pick),
      focus:
        `拗音: gabungan baris i + ゃ/ゅ/ょ kecil pada ${label.toLowerCase()}. ` +
        'Dibaca satu suku kata, bukan dua — きゃ = kya, bukan ki-ya.',
      context: 'membaca kata seperti 東京, 会社, dan 病院',
    })

    // Aturan tulis yang tidak berupa tanda, tapi wajib: 小さいつ, 長音, し/つ dsb.
    out.push({
      title: `${label}: Aturan Khusus`,
      syllabary,
      glyphs: [],
      focus:
        syllabary === 'hiragana'
          ? '促音 っ (konsonan rangkap: きって kitte), 長音 dengan おう/ええ, partikel は=wa, へ=e, を=o'
          : '長音 dengan garis ー (コーヒー), 促音 ッ, dan tanda gabungan khas serapan: ファ, ティ, ヴ, ウィ, ジェ',
      context:
        syllabary === 'hiragana'
          ? 'membaca kata yang bunyinya panjang atau berkonsonan rangkap'
          : 'membaca nama negara, merek, dan kata serapan',
    })
  }

  return out
}

export function totalKana(): number {
  return ALL_KANA.length * 2
}
