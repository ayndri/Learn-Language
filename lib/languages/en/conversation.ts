/**
 * PERCAKAPAN INGGRIS — kalimat siap pakai per situasi.
 *
 * Dipisah dari `foundations.ts` supaya bentuknya sama dengan empat bahasa lain:
 * satu folder per bahasa, satu berkas per jenis bahan. Sebelumnya seluruh
 * percakapan Inggris menumpang di berkas bernama "pondasi" bersama tabel IPA dan
 * daftar sufiks — tiga jenis bahan yang tidak sejenis dalam satu berkas.
 *
 * Bagian ini menutup lubang yang nyata: kurikulum grammar mengajarkan present
 * perfect sebagai POLA, tapi tidak pernah mengajarkan bahwa jawaban wajar untuk
 * "How are you?" bukan penjelasan panjang tentang kesehatanmu.
 *
 * Levelnya menandakan kapan situasinya WAJAR dihadapi, bukan kesulitan
 * gramatikalnya.
 */

export type ConversationLesson = {
  level: string
  title: string
  /** ungkapan tetap yang wajib tercakup — ditulis apa adanya */
  focus: string
  context: string
}

export const EN_CONVERSATION: ConversationLesson[] = [
  {
    level: 'A1',
    title: 'Menyapa dan Berpamitan',
    focus:
      'Hi / Hello / Good morning · How are you? — Fine, thanks. And you? · See you later / Take care / ' +
      'Have a good day — dan kenapa "How are you?" bukan pertanyaan sungguhan',
    context: 'bertemu orang setiap hari',
  },
  {
    level: 'A1',
    title: 'Memperkenalkan Diri',
    focus:
      "I'm … / My name is … · Nice to meet you — Nice to meet you too · I'm from … · I live in … · " +
      'This is my friend … — urutan bakunya',
    context: 'hari pertama di kelas atau kantor baru',
  },
  {
    level: 'A1',
    title: 'Menyebut Pekerjaan',
    focus:
      "What do you do? — I'm a teacher / I work as … / I work for … / I work in … · I'm studying … · " +
      "Beda 'I'm a student' dan 'I study'",
    context: 'basa-basi yang selalu muncul saat berkenalan',
  },
  {
    level: 'A1',
    title: 'Meminta dan Berterima Kasih',
    focus:
      'Can I have …? / Could you …? / Would you mind …? · Thank you — You’re welcome / No problem / ' +
      'Don’t mention it · Sorry vs Excuse me',
    context: 'permintaan kecil sehari-hari',
  },
  {
    level: 'A2',
    title: 'Di Toko',
    focus:
      'Can I help you? — I’m just looking, thanks · How much is it? · Do you have this in a larger size? · ' +
      'I’ll take it · Can I pay by card?',
    context: 'berbelanja tanpa gugup',
  },
  {
    level: 'A2',
    title: 'Di Restoran',
    focus:
      'A table for two, please · Are you ready to order? · I’ll have … · Could we get the bill, please? · ' +
      'Anything to drink? — Just water, thanks',
    context: 'memesan makanan dari awal sampai bayar',
  },
  {
    level: 'A2',
    title: 'Menanyakan Arah',
    focus:
      'Excuse me, how do I get to …? · Is it far? · Go straight on · Turn left at the corner · ' +
      'It’s opposite the bank · You can’t miss it',
    context: 'tersesat di kota asing',
  },
  {
    level: 'A2',
    title: 'Bertelepon',
    focus:
      'Hello, this is … · Can I speak to …? · Speaking · Could you hold on a moment? · ' +
      'Can I take a message? · Sorry, you’re breaking up',
    context: 'menelepon kantor atau layanan',
  },
  {
    level: 'A2',
    title: 'Membuat Janji',
    focus:
      'Are you free on Friday? · Does 3 p.m. work for you? · I’m afraid I can’t make it · ' +
      'Can we reschedule? · Let’s say Tuesday then',
    context: 'mengatur waktu bertemu',
  },
  {
    level: 'A2',
    title: 'Obrolan Ringan',
    focus:
      'Small talk: cuaca, akhir pekan, perjalanan · Really? / That’s interesting / Same here / ' +
      'I know what you mean — cara menanggapi supaya percakapan jalan',
    context: 'mengisi keheningan di lift dan antrean',
  },
  {
    level: 'B1',
    title: 'Menyampaikan Pendapat',
    focus:
      'In my opinion / I think / It seems to me · I see your point, but … · That’s a good point · ' +
      'I’m not sure I agree · setuju dan tidak setuju tanpa terdengar kasar',
    context: 'diskusi kelas atau rapat kecil',
  },
  {
    level: 'B1',
    title: 'Meminta Maaf dan Menjelaskan',
    focus:
      'I’m really sorry about … · It was my fault · I didn’t mean to … · It won’t happen again · ' +
      'beda I’m sorry (menyesal) dan I apologise (resmi)',
    context: 'kesalahan yang perlu diperbaiki',
  },
  {
    level: 'B1',
    title: 'Menyampaikan Keluhan',
    focus:
      'I’m afraid there’s a problem with … · This isn’t what I ordered · Could you look into it? · ' +
      'I’d like a refund · komplain tegas tapi sopan',
    context: 'barang rusak atau layanan buruk',
  },
  {
    level: 'B1',
    title: 'Menolak dengan Halus',
    focus:
      'I’d love to, but … · That’s very kind, but I’ll pass · I’m afraid I can’t · Maybe another time · ' +
      'kenapa "no" telanjang terdengar kasar dalam bahasa Inggris',
    context: 'menolak ajakan dan permintaan',
  },
  {
    level: 'B1',
    title: 'Bercerita',
    focus:
      'Guess what happened · So, basically … · Anyway, … · To cut a long story short · ' +
      'penanda urutan: first, then, after that, in the end',
    context: 'menceritakan pengalaman ke teman',
  },
  {
    level: 'B2',
    title: 'Rapat dan Presentasi',
    focus:
      'Shall we get started? · Let me walk you through … · As you can see from this chart … · ' +
      'To sum up · Does anyone have any questions?',
    context: 'memimpin dan mengikuti rapat',
  },
  {
    level: 'B2',
    title: 'E-mail Profesional',
    focus:
      'Dear … / Hi … · I’m writing regarding … · Please find attached … · I’d appreciate it if you could … · ' +
      'Best regards / Kind regards — dan kapan memakai yang mana',
    context: 'surel kerja dan akademik',
  },
  {
    level: 'B2',
    title: 'Bernegosiasi',
    focus:
      'Would you consider …? · How about we meet in the middle? · That works for us · ' +
      'I’m afraid that’s not feasible · Let’s revisit this later',
    context: 'menyepakati harga, jadwal, dan lingkup kerja',
  },
  {
    level: 'B2',
    title: 'Diskusi Akademik',
    focus:
      'Building on what you said … · I’d like to challenge that assumption · Could you clarify what you mean by …? · ' +
      'That raises an interesting question',
    context: 'seminar dan diskusi kelas pascasarjana',
  },
  {
    level: 'C1',
    title: 'Berbicara dengan Hati-hati',
    focus:
      'Hedging lisan: I’d say … · It might be worth … · Correct me if I’m wrong, but … · ' +
      'I’m inclined to think … · menyampaikan ketidaksetujuan tanpa konfrontasi',
    context: 'rapat dengan atasan atau klien',
  },
  {
    level: 'C1',
    title: 'Mengarahkan Percakapan',
    focus:
      'If I could just come back to … · Before we move on … · Let’s park that for now · ' +
      'To play devil’s advocate … · memotong dan mengembalikan topik',
    context: 'diskusi panjang yang mulai melebar',
  },
  {
    level: 'C1',
    title: 'Humor dan Nada Bicara',
    focus:
      'Understatement (not bad = bagus), sarkasme, self-deprecation, dan penanda bercanda — ' +
      'salah baca nada adalah kesalahan yang paling tidak terasa',
    context: 'ngobrol santai dengan penutur asli',
  },
  {
    level: 'C2',
    title: 'Pidato dan Berbicara di Depan Umum',
    focus:
      'Pembuka yang mengikat, tricolon (rule of three), rhetorical question, callback, dan penutup yang menggema',
    context: 'presentasi konferensi dan pidato',
  },

  // ==========================================================================
  // KERJA & KARIER
  //
  // Bagian terbesar di berkas ini, dan itu disengaja: untuk pelajar Indonesia,
  // inilah alasan paling sering di balik "kenapa aku belajar bahasa Inggris" —
  // wawancara kerja, beasiswa, dan rapat dengan orang asing.
  //
  // Sebelumnya seluruh urusan ini diwakili SATU pelajaran B2 berisi lima
  // kalimat ("Tell me about yourself", dst). Itu tidak cukup, dan
  // ketidakcukupannya punya bentuk yang jelas: wawancara bukan satu situasi
  // melainkan RANGKAIAN yang masing-masing punya bahasanya sendiri — melamar,
  // basa-basi sebelum mulai, pertanyaan perilaku, pertanyaan kelemahan,
  // menanyakan balik, menawar gaji, menindaklanjuti. Menggabungkannya jadi satu
  // pelajaran berarti kamu berlatih pembukaannya lalu ditinggalkan tepat di
  // bagian yang paling menentukan.
  //
  // Tiga di antaranya ditaruh di B1, bukan B2: mencari kerja tidak menunggu
  // sampai bahasa Inggrismu bagus, dan justru pelamar B1 yang paling butuh
  // kalimat siap pakai.
  // ==========================================================================
  {
    level: 'B1',
    title: 'Melamar dan Menanyakan Lowongan',
    focus:
      'I am writing to apply for the position of … · I came across your job posting on … · ' +
      'I believe I would be a good fit because … · Please find my CV attached · ' +
      'I look forward to hearing from you — beserta beda CV (Inggris) dan résumé (Amerika)',
    context: 'surat lamaran dan pesan pertama ke perekrut',
  },
  {
    level: 'B1',
    title: 'Menceritakan Pengalaman Kerja',
    focus:
      'I have been working as … for three years (masih berjalan) vs I worked as … (sudah selesai) — ' +
      'pilihan kala di sini mengubah artinya, bukan cuma gayanya · I was responsible for … · ' +
      'I led a team of … · My role involves … · I am currently …',
    context: 'menjelaskan riwayat kerja tanpa salah kala',
  },
  {
    level: 'B1',
    title: 'Basa-basi Sebelum Wawancara',
    focus:
      'Thanks for having me · Did you find the office okay? — Yes, no trouble at all · ' +
      'How long have you been with the company? · Lovely office — dan kenapa lima menit ini ' +
      'ikut dinilai walaupun bukan bagian dari daftar pertanyaannya',
    context: 'lift, ruang tunggu, dan jalan ke ruang wawancara',
  },
  {
    level: 'B2',
    title: 'Wawancara: Membuka Diri',
    focus:
      'Tell me about yourself — dijawab dengan urutan sekarang → dulu → kenapa di sini, bukan ' +
      'riwayat hidup dari sekolah · Why do you want to work here? · Why are you leaving your ' +
      'current job? (dan cara menjawabnya tanpa menjelekkan tempat lama) · What do you know about us?',
    context: 'sepuluh menit pertama yang menentukan sisa wawancaranya',
  },
  {
    level: 'B2',
    title: 'Wawancara: Pertanyaan Perilaku',
    focus:
      'Tell me about a time when … · Give me an example of … · How did you handle …? — dijawab ' +
      'dengan pola STAR (Situation, Task, Action, Result). Bahasa yang menandai tiap bagiannya: ' +
      'At the time … · My job was to … · So what I did was … · As a result …',
    context: 'jenis pertanyaan tersering, dan yang paling sering dijawab melebar',
  },
  {
    level: 'B2',
    title: 'Wawancara: Kelemahan dan Kegagalan',
    focus:
      'What is your greatest weakness? · Tell me about a time you failed · ' +
      'I used to struggle with …, so I started … (polanya: kelemahan nyata + apa yang kamu lakukan) · ' +
      'In hindsight, I should have … · What I took away from it was … — dan kenapa ' +
      '"I am a perfectionist" terdengar seperti menghindari pertanyaannya',
    context: 'pertanyaan yang paling sulit dijawab jujur tanpa merugikan diri',
  },
  {
    level: 'B2',
    title: 'Wawancara: Menanyakan Balik',
    focus:
      'Do you have any questions for us? — dan kenapa "No" adalah jawaban terburuk · ' +
      'What does success look like in this role? · How would you describe the team culture? · ' +
      'What are the next steps? · When can I expect to hear back?',
    context: 'lima menit terakhir, yang paling sering disia-siakan',
  },
  {
    level: 'B2',
    title: 'Wawancara Daring',
    focus:
      'You are on mute · Sorry, you cut out for a second — could you repeat that? · ' +
      'Can you still hear me? · Let me share my screen · My connection is a bit unstable · ' +
      'Shall I carry on? — kalimat yang tidak ada di buku mana pun tapi selalu dibutuhkan',
    context: 'wawancara dan rapat lewat Zoom atau Google Meet',
  },
  {
    level: 'B2',
    title: 'Menindaklanjuti Lamaran',
    focus:
      'Thank you for taking the time to speak with me · I wanted to follow up on my application · ' +
      'I just wanted to check in on the status of … · I am still very interested in the role · ' +
      'Please let me know if you need anything further from me',
    context: 'e-mail terima kasih dan menagih kabar tanpa terdengar mendesak',
  },
  {
    level: 'B2',
    title: 'Hari Pertama dan Perkenalan Tim',
    focus:
      'I have just joined the … team · I will be working on … · Who should I speak to about …? · ' +
      'Could you point me in the right direction? · Sorry, I am still finding my feet · ' +
      'Do you have five minutes to walk me through …?',
    context: 'minggu pertama di tempat kerja baru',
  },
  {
    level: 'B2',
    title: 'Laporan Progres Harian',
    focus:
      'Yesterday I finished … · Today I am working on … · I am blocked on … · ' +
      'It is on track / It has slipped a bit · I will need another day · ' +
      'Nothing to report from me — pola standup yang dipakai hampir semua tim',
    context: 'standup harian dan laporan mingguan',
  },
  {
    level: 'B2',
    title: 'Umpan Balik: Memberi dan Menerima',
    focus:
      'Do you mind if I share some feedback? · One thing I would suggest is … · ' +
      'Have you considered …? (saran yang tidak terdengar perintah) · ' +
      'That is fair, I had not thought of that · Thanks for flagging that · Point taken',
    context: 'koreksi pekerjaan, review, dan cara menanggapinya',
  },
  {
    level: 'C1',
    title: 'Menawar Gaji dan Tawaran Kerja',
    focus:
      'What are your salary expectations? — dan cara mengembalikan pertanyaannya: ' +
      'What range do you have in mind for this role? · Based on my experience, I was looking at … · ' +
      'Is there any flexibility on that? · Could we look at the whole package? · ' +
      'I would like a couple of days to consider it',
    context: 'percakapan yang paling menentukan angka di kontrakmu',
  },
  {
    level: 'C1',
    title: 'Penilaian Kinerja dan Promosi',
    focus:
      'I would like to talk about my development · Over the past year I have … · ' +
      'I feel ready to take on more responsibility · What would I need to demonstrate to …? · ' +
      'Where do you see me in twelve months? — bahasa yang meminta tanpa menuntut',
    context: 'performance review dan meminta kenaikan jabatan',
  },
  {
    level: 'C1',
    title: 'Ketidaksepakatan di Tempat Kerja',
    focus:
      'I see it slightly differently · I am not sure that is the whole picture · ' +
      'Help me understand the reasoning behind … · Can we agree to revisit this next week? · ' +
      'I will go along with it, but I want to flag one risk — menolak tanpa memutus hubungan',
    context: 'rapat yang mulai memanas',
  },
  {
    level: 'C1',
    title: 'Mengundurkan Diri dan Referensi',
    focus:
      'I have decided to move on · My last day will be … · I am happy to help with the handover · ' +
      'Would you be willing to act as a reference for me? · I have really valued my time here — ' +
      'dan kenapa nada di sini menentukan referensimu bertahun-tahun ke depan',
    context: 'keluar dari pekerjaan tanpa membakar jembatan',
  },
  {
    level: 'C1',
    title: 'Membangun Jaringan',
    focus:
      'What do you do? — dan cara menjawabnya dalam satu kalimat yang mengundang lanjutan · ' +
      'How do you two know each other? · I would love to pick your brain about … · ' +
      'Shall we swap details? · It was great to meet you — I will drop you a line',
    context: 'konferensi, seminar, dan acara industri',
  },
]
