# 🗣️ Lingua Lab — Roadmap Project

> Web app **pribadi** buat belajar banyak bahasa secara utuh: **kosakata, grammar & tenses,
> ungkapan, menyusun kalimat, mendengar (dikte), dan menulis** — bukan cuma hafal kosakata.
>
> Alurnya: sekali saja pilih bahasa & level → AI menyusun **silabus** → setiap hari cukup
> satu tombol *Lanjutkan belajar*. App yang menentukan hari ini baca materi atau mengulang,
> dengan **spaced repetition (FSRS)**. Kamu murid, bukan penyusun materi.
>
> Mulai dari **Inggris**. Bahasa lain (Korea, Jepang, Spanyol, dst) nyusul lewat **config**.

---

## 1. Konsep Inti

Unit dasar aplikasinya **bukan kartu vocab**, tapi **unit belajar**. Satu unit = satu topik, isinya:

| Bagian | Bentuk | Cara dilatih |
|---|---|---|
| **Materi** (`lesson`) | Penjelasan singkat + pola + contoh | Dibaca, bisa dibuka ulang kapan saja |
| **Item latihan** (`items`) | Vocab, grammar, kalimat, ungkapan, cara baca | Masuk jadwal SRS, dilatih berulang |

Contoh unit "Perkenalan (A1, Inggris)" isinya:
- **Materi**: pola `I'm… / My name is… / Nice to meet you`, kapan pakai formal vs kasual
- **Vocab**: `introduce`, `acquaintance`, `to be from`
- **Ungkapan**: `Nice to meet you.` → "Senang berkenalan."
- **Grammar (cloze)**: `Hi, I ___ Yunda.` → `am`
- **Kalimat**: "Saya dari Surabaya." → `I'm from Surabaya.`

### Yang memakai app ini adalah MURID, bukan penyusun materi

Ini kesalahan desain pertama yang harus dihindari — dan sudah pernah terjadi sekali di
project ini. Versi awal meminta pengguna memikirkan topik sendiri, menekan “Buat materi”,
lalu “+10 kosakata”. Itu memindahkan pekerjaan penyusun kurikulum ke murid.

Aturannya sekarang: **pengguna tidak pernah memilih topik dan tidak pernah menekan tombol
generate.** Dia menekan satu tombol, dan app yang memutuskan.

**Sekali saja, saat mulai** (`/start`): pilih bahasa → kemampuan sekarang → tujuan (opsional).
Dari situ AI menyusun **silabus**: 12 pelajaran berurutan, prasyarat lebih dulu.

**Setiap hari** cuma satu tombol — *Lanjutkan belajar* (`/learn`). Tujuannya diputuskan
`lib/study/next.ts` dengan urutan prioritas:

1. belum punya jalur belajar → onboarding
2. ada yang jatuh tempo → **latihan** (ingatan yang mau luntur lebih penting daripada materi baru)
3. ada pelajaran berikutnya → pelajaran itu, **disiapkan otomatis** saat dibuka
4. tidak ada apa-apa → selesai untuk hari ini

Generate materi & item tetap terjadi — tapi di belakang layar, dengan indikator progres,
dan hanya untuk pelajaran yang benar-benar didatangi. Kalau seluruh silabus digenerate di
awal, kuota AI harian habis untuk pelajaran yang belum tentu disentuh.

> **Membuat pelajaran sendiri tetap bisa** lewat `/new`, tapi sengaja ditaruh sebagai tautan
> kecil di bawah dashboard — untuk kasus kamu memang mau topik spesifik (“kosakata dapur”,
> “TOEFL”). Bukan bagian dari alur utama.

### Kurikulum itu DATA, bukan hasil generate

Kelengkapan tidak bisa diverifikasi kalau daftarnya dikarang ulang tiap kali. AI yang
diminta "susun silabus lengkap" akan menghasilkan sesuatu yang **terlihat** lengkap tapi
bisa melewatkan `in/at/on` atau `this/that/these/those` — dan pelajar pemula tidak punya
cara mengetahui ada yang bolong.

Karena itu kurikulum Inggris ditulis sebagai data di
[`lib/languages/curriculum.ts`](./lib/languages/curriculum.ts): **84 pelajaran grammar**,
urut, bisa dibaca dan dihitung sendiri — dan sejak diperluas, benar-benar dari nol sampai
mahir (A1 → **C2**).

| Level | Pelajaran | Cakupan |
|---|---|---|
| A1 | 16 | to be · articles · demonstratives · plural · possessive · there is/are · present simple · adverb frekuensi · **in/on/at tempat & waktu** · can · imperative · question words · countable |
| A2 | 16 | present continuous · was/were · past simple (regular, irregular, did) · past continuous · going to · will · comparative · superlative · adverb · object pronoun · preposisi gerakan · must/should · gerund vs infinitive |
| B1 | 16 | present perfect (+ for/since) · past perfect · used to · conditional 1/2/3 · passive · reported speech · relative clause · modals of deduction · question tag · phrasal verb · linking words |
| B2 | 16 | verb pattern lanjutan · wish · causative · article lanjutan · quantifier · participle clause · dependent preposition · subject–verb agreement · **parallel structure** · word formation · modal perfect · future perfect · pasif lanjutan · relative lanjutan · mixed conditional · emphasis & fronting |
| C1 | 12 | inversion & cleft · subjunctive · nominalisasi · hedging · discourse marker · ellipsis · absolute clause · verb pattern rumit · modalitas halus · artikel abstrak · kalimat panjang · kolokasi |
| C2 | 8 | register & nada · ironi/understatement · argumen kompleks · idiom & metafora · ragam British/American · bahasa hukum · menyunting sendiri · ritme tulisan |

Grammar cuma satu dari lima bagian. Inggris juga punya, sebagai data:

| Berkas | Isi | Jumlah |
|---|---|---|
| [`en/foundations.ts`](./lib/languages/en/foundations.ts) → bunyi | IPA, silent letter, tekanan kata, schwa, connected speech | 12 pelajaran |
| [`en/vocabulary.ts`](./lib/languages/en/vocabulary.ts) | kosakata inti per tema, A1 → C2 | **880 kata**, 74 tema |
| [`vocabulary.ts`](./lib/languages/vocabulary.ts) | Academic Word List | 570 kata, 38 pelajaran |
| [`en/foundations.ts`](./lib/languages/en/foundations.ts) → imbuhan | prefix, suffix, word family | 12 pelajaran |
| [`en/foundations.ts`](./lib/languages/en/foundations.ts) → percakapan | situasional, A1 → C2 | 24 pelajaran |

Total jalur Inggris dari A1: **244 pelajaran**.

> **Kenapa kosakata inti perlu ada di samping AWL.** AWL sengaja TIDAK memuat 2.000 kata
> paling umum — daftar itu mengasumsikan kata dasar sudah dikuasai. Untuk pelajar A1
> asumsinya tidak berlaku, dan akibatnya nyata: sebelum `en/vocabulary.ts` ada, pemula
> bahasa Inggris di app ini **tidak punya satu pun pelajaran kosakata** sampai level A2,
> dan yang pertama muncul adalah `analyse` dan `constitute`.

> **Kenapa Inggris punya bagian "Aksara".** Karena yang dilatih bukan hurufnya, tapi
> hubungan tulisan↔bunyi — dan di bahasa Inggris hubungan itu justru lebih tidak beraturan
> daripada kana (`though`/`through`/`thought`). Jenis item yang dipakai sama persis
> (`script`): lambang bunyi → cara membacanya.

AI tetap dipakai — tapi untuk mengisi **materi dan latihan** tiap pelajaran, bukan untuk
memutuskan apa yang perlu dipelajari. Konsekuensi lain: silabus Inggris terbentuk
**tanpa satu pun panggilan AI**, jadi onboarding-nya instan.

Jalur silabus buatan AI (`lib/study/syllabus.ts`) masih ada sebagai jaring untuk bahasa
yang belum punya kurikulum tetap — tapi sekarang tidak dipakai bahasa mana pun yang aktif.
Menambah kurikulum untuk bahasa berikutnya = menambah satu entri di `CURRICULA`.

#### Korea: 1급 → 6급

Dibangun belakangan, dan hampir seluruhnya cuma **menambah data** — bukti bahwa
arsitekturnya memang language-agnostic. Yang perlu ditulis di luar data cuma satu
fungsi `koreanTracks` di [`tracks.ts`](./lib/languages/tracks.ts).

| Berkas | Isi | Jumlah |
|---|---|---|
| [`ko/hangul.ts`](./lib/languages/ko/hangul.ts) | 자음 19 · 모음 21 · 받침 · **7 aturan bunyi** | 40 jamo → 13 pelajaran |
| [`ko/grammar.ts`](./lib/languages/ko/grammar.ts) | 조사·어미 (24) + 문법 (69) | 93 pelajaran |
| [`ko/vocabulary.ts`](./lib/languages/ko/vocabulary.ts) | kosakata inti per tema | **758 kata** → 64 pelajaran |
| [`ko/conversation.ts`](./lib/languages/ko/conversation.ts) | kalimat situasional | 29 pelajaran |

Total dari 1급: **199 pelajaran**, enam tingkat penuh.

Tiga keputusan yang perlu dinyatakan:

- **Levelnya 급, bukan "TOPIK 1–6".** Ini gampang tertukar: **ujiannya cuma DUA**
  (TOPIK I dan TOPIK II), yang enam adalah tingkat sertifikatnya (급). TOPIK I
  memberi 1급/2급, TOPIK II memberi 3급–6급 — dari lembar soal yang sama, tingkatnya
  ditentukan skor. Menulis level sebagai "TOPIK 2" membuatnya terbaca sebagai nama
  ujian. (Versi pertama memang salah begitu; diperbaiki lewat
  `npm run db:rename-ko-levels`.)

- **Aturan bunyi masuk bagian Aksara, bukan tata bahasa.** Hafal 40 jamo tidak
  membuat kamu bisa membaca: 좋아요 dibaca [조아요], 한국말 dibaca [한궁말],
  같이 dibaca [가치]. Tujuh aturan perubahan bunyi (연음, 비음화, 유음화, 격음화,
  경음화, ㅎ 탈락, 구개음화) ikut di sana, bukan ditinggalkan.
- **Tidak ada bagian hanja.** TOPIK tidak mengujinya dan koran Korea modern praktis
  tidak memakainya. Kata Sino-Korea tetap masuk — lewat kosakata dan pola
  pembentukan kata (-적, -성, -화), bukan lewat hafalan karakter.

#### Jepang: empat jalur sekaligus

Bahasa Jepang tidak cukup dengan satu daftar grammar — ada aksara dan kanji yang harus
jalan berdampingan. Semuanya ada sebagai data di [`lib/languages/ja/`](./lib/languages/ja/):

| Berkas | Isi | Jumlah |
|---|---|---|
| [`grammar.ts`](./lib/languages/ja/grammar.ts) | pola tata bahasa N5 → N1 | **136 pelajaran** (N5 24 · N4 26 · N3 28 · N2 28 · N1 30) |
| [`kana.ts`](./lib/languages/ja/kana.ts) | hiragana & katakana lengkap: 清音 46, 濁音/半濁音 25, 拗音 33 | **208 tanda** → 16 pelajaran |
| [`kanji.ts`](./lib/languages/ja/kanji.ts) | N5–N4 daftar JLPT konvensional, N3 ke atas 教育漢字 MEXT | **1.414 kanji** → 120 pelajaran |
| [`vocabulary.ts`](./lib/languages/ja/vocabulary.ts) | kosakata inti per tema | **1.175 kata** → 100 pelajaran |
| [`conversation.ts`](./lib/languages/ja/conversation.ts) | kalimat situasional, N5 → N1 | 32 pelajaran |

Tiga hal yang dinyatakan terus terang di komentar tiap berkas, karena kalau tidak, angkanya
terdengar lebih pasti daripada kenyataannya:

- **JLPT tidak menerbitkan daftar resmi** grammar maupun kanji sejak 2010. Pembagian level
  di sini mengikuti konsensus buku persiapan (grammar) dan 教育漢字 resmi MEXT (kanji).
  Yang dijamin **cakupannya**, bukan penempatan level tiap butirnya.
- **Kosakata tidak bisa dituliskan lengkap** seperti AWL. N1 butuh ±10.000 kata; yang
  ditulis di sini kosakata intinya. Sisanya masuk lewat kanji dan bacaan.
- **Kanji SMP tidak dimasukkan seluruhnya** (1.110); yang diambil ±470 yang paling sering
  muncul. Itu keputusan sadar, bukan kelalaian.

Bagian **Percakapan** menutup lubang yang nyata: kurikulum grammar mengajarkan
〜てもいいですか sebagai POLA, tapi tidak pernah mengajarkan bahwa waktu masuk ruangan
orang Jepang bilang 失礼します — dan yang kedua yang dipakai tiap hari.

Total dari N5: **404 pelajaran**, tanpa satu pun panggilan AI untuk menyusunnya.

Urutan silabusnya: kana **seluruhnya di depan** (mustahil belajar apa pun sebelum bisa
membacanya), lalu sisanya **diselipkan merata per level** lewat
[`lib/languages/tracks.ts`](./lib/languages/tracks.ts). Penyisipannya per level, bukan
sekali untuk seluruh silabus — kalau tidak, kanji N4 muncul di pelajaran ke-38 sementara
grammar masih N5.

#### Mandarin: HSK 1 → HSK 6

Bahasa keempat, dan yang paling jelas memperlihatkan batas dari "bahasa itu data": yang
perlu ditulis di luar data cuma satu fungsi `chineseTracks` di
[`tracks.ts`](./lib/languages/tracks.ts) **dan satu jenis item baru** (`hanzi`).

| Berkas | Isi | Jumlah |
|---|---|---|
| [`zh/pinyin.ts`](./lib/languages/zh/pinyin.ts) | empat nada · 变调 · 声母 · 韵母 · ejaan baku · 轻声 · 儿化 | 11 pelajaran |
| [`zh/hanzi.ts`](./lib/languages/zh/hanzi.ts) | karakter per tingkat, diturunkan dari daftar kosakata HSK | **2.730 karakter** → 231 pelajaran |
| [`zh/grammar.ts`](./lib/languages/zh/grammar.ts) | 虚词 (34) + 语法 (53) | 87 pelajaran |
| [`zh/vocabulary.ts`](./lib/languages/zh/vocabulary.ts) | kosakata inti per tema | **724 kata** → 62 pelajaran |
| [`zh/conversation.ts`](./lib/languages/zh/conversation.ts) | kalimat situasional | 30 pelajaran |

Total dari HSK 1: **421 pelajaran**, enam tingkat penuh, tanpa satu pun panggilan AI
untuk menyusunnya.

Lima keputusan yang perlu dinyatakan:

- **Bagian "Aksara" isinya pinyin, bukan karakter** — dan jenis itemnya `sound`, bukan
  `script`. Kana dan hangul dilatih dengan mengetik romanisasinya (き → "ki", 가 → "ga");
  pinyin **itu sendiri** romanisasinya, jadi tidak ada yang bisa diketik sebagai jawaban.
  Persoalannya sama dengan IPA bahasa Inggris, dan penyelesaiannya pun sama: lihat
  lambangnya, ucapkan, buka jawabannya, nilai sendiri.

- **Nada ditaruh di pelajaran pertama, sebelum satu konsonan pun.** Ini kebalikan dari
  urutan hampir semua buku, dan itu disengaja: mā/má/mǎ/mà adalah empat kata, bukan satu
  kata dengan empat aksen. Pelajar yang menunda nada akan menghafal seluruh kosakatanya
  dengan nada yang salah, dan memperbaikinya jauh lebih mahal daripada mempelajarinya
  dari awal.

- **`hanzi` jenis item tersendiri, bukan `kanji` yang dipakai ulang.** Bedanya bukan
  bahasanya, tapi isi kartunya: kartu kanji dibangun di sekitar 音読み/訓読み, sementara
  kartu hanzi butuh 部首, bentuk tradisional (学 ↔ 學), dan 多音字 (行 xíng/háng).
  Menyatukan keduanya berarti kartu Mandarin punya kolom 音読み yang selalu kosong dan
  kartu Jepang punya kolom 部首 yang tidak pernah diisi.

- **量词 jadi field kartu kosakata**, sejajar dengan gender pada bahasa Spanyol. 一本书
  benar dan 一个书 salah, dan itu bagian dari **katanya** — bukan catatan tata bahasa
  yang bisa ditaruh di pelajaran terpisah.

- **HSK 2.0 (enam tingkat), bukan HSK 3.0 (sembilan).** Standar 3.0 terbit 2021, tapi
  hampir seluruh buku, kursus, dan syarat beasiswa yang dipakai pelajar Indonesia masih
  ditulis dalam tingkat 2.0.

Dua hal yang dinyatakan terus terang di komentar berkasnya, karena kalau tidak, angkanya
terdengar lebih pasti daripada kenyataannya:

- **HSK tidak menerbitkan daftar tata bahasa** — yang resmi cuma daftar kosakata.
  Pembagian 虚词/语法 per tingkat mengikuti konsensus buku ajar (《HSK标准教程》,
  《发展汉语》, 《博雅汉语》).
- **Pembagian karakter antara HSK 5 dan HSK 6** adalah bagian daftar itu yang paling
  tidak bisa dipertanggungjawabkan: di dua tingkat teratas yang tersisa adalah beberapa
  ribu karakter yang frekuensinya sudah sama-sama rendah. Yang dijamin cakupannya
  (±2.700, kurang lebih sebanyak 2.663 karakter HSK 6), bukan penempatannya.

#### Spanyol: A1 → C2

Bahasa kelima, dan satu-satunya yang **tidak butuh jenis item baru sama sekali** — seluruh
penambahannya data, ditambah satu fungsi `spanishTracks` di
[`tracks.ts`](./lib/languages/tracks.ts).

| Berkas | Isi | Jumlah |
|---|---|---|
| [`es/sounds.ts`](./lib/languages/es/sounds.ts) | huruf yang menipu, r vs rr, tekanan & tanda aksen, ragam | 8 pelajaran |
| [`es/grammar.ts`](./lib/languages/es/grammar.ts) | konjugasi (27) + pola kalimat (58) | 85 pelajaran |
| [`es/vocabulary.ts`](./lib/languages/es/vocabulary.ts) | kosakata inti per tema | **636 kata** → 54 pelajaran |
| [`es/conversation.ts`](./lib/languages/es/conversation.ts) | kalimat situasional | 28 pelajaran |

Total dari A1: **175 pelajaran**, enam tingkat penuh.

Empat keputusan yang perlu dinyatakan:

- **Tab "Imbuhan" bernama Konjugasi**, dan itu bagian terbesar dari bahasa ini. Spanyol
  adalah kebalikan dari Mandarin: Mandarin tidak berkonjugasi sama sekali, Spanyol
  berkonjugasi sampai satu verba punya lebih dari lima puluh bentuk — dan bentuk itu
  **menggantikan kata ganti** (`hablo` sudah berarti "saya bicara"). Salah akhiran bukan
  salah ejaan, itu salah orang. Silabus karangan AI hampir selalu menaruh subjuntivo
  sebagai satu pelajaran bernama "Subjunctive Mood"; di sini ia empat kala, empat pemicu,
  dan aturan korelasi waktu tersendiri.

- **Bagian "Aksara" sengaja KECIL** — 8 pelajaran, bukan 12 seperti bahasa Inggris. Ejaan
  Spanyol nyaris fonemis, jadi yang tersisa cuma huruf yang menipu (h diam, j = "kh",
  v = b), r vs rr yang **membedakan kata** (`pero` tetapi / `perro` anjing), dan aturan
  tekanan yang **membedakan kala** (`hablo` saya bicara / `habló` dia bicara).
  Menggelembungkannya supaya "setara" cuma menghabiskan panggilan AI untuk hal yang sudah
  jelas sejak hari pertama.

- **Kata benda ditulis dengan artikelnya** di daftar kosakata (`la mano`, bukan `mano`),
  karena gender adalah bagian dari katanya — dan `mano` yang berakhir -o tapi feminin
  adalah jenis kata yang paling sering dihafal salah. Field `conjugation` pada kartunya
  punya alasan yang sama dengan 五段/一段 pada bahasa Jepang: tanpa tahu golongannya,
  satu pun konjugasi tidak bisa dibentuk.

- **Ragam wilayah ikut jadi materi, bukan catatan kaki.** Dua puluh negara memakai bahasa
  ini. `coger el autobús` normal di Spanyol dan tidak bisa diucapkan di Argentina;
  `vos hablás` bukan kesalahan `tú hablas`. Tiap pelajaran percakapan menyebut di mana
  kalimatnya wajar, dan generator soal DELE menggilir ragamnya antar paket sambil tetap
  konsisten **di dalam** satu paket.

Satu hal yang dinyatakan terus terang: **PCIC (Plan Curricular del Instituto Cervantes)
adalah satu-satunya daftar resmi per tingkat** di antara kelima bahasa di sini — JLPT,
TOPIK, dan HSK tidak menerbitkan daftar tata bahasanya. Jadi untuk bahasa ini cakupan
*dan* penempatan levelnya punya acuan resmi, bukan cuma konsensus buku ajar.

#### Bagian materi (strand) — tab di dashboard

380 pelajaran dalam satu daftar datar tidak bisa dibaca, dan lebih buruk lagi:
menyamaratakan bahan yang sebenarnya berbeda. "Hafal 12 kanji" dan "paham pola 〜ば〜ほど"
itu pekerjaan yang berbeda, dan orang sering ingin fokus ke salah satunya dulu.

Karena itu tiap unit punya kolom `strand` ([`lib/languages/strands.ts`](./lib/languages/strands.ts)),
dan dashboard menampilkannya sebagai tab yang masing-masing berdiri sendiri — daftar
pelajarannya sendiri, progresnya sendiri, tombol lanjutnya sendiri:

| Tab | Isi | Jepang | Inggris |
|---|---|---|---|
| **Aksara** | sistem tulisan / sistem bunyi | 16 | 12 |
| **Kanji** | karakter + 音読み/訓読み | 120 | — |
| **Kosakata** | kata per tema (+ AWL untuk Inggris) | 100 | 112 |
| **Imbuhan** | partikel & pembentukan kata | 22 | 12 |
| **Tata Bahasa** | pola kalimat | 114 | 84 |
| **Percakapan** | kalimat situasional | 32 | 24 |
| | **total** | **404** | **244** |

| | | | |
|---|---|---|---|
| **Korea** | hangul 13 · kosakata 64 · imbuhan 24 · tata bahasa 69 · percakapan 29 | | **199** |
| | *level: 1급 → 6급* | | |
| **Mandarin** | pinyin 11 · hanzi 231 · kosakata 62 · kata fungsi 34 · tata bahasa 53 · percakapan 30 | | **421** |
| | *level: HSK 1 → HSK 6* | | |
| **Spanyol** | bunyi 8 · kosakata 54 · konjugasi 27 · tata bahasa 58 · percakapan 28 | | **175** |
| | *level: A1 → C2* | | |

Bahasa yang tidak punya kanji otomatis tidak memunculkan tabnya — tidak ada
`if (lang === 'ja')` di halaman mana pun. Nama dan keterangan tab menyesuaikan
bahasanya lewat `OVERRIDES` di [`strands.ts`](./lib/languages/strands.ts): tab yang
sama tertulis **Kana** (あ) untuk Jepang, **Hangul** (가) untuk Korea, **Pinyin** (ā)
untuk Mandarin, **Bunyi & Ejaan** (á) untuk Spanyol, dan **Bunyi** (æ) untuk Inggris — karena "Aksara: hiragana dan katakana"
pada jalur Korea bukan cuma salah, tapi membingungkan orang yang baru mulai. Tab
**Kanji** pun tertulis **Hanzi** (汉) di jalur Mandarin: bagiannya sama (satu kartu =
satu karakter Han), yang berbeda cuma namanya. Dan tab **Imbuhan** tertulis
**Konjugasi** (-ar) di jalur Spanyol, karena di bahasa itu yang menempel pada kata
adalah kala dan persona — bukan partikel. Tab yang terbuka disimpan di URL
(`?tab=`), bukan state klien, jadi tetap bisa di-bookmark dan berpindah tanpa JavaScript.

Tombol utama **tetap satu** dan tetap memutuskan urutan harian lintas bagian; tab hanya
menambah jalan pintas kalau kamu sedang ingin fokus ke satu jenis bahan.

> Jalur yang sudah terlanjur dibuat tidak perlu dibongkar untuk dapat materi baru:
> `npm run db:sync-track` menambahkan pelajaran yang belum ada, mengisi `strand`, dan
> menyusun ulang urutannya — **tanpa menghapus** satu pun unit atau item yang sudah
> digenerate. Jalankan dengan `-- --dry` dulu untuk melihat rencananya.

> **`goal` tidak mengubah daftar pelajaran** pada jalur kurikulum tetap. Tujuan pelajar
> memengaruhi contoh dan kosakata saat materi ditulis, tapi tidak boleh membuat sebuah
> pola grammar terlewat.

### Tiga prinsip desain yang dipegang

**Bahasa itu data.** Nambah bahasa = nambah satu baris di tabel `languages`. Nggak ada `if (lang === 'ja')` di komponen.

**Jenis item itu kode.** Ini beda dari bahasa, dan bedanya penting. Tiap jenis item punya cara render dan cara *menilai* yang berbeda — vocab dinilai sendiri (`Again/Hard/Good/Easy`), cloze dicek otomatis dari jawaban yang ditaip. Logika itu nggak bisa disimpan sebagai config, jadi jangan dipaksa. Yang dijaga: nambah jenis item baru = nambah **satu folder** berisi schema + renderer + grader, tanpa menyentuh mesin SRS-nya.

**Satu sumber kebenaran untuk "sekarang ngapain".** `lib/study/next.ts` dan `lib/study/queue.ts`
adalah satu-satunya yang boleh menjawab itu. Dashboard **tidak boleh** menghitung sendiri
jumlah item yang jatuh tempo — kalau ia punya aturan sendiri, angka di tombol akan berbeda
dari isi sesi latihan ("katanya 15, kok kosong?"). Batas item baru per hari pun harus dihitung
di tempat yang sama.

---

## 2. Jenis Item Latihan

Satu pelajaran melatih **enam** jenis sekaligus, jadi kemampuannya terbangun merata —
bukan cuma hafal kosakata.

| Jenis | Isi | Penilaian | Per pelajaran |
|---|---|---|---|
| `vocab` | kata → arti, IPA, kelas kata, contoh | `self` | 10 |
| `cloze` | kalimat berlubang + jawaban + `grammar_point` | `typed` (otomatis) | 10 |
| `phrase` | ungkapan utuh + arti + nuansa formal/kasual + situasi | `self` | 6 |
| `sentence` | terjemahkan Indonesia → bahasa target (mengetik) | `typed-self` | 10 |
| `listening` | dikte: dengar lalu tulis | `typed` (otomatis) | ~12 *(diturunkan)* |
| `speaking` | kalimat Indonesia → **diucapkan** dalam bahasa target | `typed-self` (suara) | 8 *(diturunkan)* |
| `writing` | karangan pendek, dikoreksi AI dengan rubrik | `ai` | 4 |
| `script` | huruf/suku kata → bunyinya (hangul, kana) | `typed` | 6 — hanya ja/ko |
| `kanji` | kanji → arti + 音読み + 訓読み + kata contoh tiap bacaan | `self` | 12 — hanya ja |
| `reading` | bacaan + soal pilihan ganda | `choice` | 3 |
| `error_spot` | cari bagian yang salah | `choice` | *(dari simulasi)* |
| `quiz` | pilihan ganda apa adanya | `choice` | *(dari simulasi)* |

**Total ±58 item per pelajaran**, dari 5 pangginan AI saja (vocab, cloze, phrase, sentence,
writing). Dikte dan berbicara diturunkan tanpa biaya.

Batas hariannya **30 item baru**; satu pelajaran karena itu terbagi ke ~2 hari, dan review
lama tetap masuk tanpa dibatasi.

### Empat mode penilaian, dan kenapa harus empat

| Mode | Cara kerja | Dipakai untuk |
|---|---|---|
| `self` | lihat jawaban → nilai sendiri (Lupa/Susah/Bisa/Gampang) | pengenalan: vocab, ungkapan |
| `typed` | taip → dicocokkan otomatis | jawaban **tunggal**: cloze, dikte, huruf |
| `typed-self` | taip → kalau sama dengan acuan lolos; kalau beda, acuan ditampilkan dan kamu menilai | produksi **bebas**: terjemahan kalimat |
| `ai` | karangan → dikoreksi AI dengan rubrik | writing |

`typed-self` bukan kemalasan desain, tapi keharusan. "Saya dari Surabaya" bisa jadi
*I'm from Surabaya* / *I am from Surabaya* / *I come from Surabaya* — semuanya benar.
Mencocokkan teks di situ akan **menghukum jawaban yang sebenarnya betul**, dan itu jauh
lebih merusak daripada sesekali kamu menilai dirimu terlalu longgar.

### Latihan yang diturunkan: gratis, dan justru lebih baik

**`listening`** memakai teks yang sudah ada di pelajaran itu — kalimat, ungkapan, **dan
contoh kalimat pada kartu kosakata**. Jawabannya teks itu sendiri, jadi bisa dinilai otomatis.

**`speaking`** memakai item `sentence` yang acuannya sudah ada: kalimat Indonesia muncul,
kamu ucapkan dalam bahasa target, dan Web Speech Recognition menuliskan apa yang terdengar.

Keduanya **nol panggilan AI tambahan**. Dan bukan cuma penghematan — materi yang sama jadi
dilatih lewat empat arah berbeda: baca, dengar, tulis, ucapkan. Itu justru cara mengingat
yang lebih kuat daripada empat set materi yang tidak berhubungan.

> **Transkrip suara itu petunjuk, bukan hakim.** Pengenalan suara sering melenceng untuk
> aksen non-penutur-asli, jadi `speaking` dinilai `typed-self`: kalau transkrip sama dengan
> acuan langsung lolos, kalau beda kamu yang memutuskan. Browser tanpa dukungan
> SpeechRecognition (Firefox, Safari iOS) otomatis dapat jalan mengetik — latihannya tidak
> pernah jadi mustahil dikerjakan.

**`writing` jumlahnya paling sedikit (4).** Ia satu-satunya jenis yang butuh panggilan AI
**setiap kali dijawab**, bukan sekali saat dibuat.

> **Kelengkapan grammar itu tugas SILABUS, bukan jenis item.** `cloze` cuma wadahnya.
> Yang memastikan tenses tercakup berurutan (to be → present simple → continuous → past →
> future → perfect → modals → conditional) adalah prompt di `lib/ai/syllabus.ts`.

---

## 3. Tech Stack (semua gratis)

| Bagian | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Deploy 1-klik ke Vercel |
| Styling | **Tailwind CSS** + shadcn/ui | Komponen rapi & cepat |
| AI — materi | **`gemini-flash-latest`** (kini = 3.7 Flash) | Model gratis **terkuat yang tersedia**. Dipakai buat penjelasan grammar |
| AI — item | **`gemini-flash-lite-latest`** (kini = 3.5 Flash-Lite) | Kuota paling longgar, buat bulk generate item. Wajib `responseSchema` |
| Validasi | **Zod** | Satu schema per jenis item — dipakai buat validasi keluaran AI **dan** turunkan tipe TS |
| Materi | **react-markdown** | Render `lesson_md` |
| Database | **Neon** (free) | Serverless Postgres, ramah Vercel |
| ORM | **Drizzle ORM** | TypeScript-friendly, ringan |
| Auth | **Auth.js v5** — Credentials provider | Username + password. Hash **bcrypt** di DB, sesi **JWT** |
| SRS | **`ts-fsrs`** (npm) | Algoritma Anki modern. **Jangan bikin sendiri** |
| Pelafalan | **Web Speech API** (`speechSynthesis`) | Gratis, tanpa API key, tanpa file audio |
| Chart | **Recharts** | Grafik review & progres |
| Hosting | **Vercel** | Gratis untuk hobby |

### Kenapa Gemini, dan kenapa dua model

**Kenapa Gemini** (bukan Groq/OpenRouter sebagai utama), dua alasan yang spesifik ke project ini:

1. **`responseSchema` beneran mengikat keluaran ke JSON Schema.** Groq cuma punya "JSON mode" — hasilnya JSON valid tapi tidak dijamin sesuai schema. Bedanya kerasa di sini: item `cloze` tanpa lubang, atau dengan dua lubang, itu JSON valid tapi tetap sampah.
2. **Kualitas Indonesia + CJK.** Arti harus dalam bahasa Indonesia, dan nanti ada field `reading` / `romaji` / romanisasi hangul. Model open-source di Groq lemah di dua hal itu.

**Kenapa dua model.** Bagian paling berisiko di app ini adalah penjelasan grammar (lihat §7) — dan itu justru bagian yang requestnya paling **sedikit**. Jadi pakai model terkuat di situ (1 unit = 1 request), dan model berkuota-longgar buat generate item yang volumenya besar.

> **Sudah dites langsung dengan API key ini (Agustus 2026)** — hasilnya:
> - `gemini-flash-latest` → **200 OK**, resolve ke `gemini-3.7-flash`
> - `gemini-flash-lite-latest` → **200 OK**, resolve ke `gemini-3.5-flash-lite`
> - `gemini-3.5-flash` → **200 OK**
> - `gemini-pro-latest` → **429, `limit: 0`** — Pro **tidak ada** di free tier lagi
> - `gemini-2.5-pro` / `gemini-2.5-flash` → **404**, sudah dipensiunkan
>
> `responseSchema` sudah diverifikasi jalan di Flash-Lite dan hasilnya sesuai schema.
> Karena itu pakai alias `*-latest`, jangan hardcode nomor versi — Google mempensiunkan model
> cukup cepat (2.5 sudah hilang), dan alias otomatis ikut naik.

**Hitungan kuota:** 1 unit ≈ 4 request (1 materi + 3 jenis item). Dengan ~250 req/hari di Flash itu ≈ **60 unit sehari** — jauh di atas pemakaian nyata. Kuota harian bukan kendala; yang perlu dijaga cuma **RPM** (jangan generate paralel ngawur — antrekan berurutan) dan **TPM**.

**Cadangan bertingkat kalau kuota habis:**
- **Groq** (Llama/Qwen) — 30 RPM / 14.400 req/hari, sangat cepat. **Jebakannya di TPM ~6K/menit**: kuota request yang kelihatan mewah itu nggak kepakai karena limit token kena duluan. Kalau jatuh ke sini, potong request jadi lebih kecil (misal 5 item sekali jalan).
- **OpenRouter** — 20 RPM, 28+ model gratis lewat satu API. Lapis ketiga.

> **Kuota free tier bisa dipotong sewaktu-waktu** — Desember 2025 Google memotongnya dan banyak orang kaget.
> Karena itu semua panggilan AI harus lewat **satu interface** (`lib/ai/provider.ts`), bukan tersebar
> di banyak file. Ganti provider = ganti config, bukan refactor.

> **Privasi:** free tier artinya prompt kamu boleh dipakai untuk improve produk. Untuk app vocab pribadi
> ini nggak masalah — tapi jangan tempel apa pun yang privat ke dalamnya.

> **Claude & GPT tidak punya free API tier.** Kalau nanti penjelasan grammar Korea/Jepang terasa kurang
> bisa dipercaya, naik ke model berbayar **khusus untuk materi saja** itu sangat murah (sekali per unit).
> Interface provider di atas bikin ini tinggal ganti satu baris. Tidak perlu sekarang.

---

## 4. Fitur — Bertahap (MVP → v1 → v2)

### 🟢 MVP — **SUDAH JALAN** (dites end-to-end)
- [x] Setup project + Neon + Drizzle + schema (`tracks`, `units`, `items`, `item_states`, `review_logs`)
- [x] Login username + password (bcrypt cost 12, sesi JWT, throttle percobaan)
- [x] Seed tabel `languages` — Inggris, **Jepang, dan Korea aktif**; Spanyol siap tapi disabled
- [x] Onboarding `/start`: bahasa → kemampuan → tujuan → **AI menyusun silabus 12 pelajaran**
- [x] `/learn`: satu pintu masuk yang memutuskan latihan vs pelajaran baru
- [x] Penyiapan pelajaran **otomatis** saat dibuka (materi → item → tandai siap), progres kelihatan
- [x] Sesi latihan campuran: `vocab` (self-rate) + `cloze` (taip jawaban, auto-grade di server)
- [x] Integrasi FSRS + batas 20 item baru/hari
- [x] Dashboard: satu tombol + peta silabus + streak
- [x] Tampilan light mode, font Poppins, shortcut keyboard
- [ ] Deploy pertama ke Vercel

### 🟡 v1 (aplikasi utuh)
- [x] **Edit & hapus item + edit materi** — AI kadang salah, harus bisa dikoreksi
- [ ] Jenis item `phrase` (perkenalan & ungkapan sehari-hari) dan `sentence`
- [ ] Tombol **pelafalan** (TTS) di item yang punya field `speakable`
- [x] **Aktifkan bahasa kedua & ketiga** (Jepang, Korea) → arsitekturnya terbukti language-agnostic: yang perlu ditambah cuma data + dua jenis item baru
- [ ] **Statistik**: streak, grafik 30 hari, dan **grammar point terlemah** (dari `tags` + `review_logs`)
- [ ] Daftar unit + cari/filter item
- [ ] Dedup: kata/ungkapan yang sudah ada tidak digenerate ulang
- [ ] Responsive / PWA dasar — latihan dari HP itu use case utama

### 🔵 v2 (nilai plus)
- [x] Jenis item `script` (kana) dan `kanji`
- [ ] **AI grading** untuk `sentence`: bukan benar/salah, tapi koreksi + alasannya
- [ ] Item `listening` (TTS → taip yang kamu dengar)
- [ ] Bahasa ke-3 & ke-4 (Spanyol, dst)
- [ ] Generate unit dari **teks yang di-paste** (artikel/lirik/subtitle)
- [ ] Export ke CSV / format Anki
- [ ] Optimasi parameter FSRS dari `review_logs` sendiri

### 🔍 Uji asap generator AI

`npm run ai:smoke` memanggil penyedia AI **sungguhan** untuk tiap generator yang
bentuk soalnya khas — 漢字読み, 用法, 文の組み立て, 文章の文法, 即時応答,
순서 배열, 문장 삽입, 듣기 대화, 쓰기 54번, plus jenis item `kanji`, `script`,
`sound`, dan penilaian karangan. Jumlah soalnya sengaja 1–3: ini pemeriksa
kesehatan, bukan penghasil bahan.

Ada karena typecheck tidak membuktikan apa pun tentang keluaran AI. Yang rusak
justru hal yang tidak kelihatan dari tipe — dan pada jalan pertama memang
langsung ketahuan satu: **seluruh soal 듣기 대화 Korea ditolak** karena
`splitDialogue` belum mengenali penanda pembicara hangul (남자:/여자:), jadi
naskah percakapan yang benar dikira bukan percakapan. Bentuknya valid, isinya
yang tidak terbaca.

### ⛔ Yang sengaja TIDAK dibikin
Gamifikasi (XP, liga, nyawa), leaderboard, penilaian *speaking*, kurikulum manual yang ditulis tangan.
Aplikasi ini buat satu orang; yang bikin project seperti ini mangkrak justru fitur-fitur itu.

---

## 5. Arsitektur & Struktur Folder

```
app/
  login/                        # Halaman login (username + password)
  (app)/                        # Grup terproteksi — layout-nya yang jadi gerbang auth
    page.tsx                    # Dashboard: SATU tombol + peta silabus
    learn/page.tsx              # Pintu masuk: memutuskan lalu redirect (tidak merender pilihan)
    start/                      # Onboarding: bahasa → level → tujuan → silabus
    unit/[id]/                  # Materi; menyiapkan dirinya sendiri kalau masih `planned`
    practice/                   # Sesi latihan campuran (?lang=en)
    new/                        # Pelajaran buatan sendiri (opsional, di luar jalur)
    stats/page.tsx              # (belum) Grafik + grammar point terlemah
  api/auth/[...nextauth]/route.ts

Aksi server ditaruh sebagai `actions.ts` di sebelah halamannya, bukan sebagai route API —
lebih sedikit boilerplate dan tipenya tersambung langsung. Konsekuensinya harus diingat:
route API tidak dilindungi layout, jadi tiap handler wajib `requireUserId()` sendiri.
lib/
  items/                        # ← satu folder per jenis item
    registry.ts                 # type → { schema, renderer, grader, aiHint }
    vocab/{schema,Renderer,grader}.ts
    cloze/{schema,Renderer,grader}.ts
    phrase/…  sentence/…  script/…
  ai/
    provider.ts                 # SATU interface: generate(schema, prompt) → objek tervalidasi
    providers/gemini.ts         # Impl utama (dua model: pro buat materi, flash buat item)
    providers/groq.ts           # Impl cadangan kalau kuota habis
    syllabus.ts                 # Prompt + schema silabus (1x per jalur belajar)
    lesson.ts                   # Prompt + schema materi
    items.ts                    # Prompt + schema item (dari registry)
  study/
    next.ts                     # "Sekarang ngapain?" — SATU-SATUNYA yang menjawab ini
    queue.ts                    # Antrean latihan + batas item baru/hari
  srs/
    fsrs.ts                     # Wrapper ts-fsrs
    grade.ts                    # Hasil grader → rating FSRS (1..4)
    day.ts                      # Batas hari & streak (timezone-aware)
  db/
    index.ts  schema.ts  seed-languages.ts
  auth.ts
components/
  LessonView.tsx                # react-markdown + styling
  PracticeSession.tsx           # Antrean item; delegasi render ke registry
  SpeakButton.tsx               # Web Speech API + guard voice tersedia
  RatingButtons.tsx  AnswerInput.tsx
  StatsChart.tsx  UnitForm.tsx
```

### Kunci desain 1: registry jenis item

`PracticeSession` **tidak tahu** ada jenis item apa saja. Dia cuma ambil item berikutnya, lihat `item.type`, dan minta renderer + grader dari registry:

```ts
// lib/items/registry.ts
export const ITEM_TYPES = {
  vocab: {
    schema: vocabSchema,          // Zod → validasi keluaran AI + tipe TS
    Renderer: VocabRenderer,
    grading: 'self',              // tombol Again/Hard/Good/Easy
    aiHint: 'Kata tunggal dengan IPA, kelas kata, arti Indonesia, satu contoh kalimat.',
  },
  cloze: {
    schema: clozeSchema,
    Renderer: ClozeRenderer,
    grading: 'typed',             // cocokkan jawaban → rating
    grader: gradeCloze,
    aiHint: 'Satu kalimat dengan tepat satu lubang. Sertakan grammar_point.',
  },
} as const
```

Nambah `phrase` = tambah satu entri. Mesin SRS, tabel DB, dan halaman latihan tidak disentuh.

### Kunci desain 2: field template per bahasa

Tiap bahasa mendefinisikan field apa saja yang dipunyai item `vocab`-nya; isinya disimpan di `items.fields` (`jsonb`).

`languages.field_template` — **Inggris**:
```jsonc
{
  "vocab": [
    { "key": "term",       "label": "Word",       "primary": true, "required": true, "speakable": true },
    { "key": "ipa",        "label": "IPA" },
    { "key": "pos",        "label": "Word class", "enum": ["noun","verb","adjective","adverb","phrase"] },
    { "key": "meaning_id", "label": "Arti",       "required": true },
    { "key": "example",    "label": "Contoh",     "speakable": true },
    { "key": "example_id", "label": "Terjemahan contoh" }
  ],
  "levels": ["A1","A2","B1","B2","C1"],
  "ttsLang": "en-US",
  "itemTypes": ["vocab","cloze","phrase","sentence"]
}
```

Nanti **Jepang** cukup nambah baris — tanpa ubah kode. Perhatikan `itemTypes` yang beda: Jepang butuh `script`, Inggris nggak.
```jsonc
{
  "vocab": [
    { "key": "term",       "label": "Kanji",  "primary": true, "required": true, "speakable": true },
    { "key": "reading",    "label": "Kana",   "required": true },
    { "key": "romaji",     "label": "Romaji" },
    { "key": "meaning_id", "label": "Arti",   "required": true },
    { "key": "example",    "label": "Contoh", "speakable": true }
  ],
  "levels": ["N5","N4","N3","N2","N1"],
  "ttsLang": "ja-JP",
  "itemTypes": ["vocab","script","cloze","phrase","sentence"]
}
```

### Skema tabel (Neon + Drizzle)

Auth.js butuh `users`, `accounts`, `sessions`, `verification_tokens` — dibuat otomatis lewat **Drizzle adapter**. Tabel utama aplikasi:

**`languages`** — config, bukan data user
| kolom | tipe | catatan |
|---|---|---|
| id | uuid (pk) | |
| code | text unique | ISO: `en`, `ko`, `ja`, `es` |
| name / native_name | text | "Inggris" / "English" |
| script | text | `latin` / `hangul` / `japanese` — buat pilih font |
| field_template | jsonb | lihat di atas |
| tts_lang | text | BCP-47: `en-US`, `ja-JP` |
| enabled | bool | matikan bahasa tanpa hapus data |
| sort_order | int | |

**`units`** — dulu bernama "deck"; sekarang menampung materi juga
| kolom | tipe | catatan |
|---|---|---|
| id | uuid (pk) | |
| user_id | uuid (fk → users.id) | |
| language_id | uuid (fk → languages.id) | |
| title / topic / level | text | |
| lesson_md | text | Materi penjelasan (Markdown) |
| lesson_edited | bool | Tandai kalau sudah kamu koreksi manual |
| created_at | timestamptz | |

**`items`** — semua jenis latihan, satu tabel
| kolom | tipe | catatan |
|---|---|---|
| id | uuid (pk) | |
| unit_id | uuid (fk → units.id) | |
| language_id | uuid (fk → languages.id) | **sengaja didenormalisasi** — query "semua item Inggris yang due" jadi tanpa join |
| type | text | `vocab` / `cloze` / `phrase` / `sentence` / `script` |
| fields | jsonb | bentuknya divalidasi Zod sesuai `type` |
| tags | text[] | grammar point, register, dll → dipakai buat analisis kelemahan |
| dedup_key | text | kunci normalisasi (`term` / kalimat) untuk cegah duplikat |
| created_at | timestamptz | |

**`item_states`** — state FSRS, dipisah dari `items` biar unit bisa di-reset tanpa menghapus itemnya
| kolom | tipe | catatan |
|---|---|---|
| item_id | uuid (fk → items.id) | pk gabungan |
| user_id | uuid (fk → users.id) | pk gabungan |
| due | timestamptz | **kolom paling sering diquery** |
| stability / difficulty | real | FSRS |
| elapsed_days / scheduled_days | int | |
| reps / lapses | int | |
| state | smallint | 0 new, 1 learning, 2 review, 3 relearning |
| last_review | timestamptz | |

**`review_logs`** — riwayat mentah; buat streak, grafik, analisis grammar point, dan nanti optimasi FSRS
| kolom | tipe |
|---|---|
| id | bigserial (pk) |
| item_id | uuid (fk → items.id) |
| user_id | uuid (fk → users.id) |
| rating | smallint (1 again, 2 hard, 3 good, 4 easy) |
| answer_given | text (null untuk item self-rated) |
| was_correct | bool (null untuk item self-rated) |
| state_before | smallint |
| due_before | timestamptz |
| duration_ms | int |
| reviewed_at | timestamptz |

**Index yang wajib ada** (kalau nggak, halaman latihan melambat begitu item ratusan):
- `item_states (user_id, due)` — query item jatuh tempo
- `items (unit_id)`, `items (language_id, type)`
- `items (language_id, dedup_key)` unique per user — cegah duplikat
- `review_logs (user_id, reviewed_at)` — streak & grafik
- GIN index di `items (tags)` — analisis grammar point terlemah

### Dari hasil grading ke rating FSRS

FSRS cuma paham 4 rating. Item auto-graded harus dipetakan — ini aturannya, taruh di `lib/srs/grade.ts`:

| Hasil | Rating |
|---|---|
| Benar, cepat (< ~6 detik) | `Easy` (4) |
| Benar | `Good` (3) |
| Benar tapi typo kecil (jarak edit ≤ 1) | `Hard` (2) |
| Salah | `Again` (1) |

Normalisasi sebelum membandingkan: trim, lowercase, rapikan spasi ganda, abaikan tanda baca di ujung. Untuk Spanyol nanti: **jangan** abaikan aksen (`está` ≠ `esta`) — itu beda kata, bukan typo.

---

## 6. Tahapan Pengerjaan (estimasi 5–6 minggu, santai)

Cakupannya nambah dari rencana awal (dulu cuma vocab), jadi jadwalnya ikut nambah. Ini jujur, bukan pesimis.

| Minggu | Fokus | Output |
|---|---|---|
| **1** | Setup + fondasi | Next.js + Neon + Drizzle jalan, auth login, seed Inggris, skema `units`/`items`/`item_states` |
| **2** | Generate | Registry item, generate 2 tahap (materi → item), halaman unit bisa baca materi + lihat item |
| **3** | Latihan + FSRS | Sesi campuran `vocab` + `cloze`, auto-grade, jadwal FSRS benar, dashboard, **deploy pertama** |
| **4** | Koreksi + jenis baru | Edit item & materi, tambah `phrase` + `sentence`, TTS |
| **5** | Bahasa ke-2 + stats | Aktifkan Korea/Jepang lewat config, streak & grafik, grammar point terlemah, responsive |
| **6** | Polish + rilis | Dedup, README rapi, deploy final |

**Checkpoint jujur di akhir minggu 3:** kalau belum bisa kamu pakai buat belajar beneran, **jangan lanjut ke minggu 4** — benerin dulu yang ada. Dua jenis item yang jalan mulus jauh lebih berguna daripada lima yang setengah jadi.

---

## 7. Catatan Penting / Risiko

**Materi grammar dari AI — ini risiko terbesarnya**
- Salah vocab masih ketahuan; **penjelasan grammar yang salah tidak.** Waktu kamu masih pemula di suatu bahasa, kamu nggak punya cara mendeteksi kalau penjelasannya ngawur — dan SRS akan rajin mengulang yang salah itu sampai hafal.
- Mitigasi: minta materi **pendek dan berbasis pola** (bukan esai teori), dan untuk bahasa yang kamu mulai dari nol, **cek sekali** ke referensi asli (buku/situs tepercaya) sebelum dipakai. Kolom `lesson_edited` ada supaya kamu tahu unit mana yang sudah diverifikasi.
- Bahasa Inggris relatif aman karena kamu bisa menilai sendiri — satu alasan lagi kenapa mulai dari Inggris itu tepat.

**AI & generate**
- Generate **2 tahap** (materi dulu, item kemudian, per jenis). Alasannya: satu request besar untuk semuanya rawan kena rate limit, lambat, dan kalau gagal hilang semua. Dua tahap = gagal sebagian masih bisa diulang sebagian.
- Maks **~15 item per jenis** sekali jalan. Kasih loading state, siapkan retry & fallback Groq.
- Wajib `responseSchema` + validasi ulang dengan **Zod** di server. Structured output bukan jaminan isinya masuk akal — `cloze` bisa datang dengan dua lubang atau tanpa lubang sama sekali. Tolak yang tidak lolos, jangan simpan.
- Dedup: kirim daftar `dedup_key` yang sudah kamu punya ke dalam prompt, **dan** pasang unique constraint sebagai jaring pengaman.

**SRS**
- Pakai `ts-fsrs`. Bikin sendiri kelihatannya gampang tapi jadwalnya jelek — dan yang rugi kamu sendiri.
- **Batas hari & timezone**: "due hari ini" dihitung di zona `Asia/Jakarta`, bukan UTC. Ikuti kebiasaan Anki — hari baru mulai jam **04:00**, biar belajar tengah malam tidak memecah streak.
- Batasi item baru per hari (misal 20). Tanpa batas, generate 5 unit sekaligus lalu besoknya ketemu 200 item due — itu cara tercepat berhenti.

**Multi-bahasa**
- Jangan pernah nulis `if (lang === 'ja')` di komponen. Begitu itu muncul, arsitekturnya sudah bocor.
- Font: Jepang/Korea butuh font yang punya glyph-nya (`Noto Sans JP` / `Noto Sans KR`). Pilih font pakai kolom `script`.
- **Input non-Latin**: item `cloze`/`sentence` yang jawabannya hangul/kana perlu keyboard bahasa itu di device kamu. Kalau ribet, sediakan mode pilihan ganda sebagai alternatif — jangan sampai latihannya jadi mustahil dikerjakan dari HP.
- **Web Speech API**: voice tergantung OS. `en-US` hampir selalu ada; `ja-JP`/`ko-KR` di Windows bisa perlu language pack. Cek `speechSynthesis.getVoices()` dulu — **sembunyikan tombolnya kalau voice-nya nggak ada**, jangan biarkan tombol mati tanpa penjelasan.

**Repo publik & keamanan** (kamu mau push ke GitHub)
- Semua kredensial di env, **jangan pernah di-commit**. Pastikan `.env*` ada di `.gitignore` sejak commit pertama.
- Yang dibutuhkan: `DATABASE_URL`, `GEMINI_API_KEY`, `AUTH_SECRET`. Opsional: `GROQ_API_KEY` (cadangan).
- **Login username + password** (bukan Google). Konsekuensinya:
  - Password disimpan sebagai **hash bcrypt** di tabel `users`, di-set lewat script seed. Password mentah tidak pernah masuk kode maupun env.
  - Credentials provider di Auth.js **tidak mendukung sesi database** — wajib `session: { strategy: 'jwt' }`.
  - Gerbang autentikasi ditaruh di **server layout** `app/(app)/layout.tsx`, **bukan middleware**. Dua alasan: bcrypt tidak jalan di Edge runtime (middleware butuh config Auth.js yang dipecah dua — satu bagian lagi yang bisa salah tanpa terasa), dan di Next 16 `middleware.ts` sudah **deprecated**, diganti `proxy.ts`. Menjaga di layout menghindari dua masalah itu sekaligus.
  - Konsekuensinya yang harus diingat: layout **tidak** melindungi route API. Setiap route handler wajib memeriksa sesinya sendiri lewat `requireUserId()`.
  - Halaman login terbuka di internet → **brute force itu risiko nyata**. Pakai passphrase panjang, dan kasih jeda/rate limit sederhana di route login. Jangan bocorkan mana yang salah (username atau password) di pesan error.
- Walau app pribadi, URL Vercel itu **publik**. Tanpa gate, siapa pun bisa menghabiskan kuota Gemini-mu.
- Semua route generate harus cek session di server — jangan cuma sembunyikan tombolnya di UI.

**Infra**
- Neon: pakai `@neondatabase/serverless` + `drizzle-orm/neon-http` biar aman di serverless Vercel.
- Jalankan `drizzle-kit generate` + `push` tiap ubah schema.
- Neon free tier bisa auto-suspend saat idle → request pertama agak lambat. Normal, bukan bug.
- Route generate bisa lewat 10 detik → set `maxDuration` di route handler, atau pecah requestnya lebih kecil.

---

## 8. Langkah Berikutnya
1. ~~Bikin kredensial~~ — **selesai**: `GEMINI_API_KEY` & `DATABASE_URL` (Neon) sudah ada dan sudah dites.
2. Scaffold Next.js + Tailwind + Drizzle + Auth.js, `.gitignore` beres duluan, lalu commit pertama.
3. Jalankan seed: bikin baris `users` (username + hash password) dan `languages` (Inggris).
4. Bikin registry item dengan **`vocab` + `cloze`** saja → alur generate → latihan → sampai beneran kepakai.
5. **Baru** deploy, tambah jenis item lain, lalu bahasa kedua.

> **Rotate kredensial** sebelum repo dibikin publik atau transkrip chat dibagikan —
> Gemini key bikin baru di AI Studio, password Neon reset dari dashboard.

---

## 9. Simulasi Ujian (TOEFL ITP, JLPT, TOPIK, HSK, DELE)

Fitur terpisah dari latihan SRS, dan **pemisahan itu disengaja**:

| | Latihan SRS | Simulasi ujian |
|---|---|---|
| Tujuan | mengingat jangka panjang | mengukur kemampuan sekarang |
| Waktu | tanpa batas | berbatas, per seksi |
| Jadwal | per item, berulang selamanya | sekali kerjakan, lalu dinilai |
| Hasil | interval berikutnya | skor + pembahasan |

Memaksa keduanya ke satu tabel akan merusak keduanya, jadi ada `exams`,
`exam_groups`, `exam_questions`, `exam_answers` tersendiri.

### Struktur yang diikuti

Cetak biru semua format ada sebagai data di
[`lib/exam/formats.ts`](./lib/exam/formats.ts) — jumlah soalnya bisa dihitung, bukan
dipercaya. `lib/exam/blueprint.ts` tinggal pembacanya, dan semua fungsinya menerima
`kind` (id format) sebagai argumen pertama.

| Seksi | Soal | Waktu | Isi |
|---|---|---|---|
| 1 · Listening | 50 | 35 mnt | Part A 30 percakapan pendek · Part B 2×4 percakapan panjang · Part C 3×4 ceramah |
| 2 · Structure & Written Expression | 40 | 25 mnt | Part A 15 melengkapi kalimat · Part B 25 menemukan kesalahan |
| 3 · Reading | 50 | 55 mnt | 5 bacaan × 10 soal |

Tersedia juga mode **latihan cepat** (38 soal, proporsi seksinya sama).

#### JLPT N5 → N1

Lima format, satu per level, mengikuti susunan 問題 resminya:

| Level | Soal | Waktu | 言語知識 | 読解 | 聴解 | Lulus |
|---|---|---|---|---|---|---|
| N5 | 68 | 90 mnt | 38 | 6 | 24 | 80/180 |
| N4 | 87 | 115 mnt | 49 | 10 | 28 | 90/180 |
| N3 | 102 | 140 mnt | 58 | 16 | 28 | 95/180 |
| N2 | 101 | 155 mnt | 54 | 20 | 27 | 90/180 |
| N1 | 100 | 165 mnt | 45 | 23 | 32 | 100/180 |

Bentuk soalnya ditiru satu per satu, bukan disamaratakan jadi pilihan ganda biasa —
漢字読み, 表記, 語形成, 文脈規定, 言い換え類義, 用法, 文法形式, 文の組み立て, 文章の文法,
短文/中文/長文, 情報検索, dan lima jenis 聴解. Masing-masing punya pemeriksa sendiri di
[`lib/ai/exam-ja.ts`](./lib/ai/exam-ja.ts), karena masing-masing punya cara rusak sendiri:
soal 漢字読み yang pilihannya berkanji, 文の組み立て yang urutannya bukan permutasi,
用法 yang pilihannya tidak memakai kata yang diuji.

**Penilaian JLPT punya jebakan yang harus terlihat:** nilai lulus bukan cuma totalnya.
Tiap 得点区分 punya minimum sendiri (19 dari 60, atau 38 dari 120 untuk N4/N5), dan gagal
satu bagian membuat seluruh ujian tidak lulus **sekalipun totalnya jauh di atas batas**.
Halaman hasil menandai bagian yang jeblok dengan warna merah dan garis batas minimum.

> Skor JLPT asli memakai 尺度得点 berbasis IRT — bobot tiap soal bergantung tingkat
> kesulitannya dan tidak pernah diterbitkan. Skor di sini **proporsional** terhadap jumlah
> benar. Artinya "lulus" di sini berarti *kemungkinan besar lulus*, bukan lulus.

#### TOPIK I & II

Ujiannya memang cuma **dua**; yang enam itu tingkat hasilnya (급).

| Format | Soal | Waktu | Bagian | Hasil |
|---|---|---|---|---|
| **TOPIK I** | 70 | 100 mnt | 듣기 30 · 읽기 40 | 1급 (80) · 2급 (140) dari 200 |
| **TOPIK II** | 104 | 180 mnt | 듣기 50 · **쓰기 4** · 읽기 50 | 3급 (120) · 4급 (150) · 5급 (190) · 6급 (230) dari 300 |

**쓰기 memaksa mesin ujiannya berubah.** Sampai sebelum ini seluruh tabel ujian
mengasumsikan tiap soal punya `answer_index` dan bernilai satu poin. TOPIK 쓰기
melanggar keduanya: jawabannya karangan, dan bobotnya 10 · 10 · 30 · 50 poin.
Yang berubah:

- `exam_questions.answer_index` boleh NULL, plus kolom `max_score`
- `exam_answers` menyimpan `text_answer`, `score`, dan `feedback_id`
- penilaian dihitung dari **poin**, bukan jumlah benar (`pointsBySection`) —
  untuk TOEFL & JLPT hasilnya identik karena satu soal memang satu poin
- halaman ujian menampilkan kotak tulis, dan jawabannya dinilai AI dengan rubrik
  resmi TOPIK (내용 · 전개 구조 · 언어 사용) di [`exam-ko.ts`](./lib/ai/exam-ko.ts)

Karangan dinilai **saat disimpan**, bukan menunggu ujian selesai: empat panggilan
AI berturut-turut di akhir cukup lama untuk kena batas durasi serverless, dan
peserta yang kehabisan waktu tetap dapat nilai untuk yang sudah ditulis.

> Nilai 쓰기 adalah bagian **paling tidak bisa dipercaya** di seluruh simulasi —
> penilai manusia pun berbeda pada karangan yang sama. Yang berguna komentarnya,
> bukan angkanya. Ini dinyatakan juga di layar, bukan cuma di sini.

#### HSK 1 → HSK 6

Enam format, satu per tingkat — seperti JLPT, tapi cara lulusnya berbeda lagi.

| Format | Soal | Waktu | Bagian | Lulus |
|---|---|---|---|---|
| **HSK 1** | 40 | 32 mnt | 听力 20 · 阅读 20 | 120 dari 200 |
| **HSK 2** | 60 | 47 mnt | 听力 35 · 阅读 25 | 120 dari 200 |
| **HSK 3** | 80 | 80 mnt | 听力 40 · 阅读 30 · **书写 10** | 180 dari 300 |
| **HSK 4** | 100 | 95 mnt | 听力 45 · 阅读 40 · **书写 15** | 180 dari 300 |
| **HSK 5** | 100 | 110 mnt | 听力 45 · 阅读 45 · **书写 10** | 180 dari 300 |
| **HSK 6** | 101 | 130 mnt | 听力 50 · 阅读 50 · **书写 1 (缩写)** | 180 dari 300 |

**Penilaiannya butuh tipe sendiri** (`HskScoring`), dan bukan karena angkanya berbeda:
HSK punya ambang **lulus** seperti JLPT (bukan tingkat seperti TOPIK), tapi **tanpa
minimum per bagian**. Peserta HSK 4 yang mendapat 0 di 书写 tetap lulus kalau 听力 dan
阅读-nya cukup tinggi. Memaksakan tipe JLPT ke sini berarti memasang batas per bagian
yang tidak pernah ada di aturannya — dan halaman hasil akan menggambar garis merah
untuk syarat yang tidak eksis.

Bentuk soalnya ditiru satu per satu di [`lib/ai/exam-zh.ts`](./lib/ai/exam-zh.ts),
termasuk dua yang paling sering dilewatkan simulasi buatan:

- **判断对错** — satu-satunya bagian dengan **dua** pilihan (对/错). Jenis item `quiz`
  sudah menerima 2–4 pilihan justru untuk kasus seperti ini; memaksakannya jadi empat
  berarti dua pilihan karangan yang tidak berarti apa-apa.
- **病句** (HSK 6 阅读 第1部分) — memilih kalimat yang **cacat** di antara empat kalimat
  utuh. Ini TIDAK dipetakan ke item `error_spot` walaupun keduanya "cari yang salah":
  `error_spot` menyorot empat potongan dari **satu** kalimat, sementara 病句 menyodorkan
  empat kalimat berbeda.
- **缩写** (书写 HSK 6) — satu soal, seratus poin, 45 menit: baca cerita ±1.000 karakter
  lalu ringkas jadi ±400 tanpa melihat aslinya lagi. Rubriknya 内容 · 结构 · 语言.

**Satu penyesuaian yang dinyatakan terus terang:** HSK 1–3 sungguhan punya beberapa
bagian **bergambar** (看图判断对错, 图片匹配, 看图写句子). Bagian itu tidak dibuat, bukan
karena sulit tapi karena tidak ada gambarnya — dan menyodorkan soal yang mustahil
dikerjakan lebih buruk daripada menggantinya. Padanan teksnya menguji hal yang sama:
判断对错 tanpa gambar, memasangkan kalimat, dan menulis kalimat dari kata yang diberikan.

> Kotak jawaban karangan **berhenti berbahasa Korea** karena bahasa ini. Sampai sebelum
> HSK masuk, placeholder-nya tertulis "한국어로 답을 쓰세요…", satuannya 자, dan
> rubriknya TOPIK — ketiganya ditulis langsung di komponen. Sekarang ketiganya DATA di
> `ExamFormat.writing`, dan pemilihan rubriknya satu tempat di `gradeExamWriting`.

#### DELE A1 → C2

Enam format, satu per tingkat CEFR. Ini format pertama yang **tidak bisa ditiru utuh**, dan
itu harus dinyatakan lebih dulu.

DELE punya **empat** prueba, dan yang keempat — *expresión e interacción orales* — tidak
dibuat di sini. Bukan karena `ExamSection` cuma sampai tiga, tapi karena **tidak ada cara
menilai bicara di modul simulasi ini**: jawaban lisan tidak bisa dinilai otomatis, dan
menyodorkan soal yang tidak bisa dinilai lebih buruk daripada tidak menyodorkannya.
Kemampuan itu tetap dilatih, di jenis item `speaking` pada latihan harian.

| Format | Soal | Waktu | Bagian (CL / CA / EIE) | Apto |
|---|---|---|---|---|
| **DELE A1** | 52 | 90 mnt | 25 / 25 / 2 tugas | 30 per grupo |
| **DELE A2** | 63 | 145 mnt | 30 / 30 / 3 tugas | 30 per grupo |
| **DELE B1** | 62 | 170 mnt | 30 / 30 / 2 tugas | 30 per grupo |
| **DELE B2** | 69 | 190 mnt | 36 / 30 / 3 tugas | 30 per grupo |
| **DELE C1** | 72 | 220 mnt | 40 / 30 / 2 tugas | 30 per grupo |
| **DELE C2** | 81 | 300 mnt | 52 / 26 / 3 tugas | 30 per grupo |

**Penilaiannya memakai tipe `DeleScoring`, yang diturunkan dari `JlptScoring` — bukan
ditulis ulang.** Aturannya memang sama persis: ambang total PLUS minimum tiap bagian, dan
gagal satu bagian membuat seluruh ujian tidak lulus sekalipun totalnya jauh di atas batas.
Yang berbeda cuma angkanya (30 dari 50 per grupo vs 19 dari 60 per 得点区分) dan penandanya
— dan penanda itu ada karena keterangan di layar berbeda: pembaca perlu tahu ini bukan
尺度得点. Empat prueba dikelompokkan jadi dua grupo, dan **Grupo 1 menggabungkan seksi 1 dan
seksi 3** (lectura + escritura) — itu sebabnya `bands.sections` berupa daftar, bukan satu
angka.

Karena Prueba 4 tidak ada, **Grupo 2 dipikul comprensión auditiva sendirian**. Jadi "Apto"
di sini berarti *kemungkinan besar Apto kalau bagian lisanmu sepadan dengan bagian lainnya*.
Ini dinyatakan di halaman hasil, bukan cuma di sini.

Satu invarian yang dijaga di datanya: **poin bagian menulis selalu sama besar dengan jumlah
soal bacaan** pada tingkat yang sama (B2: 36 dan 36). Alasannya keduanya satu grupo dengan
bobot yang sama — kalau bacaannya 36 soal dan karangannya cuma 3 × 10 poin, bagian menulis
tinggal 45% dari grupo itu, dan peserta yang lemah menulis akan terlihat lebih baik daripada
seharusnya.

Dua hal lain yang khas bahasa ini di generator
[`exam-es.ts`](./lib/ai/exam-es.ts):

- **CEFR dipakai langsung sebagai perintah.** JLPT dan HSK harus diterjemahkan dulu ("600
  kata pertama"); "setingkat B2" sudah punya arti presisi karena CEFR mendefinisikan apa
  yang bisa DILAKUKAN pemakai bahasa di tiap tingkat. Deskriptornya masuk ke prompt apa
  adanya.
- **Ragam wilayah dipilih per paket, bukan dibiarkan.** Satu paket yang mencampur
  `vosotros` Spanyol dengan `vos` Argentina terbaca seperti kesalahan, bukan keberagaman.
  Jadi tiap paket memilih satu ragam dan konsisten di dalamnya, sementara antar paket
  ragamnya bergilir — DELE menerima semuanya, dan pelajar yang cuma pernah mendengar satu
  ragam akan kaget di ujian sungguhan.

> Untuk C1 dan C2, DELE sungguhan memakai **destrezas integradas** — satu tugas yang
> menggabungkan menyimak dan menulis sekaligus. Di sini ketiganya tetap dipisah, karena
> soal terpadu menuntut peserta menulis dari rekaman yang teksnya tidak boleh dilihat, dan
> itu tidak bisa dijamin adil dengan TTS.

### Keputusan penting

**Audio dari TTS, bukan file.** Naskah percakapan/ceramah disimpan sebagai teks dan
dibacakan Web Speech API. Nol biaya penyimpanan, nol biaya bandwidth. Naskahnya
**tidak ditampilkan** — kalau terlihat, ini jadi soal membaca. Tanpa voice bahasa
Inggris di perangkat, naskah baru ditampilkan sebagai jalan terakhir dengan
penjelasan kenapa.

**Kunci jawaban tidak pernah dikirim ke browser** selama ujian berjalan. Query di
`/exam/[id]` sengaja tidak memilih kolom `answer_index` dan `explanation_id`;
kebenaran dihitung di server saat jawaban disimpan.

**Timer tanpa state.** Batas tiap seksi dihitung kumulatif dari satu timestamp
`started_at`. Tidak ada jam yang disimpan, jadi menutup tab tidak mereset waktu —
dan jawaban yang sudah dipilih tersimpan langsung.

**Skor adalah perkiraan, dan itu dinyatakan di UI.** Skalanya dikalibrasi ke rentang
resmi ITP Level 1 (tiap seksi 31–68, total 310–677), tapi titik di antaranya
interpolasi. Angka yang terasa resmi padahal perkiraan lebih menyesatkan daripada
tidak ada angka.

**Jumlah soal yang kurang dari cetak biru selalu dilaporkan.** Soal yang tidak lolos
pemeriksaan dibuang, dan halaman pembuka memberi tahu kalau jumlahnya kurang — skor
dari 46 soal tidak sebanding dengan skor dari 50 soal.

### Satu bug yang layak dicatat

Validator percakapan pendek versi pertama memeriksa "apakah setiap BARIS diawali
`Man:`/`Woman:`" dan menolak **100% soal**. Penyebabnya: model menaruh kedua giliran
dalam satu baris tanpa newline —

```
Man: I heard the exam was hard. Woman: Difficult is an understatement…
```

Naskahnya benar; pemeriksanya yang salah asumsi. Sekarang pemisahnya **penanda
pembicara**, bukan newline (`splitDialogue`), dan naskah disimpan sudah ternormalisasi
satu giliran per baris. Pelajarannya: validator yang menolak segalanya itu bug pada
validator, bukan pada yang divalidasi — dan hanya kelihatan karena penolakan selalu
dilaporkan beserta alasannya.

---

## 10. Lingkaran Umpan Balik

Tiga hal yang membuat app ini berhenti jadi kumpulan fitur dan mulai jadi satu sistem.

### 10.1 Soal simulasi yang salah → item latihan

Sebelumnya simulasi hanya **mengukur**: salah soal *parallel structure*, dapat skor, selesai.
Sekarang setiap kesalahan bisa diubah jadi item yang dijadwalkan FSRS.

Pemetaannya dipilih supaya latihannya **lebih sulit** daripada soal aslinya — kalau bisa,
produksi mengalahkan pengenalan:

| Soal simulasi | → item latihan | Kenapa |
|---|---|---|
| Structure | `cloze` | kamu **mengetik** jawabannya, bukan memilih dari 4 pilihan |
| Written Expression | `error_spot` | formatnya memang pilihan ganda; tidak ada cara produktif menirunya |
| Listening | `listening` (dikte) | menulis yang didengar melatih telinga lebih dalam daripada memilih |
| Reading | `reading` | bacaan + soal dibawa apa adanya |

Item hasil konversi diberi tag `from:exam` dan masuk unit tersendiri di luar jalur belajar
utama, jadi urutan kurikulum tidak terganggu. Idempoten: menekan tombolnya dua kali tidak
menghasilkan duplikat (unique constraint `dedup_key`).

Sengaja **tombol, bukan otomatis** — menambah 40 item ke antrean harian itu keputusan yang
bisa membuat beberapa hari ke depan berat.

### 10.2 Statistik: membaca data yang sudah lama terkumpul

`items.tags` (dengan GIN index), `review_logs.was_correct`, dan `review_logs.duration_ms`
sudah ditulis sejak awal — tapi satu-satunya yang membacanya cuma penghitung streak.
Artinya app-nya **sudah tahu** pola grammar mana yang paling sering salah, cuma belum
pernah memberi tahu.

Halaman `/statistik` membaca semuanya: pola terlemah (minimal 3× dijawab, supaya satu
kesalahan kebetulan tidak tampil sebagai kelemahan terbesar), ketepatan per jenis latihan,
aktivitas 30 hari, dan tren skor simulasi.

Dua detail yang penting:

- **Batas harinya sama** dengan yang dipakai streak (Asia/Jakarta, mulai 04:00). Kalau di
  sini pakai UTC, grafiknya bercerita lain daripada angka streak — dan salah satunya pasti
  salah.
- Item yang dinilai sendiri tidak punya `was_correct`, jadi dipakai `rating >= 3` sebagai
  penggantinya. Tanpa itu, separuh riwayat latihan tidak ikut terhitung.

### 10.3 Kurikulum kosakata, sepadan dengan grammar

Ketidakseimbangan yang sempat ditinggalkan: grammar sudah sistematis sebagai data, tapi
kosakata dibiarkan **kebetulan** — apa pun yang kepikiran AI untuk topik pelajaran itu.
Untuk TOEFL justru kosakata yang sering jadi penentu di Reading.

Sekarang [`lib/languages/vocabulary.ts`](./lib/languages/vocabulary.ts) memuat
**Academic Word List, 570 headword** dalam 10 sublist menurut frekuensi → 38 pelajaran
kosakata @15 kata. Kalau `units.word_list` terisi, generator vocab **wajib** memakai kata
itu dan tidak boleh mengarang sendiri.

Kosakata **diselipkan merata** di antara pelajaran grammar, bukan ditumpuk di belakang:
60 grammar + 38 kosakata = **98 pelajaran** yang habis di waktu bersamaan. Kalau kosakata
ditaruh setelah semua grammar selesai, praktis tidak akan pernah sampai ke sana.

### 10.4 Mode penilaian `choice`, dan satu jebakan keamanan

Bacaan dan "cari kesalahan" butuh pilihan ganda di dalam SRS, yang sebelumnya belum ada.
Kuncinya disimpan di `fields.answer_index` — dan `fields` itu jsonb yang dikirim **apa
adanya** ke komponen client.

Tanpa penanganan khusus, jawaban benar bisa dibaca dari DevTools sebelum menjawab. Karena
itu `practice/page.tsx` membuang `answer_index` dan `explanation_id` sebelum mengirim, dan
keduanya baru dikembalikan oleh server **setelah** dijawab. Latihan yang jawabannya bisa
dilihat bukan latihan.
