/**
 * KOSAKATA INTI JEPANG — N5 → N1, disusun per tema.
 *
 * Ini padanan Academic Word List-nya bahasa Jepang, dengan satu perbedaan
 * penting yang harus dinyatakan terus terang:
 *
 * AWL bisa ditulis LENGKAP (570 kata, selesai). Kosakata JLPT tidak bisa —
 * N5 butuh ±800 kata, N1 ±10.000, dan daftarnya tidak pernah diterbitkan
 * resmi. Jadi yang ada di sini bukan "semua kata yang keluar di ujian", tapi
 * KOSAKATA INTI: kata yang paling sering dipakai di tiap level, disusun per
 * tema supaya bisa diperiksa mana yang belum ada.
 *
 * Sisanya tidak dibiarkan menganggur: kata di luar daftar ini tetap masuk
 * lewat pelajaran kanji (tiap kanji dilatih dengan kata contoh) dan lewat
 * bacaan tiap pelajaran grammar. Yang dijamin daftar ini adalah lantainya,
 * bukan langit-langitnya.
 *
 * Kata ditulis apa adanya — kanji kalau memang lazim ditulis kanji, kana
 * kalau memang lazim ditulis kana (ある, きれい, たくさん). Menuliskan
 * 綺麗 untuk pemula justru mengajarkan yang salah: penutur asli menulisnya
 * きれい.
 */

export type VocabTheme = {
  level: string
  /** judul pelajaran dalam bahasa Indonesia */
  title: string
  /** situasi pemakaiannya — jadi konteks prompt materi & contoh kalimat */
  context: string
  words: string[]
}

// ---------------------------------------------------------------------------
// N5 — 24 tema. Kata yang dipakai setiap hari sejak hari pertama.
// ---------------------------------------------------------------------------

const N5: VocabTheme[] = [
  {
    level: 'N5',
    title: 'Salam dan Sapaan',
    context: 'menyapa dan berpamitan sepanjang hari',
    words: ['おはようございます', 'こんにちは', 'こんばんは', 'さようなら', 'ありがとうございます', 'すみません', 'はじめまして', 'よろしくお願いします', 'いただきます', 'ごちそうさまでした', 'おやすみなさい', 'いってきます'],
  },
  {
    level: 'N5',
    title: 'Angka dan Jumlah',
    context: 'menyebut jumlah dan harga',
    words: ['一つ', '二つ', '三つ', 'いくつ', 'いくら', '何人', '何番', '半分', '全部', 'たくさん', '少し', 'ちょっと'],
  },
  {
    level: 'N5',
    title: 'Waktu Sehari-hari',
    context: 'menceritakan rutinitas dari pagi sampai malam',
    words: ['今', '今日', '明日', '昨日', '毎日', '朝', '昼', '晩', '午前', '午後', '時間', '今週'],
  },
  {
    level: 'N5',
    title: 'Hari dan Bulan',
    context: 'membuat janji dan membaca kalender',
    words: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日', '今月', '来月', '先月', '来年', '誕生日'],
  },
  {
    level: 'N5',
    title: 'Keluarga',
    context: 'memperkenalkan anggota keluarga',
    words: ['父', '母', '兄', '姉', '弟', '妹', '家族', '両親', '子ども', '主人', '奥さん', 'おじいさん'],
  },
  {
    level: 'N5',
    title: 'Orang dan Pekerjaan',
    context: 'menyebut siapa seseorang dan apa pekerjaannya',
    words: ['人', '男', '女', '友達', '先生', '学生', '会社員', '医者', '店員', 'お客さん', '名前', '仕事'],
  },
  {
    level: 'N5',
    title: 'Di Dalam Rumah',
    context: 'menjelaskan isi rumah dan kamar',
    words: ['家', '部屋', '台所', 'トイレ', 'お風呂', '窓', 'ドア', '椅子', '机', 'ベッド', '電気', '冷蔵庫'],
  },
  {
    level: 'N5',
    title: 'Makanan dan Minuman',
    context: 'belanja bahan makanan dan memesan makan',
    words: ['ご飯', 'パン', '肉', '魚', '野菜', '果物', '卵', '牛乳', 'お茶', '水', 'お酒', 'お菓子'],
  },
  {
    level: 'N5',
    title: 'Di Rumah Makan',
    context: 'memesan makanan dan berkomentar tentang rasanya',
    words: ['食堂', '喫茶店', 'レストラン', 'メニュー', '料理', '味', '甘い', '辛い', 'おいしい', 'まずい', '注文', 'お皿'],
  },
  {
    level: 'N5',
    title: 'Berbelanja',
    context: 'membeli barang di toko',
    words: ['店', '買う', '売る', '値段', '高い', '安い', 'お金', '財布', '切符', 'レジ', 'おつり', '袋'],
  },
  {
    level: 'N5',
    title: 'Sekolah dan Belajar',
    context: 'kegiatan di kelas',
    words: ['学校', '大学', '教室', '授業', '宿題', '試験', '勉強', '質問', '答え', '辞書', '鉛筆', '消しゴム'],
  },
  {
    level: 'N5',
    title: 'Transportasi',
    context: 'bepergian dengan kendaraan umum',
    words: ['電車', '車', '自転車', 'バス', '飛行機', '駅', '空港', '道', '地下鉄', 'タクシー', '乗る', '降りる'],
  },
  {
    level: 'N5',
    title: 'Tempat di Kota',
    context: 'menanyakan dan menyebut lokasi',
    words: ['町', '銀行', '郵便局', '病院', '図書館', '公園', '映画館', 'デパート', 'ホテル', '交番', 'スーパー', 'コンビニ'],
  },
  {
    level: 'N5',
    title: 'Tubuh dan Kesehatan',
    context: 'ke dokter dan menjelaskan keluhan',
    words: ['頭', '目', '耳', '口', '鼻', '手', '足', '体', '病気', '薬', '元気', '痛い'],
  },
  {
    level: 'N5',
    title: 'Cuaca dan Musim',
    context: 'membicarakan cuaca sebagai basa-basi',
    words: ['天気', '晴れ', '雨', '雪', '風', '曇り', '暑い', '寒い', '春', '夏', '秋', '冬'],
  },
  {
    level: 'N5',
    title: 'Warna dan Bentuk',
    context: 'menggambarkan barang',
    words: ['白い', '黒い', '赤い', '青い', '黄色い', '茶色', '緑', '色', '丸い', '大きい', '小さい', '同じ'],
  },
  {
    level: 'N5',
    title: 'Kata Sifat i',
    context: 'memberi penilaian sederhana',
    words: ['新しい', '古い', '長い', '短い', '広い', '狭い', '重い', '軽い', '早い', '遅い', '強い', '弱い'],
  },
  {
    level: 'N5',
    title: 'Kata Sifat na',
    context: 'menggambarkan sifat orang dan suasana',
    words: ['好き', '嫌い', '上手', '下手', '便利', '不便', '有名', '静か', 'にぎやか', '大切', '大丈夫', '親切'],
  },
  {
    level: 'N5',
    title: 'Kata Kerja Harian',
    context: 'menceritakan kegiatan sehari-hari',
    words: ['起きる', '寝る', '食べる', '飲む', '見る', '聞く', '話す', '読む', '書く', '行く', '来る', '帰る'],
  },
  {
    level: 'N5',
    title: 'Kata Kerja Kegiatan',
    context: 'menceritakan pekerjaan dan waktu luang',
    words: ['働く', '休む', '遊ぶ', '待つ', '会う', '使う', '作る', '洗う', '貸す', '借りる', '教える', '習う'],
  },
  {
    level: 'N5',
    title: 'Letak dan Arah',
    context: 'menjelaskan posisi benda',
    words: ['上', '下', '中', '外', '前', '後ろ', '右', '左', '隣', '近く', '間', 'そば'],
  },
  {
    level: 'N5',
    title: 'Kata Keterangan Dasar',
    context: 'membuat kalimat terdengar alami',
    words: ['よく', 'もう', 'まだ', 'すぐ', 'いつも', 'ときどき', 'あまり', 'ぜんぜん', 'とても', 'もっと', '一緒に', '初めて'],
  },
  {
    level: 'N5',
    title: 'Barang Bawaan',
    context: 'menyebut barang yang dibawa sehari-hari',
    words: ['本', 'ノート', '紙', 'かばん', '傘', '靴', '服', '帽子', '時計', '眼鏡', '携帯電話', 'カメラ'],
  },
  {
    level: 'N5',
    title: 'Kata Serapan Dasar',
    context: 'kata katakana yang paling sering muncul',
    words: ['テレビ', 'ラジオ', 'パソコン', 'コーヒー', 'ケーキ', 'テーブル', 'エレベーター', 'アパート', 'ボールペン', 'シャツ', 'スポーツ', 'ニュース'],
  },
]

// ---------------------------------------------------------------------------
// N4 — 20 tema. Kata untuk bercerita, bukan sekadar menyebut benda.
// ---------------------------------------------------------------------------

const N4: VocabTheme[] = [
  {
    level: 'N4',
    title: 'Perasaan',
    context: 'menceritakan suasana hati',
    words: ['嬉しい', '悲しい', '楽しい', '寂しい', '恥ずかしい', '怖い', '心配', '安心', '驚く', '怒る', '笑う', '泣く'],
  },
  {
    level: 'N4',
    title: 'Sifat dan Watak',
    context: 'menggambarkan kepribadian orang',
    words: ['真面目', '優しい', '厳しい', '面白い', 'つまらない', '珍しい', '偉い', '恥ずかしがり', '正直', '熱心', '丁寧', '失礼'],
  },
  {
    level: 'N4',
    title: 'Pekerjaan Kantor',
    context: 'kegiatan sehari-hari di tempat kerja',
    words: ['会議', '会社', '社長', '部長', '書類', '報告', '連絡', '相談', '出張', '残業', '給料', '面接'],
  },
  {
    level: 'N4',
    title: 'Telepon dan Surat',
    context: 'berkomunikasi jarak jauh',
    words: ['電話', 'かける', '切る', '伝える', '返事', '手紙', '葉書', '封筒', '切手', '送る', '届く', 'メール'],
  },
  {
    level: 'N4',
    title: 'Rumah dan Perabot',
    context: 'pindah rumah dan menata ruangan',
    words: ['引っ越し', '家賃', '部屋代', '押し入れ', '棚', '布団', 'カーテン', '壁', '床', '屋根', '庭', '階段'],
  },
  {
    level: 'N4',
    title: 'Kota dan Fasilitas',
    context: 'mengurus keperluan di kota',
    words: ['市役所', '受付', '案内', '工場', '事務所', '駐車場', '橋', '角', '信号', '交差点', '横断歩道', '通り'],
  },
  {
    level: 'N4',
    title: 'Perjalanan',
    context: 'merencanakan dan menjalani perjalanan',
    words: ['旅行', '予約', '出発', '到着', '案内所', '観光', '荷物', '準備', '地図', '土産', '泊まる', '見物'],
  },
  {
    level: 'N4',
    title: 'Masak dan Rasa',
    context: 'memasak dan menjelaskan cara membuat',
    words: ['料理する', '切る', '焼く', '煮る', '茹でる', '混ぜる', '沸かす', '味見', '塩', '砂糖', '醤油', '油'],
  },
  {
    level: 'N4',
    title: 'Sakit dan Berobat',
    context: 'menjelaskan gejala kepada dokter',
    words: ['熱', '風邪', '怪我', '注射', '入院', '退院', '診察', '具合', '喉', '腹', '背中', '倒れる'],
  },
  {
    level: 'N4',
    title: 'Alam dan Lingkungan',
    context: 'menceritakan pemandangan dan alam',
    words: ['自然', '山', '海', '川', '森', '林', '空', '星', '月', '太陽', '島', '湖'],
  },
  {
    level: 'N4',
    title: 'Belajar Bahasa',
    context: 'membicarakan proses belajar',
    words: ['発音', '文法', '単語', '会話', '作文', '翻訳', '意味', '説明', '覚える', '忘れる', '間違える', '直す'],
  },
  {
    level: 'N4',
    title: 'Waktu dan Frekuensi',
    context: 'menyusun jadwal dan kebiasaan',
    words: ['最近', '将来', '以前', '以後', '途中', '間に合う', '遅れる', '急ぐ', '続く', '始まる', '終わる', '過ぎる'],
  },
  {
    level: 'N4',
    title: 'Gerakan dan Perpindahan',
    context: 'menjelaskan gerak benda dan orang',
    words: ['動く', '止まる', '運ぶ', '落ちる', '落とす', '入れる', '出す', '開ける', '閉める', '並ぶ', '曲がる', '渡る'],
  },
  {
    level: 'N4',
    title: 'Berpikir dan Memutuskan',
    context: 'menyampaikan pertimbangan',
    words: ['考える', '思う', '決める', '選ぶ', '比べる', '調べる', '確かめる', '気がつく', '思い出す', '信じる', '賛成', '反対'],
  },
  {
    level: 'N4',
    title: 'Aturan dan Perizinan',
    context: 'memahami aturan tempat umum',
    words: ['規則', '禁止', '許可', '注意', '危険', '安全', '守る', '破る', '申し込む', '払う', '登録', '手続き'],
  },
  {
    level: 'N4',
    title: 'Uang dan Belanja',
    context: 'mengatur pengeluaran',
    words: ['値上げ', '割引', '無料', '税金', '貯金', '払い戻し', '請求', '通帳', '口座', '振り込む', '両替', '会計'],
  },
  {
    level: 'N4',
    title: 'Hobi dan Hiburan',
    context: 'membicarakan kegiatan waktu luang',
    words: ['趣味', '興味', '漫画', '小説', '劇', '演奏', '踊り', '釣り', '登山', '試合', '選手', '応援'],
  },
  {
    level: 'N4',
    title: 'Teknologi Sehari-hari',
    context: 'memakai alat elektronik',
    words: ['機械', '故障', '修理', '電池', '画面', '押す', '引く', '回す', '点検', '使い方', '説明書', '調子'],
  },
  {
    level: 'N4',
    title: 'Hubungan Sosial',
    context: 'berinteraksi dengan orang lain',
    words: ['約束', '招待', '紹介', '訪ねる', '挨拶', '遠慮', '世話', '迷惑', '喧嘩', '仲', '付き合う', '別れる'],
  },
  {
    level: 'N4',
    title: 'Kata Keterangan Lanjutan',
    context: 'menghaluskan dan menegaskan maksud',
    words: ['きっと', 'たぶん', 'やはり', 'ぜひ', 'なるべく', 'できるだけ', 'そろそろ', 'ずっと', 'しばらく', '急に', '突然', '特に'],
  },
]

// ---------------------------------------------------------------------------
// N3 — 18 tema. Kata untuk berpendapat dan membaca artikel.
// ---------------------------------------------------------------------------

const N3: VocabTheme[] = [
  {
    level: 'N3',
    title: 'Pendapat dan Argumen',
    context: 'menyampaikan pendapat dalam diskusi',
    words: ['意見', '主張', '理由', '根拠', '結論', '説得', '判断', '評価', '批判', '認める', '否定', '納得'],
  },
  {
    level: 'N3',
    title: 'Masyarakat',
    context: 'membaca berita tentang masyarakat',
    words: ['社会', '政治', '経済', '文化', '国民', '政府', '選挙', '法律', '制度', '税', '人口', '地域'],
  },
  {
    level: 'N3',
    title: 'Pendidikan',
    context: 'membicarakan sekolah dan kuliah',
    words: ['教育', '進学', '受験', '合格', '不合格', '成績', '専門', '研究', '講義', '発表', '資格', '卒業'],
  },
  {
    level: 'N3',
    title: 'Kerja dan Karier',
    context: 'mencari kerja dan berkarier',
    words: ['就職', '転職', '採用', '募集', '経験', '能力', '責任', '担当', '上司', '部下', '同僚', '退職'],
  },
  {
    level: 'N3',
    title: 'Uang dan Ekonomi',
    context: 'memahami berita ekonomi sederhana',
    words: ['収入', '支出', '利益', '損', '価格', '費用', '企業', '景気', '投資', '節約', '借金', '返済'],
  },
  {
    level: 'N3',
    title: 'Perubahan dan Perkembangan',
    context: 'menjelaskan tren dan perubahan',
    words: ['変化', '発展', '成長', '増加', '減少', '進歩', '影響', '効果', '結果', '原因', '傾向', '状況'],
  },
  {
    level: 'N3',
    title: 'Teknologi dan Informasi',
    context: 'membicarakan internet dan teknologi',
    words: ['情報', '技術', '開発', '利用', '検索', '登録', '通信', '設定', '保存', '削除', '接続', '普及'],
  },
  {
    level: 'N3',
    title: 'Kesehatan dan Tubuh',
    context: 'membicarakan pola hidup sehat',
    words: ['健康', '体調', '栄養', '運動', '疲れ', '休息', '治療', '手術', '予防', '症状', '検査', '回復'],
  },
  {
    level: 'N3',
    title: 'Perasaan Halus',
    context: 'menyampaikan perasaan yang tidak sederhana',
    words: ['不安', '緊張', '感動', '満足', '不満', '後悔', '期待', '我慢', '苦労', '努力', '感謝', '尊敬'],
  },
  {
    level: 'N3',
    title: 'Sifat dan Keadaan',
    context: 'menggambarkan keadaan secara tepat',
    words: ['複雑', '単純', '正確', '曖昧', '十分', '不足', '適当', '当然', '意外', '確か', '明らか', '主要'],
  },
  {
    level: 'N3',
    title: 'Waktu dan Urutan',
    context: 'menyusun kronologi peristiwa',
    words: ['期間', '期限', '当時', '現在', '将来', '同時', '直後', '直前', '順番', '間隔', '延期', '中止'],
  },
  {
    level: 'N3',
    title: 'Hubungan Antarhal',
    context: 'menjelaskan keterkaitan',
    words: ['関係', '関連', '比較', '区別', '共通', '違い', '代わり', '反対', '対象', '中心', '基本', '応用'],
  },
  {
    level: 'N3',
    title: 'Tindakan Sosial',
    context: 'berinteraksi secara formal',
    words: ['協力', '参加', '協議', '交流', '支援', '援助', '相談', '依頼', '報告', '確認', '許可', '断る'],
  },
  {
    level: 'N3',
    title: 'Alam dan Bencana',
    context: 'membaca berita cuaca dan bencana',
    words: ['災害', '地震', '台風', '洪水', '火事', '避難', '被害', '救助', '安全', '危険', '気候', '環境'],
  },
  {
    level: 'N3',
    title: 'Kata Kerja Abstrak',
    context: 'menulis kalimat yang lebih formal',
    words: ['含む', '示す', '表す', '与える', '受ける', '求める', '応じる', '基づく', '限る', '除く', '生じる', '至る'],
  },
  {
    level: 'N3',
    title: 'Kata Keterangan Argumentatif',
    context: 'menyusun paragraf yang runtut',
    words: ['実は', '確かに', '一方', 'しかも', 'つまり', 'ただし', 'およそ', '少なくとも', 'むしろ', 'さらに', 'やがて', 'ついに'],
  },
  {
    level: 'N3',
    title: 'Kata Serapan Menengah',
    context: 'kata katakana di kantor dan media',
    words: ['サービス', 'システム', 'データ', 'イメージ', 'テーマ', 'レベル', 'スケジュール', 'トラブル', 'チャンス', 'アドバイス', 'スタイル', 'バランス'],
  },
  {
    level: 'N3',
    title: 'Ungkapan Tetap Sehari-hari',
    context: 'percakapan yang terdengar wajar',
    words: ['気をつける', '気にする', '気になる', '役に立つ', '仕方がない', 'とんでもない', 'おかげさまで', 'お邪魔します', 'お疲れさま', 'かまいません', '構わない', 'なるほど'],
  },
]

// ---------------------------------------------------------------------------
// N2 — 16 tema. Kata surat kabar dan tulisan resmi.
// ---------------------------------------------------------------------------

const N2: VocabTheme[] = [
  {
    level: 'N2',
    title: 'Berita dan Media',
    context: 'membaca surat kabar',
    words: ['報道', '記事', '取材', '発表', '公表', '掲載', '世論', '広告', '宣伝', '編集', '特集', '匿名'],
  },
  {
    level: 'N2',
    title: 'Politik dan Hukum',
    context: 'memahami berita politik',
    words: ['政策', '議会', '国会', '首相', '大臣', '条約', '憲法', '裁判', '犯罪', '逮捕', '訴える', '権利'],
  },
  {
    level: 'N2',
    title: 'Ekonomi dan Bisnis',
    context: 'membaca berita bisnis',
    words: ['企業', '産業', '取引', '契約', '需要', '供給', '市場', '株', '為替', '輸出', '輸入', '倒産'],
  },
  {
    level: 'N2',
    title: 'Ilmu dan Penelitian',
    context: 'membaca tulisan ilmiah populer',
    words: ['研究', '実験', '観察', '仮説', '証明', '分析', '統計', '数値', '理論', '発見', '応用', '実証'],
  },
  {
    level: 'N2',
    title: 'Lingkungan dan Energi',
    context: 'membahas isu lingkungan',
    words: ['環境', '資源', '燃料', '排出', '汚染', '温暖化', '再生', '節電', '廃棄', '循環', '対策', '持続'],
  },
  {
    level: 'N2',
    title: 'Kemanusiaan dan Kesejahteraan',
    context: 'membahas isu sosial',
    words: ['福祉', '介護', '差別', '平等', '貧困', '格差', '支援', '募金', '寄付', '奉仕', '救済', '共存'],
  },
  {
    level: 'N2',
    title: 'Pikiran dan Kesadaran',
    context: 'menulis esai reflektif',
    words: ['意識', '認識', '記憶', '想像', '発想', '偏見', '価値観', '概念', '観点', '前提', '本質', '傾向'],
  },
  {
    level: 'N2',
    title: 'Struktur dan Sistem',
    context: 'menjelaskan cara kerja organisasi',
    words: ['構造', '組織', '仕組み', '機能', '要素', '段階', '過程', '手順', '方針', '基準', '規模', '範囲'],
  },
  {
    level: 'N2',
    title: 'Tingkat dan Ukuran',
    context: 'menyampaikan data dengan tepat',
    words: ['割合', '比率', '平均', '最大', '最小', '大幅', '若干', '程度', '相当', '極めて', '著しい', '僅か'],
  },
  {
    level: 'N2',
    title: 'Sebab dan Akibat',
    context: 'menyusun penjelasan sebab-akibat',
    words: ['要因', '要素', '影響力', '反映', '反応', '対応', '解決', '解消', '促進', '妨げる', '及ぼす', '導く'],
  },
  {
    level: 'N2',
    title: 'Sikap dan Perilaku',
    context: 'menggambarkan sikap seseorang',
    words: ['態度', '姿勢', '行動', '習慣', '礼儀', '謙虚', '積極的', '消極的', '慎重', '大胆', '柔軟', '頑固'],
  },
  {
    level: 'N2',
    title: 'Kerja Formal',
    context: 'bekerja di lingkungan Jepang',
    words: ['勤務', '職場', '業務', '実績', '評価', '昇進', '異動', '派遣', '契約社員', '労働', '休暇', '福利'],
  },
  {
    level: 'N2',
    title: 'Kata Kerja Tulisan',
    context: 'menulis laporan dan esai',
    words: ['述べる', '論じる', '指摘', '強調', '主張する', '前提とする', '想定', '検討', '考慮', '踏まえる', '取り組む', '取り上げる'],
  },
  {
    level: 'N2',
    title: 'Kata Sifat Tulisan',
    context: 'memberi penilaian dalam tulisan',
    words: ['適切', '不適切', '有効', '無効', '妥当', '深刻', '重大', '顕著', '独特', '普遍的', '客観的', '主観的'],
  },
  {
    level: 'N2',
    title: 'Onomatope Umum',
    context: 'memahami percakapan dan cerita',
    words: ['どきどき', 'わくわく', 'いらいら', 'びっくり', 'ぐっすり', 'うろうろ', 'ぴったり', 'すっかり', 'はっきり', 'ゆっくり', 'ちゃんと', 'そっと'],
  },
  {
    level: 'N2',
    title: 'Kata Serapan Lanjutan',
    context: 'membaca artikel modern',
    words: ['プロセス', 'コスト', 'リスク', 'ニーズ', 'メリット', 'デメリット', 'コミュニケーション', 'プレッシャー', 'アプローチ', 'ネットワーク', 'グローバル', 'コンセプト'],
  },
]

// ---------------------------------------------------------------------------
// N1 — 14 tema. Kata abstrak, ungkapan tetap, dan bahasa tulis.
// ---------------------------------------------------------------------------

const N1: VocabTheme[] = [
  {
    level: 'N1',
    title: 'Pemikiran Abstrak',
    context: 'membaca esai filosofis',
    words: ['理念', '思想', '信念', '倫理', '道徳', '真理', '矛盾', '抽象', '具体', '普遍', '必然', '偶然'],
  },
  {
    level: 'N1',
    title: 'Analisis dan Kritik',
    context: 'membaca kritik dan ulasan',
    words: ['考察', '洞察', '見解', '解釈', '論理', '根拠づけ', '妥当性', '客観', '主観', '批評', '反論', '検証'],
  },
  {
    level: 'N1',
    title: 'Kekuasaan dan Institusi',
    context: 'membaca tulisan politik serius',
    words: ['権限', '統治', '支配', '干渉', '介入', '主権', '独裁', '民主', '官僚', '行政', '施行', '撤廃'],
  },
  {
    level: 'N1',
    title: 'Ekonomi Lanjutan',
    context: 'membaca analisis ekonomi',
    words: ['財政', '債務', '融資', '投機', '流通', '独占', '競争力', '生産性', '内需', '景気後退', '緩和', '是正'],
  },
  {
    level: 'N1',
    title: 'Sains dan Teknologi',
    context: 'membaca artikel sains',
    words: ['遺伝', '細胞', '免疫', '有機', '化合', '粒子', '振動', '衛星', '観測', '解析', '精密', '実装'],
  },
  {
    level: 'N1',
    title: 'Sastra dan Seni',
    context: 'membaca novel dan kritik seni',
    words: ['描写', '比喩', '象徴', '余韻', '風情', '趣', '情緒', '哀愁', '繊細', '荘厳', '鮮烈', '構図'],
  },
  {
    level: 'N1',
    title: 'Perasaan Mendalam',
    context: 'membaca prosa dan esai pribadi',
    words: ['憧れ', '未練', '葛藤', '焦り', '虚しさ', '安堵', '衝動', '執着', '諦め', '慰め', '励まし', '覚悟'],
  },
  {
    level: 'N1',
    title: 'Kata Sifat Sastrawi',
    context: 'menangkap nuansa dalam teks',
    words: ['著しい', '甚だしい', '乏しい', '好ましい', '望ましい', '紛らわしい', '慌ただしい', '煩わしい', '厳か', '巧み', '露骨', '軽率'],
  },
  {
    level: 'N1',
    title: 'Kata Kerja Formal',
    context: 'menulis dan membaca dokumen resmi',
    words: ['講じる', '要する', '課する', '免れる', '賄う', '促す', '見なす', '要請する', '掲げる', '担う', '被る', '委ねる'],
  },
  {
    level: 'N1',
    title: 'Ungkapan Idiomatik Tubuh',
    context: 'memahami percakapan penutur asli',
    words: ['気を配る', '手を打つ', '目を通す', '腹を立てる', '首を突っ込む', '足を運ぶ', '耳にする', '顔が広い', '口が堅い', '頭が下がる', '肩を持つ', '骨が折れる'],
  },
  {
    level: 'N1',
    title: 'Peribahasa',
    context: 'memahami tulisan dan ceramah',
    words: ['猫の手も借りたい', '石の上にも三年', '急がば回れ', '塵も積もれば山となる', '花より団子', '油を売る', '棚から牡丹餅', '転ばぬ先の杖', '二階から目薬', '虎の巻', '目から鱗', '朝飯前'],
  },
  {
    level: 'N1',
    title: 'Empat Aksara (四字熟語)',
    context: 'membaca tulisan formal dan pidato',
    words: ['一石二鳥', '自業自得', '臨機応変', '意味深長', '一期一会', '起承転結', '十人十色', '不言実行', '本末転倒', '優柔不断', '半信半疑', '悪戦苦闘'],
  },
  {
    level: 'N1',
    title: 'Penghubung Tulisan Formal',
    context: 'menyusun tulisan akademik',
    words: ['したがって', 'ゆえに', 'すなわち', 'ないしは', 'もっとも', 'ひいては', 'いわば', 'あたかも', 'もはや', 'いかに', 'おのずと', 'ひとえに'],
  },
  {
    level: 'N1',
    title: 'Kata Serapan Akademik',
    context: 'membaca jurnal populer',
    words: ['パラダイム', 'アイデンティティ', 'イノベーション', 'ダイバーシティ', 'ガバナンス', 'インフラ', 'ロジック', 'コンテクスト', 'ポテンシャル', 'メカニズム', 'スタンス', 'ジレンマ'],
  },
]

// --------------------------------------------------------------------------
// Tambahan N2 & N1 — tema yang muncul di bacaan panjang dan berita.
// --------------------------------------------------------------------------

const N2_EXTRA: VocabTheme[] = [
  {
    level: 'N2',
    title: 'Kota dan Transportasi',
    context: 'membaca berita perkotaan',
    words: ['都市', '交通', '渋滞', '路線', '運行', '整備', '開発', '過疎', '人口密度', '通勤', '沿線', '再開発'],
  },
  {
    level: 'N2',
    title: 'Pangan dan Pertanian',
    context: 'artikel tentang makanan dan pertanian',
    words: ['農業', '生産者', '収穫', '栽培', '品種', '流通経路', '安全性', '添加物', '自給率', '輸入品', '産地', '旬'],
  },
  {
    level: 'N2',
    title: 'Kesehatan Masyarakat',
    context: 'berita kesehatan dan kebijakan',
    words: ['感染', '予防接種', '衛生', '保健', '医療費', '高齢化', '介護保険', '死亡率', '寿命', '診療', '患者', '看護'],
  },
  {
    level: 'N2',
    title: 'Hukum Sehari-hari',
    context: 'urusan administratif dan aturan',
    words: ['手続き', '申請', '許可', '届出', '義務', '違反', '罰則', '契約書', '有効期限', '証明書', '責任者', '規約'],
  },
]

const N1_EXTRA: VocabTheme[] = [
  {
    level: 'N1',
    title: 'Sejarah dan Peradaban',
    context: 'membaca tulisan sejarah',
    words: ['文明', '時代', '遺跡', '王朝', '興亡', '侵略', '交易', '継承', '衰退', '復興', '史料', '年代'],
  },
  {
    level: 'N1',
    title: 'Bahasa dan Linguistik',
    context: 'tulisan tentang bahasa',
    words: ['語彙', '文法体系', '方言', '語源', '表記法', '音声', '翻訳', '通訳', '母語', '習得', '文脈', '語感'],
  },
  {
    level: 'N1',
    title: 'Data dan Statistik',
    context: 'membaca laporan berangka',
    words: ['統計', '推計', '指標', '偏差', '有意', '相関', '母集団', '抽出', '誤差', '推移', '集計', '推論'],
  },
  {
    level: 'N1',
    title: 'Seni Pertunjukan',
    context: 'ulasan teater, musik, dan film',
    words: ['演出', '脚本', '舞台', '演技', '観客', '批評', '上演', '公演', '構成', '演奏会', '伝統芸能', '創作'],
  },
]

const ALL_THEMES: VocabTheme[] = [...N5, ...N4, ...N3, ...N2, ...N2_EXTRA, ...N1, ...N1_EXTRA]

/**
 * Tema kosakata untuk level yang diminta.
 *
 * Kata yang sudah muncul di tema sebelumnya dibuang — sama alasannya dengan
 * daftar kanji: kartu kembar membuat kurikulum terlihat lebih panjang daripada
 * isinya, dan mengacaukan hitungan cakupan.
 */
export function vocabThemes(levels: string[]): VocabTheme[] {
  const allowed = new Set(levels)
  const seen = new Set<string>()
  const out: VocabTheme[] = []

  for (const theme of ALL_THEMES) {
    if (!allowed.has(theme.level)) continue
    const words = theme.words.filter((w) => {
      if (seen.has(w)) return false
      seen.add(w)
      return true
    })
    if (words.length) out.push({ ...theme, words })
  }
  return out
}

export function totalJapaneseWords(): number {
  return new Set(ALL_THEMES.flatMap((t) => t.words)).size
}
