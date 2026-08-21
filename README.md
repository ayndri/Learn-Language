# Lingua Lab

**Aplikasi belajar bahasa untuk satu orang.** Kurikulum terpandu, materi digenerate AI,
latihan dijadwalkan _spaced repetition_, plus simulasi TOEFL ITP 140 soal.

> _A single-user language learning app. Guided curriculum, AI-generated lessons,
> FSRS spaced repetition, and a 140-question TOEFL ITP mock test.
> Built with Next.js 16, Postgres, and the Gemini API. UI and content are in Indonesian._

---

## Kenapa ini ada

Aplikasi belajar bahasa yang ada biasanya jatuh di salah satu dari dua sisi: **kartu hafalan
saja** (kosakata nempel, tapi tetap tidak bisa menyusun kalimat), atau **kursus terkunci**
yang tidak tahu apa yang sudah kamu kuasai.

Yang ini mencoba di tengahnya, untuk satu pemakai:

- **Kurikulumnya tetap dan bisa diaudit** — bukan dikarang AI tiap kali, jadi tidak ada pola
  grammar yang diam-diam terlewat.
- **Materinya digenerate** — jadi kontennya tidak perlu ditulis tangan 3.500 kali.
- **Kamu murid, bukan penyusun materi** — satu tombol, app yang memutuskan hari ini
  mengulang atau membuka pelajaran baru.

---

## Yang bisa dilakukan

### Jalur belajar terpandu

Sekali saja pilih bahasa dan level, lalu setiap hari cukup satu tombol. `lib/study/next.ts`
yang memutuskan tujuannya:

1. ada yang jatuh tempo → **latihan** (ingatan yang mau luntur lebih penting daripada materi baru)
2. tidak ada → **pelajaran berikutnya**, materi & latihannya disiapkan otomatis
3. habis → selesai untuk hari ini

Untuk bahasa Inggris, jalurnya **98 pelajaran**: 60 grammar (A1→C1, cakupan setara
persiapan TOEFL) + 38 kosakata **Academic Word List** (570 kata), diselipkan merata.

### Tujuh jenis latihan, satu mesin jadwal

| Jenis | Latihan apa | Penilaian |
|---|---|---|
| Kosakata | kata → arti, IPA, kelas kata | nilai sendiri |
| Grammar | isi bagian kosong | otomatis |
| Ungkapan | ungkapan + nuansa formal/kasual | nilai sendiri |
| Menyusun kalimat | Indonesia → bahasa target, diketik | cocokkan, lalu nilai sendiri |
| Dikte | dengar → tulis | otomatis |
| Berbicara | ucapkan, dikenali browser | cocokkan, lalu nilai sendiri |
| Menulis | karangan pendek | **dikoreksi AI** dengan rubrik |
| Bacaan | bacaan + pilihan ganda | otomatis |

±58 item per pelajaran, dari **5 panggilan AI** — dikte dan berbicara diturunkan dari item
yang sudah ada, jadi gratis.

### Simulasi ujian: TOEFL ITP, JLPT, TOPIK, HSK, DELE

TOEFL ITP: **140 soal, ±115 menit**, mengikuti struktur aslinya (Listening 50 ·
Structure & Written Expression 40 · Reading 50). Tersedia juga JLPT N5–N1, TOPIK I/II,
HSK 1–6, dan DELE A1–C2 — masing-masing dengan bentuk soal dan cara penilaiannya sendiri,
termasuk bagian karangan (TOPIK 쓰기, HSK 书写, DELE expresión escrita) yang dinilai AI
dengan rubrik resminya. Bagian lisan DELE tidak ditiru: bicara tidak bisa dinilai
otomatis, dan itu dinyatakan di halaman hasil, bukan disembunyikan.
Soalnya dibuat baru tiap kali, jadi tidak bisa dihafal. Audio Listening dibacakan
Web Speech API — tidak ada file audio yang perlu disimpan.

Setelah selesai: perkiraan skor (skala 310–677), pembahasan tiap soal yang salah, dan tombol
untuk **mengubah kesalahan jadi latihan harian** — Structure jadi soal isi-kosong yang harus
diketik, Listening jadi dikte.

### Statistik

Pola grammar yang paling sering salah, ketepatan per jenis latihan, aktivitas 30 hari, dan
tren skor simulasi.

### Dari bacaanmu

Tempel abstrak jurnal atau artikel → kata yang belum kamu kuasai jadi item latihan, dengan
contoh kalimat dari teks aslinya.

---

## Empat aturan yang menjaga arsitekturnya

Ini bagian yang paling menentukan bentuk kodenya.

**1 · Bahasa itu data.**
Nambah bahasa = nambah satu entri di `lib/db/seed-languages.ts`. Tiap bahasa membawa
_field template_-nya sendiri, jadi kartu Jepang otomatis punya kolom bacaan kana dan romaji
— dan kartu Mandarin punya kolom pinyin dan 量词 — tanpa satu pun `if (lang === 'ja')`
di komponen.

**2 · Jenis latihan itu kode, tapi terisolasi.**
Beda dari bahasa: tiap jenis punya cara menilai yang berbeda, dan itu tidak bisa disimpan
sebagai config. Yang dijaga: nambah jenis baru = nambah satu entri di
`lib/items/registry.ts`, tanpa menyentuh mesin SRS, skema DB, atau halaman latihan.

**3 · Kurikulum itu data, bukan hasil generate.**
Kelengkapan tidak bisa diverifikasi kalau daftarnya dikarang ulang tiap kali. AI yang diminta
"susun silabus lengkap" menghasilkan sesuatu yang _terlihat_ lengkap tapi bisa melewatkan
`in/on/at` — dan pemula tidak punya cara mengetahui ada yang bolong. Jadi kurikulumnya
ditulis sebagai data yang bisa dibaca dan dihitung; AI hanya mengisi materi tiap pelajaran.

**4 · Satu sumber kebenaran untuk "sekarang ngapain".**
`lib/study/next.ts` dan `lib/study/queue.ts` satu-satunya yang menjawab itu. Dashboard tidak
boleh menghitung sendiri jumlah item jatuh tempo — kalau punya aturan sendiri, angka di
tombol akan berbeda dari isi sesi latihan.

### Beberapa keputusan yang menarik

- **Terjemahan kalimat dinilai "cocokkan dulu, lalu nilai sendiri".** _"Saya dari Surabaya"_
  bisa jadi `I'm from Surabaya` / `I am from Surabaya` / `I come from Surabaya` — semuanya
  benar. Mencocokkan teks di situ akan **menghukum jawaban yang betul**, dan itu jauh lebih
  merusak daripada sesekali menilai diri terlalu longgar.
- **Toleransi typo hanya untuk jawaban ≥4 karakter.** Pada kata pendek, satu huruf beda
  biasanya **kata lain** (`am` vs `is`), bukan salah ketik.
- **Kunci jawaban tidak pernah dikirim ke browser.** Untuk soal pilihan ganda,
  `answer_index` dibuang dari payload sebelum render dan baru dikembalikan server setelah
  dijawab. Latihan yang jawabannya bisa dilihat bukan latihan.
- **Batas 30 item baru per hari.** Tanpa batas, generate beberapa pelajaran sekaligus lalu
  besoknya menumpuk ratusan — cara tercepat berhenti belajar.
- **Hari baru mulai jam 04:00 WIB**, bukan tengah malam. Belajar jam 1 pagi masih bagian dari
  "hari ini", tidak memutus streak.
- **Setiap item yang ditolak dilaporkan beserta alasannya.** Pernah ada validator yang
  menolak 100% soal karena salah asumsi format — dan itu hanya kelihatan karena
  penolakannya tidak dibuang diam-diam.

---

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Neon (Postgres) · Drizzle ORM ·
Auth.js v5 · Google Gemini API · [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) ·
Zod · Recharts

Semuanya di _free tier_. Tidak ada file audio, tidak ada layanan TTS berbayar — pelafalan
dan dikte memakai Web Speech API bawaan browser.

---

## Menjalankan sendiri

Butuh Node 20+, akun [Neon](https://neon.tech) (gratis), dan API key
[Google AI Studio](https://aistudio.google.com/apikey) (gratis).

```bash
npm install
cp .env.example .env.local        # isi DATABASE_URL, GEMINI_API_KEY, AUTH_SECRET
npm run db:push                   # bikin tabel
npm run db:seed-user              # bikin akun (isi SEED_USERNAME & SEED_PASSWORD dulu)
npm run db:seed-languages         # aktifkan bahasa
npm run dev
```

`AUTH_SECRET` digenerate dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Setelah `db:seed-user` berhasil, **hapus `SEED_PASSWORD` dari `.env.local`** — hash-nya sudah
tersimpan di database.

### Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` / `lint` | `tsc --noEmit` / ESLint |
| `npm run db:push` | Terapkan schema ke Neon |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:seed-user` | Bikin / ganti password akun |
| `npm run db:seed-languages` | Seed & update tabel `languages` |

---

## Peta kode

```
lib/
  db/schema.ts              Semua tabel + index
  db/seed-languages.ts      >> NAMBAH BAHASA DI SINI <<
  languages/curriculum.ts   >> URUTAN PELAJARAN GRAMMAR (60) <<
  languages/vocabulary.ts   >> AWL 570 kata: kurikulum kosakata <<
  items/registry.ts         >> NAMBAH JENIS LATIHAN DI SINI <<
  study/next.ts             "Sekarang ngapain?" — satu-satunya yang menjawab
  study/queue.ts            Antrean latihan + batas item baru/hari
  srs/                      Wrapper ts-fsrs, pemetaan nilai, batas hari WIB
  ai/provider.ts            Satu-satunya pintu ke AI
  ai/exam.ts                Generator soal TOEFL + validasinya
  exam/blueprint.ts         Struktur tes: jumlah soal & waktu per seksi
  exam/to-items.ts          Soal salah → item latihan SRS
  stats/queries.ts          Agregasi statistik
```

Rencana lengkap dan catatan keputusan desain ada di **[ROADMAP.md](./ROADMAP.md)**.

---

## Di HP

Bisa **dipasang ke layar utama** (`app/manifest.ts`, `display: standalone`). Ini bukan soal
keren: SRS hanya bekerja kalau dibuka tiap hari, dan app yang harus dicari lewat mengetik URL
jauh lebih mudah terlupa daripada ikon di layar utama.

Baris yang punya lebar tetap ditumpuk di layar sempit — peta soal simulasi jadi 6 kolom
(bukan 10, yang membuat tombol cuma ~23px), dan baris statistik jadi dua baris. Zoom sengaja
tidak diblokir.

---

## Batasan yang jujur

- **Skor simulasi adalah perkiraan.** Skalanya dikalibrasi ke rentang resmi TOEFL ITP
  (310–677), tapi titik di antaranya interpolasi — bukan tabel konversi ETS. Untuk melihat
  kemajuan, bukan untuk mengklaim skor.
- **AI bisa salah, dan penjelasan grammar yang salah tidak mudah terdeteksi** waktu masih
  pemula. Materi dibuat pendek dan berbasis pola untuk mengurangi risikonya, dan ada penanda
  "belum diverifikasi" di tiap materi. **Antarmuka untuk mengoreksi item belum ada** — itu
  pekerjaan berikutnya yang paling penting.
- **Kurikulum tetap sudah ada untuk kelima bahasa** — Inggris (A1–C2), Jepang (N5–N1),
  Korea (1급–6급), Mandarin (HSK 1–6), dan Spanyol (A1–C2). Jalur silabus buatan AI masih
  ada sebagai jaring untuk bahasa berikutnya, tapi tidak dipakai bahasa mana pun yang aktif.
- **Dikte dan berbicara tergantung browser.** Web Speech API tidak lengkap di Firefox dan
  Safari iOS; ada jalan mengetik sebagai gantinya.
- **Satu pemakai.** Tabelnya sudah punya `user_id` di mana-mana, tapi belum ada pendaftaran.

---

## Lisensi

Belum ditentukan. Tanpa berkas lisensi, hak ciptanya default: semua hak dipegang penulis.
