/**
 * PERCAKAPAN MANDARIN — kalimat siap pakai per situasi.
 *
 * Untuk bahasa Korea bagian ini ada karena tingkat tutur; untuk bahasa Mandarin
 * alasannya berbeda, dan justru sering diabaikan: **bahasa Mandarin percakapan
 * hampir tidak sama dengan bahasa Mandarin buku.**
 *
 * Buku mengajarkan 你好 sebagai sapaan. Yang benar-benar diucapkan orang saat
 * bertemu adalah 吃了吗? atau 忙不忙? Buku mengajarkan 是 untuk "iya"; yang
 * dipakai orang adalah mengulang kata kerjanya (去吗? — 去). Buku mengajarkan
 * 再见; teman mengatakan 走了啊 atau 拜拜. Dan seluruh kelompok partikel akhir
 * kalimat — 啊, 呀, 嘛, 呗, 哦 — yang menentukan apakah kalimatmu terdengar
 * ramah atau seperti perintah, tidak pernah muncul di daftar tata bahasa mana
 * pun karena tidak ada aturannya: adanya kebiasaan.
 *
 * Karena itu tiap pelajaran di sini menyebutkan bukan cuma kalimatnya, tapi juga
 * kepada siapa dan seberapa akrab kalimat itu wajar diucapkan.
 */

export type ConversationLesson = {
  level: string
  title: string
  /** ungkapan tetap yang wajib tercakup — ditulis apa adanya */
  focus: string
  context: string
}

export const ZH_CONVERSATION: ConversationLesson[] = [
  // --------------------------------------------------------------- HSK 1
  {
    level: 'HSK1',
    title: 'Menyapa',
    focus:
      '你好 (baku, orang baru) · 您好 (hormat, kepada yang lebih tua atau pelanggan) · ' +
      '早 / 早上好 · 你好吗? yang sebenarnya JARANG dipakai penutur asli · ' +
      '吃了吗? dan 忙不忙? — sapaan yang benar-benar dipakai sehari-hari · 拜拜 · 再见',
    context: 'menyapa dan berpamitan setiap hari',
  },
  {
    level: 'HSK1',
    title: 'Memperkenalkan Diri',
    focus:
      '我叫… · 我姓… (bedanya: 姓 untuk nama keluarga, 叫 untuk nama panggilan) · 我是印尼人 · ' +
      '我在…工作 · 认识你很高兴 · 请多关照 — beserta urutan baku nama Tionghoa (nama keluarga DULU)',
    context: 'perkenalan pertama di kelas atau kantor',
  },
  {
    level: 'HSK1',
    title: 'Terima Kasih dan Maaf',
    focus:
      '谢谢 ↔ 不客气 / 不用谢 · 对不起 ↔ 没关系 · 不好意思 (untuk kerepotan kecil, BUKAN kesalahan besar) · ' +
      '麻烦你了 · 辛苦了 — dan kenapa 对不起 terasa terlalu berat untuk hal sepele',
    context: 'menanggapi bantuan dan kesalahan kecil',
  },
  {
    level: 'HSK1',
    title: 'Menjawab Iya dan Tidak',
    focus:
      'Bahasa Mandarin TIDAK punya kata "iya" yang berdiri sendiri. Jawabannya mengulang kata kerjanya: ' +
      '去吗? — 去 / 不去 · 是不是? — 是 / 不是 · 有吗? — 有 / 没有 · 对 · 好 · 可以 · 行 — ' +
      'dan kapan 嗯 cukup',
    context: 'menjawab pertanyaan tanpa terdengar seperti buku pelajaran',
  },
  {
    level: 'HSK1',
    title: 'Di Restoran',
    focus:
      '服务员! (memanggil pelayan — normal, bukan kasar) · 几位? — 两位 · 我要… · 来一个… · ' +
      '菜单给我看一下 · 不要辣 · 买单 / 结账 · 打包 · 请慢用',
    context: 'memesan makan dari awal sampai bayar',
  },
  {
    level: 'HSK1',
    title: 'Berbelanja',
    focus:
      '这个多少钱? · 太贵了! · 能便宜一点吗? · 有别的颜色吗? · 我可以试试吗? · 能刷卡吗? / 微信可以吗? · 我要这个',
    context: 'membeli barang di pasar dan toko',
  },
  {
    level: 'HSK1',
    title: 'Menanyakan Arah',
    focus:
      '请问，…怎么走? · …在哪儿? · 离这儿远吗? · 一直往前走 · 往左/右转 · 走多久? · 我迷路了',
    context: 'tersesat dan mencari tempat',
  },
  {
    level: 'HSK1',
    title: 'Di Kelas',
    focus:
      '老师，请再说一遍 · 请说慢一点 · 我不懂 · 这个字怎么念? · 用汉语怎么说? · 我有问题 · 对不起，我来晚了',
    context: 'bertahan di kelas bahasa Mandarin',
  },

  // --------------------------------------------------------------- HSK 2
  {
    level: 'HSK2',
    title: 'Bertelepon',
    focus:
      '喂? · 请问，是…吗? · 我找… · 请等一下 · 他不在 · 你是哪位? · 我一会儿再打 · ' +
      '听不清楚 — dan kenapa 喂 di telepon nadanya kedua (wéi), bukan keempat',
    context: 'menelepon kantor dan menitip pesan',
  },
  {
    level: 'HSK2',
    title: 'Membuat Janji',
    focus:
      '你什么时候有时间? · 明天下午怎么样? · 几点见? · 在哪儿见? · 不见不散 · ' +
      '我可能会晚一点 · 改天吧 (menunda dengan halus)',
    context: 'mengatur waktu bertemu',
  },
  {
    level: 'HSK2',
    title: 'Basa-basi Sehari-hari',
    focus:
      '最近怎么样? · 还行 / 老样子 · 好久不见! · 你去哪儿? (pertanyaan sapaan, bukan interogasi) · ' +
      '天气真好 · 慢走 · 有空一起吃饭 — ajakan sopan yang belum tentu jadwal nyata',
    context: 'mengobrol sebentar dengan tetangga dan rekan kerja',
  },
  {
    level: 'HSK2',
    title: 'Di Rumah Orang',
    focus:
      '打扰了 · 请进 · 随便坐 · 喝点什么? · 不用麻烦 · 别客气 · 我该走了 · 下次再来 — ' +
      'termasuk kebiasaan menolak tawaran sekali dulu sebelum menerima',
    context: 'bertamu dan menerima tamu',
  },
  {
    level: 'HSK2',
    title: 'Naik Kendaraan',
    focus:
      '师傅，去…· 到了叫我一下 · 麻烦停一下 · 这趟车去…吗? · 我要下车 · 打车 vs 坐地铁 · ' +
      '扫码上车',
    context: 'taksi, bus, dan kereta bawah tanah',
  },
  {
    level: 'HSK2',
    title: 'Ke Dokter',
    focus:
      '我不舒服 · 我头疼 / 肚子疼 · 我发烧了 · 从什么时候开始的? · 我对…过敏 · ' +
      '一天吃几次? · 饭前还是饭后?',
    context: 'menjelaskan keluhan dan memahami resep',
  },

  // --------------------------------------------------------------- HSK 3
  {
    level: 'HSK3',
    title: 'Meminta dan Menolak',
    focus:
      '能帮我一个忙吗? · 麻烦你… · 可以…吗? · 恐怕不行 · 我看看吧 (penolakan halus yang ' +
      'terdengar seperti pertimbangan) · 下次一定 · 我尽量',
    context: 'meminta bantuan dan menolak tanpa menyinggung',
  },
  {
    level: 'HSK3',
    title: 'Menyampaikan Pendapat',
    focus:
      '我觉得… · 我认为… (lebih formal) · 在我看来… · 你说得对 · 我不太同意 · 那倒是 · ' +
      '看情况 — dan kenapa 我不同意 terdengar lebih keras daripada yang kamu maksud',
    context: 'diskusi santai dan rapat kecil',
  },
  {
    level: 'HSK3',
    title: 'Partikel Akhir Kalimat',
    focus:
      '吧 (usul/dugaan: 走吧, 是他吧) · 呢 (balik bertanya: 你呢?) · 啊/呀 (melembutkan) · ' +
      '嘛 (sudah jelas: 他还小嘛) · 了 (perubahan keadaan: 我知道了) · 哦/噢 — ' +
      'tidak ada aturannya, adanya kebiasaan, dan tanpa ini kalimatmu terdengar seperti perintah',
    context: 'membuat kalimat terdengar wajar, bukan kaku',
  },
  {
    level: 'HSK3',
    title: 'Di Bank dan Kantor Pos',
    focus:
      '我要开户 · 取钱 / 存钱 · 汇款 · 请填这张表 · 请出示护照 · 寄到印尼多少钱? · ' +
      '大概几天能到?',
    context: 'urusan administrasi sehari-hari',
  },
  {
    level: 'HSK3',
    title: 'Menyewa Tempat Tinggal',
    focus:
      '房租多少? · 押金几个月? · 包水电吗? · 可以看房吗? · 什么时候能搬进来? · 有家具吗? · ' +
      '合同签几年?',
    context: 'mencari tempat tinggal',
  },
  {
    level: 'HSK3',
    title: 'Memuji dan Menanggapi Pujian',
    focus:
      '你汉语说得真好! ↔ 哪里哪里 / 还差得远呢 (merendah, bukan berterima kasih) · 太厉害了 · ' +
      '不错 · 一般一般 — kebiasaan menolak pujian yang bagi penutur Indonesia terasa aneh',
    context: 'menanggapi pujian dengan cara yang wajar di Tiongkok',
  },

  // --------------------------------------------------------------- HSK 4
  {
    level: 'HSK4',
    title: 'Wawancara Kerja',
    focus:
      '请介绍一下自己 · 我的优点是… · 我的缺点是… · 为什么想来我们公司? · 期望薪资 · ' +
      '什么时候能上班? · 请问还有别的问题吗?',
    context: 'melamar kerja dalam bahasa Mandarin',
  },
  {
    level: 'HSK4',
    title: 'Rapat dan Kerja Sama',
    focus:
      '我先说明一下情况 · 关于这个问题… · 我补充一点 · 你的意思是…? · 我们再讨论一下 · ' +
      '就这样定了 · 麻烦你跟进一下',
    context: 'rapat kantor dan koordinasi kerja',
  },
  {
    level: 'HSK4',
    title: 'Mengeluh dan Menyelesaikan Masalah',
    focus:
      '我想投诉 · 这不是我要的 · 能不能换一个? · 我要退货 · 这是你们的问题 · ' +
      '我理解，但是… · 请给我一个说法',
    context: 'komplain di toko, hotel, dan layanan',
  },
  {
    level: 'HSK4',
    title: 'Menyampaikan Kabar Baik dan Buruk',
    focus:
      '恭喜你! · 太好了! · 真替你高兴 · 别难过 · 想开点 · 慢慢会好的 · 有什么需要帮忙的吗? · ' +
      '请多保重',
    context: 'mengucapkan selamat dan menghibur',
  },
  {
    level: 'HSK4',
    title: 'Adat dan Etiket',
    focus:
      '敬酒: 我敬你一杯 · 干杯 vs 随意 · duduk di meja bundar dan siapa yang di kursi utama · ' +
      '给红包 · 送礼 yang tidak boleh (jam dinding, sepatu, angka 4) · 谁请客',
    context: 'jamuan makan, pernikahan, dan kunjungan hari raya',
  },

  // --------------------------------------------------------------- HSK 5
  {
    level: 'HSK5',
    title: 'Berdebat dengan Sopan',
    focus:
      '话是这么说，但是… · 我不这么看 · 这个说法有点绝对 · 恕我直言 · 换个角度想 · ' +
      '我们各持己见吧 — mempertahankan pendapat tanpa memutus hubungan',
    context: 'diskusi serius dan debat',
  },
  {
    level: 'HSK5',
    title: 'Presentasi dan Pidato',
    focus:
      '各位好，我今天要讲的是… · 首先…其次…最后… · 具体来说 · 正如大家所知 · ' +
      '总结一下 · 谢谢大家，欢迎提问',
    context: 'presentasi kerja dan kuliah',
  },
  {
    level: 'HSK5',
    title: 'Bahasa Lisan Anak Muda',
    focus:
      '真的假的? · 不至于吧 · 太夸张了 · 差不多得了 · 没毛病 · 靠谱 · 无语 · ' +
      'ragam internet (yyds, 破防) dan kenapa itu TIDAK boleh dipakai di 写作',
    context: 'memahami drama, variety show, dan obrolan sehari-hari',
  },

  // --------------------------------------------------------------- HSK 6
  {
    level: 'HSK6',
    title: 'Ragam Formal dan Basa-basi Resmi',
    focus:
      '久仰大名 · 承蒙关照 · 不胜感激 · 敬请指教 · 恕不远送 · 略备薄酒 — ' +
      'ungkapan resmi yang masih hidup di surat, jamuan, dan pidato',
    context: 'acara resmi, surat bisnis, dan pertemuan pertama yang formal',
  },
  {
    level: 'HSK6',
    title: 'Maksud Tersirat',
    focus:
      'Kalimat yang artinya bukan bunyinya: 我考虑考虑 (= tidak) · 有点儿难 (= tidak bisa) · ' +
      '你看着办吧 (= kamu yang tanggung) · 意思是不是有点… · 反问句 (谁说不是呢?) — ' +
      'dan kenapa jawaban langsung "tidak" jarang terdengar',
    context: 'membaca maksud di balik kalimat sopan',
  },
]
