import type { CurriculumEntry } from '@/lib/languages/curriculum'

/**
 * KURIKULUM TATA BAHASA KOREA — 1급 → 6급
 *
 * Ditulis sebagai data dengan alasan yang sama seperti Inggris dan Jepang:
 * kelengkapan hanya bisa diperiksa kalau daftarnya bisa dibaca.
 *
 * Pembagiannya jadi DUA bagian materi, dan untuk bahasa Korea pemisahan itu
 * bukan sekadar rapi-rapi:
 *
 *   imbuhan (조사·어미) — partikel dan akhiran. Bahasa Korea itu aglutinatif:
 *                        satu kata kerja bisa menempel lima akhiran berurutan
 *                        (가 + 시 + 었 + 겠 + 습니다). Tanpa menguasai potongan
 *                        yang menempel ini, pola kalimat apa pun tidak bisa
 *                        dibentuk — jadi ia berdiri sendiri, bukan diselipkan.
 *
 *   tatabahasa (문법)  — pola kalimat: bagaimana potongan itu dirangkai jadi
 *                        makna.
 *
 * Tentang penamaan level — dua hal yang gampang tertukar:
 *
 *   UJIAN-nya ada DUA: TOPIK I dan TOPIK II.
 *   SERTIFIKAT-nya ada ENAM tingkat, disebut 급 (geup): 1급 sampai 6급.
 *
 * TOPIK I memberi 1급 atau 2급; TOPIK II memberi 3급 sampai 6급 — semuanya dari
 * satu lembar soal yang sama, tingkatnya ditentukan oleh skor. Karena itu level
 * di sini ditulis 1급–6급, BUKAN "TOPIK 1–6": yang terakhir itu membaca seperti
 * nama ujian, dan "TOPIK 2" akan tertukar dengan ujian TOPIK II.
 *
 * Daftar tata bahasa resmi per 급 tidak pernah diterbitkan, jadi pembagian di
 * sini mengikuti konsensus buku ajar universitas Korea (연세, 서강, 서울대) dan
 * buku persiapan TOPIK. Yang dijamin cakupannya, bukan penempatan tiap butirnya.
 */

const T1: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (9)
  { level: '1급', strand: 'imbuhan', title: 'Partikel 은/는 dan 이/가', focus: '은/는 penanda topik vs 이/가 penanda subjek — kapan memakai yang mana, dan kenapa 저는 vs 제가 tidak sama', context: 'memperkenalkan diri dan menjawab pertanyaan' },
  { level: '1급', strand: 'imbuhan', title: 'Partikel 을/를, 도, 만', focus: '을/를 penanda objek, 도 (juga), 만 (hanya) — termasuk kapan partikel objek boleh dihilangkan dalam percakapan', context: 'menyebut apa yang dilakukan' },
  { level: '1급', strand: 'imbuhan', title: 'Partikel Tempat dan Waktu', focus: '에 (waktu, tujuan, keberadaan) vs 에서 (tempat kegiatan, asal) — pasangan yang paling sering tertukar', context: 'menceritakan pergi ke mana dan melakukan apa di mana' },
  { level: '1급', strand: 'imbuhan', title: 'Partikel 으로, 와/과, 부터/까지', focus: '(으)로 (arah, alat, cara), 와/과 · 하고 · (이)랑 (dan/dengan) beserta bedanya menurut keformalan, 부터~까지 (dari–sampai)', context: 'menjelaskan cara dan rentang' },
  { level: '1급', strand: 'imbuhan', title: 'Akhiran Sopan 아요/어요', focus: 'Pembentukan 해요체: 아요 setelah ㅏ/ㅗ, 어요 selain itu, 해요 untuk 하다 — beserta penyingkatan (가아요 → 가요, 오아요 → 와요)', context: 'bentuk yang dipakai 90% percakapan sehari-hari' },
  { level: '1급', strand: 'imbuhan', title: 'Akhiran Formal 습니다', focus: '합니다체: -습니다/-ㅂ니다 dan pertanyaan -습니까/-ㅂ니까 — dipakai di berita, presentasi, dan militer', context: 'situasi resmi dan tulisan formal' },
  { level: '1급', strand: 'imbuhan', title: 'Bentuk Lampau 았/었', focus: '-았어요/-었어요/-했어요 dan bentuk formalnya -았습니다; termasuk 이었어요/였어요 untuk kata benda', context: 'menceritakan kejadian kemarin' },
  { level: '1급', strand: 'imbuhan', title: 'Bentuk Masa Depan', focus: '-(으)ㄹ 거예요 (rencana), -겠- (kehendak & dugaan), dan bedanya: 내일 갈 거예요 vs 제가 하겠습니다', context: 'membicarakan rencana dan menyatakan kesediaan' },
  { level: '1급', strand: 'imbuhan', title: 'Kata Kerja Tak Beraturan 1', focus: '불규칙 ㅡ (바쁘다 → 바빠요), ㅂ (덥다 → 더워요), ㄷ (듣다 → 들어요) — tiga yang paling sering muncul', context: 'menghindari kesalahan konjugasi paling umum' },

  // ------------------------------------------------------- tatabahasa (16)
  { level: '1급', strand: 'tatabahasa', title: 'Kalimat Dasar: 이에요/예요', focus: 'N이에요/예요 (adalah), N이/가 아니에요 (bukan), dan pertanyaan 뭐예요? — kopula dan susunan S-O-V', context: 'menyebut nama dan identitas' },
  { level: '1급', strand: 'tatabahasa', title: 'Ada dan Tidak Ada', focus: '있어요/없어요 untuk keberadaan dan kepemilikan, 어디에 있어요?, serta 계세요 sebagai bentuk hormatnya', context: 'menanyakan letak barang dan orang' },
  { level: '1급', strand: 'tatabahasa', title: 'Ini, Itu, Yang Di Sana', focus: '이/그/저 + 것/사람/곳, 여기/거기/저기, 이거·그거·저거 — sistem tiga arah seperti kosoado', context: 'menunjuk barang saat berbelanja' },
  { level: '1급', strand: 'tatabahasa', title: 'Dua Sistem Angka', focus: '한자어 수 (일이삼) untuk menit, tanggal, uang, nomor; 고유어 수 (하나둘셋) untuk jam, umur, jumlah benda — beserta 개, 명, 마리, 잔, 권', context: 'menyebut jumlah dan harga tanpa salah sistem' },
  { level: '1급', strand: 'tatabahasa', title: 'Waktu dan Tanggal', focus: '몇 시예요?, 한 시 삼십 분, 요일 (월화수목금토일), 년/월/일, 오전/오후 — dan partikel 에 yang menyertainya', context: 'membuat janji' },
  { level: '1급', strand: 'tatabahasa', title: 'Bentuk Negatif', focus: '안 + kata kerja vs -지 않다, 못 + kata kerja vs -지 못하다 — beda "tidak mau" dan "tidak bisa"', context: 'menolak dan menjelaskan keterbatasan' },
  { level: '1급', strand: 'tatabahasa', title: 'Ingin dan Sedang', focus: '-고 싶다 (ingin; berubah jadi -고 싶어하다 untuk orang ketiga), -고 있다 (sedang berlangsung)', context: 'menyampaikan keinginan dan kegiatan saat ini' },
  { level: '1급', strand: 'tatabahasa', title: 'Permintaan Sopan', focus: '-(으)세요 (perintah halus/hormat), -아/어 주세요 (tolong lakukan untuk saya), 주시겠어요? yang lebih sopan lagi', context: 'meminta bantuan di toko dan kantor' },
  { level: '1급', strand: 'tatabahasa', title: 'Bisa dan Tidak Bisa', focus: '-(으)ㄹ 수 있다/없다, 잘하다/못하다, dan 할 줄 알다/모르다 (bisa karena tahu caranya)', context: 'membicarakan kemampuan' },
  { level: '1급', strand: 'tatabahasa', title: 'Boleh dan Tidak Boleh', focus: '-아/어도 되다 (boleh), -(으)면 안 되다 (tidak boleh), -아/어야 되다/하다 (harus)', context: 'menjelaskan aturan tempat umum' },
  { level: '1급', strand: 'tatabahasa', title: 'Menyambung: 고, 지만', focus: '-고 (dan, berurutan), -지만 (tetapi), 그리고 · 그런데 · 하지만 sebagai penyambung antarkalimat', context: 'merangkai dua kalimat' },
  { level: '1급', strand: 'tatabahasa', title: 'Sebab dan Urutan: 아/어서', focus: '-아/어서 untuk sebab (배고파서 먹었어요) dan urutan yang berkaitan (가서 만났어요) — dan kenapa tidak bisa dipakai dengan perintah', context: 'menjelaskan alasan' },
  { level: '1급', strand: 'tatabahasa', title: 'Pengandaian: (으)면', focus: '-(으)면 (kalau), 만약 …-(으)면, dan -(으)면 좋겠다 untuk harapan', context: 'membicarakan syarat dan harapan' },
  { level: '1급', strand: 'tatabahasa', title: 'Pergi untuk Melakukan', focus: '-(으)러 가다/오다 (pergi untuk), beda dengan -(으)려고 (berniat)', context: 'menyebut tujuan bepergian' },
  { level: '1급', strand: 'tatabahasa', title: 'Sebelum dan Sesudah', focus: '-기 전에, -(으)ㄴ 후에, -고 나서, N 때 / -(으)ㄹ 때', context: 'menyusun urutan kegiatan' },
  { level: '1급', strand: 'tatabahasa', title: 'Kata Tanya', focus: '누구, 뭐/무엇, 어디, 언제, 왜, 어떻게, 얼마, 몇, 무슨 vs 어느 vs 어떤 — tiga yang terakhir paling sering tertukar', context: 'menggali informasi' },
]

const T2: CurriculumEntry[] = [
  // ------------------------------------------------------- imbuhan (10)
  { level: '2급', strand: 'imbuhan', title: 'Partikel untuk Orang', focus: '에게/한테 (kepada), 에게서/한테서 (dari), 께 (bentuk hormat), dan bedanya dengan 에 yang dipakai untuk benda', context: 'memberi dan menerima dari orang' },
  { level: '2급', strand: 'imbuhan', title: 'Partikel Perbandingan', focus: '보다 (daripada), 처럼/같이 (seperti), 만큼 (sebanyak), 중에서 …이/가 제일 (paling di antara)', context: 'membandingkan dua pilihan' },
  { level: '2급', strand: 'imbuhan', title: 'Partikel Pembatas', focus: '밖에 + negatif (hanya), (이)나 (atau / sebanyak-banyaknya), 마다 (setiap), 쯤/정도 (kira-kira)', context: 'menyampaikan jumlah dan pilihan' },
  { level: '2급', strand: 'imbuhan', title: 'Bahasa Hormat: Subjek', focus: '높임법: -(으)시- pada kata kerja, 께서 sebagai pengganti 이/가, dan kata khusus 계시다·드시다·주무시다·말씀하시다', context: 'berbicara tentang orang yang dihormati' },
  { level: '2급', strand: 'imbuhan', title: 'Bahasa Hormat: Merendah', focus: '겸양어: 저/제, 드리다, 뵙다, 여쭙다, 말씀 — merendahkan diri, bukan meninggikan lawan bicara', context: 'berbicara dengan atasan dan orang tua' },
  { level: '2급', strand: 'imbuhan', title: 'Bahasa Santai (반말)', focus: '해체: menghilangkan 요, -아/어, -자 (ayo), -니?/-냐? (tanya), -야/아 (memanggil) — dan kapan ini WAJAR dipakai', context: 'ngobrol dengan teman sebaya' },
  { level: '2급', strand: 'imbuhan', title: 'Kata Kerja Tak Beraturan 2', focus: '불규칙 르 (모르다 → 몰라요), ㅅ (짓다 → 지어요), ㄹ 탈락 (살다 → 삽니다), ㅎ (그렇다 → 그래요)', context: 'melengkapi seluruh pola konjugasi tak beraturan' },
  { level: '2급', strand: 'imbuhan', title: 'Akhiran Penerang Kata Benda', focus: '관형사형: -는 (sekarang), -(으)ㄴ (lampau/sifat), -(으)ㄹ (akan) + kata benda — 먹는 사람, 먹은 사람, 먹을 사람', context: 'menerangkan kata benda dengan klausa' },
  { level: '2급', strand: 'imbuhan', title: 'Mengubah Kalimat jadi Benda', focus: '-는 것, -기, -(으)ㅁ — dan kapan tiap bentuk dipakai (읽는 것을 좋아해요 vs 읽기 시작했어요)', context: 'menjadikan tindakan sebagai subjek atau objek' },
  { level: '2급', strand: 'imbuhan', title: 'Akhiran Rasa: 네요, 군요, 지요', focus: '-네요 (baru sadar), -(는)군요 (oh begitu), -지요? (kan?), -잖아요 (kan sudah tahu)', context: 'menanggapi dengan nada yang wajar' },

  // ------------------------------------------------------- tatabahasa (14)
  { level: '2급', strand: 'tatabahasa', title: 'Mengajak dan Menawarkan', focus: '-(으)ㄹ까요? (bagaimana kalau / mau saya?), -(으)ㅂ시다 (ayo), -(으)ㄹ래요? (mau?), -(으)ㄹ게요 (janji)', context: 'mengajak dan menawarkan bantuan' },
  { level: '2급', strand: 'tatabahasa', title: 'Sebab: (으)니까', focus: '-(으)니까 vs -아/어서: hanya -(으)니까 yang boleh diikuti perintah atau ajakan (추우니까 문 닫으세요)', context: 'memberi alasan lalu menyuruh' },
  { level: '2급', strand: 'tatabahasa', title: 'Latar: 는데', focus: '-는데/-(으)ㄴ데 sebagai pengantar keadaan, kontras halus, dan pembuka percakapan (실례지만…인데요)', context: 'menyampaikan sesuatu tanpa terdengar tiba-tiba' },
  { level: '2급', strand: 'tatabahasa', title: 'Niat dan Tujuan', focus: '-(으)려고 (berniat), -(으)려고 하다, -기 위해(서) (demi), -도록 (agar)', context: 'menjelaskan maksud tindakan' },
  { level: '2급', strand: 'tatabahasa', title: 'Pengalaman', focus: '-(으)ㄴ 적이 있다/없다 (pernah), -아/어 봤다 (sudah pernah coba), -아/어 보다 (coba lakukan)', context: 'bercerita tentang pengalaman' },
  { level: '2급', strand: 'tatabahasa', title: 'Perubahan Keadaan', focus: '-게 되다 (jadi begitu karena keadaan), -아/어지다 (berangsur menjadi), -기로 하다 (memutuskan)', context: 'menceritakan perubahan hidup' },
  { level: '2급', strand: 'tatabahasa', title: 'Dugaan', focus: '-(으)ㄹ 것 같다 (sepertinya), -나 보다/-(으)ㄴ가 보다 (kelihatannya), -(으)ㄹ지도 모르다 (mungkin saja)', context: 'menebak dengan hati-hati' },
  { level: '2급', strand: 'tatabahasa', title: 'Memberi dan Menerima', focus: '주다/받다, -아/어 주다 (melakukan untuk), -아/어 드리다 (bentuk hormatnya), 주시다', context: 'membicarakan bantuan' },
  { level: '2급', strand: 'tatabahasa', title: 'Kalimat Tak Langsung 1', focus: '간접화법 pernyataan: -다고 하다, -(이)라고 하다 — beserta penyingkatan lisan -대요/-(이)래요', context: 'meneruskan perkataan orang' },
  { level: '2급', strand: 'tatabahasa', title: 'Kalimat Tak Langsung 2', focus: 'Pertanyaan -냐고 하다, perintah -(으)라고 하다, ajakan -자고 하다 — beserta bentuk pendek -냬요/-(으)래요/-재요', context: 'menyampaikan permintaan orang lain' },
  { level: '2급', strand: 'tatabahasa', title: 'Sambil dan Selama', focus: '-(으)면서 (sambil), -는 동안 (selama), -(으)ㄹ 때 (ketika) — beda subjeknya sama atau berbeda', context: 'menceritakan dua kegiatan bersamaan' },
  { level: '2급', strand: 'tatabahasa', title: 'Sesudah Itu, Baru Itu', focus: '-자마자 (begitu…langsung), -다가 (di tengah…lalu berubah), -고 나서, -(으)ㄴ 지 (sudah berapa lama sejak)', context: 'menyusun rangkaian kejadian' },
  { level: '2급', strand: 'tatabahasa', title: 'Saran dan Nasihat', focus: '-는 게 좋겠다, -(으)ㄹ 만하다 (layak dicoba), -지 그래요? (kenapa tidak…?), -았/었으면 좋겠다', context: 'memberi saran' },
  { level: '2급', strand: 'tatabahasa', title: 'Kata Keterangan Sering Dipakai', focus: '아직/벌써, 별로/전혀 (+negatif), 아마, 혹시, 역시, 그냥, 오히려 — beserta bentuk kalimat yang menyertainya', context: 'membuat kalimat terdengar alami' },
]

const T3: CurriculumEntry[] = [
  { level: '3급', strand: 'imbuhan', title: 'Bentuk Pasif', focus: '피동: 이/히/리/기 (보이다, 먹히다, 열리다, 안기다), -아/어지다, dan -게 되다 — tiga cara berbeda yang tidak saling menggantikan', context: 'menceritakan kejadian tanpa pelaku' },
  { level: '3급', strand: 'imbuhan', title: 'Bentuk Kausatif', focus: '사동: 이/히/리/기/우/추 (먹이다, 앉히다, 울리다, 웃기다), -게 하다, -도록 하다', context: 'menyuruh dan membuat orang melakukan sesuatu' },
  { level: '3급', strand: 'imbuhan', title: 'Akhiran Ingatan: 더', focus: '-더라고요 (aku ingat melihat), -던 (yang dulu biasa), -았/었던 (yang pernah), -더니 (dulu begitu, sekarang)', context: 'menceritakan pengalaman yang kamu saksikan sendiri' },
  { level: '3급', strand: 'tatabahasa', title: 'Meski dan Walaupun', focus: '-아/어도, -더라도, -(으)ㄴ/는데도, -(으)ㄹ지라도 — bertingkat dari sehari-hari ke formal', context: 'menyampaikan hal yang tetap terjadi' },
  { level: '3급', strand: 'tatabahasa', title: 'Sebab Tingkat Lanjut', focus: '-는 바람에 (gara-gara, akibat buruk), -(으)ㄴ/는 덕분에 (berkat), -(으)ㄴ/는 탓에 (gara-gara), -(으)로 인해 (formal)', context: 'menjelaskan sebab dengan nuansa' },
  { level: '3급', strand: 'tatabahasa', title: 'Sebagai Ganti', focus: '-는 대신에, -(으)ㄴ/는 반면에, -(으)ㄹ 뿐만 아니라, -(으)ㄴ/는 데다가', context: 'menambahkan dan mempertentangkan' },
  { level: '3급', strand: 'tatabahasa', title: 'Kecenderungan', focus: '-(으)ㄴ/는 편이다 (cenderung), -기 쉽다/어렵다, -는 경향이 있다, -곤 하다 (biasa melakukan)', context: 'menggambarkan kebiasaan dan sifat' },
  { level: '3급', strand: 'tatabahasa', title: 'Perkiraan dan Kekhawatiran', focus: '-(으)ㄹ 텐데, -(으)ㄹ 테니까, -(으)ㄹ까 봐 (khawatir kalau), -(으)ㄹ 뻔하다 (nyaris)', context: 'mengantisipasi dan mengkhawatirkan' },
  { level: '3급', strand: 'tatabahasa', title: 'Sudah Terlanjur', focus: '-아/어 버리다 (terlanjur, lega atau menyesal), -고 말다 (akhirnya terjadi), -아/어 놓다/두다 (dibiarkan siap)', context: 'menceritakan hal yang sudah telanjur' },
  { level: '3급', strand: 'tatabahasa', title: 'Sedang Berlangsung', focus: '-는 중이다, -아/어 가다/오다 (berlanjut ke depan/dari dulu), -아/어 있다 (keadaan hasil, beda dengan -고 있다)', context: 'menjelaskan proses dan keadaan' },
  { level: '3급', strand: 'tatabahasa', title: 'Selagi dan Sekalian', focus: '-는 김에 (sekalian), -는 길에 (di jalan), -(으)ㄴ 채로 (dalam keadaan), -(으)ㄹ 겸 (sekaligus)', context: 'menumpangkan kegiatan pada kegiatan lain' },
  { level: '3급', strand: 'tatabahasa', title: 'Sampai Segitunya', focus: '-(으)ㄹ 정도로, -(으)ㄹ 만큼, -(으)면 -(으)ㄹ수록 (makin…makin), 얼마나 -(으)ㄴ지 모르다', context: 'menyatakan derajat secara hidup' },
  { level: '3급', strand: 'tatabahasa', title: 'Keharusan dan Kepastian', focus: '-기 마련이다 (sudah semestinya), -는 법이다, -(으)ㄹ 수밖에 없다, -지 않을 수 없다', context: 'menyatakan hal yang tak terhindarkan' },
  { level: '3급', strand: 'tatabahasa', title: 'Pura-pura dan Sekadar', focus: '-(으)ㄴ/는 척하다, -(으)ㄴ/는 셈이다, -(으)ㄹ 뿐이다, -기만 하다', context: 'menyampaikan penilaian yang halus' },
  { level: '3급', strand: 'tatabahasa', title: 'Membaca Teks Menengah', focus: 'Strategi 읽기 TOPIK II: mengenali 접속 부사 (그러나, 따라서, 반면), menemukan kalimat inti, dan membaca soal 순서 배열', context: 'membaca artikel dan esai pendek' },
  { level: '3급', strand: 'tatabahasa', title: 'Menulis Paragraf', focus: 'Struktur 서론-본론-결론, penanda urutan (첫째, 둘째), dan pergantian ke 문어체 (-ㄴ다/는다) untuk tulisan', context: 'menulis jawaban TOPIK 쓰기' },
]

const T4: CurriculumEntry[] = [
  { level: '4급', strand: 'imbuhan', title: 'Akhiran Tulisan Formal', focus: '문어체 (평서문 -ㄴ다/는다, 의문문 -는가, 명령 -(으)라) — bentuk yang dipakai di berita, laporan, dan jawaban 쓰기', context: 'menulis laporan dan esai' },
  { level: '4급', strand: 'imbuhan', title: 'Nominalisasi Formal', focus: '-(으)ㅁ dan -기 dalam tulisan resmi (참석 요망, 제출 바람), serta -(으)ㄴ/는 것 yang lebih lisan', context: 'menulis pengumuman dan dokumen' },
  { level: '4급', strand: 'tatabahasa', title: 'Karena Itulah', focus: '-길래, -느라고 (sibuk melakukan sehingga), -는 통에, -(으)ㅁ으로써', context: 'menjelaskan sebab yang spesifik' },
  { level: '4급', strand: 'tatabahasa', title: 'Sesuai dan Berdasarkan', focus: '-에 따라(서), -에 의하면 (menurut), -(으)ㄴ/는 대로 (sesuai), -을/를 바탕으로', context: 'mengutip sumber dan aturan' },
  { level: '4급', strand: 'tatabahasa', title: 'Terlepas dari Itu', focus: '-(으)ㄴ/는 데 반해, -(으)ㅁ에도 불구하고, -기는커녕, -은/는커녕', context: 'menyampaikan pertentangan dalam tulisan' },
  { level: '4급', strand: 'tatabahasa', title: 'Kemungkinan dan Kekhawatiran', focus: '-기 십상이다, -기 쉽다, -(으)ㄹ 우려가 있다, -(으)ㄹ 가능성이 있다', context: 'menimbang risiko' },
  { level: '4급', strand: 'tatabahasa', title: 'Setengah-setengah', focus: '-는 둥 마는 둥, -(으)ㄴ/는 둥, -다시피 하다, -(으)ㄴ/는 듯하다', context: 'menggambarkan tindakan yang tidak tuntas' },
  { level: '4급', strand: 'tatabahasa', title: 'Sekadar dan Justru', focus: '-에 불과하다, -(이)나 다름없다, -(으)ㄹ 따름이다, 오히려 …-(으)ㄴ 셈이다', context: 'menilai secara kritis' },
  { level: '4급', strand: 'tatabahasa', title: 'Kalau Memang Begitu', focus: '-(으)ㄹ 바에는, -느니, -기에 망정이지, -(으)ㄹ지언정', context: 'memilih di antara dua yang sama-sama buruk' },
  { level: '4급', strand: 'tatabahasa', title: 'Semakin dan Sebaliknya', focus: '갈수록, 점점, -(으)면 -(으)ㄹ수록 (ulasan), -아/어 갈수록, 이에 반해', context: 'menjelaskan tren dalam laporan' },
  { level: '4급', strand: 'tatabahasa', title: 'Kata Serapan Sino-Korea', focus: '한자어: pola pembentukan -적, -성, -화, -력, -물, -자, -원 — dan kenapa 60% kosakata Korea berasal dari sini', context: 'menebak arti kata baru di berita' },
  { level: '4급', strand: 'tatabahasa', title: 'Ungkapan Tetap', focus: '관용구: 눈이 높다, 발이 넓다, 손이 크다, 귀가 얇다, 입이 무겁다, 머리가 아프다', context: 'memahami percakapan penutur asli' },
]

const T5: CurriculumEntry[] = [
  { level: '5급', strand: 'tatabahasa', title: 'Bergantung Sepenuhnya', focus: '-기 나름이다, -에 달려 있다, -기에 따라, -(으)ㄴ/는 만큼', context: 'menjelaskan faktor penentu' },
  { level: '5급', strand: 'tatabahasa', title: 'Selama dan Sejauh', focus: '-는 한, -(으)ㄴ/는 이상, -(으)ㄹ 바에야, -(으)ㅁ에 따라', context: 'menulis syarat dalam dokumen' },
  { level: '5급', strand: 'tatabahasa', title: 'Menuju dan Demi', focus: '-고자, -(으)려는, -기 위한, -(으)ㅁ으로써 (ulasan), -도록 (formal)', context: 'menulis proposal dan tujuan kebijakan' },
  { level: '5급', strand: 'tatabahasa', title: 'Sekaligus Menyangkal', focus: '-(으)ㄹ 리가 없다, -(으)ㄹ 법하다, -(으)ㄴ/는 셈치고, -(으)ㄹ 턱이 없다', context: 'menyangkal dugaan dalam argumen' },
  { level: '5급', strand: 'tatabahasa', title: 'Baru Saja dan Nyaris Saja', focus: '-기가 무섭게, -자 (bersamaan, formal), -기에 이르다, -(으)ㄴ 나머지', context: 'narasi tulis yang rapat' },
  { level: '5급', strand: 'tatabahasa', title: 'Penilaian Formal', focus: '-(으)ㄹ 만하다 (ulasan formal), -기 그지없다, -기 짝이 없다, -(으)ㅁ이 틀림없다', context: 'menulis ulasan dan penilaian' },
  { level: '5급', strand: 'tatabahasa', title: 'Argumen Bertingkat', focus: '-거니와, -(으)려니와, -(으)ㄹ뿐더러, 뿐만 아니라 — menumpuk alasan dalam kalimat formal', context: 'menulis esai argumentatif' },
  { level: '5급', strand: 'tatabahasa', title: 'Membaca Teks Panjang', focus: 'Strategi 읽기 tingkat lanjut: melacak 지시어 (이러한, 그러한), menemukan 주제문, dan membedakan fakta dari pendapat penulis', context: 'membaca kolom opini dan artikel akademik' },
]

const T6: CurriculumEntry[] = [
  { level: '6급', strand: 'tatabahasa', title: 'Bahasa Tulis Kaku', focus: '-(으)ㄴ바, -(으)ㅁ에 다름 아니다, -(으)ㄹ진대, -하기에 이르렀다 — bentuk yang hampir hanya muncul di tulisan resmi', context: 'membaca dokumen pemerintah dan akademik' },
  { level: '6급', strand: 'tatabahasa', title: 'Konsesi Tingkat Tinggi', focus: '-기로서니, -(느)ㄴ들, -(으)ㄹ지언정 (ulasan), -았/었자', context: 'argumen yang mengakui lalu membalik' },
  { level: '6급', strand: 'tatabahasa', title: 'Peribahasa', focus: '속담: 발 없는 말이 천 리 간다, 가는 말이 고와야 오는 말이 곱다, 세 살 버릇 여든까지 간다, 우물 안 개구리, 티끌 모아 태산', context: 'memahami tulisan dan ceramah' },
  { level: '6급', strand: 'tatabahasa', title: 'Empat Aksara Sino-Korea', focus: '사자성어: 일석이조, 새옹지마, 유비무환, 각골난망, 대기만성, 청출어람', context: 'membaca kolom dan pidato' },
  { level: '6급', strand: 'tatabahasa', title: 'Ragam Bahasa Media', focus: 'Gaya judul berita (kata kerja dihilangkan, -ㄴ다 sebagai lampau), bahasa siaran, dan istilah jurnalistik', context: 'membaca dan menyimak berita Korea' },
  { level: '6급', strand: 'tatabahasa', title: 'Nuansa Akhir Kalimat', focus: '-(으)ㄹ 텐데도, -단 말이다, -는 마당에, -(으)ㄴ 셈 치다 — nuansa yang tidak muncul di terjemahan', context: 'menangkap maksud tersirat' },
  { level: '6급', strand: 'tatabahasa', title: 'Dialek dan Ragam Lisan', focus: 'Ciri 사투리 utama (부산·전라·제주), bentuk lisan yang dipendekkan (뭐 해 → 뭐해, 이거 → 이거), dan bahasa anak muda', context: 'memahami drama, variety show, dan percakapan nyata' },
  { level: '6급', strand: 'tatabahasa', title: 'Menulis Esai TOPIK 54번', focus: 'Menyusun 600–700 자 esai argumentatif: struktur, 문어체 konsisten, penanda wacana, dan mengelola waktu', context: 'soal menulis panjang di TOPIK II' },
]

export const KO_GRAMMAR: CurriculumEntry[] = [...T1, ...T2, ...T3, ...T4, ...T5, ...T6]
