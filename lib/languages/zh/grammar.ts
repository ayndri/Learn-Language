import type { CurriculumEntry } from '@/lib/languages/curriculum'

/**
 * KURIKULUM TATA BAHASA MANDARIN — HSK 1 → HSK 6
 *
 * Ditulis sebagai data dengan alasan yang sama seperti Inggris, Jepang, dan
 * Korea: kelengkapan hanya bisa diperiksa kalau daftarnya bisa dibaca.
 *
 * Pembagiannya jadi DUA bagian materi, dan untuk bahasa Mandarin pemisahan itu
 * menyelesaikan masalah yang nyata:
 *
 *   imbuhan (虚词)    — kata fungsi. Bahasa Mandarin TIDAK berkonjugasi: 吃
 *                       tetap 吃 untuk siapa pun dan kapan pun. Yang menyatakan
 *                       waktu, selesai, arah, hasil, dan derajat adalah potongan
 *                       kecil yang menempel di sekitar kata kerja — 了, 着, 过,
 *                       得, 的, 把, 被, 量词, 补语. Inilah seluruh "morfologi"
 *                       bahasa Mandarin, dan justru bagian ini yang paling
 *                       sering dianggap remeh karena masing-masing cuma satu
 *                       karakter. Tanpa menguasainya, kalimatmu benar kata per
 *                       kata tapi salah sebagai kalimat.
 *
 *   tatabahasa (语法) — pola kalimat: bagaimana potongan itu dirangkai, dan
 *                       terutama URUTANNYA. Urutan kata dalam bahasa Mandarin
 *                       hampir tidak boleh salah, karena tidak ada penanda
 *                       kasus atau konjugasi yang bisa menyelamatkanmu.
 *
 * Dua hal yang perlu dinyatakan terus terang soal penamaan level:
 *
 *   HSK yang dipakai di sini adalah HSK 2.0 — enam tingkat, HSK 1 sampai HSK 6.
 *   Standar baru (HSK 3.0, terbit 2021) memakai SEMBILAN tingkat dengan
 *   1–3 dasar, 4–6 menengah, 7–9 mahir (7–9 satu ujian bersama). Yang dipakai di
 *   sini tetap 2.0 karena hampir seluruh buku, kursus, dan syarat beasiswa yang
 *   dipakai pelajar Indonesia masih ditulis dalam tingkat 2.0.
 *
 *   HSK TIDAK menerbitkan daftar tata bahasa resmi per level — yang resmi cuma
 *   daftar kosakata. Jadi pembagian di sini mengikuti konsensus buku ajar
 *   (《HSK标准教程》, 《发展汉语》, 《博雅汉语》). Yang dijamin cakupannya, bukan
 *   penempatan tiap butirnya.
 */

const H1: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (7)
  { level: 'HSK1', strand: 'imbuhan', title: 'Partikel 的', focus: '的 sebagai penanda milik (我的书) dan penerang kata benda (红色的衣服, 我买的东西) — termasuk kapan 的 justru DIHILANGKAN (我妈妈, 我家)', context: 'menyebut milik siapa dan barang yang mana' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Kata Bantu Bilangan', focus: '量词: angka + 量词 + kata benda WAJIB, tidak boleh 三书. 个 (umum), 本 (buku), 张 (lembar), 件 (pakaian/perkara), 只 (hewan kecil), 杯 (cangkir), 口 (anggota keluarga), 岁 (umur)', context: 'menyebut jumlah benda' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Partikel Tanya 吗 dan 呢', focus: '吗 mengubah pernyataan jadi pertanyaan tanpa mengubah urutan kata (你去 → 你去吗?) · 呢 untuk membalik pertanyaan (我很好，你呢?)', context: 'bertanya tanpa menyusun ulang kalimat' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Partikel 了 Dasar', focus: '了 setelah kata kerja untuk perbuatan yang SUDAH terjadi (我吃了饭) — dan penegasan penting: 了 bukan penanda kala lampau, tapi penanda SELESAI', context: 'menceritakan apa yang sudah dilakukan' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Adverbia 也 dan 都', focus: 'Posisinya SELALU sebelum kata kerja, tidak pernah di akhir: 我也去 (bukan 我去也), 我们都是学生 · 都 menyapu ke belakang, jadi 我们都不去 dan 我们不都去 artinya berbeda', context: 'menyatakan "juga" dan "semua"' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Preposisi 在, 从, 到', focus: '在 + tempat (我在家), 从 + titik asal, 到 + tujuan, 从…到… — dan letaknya SEBELUM kata kerja, bukan sesudah', context: 'menyebut di mana dan dari mana ke mana' },
  { level: 'HSK1', strand: 'imbuhan', title: 'Negasi 不 dan 没', focus: '不 untuk kebiasaan, kemauan, dan sifat (我不吃辣) · 没 untuk perbuatan yang BELUM terjadi (我没吃饭) · 没有 untuk kepemilikan — 不 dan 没 tidak bisa saling ditukar', context: 'menyatakan tidak dan belum' },

  // ------------------------------------------------------- tatabahasa (11)
  { level: 'HSK1', strand: 'tatabahasa', title: 'Kalimat 是', focus: 'A 是 B untuk identitas (我是学生), bentuk negatif 不是, pertanyaan 是不是 dan …是吗? — beserta 是…的 untuk menekankan', context: 'menyebut nama, asal, dan identitas' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Kalimat Sifat Tanpa 是', focus: 'Kata sifat langsung jadi predikat: 她很漂亮 (BUKAN 她是漂亮) · 很 hampir wajib sebagai penopang, 太…了, 非常 · negatifnya 不漂亮', context: 'menggambarkan orang dan barang' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Urutan Dasar dan Keterangan', focus: 'Urutan S–V–O yang kaku, dan aturan yang membedakan Mandarin dari bahasa Indonesia: keterangan WAKTU dan TEMPAT diletakkan SEBELUM kata kerja (我明天在家看书, bukan 我看书在家明天)', context: 'menyusun kalimat pertama yang benar' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Ada dan Punya: 有', focus: '有 untuk kepemilikan (我有一本书) dan keberadaan (桌子上有书) · negatifnya SELALU 没有, tidak pernah 不有 · 有没有…?', context: 'menyebut apa yang ada dan apa yang dimiliki' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Ini, Itu, Mana', focus: '这/那/哪 + 量词 + kata benda (这本书) · 这儿/那儿/哪儿 · 这个/那个 — sistem DUA arah (dekat–jauh), bukan tiga seperti Jepang dan Korea', context: 'menunjuk barang saat berbelanja' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Kata Tanya', focus: '谁, 什么, 哪儿, 什么时候, 几, 多少, 怎么, 为什么, 怎么样 — dan aturan yang menghemat banyak tenaga: kata tanya diletakkan DI POSISI jawabannya, urutan kalimat tidak berubah (你去哪儿? ← 我去学校)', context: 'menggali informasi' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Angka, Uang, dan Umur', focus: '一–一百, 零, 两 vs 二 (两个 bukan 二个) · 块/毛/分 · 多少钱? · 几岁? / 多大? — beserta 一 yang berubah nada di depan 量词', context: 'menyebut harga dan umur' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Jam, Tanggal, dan Hari', focus: '几点? · 两点半, 三点一刻 · 年/月/号 dengan urutan BESAR ke kecil (2024年3月5日) · 星期几? — kebalikan dari urutan tanggal bahasa Indonesia', context: 'membuat jadwal' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Kata Kerja Bantu', focus: '想 (ingin), 要 (mau/akan, lebih tegas), 会 (bisa karena belajar), 能 (bisa karena keadaan), 可以 (boleh) — empat "bisa" yang tidak saling menggantikan', context: 'menyatakan keinginan dan kemampuan' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Sedang Berlangsung', focus: '在 + kata kerja (我在吃饭), 正在, dan …呢 di akhir kalimat — beserta gabungannya 正在…呢', context: 'menceritakan apa yang sedang terjadi' },
  { level: 'HSK1', strand: 'tatabahasa', title: 'Perintah dan Permintaan Sopan', focus: '请 + kata kerja (请坐, 请进) · 别 + kata kerja (别走) · 不要… · …一下 untuk melunakkan (等一下, 看一下)', context: 'meminta dan memberi arahan' },
]

const H2: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (9)
  { level: 'HSK2', strand: 'imbuhan', title: 'Partikel 过', focus: '过 untuk pengalaman yang pernah dialami (我去过中国) · negatifnya 没…过 · bedanya dengan 了: 了 = selesai, 过 = pernah', context: 'bercerita tentang pengalaman' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Partikel 着', focus: '着 untuk keadaan yang bertahan, bukan perbuatan yang berjalan: 门开着 (pintu dalam keadaan terbuka), 他戴着眼镜 — bandingkan dengan 在 yang menyatakan aksi sedang berlangsung', context: 'menggambarkan keadaan dan penampilan' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Dua Macam 了', focus: '了 setelah kata kerja (selesai) vs 了 di akhir kalimat (perubahan keadaan): 我吃了饭 ≠ 我不吃了 · 太…了 · 我知道了 — dan kenapa 我知道了 bukan lampau', context: 'membedakan selesai dan berubah' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Partikel 得: Keterangan Cara', focus: '程度补语: kata kerja + 得 + kata sifat (他说得很快, 我写得不好) · pertanyaan …得怎么样? — perhatikan 得 (de) di sini beda dengan 的', context: 'menilai bagaimana sesuatu dilakukan' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Preposisi Perbandingan 比', focus: 'A 比 B + kata sifat (他比我高), A 比 B + 更/还 · A 没有 B (那么)… · A 跟 B 一样 · negatif 不比 vs 没有 yang artinya berbeda', context: 'membandingkan dua hal' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Preposisi Sasaran', focus: '给 (untuk/kepada: 给我打电话), 跟/和 (bersama: 跟我一起去), 对 (terhadap: 对我很好), 离 (jarak dari: 离这儿很远) — semuanya SEBELUM kata kerja', context: 'menyebut kepada dan dengan siapa' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Adverbia 就 dan 才', focus: '就 = lebih cepat/mudah dari perkiraan (他七点就来了), 才 = lebih lambat/susah (他九点才来) — dua kata yang membawa PENILAIAN, bukan cuma waktu', context: 'menyampaikan kesan cepat atau lambat' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Adverbia 还, 再, 又', focus: '还 (masih/lagi belum terjadi), 再 (lagi, akan datang: 明天再说), 又 (lagi, sudah terjadi: 他又来了) — tiga "lagi" yang bergantung pada waktunya', context: 'menyatakan pengulangan' },
  { level: 'HSK2', strand: 'imbuhan', title: 'Kata Bantu Bilangan Lanjutan', focus: '条 (memanjang), 双 (sepasang), 把 (bergagang), 辆 (roda), 位 (orang, hormat), 家 (tempat usaha), 份, 遍/次 · 一点儿 vs 有点儿 · 很多 vs 太多', context: 'menghitung dengan kata bantu yang tepat' },

  // ------------------------------------------------------- tatabahasa (10)
  { level: 'HSK2', strand: 'tatabahasa', title: 'Akan Segera Terjadi', focus: '快要…了, 就要…了, 要…了 · bedanya: 就要 boleh disertai keterangan waktu (明天就要考试了), 快要 tidak', context: 'menyampaikan hal yang segera terjadi' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Sebab dan Akibat', focus: '因为…所以… (keduanya boleh dipakai bersama, tidak seperti bahasa Inggris) · 所以 · 为什么 → 因为', context: 'menjelaskan alasan' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Meski Begitu', focus: '虽然…但是… · 但是/可是/不过 dengan derajat ketegasan yang berbeda — dan aturan yang sama: pasangan kata hubung Mandarin dipakai LENGKAP', context: 'menyampaikan pertentangan' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Dua Hal Sekaligus', focus: '一边…一边… (dua kegiatan bersamaan), 又…又… (dua sifat sekaligus), 一…就… (begitu…langsung)', context: 'menceritakan dua hal yang berjalan bersama' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Mengulang Kata Kerja', focus: 'Reduplikasi untuk melunakkan dan memperpendek: 看看, 试试, 想一想, 休息休息 · V 一下 · bedanya dengan 看了看 (sudah dilakukan sebentar)', context: 'meminta dengan cara yang lebih halus' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Pertanyaan Pilihan', focus: '还是 untuk pilihan (你喝茶还是咖啡?) vs 或者 untuk pernyataan · 是不是 · V 不 V (去不去, 是不是, 好不好) · …，好吗?', context: 'menawarkan pilihan' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Kalimat Berpredikat Ganda', focus: '连动句: dua kata kerja berurutan tanpa kata hubung, urutannya = urutan kejadian (我去商店买东西, 坐飞机去北京) — pola yang sangat lazim dan tidak ada padanan langsungnya', context: 'menyebut pergi ke mana untuk apa' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Waktu dan Lama', focus: '时量补语: kata kerja + lama waktu (我学了两年, 睡了八个小时) · 了…了 untuk yang masih berlanjut · bedanya 两点 (jam dua) dan 两个小时 (dua jam)', context: 'menyebut sudah berapa lama' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Boleh dan Harus', focus: '可以/能 (boleh), 不能/不可以 (tidak boleh), 得 děi (harus, lisan), 应该 (sebaiknya), 必须 (wajib) · 别忘了', context: 'menjelaskan aturan dan memberi saran' },
  { level: 'HSK2', strand: 'tatabahasa', title: 'Keterangan Tempat', focus: '在/上/下/里/外/前边/后边/旁边/中间 sebagai kata benda tempat (桌子上, 学校里) · 到…去 · 往…走 — dan kenapa 上/里 sering WAJIB ditambahkan', context: 'menjelaskan letak barang' },
]

const H3: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (8)
  { level: 'HSK3', strand: 'imbuhan', title: 'Konstruksi 把', focus: '把字句: S + 把 + objek + V + hasil (我把书放在桌子上) — memindahkan objek ke DEPAN kata kerja supaya bisa disebutkan apa yang terjadi padanya. Wajib ada unsur hasil; 我把书看 tidak berarti apa-apa', context: 'menceritakan tindakan yang mengubah keadaan benda' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Kalimat Pasif 被', focus: '被字句: S + 被 (+ pelaku) + V + hasil (钱包被偷了) · 让/叫 sebagai pengganti lisan · dan hal penting: 被 membawa nada MERUGIKAN, jadi tidak dipakai untuk hal baik seperti pasif bahasa Indonesia', context: 'menceritakan hal yang terjadi pada diri sendiri' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Pelengkap Hasil', focus: '结果补语: V + 完/好/到/见/懂/错/开/上 (吃完, 做好, 看见, 听懂, 说错) — hasil perbuatan ditempelkan ke kata kerjanya, bukan diceritakan terpisah', context: 'menyatakan perbuatan yang tuntas atau gagal' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Pelengkap Arah Sederhana', focus: '趋向补语: V + 来/去 dengan patokan si PEMBICARA (进来 masuk ke arahku, 进去 masuk ke arah lain, 拿来, 回去)', context: 'menyebut arah gerakan' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Pelengkap Kemungkinan', focus: '可能补语: V + 得了 / V + 不了 (吃得了, 走不了), V 得/不 + hasil (看得懂 / 看不懂, 听得清 / 听不清) — cara paling lazim menyatakan "tidak bisa" dalam praktik', context: 'menyatakan mampu atau tidak mampu' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Partikel 地 dan Tiga De', focus: '地 penanda keterangan cara (慢慢地走, 认真地听) — dan pembeda tiga 的/得/地 yang bunyinya sama: 的 sebelum kata benda, 得 sesudah kata kerja, 地 sebelum kata kerja. Salah satu sumber kesalahan tulisan tersering', context: 'menulis tanpa tertukar tiga de' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Adverbia Derajat', focus: '更, 最, 越来越, 越…越…, 有点儿 vs 一点儿 (有点儿贵 = keluhan, 便宜一点儿 = permintaan), 差不多, 几乎, 极了', context: 'menyampaikan derajat dengan tepat' },
  { level: 'HSK3', strand: 'imbuhan', title: 'Preposisi Rujukan', focus: '关于 (tentang, di awal), 对于, 根据, 通过, 为了 (demi), 除了…以外 (selain) — beserta 以外 yang bisa berarti "termasuk" maupun "tidak termasuk" tergantung 都/还', context: 'menulis kalimat yang lebih formal' },

  // ------------------------------------------------------- tatabahasa (9)
  { level: 'HSK3', strand: 'tatabahasa', title: 'Penekanan 是…的', focus: '是…的 untuk menekankan waktu, tempat, cara, atau pelaku pada kejadian yang SUDAH pasti terjadi (我是昨天来的, 他是坐飞机来的) — bukan menyatakan lampau, tapi menyorot bagian mana yang jadi pokok', context: 'menjawab pertanyaan tentang kapan dan bagaimana' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Tidak Hanya, Tapi Juga', focus: '不但…而且… · 不仅…还… · …的话 · 除了…还/都… — pasangan kata hubung tingkat menengah', context: 'menambahkan informasi dalam satu kalimat' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Pengandaian', focus: '如果…就… · 要是…就… (lebih lisan) · …的话 · 只要…就… (cukup asal) vs 只有…才… (hanya kalau) — pasangan yang paling sering tertukar', context: 'membicarakan syarat' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Bahkan dan Sekalipun', focus: '连…都/也… (bahkan…pun) · 就是…也… · 即使…也… · 一点儿也不…', context: 'menekankan dengan contoh ekstrem' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Kata Tanya sebagai Semua atau Apa Pun', focus: '谁都, 什么都, 哪儿都, 怎么都 (siapa/apa pun) · 什么时候都 · 什么…都不… — kata tanya yang berhenti bertanya dan mulai menyapu', context: 'menyatakan tanpa kecuali' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Urutan Kejadian', focus: '先…然后… · …以后 / …的时候 / …以前 (semuanya DI BELAKANG klausanya, kebalikan dari bahasa Indonesia) · 后来 vs 以后', context: 'menyusun cerita berurutan' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Menyuruh dan Membiarkan', focus: '兼语句: 让/叫/请/使 + orang + V (妈妈让我回家, 老师叫我们写作业) — satu kata benda jadi objek sekaligus subjek', context: 'menceritakan perintah orang lain' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Menyebut Keberadaan', focus: '存现句: tempat + V + benda (桌子上放着一本书, 前面来了一个人) — urutan yang mendahulukan TEMPAT, dipakai untuk memperkenalkan hal baru', context: 'menggambarkan sebuah ruangan atau pemandangan' },
  { level: 'HSK3', strand: 'tatabahasa', title: 'Membaca Teks Menengah', focus: 'Strategi 阅读 HSK: mengenali 关联词 (虽然, 于是, 因此), menemukan kalimat inti paragraf, dan mengerjakan soal 排列顺序 dengan melacak kata rujukan (这, 那, 其) serta subjek yang dihilangkan', context: 'membaca artikel dan cerita pendek' },
]

const H4: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (6)
  { level: 'HSK4', strand: 'imbuhan', title: 'Pelengkap Arah Majemuk', focus: '复合趋向补语: V + 上/下/进/出/回/过/起 + 来/去 (走进来, 拿出去, 站起来) — beserta makna kiasannya yang tidak lagi soal arah (想起来 teringat, 看下去 lanjut membaca, 说下去)', context: 'menyatakan arah dan makna kiasannya' },
  { level: 'HSK4', strand: 'imbuhan', title: 'Pelengkap Derajat Lanjutan', focus: 'V/Adj + 得 + klausa utuh (高兴得跳起来, 累得说不出话) · …得不得了 · …得很 — derajat yang dinyatakan dengan AKIBATNYA, ciri khas tulisan yang hidup', context: 'menggambarkan derajat secara konkret' },
  { level: 'HSK4', strand: 'imbuhan', title: 'Adverbia Nada 1', focus: '却 (padahal, di depan predikat), 倒 (justru), 反而 (malah sebaliknya), 竟然 (tak disangka), 居然 · semuanya menempel ke predikat dan membawa SIKAP pembicara, bukan informasi', context: 'menyampaikan hal yang di luar dugaan' },
  { level: 'HSK4', strand: 'imbuhan', title: 'Adverbia Nada 2', focus: '难道 (masa iya, pertanyaan retoris), 究竟/到底 (sebenarnya), 简直 (benar-benar sampai), 千万 (jangan sampai), 万一 (kalau-kalau)', context: 'menekankan dan mendesak' },
  { level: 'HSK4', strand: 'imbuhan', title: 'Preposisi Tulisan', focus: '由于 (sebab, formal), 因此/从而 (akibatnya), 按照/根据 (menurut), 以 (dengan), 对…来说 (bagi), 至于 (sedangkan soal)', context: 'menulis laporan dan esai' },
  { level: 'HSK4', strand: 'imbuhan', title: 'Kata Bantu Bilangan Abstrak', focus: '种/类 (jenis), 项 (butir), 部 (karya), 场 (acara), 阵 (sebentar), 番, 顿 · 一系列, 一系列的 · penggandaan 量词 (个个, 天天, 一次一次)', context: 'menghitung hal yang bukan benda' },

  // ------------------------------------------------------- tatabahasa (10)
  { level: 'HSK4', strand: 'tatabahasa', title: 'Terlepas dari Apa Pun', focus: '不管/无论/不论…都/也… — WAJIB diikuti kata tanya atau pilihan (无论谁来, 不管多贵) · 只要…就… (ulasan) · 除非…否则…', context: 'menyatakan hal yang tidak bergantung syarat' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Karena Sudah Begitu', focus: '既然…就… (karena memang begitu, maka) · 由于…因此… · 之所以…是因为… — beda 既然 (kenyataan yang sudah diketahui) dan 因为 (alasan baru)', context: 'menarik kesimpulan dari kenyataan' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Meski Sudah Berusaha', focus: '尽管…还是… · 即使…也… · 哪怕…也… · 就算…也… — empat "meskipun" bertingkat dari formal ke lisan', context: 'menyampaikan usaha yang tetap gagal' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Hanya Kalau, Baru', focus: '只有…才… · 除非…才… · 不…不… (不见不散, 不来不行) · …才…呢', context: 'menyatakan syarat mutlak' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Lebih Baik dan Daripada', focus: '与其…不如… · 宁可…也不… · 还是…吧 (lebih baik begitu saja) · …比较好', context: 'memilih di antara dua kemungkinan' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Objek Ganda dan Objek Pindah', focus: '双宾语句: V + orang + benda (给我一本书, 教我们汉语, 问他一个问题) — hanya sebagian kata kerja boleh, dan itu harus dihafal per kata kerja', context: 'menyebut memberi apa kepada siapa' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Urutan Keterangan', focus: 'Urutan baku beberapa keterangan sekaligus: waktu → tempat → cara/alat → penerima → kata kerja (我昨天在图书馆用手机给他打了电话). Ini aturan yang paling sering dilanggar dan yang paling sering diuji di soal 病句', context: 'menyusun kalimat panjang yang tetap benar' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Urutan Penerang Kata Benda', focus: 'Urutan beberapa penerang di depan satu kata benda: milik → penunjuk/jumlah → sifat → bahan → benda (我的那两件新的棉衣服) — penerang selalu di DEPAN, tidak pernah di belakang seperti bahasa Indonesia', context: 'menerangkan benda secara rinci' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Kalimat Perbandingan Lanjutan', focus: 'A 比 B + Adj + selisih (他比我高两公分) · A 有 B 那么…吗? · 跟…差不多 · 不如 · 越…越… · 一…比一… ', context: 'membandingkan dengan angka dan derajat' },
  { level: 'HSK4', strand: 'tatabahasa', title: 'Menulis Karangan Pendek', focus: 'Struktur 开头-中间-结尾 untuk soal 书写: kalimat pembuka yang menjawab tugas, penanda urutan (首先, 然后, 最后), dan menjaga jumlah karakter — beserta perbedaan 口语体 dan 书面语体', context: 'soal 写作 HSK 4 dan 5' },
]

const H5: CurriculumEntry[] = [
  { level: 'HSK5', strand: 'imbuhan', title: 'Kata Fungsi Bahasa Tulis', focus: '之 (的 dalam bahasa tulis: 三分之一, 之一), 其 (nya: 其中, 其他), 所 (所说, 所需), 以 (以…为…) — sisa bahasa klasik yang masih hidup di teks modern', context: 'membaca berita dan tulisan resmi' },
  { level: 'HSK5', strand: 'imbuhan', title: 'Adverbia Frekuensi dan Perkembangan', focus: '逐渐/渐渐 (berangsur), 日益 (makin hari), 始终 (dari awal sampai akhir), 一律/一概 (tanpa kecuali), 未必 (belum tentu), 何必 (apa perlunya)', context: 'menjelaskan tren dalam laporan' },
  { level: 'HSK5', strand: 'imbuhan', title: 'Pelengkap dan Kata Kerja Terpisah', focus: '离合词: kata kerja yang bisa dibelah (帮忙 → 帮了他一个忙, 见面 → 见过一次面, 睡觉 → 睡了一觉) — kesalahan 我帮忙他 datang dari tidak tahu ini', context: 'memakai kata kerja dua karakter dengan benar' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Bukan Ini Melainkan Itu', focus: '不是…而是… · 不是…就是… (kalau bukan…berarti…) · 是…还是… dalam pertanyaan tak langsung · 与其说…不如说…', context: 'memperjelas dengan menyangkal dulu' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Sudut Pandang dan Rujukan', focus: '在…看来 (menurut pandangan), 就…而言 (kalau soal), 从…来看 (dilihat dari), 以…为例 (sebagai contoh), 相比之下', context: 'menulis esai argumentatif' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Kemungkinan dan Kepastian', focus: '难免 (tak terhindarkan), 未免 (terlalu), 势必 (pasti akan), 不见得 (belum tentu), 值得 (layak), 免不了 · …也不为过', context: 'menimbang kemungkinan dalam tulisan' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Menegaskan dan Membatasi', focus: '无非是 (tak lebih dari), 不过是, 只不过, 未尝不可, 何况 (apalagi), 更不用说 · 别说…就连…', context: 'menilai secara kritis' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Chengyu dalam Kalimat', focus: 'Cara 成语 dipakai secara gramatikal — sebagai predikat (他实事求是), penerang (不可思议的事), atau keterangan (千方百计地…) — dan kenapa 成语 yang dipaksakan justru menurunkan nilai 写作', context: 'menulis padat tanpa terdengar dipaksakan' },
  { level: 'HSK5', strand: 'tatabahasa', title: 'Membaca Teks Panjang', focus: 'Strategi 阅读 lanjutan: melacak 指代词 (这一, 该, 其), menemukan 主旨句, membedakan pendapat penulis dari pendapat yang dikutip, dan mengerjakan 选句填空 lewat kata sambung di kalimat pilihan', context: 'membaca kolom opini dan artikel populer' },
]

const H6: CurriculumEntry[] = [
  { level: 'HSK6', strand: 'imbuhan', title: 'Kata Fungsi Klasik', focus: '而 (dan/tetapi: 简单而有效), 则 (maka/sedangkan), 乃, 于 (于 + tempat/waktu), 者, 若 · pasangan 一则…二则… — muncul di tajuk, dokumen, dan tulisan akademik', context: 'membaca dokumen resmi dan tulisan akademik' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Konsesi Tingkat Tinggi', focus: '固然…但… · 诚然… · 纵然…也… · 姑且不论 · 退一步说 — mengakui dulu lalu membalik, ciri argumen yang matang', context: 'menulis esai yang tidak mudah dibantah' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Pertanyaan Retoris', focus: '反问句: 难道…吗? · 岂不是…? · 谁不知道…? · 何尝…? — bentuknya bertanya, maksudnya menegaskan, dan jawabannya justru KEBALIKAN dari bunyinya', context: 'membaca opini dan pidato' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Menemukan Kalimat Salah', focus: 'Diagnosis 病句 (soal 阅读 第1部分 HSK 6): 成分残缺 (unsur hilang), 搭配不当 (pasangan kata tidak cocok), 语序不当 (urutan salah), 重复啰嗦 (mengulang: 大约…左右), dan 逻辑混乱 — lima jenis kesalahan yang diuji', context: 'soal 病句 dan menyunting tulisan sendiri' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Chengyu dan Peribahasa', focus: '成语 empat karakter beserta asal ceritanya (塞翁失马, 画龙点睛, 守株待兔, 掩耳盗铃) dan 俗语/歇语(说曹操曹操到, 骑虎难下) — arti yang tidak bisa disusun dari karakternya', context: 'memahami kolom, pidato, dan percakapan penutur asli' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Ragam dan Laras', focus: 'Beda 口语体 dan 书面语体 pada kata yang sama (给 → 予以, 因为 → 由于, 想 → 拟, 用 → 采用), gaya judul berita (kata kerja dan partikel dihilangkan), dan bahasa iklan — beserta bahaya mencampur laras dalam satu tulisan', context: 'menulis untuk pembaca yang berbeda' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Ragam Mandarin dan Dialek', focus: 'Perbedaan 普通话 (daratan), 国语 (Taiwan), dan 华语 (Singapura/Malaysia) dalam kosakata dan istilah · ciri 方言 utama (粤, 闽, 吴) yang muncul di film dan lagu · aksara tradisional yang tetap perlu dikenali', context: 'memahami film, lagu, dan tulisan dari berbagai wilayah' },
  { level: 'HSK6', strand: 'tatabahasa', title: 'Menulis Ringkasan 缩写', focus: 'Soal 书写 HSK 6: membaca teks ±1.000 karakter dalam 10 menit lalu meringkasnya jadi ±400 karakter TANPA melihat teksnya lagi — teknik mencatat kerangka, membuang dialog dan rincian, mempertahankan alur, dan memberi judul', context: 'satu-satunya soal menulis di HSK 6' },
]

export const ZH_GRAMMAR: CurriculumEntry[] = [...H1, ...H2, ...H3, ...H4, ...H5, ...H6]
