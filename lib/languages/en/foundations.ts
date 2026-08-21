/**
 * PONDASI BAHASA INGGRIS — bunyi/ejaan, imbuhan, dan percakapan situasional.
 *
 * Tiga bagian yang selama ini tidak ada, dan ketiadaannya baru terasa kalau
 * kurikulumnya dipakai dari benar-benar nol:
 *
 * 1. BUNYI & EJAAN. Inggris memakai aksara Latin, jadi mudah dikira tidak
 *    butuh bagian "aksara". Padahal justru di sinilah masalah terbesar pelajar
 *    Indonesia: hubungan tulisan↔bunyi bahasa Inggris tidak beraturan
 *    (`though`, `through`, `thought`), dan bunyi seperti /θ/, /æ/, /ɪ/ vs /iː/
 *    tidak ada di bahasa Indonesia. Ini dilatih pakai jenis item `script` yang
 *    sama dengan kana — lambang bunyi → cara bacanya.
 *
 * 2. IMBUHAN. Satu akar kata bisa jadi enam kata (`decide → decision →
 *    decisive → decisively → indecisive → undecided`). Menghafalnya satu per
 *    satu sebagai kata terpisah itu enam kali lebih lambat daripada memahami
 *    pola imbuhannya — dan word formation adalah bagian yang benar-benar diuji
 *    di TOEFL Structure.
 *
 * 3. PERCAKAPAN. Kurikulum grammar mengajarkan pola; ia tidak pernah
 *    mengajarkan bahwa jawaban wajar untuk "How are you?" bukan penjelasan
 *    panjang tentang kesehatanmu.
 */

export type FoundationLesson = {
  level: string
  title: string
  focus: string
  context: string
  /** daftar yang wajib tercakup — untuk pelajaran bunyi, ini lambang IPA-nya */
  words?: string[]
}

// ---------------------------------------------------------------------------
// Bunyi & ejaan — bagian "Aksara" untuk bahasa Inggris
// ---------------------------------------------------------------------------

export const EN_SOUNDS: FoundationLesson[] = [
  {
    level: 'A1',
    title: 'Alfabet dan Nama Huruf',
    focus: 'Menyebut dan mengeja: A–Z, beda bunyi huruf dan NAMA huruf, serta mengeja nama sendiri',
    context: 'mengeja nama dan alamat lewat telepon',
    words: ['a /eɪ/', 'e /iː/', 'g /dʒiː/', 'h /eɪtʃ/', 'i /aɪ/', 'j /dʒeɪ/', 'q /kjuː/', 'r /ɑː/', 'v /viː/', 'w /ˈdʌbəljuː/', 'y /waɪ/', 'z /zed/'],
  },
  {
    level: 'A1',
    title: 'Vokal Pendek',
    focus: 'Lima vokal pendek dan pasangan kata yang membedakannya',
    context: 'membedakan kata yang bunyinya mirip',
    words: ['/ɪ/ sit', '/e/ bed', '/æ/ cat', '/ʌ/ cup', '/ɒ/ hot', '/ʊ/ book', '/ə/ about', '/i/ happy'],
  },
  {
    level: 'A1',
    title: 'Vokal Panjang',
    focus: 'Vokal panjang dan bedanya dengan yang pendek — sheep vs ship, fool vs full',
    context: 'diucapkan pendek, artinya berubah',
    words: ['/iː/ sheep', '/ɑː/ car', '/ɔː/ door', '/uː/ food', '/ɜː/ bird'],
  },
  {
    level: 'A2',
    title: 'Diftong',
    focus: 'Vokal rangkap: dua bunyi yang meluncur jadi satu suku kata',
    context: 'mengucapkan kata sehari-hari dengan benar',
    words: ['/eɪ/ day', '/aɪ/ my', '/ɔɪ/ boy', '/əʊ/ go', '/aʊ/ now', '/ɪə/ here', '/eə/ hair', '/ʊə/ tour'],
  },
  {
    level: 'A1',
    title: 'Konsonan yang Tidak Ada di Bahasa Indonesia',
    focus: 'θ, ð, v, z, ʃ, ʒ, tʃ, dʒ — bunyi yang paling sering tertukar oleh penutur Indonesia',
    context: 'think bukan "tink", very bukan "feri"',
    words: ['/θ/ think', '/ð/ this', '/v/ very', '/z/ zoo', '/ʃ/ she', '/ʒ/ vision', '/tʃ/ chair', '/dʒ/ job'],
  },
  {
    level: 'A2',
    title: 'Akhiran -s dan -es',
    focus: 'Tiga cara membacanya: /s/ setelah bunyi tak bersuara, /z/ setelah bersuara, /ɪz/ setelah sibilan',
    context: 'jamak dan kata kerja orang ketiga',
    words: ['/s/ books', '/z/ dogs', '/ɪz/ boxes', '/s/ cats', '/z/ plays', '/ɪz/ watches'],
  },
  {
    level: 'A2',
    title: 'Akhiran -ed',
    focus: 'Tiga cara membacanya: /t/, /d/, dan /ɪd/ — hanya setelah t/d dibaca /ɪd/',
    context: 'kata kerja bentuk lampau beraturan',
    words: ['/t/ worked', '/d/ played', '/ɪd/ wanted', '/t/ stopped', '/d/ lived', '/ɪd/ needed'],
  },
  {
    level: 'A2',
    title: 'Huruf yang Tidak Dibaca',
    focus: 'Silent letters: k(now), w(rite), b(comb), l(walk), h(hour), t(listen), g(sign), p(psychology)',
    context: 'kata yang ejaannya menipu',
    words: ['know /nəʊ/', 'write /raɪt/', 'comb /kəʊm/', 'walk /wɔːk/', 'hour /aʊə/', 'listen /ˈlɪsən/', 'sign /saɪn/', 'island /ˈaɪlənd/'],
  },
  {
    level: 'B1',
    title: 'Tekanan Kata',
    focus: 'Suku kata bertekanan menentukan kata terdengar benar atau tidak; pasangan noun/verb (ˈrecord vs reˈcord)',
    context: 'salah tekanan membuat kata tidak dikenali',
    words: ['ˈphotograph', 'phoˈtography', 'photoˈgraphic', 'ˈrecord (n)', 'reˈcord (v)', 'ˈpresent (n)', 'preˈsent (v)', 'ˈcontract (n)'],
  },
  {
    level: 'B1',
    title: 'Bunyi Schwa',
    focus: '/ə/ — vokal paling sering di bahasa Inggris, muncul di suku kata TANPA tekanan',
    context: 'kunci supaya kalimat tidak terdengar dieja satu-satu',
    words: ['banana /bəˈnɑːnə/', 'about /əˈbaʊt/', 'teacher /ˈtiːtʃə/', 'computer /kəmˈpjuːtə/', 'again /əˈɡen/', 'problem /ˈprɒbləm/'],
  },
  {
    level: 'B1',
    title: 'Tekanan Kalimat dan Bentuk Lemah',
    focus: 'Kata isi ditekan, kata fungsi dilemahkan: can /kən/, and /ən/, to /tə/, of /əv/, was /wəz/',
    context: 'memahami penutur asli yang bicara cepat',
    words: ['can /kən/', 'and /ən/', 'to /tə/', 'of /əv/', 'was /wəz/', 'for /fə/', 'them /ðəm/', 'have /həv/'],
  },
  {
    level: 'B2',
    title: 'Penyambungan Bunyi',
    focus: 'Connected speech: linking konsonan→vokal (an apple), elision (nex(t) day), asimilasi (han(d)bag)',
    context: 'kenapa listening terasa terlalu cepat',
    words: ['an apple /ənˈæpəl/', 'next day /neksˈdeɪ/', 'want to /ˈwɒnə/', 'going to /ˈɡənə/', 'did you /ˈdɪdʒu/', 'got you /ˈɡɒtʃu/'],
  },
]

// ---------------------------------------------------------------------------
// Imbuhan & pembentukan kata
// ---------------------------------------------------------------------------

export const EN_AFFIXES: FoundationLesson[] = [
  {
    level: 'A1',
    title: 'Jamak dan Bentuk Tak Beraturan',
    focus: 'Akhiran -s/-es/-ies dan bentuk tak beraturan (child→children, foot→feet, man→men, mouse→mice)',
    context: 'menyebut lebih dari satu benda',
  },
  {
    level: 'A2',
    title: 'Akhiran -ing dan -ed',
    focus: 'Aturan ejaan: hop→hopping, hope→hoping, study→studied, play→played — kapan huruf digandakan',
    context: 'membentuk kata kerja berimbuhan tanpa salah eja',
  },
  {
    level: 'A2',
    title: 'Awalan Negatif',
    focus: 'un-, in-, im-, il-, ir-, dis-, non- dan pola pemilihannya (im- sebelum p/b/m, il- sebelum l, ir- sebelum r)',
    context: 'membalik makna kata tanpa menghafal kata baru',
  },
  {
    level: 'B1',
    title: 'Kata Benda dari Kata Kerja',
    focus: '-tion/-sion, -ment, -ance/-ence, -al, -ure: decide→decision, develop→development, appear→appearance',
    context: 'menulis kalimat yang lebih padat',
  },
  {
    level: 'B1',
    title: 'Kata Benda dari Kata Sifat',
    focus: '-ness, -ity, -th, -dom: happy→happiness, able→ability, warm→warmth, free→freedom',
    context: 'membicarakan sifat sebagai konsep',
  },
  {
    level: 'B1',
    title: 'Kata Sifat dari Kata Benda',
    focus: '-ful, -less, -ous, -ive, -al, -ic, -y: care→careful/careless, danger→dangerous, nature→natural',
    context: 'menggambarkan benda dan keadaan',
  },
  {
    level: 'B1',
    title: 'Awalan Arah dan Ukuran',
    focus: 're-, over-, under-, mis-, pre-, post-, co-, sub-: rewrite, overwork, underestimate, misunderstand',
    context: 'menebak arti kata baru dari bagiannya',
  },
  {
    level: 'B2',
    title: 'Kata Kerja Berimbuhan',
    focus: '-ise/-ize, -ify, -en, en-: modern→modernise, simple→simplify, wide→widen, able→enable',
    context: 'mengubah kata benda dan sifat jadi tindakan',
  },
  {
    level: 'B2',
    title: 'Kata Keterangan dan Pengecualiannya',
    focus: '-ly dan yang tidak beraturan: good→well, fast, hard (hardly = hampir tidak), late (lately = akhir-akhir ini)',
    context: 'menerangkan cara melakukan sesuatu',
  },
  {
    level: 'B2',
    title: 'Satu Akar, Banyak Kata',
    focus: 'Word family utuh: analyse/analysis/analyst/analytical/analytically — beserta kelas kata masing-masing',
    context: 'soal word form di tes dan tulisan akademik',
  },
  {
    level: 'C1',
    title: 'Awalan Latin dan Yunani',
    focus: 'inter-, trans-, anti-, auto-, bio-, tele-, micro-, multi-, mono-, poly-, hyper-, hypo-',
    context: 'membaca istilah ilmiah tanpa kamus',
  },
  {
    level: 'C1',
    title: 'Akhiran Pembentuk Istilah',
    focus: '-ism, -ist, -logy, -ocracy, -phobia, -graphy, -ability: capitalism, biologist, democracy, sustainability',
    context: 'memahami istilah akademik dan berita',
  },
]

// ---------------------------------------------------------------------------
// Percakapan situasional
// ---------------------------------------------------------------------------

export const EN_CONVERSATION: FoundationLesson[] = [
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
    title: 'Wawancara Kerja',
    focus:
      'Tell me about yourself · My greatest strength is … · I have five years’ experience in … · ' +
      'Why do you want to work here? · Do you have any questions for us?',
    context: 'wawancara kerja atau beasiswa',
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
]
