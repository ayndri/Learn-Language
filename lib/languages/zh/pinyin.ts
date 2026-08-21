/**
 * PINYIN DAN NADA — bagian "aksara" untuk bahasa Mandarin.
 *
 * Ini bagian yang paling sering disalahpahami saat menambahkan bahasa Mandarin
 * ke aplikasi yang sudah punya kana dan hangul. Kana dan hangul dilatih dengan
 * jenis item `script`: lihat hurufnya, KETIK bunyinya (き → "ki", 가 → "ga").
 * Pinyin tidak bisa begitu, karena pinyin ITU SENDIRI romanisasinya — memintamu
 * mengetik bunyi dari "zh" cuma menghasilkan jawaban "zh".
 *
 * Jadi bagian ini memakai jenis item `sound`, sama seperti bunyi bahasa Inggris:
 * lambangnya ditampilkan, kamu mengucapkannya, lalu membuka jawabannya dan
 * menilai sendiri. Pelafalan memang tidak bisa dinilai lewat teks.
 *
 * Dan untuk bahasa Mandarin ini bukan bagian yang bisa dilewati. Dua alasan:
 *
 *   NADA itu makna, bukan aksen. mā (妈 ibu), má (麻 rami), mǎ (马 kuda),
 *   mà (骂 memarahi) — empat kata berbeda dengan satu ejaan. Pelajar Indonesia
 *   yang mengabaikan nada tidak "beraksen"; ia mengucapkan kata lain.
 *
 *   PINYIN BUKAN dibaca seperti ejaan Indonesia. c = "ts", q = "ch" tipis,
 *   x = "sy" tipis, zh/ch/sh = lidah ditekuk, r bukan "r" Indonesia, dan ü
 *   tidak ada padanannya. Membaca pinyin dengan kebiasaan ejaan Indonesia
 *   menghasilkan bunyi yang tidak dikenali penutur asli sama sekali.
 *
 * Karakter Han-nya sendiri TIDAK di sini — itu jalur tersendiri, lihat
 * `lib/languages/zh/hanzi.ts`.
 */

export type PinyinLesson = {
  level: string
  title: string
  focus: string
  context: string
  /** entri yang dilatih sebagai kartu `sound`; kosong = biarkan AI memilih */
  glyphs?: string[]
}

/**
 * Pinyin → daftar pelajaran.
 *
 * Urutannya: NADA dulu, sebelum satu konsonan pun. Ini kebalikan dari cara
 * hampir semua buku menyusunnya, dan itu disengaja — pelajar yang menghafal
 * seratus suku kata dulu lalu "menambahkan nada nanti" akan menghabiskan
 * bertahun-tahun mencoba melepas kebiasaan mengucapkan tanpa nada. Nada bukan
 * hiasan di atas suku kata; ia bagian dari suku katanya.
 *
 * `beginner` dan `second` diisi dari daftar level bahasanya, bukan ditulis
 * "HSK1" — sama seperti hangul, supaya tetap benar kalau daftar levelnya berubah.
 */
export function pinyinLessons(beginner: string, second: string): PinyinLesson[] {
  return [
    {
      level: beginner,
      title: 'Empat Nada',
      focus:
        'Nada 1 (ā, tinggi rata), 2 (á, naik), 3 (ǎ, turun lalu naik), 4 (à, jatuh tegas), ' +
        'dan nada netral (a, ringan tanpa tekanan). Nada mengubah ARTI: mā 妈 ibu, má 麻 rami, ' +
        'mǎ 马 kuda, mà 骂 memarahi — satu ejaan, empat kata.',
      context: 'pondasi: tanpa ini seluruh kata yang kamu ucapkan bisa berarti hal lain',
      glyphs: ['mā (妈)', 'má (麻)', 'mǎ (马)', 'mà (骂)', 'bā (八)', 'bá (拔)', 'bǎ (把)', 'bà (爸)', 'ma (吗, netral)'],
    },
    {
      level: beginner,
      title: 'Perubahan Nada',
      focus:
        'Nada berubah saat kata bertemu kata (变调), dan yang berubah adalah BUNYINYA, bukan tulisannya: ' +
        'nada 3 + nada 3 → nada 2 + nada 3 (nǐ hǎo dibaca ní hǎo); 不 bù jadi bú di depan nada 4 ' +
        '(不是 bú shì); 一 yī jadi yì atau yí tergantung nada berikutnya (一个 yí ge, 一半 yí bàn).',
      context: 'kenapa 你好 yang kamu dengar tidak sama dengan yang tertulis',
      glyphs: ['nǐ hǎo → ní hǎo', 'hěn hǎo → hén hǎo', 'bù shì → bú shì', 'bù duō (tetap bù)', 'yī gè → yí gè', 'yī qiān (tetap yī)'],
    },
    {
      level: beginner,
      title: 'Konsonan Awal: b p m f d t n l',
      focus:
        'Delapan 声母 yang paling dekat dengan bahasa Indonesia — tapi b/d/g Mandarin TIDAK bersuara ' +
        'seperti b/d/g Indonesia: bedanya dengan p/t/k cuma ada-tidaknya hembusan udara. ' +
        'bā vs pā, dā vs tā: taruh tangan di depan mulut, yang berhembus itu p dan t.',
      context: 'suku kata pertama yang bisa kamu ucapkan',
      glyphs: ['b (八)', 'p (怕)', 'm (妈)', 'f (发)', 'd (大)', 't (他)', 'n (那)', 'l (来)'],
    },
    {
      level: beginner,
      title: 'Konsonan Awal: g k h dan j q x',
      focus:
        'g/k/h di belakang mulut (gē 哥, kě 可, hē 喝) — h Mandarin lebih kasar daripada h Indonesia, ' +
        'mendekati "kh". Lalu j/q/x, tiga bunyi yang TIDAK ada di bahasa Indonesia: lidah rata di ' +
        'langit-langit depan, mulut melebar. j ≈ "ci" tipis, q ≈ "chi" berhembus, x ≈ "si/syi" tipis. ' +
        'j/q/x hanya pernah diikuti i atau ü.',
      context: 'kata sehari-hari seperti 几, 请, 谢谢',
      glyphs: ['g (哥)', 'k (可)', 'h (喝)', 'j (鸡)', 'q (七)', 'x (西)'],
    },
    {
      level: beginner,
      title: 'Konsonan Awal: zh ch sh r dan z c s',
      focus:
        'Dua deret yang paling sering tertukar, dan bedanya cuma posisi lidah. ' +
        'zh/ch/sh/r: ujung lidah DITEKUK ke atas (卷舌) — zhōng 中, chī 吃, shū 书, rì 日; ' +
        'r Mandarin bukan getar seperti r Indonesia, tapi lebih dekat ke "zh" yang meleleh. ' +
        'z/c/s: lidah RATA di belakang gigi — zì 字, cài 菜, sān 三. Perhatikan c = "ts", ' +
        'bukan "k" dan bukan "c" Indonesia.',
      context: 'membedakan 四 sì dan 十 shí — kesalahan yang paling sering bikin salah paham angka',
      glyphs: ['zh (中)', 'ch (吃)', 'sh (书)', 'r (日)', 'z (字)', 'c (菜)', 's (三)'],
    },
    {
      level: beginner,
      title: 'Vokal Tunggal',
      focus:
        'Enam 韵母 dasar: a, o, e, i, u, ü. Yang menipu: e sendirian dibaca seperti "ə" (哥 gē), ' +
        'bukan "e" Indonesia; i setelah zh/ch/sh/r/z/c/s berubah jadi bunyi mendengung, bukan "i" ' +
        '(zhī, sì — bukan "zhi", "si"); dan ü adalah bunyi yang benar-benar tidak ada di bahasa ' +
        'Indonesia — bentuk mulut untuk "u" tapi lidah untuk "i" (女 nǚ).',
      context: 'inti tiap suku kata',
      glyphs: ['a (八)', 'o (我)', 'e (哥)', 'i (七)', 'i mendengung (四)', 'u (五)', 'ü (女)'],
    },
    {
      level: beginner,
      title: 'Vokal Gabungan',
      focus:
        'Vokal rangkap yang meluncur jadi satu suku kata: ai, ei, ao, ou, ia, ie, ua, uo, üe, ' +
        'iao, iou, uai, uei. Yang sering keliru: ie dibaca "ye" bukan "i-e" (谢 xiè), ' +
        'üe dibaca "yue" (月 yuè), dan uo setelah b/p/m/f ditulis o saja (我 wǒ vs 波 bō).',
      context: 'membaca kata dua suku kata seperti 谢谢, 学校, 会话',
      glyphs: ['ai (爱)', 'ei (给)', 'ao (好)', 'ou (口)', 'ie (谢)', 'uo (我)', 'üe (月)', 'iao (小)', 'uai (快)'],
    },
    {
      level: beginner,
      title: 'Akhiran Sengau',
      focus:
        'Pasangan -n dan -ng, dan bedanya nyata: an/ang, en/eng, in/ing, ian/iang, uan/uang, ' +
        'un/ün, ong/iong. -n ujung lidah menempel di langit-langit depan, -ng pangkal lidah naik ' +
        'dan mulut tetap terbuka. 三 sān bukan 桑 sāng, 很 hěn bukan 横 héng.',
      context: 'membedakan kata yang cuma beda di ujung suku katanya',
      glyphs: ['an (三)', 'ang (上)', 'en (很)', 'eng (冷)', 'in (今)', 'ing (听)', 'ong (中)', 'iang (想)', 'uan (完)'],
    },
    {
      level: beginner,
      title: 'Suku Kata Utuh dan Ejaan Baku',
      focus:
        'Aturan penulisan yang bukan soal bunyi, tapi wajib diketahui supaya bisa MENGETIK dan ' +
        'membaca kamus: i/u/ü yang berdiri sendiri ditulis yi/wu/yu (一 yī, 五 wǔ, 鱼 yú); ' +
        'ü kehilangan titiknya setelah j/q/x/y (居 jū, bukan jü) tapi TETAP bertitik setelah n/l ' +
        '(女 nǚ, 绿 lǜ); iou→iu, uei→ui, uen→un saat ada konsonan awal (六 liù, 会 huì, 论 lùn). ' +
        'Saat mengetik di HP/komputer, ü diketik sebagai v.',
      context: 'mengetik hanzi lewat pinyin dan mencari kata di kamus',
      glyphs: ['yī (一)', 'wǔ (五)', 'yú (鱼)', 'jū (居)', 'nǚ (女, v di papan ketik)', 'liù (六)', 'huì (会)'],
    },
    {
      level: second,
      title: 'Nada Netral dan Tekanan Kata',
      focus:
        'Suku kata bernada netral (轻声): partikel 的·了·吗·呢·吧, suku kata kedua pada kata ulang ' +
        '(妈妈 māma, 爸爸 bàba, 谢谢 xièxie), dan akhiran 子·头 (桌子 zhuōzi). Netral bukan berarti ' +
        '"tanpa nada" — ia pendek, ringan, dan tingginya mengikuti suku kata sebelumnya.',
      context: 'membuat kalimat terdengar wajar, bukan seperti robot bernada empat semua',
      glyphs: ['de (的)', 'le (了)', 'ma (吗)', 'ne (呢)', 'ba (吧)', 'māma (妈妈)', 'xièxie (谢谢)', 'zhuōzi (桌子)'],
    },
    {
      level: second,
      title: 'Erhua dan Ragam Lisan',
      focus:
        '儿化 — akhiran 儿 yang melebur ke suku kata sebelumnya dan mengubah bunyinya: ' +
        '这儿 zhèr, 一点儿 yìdiǎnr, 玩儿 wánr. Lazim di Beijing dan di soal 听力, hampir tidak ada ' +
        'di Mandarin Taiwan dan Singapura. Termasuk juga penyingkatan lisan yang tidak ada di ' +
        'buku: 不知道 → 不知道 bùzhīdào yang meluncur jadi "bùzhdào".',
      context: 'memahami rekaman 听力 dan percakapan penutur asli',
      glyphs: ['zhèr (这儿)', 'nàr (那儿)', 'yìdiǎnr (一点儿)', 'wánr (玩儿)', 'shìr (事儿)', 'huír (回儿)'],
    },
  ]
}

export function totalPinyinEntries(): number {
  return pinyinLessons('a', 'b').reduce((a, l) => a + (l.glyphs?.length ?? 0), 0)
}
