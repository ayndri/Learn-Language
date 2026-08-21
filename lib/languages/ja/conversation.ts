/**
 * PERCAKAPAN — kalimat siap pakai per situasi.
 *
 * Bagian ini ada karena satu lubang yang nyata: kurikulum grammar mengajarkan
 * 〜てもいいですか sebagai POLA, tapi tidak pernah mengajarkan bahwa waktu
 * masuk ruangan orang Jepang bilang 失礼します — dan yang kedua justru yang
 * dipakai setiap hari.
 *
 * Yang dilatih di sini bukan aturan, tapi UCAPAN: rangkaian tetap yang
 * memang keluar dari mulut penutur asli di situasi tertentu, beserta tingkat
 * kesopanannya. Karena itu jenis latihannya pun berbeda — tidak ada soal
 * mengisi lubang, yang ada ungkapan, terjemahan kalimat, dikte, dan berbicara.
 *
 * Levelnya menandakan kapan situasinya WAJAR dihadapi, bukan kesulitan
 * gramatikalnya: 敬語 di wawancara kerja ditaruh di N3 bukan karena polanya
 * sulit, tapi karena sebelum itu kamu belum punya kosakata untuk isinya.
 */

export type ConversationLesson = {
  level: string
  title: string
  /** ungkapan tetap yang wajib tercakup — ditulis apa adanya */
  focus: string
  context: string
}

export const JA_CONVERSATION: ConversationLesson[] = [
  // ------------------------------------------------------------------ N5
  {
    level: 'N5',
    title: 'Menyapa Sehari-hari',
    focus:
      'おはようございます／こんにちは／こんばんは／おやすみなさい, いってきます↔いってらっしゃい, ' +
      'ただいま↔おかえりなさい — termasuk siapa mengucapkan yang mana',
    context: 'keluar-masuk rumah dan menyapa orang sepanjang hari',
  },
  {
    level: 'N5',
    title: 'Memperkenalkan Diri',
    focus:
      'はじめまして。〜と申します／〜です。〜から来ました。〜に住んでいます。どうぞよろしくお願いします。 ' +
      '— urutan bakunya: nama, asal, kegiatan, penutup',
    context: 'perkenalan pertama di kelas atau tempat kerja baru',
  },
  {
    level: 'N5',
    title: 'Menyebut Pekerjaan',
    focus:
      '〜の仕事をしています。〜で働いています。〜をしています。 dengan nama profesi: 学生・会社員・' +
      '先生・医者・看護師・エンジニア・店員・主婦・公務員',
    context: 'ditanya "お仕事は何ですか" dan menjawabnya dengan wajar',
  },
  {
    level: 'N5',
    title: 'Terima Kasih dan Maaf',
    focus:
      'ありがとうございます↔どういたしまして, すみません (3 fungsi: maaf, permisi, terima kasih), ' +
      'ごめんなさい, 大丈夫です — beda すみません dan ごめんなさい',
    context: 'menanggapi bantuan dan kesalahan kecil',
  },
  {
    level: 'N5',
    title: 'Di Kelas',
    focus:
      'もう一度お願いします。ゆっくり話してください。わかりません。質問があります。' +
      '〜は日本語で何と言いますか。すみません、遅れました。',
    context: 'bertahan di kelas bahasa Jepang tanpa diam saja',
  },
  {
    level: 'N5',
    title: 'Di Toko dan Restoran',
    focus:
      'いらっしゃいませ, 〜をください／お願いします, これはいくらですか, ' +
      'メニューをお願いします, お会計お願いします, ごちそうさまでした',
    context: 'belanja di konbini dan makan di kedai',
  },
  {
    level: 'N5',
    title: 'Menanyakan Arah',
    focus:
      'すみません、〜はどこですか。まっすぐ行ってください。右／左に曲がってください。' +
      '〜のとなりです。ここから遠いですか。',
    context: 'tersesat di stasiun atau mencari alamat',
  },
  {
    level: 'N5',
    title: 'Angka, Harga, dan Waktu',
    focus:
      'いくらですか／何時ですか／何分かかりますか, membaca 〜円・〜時・〜分・〜人, ' +
      'dan 一つ・二つ saat memesan',
    context: 'transaksi dan janji yang menyebut angka',
  },
  {
    level: 'N5',
    title: 'Mengajak dan Menolak',
    focus:
      '一緒に〜ませんか。いいですね、行きましょう。すみません、ちょっと…（menolak tanpa berkata tidak）。' +
      'また今度お願いします。',
    context: 'mengajak teman dan menolak ajakan tanpa menyinggung',
  },
  {
    level: 'N5',
    title: 'Basa-basi Ringan',
    focus:
      '相づち: そうですか／そうですね／なるほど／本当ですか, obrolan cuaca 今日は暑いですね, ' +
      'dan お先に失礼します saat pulang duluan',
    context: 'mengisi percakapan supaya tidak terasa kaku',
  },

  // ------------------------------------------------------------------ N4
  {
    level: 'N4',
    title: 'Bertelepon',
    focus:
      'もしもし／〜と申しますが, 〜さんはいらっしゃいますか, 少々お待ちください, ' +
      'また後でかけ直します, 伝言をお願いできますか',
    context: 'menelepon kantor atau tempat kursus',
  },
  {
    level: 'N4',
    title: 'Meminta Tolong dengan Sopan',
    focus:
      '〜ていただけませんか／〜てくださいませんか／〜てもらえますか, ' +
      'すみませんが、お願いがあるんですが — bertingkat dari kasual ke sangat sopan',
    context: 'minta tolong ke orang yang lebih tua atau atasan',
  },
  {
    level: 'N4',
    title: 'Meminta Izin',
    focus:
      '〜てもいいですか／〜させていただけませんか, 入ってもいいですか, 早退してもよろしいでしょうか, ' +
      'dan 失礼します saat masuk-keluar ruangan',
    context: 'izin di kantor, kelas, dan tempat umum',
  },
  {
    level: 'N4',
    title: 'Di Stasiun dan Perjalanan',
    focus:
      '〜行きはどのホームですか, 乗り換えはどこですか, 切符を買いたいんですが, ' +
      '終電は何時ですか, この電車は〜に止まりますか',
    context: 'naik kereta di Jepang tanpa panik',
  },
  {
    level: 'N4',
    title: 'Di Klinik',
    focus:
      '〜が痛いです, 熱があります, 気分が悪いです, いつからですか, 薬をもらえますか, お大事に',
    context: 'menjelaskan keluhan ke dokter dan apotek',
  },
  {
    level: 'N4',
    title: 'Membuat Janji',
    focus:
      '都合はいかがですか, 〜はどうですか, その日はちょっと…, では〜にしましょう, 楽しみにしています',
    context: 'menentukan waktu bertemu lewat pesan atau telepon',
  },
  {
    level: 'N4',
    title: 'Meminta Maaf Serius',
    focus:
      '申し訳ありません／申し訳ございません, ご迷惑をおかけしました, 以後気をつけます — ' +
      'beda tingkatnya dengan すみません',
    context: 'kesalahan di tempat kerja atau keterlambatan penting',
  },
  {
    level: 'N4',
    title: 'Memberi Selamat dan Simpati',
    focus:
      'おめでとうございます, よかったですね, お疲れさまでした, 大変でしたね, 元気を出してください',
    context: 'menanggapi kabar baik dan buruk dari orang lain',
  },

  // ------------------------------------------------------------------ N3
  {
    level: 'N3',
    title: 'Wawancara Kerja',
    focus:
      '本日はお時間をいただきありがとうございます, 〜に興味を持ちました, ' +
      '〜の経験がございます, 精一杯努力いたします — 謙譲語 dalam kalimat utuh',
    context: 'wawancara kerja atau beasiswa dalam bahasa Jepang',
  },
  {
    level: 'N3',
    title: 'E-mail Bisnis',
    focus:
      'いつもお世話になっております, 〜の件でご連絡いたしました, ご確認のほどよろしくお願いいたします, ' +
      '恐れ入りますが — struktur pembuka, isi, penutup',
    context: 'menulis surel resmi ke perusahaan Jepang',
  },
  {
    level: 'N3',
    title: 'Menyampaikan Keluhan',
    focus:
      '実は〜のことなんですが, 〜ていただけると助かるのですが, 困っております — ' +
      'menyampaikan masalah tanpa menyalahkan langsung',
    context: 'komplain barang rusak atau tetangga berisik',
  },
  {
    title: 'Menyampaikan Pendapat',
    level: 'N3',
    focus:
      '〜と思います／〜のではないでしょうか, 確かに〜ですが, その代わり〜, ' +
      'おっしゃることはわかりますが — setuju dan tidak setuju secara halus',
    context: 'diskusi di kelas atau rapat kecil',
  },
  {
    level: 'N3',
    title: 'Obrolan Santai',
    focus:
      'Bentuk lisan: 〜じゃん／〜だよね／〜っていうか／マジで／なんか, ' +
      'dan kapan bentuk ini WAJAR — sesama teman, bukan ke atasan',
    context: 'ngobrol dengan teman sebaya dan memahami drama',
  },
  {
    level: 'N3',
    title: 'Pesan Singkat dan Media Sosial',
    focus:
      'Gaya tulis pendek: 了解です／承知しました, ありがとう〜, ごめん、遅れる, ' +
      'singkatan lazim dan tanda baca yang dipakai di LINE',
    context: 'berbalas pesan singkat sehari-hari',
  },

  // ------------------------------------------------------------------ N2
  {
    level: 'N2',
    title: 'Berbicara di Rapat',
    focus:
      'よろしいでしょうか, 〜について申し上げますと, 一点確認させてください, ' +
      'おっしゃる通りですが, 引き取らせていただきます — menyela dan menanggapi secara sopan',
    context: 'rapat kerja dan diskusi proyek',
  },
  {
    level: 'N2',
    title: 'Presentasi',
    focus:
      '本日は〜についてお話しします, まず／次に／最後に, こちらの図をご覧ください, ' +
      '以上で発表を終わります, ご清聴ありがとうございました',
    context: 'presentasi di kantor atau kampus',
  },
  {
    level: 'N2',
    title: 'Melayani Pelanggan',
    focus:
      '恐れ入りますが, あいにく〜ておりまして, 少々お時間をいただけますでしょうか, ' +
      'ご不便をおかけして申し訳ございません, かしこまりました',
    context: 'menghadapi pelanggan dan tamu',
  },
  {
    level: 'N2',
    title: 'Menawar dan Bernegosiasi',
    focus:
      'ご検討いただけますでしょうか, 〜であれば可能かと存じます, 難しいところでございます, ' +
      '折り合いをつける, 前向きに検討します（dan apa artinya sebenarnya）',
    context: 'membahas harga, tenggat, dan lingkup kerja',
  },

  // ------------------------------------------------------------------ N1
  {
    level: 'N1',
    title: 'Pidato dan Sambutan',
    focus:
      '本日はお忙しい中お集まりいただき誠にありがとうございます, 僭越ながら, ' +
      '一言ご挨拶申し上げます, 末筆ながら皆様のご健勝をお祈りいたします',
    context: 'sambutan acara, pernikahan, dan perpisahan',
  },
  {
    level: 'N1',
    title: 'Memimpin Diskusi',
    focus:
      'では〜さん、いかがでしょうか, 論点を整理しますと, 話を戻しますが, ' +
      '時間の都合上, 本題に入らせていただきます',
    context: 'menjadi moderator rapat atau seminar',
  },
  {
    level: 'N1',
    title: 'Keigo yang Rumit',
    focus:
      'Memilih di antara 尊敬・謙譲・丁重語 dalam satu kalimat panjang, 二重敬語 yang harus dihindari, ' +
      'dan 身内敬語 (tidak memuliakan orang dalam sendiri di depan orang luar)',
    context: 'bicara mewakili perusahaan ke pihak luar',
  },
  {
    level: 'N1',
    title: 'Wawancara dan Liputan',
    focus:
      '差し支えなければ〜, 〜とおっしゃいますと, 具体的にはいかがでしょうか, ' +
      '貴重なお話をありがとうございました — menggali jawaban tanpa memaksa',
    context: 'mewawancarai narasumber atau diwawancarai media',
  },
]
