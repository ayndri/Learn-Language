/**
 * ANOTASI KATA DI DALAM MATERI
 *
 * Materi pelajaran disimpan sebagai Markdown biasa, dan itu keputusan yang
 * sengaja dipertahankan: kalau AI menulis penjelasan yang salah, kamu harus bisa
 * langsung memperbaikinya di kotak teks. Begitu materinya jadi JSON berstruktur,
 * memperbaiki satu kata berarti menyunting JSON — dan yang paling sering perlu
 * diperbaiki justru materinya.
 *
 * Karena itu cara membaca dan arti per kata dibawa sebagai ANOTASI DI DALAM
 * Markdown-nya, bukan sebagai kolom terpisah:
 *
 *     {{漢字|かんじ|karakter Tionghoa}}
 *     {{casa||rumah}}
 *     {{学校|がっこう}}
 *     {{行|xíng|jalan|juga háng = baris, deret}}
 *
 * EMPAT bagian dipisah `|`: teks aslinya, cara membacanya, artinya, dan
 * catatan. Semua kecuali yang pertama boleh kosong — bahasa Spanyol tidak butuh
 * cara baca (ejaannya sudah fonemis), dan sebuah kata boleh punya cara baca
 * tanpa perlu diberi arti.
 *
 * Bagian KEEMPAT dibuat belakangan, dan ia menjawab tiga hal yang ternyata
 * masalah yang sama: satu bentuk tertulis yang membawa lebih dari satu hal.
 *
 *   多音字 — satu karakter, beberapa bacaan, arti berbeda:
 *   {{行|xíng|jalan|juga háng = baris, deret}}
 *
 *   Nada berbeda, kata berbeda — yang tampak sama bagi telinga pemula:
 *   {{妈|mā|ibu|bandingkan má 麻 rami · mǎ 马 kuda · mà 骂 memarahi}}
 *
 *   Kata yang sama di bahasa lain berarti lain — perangkap yang hanya kena
 *   orang yang belajar Jepang DAN Mandarin sekaligus:
 *   {{手紙|shǒuzhǐ|tisu toilet|⚠ di bahasa Jepang 手紙 (てがみ) = surat}}
 *
 * Ketiganya butuh hal yang sama: ruang untuk mengatakan "yang kamu lihat ini
 * bukan satu-satunya kemungkinan". Satu bidang bebas melayani ketiganya, dan
 * itu jauh lebih murah daripada tiga bidang bertipe yang masing-masing cuma
 * dipakai satu kasus.
 *
 * Kenapa `{{ }}` dan bukan yang lain:
 *
 *   Ia tidak berarti apa-apa di Markdown, jadi tidak mungkin bertabrakan dengan
 *   penekanan, tautan, atau kode. `[漢字](かんじ)` akan terbaca sebagai tautan;
 *   `漢字（かんじ）` tidak bisa dibedakan dari tanda kurung biasa yang memang
 *   dipakai di kalimat.
 *
 *   Ia masih terbaca sebagai teks mentah. Ini yang menentukan: kamu membuka
 *   kotak edit dan langsung tahu apa yang tertulis, tanpa perlu tahu formatnya.
 *
 * Materi lama yang tidak punya anotasi tetap tampil apa adanya — polanya cuma
 * tidak ketemu, dan itu bukan error.
 */

export type Annotation = {
  /** teks dalam bahasa target, apa adanya */
  text: string
  /** cara membacanya; kosong untuk bahasa yang tidak butuh */
  reading?: string
  /** artinya dalam bahasa Indonesia; kosong kalau memang tidak diberi */
  meaning?: string
  /**
   * Catatan: bacaan lain, kata yang mirip, atau peringatan lintas bahasa.
   *
   * Bebas bentuk dengan sengaja — tiga kasus yang dilayaninya (多音字, kontras
   * nada, dan teman palsu antarbahasa) tidak punya bentuk bersama yang bisa
   * ditulis sebagai tipe tanpa memaksa dua di antaranya.
   */
  note?: string
}

/** Satu potongan hasil pemisahan: teks biasa, atau satu kata beranotasi. */
export type Part = { kind: 'text'; value: string } | { kind: 'word'; word: Annotation }

/**
 * Pola anotasi: teks, cara baca, arti, catatan — tiga terakhir opsional.
 *
 * `[^|{}]` pada tiga bagian pertama mencegah pola yang tidak tertutup menelan
 * seluruh paragraf: tanpa itu, satu `{{` yang lupa ditutup akan cocok sampai
 * `}}` berikutnya di kalimat lain, dan yang hilang bukan satu kata tapi satu
 * alinea. Bagian TERAKHIR sengaja dibiarkan menerima `|`, supaya catatan yang
 * memuat beberapa bacaan tidak perlu memakai pemisah lain.
 *
 * Semua grup opsional, jadi anotasi tiga-bagian yang sudah tersimpan di
 * database sebelum bidang catatan ada tetap terbaca persis seperti dulu.
 */
const PATTERN = /\{\{([^|{}]+)(?:\|([^|{}]*))?(?:\|([^|{}]*))?(?:\|([^{}]*))?\}\}/g

/** Buang spasi berlebih dan ubah string kosong jadi undefined. */
function clean(v: string | undefined): string | undefined {
  const t = v?.trim()
  return t ? t : undefined
}

/**
 * Pisahkan satu string jadi teks biasa dan kata beranotasi.
 *
 * Selalu mengembalikan array; string tanpa anotasi menghasilkan satu potongan
 * `text`. Pemanggil tidak perlu memeriksa dulu apakah ada anotasinya.
 */
export function parseAnnotations(input: string): Part[] {
  const parts: Part[] = []
  let last = 0

  for (const m of input.matchAll(PATTERN)) {
    const at = m.index
    if (at > last) parts.push({ kind: 'text', value: input.slice(last, at) })
    parts.push({
      kind: 'word',
      word: {
        text: m[1].trim(),
        reading: clean(m[2]),
        meaning: clean(m[3]),
        note: clean(m[4]),
      },
    })
    last = at + m[0].length
  }

  if (last < input.length) parts.push({ kind: 'text', value: input.slice(last) })
  return parts
}

/** Apakah string ini punya anotasi sama sekali — untuk melewati kerja yang sia-sia. */
export function hasAnnotations(input: string): boolean {
  return input.includes('{{')
}

/**
 * Pemisah antar kata yang boleh IKUT dibacakan: spasi dan tanda baca.
 *
 * Ini yang membuat "Me llamo Juan" tidak jadi "MellamoJuan". Bahasa berspasi
 * menaruh spasinya sebagai potongan `text` di antara dua anotasi, jadi kalau
 * yang dirangkai cuma kata-katanya, spasinya hilang — dan suara Spanyol yang
 * disuruh membaca "MellamoJuan" mengucapkan satu kata yang tidak ada.
 * Bahasa tanpa spasi tidak terpengaruh karena di antara katanya memang tidak
 * ada potongan teks apa pun.
 */
const JOINER = /^[\s、。，,.!！?？;；:：'"'"()（）]*$/

/**
 * Rangkai bagian berbahasa TARGET dari satu baris, untuk dibacakan TTS.
 *
 * Berhenti di potongan teks pertama yang bukan pemisah — dan itu justru
 * intinya. Materi menulis contoh dengan format "kalimat bahasa target —
 * terjemahan Indonesia", jadi tanpa batas itu tombol dengar akan membacakan
 * terjemahan Indonesianya juga, dengan suara bahasa asing. Yang keluar bukan
 * cuma salah, tapi tidak bisa dikenali sebagai apa pun.
 *
 * Tanda baca yang menempel di kata terakhir sebelum pemisah memang ikut hilang
 * (「です。 — Saya…」 kehilangan 。), dan itu tidak apa-apa: TTS tidak
 * membacakan tanda titik.
 */
export function targetPhrase(parts: Part[]): string {
  const out: string[] = []

  for (const part of parts) {
    if (part.kind === 'word') {
      out.push(part.word.text)
      continue
    }
    // Pemisah sebelum kata pertama tidak perlu ikut — ia bukan bagian kalimat,
    // cuma tanda hubung atau spasi menjorok dari Markdown-nya.
    if (out.length === 0) continue
    if (!JOINER.test(part.value)) break
    out.push(part.value)
  }

  return out.join('').trim()
}
