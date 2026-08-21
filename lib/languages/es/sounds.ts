/**
 * BUNYI DAN EJAAN SPANYOL — bagian "aksara" untuk bahasa Spanyol.
 *
 * Bagian ini yang paling gampang dikira tidak perlu, dan alasan mengiranya
 * masuk akal: bahasa Spanyol memakai aksara Latin, ejaannya nyaris fonemis
 * (satu huruf satu bunyi), dan pelajar Indonesia bisa membaca kalimat Spanyol
 * dengan cukup benar di hari pertama. Kebalikan dari bahasa Inggris, di mana
 * `though`/`through`/`thought` membuat bagian ini wajib.
 *
 * Justru karena itu bagian ini dibuat KECIL tapi tidak dibuang. Yang tersisa
 * setelah keteraturan itu ada empat kelompok, dan keempatnya nyata:
 *
 *   HURUF YANG BUKAN SEPERTI DUGAAN. j dan g+e/i dibaca seperti "kh" (jugar,
 *   gente), ll dan y meleleh jadi satu bunyi, ñ punya bunyinya sendiri, h
 *   selalu DIAM (hola = "ola"), dan v dibaca sama dengan b — bukan seperti
 *   v Indonesia. Satu huruf salah baca di sini bukan aksen, tapi kata lain:
 *   `caro` (mahal) vs `carro` (mobil), `pero` (tetapi) vs `perro` (anjing).
 *
 *   PENEKANAN SUKU KATA. Ini bagian yang paling sering dilewati, dan paling
 *   mahal akibatnya. Dalam bahasa Spanyol tekanan MEMBEDAKAN MAKNA dan sudah
 *   dipetakan lengkap oleh aturan ejaan: `hablo` (saya bicara) vs `habló` (dia
 *   bicara) — satu tanda aksen memisahkan dua kata dan dua kala. Pelajar
 *   Indonesia yang membaca semuanya dengan tekanan rata akan mengucapkan kala
 *   yang salah tanpa tahu.
 *
 *   TANDA AKSEN YANG BUKAN SOAL TEKANAN. `si`/`sí`, `el`/`él`, `que`/`qué` —
 *   tilde diakrítica yang cuma membedakan dua kata berbunyi sama.
 *
 *   RAGAM. c/z dibaca "th" di Spanyol tapi "s" di Amerika Latin (seseo), dan
 *   ll/y berbeda-beda (yeísmo). Bukan salah-benar, tapi harus dipilih dan
 *   dikonsistenkan.
 *
 * Sama seperti bunyi bahasa Inggris dan pinyin Mandarin, jenis itemnya `sound`:
 * lambangnya ditampilkan, kamu mengucapkannya, lalu membuka jawabannya dan
 * menilai sendiri. Pelafalan tidak bisa dinilai lewat teks.
 */

export type SoundLesson = {
  level: string
  title: string
  focus: string
  context: string
  /** entri yang dilatih sebagai kartu `sound`; kosong = biarkan AI memilih */
  words?: string[]
}

/**
 * Bunyi & ejaan → daftar pelajaran.
 *
 * Yang WAJIB di depan cuma level pemula, sama seperti bahasa Inggris dan tidak
 * seperti kana: orang bisa mulai bicara Spanyol sebelum menguasai seluruh
 * sistem bunyinya, dan menahan pelajaran pertama sampai aturan aksen tuntas
 * cuma menunda hal yang lebih berguna. Ragam wilayah dan aksen tulis menyusul
 * di levelnya sendiri.
 */
export const ES_SOUNDS: SoundLesson[] = [
  {
    level: 'A1',
    title: 'Alfabet dan Lima Vokal',
    focus:
      'Nama huruf a–z (termasuk ñ, dan ch/ll yang bukan lagi huruf terpisah sejak 2010) serta ' +
      'lima vokal yang SELALU dibaca sama: a, e, i, o, u. Tidak ada vokal panjang, tidak ada ' +
      'schwa, tidak ada vokal yang berubah karena huruf di belakangnya — ini yang membuat ' +
      'bahasa Spanyol jauh lebih mudah dibaca daripada bahasa Inggris.',
    context: 'mengeja nama sendiri lewat telepon',
    words: ['a /a/', 'e /e/', 'i /i/', 'o /o/', 'u /u/', 'ñ /ɲ/ (eñe)', 'j /jota/', 'g /ge/', 'h /ache/', 'y /ye/', 'z /zeta/', 'v /uve/'],
  },
  {
    level: 'A1',
    title: 'Huruf yang Menipu',
    focus:
      'h SELALU diam (hola = "ola", hombre = "ombre") · j dan g+e/i dibaca seperti "kh" kasar ' +
      '(jugar, gente, gitarra) tapi g+a/o/u biasa (gato) · v dibaca SAMA dengan b (vino ≈ "bino") · ' +
      'qu dan gu: u-nya diam (queso = "keso", guerra = "gerra") kecuali bertitik dua (pingüino) · ' +
      'ñ punya bunyinya sendiri, seperti "ny" pada "banyak".',
    context: 'membaca kata sehari-hari tanpa salah bunyi',
    words: ['h (hola)', 'j (jugar)', 'ge/gi (gente)', 'ga/go/gu (gato)', 'v (vino)', 'que (queso)', 'gue (guerra)', 'ñ (año)'],
  },
  {
    level: 'A1',
    title: 'R dan RR',
    focus:
      'Dua bunyi yang berbeda, dan bedanya MEMBEDAKAN KATA: r tunggal di tengah kata satu ' +
      'sentuhan lidah (caro = mahal), rr dan r di awal kata bergetar panjang (carro = mobil, ' +
      'rojo). pero (tetapi) vs perro (anjing), coro (koor) vs corro (saya berlari). Untuk ' +
      'penutur Indonesia r tunggal justru yang lebih sulit — bukan yang bergetar.',
    context: 'pasangan kata yang cuma dibedakan getaran r',
    words: ['r tunggal (caro)', 'rr (carro)', 'r awal (rojo)', 'pero vs perro', 'coro vs corro', 'para vs parra'],
  },
  {
    level: 'A1',
    title: 'Tekanan Suku Kata',
    focus:
      'Tiga aturan yang mencakup hampir seluruh kata Spanyol: berakhir vokal, -n, atau -s → ' +
      'tekanan di suku kata KEDUA DARI BELAKANG (casa, hablan, lunes) · berakhir konsonan lain → ' +
      'suku kata TERAKHIR (hablar, ciudad, feliz) · kalau melanggar keduanya, WAJIB ditandai ' +
      'aksen (café, lápiz, teléfono). Ini bukan hiasan: hablo (saya bicara) dan habló (dia ' +
      'bicara) beda kala, dan yang membedakannya cuma tekanan.',
    context: 'kenapa satu tanda aksen bisa mengubah kalanya',
    words: ['casa (ca-)', 'hablar (-blar)', 'café (-fé)', 'lápiz (lá-)', 'teléfono (-lé-)', 'hablo vs habló', 'canto vs cantó', 'esta vs está'],
  },
  {
    level: 'A2',
    title: 'Aksen yang Membedakan Kata',
    focus:
      'Tilde diacrítica — aksen yang TIDAK menandai tekanan, cuma memisahkan dua kata yang ' +
      'bunyinya sama: si (kalau) / sí (ya) · el (si) / él (dia) · tu (mu) / tú (kamu) · ' +
      'mas (tetapi) / más (lebih) · que (yang) / qué (apa) · como (seperti) / cómo (bagaimana) · ' +
      'se (diri) / sé (saya tahu). Kata tanya SELALU beraksen, termasuk di pertanyaan tak langsung.',
    context: 'menulis tanpa mengubah arti kalimat',
    words: ['si / sí', 'el / él', 'tu / tú', 'mas / más', 'que / qué', 'como / cómo', 'se / sé', 'donde / dónde'],
  },
  {
    level: 'A2',
    title: 'Diftong dan Pemisahan Suku Kata',
    focus:
      'Vokal kuat (a, e, o) dan lemah (i, u): kuat+lemah atau lemah+lemah melebur jadi satu ' +
      'suku kata (aire, cuatro, ciudad), kuat+kuat terpisah (te-a-tro, le-er). Aksen pada vokal ' +
      'lemah MEMECAH diftongnya: río (rí-o) vs rio, país (pa-ís) vs pais. Ini yang menentukan ' +
      'kata itu berapa suku kata, dan karenanya di mana tekanannya.',
    context: 'membaca kata panjang dengan tekanan yang benar',
    words: ['ai (aire)', 'ei (peine)', 'ue (cuatro)', 'ie (tiene)', 'iu (ciudad)', 'e-a (teatro)', 'í-o (río)', 'a-í (país)'],
  },
  {
    level: 'B1',
    title: 'Bunyi yang Melunak',
    focus:
      'Konsonan yang berubah tergantung tempatnya, dan ini yang membuat ucapan penutur asli ' +
      'terdengar "cepat": b/d/g di antara vokal jadi sangat lunak (Cuba, cada, agua — hampir ' +
      'seperti mendesis), d di akhir kata nyaris hilang (Madrid ≈ "Madri", usted ≈ "usté"), ' +
      's di akhir suku kata melemah jadi hembusan di banyak wilayah (España ≈ "Ehpaña"), dan ' +
      'kata bersambung tanpa jeda (las alas ≈ "lasalas").',
    context: 'memahami percakapan berkecepatan normal',
    words: ['b lunak (Cuba)', 'd lunak (cada)', 'g lunak (agua)', '-d akhir (Madrid)', '-s melemah (está)', 'sambung (las alas)'],
  },
  {
    level: 'B2',
    title: 'Ragam Pelafalan',
    focus:
      'Perbedaan yang bukan salah-benar, tapi harus dipilih dan dikonsistenkan: ' +
      'DISTINCIÓN (Spanyol utara-tengah) membedakan c/z sebagai "th" dari s — casa ≠ caza; ' +
      'SESEO (Amerika Latin, Andalusia, Kanaria) membaca ketiganya "s" — casa = caza. ' +
      'YEÍSMO: ll dan y sama bunyinya di hampir semua wilayah, kecuali "sh" di Rioplatense ' +
      '(calle ≈ "cashe"). Ditambah aspirasi s Karibia dan getaran r Kosta Rika.',
    context: 'memilih satu ragam dan memahami yang lain',
    words: ['distinción (caza)', 'seseo (caza)', 'yeísmo (calle)', 'sheísmo (calle)', 'aspiración (los)', 'voseo (vos hablás)'],
  },
]
