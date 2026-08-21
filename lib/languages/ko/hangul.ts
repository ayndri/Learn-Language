/**
 * HANGUL — aksara Korea, lengkap.
 *
 * Sama seperti kana, ini bagian bahasa Korea yang benar-benar TERTUTUP:
 * jumlahnya tetap dan bisa dihitung. 19 konsonan, 21 vokal, 27 받침. Selesai.
 *
 * Tapi ada satu hal yang membuat hangul TIDAK sama dengan kana, dan itu yang
 * paling sering membuat pelajar merasa "sudah hafal hurufnya tapi tetap tidak
 * bisa membaca": **aturan bunyi**. 좋아요 ditulis dengan ㅎ tapi dibaca
 * [조아요]; 한국말 dibaca [한궁말]; 같이 dibaca [가치]. Hafal 40 huruf tidak
 * cukup — tujuh aturan perubahan bunyi harus ikut dipelajari, dan itu bagian
 * kedua file ini.
 *
 * Romanisasi memakai **Revised Romanization (RR)**, standar resmi pemerintah
 * Korea sejak 2000 — yang dipakai di papan jalan dan paspor. Bukan McCune–
 * Reischauer (yang menulis 부산 sebagai "Pusan"), supaya cocok dengan apa yang
 * kamu lihat di Korea.
 */

export type Jamo = {
  /** hurufnya */
  letter: string
  /** bunyinya dalam RR */
  rr: string
  /** catatan singkat kalau ada yang mudah keliru */
  note?: string
}

/** 기본 자음 — 14 konsonan dasar */
export const CONSONANTS: Jamo[] = [
  { letter: 'ㄱ', rr: 'g / k', note: 'k di akhir suku kata' },
  { letter: 'ㄴ', rr: 'n' },
  { letter: 'ㄷ', rr: 'd / t', note: 't di akhir suku kata' },
  { letter: 'ㄹ', rr: 'r / l', note: 'r di awal, l di akhir' },
  { letter: 'ㅁ', rr: 'm' },
  { letter: 'ㅂ', rr: 'b / p', note: 'p di akhir suku kata' },
  { letter: 'ㅅ', rr: 's' },
  { letter: 'ㅇ', rr: '- / ng', note: 'diam di awal, ng di akhir' },
  { letter: 'ㅈ', rr: 'j' },
  { letter: 'ㅊ', rr: 'ch', note: 'ㅈ beraspirasi' },
  { letter: 'ㅋ', rr: 'k', note: 'ㄱ beraspirasi' },
  { letter: 'ㅌ', rr: 't', note: 'ㄷ beraspirasi' },
  { letter: 'ㅍ', rr: 'p', note: 'ㅂ beraspirasi' },
  { letter: 'ㅎ', rr: 'h' },
]

/** 쌍자음 — 5 konsonan rangkap, diucapkan tegang tanpa hembusan */
export const TENSE_CONSONANTS: Jamo[] = [
  { letter: 'ㄲ', rr: 'kk' },
  { letter: 'ㄸ', rr: 'tt' },
  { letter: 'ㅃ', rr: 'pp' },
  { letter: 'ㅆ', rr: 'ss' },
  { letter: 'ㅉ', rr: 'jj' },
]

/** 기본 모음 — 10 vokal dasar */
export const VOWELS: Jamo[] = [
  { letter: 'ㅏ', rr: 'a' },
  { letter: 'ㅑ', rr: 'ya' },
  { letter: 'ㅓ', rr: 'eo', note: 'bukan "o" — mulut lebih terbuka' },
  { letter: 'ㅕ', rr: 'yeo' },
  { letter: 'ㅗ', rr: 'o', note: 'bibir bulat' },
  { letter: 'ㅛ', rr: 'yo' },
  { letter: 'ㅜ', rr: 'u' },
  { letter: 'ㅠ', rr: 'yu' },
  { letter: 'ㅡ', rr: 'eu', note: 'bibir melebar, bukan "u"' },
  { letter: 'ㅣ', rr: 'i' },
]

/** 복합 모음 — 11 vokal gabungan */
export const COMPOUND_VOWELS: Jamo[] = [
  { letter: 'ㅐ', rr: 'ae' },
  { letter: 'ㅒ', rr: 'yae' },
  { letter: 'ㅔ', rr: 'e', note: 'nyaris sama dengan ㅐ di Korea modern' },
  { letter: 'ㅖ', rr: 'ye' },
  { letter: 'ㅘ', rr: 'wa' },
  { letter: 'ㅙ', rr: 'wae' },
  { letter: 'ㅚ', rr: 'oe', note: 'dibaca seperti "we"' },
  { letter: 'ㅝ', rr: 'wo' },
  { letter: 'ㅞ', rr: 'we' },
  { letter: 'ㅟ', rr: 'wi' },
  { letter: 'ㅢ', rr: 'ui', note: 'dibaca "i" setelah konsonan, "e" pada 의 = milik' },
]

/**
 * 받침 — konsonan penutup suku kata.
 *
 * 27 bentuk tertulis, tapi hanya **7 bunyi**: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ.
 * Itulah kenapa 낫, 낮, 낯, 낱 semuanya dibaca [낟]. Yang ditulis di sini
 * bunyinya, karena itu yang menentukan kamu salah dengar atau tidak.
 */
export const BATCHIM: Jamo[] = [
  { letter: 'ㄱ', rr: 'k', note: 'juga ㅋ, ㄲ, ㄳ, ㄺ' },
  { letter: 'ㄴ', rr: 'n', note: 'juga ㄵ, ㄶ' },
  { letter: 'ㄷ', rr: 't', note: 'juga ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ' },
  { letter: 'ㄹ', rr: 'l', note: 'juga ㄼ, ㄽ, ㄾ, ㅀ' },
  { letter: 'ㅁ', rr: 'm', note: 'juga ㄻ' },
  { letter: 'ㅂ', rr: 'p', note: 'juga ㅍ, ㅄ, ㄿ' },
  { letter: 'ㅇ', rr: 'ng' },
]

export type HangulLesson = {
  level: string
  title: string
  focus: string
  context: string
  /** entri "huruf (rr)" — dikirim apa adanya ke generator item `script` */
  glyphs?: string[]
}

const entry = (j: Jamo) => `${j.letter} (${j.rr})`

/**
 * Hangul → daftar pelajaran.
 *
 * Urutannya mengikuti cara hangul benar-benar dipakai: vokal dulu (karena
 * setiap suku kata wajib punya vokal), lalu konsonan, lalu cara merakitnya jadi
 * blok suku kata, baru 받침 dan aturan bunyi. Menghafal 40 huruf tanpa tahu
 * cara merakitnya membuat kamu hafal huruf yang tidak bisa dibaca.
 */
export function hangulLessons(beginner: string, second: string): HangulLesson[] {
  return [
    {
      level: beginner,
      title: 'Vokal Dasar',
      focus: `10 vokal dasar: ${VOWELS.map(entry).join(', ')} — perhatikan ㅓ (eo) yang bukan "o", dan ㅡ (eu) yang bukan "u"`,
      context: 'pondasi: tiap suku kata Korea wajib punya vokal',
      glyphs: VOWELS.map(entry),
    },
    {
      level: beginner,
      title: 'Konsonan Dasar 1',
      focus: `7 konsonan pertama: ${CONSONANTS.slice(0, 7).map(entry).join(', ')}`,
      context: 'membaca suku kata sederhana seperti 가, 나, 다',
      glyphs: CONSONANTS.slice(0, 7).map(entry),
    },
    {
      level: beginner,
      title: 'Konsonan Dasar 2',
      focus: `7 konsonan berikutnya: ${CONSONANTS.slice(7).map(entry).join(', ')} — termasuk ㅇ yang DIAM di awal suku kata`,
      context: 'membaca 아, 자, 하 dan kawan-kawannya',
      glyphs: CONSONANTS.slice(7).map(entry),
    },
    {
      level: beginner,
      title: 'Merakit Suku Kata',
      focus:
        'Aturan blok: konsonan + vokal disusun kiri-kanan untuk vokal tegak (가, 미) dan atas-bawah ' +
        'untuk vokal datar (고, 누). Setiap blok = satu suku kata, dan setiap suku kata wajib diawali konsonan — ' +
        'kalau tidak ada, ㅇ dipakai sebagai pengisi kosong.',
      context: 'membaca kata utuh pertama kali',
    },
    {
      level: beginner,
      title: 'Vokal Gabungan',
      focus: `11 vokal gabungan: ${COMPOUND_VOWELS.map(entry).join(', ')} — ㅐ dan ㅔ praktis sama bunyinya bagi penutur muda`,
      context: 'membaca 개, 네, 과, 위',
      glyphs: COMPOUND_VOWELS.map(entry),
    },
    {
      level: beginner,
      title: 'Konsonan Rangkap',
      focus: `5 쌍자음: ${TENSE_CONSONANTS.map(entry).join(', ')} — diucapkan TEGANG dan tanpa hembusan udara, beda dengan ㅋㅌㅍㅊ yang justru berhembus`,
      context: 'membedakan 자 / 차 / 짜 dan 방 / 팡 / 빵',
      glyphs: TENSE_CONSONANTS.map(entry),
    },
    {
      level: beginner,
      title: 'Batchim: Tujuh Bunyi',
      focus: `받침 punya 27 bentuk tulisan tapi hanya 7 bunyi: ${BATCHIM.map(entry).join(', ')}. Itu sebabnya 낫, 낮, 낯, 낱 semuanya dibaca [낟].`,
      context: 'membaca suku kata bertutup',
      glyphs: BATCHIM.map(entry),
    },
    {
      level: beginner,
      title: 'Batchim Ganda',
      focus:
        '겹받침 (ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㅄ, ㅀ): hanya SATU dari dua huruf yang dibunyikan. ' +
        '값 → [갑], 앉다 → [안따], 읽다 → [익따] tapi 읽어요 → [일거요].',
      context: 'kata sehari-hari yang ejaannya menipu',
    },
    {
      level: beginner,
      title: 'Aturan Bunyi: Penyambungan',
      focus:
        '연음 (liaison) — 받침 pindah ke suku kata berikutnya kalau diawali ㅇ: ' +
        '한국어 → [한구거], 음악 → [으막], 밥을 → [바블]. Ini aturan yang paling sering dipakai.',
      context: 'kenapa tulisan dan bunyi terasa tidak cocok',
    },
    {
      level: second,
      title: 'Aturan Bunyi: Sengau',
      focus:
        '비음화 — ㄱ/ㄷ/ㅂ berubah jadi ㅇ/ㄴ/ㅁ di depan ㄴ atau ㅁ: ' +
        '한국말 → [한궁말], 입니다 → [임니다], 닫는 → [단는]',
      context: 'membaca 입니다 dengan benar sejak hari pertama',
    },
    {
      level: second,
      title: 'Aturan Bunyi: ㄹ dan ㅎ',
      focus:
        '유음화 (ㄴ + ㄹ → ll): 신라 → [실라], 연락 → [열락]. ' +
        'ㅎ 탈락: 좋아요 → [조아요], 많이 → [마니]. ' +
        '격음화 (ㅎ + ㄱ/ㄷ/ㅂ/ㅈ): 좋다 → [조타], 축하 → [추카]',
      context: 'kata umum yang bunyinya jauh dari tulisannya',
    },
    {
      level: second,
      title: 'Aturan Bunyi: Pengetatan dan Palatalisasi',
      focus:
        '경음화 — konsonan menegang setelah 받침 ㄱ/ㄷ/ㅂ: 학교 → [학꾜], 식당 → [식땅]. ' +
        '구개음화 — ㄷ/ㅌ + 이 → 지/치: 같이 → [가치], 굳이 → [구지]',
      context: 'menyamakan pendengaran dengan penutur asli',
    },
    {
      level: second,
      title: 'Menulis dan Mengetik',
      focus:
        'Urutan goresan (atas ke bawah, kiri ke kanan), tata letak papan ketik 두벌식 ' +
        '(konsonan di kiri, vokal di kanan), dan cara mengetik 쌍자음 dengan Shift',
      context: 'menulis tangan dan mengetik hangul di HP',
    },
  ]
}

export function totalJamo(): number {
  return CONSONANTS.length + TENSE_CONSONANTS.length + VOWELS.length + COMPOUND_VOWELS.length
}
