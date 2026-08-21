import type { CurriculumEntry } from '@/lib/languages/curriculum'

/**
 * KURIKULUM GRAMMAR JEPANG — N5 → N1
 *
 * Alasannya sama persis dengan kurikulum Inggris: kelengkapan hanya bisa
 * diperiksa kalau daftarnya DITULIS, bukan dikarang ulang tiap kali oleh AI.
 * Untuk bahasa Jepang taruhannya malah lebih besar — grammar JLPT itu daftar
 * pola yang jumlahnya terbatas dan bisa dihitung, dan satu pola yang bolong
 * (mis. 〜てはいけません atau 〜ば〜ほど) langsung terasa waktu ujian.
 *
 * Yang ditulis di `focus` adalah POLANYA dalam bahasa Jepang, apa adanya.
 * Itu yang dikirim ke prompt materi & soal, jadi AI tidak perlu menebak
 * "pelajaran ini sebenarnya soal apa".
 *
 * Catatan tentang level: JLPT tidak menerbitkan daftar grammar resmi sejak
 * 2010. Pembagian N5–N1 di sini mengikuti konsensus buku persiapan yang umum
 * dipakai (Shin Kanzen Master, Try!, Sou Matome). Beberapa pola memang bisa
 * muncul di dua level yang bersebelahan — yang penting tidak ada yang hilang.
 *
 * Kana dan kanji TIDAK ada di sini. Keduanya punya daftarnya sendiri di
 * `lib/languages/ja/kana.ts` dan `lib/languages/ja/kanji.ts`, dan diselipkan
 * ke silabus sebagai jalur terpisah — lihat `lib/languages/tracks.ts`.
 */

// ---------------------------------------------------------------------------
// N5 — 24 pelajaran. Pondasi: kopula, partikel, ます形, て形, ない形, 普通形.
// ---------------------------------------------------------------------------

const N5: CurriculumEntry[] = [
  {
    level: 'N5',
    title: 'Kalimat Dasar: です',
    focus: 'AはBです / AはBじゃありません / AはBですか — kopula です, partikel は sebagai penanda topik, dan cara bertanya dengan か',
    context: 'memperkenalkan diri dan menyebut identitas orang lain',
  },
  {
    level: 'N5',
    title: 'Ini, Itu, dan Yang Di Sana',
    focus: 'これ・それ・あれ・どれ (benda) dan この・その・あの・どの + 名詞 — beda pemakaian kata benda mandiri dan yang menempel ke kata benda',
    context: 'menunjuk barang saat belanja di konbini',
  },
  {
    level: 'N5',
    title: 'Tempat dan Arah',
    focus: 'ここ・そこ・あそこ・どこ, こちら・そちら・あちら・どちら, dan 〜は〜にあります/います',
    context: 'menanyakan letak toilet, stasiun, dan ruangan',
  },
  {
    level: 'N5',
    title: 'Partikel の',
    focus: 'の untuk kepemilikan (わたしの本), penjelas asal/jenis (日本語の先生), dan の sebagai pengganti kata benda (赤いのをください)',
    context: 'membicarakan barang milik dan asal seseorang',
  },
  {
    level: 'N5',
    title: 'あります dan います',
    focus: 'Beda あります (benda mati) dan います (makhluk hidup), partikel に untuk lokasi, が untuk subjek, dan 〜に〜があります',
    context: 'menjelaskan isi kamar dan siapa saja yang ada di rumah',
  },
  {
    level: 'N5',
    title: 'Kata Kerja Bentuk ます',
    focus: 'Bentuk 〜ます・〜ません untuk kebiasaan dan masa depan; kata kerja selalu di akhir kalimat',
    context: 'menceritakan rutinitas harian',
  },
  {
    level: 'N5',
    title: 'Bentuk Lampau ました',
    focus: '〜ました・〜ませんでした, dan bentuk lampau です → でした・じゃありませんでした',
    context: 'bercerita tentang kegiatan kemarin',
  },
  {
    level: 'N5',
    title: 'Partikel を, で, dan に',
    focus: 'を (objek langsung), で (tempat berlangsungnya kegiatan / alat), に (titik waktu, tujuan, lawan bicara) — beda で dan に pada kalimat bertempat',
    context: 'menceritakan aktivitas di sekolah dan di rumah',
  },
  {
    level: 'N5',
    title: 'Pergi, Datang, Pulang',
    focus: '行きます・来ます・帰ります dengan へ/に (arah), から〜まで (dari–sampai), dan と (bersama siapa)',
    context: 'menceritakan perjalanan ke kampus',
  },
  {
    level: 'N5',
    title: 'Waktu dan Tanggal',
    focus: 'Jam (〜時〜分), hari (〜曜日), tanggal (〜月〜日 termasuk bacaan tak beraturan 一日〜十日), dan kapan に dipakai kapan tidak',
    context: 'membuat janji bertemu',
  },
  {
    level: 'N5',
    title: 'Kata Sifat い',
    focus: 'い形容詞: 大きいです・大きくないです・大きかったです・大きくなかったです, dan pengecualian いい→よかった',
    context: 'menggambarkan cuaca, makanan, dan tempat',
  },
  {
    level: 'N5',
    title: 'Kata Sifat な',
    focus: 'な形容詞: 静かです・静かじゃありません・静かでした, dan 静かな部屋 saat menerangkan kata benda',
    context: 'menggambarkan suasana kota dan orang',
  },
  {
    level: 'N5',
    title: 'Membandingkan',
    focus: 'AよりBのほうが〜, AとBとどちらが〜, 〜の中でいちばん〜 untuk perbandingan dan tingkat paling',
    context: 'memilih di antara dua tempat makan',
  },
  {
    level: 'N5',
    title: 'Suka, Bisa, dan Ingin Punya',
    focus: '好き・嫌い・上手・下手・分かります・あります dengan partikel が, serta 〜がほしいです',
    context: 'membicarakan kesukaan dan hobi',
  },
  {
    level: 'N5',
    title: 'Mengajak',
    focus: '〜ませんか (mengajak), 〜ましょう (ayo), 〜ましょうか (menawarkan bantuan)',
    context: 'mengajak teman menonton dan menawarkan bantuan',
  },
  {
    level: 'N5',
    title: 'Ingin Melakukan',
    focus: '〜たいです (ingin, dengan が/を), 〜たがっています untuk orang ketiga, dan 〜に行きます (pergi untuk melakukan sesuatu)',
    context: 'menyampaikan rencana liburan',
  },
  {
    level: 'N5',
    title: 'Bentuk て',
    focus: 'Cara membentuk て形 untuk tiga golongan kata kerja (godan, ichidan, tak beraturan) — pola bunyi い・ち・り→って, み・び・に→んで, き→いて, ぎ→いで',
    context: 'menyiapkan pondasi untuk semua pola lanjutan',
  },
  {
    level: 'N5',
    title: 'Sedang dan Tolong',
    focus: '〜てください (permintaan), 〜ています (sedang berlangsung / keadaan yang berlanjut seperti 結婚しています)',
    context: 'meminta bantuan dan menjelaskan apa yang sedang dikerjakan',
  },
  {
    level: 'N5',
    title: 'Boleh dan Tidak Boleh',
    focus: '〜てもいいです (izin), 〜てはいけません (larangan), 〜てから (setelah), 〜て、〜 (menyambung dua kegiatan)',
    context: 'menjelaskan aturan di kelas dan di tempat umum',
  },
  {
    level: 'N5',
    title: 'Bentuk ない',
    focus: 'Cara membentuk ない形, lalu 〜ないでください, 〜なければなりません, 〜なくてもいいです',
    context: 'menyampaikan larangan halus dan kewajiban',
  },
  {
    level: 'N5',
    title: 'Bentuk Kamus',
    focus: '辞書形 dan pemakaiannya: 〜ことができます, 〜前に, 〜のが好きです, 〜ことです',
    context: 'membicarakan kemampuan dan urutan kegiatan',
  },
  {
    level: 'N5',
    title: 'Bentuk た',
    focus: 'た形 dan pemakaiannya: 〜たことがあります (pengalaman), 〜たり〜たりします, 〜たあとで, 〜たほうがいいです',
    context: 'bercerita tentang pengalaman dan memberi saran',
  },
  {
    level: 'N5',
    title: 'Bentuk Biasa',
    focus: '普通形 (plain form) untuk kata kerja, い形容詞, な形容詞, dan 名詞 — beserta 〜と思います dan 〜と言っていました',
    context: 'ngobrol santai dengan teman dekat',
  },
  {
    level: 'N5',
    title: 'Menyambung Kalimat',
    focus: 'から (sebab), が (tetapi), そして・それから, でも — dan bedanya から dengan ので yang lebih halus',
    context: 'menjelaskan alasan tidak bisa datang',
  },
]

// ---------------------------------------------------------------------------
// N4 — 26 pelajaran. Konjugasi lengkap: potensial, kehendak, syarat, pasif,
// kausatif, keigo dasar, dan rangkaian 〜て+kata kerja bantu.
// ---------------------------------------------------------------------------

const N4: CurriculumEntry[] = [
  {
    level: 'N4',
    title: 'Bentuk Potensial',
    focus: '可能形 (書ける・食べられる・できる) dan perubahan partikel を→が, serta bandingannya dengan 〜ことができる',
    context: 'menyebutkan apa yang bisa dan tidak bisa kamu lakukan',
  },
  {
    level: 'N4',
    title: 'Bentuk Kehendak',
    focus: '意向形 (行こう・食べよう) dengan 〜と思っています, 〜つもりです, dan 〜予定です',
    context: 'menyampaikan niat dan rencana',
  },
  {
    level: 'N4',
    title: 'Syarat: たら',
    focus: '〜たら untuk pengandaian dan urutan waktu, termasuk 〜たらどうですか sebagai saran',
    context: 'membicarakan rencana yang bergantung pada keadaan',
  },
  {
    level: 'N4',
    title: 'Syarat: と',
    focus: '〜と untuk akibat yang selalu terjadi (hukum alam, cara kerja mesin, petunjuk jalan) dan larangan memakainya untuk perintah',
    context: 'menjelaskan cara memakai mesin tiket',
  },
  {
    level: 'N4',
    title: 'Syarat: ば dan なら',
    focus: '〜ば (syarat umum), 〜なら (menanggapi topik yang baru disebut), dan ringkasan beda たら・と・ば・なら',
    context: 'memberi saran atas situasi yang baru diceritakan orang',
  },
  {
    level: 'N4',
    title: 'Bentuk Pasif',
    focus: '受身形 (書かれる・食べられる) — pasif langsung, pasif "kena imbas" (雨に降られた), dan pasif untuk kalimat objektif',
    context: 'menceritakan kejadian yang merugikan diri sendiri',
  },
  {
    level: 'N4',
    title: 'Bentuk Kausatif',
    focus: '使役形 (行かせる・食べさせる) untuk menyuruh dan mengizinkan, dengan partikel を/に yang berbeda',
    context: 'menceritakan aturan di rumah dan di kantor',
  },
  {
    level: 'N4',
    title: 'Kausatif Pasif',
    focus: '使役受身形 (行かせられる・待たされる) untuk "dipaksa melakukan"',
    context: 'mengeluh tentang hal yang terpaksa dilakukan',
  },
  {
    level: 'N4',
    title: 'Perintah dan Larangan Keras',
    focus: '命令形 (行け・やめろ) dan 禁止形 (〜な), beserta peringatan kapan bentuk ini WAJAR dan kapan kasar',
    context: 'membaca rambu, teriakan di pertandingan, dan dialog film',
  },
  {
    level: 'N4',
    title: 'Memberi dan Menerima',
    focus: 'あげる・もらう・くれる beserta versi 〜てあげる・〜てもらう・〜てくれる, dan arah perpindahan yang menentukan pilihannya',
    context: 'menceritakan bantuan yang kamu terima dan berikan',
  },
  {
    level: 'N4',
    title: 'Permintaan Sopan',
    focus: '〜ていただけませんか, 〜てくださいませんか, 〜てもらえますか — tingkat kesopanan bertingkat untuk meminta tolong',
    context: 'meminta tolong ke atasan dan orang asing',
  },
  {
    level: 'N4',
    title: 'Keigo: Bahasa Hormat',
    focus: '尊敬語: お〜になる, 〜れる/られる, dan kata khusus (いらっしゃる・召し上がる・ご覧になる・おっしゃる)',
    context: 'berbicara dengan tamu dan atasan',
  },
  {
    level: 'N4',
    title: 'Keigo: Bahasa Merendah',
    focus: '謙譲語: お〜する, dan kata khusus (伺う・申す・いたす・拝見する・いただく) — beserta 丁寧語 ございます',
    context: 'memperkenalkan diri saat wawancara kerja',
  },
  {
    level: 'N4',
    title: 'Dugaan: でしょう dan かもしれません',
    focus: '〜でしょう (perkiraan), 〜かもしれません (mungkin), 〜はずです (semestinya) dan tingkat keyakinan masing-masing',
    context: 'membicarakan ramalan cuaca dan kemungkinan rencana',
  },
  {
    level: 'N4',
    title: 'Kelihatannya: そう, よう, らしい',
    focus: '〜そうです (tampak / katanya), 〜ようです・〜みたいです (sepertinya), 〜らしいです (kabarnya) — beda sumber informasinya',
    context: 'menyampaikan kabar yang kamu dengar dan tebakan dari yang kamu lihat',
  },
  {
    level: 'N4',
    title: 'Kata Kerja Bantu て (1)',
    focus: '〜てみる (coba), 〜ておく (siapkan lebih dulu), 〜てしまう (terlanjur / selesai) beserta bentuk lisan 〜ちゃう',
    context: 'menceritakan persiapan dan kejadian yang tidak disengaja',
  },
  {
    level: 'N4',
    title: 'Kata Kerja Bantu て (2)',
    focus: '〜ていく・〜てくる untuk perubahan dan arah waktu, serta 〜てある (keadaan hasil perbuatan)',
    context: 'menceritakan perubahan dari dulu sampai sekarang',
  },
  {
    level: 'N4',
    title: 'Kata Kerja Berpasangan',
    focus: '自動詞・他動詞 (開く/開ける, 閉まる/閉める, 始まる/始める, 落ちる/落とす) dan pasangannya dengan 〜ている vs 〜てある',
    context: 'menjelaskan keadaan benda di ruangan',
  },
  {
    level: 'N4',
    title: 'Sambil dan Supaya',
    focus: '〜ながら (sambil), 〜ために (demi/tujuan), 〜ように (agar), 〜ようになる (jadi bisa), 〜ようにする (membiasakan)',
    context: 'membicarakan usaha memperbaiki kebiasaan',
  },
  {
    level: 'N4',
    title: 'Klausa Penerang Kata Benda',
    focus: '名詞修飾節: 昨日買った本, 日本語を教えている先生 — kata kerja bentuk biasa di depan kata benda, dan が menggantikan は di dalam klausa',
    context: 'menjelaskan orang dan benda secara rinci',
  },
  {
    level: 'N4',
    title: 'Kalimat dalam Kalimat',
    focus: '〜と思う, 〜と言う, 〜かどうか, 〜か分かりません — cara memasukkan kalimat ke dalam kalimat lain',
    context: 'menyampaikan pendapat dan meneruskan perkataan orang',
  },
  {
    level: 'N4',
    title: 'Kata Tanya + か, も, でも',
    focus: '誰か・何か・どこか, 誰も・何も (dengan negatif), 誰でも・何でも・いつでも',
    context: 'percakapan sehari-hari yang tidak menyebut hal tertentu',
  },
  {
    level: 'N4',
    title: 'Menyebut Beberapa Alasan',
    focus: '〜し、〜し (menumpuk alasan), 〜ので (sebab halus), 〜のに (padahal)',
    context: 'menjelaskan kenapa memilih sesuatu',
  },
  {
    level: 'N4',
    title: 'Urutan dan Batas Waktu',
    focus: '〜とき, 〜前に, 〜あとで, 〜てから, 〜までに (batas akhir) vs 〜まで (sampai)',
    context: 'menyusun jadwal pekerjaan',
  },
  {
    level: 'N4',
    title: 'Terlalu dan Mudah/Sulit',
    focus: '〜すぎる, 〜やすい, 〜にくい, 〜方 (cara), 〜始める・〜終わる・〜続ける',
    context: 'memberi ulasan tentang alat dan makanan',
  },
  {
    level: 'N4',
    title: 'Bentuk Sopan vs Biasa',
    focus: 'Kapan memakai 丁寧体 (です・ます) dan kapan 普通体, serta akhiran percakapan ね・よ・な・の',
    context: 'menyesuaikan gaya bicara pada lawan bicara',
  },
]

// ---------------------------------------------------------------------------
// N3 — 28 pelajaran. Titik lompatan terbesar: pola yang mulai bernuansa,
// bukan sekadar konjugasi.
// ---------------------------------------------------------------------------

const N3: CurriculumEntry[] = [
  {
    level: 'N3',
    title: 'Keputusan dan Perubahan',
    focus: '〜ことにする (memutuskan sendiri), 〜ことになる (diputuskan keadaan), 〜ようになる, 〜ないことにする',
    context: 'menceritakan keputusan besar dan perubahan hidup',
  },
  {
    level: 'N3',
    title: 'Semestinya dan Ternyata',
    focus: '〜はずだ・〜はずがない (semestinya), 〜わけだ (pantas saja), 〜わけではない (bukan berarti), 〜わけがない',
    context: 'menyimpulkan sesuatu dari petunjuk yang ada',
  },
  {
    level: 'N3',
    title: 'Baru Saja dan Sedang',
    focus: '〜たところだ・〜ているところだ・〜たばかりだ dan bedanya dengan 〜たあとで',
    context: 'menjawab telepon saat sedang di tengah pekerjaan',
  },
  {
    level: 'N3',
    title: 'Selagi dan Setiap Kali',
    focus: '〜うちに, 〜間に vs 〜間, 〜たびに, 〜ついでに',
    context: 'menyusun kegiatan yang menumpang pada kegiatan lain',
  },
  {
    level: 'N3',
    title: 'Berkat dan Gara-gara',
    focus: '〜おかげで, 〜せいで, 〜ために (sebab), 〜によって (oleh/bergantung pada)',
    context: 'menjelaskan sebab keberhasilan dan kegagalan',
  },
  {
    level: 'N3',
    title: 'Tentang dan Terhadap',
    focus: '〜について, 〜に関して, 〜に対して, 〜にとって — empat pola yang sering tertukar',
    context: 'menulis laporan dan menyampaikan pendapat',
  },
  {
    level: 'N3',
    title: 'Sebagai dan Sesuai',
    focus: '〜として, 〜とおりに, 〜どおりに, 〜に従って, 〜に基づいて',
    context: 'menjelaskan peran dan mengikuti petunjuk',
  },
  {
    level: 'N3',
    title: 'Padahal dan Meskipun',
    focus: '〜のに, 〜くせに, 〜わりに, 〜ながらも — beda nuansa keluhan, celaan, dan perbandingan',
    context: 'mengomentari hal yang tidak sesuai harapan',
  },
  {
    level: 'N3',
    title: 'Sebanyak dan Sampai-sampai',
    focus: '〜ほど, 〜くらい/ぐらい, 〜ば〜ほど, 〜ほど〜ない',
    context: 'menggambarkan tingkatan secara hidup',
  },
  {
    level: 'N3',
    title: 'Bahkan dan Hanya',
    focus: '〜さえ, 〜でも, 〜ばかり, 〜だけでなく〜も, 〜しか〜ない',
    context: 'menekankan hal yang di luar dugaan',
  },
  {
    level: 'N3',
    title: 'Di Sisi Lain',
    focus: '〜一方で, 〜反面, 〜に比べて, 〜というより',
    context: 'membandingkan dua sisi sebuah pilihan',
  },
  {
    level: 'N3',
    title: 'Cenderung dan Terkesan',
    focus: '〜っぽい, 〜がち, 〜気味, 〜だらけ, 〜まみれ',
    context: 'menggambarkan kondisi dan kesan',
  },
  {
    level: 'N3',
    title: 'Kata Kerja Majemuk',
    focus: '〜きる・〜きれない, 〜かける, 〜出す, 〜続ける, 〜直す, 〜込む',
    context: 'menceritakan proses pekerjaan yang panjang',
  },
  {
    level: 'N3',
    title: 'Sebaiknya dan Harus',
    focus: '〜べきだ, 〜ものだ, 〜ことだ, 〜しかない, 〜ほかない',
    context: 'memberi nasihat dan menyatakan keharusan',
  },
  {
    level: 'N3',
    title: 'Keinginan pada Orang Lain',
    focus: '〜てほしい, 〜てもらいたい, 〜ないでほしい, 〜たがる',
    context: 'menyampaikan harapan kepada orang lain',
  },
  {
    level: 'N3',
    title: 'Keigo Terpakai',
    focus: 'Memilih 尊敬語/謙譲語 yang tepat dalam satu percakapan utuh, 〜させていただく, dan kesalahan 二重敬語',
    context: 'menelepon perusahaan dan melayani pelanggan',
  },
  {
    level: 'N3',
    title: 'Pasif dan Kausatif Tingkat Lanjut',
    focus: 'Pasif untuk kalimat berita dan penjelasan umum (〜と言われている), 使役 dengan 〜させてください',
    context: 'membaca berita dan meminta izin secara formal',
  },
  {
    level: 'N3',
    title: 'Kemungkinan dan Kepastian',
    focus: '〜に違いない, 〜かもしれない, 〜恐れがある, 〜そうもない, 〜っこない',
    context: 'menimbang risiko sebuah rencana',
  },
  {
    level: 'N3',
    title: 'Kalau Begitu, Kalau Saja',
    focus: 'Ringkasan syarat lanjutan: 〜としたら, 〜とすれば, 〜ば〜のに, 〜たら〜のに (penyesalan)',
    context: 'berandai-andai tentang keputusan yang sudah lewat',
  },
  {
    level: 'N3',
    title: 'Awal dan Akhir Peristiwa',
    focus: '〜てはじめて, 〜以来, 〜てから〜になる, 〜ところだった (nyaris)',
    context: 'menceritakan titik balik dan hal yang nyaris terjadi',
  },
  {
    level: 'N3',
    title: 'Tanpa dan Selain',
    focus: '〜ずに, 〜ないで, 〜抜きで, 〜以外に, 〜ほかに',
    context: 'menjelaskan cara melakukan sesuatu tanpa sesuatu yang lain',
  },
  {
    level: 'N3',
    title: 'Dinyatakan dan Disebut',
    focus: '〜という〜, 〜ということだ, 〜というのは〜のことだ, 〜とか',
    context: 'menjelaskan istilah dan meneruskan informasi',
  },
  {
    level: 'N3',
    title: 'Bilangan dan Satuan',
    focus: 'Penggolong bilangan (助数詞) yang sering muncul: 〜枚・本・冊・匹・頭・台・杯・軒・人, serta 〜ずつ, 〜おきに, 〜ごとに',
    context: 'memesan barang dan menyebutkan jumlah',
  },
  {
    level: 'N3',
    title: 'Kata Keterangan Frekuensi dan Derajat',
    focus: '副詞: なかなか, ほとんど, ぜんぜん, けっこう, さすが, かなり, せっかく, わざわざ — beserta bentuk kalimat yang menyertainya',
    context: 'memberi komentar yang terdengar alami',
  },
  {
    level: 'N3',
    title: 'Penghubung Antarkalimat',
    focus: '接続詞: しかし, ところが, それに, そのうえ, したがって, つまり, ただし, なお',
    context: 'menyusun paragraf yang runtut',
  },
  {
    level: 'N3',
    title: 'Bahasa Percakapan',
    focus: 'Bentuk singkat lisan: 〜ちゃう・〜じゃう, 〜とく, 〜てる, 〜なきゃ, 〜なくちゃ, 〜んだ, 〜って (=は/という)',
    context: 'memahami dialog anime, drama, dan obrolan teman',
  },
  {
    level: 'N3',
    title: 'Nuansa Akhir Kalimat',
    focus: '〜かな, 〜っけ, 〜もん, 〜ものか, 〜ことか, 〜んじゃない?',
    context: 'menyampaikan perasaan dalam obrolan santai',
  },
  {
    level: 'N3',
    title: 'Membaca Teks Panjang',
    focus: 'Strategi 読解 N3: mengenali 指示語 (これ・それ・そのような) merujuk apa, dan menemukan kalimat inti tiap paragraf',
    context: 'membaca esai dan artikel pendek',
  },
]

// ---------------------------------------------------------------------------
// N2 — 28 pelajaran. Pola tulis-resmi dan nuansa yang membedakan pilihan.
// ---------------------------------------------------------------------------

const N2: CurriculumEntry[] = [
  {
    level: 'N2',
    title: 'Begitu … Langsung',
    focus: '〜とたん(に), 〜次第, 〜か〜ないかのうちに, 〜が早いか',
    context: 'menceritakan dua kejadian yang beruntun cepat',
  },
  {
    level: 'N2',
    title: 'Sejalan dengan Perubahan',
    focus: '〜につれて, 〜にしたがって, 〜とともに, 〜に伴って',
    context: 'menjelaskan tren dan perubahan bertahap',
  },
  {
    level: 'N2',
    title: 'Berdasarkan dan Berpusat pada',
    focus: '〜に基づいて, 〜をもとに, 〜を中心に, 〜を通じて/を通して',
    context: 'menjelaskan sumber data dan cakupan penelitian',
  },
  {
    level: 'N2',
    title: 'Berkaitan dan Tergantung',
    focus: '〜に関わらず, 〜にもかかわらず, 〜を問わず, 〜次第だ',
    context: 'menulis syarat dan ketentuan',
  },
  {
    level: 'N2',
    title: 'Tidak Bisa Tidak',
    focus: '〜ざるを得ない, 〜ないわけにはいかない, 〜より(ほか)ない, 〜ずにはいられない',
    context: 'menyatakan keterpaksaan dan dorongan yang tak tertahan',
  },
  {
    level: 'N2',
    title: 'Sebaliknya Justru',
    focus: '〜どころか, 〜ものの, 〜とはいえ, 〜にしては',
    context: 'mengoreksi dugaan lawan bicara',
  },
  {
    level: 'N2',
    title: 'Meskipun Demikian',
    focus: '〜ながら(も), 〜つつ(も), 〜くせして, 〜としても',
    context: 'menyampaikan sikap yang bertolak belakang',
  },
  {
    level: 'N2',
    title: 'Sekalipun dan Andaikata',
    focus: '〜たところで, 〜ものなら, 〜としたら, 〜にしろ〜にしろ, 〜であれ',
    context: 'membahas kemungkinan yang jauh',
  },
  {
    level: 'N2',
    title: 'Bertepatan dan Bermomen',
    focus: '〜にあたって, 〜に際して, 〜を機に, 〜をきっかけに',
    context: 'pidato pembukaan acara dan momen penting',
  },
  {
    level: 'N2',
    title: 'Selama dan Sepanjang',
    focus: '〜限り, 〜限りでは, 〜うちに vs 〜間に (ulasan), 〜以上は, 〜からには',
    context: 'menyatakan komitmen dan batas berlakunya sesuatu',
  },
  {
    level: 'N2',
    title: 'Semata-mata karena',
    focus: '〜ばかりに, 〜あまり, 〜だけに, 〜ことから, 〜ことだから',
    context: 'menjelaskan sebab yang berlebihan atau khas',
  },
  {
    level: 'N2',
    title: 'Nilai dan Kelayakan',
    focus: '〜に値する, 〜かいがある, 〜がいがある, 〜だけのことはある, 〜にすぎない',
    context: 'menilai usaha dan hasil',
  },
  {
    level: 'N2',
    title: 'Kemustahilan dan Kesulitan',
    focus: '〜がたい, 〜かねる, 〜かねない, 〜得る/得ない, 〜っこない',
    context: 'menolak dengan halus dan memperingatkan risiko',
  },
  {
    level: 'N2',
    title: 'Kecenderungan dan Sifat',
    focus: '〜きらいがある, 〜ぎみ, 〜がち (ulasan), 〜っぽい, 〜げ, 〜のもとで',
    context: 'menggambarkan watak dan kecenderungan',
  },
  {
    level: 'N2',
    title: 'Perasaan yang Kuat',
    focus: '〜てたまらない, 〜てならない, 〜てしかたがない, 〜ではいられない',
    context: 'mengungkapkan perasaan yang tak tertahankan',
  },
  {
    level: 'N2',
    title: 'Tepat Saat dan Sedang',
    focus: '〜最中に, 〜ところに/ところへ/ところを, 〜かけの, 〜つつある',
    context: 'menceritakan interupsi dan proses yang berjalan',
  },
  {
    level: 'N2',
    title: 'Tanpa Terkecuali',
    focus: '〜をはじめ, 〜に限らず, 〜のみならず, 〜はもとより, 〜はもちろん',
    context: 'menyebut cakupan yang luas dalam tulisan resmi',
  },
  {
    level: 'N2',
    title: 'Tergantung dan Sesuai',
    focus: '〜によって (empat makna: sebab, pelaku, sarana, variasi), 〜に応じて, 〜に沿って, 〜わりに (ulasan)',
    context: 'menjelaskan aturan yang berbeda menurut keadaan',
  },
  {
    level: 'N2',
    title: 'Dugaan Kuat dan Penekanan',
    focus: '〜に違いない, 〜に決まっている, 〜にほかならない, 〜というものだ, 〜というものではない',
    context: 'menyatakan keyakinan dalam argumen',
  },
  {
    level: 'N2',
    title: 'Dari Sudut Pandang',
    focus: '〜から見ると, 〜からすると, 〜からいうと, 〜上で, 〜において, 〜における',
    context: 'menulis analisis dan laporan',
  },
  {
    level: 'N2',
    title: 'Berturut dan Berulang',
    focus: '〜つつ, 〜ては〜, 〜たび, 〜ごとに, 〜おきに vs 〜ごとに',
    context: 'menceritakan pola yang berulang',
  },
  {
    level: 'N2',
    title: 'Larangan dan Kewajiban Resmi',
    focus: '〜べからず, 〜ないことには, 〜てはならない, 〜まい, 〜ものではない',
    context: 'membaca papan pengumuman dan dokumen resmi',
  },
  {
    level: 'N2',
    title: 'Keigo Bisnis',
    focus: 'Frasa tetap dunia kerja: お世話になっております, 恐れ入りますが, 〜させていただきます, 〜ていただければ幸いです',
    context: 'menulis e-mail bisnis dan menerima telepon kantor',
  },
  {
    level: 'N2',
    title: 'Kata Sifat dan Turunan Kata',
    focus: 'Pembentukan kata: 〜的, 〜性, 〜化, 〜風, 〜上, 〜下, 〜中, 〜済み, 〜込み',
    context: 'membaca istilah di berita dan dokumen',
  },
  {
    level: 'N2',
    title: 'Onomatope',
    focus: '擬音語・擬態語 yang sering muncul: どきどき, わくわく, ばらばら, ぐっすり, うろうろ, ぴったり — beserta pola 〜と/〜する',
    context: 'menghidupkan cerita dan memahami percakapan sehari-hari',
  },
  {
    level: 'N2',
    title: 'Struktur Teks Argumentatif',
    focus: 'Menandai posisi penulis: 〜のではないだろうか, 〜と考えられる, 〜わけである, 〜のである — dan menemukan 主張 dalam teks',
    context: 'membaca kolom opini surat kabar',
  },
  {
    level: 'N2',
    title: 'Strategi 文の組み立て',
    focus: 'Menyusun potongan kalimat berbintang (問題 並べ替え): mengenali pasangan tetap, urutan modifikasi, dan letak partikel',
    context: 'mengerjakan soal menyusun kalimat pada JLPT',
  },
  {
    level: 'N2',
    title: 'Membaca Cepat Teks Panjang',
    focus: 'Strategi 読解 N2: 情報検索 (mencari data di jadwal/brosur), 主張理解 (menangkap pendapat penulis), dan mengelola waktu baca',
    context: 'membaca brosur, jadwal, dan artikel panjang',
  },
]

// ---------------------------------------------------------------------------
// N1 — 22 pelajaran. Bahasa tulis formal, pola kaku (文語), dan nuansa halus.
// ---------------------------------------------------------------------------

const N1: CurriculumEntry[] = [
  {
    level: 'N1',
    title: 'Begitu … Seketika',
    focus: '〜や否や, 〜が早いか, 〜なり, 〜そばから',
    context: 'narasi tulis yang menekankan kecepatan kejadian',
  },
  {
    level: 'N1',
    title: 'Tanpa Menghiraukan',
    focus: '〜をものともせず, 〜をよそに, 〜をおいて, 〜はさておき',
    context: 'menulis tentang perjuangan dan prioritas',
  },
  {
    level: 'N1',
    title: 'Bertumpu pada',
    focus: '〜を踏まえて, 〜に即して, 〜にのっとって, 〜に照らして',
    context: 'menulis dokumen kebijakan dan analisis',
  },
  {
    level: 'N1',
    title: 'Sekaligus Batasan',
    focus: '〜ならでは, 〜ならいざしらず, 〜はまだしも, 〜くらいなら',
    context: 'membandingkan hal yang khas dan yang tak termaafkan',
  },
  {
    level: 'N1',
    title: 'Mustahil Ditahan',
    focus: '〜てやまない, 〜を禁じ得ない, 〜ずにはおかない, 〜てはばからない',
    context: 'tulisan yang menyatakan perasaan mendalam',
  },
  {
    level: 'N1',
    title: 'Puncak dan Batas',
    focus: '〜の極み, 〜の至り, 〜きわまりない, 〜といったらない',
    context: 'pidato dan tulisan yang menekankan tingkat tertinggi',
  },
  {
    level: 'N1',
    title: 'Sudah Semestinya',
    focus: '〜までもない, 〜に難くない, 〜だに, 〜すら',
    context: 'menyatakan hal yang tidak perlu diperdebatkan',
  },
  {
    level: 'N1',
    title: 'Terlepas dari Segalanya',
    focus: '〜いかんによらず, 〜いかんでは, 〜であれ〜であれ, 〜(よ)うが〜まいが',
    context: 'menulis aturan yang berlaku mutlak',
  },
  {
    level: 'N1',
    title: 'Bergantung Sepenuhnya',
    focus: '〜いかんだ, 〜次第だ (ulasan), 〜にかかっている, 〜を余儀なくされる',
    context: 'menjelaskan faktor penentu dalam laporan',
  },
  {
    level: 'N1',
    title: 'Sambil dan Seraya (Tulis)',
    focus: '〜かたわら, 〜かたがた, 〜がてら, 〜つつ (ulasan)',
    context: 'menulis surat resmi dan riwayat kegiatan',
  },
  {
    level: 'N1',
    title: 'Berdasarkan Kedudukan',
    focus: '〜たる, 〜ともあろう, 〜なりに, 〜ながらの',
    context: 'menulis tentang tanggung jawab dan peran',
  },
  {
    level: 'N1',
    title: 'Cukup dan Layak',
    focus: '〜に足る, 〜に堪える/堪えない, 〜にたえない, 〜かいもなく',
    context: 'menilai kualitas dan kepantasan',
  },
  {
    level: 'N1',
    title: 'Bentuk Negatif Kaku',
    focus: '〜まい・〜まいか, 〜ものではない, 〜べくもない, 〜ようがない, 〜っこない (ulasan)',
    context: 'membaca kalimat sangkalan dalam teks formal',
  },
  {
    level: 'N1',
    title: 'Demi dan Menuju',
    focus: '〜べく, 〜んがため(に), 〜をもって, 〜をもってすれば',
    context: 'pengumuman resmi dan tulisan bertujuan',
  },
  {
    level: 'N1',
    title: 'Awal Mula dan Akibat',
    focus: '〜ゆえに, 〜こととて, 〜手前, 〜以上は (ulasan), 〜とあって',
    context: 'menjelaskan sebab dalam gaya tulis formal',
  },
  {
    level: 'N1',
    title: 'Perbandingan Retoris',
    focus: '〜にひきかえ, 〜にもまして, 〜ともなると, 〜ともなれば',
    context: 'menonjolkan perbedaan dalam esai',
  },
  {
    level: 'N1',
    title: 'Keadaan yang Berlanjut',
    focus: '〜ままに, 〜っぱなし, 〜きり, 〜ばかりになっている',
    context: 'menggambarkan keadaan yang dibiarkan',
  },
  {
    level: 'N1',
    title: 'Baru Kali Ini',
    focus: '〜てこそ, 〜てはじめて (ulasan), 〜あっての, 〜ばこそ',
    context: 'menekankan syarat mutlak keberhasilan',
  },
  {
    level: 'N1',
    title: 'Kata Serapan Sino-Jepang',
    focus: '漢語 dan pola bacanya: 音読み majemuk, 〜的/〜性/〜化 (ulasan), kata bentukan 四字熟語 yang umum',
    context: 'membaca teks akademik dan berita',
  },
  {
    level: 'N1',
    title: 'Ungkapan Tetap dan Peribahasa',
    focus: '慣用句 dan 諺 yang sering muncul: 気を配る, 手を打つ, 目を通す, 頭が下がる, 猫の手も借りたい',
    context: 'memahami tulisan dan percakapan penutur asli',
  },
  {
    level: 'N1',
    title: 'Membaca Teks Abstrak',
    focus: 'Strategi 読解 N1: melacak 主語 yang dihilangkan, menandai 逆接 dan 譲歩, dan menyimpulkan sikap penulis dari 文末表現',
    context: 'membaca esai filosofis dan kritik',
  },
  {
    level: 'N1',
    title: 'Seakan-akan Hendak',
    focus: '〜んばかりに, 〜とばかりに, 〜ながらに(して), 〜んとする — menggambarkan sesuatu yang nyaris terjadi atau seolah dikatakan',
    context: 'narasi tulis yang menggambarkan sikap tanpa menyebutnya',
  },
  {
    level: 'N1',
    title: 'Sekali Begitu, Habis Perkara',
    focus: '〜たら最後／〜が最後, 〜とあれば, 〜とあっては, 〜ようによっては',
    context: 'menyatakan akibat yang tak terhindarkan',
  },
  {
    level: 'N1',
    title: 'Sekecil Apa Pun Tidak',
    focus: '〜たりとも〜ない, 〜一つとして〜ない, 〜として〜ない, 〜ひとつ〜ない — penyangkalan yang menyeluruh',
    context: 'pernyataan tegas dalam tulisan resmi',
  },
  {
    level: 'N1',
    title: 'Tanpa Sengaja, Tanpa Sempat',
    focus: '〜ともなく／〜ともなしに, 〜ずじまい, 〜そびれる, 〜損なう',
    context: 'menceritakan hal yang terjadi atau gagal terjadi tanpa disengaja',
  },
  {
    level: 'N1',
    title: 'Larangan Bergaya Klasik',
    focus: '〜べからざる, 〜まじき, 〜にあるまじき, 〜わけにはいくまい',
    context: 'membaca aturan lembaga dan tulisan bernada tegas',
  },
  {
    level: 'N1',
    title: 'Bukan Berarti Begitu',
    focus: '〜ではあるまいし, 〜まいし, 〜わけでもあるまい, 〜でもあるまいに',
    context: 'membantah dugaan lawan bicara secara halus',
  },
  {
    level: 'N1',
    title: 'Justru Karena Itu',
    focus: '〜こそすれ, 〜こそあれ, 〜あればこそ, 〜てこそはじめて',
    context: 'menegaskan satu-satunya sebab yang benar',
  },
  {
    level: 'N1',
    title: 'Sisa Bahasa Klasik',
    focus: '文語の名残: 〜つ〜つ, 〜ごとし／ごとき, 〜なり, 〜あり, 〜べし — masih muncul di judul berita, peribahasa, dan tulisan resmi',
    context: 'membaca judul berita dan kutipan klasik',
  },
  {
    level: 'N1',
    title: 'Menyimak Cepat',
    focus: 'Strategi 聴解 N1: 即時応答 (respons spontan), menangkap 省略 dalam percakapan cepat, dan mencatat poin saat 概要理解',
    context: 'menyimak rapat, siaran, dan wawancara',
  },
]

/**
 * Pemisahan IMBUHAN vs POLA KALIMAT.
 *
 * Dua-duanya "grammar", tapi yang dilatih berbeda dan orang biasanya
 * mengerjakannya dengan cara yang berbeda juga:
 *
 *   imbuhan     — partikel (は・が・を・に・で…) dan perubahan bentuk kata
 *                 (て形, ない形, 受身, 使役, 敬語). Ini bahan yang MENEMPEL
 *                 pada kata lain, dan dikuasai lewat hafalan pola perubahan.
 *   tatabahasa  — pola kalimat: bagaimana potongan-potongan itu disusun jadi
 *                 kalimat yang bermakna. Dikuasai lewat contoh dan latihan.
 *
 * Daftarnya ditulis sebagai judul, bukan ditebak dari isi `focus`, supaya bisa
 * dibaca dan diperiksa sendiri — dan supaya salah tempat bisa diperbaiki tanpa
 * menyentuh 128 entri di atas.
 */
const IMBUHAN = new Set([
  // --- partikel ---
  'Partikel の',
  'Partikel を, で, dan に',
  // --- perubahan bentuk kata kerja & sifat ---
  'Kata Kerja Bentuk ます',
  'Bentuk Lampau ました',
  'Kata Sifat い',
  'Kata Sifat な',
  'Bentuk て',
  'Bentuk ない',
  'Bentuk Kamus',
  'Bentuk た',
  'Bentuk Biasa',
  'Bentuk Potensial',
  'Bentuk Kehendak',
  'Bentuk Pasif',
  'Bentuk Kausatif',
  'Kausatif Pasif',
  'Perintah dan Larangan Keras',
  'Kata Kerja Berpasangan',
  'Keigo: Bahasa Hormat',
  'Keigo: Bahasa Merendah',
  'Bentuk Sopan vs Biasa',
  // --- pembentukan kata ---
  'Kata Sifat dan Turunan Kata',
])

export const JA_GRAMMAR: CurriculumEntry[] = [...N5, ...N4, ...N3, ...N2, ...N1].map((e) => ({
  ...e,
  strand: IMBUHAN.has(e.title) ? 'imbuhan' : 'tatabahasa',
}))

/** Berapa pelajaran yang masuk tiap bagian — untuk diperiksa, bukan dipercaya. */
export function grammarStrandCounts(): Record<string, number> {
  return JA_GRAMMAR.reduce<Record<string, number>>((acc, e) => {
    acc[e.strand!] = (acc[e.strand!] ?? 0) + 1
    return acc
  }, {})
}
