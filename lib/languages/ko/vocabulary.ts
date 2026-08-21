import type { VocabTheme } from '@/lib/languages/vocab-theme'

/**
 * KOSAKATA INTI KOREA — 1급 → 6급, per tema.
 *
 * Batasannya sama jujurnya dengan bahasa Jepang: ini bukan "semua kata yang
 * keluar di TOPIK". 1급 butuh ±800 kata, 6급 ±10.000, dan daftar
 * resminya tidak pernah diterbitkan sejak sistemnya diubah. Yang ada di sini
 * kosakata INTI — kata yang paling sering dipakai di tiap tingkat, disusun per
 * tema supaya bisa diperiksa mana yang belum ada.
 *
 * Kata ditulis dalam hangul apa adanya. Kata kerja dan kata sifat ditulis dalam
 * bentuk kamus (-다), karena itu bentuk yang dicari di kamus dan yang dipakai
 * sebagai dasar semua konjugasi.
 */

const T1: VocabTheme[] = [
  { level: '1급', title: 'Salam dan Sapaan', context: 'menyapa dan berpamitan', words: ['안녕하세요', '안녕히 가세요', '안녕히 계세요', '감사합니다', '고맙습니다', '죄송합니다', '미안해요', '실례합니다', '반갑습니다', '잘 부탁드립니다', '네', '아니요'] },
  { level: '1급', title: 'Angka dan Jumlah', context: 'menyebut jumlah dan harga', words: ['하나', '둘', '셋', '일', '이', '삼', '몇', '얼마', '개', '명', '번', '원'] },
  { level: '1급', title: 'Waktu Sehari-hari', context: 'menceritakan rutinitas', words: ['오늘', '내일', '어제', '아침', '점심', '저녁', '밤', '오전', '오후', '지금', '시간', '매일'] },
  { level: '1급', title: 'Hari dan Bulan', context: 'membaca kalender', words: ['월요일', '금요일', '토요일', '일요일', '주말', '이번 주', '다음 주', '지난주', '이번 달', '올해', '작년', '생일'] },
  { level: '1급', title: 'Keluarga', context: 'memperkenalkan keluarga', words: ['가족', '아버지', '어머니', '부모님', '형', '오빠', '누나', '언니', '동생', '아들', '딸', '할머니'] },
  { level: '1급', title: 'Orang dan Profesi', context: 'menyebut siapa dan pekerjaannya', words: ['사람', '친구', '선생님', '학생', '의사', '간호사', '회사원', '경찰관', '기사', '주부', '사장님', '이름'] },
  { level: '1급', title: 'Di Rumah', context: 'menjelaskan tempat tinggal', words: ['집', '방', '부엌', '화장실', '거실', '문', '창문', '침대', '책상', '의자', '냉장고', '텔레비전'] },
  { level: '1급', title: 'Makanan', context: 'makan sehari-hari', words: ['음식', '밥', '국', '김치', '고기', '생선', '계란', '빵', '과일', '채소', '반찬', '라면'] },
  { level: '1급', title: 'Minuman dan Rasa', context: 'memesan minum dan berkomentar', words: ['물', '커피', '차', '우유', '주스', '술', '맵다', '짜다', '달다', '시다', '맛있다', '맛없다'] },
  { level: '1급', title: 'Berbelanja', context: 'membeli barang', words: ['가게', '시장', '백화점', '값', '비싸다', '싸다', '돈', '카드', '사다', '팔다', '주다', '받다'] },
  { level: '1급', title: 'Sekolah', context: 'kegiatan belajar', words: ['학교', '교실', '수업', '숙제', '시험', '공부하다', '배우다', '가르치다', '책', '공책', '연필', '질문'] },
  { level: '1급', title: 'Transportasi', context: 'bepergian', words: ['자동차', '버스', '지하철', '기차', '비행기', '자전거', '택시', '역', '공항', '표', '타다', '내리다'] },
  { level: '1급', title: 'Tempat di Kota', context: 'menyebut lokasi', words: ['병원', '약국', '은행', '우체국', '식당', '카페', '공원', '도서관', '영화관', '편의점', '호텔', '회사'] },
  { level: '1급', title: 'Tubuh dan Sakit', context: 'ke dokter', words: ['머리', '눈', '코', '입', '귀', '손', '발', '배', '아프다', '감기', '약', '병원에 가다'] },
  { level: '1급', title: 'Cuaca dan Musim', context: 'basa-basi cuaca', words: ['날씨', '비', '눈', '바람', '덥다', '춥다', '따뜻하다', '시원하다', '봄', '여름', '가을', '겨울'] },
  { level: '1급', title: 'Warna dan Sifat Benda', context: 'menggambarkan barang', words: ['색깔', '빨갛다', '파랗다', '노랗다', '까맣다', '하얗다', '크다', '작다', '길다', '짧다', '새롭다', '오래되다'] },
  { level: '1급', title: 'Letak dan Arah', context: 'menjelaskan posisi', words: ['위', '아래', '앞', '뒤', '옆', '안', '밖', '사이', '오른쪽', '왼쪽', '가깝다', '멀다'] },
  { level: '1급', title: 'Kata Kerja Harian', context: 'kegiatan sehari-hari', words: ['가다', '오다', '보다', '듣다', '먹다', '마시다', '자다', '일어나다', '일하다', '쉬다', '읽다', '쓰다'] },
]

const T2: VocabTheme[] = [
  { level: '2급', title: 'Perasaan', context: 'menyampaikan suasana hati', words: ['기쁘다', '슬프다', '화나다', '무섭다', '외롭다', '걱정하다', '놀라다', '부끄럽다', '즐겁다', '지루하다', '편하다', '답답하다'] },
  { level: '2급', title: 'Sifat Orang', context: 'menggambarkan kepribadian', words: ['성격', '착하다', '친절하다', '조용하다', '활발하다', '부지런하다', '게으르다', '솔직하다', '똑똑하다', '재미있다', '예의 바르다', '고집이 세다'] },
  { level: '2급', title: 'Penampilan', context: 'menggambarkan orang', words: ['키가 크다', '날씬하다', '뚱뚱하다', '잘생기다', '예쁘다', '멋있다', '머리가 길다', '안경을 쓰다', '수염', '피부', '닮다', '외모'] },
  { level: '2급', title: 'Rumah dan Pindahan', context: 'menyewa dan menata rumah', words: ['이사하다', '월세', '전세', '보증금', '계약하다', '가구', '청소하다', '정리하다', '수리하다', '층', '엘리베이터', '주차장'] },
  { level: '2급', title: 'Kantor', context: 'dunia kerja', words: ['회의', '보고서', '출근하다', '퇴근하다', '야근', '휴가', '월급', '상사', '동료', '부서', '면접', '취직하다'] },
  { level: '2급', title: 'Telepon dan Pesan', context: 'komunikasi jarak jauh', words: ['전화하다', '받다', '끊다', '문자', '연락하다', '메시지', '통화', '남기다', '바쁘다', '다시 걸다', '번호', '주소'] },
  { level: '2급', title: 'Perjalanan', context: 'liburan dan wisata', words: ['여행', '예약하다', '출발하다', '도착하다', '숙소', '짐', '구경하다', '사진을 찍다', '기념품', '여권', '길을 잃다', '안내'] },
  { level: '2급', title: 'Memasak', context: 'menyiapkan makanan', words: ['요리하다', '끓이다', '굽다', '볶다', '썰다', '섞다', '소금', '설탕', '간장', '기름', '재료', '맛보다'] },
  { level: '2급', title: 'Kesehatan', context: 'menjaga tubuh', words: ['건강', '운동하다', '살이 찌다', '살을 빼다', '열이 나다', '기침하다', '주사', '입원하다', '치료', '진료', '증상', '푹 쉬다'] },
  { level: '2급', title: 'Hobi dan Hiburan', context: 'wakti luang', words: ['취미', '음악', '영화', '드라마', '노래하다', '춤추다', '그림', '등산', '낚시', '게임', '공연', '관심'] },
  { level: '2급', title: 'Teknologi', context: 'memakai gawai', words: ['컴퓨터', '인터넷', '검색하다', '누르다', '저장하다', '지우다', '비밀번호', '화면', '충전하다', '고장 나다', '앱', '접속하다'] },
  { level: '2급', title: 'Alam', context: 'menggambarkan pemandangan', words: ['자연', '산', '바다', '강', '하늘', '별', '나무', '꽃', '풀', '섬', '동물', '경치'] },
  { level: '2급', title: 'Uang', context: 'mengatur keuangan', words: ['통장', '계좌', '입금하다', '출금하다', '저축하다', '빌리다', '갚다', '용돈', '할인', '무료', '세금', '영수증'] },
  { level: '2급', title: 'Kata Keterangan Lanjutan', context: 'menghaluskan maksud', words: ['아마', '혹시', '역시', '그냥', '아직', '벌써', '별로', '전혀', '드디어', '갑자기', '천천히', '빨리'] },
]

const T3: VocabTheme[] = [
  { level: '3급', title: 'Pendapat dan Diskusi', context: 'menyampaikan pandangan', words: ['의견', '주장하다', '이유', '근거', '결론', '판단하다', '반대하다', '찬성하다', '인정하다', '설득하다', '토론', '비판'] },
  { level: '3급', title: 'Masyarakat', context: 'membaca berita sosial', words: ['사회', '문화', '전통', '세대', '지역', '인구', '국민', '시민', '변화', '문제', '해결하다', '영향'] },
  { level: '3급', title: 'Pendidikan', context: 'membicarakan studi', words: ['교육', '전공', '입학하다', '졸업하다', '성적', '장학금', '진학하다', '학위', '연구', '발표하다', '자격증', '경쟁'] },
  { level: '3급', title: 'Karier', context: 'mencari dan menjalani kerja', words: ['취업', '이직하다', '경력', '능력', '책임', '담당하다', '승진', '퇴사하다', '업무', '성과', '모집하다', '지원하다'] },
  { level: '3급', title: 'Ekonomi Sehari-hari', context: 'berita ekonomi ringan', words: ['경제', '가격', '소비', '수입', '지출', '이익', '손해', '투자', '물가', '절약하다', '대출', '부담'] },
  { level: '3급', title: 'Lingkungan', context: 'isu lingkungan', words: ['환경', '오염', '쓰레기', '재활용', '보호하다', '자원', '에너지', '기후', '줄이다', '심각하다', '개발', '피해'] },
  { level: '3급', title: 'Teknologi dan Informasi', context: 'dunia digital', words: ['정보', '기술', '개발하다', '이용하다', '자료', '통신', '설정', '보안', '유출', '확산되다', '편리하다', '의존하다'] },
  { level: '3급', title: 'Hubungan Sosial', context: 'berinteraksi', words: ['관계', '오해', '갈등', '화해하다', '배려하다', '협력하다', '부탁하다', '거절하다', '약속', '신뢰', '소통', '예의'] },
  { level: '3급', title: 'Sifat dan Keadaan', context: 'menggambarkan secara tepat', words: ['복잡하다', '단순하다', '정확하다', '충분하다', '부족하다', '적당하다', '당연하다', '분명하다', '의외이다', '특별하다', '평범하다', '주요하다'] },
  { level: '3급', title: 'Kata Kerja Abstrak', context: 'menulis lebih formal', words: ['포함하다', '나타내다', '제시하다', '요구하다', '기대하다', '유지하다', '증가하다', '감소하다', '발생하다', '적용하다', '제공하다', '개선하다'] },
  { level: '3급', title: 'Bencana dan Keselamatan', context: 'berita darurat', words: ['사고', '지진', '태풍', '홍수', '화재', '대피하다', '구조하다', '안전', '위험', '예방하다', '피해자', '신고하다'] },
  { level: '3급', title: 'Kata Serapan', context: 'kata asing yang lazim', words: ['서비스', '시스템', '데이터', '이미지', '스트레스', '스케줄', '아이디어', '프로그램', '디자인', '트렌드', '메뉴', '스타일'] },
]

const T4: VocabTheme[] = [
  { level: '4급', title: 'Politik dan Hukum', context: 'berita politik', words: ['정치', '정부', '정책', '선거', '국회', '법률', '제도', '권리', '의무', '재판', '처벌', '개정하다'] },
  { level: '4급', title: 'Bisnis dan Industri', context: 'berita bisnis', words: ['기업', '산업', '거래', '계약서', '수요', '공급', '시장', '경쟁력', '수출', '수입품', '생산하다', '홍보하다'] },
  { level: '4급', title: 'Kesejahteraan', context: 'isu sosial', words: ['복지', '고령화', '저출산', '차별', '평등', '빈곤', '격차', '지원하다', '기부하다', '봉사', '보장하다', '소외되다'] },
  { level: '4급', title: 'Pikiran dan Kesadaran', context: 'tulisan reflektif', words: ['의식', '인식', '기억', '상상', '편견', '가치관', '관점', '전제', '본질', '경향', '심리', '태도'] },
  { level: '4급', title: 'Struktur dan Sistem', context: 'menjelaskan organisasi', words: ['구조', '조직', '기능', '요소', '단계', '과정', '절차', '기준', '규모', '범위', '방침', '체계'] },
  { level: '4급', title: 'Angka dan Data', context: 'membaca laporan', words: ['통계', '비율', '평균', '증가율', '조사하다', '분석하다', '결과', '수치', '추세', '급증하다', '차지하다', '집계'] },
  { level: '4급', title: 'Media dan Opini', context: 'membaca kolom', words: ['언론', '보도하다', '기사', '취재', '여론', '광고', '홍보', '비판하다', '지적하다', '강조하다', '논란', '반응'] },
  { level: '4급', title: 'Sains dan Kesehatan', context: 'artikel ilmiah populer', words: ['연구하다', '실험', '증명하다', '발견하다', '치료법', '예방', '감염', '면역', '유전', '세포', '효과', '부작용'] },
  { level: '4급', title: 'Kata Sifat Tulisan', context: 'penilaian dalam tulisan', words: ['적절하다', '유효하다', '심각하다', '뚜렷하다', '독특하다', '객관적이다', '주관적이다', '보편적이다', '지속적이다', '급격하다', '점진적이다', '불가피하다'] },
  { level: '4급', title: 'Onomatope dan Mimetik', context: 'menghidupkan cerita', words: ['깜짝', '반짝반짝', '두근두근', '천천히', '푹', '꽉', '살짝', '갑자기', '조금씩', '점점', '무척', '훨씬'] },
]

const T5: VocabTheme[] = [
  { level: '5급', title: 'Pemikiran Abstrak', context: 'esai dan filsafat', words: ['이념', '사상', '신념', '윤리', '도덕', '진리', '모순', '추상적', '구체적', '보편', '필연', '우연'] },
  { level: '5급', title: 'Analisis dan Kritik', context: 'ulasan akademik', words: ['고찰', '통찰', '견해', '해석', '논리', '타당성', '검증하다', '반론', '비평', '입증하다', '전제하다', '도출하다'] },
  { level: '5급', title: 'Ekonomi Lanjutan', context: 'analisis ekonomi', words: ['재정', '부채', '융자', '유통', '독점', '생산성', '내수', '경기 침체', '완화하다', '규제', '전망', '지표'] },
  { level: '5급', title: 'Seni dan Sastra', context: 'kritik seni', words: ['묘사', '비유', '상징', '정서', '섬세하다', '구성', '연출', '작품', '창작', '감상', '여운', '표현력'] },
  { level: '5급', title: 'Perasaan Mendalam', context: 'prosa dan esai pribadi', words: ['그리움', '아쉬움', '갈등', '초조하다', '허무하다', '안도하다', '집착', '체념', '위로', '격려', '각오', '설렘'] },
  { level: '5급', title: 'Kata Kerja Formal', context: 'dokumen resmi', words: ['시행하다', '수립하다', '촉구하다', '모색하다', '추진하다', '보완하다', '초래하다', '기여하다', '수반하다', '전환하다', '규명하다', '확보하다'] },
]

const T6: VocabTheme[] = [
  { level: '6급', title: 'Sejarah dan Peradaban', context: 'tulisan sejarah', words: ['문명', '왕조', '유적', '계승하다', '침략', '교역', '쇠퇴하다', '부흥', '사료', '시대상', '변천', '유산'] },
  { level: '6급', title: 'Bahasa dan Linguistik', context: 'tulisan tentang bahasa', words: ['어휘', '문법 체계', '방언', '어원', '표기법', '음운', '통역', '모국어', '습득하다', '맥락', '어감', '번역'] },
  { level: '6급', title: 'Kata Bernuansa Kuat', context: 'tulisan yang bertenaga', words: ['불가피하다', '현저하다', '미미하다', '방대하다', '치밀하다', '모호하다', '치열하다', '견고하다', '유연하다', '취약하다', '왜곡되다', '부각되다'] },
  { level: '6급', title: 'Penghubung Formal', context: 'menyusun tulisan akademik', words: ['따라서', '그러므로', '즉', '다만', '한편', '나아가', '아울러', '오히려', '무엇보다', '요컨대', '결과적으로', '이에 반해'] },
]

export const KO_VOCAB_THEMES: VocabTheme[] = [...T1, ...T2, ...T3, ...T4, ...T5, ...T6]
