/**
 * KURIKULUM TETAP PER BAHASA
 *
 * Kenapa ini data, bukan hasil generate AI:
 *
 * Kelengkapan tidak bisa diverifikasi kalau daftarnya dikarang ulang tiap kali.
 * AI yang diminta "susun silabus lengkap" akan menghasilkan sesuatu yang TERLIHAT
 * lengkap, tapi bisa melewatkan `in/at/on` atau `this/that/these/those` — dan pelajar
 * pemula tidak punya cara mengetahui ada yang bolong. Ditulis sebagai data, daftarnya
 * bisa dibaca, dihitung, dan ditambahi.
 *
 * AI tetap dipakai — tapi untuk mengisi MATERI dan LATIHAN tiap pelajaran, bukan
 * untuk memutuskan apa yang perlu dipelajari.
 *
 * Bahasa yang belum punya kurikulum di sini (Jepang, Korea, Spanyol) otomatis
 * jatuh ke silabus buatan AI. Lihat `lib/study/syllabus.ts`.
 */

export type CurriculumEntry = {
  level: string
  title: string
  /** pola grammar yang dilatih — masuk ke prompt materi & item */
  focus: string
  /** situasi nyata tempat pola ini dipakai, supaya contohnya tidak kering */
  context: string
  /** hanya untuk pelajaran kosakata: kata yang wajib tercakup */
  words?: string[]
}

// ---------------------------------------------------------------------------
// INGGRIS — cakupan grammar setara persiapan TOEFL, 60 pelajaran.
// ---------------------------------------------------------------------------

const EN: CurriculumEntry[] = [
  // ---------------------------------------------------------------- A1 (16)
  { level: 'A1', title: 'Kata Ganti dan To Be', focus: 'Subject pronouns (I, you, he, she, it, we, they) dengan am/is/are dalam kalimat positif', context: 'memperkenalkan diri dan orang lain' },
  { level: 'A1', title: 'To Be: Negatif dan Tanya', focus: 'Bentuk negatif (am not/isn’t/aren’t) dan pertanyaan (Are you…? Is he…?) beserta jawaban singkat', context: 'mengecek informasi tentang seseorang' },
  { level: 'A1', title: 'A, An, dan The', focus: 'Articles: a/an untuk benda umum, the untuk benda tertentu, dan kapan tanpa article', context: 'menyebut benda di sekitar rumah' },
  { level: 'A1', title: 'This, That, These, Those', focus: 'Demonstratives: this/these untuk yang dekat, that/those untuk yang jauh, tunggal vs jamak', context: 'menunjuk barang saat berbelanja' },
  { level: 'A1', title: 'Kata Benda Jamak', focus: 'Plural: -s, -es, -ies, dan bentuk tak beraturan (child→children, man→men, foot→feet)', context: 'menyebut jumlah benda' },
  { level: 'A1', title: 'Kepemilikan', focus: 'Possessive adjectives (my, your, his, her, its, our, their) dan possessive ’s', context: 'membicarakan keluarga dan barang milik' },
  { level: 'A1', title: 'There Is dan There Are', focus: 'There is/are untuk menyatakan keberadaan, termasuk bentuk negatif dan tanya', context: 'menggambarkan isi sebuah ruangan' },
  { level: 'A1', title: 'Present Simple: Positif', focus: 'Present simple untuk kebiasaan dan fakta, dengan aturan -s/-es pada he/she/it', context: 'menceritakan rutinitas harian' },
  { level: 'A1', title: 'Present Simple: Do dan Does', focus: 'Kalimat negatif (don’t/doesn’t) dan tanya (Do you…? Does she…?) pada present simple', context: 'menanyakan kebiasaan orang lain' },
  { level: 'A1', title: 'Seberapa Sering', focus: 'Adverbs of frequency (always, usually, often, sometimes, rarely, never) dan posisinya dalam kalimat', context: 'membandingkan kebiasaan mingguan' },
  { level: 'A1', title: 'In, On, At untuk Tempat', focus: 'Prepositions of place: in (ruang tertutup), on (permukaan), at (titik lokasi)', context: 'menjelaskan di mana barang berada' },
  { level: 'A1', title: 'In, On, At untuk Waktu', focus: 'Prepositions of time: in (bulan/tahun/bagian hari), on (hari/tanggal), at (jam/waktu tepat)', context: 'membuat jadwal dan janji' },
  { level: 'A1', title: 'Can dan Can’t', focus: 'Modal can untuk kemampuan, izin, dan permintaan; bentuk negatif dan tanya', context: 'membicarakan apa yang bisa dilakukan' },
  { level: 'A1', title: 'Perintah dan Ajakan', focus: 'Imperative (positif dan negatif) serta Let’s untuk mengajak', context: 'memberi arahan dan mengajak jalan' },
  { level: 'A1', title: 'Kata Tanya', focus: 'Question words: what, where, when, who, why, how, dan susunan kata setelahnya', context: 'menggali informasi dari orang baru' },
  { level: 'A1', title: 'Bisa Dihitung atau Tidak', focus: 'Countable vs uncountable nouns dengan some, any, much, many, a lot of', context: 'berbelanja bahan makanan' },

  // ---------------------------------------------------------------- A2 (16)
  { level: 'A2', title: 'Present Continuous', focus: 'am/is/are + verb-ing untuk aksi yang sedang berlangsung, termasuk aturan ejaan -ing', context: 'menceritakan apa yang sedang terjadi' },
  { level: 'A2', title: 'Simple atau Continuous', focus: 'Membedakan present simple (kebiasaan) dan present continuous (sekarang), termasuk stative verbs yang tidak dipakai continuous', context: 'menjelaskan perbedaan rutinitas dan keadaan saat ini' },
  { level: 'A2', title: 'Was dan Were', focus: 'Past simple dari to be dalam bentuk positif, negatif, dan tanya', context: 'menceritakan keadaan masa lalu' },
  { level: 'A2', title: 'Past Simple: Verb Beraturan', focus: 'Past simple regular verbs dengan -ed dan aturan ejaannya (stop→stopped, study→studied)', context: 'bercerita tentang kegiatan kemarin' },
  { level: 'A2', title: 'Past Simple: Verb Tak Beraturan', focus: 'Irregular verbs bentuk kedua yang paling sering dipakai (go→went, take→took, see→saw)', context: 'menceritakan pengalaman liburan' },
  { level: 'A2', title: 'Did dan Didn’t', focus: 'Kalimat tanya dan negatif past simple dengan auxiliary did, dan kembalinya verb ke bentuk dasar', context: 'menanyakan kejadian akhir pekan' },
  { level: 'A2', title: 'Past Continuous', focus: 'was/were + verb-ing, dan kombinasinya dengan past simple lewat when dan while', context: 'menceritakan dua kejadian bersamaan' },
  { level: 'A2', title: 'Rencana dengan Going To', focus: 'be going to + verb untuk rencana yang sudah diputuskan dan prediksi berdasar bukti', context: 'membicarakan rencana akhir pekan' },
  { level: 'A2', title: 'Will atau Going To', focus: 'Membedakan will (keputusan spontan, janji, tawaran) dan going to (rencana), termasuk shall untuk usulan', context: 'menawarkan bantuan dan membuat keputusan mendadak' },
  { level: 'A2', title: 'Lebih Dari: Comparative', focus: 'Comparative adjectives: -er than, more … than, dan bentuk tak beraturan (good→better, bad→worse)', context: 'membandingkan dua pilihan' },
  { level: 'A2', title: 'Paling: Superlative', focus: 'Superlative adjectives: the -est, the most …, serta pola as … as untuk kesamaan', context: 'menyebut yang terbaik di antara banyak pilihan' },
  { level: 'A2', title: 'Adjective dan Adverb', focus: 'Beda adjective (menerangkan benda) dan adverb (menerangkan cara), pembentukan -ly, serta pengecualian (good→well, fast, hard)', context: 'menggambarkan cara seseorang melakukan sesuatu' },
  { level: 'A2', title: 'Kata Ganti Objek', focus: 'Object pronouns (me, you, him, her, it, us, them) dan possessive pronouns (mine, yours, hers, theirs)', context: 'membicarakan orang tanpa mengulang namanya' },
  { level: 'A2', title: 'Preposisi Gerakan', focus: 'Prepositions of movement: to, into, out of, through, across, along, past', context: 'menjelaskan arah dan rute perjalanan' },
  { level: 'A2', title: 'Harus dan Sebaiknya', focus: 'have to, must, mustn’t, don’t have to, should — termasuk beda mustn’t (dilarang) dan don’t have to (tidak wajib)', context: 'menjelaskan aturan dan memberi saran' },
  { level: 'A2', title: 'Verb + Ing atau To', focus: 'Verb patterns dasar: enjoy/like + gerund, want/decide + infinitive', context: 'membicarakan kesukaan dan rencana' },

  // ---------------------------------------------------------------- B1 (16)
  { level: 'B1', title: 'Present Perfect: Pengalaman', focus: 'have/has + past participle dengan ever, never, just, already, yet', context: 'membicarakan pengalaman hidup' },
  { level: 'B1', title: 'Perfect atau Past Simple', focus: 'Membedakan present perfect (waktu tidak spesifik, masih relevan) dan past simple (waktu selesai dan spesifik)', context: 'bercerita tentang pencapaian' },
  { level: 'B1', title: 'For dan Since', focus: 'Present perfect dan present perfect continuous dengan for (durasi) dan since (titik mulai)', context: 'menyebut sudah berapa lama melakukan sesuatu' },
  { level: 'B1', title: 'Past Perfect', focus: 'had + past participle untuk kejadian yang lebih dulu terjadi di masa lalu, dengan before/after/by the time', context: 'menyusun urutan kejadian masa lalu' },
  { level: 'B1', title: 'Used To dan Would', focus: 'used to + verb dan would untuk kebiasaan lampau yang sudah berhenti, serta beda dengan be used to', context: 'membandingkan dulu dan sekarang' },
  { level: 'B1', title: 'First Conditional', focus: 'If + present simple, will + verb untuk kemungkinan nyata; juga unless dan as soon as', context: 'membicarakan konsekuensi rencana' },
  { level: 'B1', title: 'Second Conditional', focus: 'If + past simple, would + verb untuk situasi tidak nyata atau hipotetis', context: 'berandai-andai tentang hidup' },
  { level: 'B1', title: 'Third Conditional', focus: 'If + had + past participle, would have + past participle untuk penyesalan masa lalu', context: 'membicarakan penyesalan dan andai saja' },
  { level: 'B1', title: 'Kalimat Pasif', focus: 'Passive voice present dan past (is/was + past participle), kapan pelaku dihilangkan, dan by + pelaku', context: 'menjelaskan proses dan berita' },
  { level: 'B1', title: 'Kalimat Tak Langsung', focus: 'Reported speech: pergeseran tense, kata ganti, dan keterangan waktu (say/tell/ask)', context: 'menyampaikan ulang perkataan orang' },
  { level: 'B1', title: 'Relative Clause', focus: 'who, which, that, whose, where untuk menerangkan kata benda', context: 'menjelaskan orang dan benda secara rinci' },
  { level: 'B1', title: 'Relative Clause dengan Koma', focus: 'Beda defining (tanpa koma, informasi penting) dan non-defining (dengan koma, informasi tambahan)', context: 'menulis deskripsi yang presisi' },
  { level: 'B1', title: 'Menduga dengan Modal', focus: 'Modals of deduction: must be, might be, could be, can’t be untuk menyimpulkan', context: 'menduga situasi dari petunjuk' },
  { level: 'B1', title: 'Question Tag', focus: 'Question tags (isn’t it? do you? will you?) dan aturan polaritasnya', context: 'mengonfirmasi sesuatu dalam percakapan' },
  { level: 'B1', title: 'Phrasal Verb Umum', focus: 'Phrasal verbs yang sering muncul (look after, give up, put off, find out) dan mana yang separable', context: 'percakapan sehari-hari yang natural' },
  { level: 'B1', title: 'Kata Penghubung', focus: 'Linking words: however, although, despite, because of, therefore, in addition — beserta tata bahasa yang mengikutinya', context: 'menyusun argumen dalam tulisan' },

  // ---------------------------------------------------------------- B2 (10)
  { level: 'B2', title: 'Pola Verb Lanjutan', focus: 'Verb patterns kompleks: remember/forget/stop + gerund vs infinitive dengan makna berbeda', context: 'menyampaikan nuansa makna yang halus' },
  { level: 'B2', title: 'Kalimat Wish', focus: 'wish dan if only dengan past simple, past perfect, dan would untuk keinginan dan penyesalan', context: 'mengungkapkan harapan yang tidak terwujud' },
  { level: 'B2', title: 'Causative Have dan Get', focus: 'have/get something done untuk pekerjaan yang dilakukan orang lain', context: 'menceritakan jasa dan layanan' },
  { level: 'B2', title: 'Article Tingkat Lanjut', focus: 'Article untuk rujukan umum vs spesifik, nama tempat, dan uncountable abstrak — sumber kesalahan tersering di tes', context: 'menulis paragraf akademik' },
  { level: 'B2', title: 'Quantifier Presisi', focus: 'few/a few, little/a little, both/either/neither, all/every/each dan perbedaan halusnya', context: 'menyampaikan data dan jumlah dengan tepat' },
  { level: 'B2', title: 'Participle Clause', focus: 'Klausa dengan -ing dan -ed untuk memadatkan kalimat (Walking home, I saw…)', context: 'menulis padat dan formal' },
  { level: 'B2', title: 'Preposisi yang Mengikat', focus: 'Dependent prepositions setelah adjective dan verb tertentu (interested in, depend on, responsible for)', context: 'menulis kalimat yang idiomatis' },
  { level: 'B2', title: 'Kesesuaian Subjek dan Verb', focus: 'Subject–verb agreement pada kasus rumit: frasa panjang, either/or, each of, collective nouns', context: 'memeriksa ketepatan kalimat panjang' },
  { level: 'B2', title: 'Struktur Sejajar', focus: 'Parallel structure pada daftar dan perbandingan — pola yang sering diuji dalam soal melengkapi kalimat', context: 'memperbaiki kalimat yang tidak sejajar' },
  { level: 'B2', title: 'Membentuk Kata', focus: 'Word formation: prefix dan suffix untuk mengubah kelas kata (able→ability, decide→decision, care→careless)', context: 'memperluas kosakata secara sistematis' },

  // ---------------------------------------------------------------- C1 (2)
  { level: 'C1', title: 'Inversi dan Penekanan', focus: 'Inversion setelah negative adverbial (Never have I…, Not only…) dan cleft sentence (It was… that…)', context: 'menulis dengan gaya formal yang kuat' },
  { level: 'C1', title: 'Subjunctive dan Formal', focus: 'Subjunctive setelah suggest/insist/recommend that, serta struktur formal seperti were to dan should you', context: 'menulis surat dan proposal resmi' },
]

export const CURRICULA: Record<string, CurriculumEntry[]> = {
  en: EN,
}

export function curriculumFor(languageCode: string): CurriculumEntry[] | null {
  return CURRICULA[languageCode] ?? null
}
