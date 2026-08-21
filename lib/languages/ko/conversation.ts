/**
 * PERCAKAPAN KOREA — kalimat siap pakai per situasi.
 *
 * Untuk bahasa Korea bagian ini bukan pelengkap, tapi keharusan. Alasannya
 * satu: **tingkat tutur**. Kalimat yang sama bisa punya lima bentuk (했어 /
 * 했어요 / 했습니다 / 하셨어요 / 하셨습니다), dan memilih yang salah bukan
 * kesalahan tata bahasa — itu kesalahan sosial. Aturan 존댓말 bisa dijelaskan
 * dalam satu pelajaran grammar; MEMILIHNYA dengan benar hanya bisa dilatih
 * lewat situasi.
 *
 * Karena itu tiap pelajaran di sini menyebutkan bukan cuma ungkapannya, tapi
 * juga kepada siapa ungkapan itu wajar diucapkan.
 */

export type ConversationLesson = {
  level: string
  title: string
  focus: string
  context: string
}

export const KO_CONVERSATION: ConversationLesson[] = [
  // --------------------------------------------------------------- 1급
  {
    level: '1급',
    title: 'Menyapa',
    focus:
      '안녕하세요 · 안녕히 가세요 (yang pergi) vs 안녕히 계세요 (yang tinggal) — beda yang paling sering keliru · ' +
      '잘 자요 · 다녀오겠습니다 ↔ 다녀오세요',
    context: 'menyapa dan berpamitan setiap hari',
  },
  {
    level: '1급',
    title: 'Memperkenalkan Diri',
    focus:
      '안녕하세요, 저는 …입니다 · …에서 왔어요 · …에 살아요 · 만나서 반갑습니다 · 잘 부탁드립니다 — ' +
      'urutan bakunya dan kapan memakai 저 bukan 나',
    context: 'perkenalan pertama di kelas atau kantor',
  },
  {
    level: '1급',
    title: 'Menanyakan Umur dan Pekerjaan',
    focus:
      '나이가 어떻게 되세요? · 무슨 일 하세요? · 저는 …이에요/예요 · 몇 살이에요? — dan kenapa umur ditanyakan ' +
      'lebih dulu di Korea (menentukan bentuk bicara selanjutnya)',
    context: 'basa-basi wajib saat berkenalan',
  },
  {
    level: '1급',
    title: 'Terima Kasih dan Maaf',
    focus:
      '감사합니다 vs 고마워요 · 죄송합니다 vs 미안해요 (tingkat keformalan) · 괜찮아요 · 아니에요 · 실례합니다',
    context: 'menanggapi bantuan dan kesalahan',
  },
  {
    level: '1급',
    title: 'Di Restoran',
    focus:
      '여기요! / 저기요! (memanggil pelayan) · 뭐 드릴까요? · …주세요 · 이거 얼마예요? · 계산할게요 · ' +
      '맛있게 드세요 · 잘 먹겠습니다 ↔ 잘 먹었습니다',
    context: 'memesan makan dari awal sampai bayar',
  },
  {
    level: '1급',
    title: 'Berbelanja',
    focus:
      '이거 주세요 · 좀 깎아 주세요 · 다른 색 있어요? · 입어 봐도 돼요? · 카드 돼요? · 봉투 주세요',
    context: 'membeli barang di pasar dan toko',
  },
  {
    level: '1급',
    title: 'Menanyakan Arah',
    focus:
      '실례합니다, …이/가 어디예요? · 여기서 멀어요? · 쭉 가세요 · 오른쪽으로 도세요 · 얼마나 걸려요?',
    context: 'tersesat dan mencari tempat',
  },
  {
    level: '1급',
    title: 'Di Kelas',
    focus:
      '다시 한 번 말씀해 주세요 · 천천히 말해 주세요 · 잘 모르겠어요 · 질문 있어요 · ' +
      '한국말로 뭐예요? · 늦어서 죄송합니다',
    context: 'bertahan di kelas bahasa Korea',
  },

  // --------------------------------------------------------------- 2급
  {
    level: '2급',
    title: 'Bertelepon',
    focus:
      '여보세요 · …인데요 · …씨 계세요? · 잠시만요 · 지금 안 계시는데요 · 메모 남겨 드릴까요? · 나중에 다시 걸게요',
    context: 'menelepon kantor atau teman',
  },
  {
    level: '2급',
    title: 'Membuat Janji',
    focus:
      '시간 괜찮으세요? · 언제가 좋아요? · 그날은 좀 힘들 것 같아요 · 그럼 그때 봬요 · 약속 잡을까요?',
    context: 'mengatur waktu bertemu',
  },
  {
    level: '2급',
    title: 'Mengajak dan Menolak',
    focus:
      '같이 …(으)ㄹ래요? · 좋아요, 그래요 · 미안한데 오늘은 좀… (menolak tanpa mengatakan tidak) · ' +
      '다음에 꼭 같이 가요',
    context: 'mengajak teman tanpa membuat canggung',
  },
  {
    level: '2급',
    title: 'Di Klinik dan Apotek',
    focus:
      '어디가 아프세요? · 목이 아파요 · 열이 나요 · 언제부터 그러셨어요? · 약 좀 주세요 · 몸조리 잘하세요',
    context: 'menjelaskan keluhan',
  },
  {
    level: '2급',
    title: 'Naik Transportasi',
    focus:
      '이 버스 …에 가요? · 어디서 갈아타요? · 몇 번 출구예요? · 여기서 세워 주세요 · 카드 찍으세요',
    context: 'naik bus, subway, dan taksi di Korea',
  },
  {
    level: '2급',
    title: 'Meminta Tolong',
    focus:
      '부탁이 하나 있는데요 · …아/어 주실 수 있어요? · 죄송하지만 · 도와주셔서 감사합니다 — ' +
      'bertingkat dari teman ke atasan',
    context: 'minta bantuan orang lain',
  },
  {
    level: '2급',
    title: 'Memberi Selamat dan Simpati',
    focus:
      '축하합니다 · 잘됐네요 · 수고하셨습니다 (dan kenapa TIDAK boleh diucapkan ke atasan) · ' +
      '힘내세요 · 어떡해요 · 괜찮으세요?',
    context: 'menanggapi kabar baik dan buruk',
  },
  {
    level: '2급',
    title: 'Obrolan Santai',
    focus:
      '맞장구: 그래요? · 그렇구나 · 진짜요? · 그러게요 · 아, 그래서요? — dan bentuk 반말-nya ' +
      '(그래? 진짜? 그러게) untuk teman sebaya',
    context: 'menjaga percakapan tetap hidup',
  },

  // --------------------------------------------------------------- 3급
  {
    level: '3급',
    title: 'Menyampaikan Pendapat',
    focus:
      '제 생각에는 … · …다고 생각해요 · 맞는 말씀이지만 · 그것도 그렇지만 · 저는 좀 다르게 봐요',
    context: 'diskusi kelas dan rapat kecil',
  },
  {
    level: '3급',
    title: 'Menyampaikan Keluhan',
    focus:
      '좀 문제가 있는데요 · 이거 교환돼요? · 환불받을 수 있을까요? · 어떻게 해결해 주실 수 있나요?',
    context: 'komplain barang dan layanan',
  },
  {
    level: '3급',
    title: 'Wawancara Kerja',
    focus:
      '자기소개 부탁드립니다 · 저는 …을/를 전공했습니다 · …경험이 있습니다 · 최선을 다하겠습니다 · ' +
      '궁금한 점 있으신가요? — seluruhnya 합니다체',
    context: 'wawancara kerja atau beasiswa',
  },
  {
    level: '3급',
    title: 'Di Kantor',
    focus:
      '수고하셨습니다 · 먼저 들어가 보겠습니다 · 확인 부탁드립니다 · 언제까지 하면 될까요? · 보고드리겠습니다',
    context: 'bekerja di lingkungan Korea',
  },
  {
    level: '3급',
    title: 'E-mail dan Pesan Resmi',
    focus:
      '안녕하십니까, …입니다 · 다름이 아니라 · 첨부 파일을 확인해 주시기 바랍니다 · 감사합니다. …드림 — ' +
      'struktur pembuka, isi, penutup',
    context: 'menulis surel ke perusahaan atau kampus',
  },
  {
    level: '3급',
    title: 'Bahasa Anak Muda',
    focus:
      'Bentuk lisan: 뭐야 · 진짜? · 대박 · 헐 · ㄱㅅ/ㅇㅋ/ㅋㅋ di pesan · 인데 vs 인데요 — ' +
      'dan kapan ini TIDAK boleh dipakai',
    context: 'memahami drama, chat, dan obrolan teman',
  },

  // --------------------------------------------------------------- 4급
  {
    level: '4급',
    title: 'Rapat dan Presentasi',
    focus:
      '발표를 시작하겠습니다 · 먼저 … 다음으로 · 이 그래프를 보시면 · 이상으로 발표를 마치겠습니다 · ' +
      '질문 있으시면 말씀해 주세요',
    context: 'presentasi di kantor atau kampus',
  },
  {
    level: '4급',
    title: 'Bernegosiasi',
    focus:
      '검토해 보겠습니다 (dan apa artinya sebenarnya) · 그 부분은 조금 어려울 것 같습니다 · ' +
      '조율이 가능할까요? · 서로 양보하는 방향으로',
    context: 'membahas harga, tenggat, dan lingkup kerja',
  },
  {
    level: '4급',
    title: 'Melayani Pelanggan',
    focus:
      '무엇을 도와드릴까요? · 죄송합니다만 · 잠시만 기다려 주시겠습니까? · 불편을 드려 죄송합니다 · ' +
      '확인해 드리겠습니다 — 존댓말 tingkat tertinggi',
    context: 'menghadapi pelanggan',
  },

  // --------------------------------------------------------------- 5급–6급
  {
    level: '5급',
    title: 'Diskusi dan Debat',
    focus:
      '말씀하신 부분에 대해서 · 그 점은 동의하지만 · 근거를 말씀드리자면 · 논점을 정리하면 · ' +
      '반박하지 않을 수 없습니다',
    context: 'debat, seminar, dan diskusi akademik',
  },
  {
    level: '5급',
    title: 'Sambutan dan Pidato',
    focus:
      '바쁘신 중에도 참석해 주셔서 감사합니다 · 부족하지만 몇 말씀 드리겠습니다 · ' +
      '여러분의 건강과 행복을 기원합니다',
    context: 'acara resmi, pernikahan, perpisahan',
  },
  {
    level: '6급',
    title: 'Keigo Korea yang Rumit',
    focus:
      '압존법 (tidak meninggikan orang dalam di depan orang luar), 이중 존대 yang harus dihindari, ' +
      'dan 사물 존대 yang salah tapi lazim (커피 나오셨습니다)',
    context: 'bicara mewakili perusahaan ke pihak luar',
  },
  {
    level: '6급',
    title: 'Wawancara dan Liputan',
    focus:
      '실례가 안 된다면 · 말씀하신 게 … 이런 뜻인가요? · 구체적으로 어떤 점에서 · ' +
      '좋은 말씀 감사합니다',
    context: 'mewawancarai narasumber atau diwawancarai',
  },
]
