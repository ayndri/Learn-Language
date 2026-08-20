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
[`lib/languages/curriculum.ts`](./lib/languages/curriculum.ts): **60 pelajaran**, urut,
bisa dibaca dan dihitung sendiri.

| Level | Pelajaran | Cakupan |
|---|---|---|
| A1 | 16 | to be · articles · demonstratives · plural · possessive · there is/are · present simple · adverb frekuensi · **in/on/at tempat & waktu** · can · imperative · question words · countable |
| A2 | 16 | present continuous · was/were · past simple (regular, irregular, did) · past continuous · going to · will · comparative · superlative · adverb · object pronoun · preposisi gerakan · must/should · gerund vs infinitive |
| B1 | 16 | present perfect (+ for/since) · past perfect · used to · conditional 1/2/3 · passive · reported speech · relative clause · modals of deduction · question tag · phrasal verb · linking words |
| B2 | 10 | verb pattern lanjutan · wish · causative · article lanjutan · quantifier · participle clause · dependent preposition · subject–verb agreement · **parallel structure** · word formation |
| C1 | 2 | inversion & cleft · subjunctive formal |

AI tetap dipakai — tapi untuk mengisi **materi dan latihan** tiap pelajaran, bukan untuk
memutuskan apa yang perlu dipelajari. Konsekuensi lain: silabus Inggris terbentuk
**tanpa satu pun panggilan AI**, jadi onboarding-nya instan.

Bahasa yang belum punya kurikulum tetap (Jepang, Korea, Spanyol) otomatis jatuh ke silabus
buatan AI lewat `lib/study/syllabus.ts`. Menambah kurikulum untuk bahasa lain = menambah
satu entri di `CURRICULA`.

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
- [x] Seed tabel `languages` — Inggris aktif; Jepang/Korea/Spanyol siap tapi disabled
- [x] Onboarding `/start`: bahasa → kemampuan → tujuan → **AI menyusun silabus 12 pelajaran**
- [x] `/learn`: satu pintu masuk yang memutuskan latihan vs pelajaran baru
- [x] Penyiapan pelajaran **otomatis** saat dibuka (materi → item → tandai siap), progres kelihatan
- [x] Sesi latihan campuran: `vocab` (self-rate) + `cloze` (taip jawaban, auto-grade di server)
- [x] Integrasi FSRS + batas 20 item baru/hari
- [x] Dashboard: satu tombol + peta silabus + streak
- [x] Tampilan light mode, font Poppins, shortcut keyboard
- [ ] Deploy pertama ke Vercel

### 🟡 v1 (aplikasi utuh)
- [ ] **Edit & hapus item + edit materi** — AI kadang salah, harus bisa dikoreksi
- [ ] Jenis item `phrase` (perkenalan & ungkapan sehari-hari) dan `sentence`
- [ ] Tombol **pelafalan** (TTS) di item yang punya field `speakable`
- [ ] **Aktifkan bahasa kedua** (Korea *atau* Jepang) → uji beneran arsitekturnya language-agnostic
- [ ] **Statistik**: streak, grafik 30 hari, dan **grammar point terlemah** (dari `tags` + `review_logs`)
- [ ] Daftar unit + cari/filter item
- [ ] Dedup: kata/ungkapan yang sudah ada tidak digenerate ulang
- [ ] Responsive / PWA dasar — latihan dari HP itu use case utama

### 🔵 v2 (nilai plus)
- [ ] Jenis item `script` (hangul/kana) — barengan waktu Korea/Jepang serius dipakai
- [ ] **AI grading** untuk `sentence`: bukan benar/salah, tapi koreksi + alasannya
- [ ] Item `listening` (TTS → taip yang kamu dengar)
- [ ] Bahasa ke-3 & ke-4 (Spanyol, dst)
- [ ] Generate unit dari **teks yang di-paste** (artikel/lirik/subtitle)
- [ ] Export ke CSV / format Anki
- [ ] Optimasi parameter FSRS dari `review_logs` sendiri

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

## 9. Simulasi Ujian (TOEFL ITP)

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

Cetak biru ada sebagai data di [`lib/exam/blueprint.ts`](./lib/exam/blueprint.ts) —
jumlah soalnya bisa dihitung, bukan dipercaya.

| Seksi | Soal | Waktu | Isi |
|---|---|---|---|
| 1 · Listening | 50 | 35 mnt | Part A 30 percakapan pendek · Part B 2×4 percakapan panjang · Part C 3×4 ceramah |
| 2 · Structure & Written Expression | 40 | 25 mnt | Part A 15 melengkapi kalimat · Part B 25 menemukan kesalahan |
| 3 · Reading | 50 | 55 mnt | 5 bacaan × 10 soal |

Tersedia juga mode **latihan cepat** (38 soal, proporsi seksinya sama).

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
