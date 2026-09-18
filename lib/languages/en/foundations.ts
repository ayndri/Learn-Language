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
 * Percakapan situasional DULU juga di sini, dan sekarang pindah ke
 * `en/conversation.ts` — supaya bentuknya sama dengan empat bahasa lain (satu
 * berkas per jenis bahan) dan supaya berkas bernama "pondasi" tidak lagi memuat
 * tiga jenis bahan yang tidak sejenis sekaligus.
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
