import type { VocabTheme } from '@/lib/languages/vocab-theme'

/**
 * KOSAKATA INTI BAHASA INGGRIS — A1 → C2, per tema.
 *
 * Ini menutup lubang yang paling besar di kurikulum Inggris: sebelum ada file
 * ini, satu-satunya kurikulum kosakata adalah **Academic Word List**, dan AWL
 * dimulai dari kata seperti `analyse` dan `constitute`. Untuk pelajar A1 itu
 * bukan cuma terlalu sulit — AWL memang SENGAJA tidak memuat 2.000 kata paling
 * umum, karena diasumsikan sudah dikuasai. Asumsi itu tidak berlaku untuk orang
 * yang baru mulai.
 *
 * Jadi urutannya sekarang: kosakata inti dulu (file ini, A1→C2), AWL menyusul
 * sebagai lapisan akademik di atasnya (`lib/languages/vocabulary.ts`). Keduanya
 * masuk ke tab Kosakata yang sama, berurutan menurut level.
 *
 * Pemilihan katanya mengikuti prinsip frekuensi, bukan tema yang enak ditulis:
 * yang masuk adalah kata yang benar-benar sering dipakai di tingkat itu. Kata
 * yang jarang tapi terasa "keren" (mis. `astonishing` di A2) sengaja tidak ada —
 * pemula yang menghafalnya tetap tidak bisa memesan makanan.
 */

// ---------------------------------------------------------------------------
// A1 — 20 tema. Kata yang dipakai di hari pertama.
// ---------------------------------------------------------------------------

const A1: VocabTheme[] = [
  {
    level: 'A1',
    title: 'Sapaan dan Sopan Santun',
    context: 'menyapa dan berpamitan',
    words: ['hello', 'goodbye', 'please', 'thank you', 'sorry', 'excuse me', 'yes', 'no', 'welcome', 'good morning', 'good night', 'see you'],
  },
  {
    level: 'A1',
    title: 'Angka dan Jumlah',
    context: 'menyebut jumlah dan urutan',
    words: ['one', 'ten', 'hundred', 'thousand', 'first', 'second', 'number', 'many', 'few', 'half', 'all', 'none'],
  },
  {
    level: 'A1',
    title: 'Hari dan Bulan',
    context: 'membaca kalender dan membuat janji',
    words: ['Monday', 'Friday', 'Sunday', 'day', 'week', 'month', 'year', 'today', 'tomorrow', 'yesterday', 'weekend', 'January'],
  },
  {
    level: 'A1',
    title: 'Waktu',
    context: 'menyebut jam dan bagian hari',
    words: ['time', 'hour', 'minute', 'morning', 'afternoon', 'evening', 'night', 'early', 'late', 'now', 'soon', "o'clock"],
  },
  {
    level: 'A1',
    title: 'Keluarga',
    context: 'memperkenalkan anggota keluarga',
    words: ['family', 'mother', 'father', 'parents', 'brother', 'sister', 'son', 'daughter', 'husband', 'wife', 'child', 'grandmother'],
  },
  {
    level: 'A1',
    title: 'Orang dan Penampilan',
    context: 'menggambarkan orang',
    words: ['man', 'woman', 'boy', 'girl', 'friend', 'people', 'tall', 'short', 'young', 'old', 'beautiful', 'handsome'],
  },
  {
    level: 'A1',
    title: 'Bagian Tubuh',
    context: 'menunjuk bagian tubuh dan keluhan sederhana',
    words: ['head', 'face', 'eye', 'ear', 'nose', 'mouth', 'hand', 'arm', 'leg', 'foot', 'hair', 'tooth'],
  },
  {
    level: 'A1',
    title: 'Pakaian',
    context: 'berbelanja pakaian',
    words: ['clothes', 'shirt', 'trousers', 'dress', 'skirt', 'shoes', 'jacket', 'hat', 'bag', 'wear', 'size', 'socks'],
  },
  {
    level: 'A1',
    title: 'Warna dan Bentuk',
    context: 'menggambarkan barang',
    words: ['colour', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'round', 'square', 'big', 'small'],
  },
  {
    level: 'A1',
    title: 'Rumah dan Ruangan',
    context: 'menjelaskan tempat tinggal',
    words: ['house', 'flat', 'room', 'kitchen', 'bedroom', 'bathroom', 'living room', 'garden', 'door', 'window', 'floor', 'wall'],
  },
  {
    level: 'A1',
    title: 'Perabot dan Barang',
    context: 'menyebut isi rumah',
    words: ['table', 'chair', 'bed', 'sofa', 'lamp', 'mirror', 'clock', 'key', 'phone', 'television', 'computer', 'box'],
  },
  {
    level: 'A1',
    title: 'Makanan',
    context: 'makan sehari-hari',
    words: ['food', 'bread', 'rice', 'meat', 'chicken', 'fish', 'egg', 'cheese', 'soup', 'breakfast', 'lunch', 'dinner'],
  },
  {
    level: 'A1',
    title: 'Minuman dan Buah',
    context: 'berbelanja bahan makanan',
    words: ['water', 'milk', 'coffee', 'tea', 'juice', 'sugar', 'apple', 'banana', 'orange', 'tomato', 'potato', 'vegetable'],
  },
  {
    level: 'A1',
    title: 'Pekerjaan',
    context: 'menyebut profesi orang',
    words: ['job', 'work', 'teacher', 'student', 'doctor', 'nurse', 'driver', 'engineer', 'farmer', 'police officer', 'shop assistant', 'manager'],
  },
  {
    level: 'A1',
    title: 'Tempat di Kota',
    context: 'menyebut lokasi dan tujuan',
    words: ['city', 'street', 'shop', 'market', 'school', 'hospital', 'bank', 'park', 'restaurant', 'hotel', 'station', 'airport'],
  },
  {
    level: 'A1',
    title: 'Transportasi',
    context: 'bepergian',
    words: ['car', 'bus', 'train', 'bike', 'plane', 'taxi', 'ticket', 'road', 'travel', 'drive', 'walk', 'ride'],
  },
  {
    level: 'A1',
    title: 'Sekolah',
    context: 'kegiatan belajar',
    words: ['class', 'lesson', 'book', 'pen', 'pencil', 'paper', 'exam', 'homework', 'question', 'answer', 'teach', 'learn'],
  },
  {
    level: 'A1',
    title: 'Cuaca dan Musim',
    context: 'membicarakan cuaca',
    words: ['weather', 'sun', 'rain', 'wind', 'snow', 'cloud', 'hot', 'cold', 'warm', 'summer', 'winter', 'spring'],
  },
  {
    level: 'A1',
    title: 'Kata Kerja Harian',
    context: 'menceritakan rutinitas',
    words: ['be', 'have', 'do', 'go', 'come', 'eat', 'drink', 'sleep', 'wake up', 'live', 'like', 'want'],
  },
  {
    level: 'A1',
    title: 'Kata Kerja Dasar Lain',
    context: 'kegiatan sehari-hari',
    words: ['make', 'take', 'give', 'get', 'see', 'look', 'listen', 'speak', 'read', 'write', 'buy', 'open'],
  },
]

// ---------------------------------------------------------------------------
// A2 — 16 tema. Kata untuk bercerita, bukan cuma menyebut.
// ---------------------------------------------------------------------------

const A2: VocabTheme[] = [
  {
    level: 'A2',
    title: 'Belanja dan Uang',
    context: 'transaksi di toko',
    words: ['price', 'cheap', 'expensive', 'pay', 'cash', 'change', 'receipt', 'discount', 'customer', 'sell', 'cost', 'spend'],
  },
  {
    level: 'A2',
    title: 'Di Restoran',
    context: 'memesan makanan',
    words: ['menu', 'order', 'waiter', 'bill', 'dessert', 'starter', 'delicious', 'taste', 'book a table', 'tip', 'serve', 'fresh'],
  },
  {
    level: 'A2',
    title: 'Perjalanan dan Liburan',
    context: 'merencanakan liburan',
    words: ['holiday', 'trip', 'luggage', 'passport', 'booking', 'flight', 'guide', 'tour', 'beach', 'museum', 'abroad', 'stay'],
  },
  {
    level: 'A2',
    title: 'Kesehatan',
    context: 'ke dokter',
    words: ['health', 'ill', 'pain', 'fever', 'cough', 'medicine', 'appointment', 'dentist', 'injury', 'rest', 'hurt', 'recover'],
  },
  {
    level: 'A2',
    title: 'Hobi dan Waktu Luang',
    context: 'membicarakan kesukaan',
    words: ['hobby', 'music', 'film', 'game', 'photo', 'dance', 'sing', 'draw', 'collect', 'enjoy', 'boring', 'interesting'],
  },
  {
    level: 'A2',
    title: 'Olahraga',
    context: 'kegiatan fisik',
    words: ['sport', 'football', 'swim', 'run', 'team', 'match', 'player', 'win', 'lose', 'score', 'practise', 'exercise'],
  },
  {
    level: 'A2',
    title: 'Teknologi Sehari-hari',
    context: 'memakai gawai',
    words: ['internet', 'website', 'app', 'screen', 'password', 'download', 'upload', 'click', 'search', 'battery', 'charge', 'device'],
  },
  {
    level: 'A2',
    title: 'Komunikasi',
    context: 'berhubungan dengan orang',
    words: ['message', 'email', 'call', 'reply', 'contact', 'invite', 'meet', 'tell', 'ask', 'explain', 'agree', 'promise'],
  },
  {
    level: 'A2',
    title: 'Arah dan Letak',
    context: 'menjelaskan lokasi',
    words: ['left', 'right', 'straight', 'corner', 'opposite', 'between', 'near', 'far', 'behind', 'in front of', 'turn', 'cross'],
  },
  {
    level: 'A2',
    title: 'Sifat Orang',
    context: 'menggambarkan kepribadian',
    words: ['kind', 'friendly', 'polite', 'rude', 'shy', 'lazy', 'hard-working', 'honest', 'clever', 'funny', 'patient', 'confident'],
  },
  {
    level: 'A2',
    title: 'Perasaan',
    context: 'menyampaikan suasana hati',
    words: ['happy', 'sad', 'angry', 'tired', 'worried', 'excited', 'afraid', 'surprised', 'bored', 'proud', 'nervous', 'relaxed'],
  },
  {
    level: 'A2',
    title: 'Pekerjaan Rumah',
    context: 'kegiatan di rumah',
    words: ['clean', 'wash', 'cook', 'tidy', 'iron', 'repair', 'rubbish', 'laundry', 'shopping list', 'chores', 'share', 'help'],
  },
  {
    level: 'A2',
    title: 'Alam',
    context: 'menggambarkan pemandangan',
    words: ['nature', 'tree', 'flower', 'grass', 'mountain', 'river', 'sea', 'forest', 'island', 'sky', 'star', 'animal'],
  },
  {
    level: 'A2',
    title: 'Kota dan Desa',
    context: 'membandingkan tempat tinggal',
    words: ['town', 'village', 'building', 'traffic', 'noisy', 'quiet', 'crowded', 'safe', 'modern', 'historic', 'neighbour', 'area'],
  },
  {
    level: 'A2',
    title: 'Kantor dan Kerja',
    context: 'dunia kerja dasar',
    words: ['office', 'meeting', 'colleague', 'boss', 'salary', 'contract', 'break', 'deadline', 'task', 'report', 'busy', 'career'],
  },
  {
    level: 'A2',
    title: 'Phrasal Verb Dasar',
    context: 'percakapan yang terdengar wajar',
    words: ['get up', 'turn on', 'turn off', 'put on', 'take off', 'look for', 'find out', 'give up', 'come back', 'go out', 'pick up', 'try on'],
  },
]

// ---------------------------------------------------------------------------
// B1 — 14 tema. Kata untuk berpendapat dan membaca artikel ringan.
// ---------------------------------------------------------------------------

const B1: VocabTheme[] = [
  {
    level: 'B1',
    title: 'Pendidikan',
    context: 'membicarakan sekolah dan kuliah',
    words: ['degree', 'university', 'subject', 'course', 'lecture', 'assignment', 'grade', 'scholarship', 'graduate', 'qualification', 'research', 'tutor'],
  },
  {
    level: 'B1',
    title: 'Lingkungan',
    context: 'isu lingkungan sehari-hari',
    words: ['pollution', 'recycle', 'waste', 'climate', 'energy', 'plastic', 'protect', 'damage', 'reduce', 'renewable', 'species', 'habitat'],
  },
  {
    level: 'B1',
    title: 'Media dan Berita',
    context: 'membaca dan menonton berita',
    words: ['news', 'article', 'headline', 'journalist', 'broadcast', 'advertisement', 'source', 'report', 'interview', 'audience', 'coverage', 'rumour'],
  },
  {
    level: 'B1',
    title: 'Budaya dan Seni',
    context: 'membicarakan film, buku, musik',
    words: ['culture', 'tradition', 'novel', 'author', 'painting', 'performance', 'director', 'review', 'plot', 'character', 'exhibition', 'creative'],
  },
  {
    level: 'B1',
    title: 'Hubungan Antarorang',
    context: 'membicarakan pertemanan dan keluarga',
    words: ['relationship', 'trust', 'argue', 'apologise', 'support', 'advice', 'quarrel', 'reconcile', 'loyal', 'jealous', 'company', 'get on with'],
  },
  {
    level: 'B1',
    title: 'Perasaan yang Lebih Halus',
    context: 'menyampaikan perasaan dengan tepat',
    words: ['disappointed', 'grateful', 'guilty', 'embarrassed', 'frustrated', 'relieved', 'anxious', 'satisfied', 'curious', 'annoyed', 'delighted', 'overwhelmed'],
  },
  {
    level: 'B1',
    title: 'Hukum dan Aturan',
    context: 'berita kriminal dan peraturan',
    words: ['law', 'crime', 'punish', 'fine', 'illegal', 'permit', 'witness', 'court', 'evidence', 'guilty', 'arrest', 'rights'],
  },
  {
    level: 'B1',
    title: 'Gaya Hidup Sehat',
    context: 'kebiasaan sehat',
    words: ['diet', 'nutrition', 'fitness', 'habit', 'stress', 'sleep pattern', 'balance', 'avoid', 'improve', 'lifestyle', 'mental health', 'treatment'],
  },
  {
    level: 'B1',
    title: 'Keuangan Pribadi',
    context: 'mengatur uang',
    words: ['budget', 'save', 'loan', 'debt', 'interest', 'account', 'transfer', 'afford', 'invest', 'income', 'expense', 'insurance'],
  },
  {
    level: 'B1',
    title: 'Melamar Kerja',
    context: 'mencari pekerjaan',
    words: ['apply', 'application', 'CV', 'vacancy', 'experience', 'skill', 'candidate', 'recruit', 'promotion', 'resign', 'training', 'reference'],
  },
  {
    level: 'B1',
    title: 'Masalah dalam Perjalanan',
    context: 'saat rencana tidak berjalan',
    words: ['delay', 'cancel', 'refund', 'complain', 'lost', 'insurance claim', 'reschedule', 'queue', 'overbooked', 'connection', 'departure', 'arrival'],
  },
  {
    level: 'B1',
    title: 'Menyampaikan Pendapat',
    context: 'diskusi dan debat ringan',
    words: ['opinion', 'agree', 'disagree', 'point of view', 'argument', 'reason', 'suggest', 'admit', 'doubt', 'convince', 'prefer', 'compromise'],
  },
  {
    level: 'B1',
    title: 'Menggambarkan Perubahan',
    context: 'menjelaskan tren dan grafik',
    words: ['increase', 'decrease', 'rise', 'fall', 'trend', 'gradually', 'sharply', 'remain', 'reach', 'compare', 'growth', 'decline'],
  },
  {
    level: 'B1',
    title: 'Kolokasi yang Sering Dipakai',
    context: 'membuat kalimat terdengar alami',
    words: ['make a decision', 'take a risk', 'pay attention', 'keep in touch', 'do research', 'have an effect', 'take part', 'make progress', 'break a promise', 'catch a cold', 'save time', 'waste money'],
  },
]

// ---------------------------------------------------------------------------
// B2 — 10 tema. Kata surat kabar dan tulisan serius.
// ---------------------------------------------------------------------------

const B2: VocabTheme[] = [
  {
    level: 'B2',
    title: 'Bisnis',
    context: 'dunia usaha',
    words: ['profit', 'revenue', 'investment', 'stakeholder', 'merger', 'supply', 'demand', 'competitor', 'launch', 'negotiate', 'strategy', 'client'],
  },
  {
    level: 'B2',
    title: 'Politik dan Masyarakat',
    context: 'membaca berita politik',
    words: ['government', 'policy', 'election', 'democracy', 'citizen', 'reform', 'campaign', 'authority', 'welfare', 'inequality', 'protest', 'legislation'],
  },
  {
    level: 'B2',
    title: 'Sains dan Penelitian',
    context: 'membaca artikel ilmiah populer',
    words: ['hypothesis', 'evidence', 'experiment', 'variable', 'sample', 'findings', 'peer review', 'replicate', 'correlation', 'measurement', 'observation', 'conclusion'],
  },
  {
    level: 'B2',
    title: 'Psikologi dan Perilaku',
    context: 'membicarakan pikiran dan kebiasaan',
    words: ['behaviour', 'motivation', 'perception', 'bias', 'awareness', 'attitude', 'cognitive', 'emotion', 'reinforce', 'trigger', 'coping', 'resilience'],
  },
  {
    level: 'B2',
    title: 'Ekonomi',
    context: 'memahami berita ekonomi',
    words: ['inflation', 'recession', 'unemployment', 'productivity', 'currency', 'trade', 'tariff', 'subsidy', 'consumer', 'sustainable growth', 'fiscal', 'monetary'],
  },
  {
    level: 'B2',
    title: 'Isu Global',
    context: 'diskusi isu dunia',
    words: ['poverty', 'migration', 'conflict', 'aid', 'human rights', 'globalisation', 'refugee', 'sanction', 'humanitarian', 'sustainability', 'inequality gap', 'diplomacy'],
  },
  {
    level: 'B2',
    title: 'Teknologi dan Data',
    context: 'membicarakan teknologi modern',
    words: ['algorithm', 'artificial intelligence', 'automation', 'privacy', 'encryption', 'database', 'interface', 'bandwidth', 'cybersecurity', 'innovation', 'prototype', 'scalable'],
  },
  {
    level: 'B2',
    title: 'Menulis Akademik',
    context: 'menulis esai dan laporan',
    words: ['argue', 'demonstrate', 'illustrate', 'emphasise', 'outline', 'summarise', 'evaluate', 'justify', 'imply', 'contrast', 'derive', 'assert'],
  },
  {
    level: 'B2',
    title: 'Idiom Umum',
    context: 'memahami percakapan penutur asli',
    words: ['break the ice', 'get the hang of', 'on the same page', 'cut corners', 'in the long run', 'a blessing in disguise', 'call it a day', 'under the weather', 'hit the books', 'take it for granted', 'out of the blue', 'the bottom line'],
  },
  {
    level: 'B2',
    title: 'Phrasal Verb Lanjutan',
    context: 'bahasa lisan yang natural',
    words: ['put up with', 'come up with', 'get away with', 'look forward to', 'run out of', 'carry out', 'point out', 'bring about', 'set up', 'take over', 'work out', 'turn down'],
  },
]

// ---------------------------------------------------------------------------
// C1 — 8 tema. Nuansa, register, dan bahasa tulis yang presisi.
// ---------------------------------------------------------------------------

const C1: VocabTheme[] = [
  {
    level: 'C1',
    title: 'Nuansa Makna',
    context: 'memilih kata yang tepat, bukan yang mirip',
    words: ['imply', 'infer', 'allege', 'claim', 'assume', 'presume', 'estimate', 'speculate', 'acknowledge', 'concede', 'refute', 'dispute'],
  },
  {
    level: 'C1',
    title: 'Menyatakan Derajat',
    context: 'menakar kepastian dalam tulisan',
    words: ['arguably', 'presumably', 'ostensibly', 'markedly', 'marginally', 'substantially', 'invariably', 'sporadically', 'predominantly', 'to some extent', 'by and large', 'on the whole'],
  },
  {
    level: 'C1',
    title: 'Penanda Wacana',
    context: 'merangkai paragraf yang runtut',
    words: ['nevertheless', 'nonetheless', 'conversely', 'consequently', 'furthermore', 'notwithstanding', 'in contrast', 'accordingly', 'hence', 'thereby', 'insofar as', 'whereas'],
  },
  {
    level: 'C1',
    title: 'Kata Kerja Formal',
    context: 'menulis laporan dan proposal',
    words: ['undertake', 'implement', 'facilitate', 'mitigate', 'allocate', 'consolidate', 'stipulate', 'constitute', 'entail', 'warrant', 'yield', 'underpin'],
  },
  {
    level: 'C1',
    title: 'Kata Sifat Presisi',
    context: 'deskripsi yang tidak kabur',
    words: ['viable', 'robust', 'coherent', 'ambiguous', 'redundant', 'inherent', 'pervasive', 'negligible', 'plausible', 'compelling', 'nuanced', 'contentious'],
  },
  {
    level: 'C1',
    title: 'Bahasa Kritik',
    context: 'menilai karya dan argumen',
    words: ['flawed', 'superficial', 'insightful', 'derivative', 'overrated', 'meticulous', 'convoluted', 'succinct', 'incisive', 'simplistic', 'rigorous', 'contrived'],
  },
  {
    level: 'C1',
    title: 'Ungkapan Berhati-hati',
    context: 'menulis akademik tanpa terdengar mutlak',
    words: ['it appears that', 'there is a tendency to', 'this suggests that', 'it could be argued', 'to a lesser extent', 'with the exception of', 'in principle', 'as far as', 'insofar as possible', 'broadly speaking', 'all things considered', 'if anything'],
  },
  {
    level: 'C1',
    title: 'Kolokasi Tingkat Lanjut',
    context: 'menulis seperti penutur terdidik',
    words: ['draw a distinction', 'pose a threat', 'raise concerns', 'meet a deadline', 'address an issue', 'gain insight', 'shed light on', 'play a pivotal role', 'bear in mind', 'take precedence', 'strike a balance', 'lay the groundwork'],
  },
]

// ---------------------------------------------------------------------------
// C2 — 6 tema. Idiomatik, sastrawi, dan register khusus.
// ---------------------------------------------------------------------------

const C2: VocabTheme[] = [
  {
    level: 'C2',
    title: 'Kata Bernuansa Kuat',
    context: 'tulisan yang tepat dan bertenaga',
    words: ['tantamount', 'quintessential', 'ubiquitous', 'idiosyncratic', 'inexorable', 'egregious', 'tenuous', 'salient', 'nebulous', 'auspicious', 'innocuous', 'paradoxical'],
  },
  {
    level: 'C2',
    title: 'Idiom Tingkat Tinggi',
    context: 'memahami kolom opini dan sastra',
    words: ['a double-edged sword', 'the elephant in the room', 'par for the course', 'a foregone conclusion', 'beyond the pale', 'to hedge one’s bets', 'a Pyrrhic victory', 'in the same vein', 'to move the goalposts', 'a red herring', 'to bite the bullet', 'the tip of the iceberg'],
  },
  {
    level: 'C2',
    title: 'Bahasa Retoris',
    context: 'pidato dan esai persuasif',
    words: ['juxtapose', 'underscore', 'epitomise', 'exemplify', 'galvanise', 'espouse', 'lambaste', 'extol', 'castigate', 'vindicate', 'reconcile', 'transcend'],
  },
  {
    level: 'C2',
    title: 'Register Formal vs Informal',
    context: 'memilih laras bahasa yang tepat',
    words: ['commence / start', 'purchase / buy', 'terminate / end', 'endeavour / try', 'ascertain / find out', 'require / need', 'reside / live', 'assist / help', 'sufficient / enough', 'obtain / get', 'inquire / ask', 'utilise / use'],
  },
  {
    level: 'C2',
    title: 'Kata Serapan Latin dan Yunani',
    context: 'membaca teks akademik dan hukum',
    words: ['per se', 'de facto', 'ad hoc', 'status quo', 'vis-à-vis', 'bona fide', 'caveat', 'criterion', 'phenomenon', 'analysis', 'hypothesis', 'paradigm'],
  },
  {
    level: 'C2',
    title: 'Bahasa Bernuansa Emosi',
    context: 'sastra dan tulisan pribadi',
    words: ['wistful', 'poignant', 'melancholy', 'exuberant', 'apprehensive', 'indignant', 'complacent', 'despondent', 'elated', 'resigned', 'ambivalent', 'nostalgic'],
  },
]

export const EN_VOCAB_THEMES: VocabTheme[] = [...A1, ...A2, ...B1, ...B2, ...C1, ...C2]
