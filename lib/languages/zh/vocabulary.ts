import type { VocabTheme } from '@/lib/languages/vocab-theme'

/**
 * KOSAKATA INTI MANDARIN — HSK 1 → HSK 6, per tema.
 *
 * Batasannya jujur, sama seperti Jepang dan Korea: ini bukan "semua kata yang
 * keluar di HSK". HSK 1 butuh 150 kata dan HSK 6 butuh 5.000 — daftar resminya
 * memang diterbitkan, tapi menuliskan 5.000 kata di sini akan menghasilkan file
 * yang tidak bisa dibaca sebagai daftar lagi, dan itu justru merusak satu-satunya
 * alasan menulisnya sebagai data.
 *
 * Yang ada di sini kosakata INTI — kata yang paling sering dipakai di tiap
 * tingkat, disusun per tema supaya bisa diperiksa mana yang belum ada. Sisanya
 * masuk lewat pelajaran hanzi (bahan mentahnya) dan lewat contoh kalimat di
 * pelajaran tata bahasa.
 *
 * Kata ditulis dengan hanzi sederhana apa adanya, TANPA pinyin. Pinyin-nya
 * dihasilkan di kartu (lihat field `pinyin` pada template kosakata bahasa
 * Mandarin), bukan ditulis dua kali di sini — kalau ditulis dua kali, suatu saat
 * yang satu akan berbeda dari yang lain dan tidak ada yang tahu mana yang benar.
 *
 * Kata kerja dan kata sifat ditulis apa adanya karena bahasa Mandarin tidak
 * berkonjugasi: 吃 tetap 吃 untuk siapa pun dan kapan pun. Justru karena itu
 * yang WAJIB ikut di kartunya adalah 量词 untuk kata benda (一本书 bukan 一个书)
 * dan pasangan kata yang lazim — dua hal yang tidak terlihat dari kata itu
 * sendirian.
 */

const H1: VocabTheme[] = [
  { level: 'HSK1', title: 'Salam dan Sapaan', context: 'menyapa dan berpamitan', words: ['你好', '您好', '再见', '谢谢', '不客气', '对不起', '没关系', '请', '是', '不', '喂', '早上好'] },
  { level: 'HSK1', title: 'Kata Ganti dan Penunjuk', context: 'menyebut siapa dan yang mana', words: ['我', '你', '他', '她', '我们', '这', '那', '哪', '谁', '什么', '几', '多少'] },
  { level: 'HSK1', title: 'Angka dan Uang', context: 'menyebut jumlah dan harga', words: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '块', '钱'] },
  { level: 'HSK1', title: 'Waktu', context: 'menyebut kapan', words: ['今天', '明天', '昨天', '上午', '中午', '下午', '现在', '点', '分钟', '星期', '月', '年'] },
  { level: 'HSK1', title: 'Keluarga', context: 'memperkenalkan keluarga', words: ['家', '爸爸', '妈妈', '儿子', '女儿', '朋友', '同学', '老师', '医生', '学生', '先生', '小姐'] },
  { level: 'HSK1', title: 'Makan dan Minum', context: 'makan sehari-hari', words: ['吃', '喝', '米饭', '菜', '水果', '苹果', '茶', '水', '杯子', '饭馆', '热', '好吃'] },
  { level: 'HSK1', title: 'Di Rumah', context: 'menyebut benda di sekitar', words: ['桌子', '椅子', '电视', '电脑', '书', '衣服', '东西', '前面', '后面', '里', '上', '下'] },
  { level: 'HSK1', title: 'Bepergian', context: 'pergi ke suatu tempat', words: ['去', '来', '回', '坐', '出租车', '飞机', '火车站', '医院', '商店', '学校', '北京', '中国'] },
  { level: 'HSK1', title: 'Kata Kerja Harian', context: 'kegiatan sehari-hari', words: ['做', '看', '听', '说', '读', '写', '买', '住', '睡觉', '工作', '学习', '打电话'] },
  { level: 'HSK1', title: 'Sifat dan Perasaan', context: 'menggambarkan keadaan', words: ['大', '小', '多', '少', '好', '冷', '热', '高兴', '漂亮', '喜欢', '想', '会'] },
]

const H2: VocabTheme[] = [
  { level: 'HSK2', title: 'Anggota Keluarga Lanjutan', context: 'menyebut kerabat dengan tepat', words: ['哥哥', '姐姐', '弟弟', '妹妹', '丈夫', '妻子', '孩子', '男', '女', '大家', '别人', '每'] },
  { level: 'HSK2', title: 'Warna dan Bentuk', context: 'menggambarkan barang', words: ['白', '黑', '红', '颜色', '长', '高', '快', '慢', '新', '贵', '便宜', '一样'] },
  { level: 'HSK2', title: 'Tubuh dan Sakit', context: 'ke dokter', words: ['身体', '眼睛', '手', '生病', '药', '休息', '累', '疼', '感冒', '发烧', '看病', '健康'] },
  { level: 'HSK2', title: 'Cuaca dan Musim', context: 'basa-basi cuaca', words: ['天气', '晴', '阴', '下雨', '雪', '风', '冷', '热', '春天', '夏天', '秋天', '冬天'] },
  { level: 'HSK2', title: 'Makanan dan Minuman', context: 'memesan makan', words: ['鸡蛋', '羊肉', '牛奶', '咖啡', '面条', '西瓜', '鱼', '菜单', '服务员', '好吃', '饿', '渴'] },
  { level: 'HSK2', title: 'Sekolah dan Ujian', context: 'kegiatan belajar', words: ['教室', '课', '考试', '题', '铅笔', '汉语', '意思', '问题', '介绍', '开始', '懂', '会'] },
  { level: 'HSK2', title: 'Transportasi', context: 'naik apa ke mana', words: ['公共汽车', '自行车', '机场', '路', '离', '到', '从', '往', '走', '跑步', '进', '出'] },
  { level: 'HSK2', title: 'Waktu Lanjutan', context: 'menyebut waktu lebih tepat', words: ['时间', '小时', '早上', '晚上', '去年', '生日', '第一', '已经', '正在', '还', '就', '最'] },
  { level: 'HSK2', title: 'Olahraga dan Hiburan', context: 'waktu luang', words: ['运动', '游泳', '踢足球', '打篮球', '唱歌', '跳舞', '旅游', '玩', '快乐', '有意思', '一起', '好玩'] },
  { level: 'HSK2', title: 'Kantor dan Uang', context: 'urusan kerja', words: ['公司', '上班', '票', '房间', '宾馆', '帮助', '送', '找', '给', '穿', '洗', '准备'] },
  { level: 'HSK2', title: 'Kata Bantu dan Penghubung', context: 'merangkai kalimat', words: ['因为', '所以', '虽然', '但是', '和', '还是', '或者', '也', '都', '很', '太', '非常'] },
]

const H3: VocabTheme[] = [
  { level: 'HSK3', title: 'Perasaan', context: 'menyampaikan suasana hati', words: ['高兴', '难过', '担心', '着急', '生气', '害怕', '放心', '奇怪', '有趣', '无聊', '满意', '感动'] },
  { level: 'HSK3', title: 'Sifat Orang', context: 'menggambarkan kepribadian', words: ['聪明', '认真', '努力', '安静', '热情', '客气', '简单', '复杂', '一般', '特别', '当然', '其实'] },
  { level: 'HSK3', title: 'Rumah dan Perabot', context: 'menata tempat tinggal', words: ['厨房', '厕所', '客厅', '冰箱', '空调', '灯', '筷子', '碗', '盘子', '被子', '搬', '打扫'] },
  { level: 'HSK3', title: 'Kota dan Tempat', context: 'menyebut lokasi', words: ['银行', '邮局', '超市', '图书馆', '公园', '饭店', '楼', '街道', '地图', '地铁', '附近', '中间'] },
  { level: 'HSK3', title: 'Belanja dan Bayar', context: 'transaksi sehari-hari', words: ['花', '用', '还', '借', '换', '带', '拿', '放', '选择', '需要', '便宜', '一共'] },
  { level: 'HSK3', title: 'Kesehatan dan Kebiasaan', context: 'menjaga tubuh', words: ['锻炼', '习惯', '注意', '刷牙', '洗澡', '睡觉', '起床', '迟到', '按时', '刚才', '一直', '经常'] },
  { level: 'HSK3', title: 'Sekolah Lanjutan', context: 'urusan akademik', words: ['成绩', '努力', '复习', '练习', '检查', '解决', '回答', '文化', '历史', '数学', '词典', '故事'] },
  { level: 'HSK3', title: 'Alam dan Hewan', context: 'menggambarkan pemandangan', words: ['太阳', '月亮', '天空', '山', '河', '花', '树', '草', '鸟', '熊猫', '马', '狮子'] },
  { level: 'HSK3', title: 'Perjalanan', context: 'liburan dan wisata', words: ['旅行', '行李', '护照', '照片', '照相机', '地方', '风景', '出发', '到达', '接', '送', '迷路'] },
  { level: 'HSK3', title: 'Komunikasi', context: 'menghubungi orang', words: ['电子邮件', '手机', '声音', '告诉', '通知', '关系', '同意', '相信', '像', '决定', '认为', '联系'] },
  { level: 'HSK3', title: 'Ukuran dan Perbandingan', context: 'menyampaikan derajat', words: ['比较', '更', '最', '越来越', '差不多', '几乎', '大概', '至少', '一点儿', '有点儿', '多么', '这么'] },
  { level: 'HSK3', title: 'Kata Bantu Bilangan', context: 'menghitung benda dengan benar', words: ['个', '本', '张', '件', '只', '条', '把', '双', '辆', '杯', '瓶', '次'] },
]

const H4: VocabTheme[] = [
  { level: 'HSK4', title: 'Pendapat dan Diskusi', context: 'menyampaikan pandangan', words: ['意见', '看法', '理由', '证明', '判断', '反对', '支持', '讨论', '解释', '强调', '怀疑', '肯定'] },
  { level: 'HSK4', title: 'Masyarakat', context: 'membaca berita ringan', words: ['社会', '文化', '传统', '人口', '国际', '国籍', '政府', '法律', '规定', '现象', '影响', '变化'] },
  { level: 'HSK4', title: 'Kerja dan Karier', context: 'dunia kerja', words: ['职业', '经验', '能力', '任务', '负责', '加班', '收入', '工资', '面试', '招聘', '合同', '成功'] },
  { level: 'HSK4', title: 'Ekonomi Sehari-hari', context: 'urusan uang', words: ['经济', '价格', '市场', '消费', '存', '省', '亏', '赚', '税', '账户', '汇率', '预算'] },
  { level: 'HSK4', title: 'Teknologi', context: 'memakai gawai dan internet', words: ['网络', '密码', '短信', '浏览', '下载', '打印', '复印', '手术', '技术', '数字', '功能', '按'] },
  { level: 'HSK4', title: 'Pendidikan', context: 'membicarakan studi', words: ['教育', '专业', '学历', '研究', '毕业', '报名', '奖金', '论文', '知识', '进步', '严格', '基础'] },
  { level: 'HSK4', title: 'Perasaan Mendalam', context: 'tulisan reflektif', words: ['感情', '感觉', '后悔', '羡慕', '尊敬', '误会', '原谅', '安慰', '鼓励', '失望', '幸福', '孤单'] },
  { level: 'HSK4', title: 'Sifat Abstrak', context: 'menilai dengan tepat', words: ['重要', '普遍', '具体', '主要', '正式', '直接', '合适', '准确', '严重', '积极', '消极', '成熟'] },
  { level: 'HSK4', title: 'Kata Kerja Abstrak', context: 'menulis lebih formal', words: ['包括', '增加', '减少', '提供', '保护', '发展', '实现', '完成', '继续', '避免', '适应', '改变'] },
  { level: 'HSK4', title: 'Lingkungan dan Kesehatan', context: 'isu sehari-hari', words: ['环境', '污染', '垃圾', '资源', '节约', '空气', '安全', '危险', '保护', '预防', '治疗', '心理'] },
  { level: 'HSK4', title: 'Penghubung Wacana', context: 'menyusun paragraf', words: ['而且', '不但', '另外', '于是', '因此', '然而', '既然', '尽管', '无论', '总之', '否则', '甚至'] },
  { level: 'HSK4', title: 'Ungkapan Waktu Formal', context: 'menyusun urutan kejadian', words: ['当时', '同时', '之前', '之后', '最初', '后来', '将来', '目前', '逐渐', '突然', '偶尔', '始终'] },
]

const H5: VocabTheme[] = [
  { level: 'HSK5', title: 'Pemikiran Abstrak', context: 'esai dan opini', words: ['观念', '思想', '价值', '意义', '本质', '现实', '理论', '逻辑', '矛盾', '前提', '结论', '角度'] },
  { level: 'HSK5', title: 'Analisis dan Data', context: 'membaca laporan', words: ['统计', '比例', '平均', '数据', '调查', '分析', '结果', '趋势', '增长', '下降', '占', '显示'] },
  { level: 'HSK5', title: 'Media dan Opini Publik', context: 'membaca kolom', words: ['媒体', '报道', '新闻', '舆论', '广告', '宣传', '批评', '指出', '争论', '反应', '公开', '揭露'] },
  { level: 'HSK5', title: 'Sains dan Kesehatan', context: 'artikel ilmiah populer', words: ['实验', '研究', '发现', '证据', '细胞', '基因', '免疫', '感染', '副作用', '效果', '治愈', '康复'] },
  { level: 'HSK5', title: 'Politik dan Hukum', context: 'berita politik', words: ['制度', '政策', '权利', '义务', '选举', '法院', '违法', '处罚', '改革', '监督', '公平', '腐败'] },
  { level: 'HSK5', title: 'Bisnis dan Industri', context: 'berita bisnis', words: ['企业', '产业', '市场', '竞争', '合作', '投资', '成本', '利润', '生产', '销售', '品牌', '出口'] },
  { level: 'HSK5', title: 'Seni dan Sastra', context: 'ulasan seni', words: ['作品', '创作', '风格', '描写', '象征', '比喻', '情节', '主题', '欣赏', '表演', '经典', '灵感'] },
  { level: 'HSK5', title: 'Kata Kerja Tulisan', context: 'dokumen dan laporan', words: ['实施', '推动', '制定', '促进', '造成', '导致', '构成', '维持', '取得', '缺乏', '具备', '涉及'] },
  { level: 'HSK5', title: 'Kata Sifat Tulisan', context: 'penilaian dalam tulisan', words: ['明显', '巨大', '严肃', '独特', '客观', '主观', '广泛', '持续', '激烈', '微妙', '必然', '罕见'] },
  { level: 'HSK5', title: 'Chengyu yang Lazim', context: 'membuat tulisan lebih padat', words: ['一举两得', '实事求是', '半途而废', '不可思议', '理所当然', '不知不觉', '千方百计', '毫无疑问', '与日俱增', '相辅相成', '独一无二', '难能可贵'] },
]

const H6: VocabTheme[] = [
  { level: 'HSK6', title: 'Sejarah dan Peradaban', context: 'tulisan sejarah', words: ['文明', '朝代', '遗址', '继承', '侵略', '贸易', '衰落', '复兴', '史料', '变迁', '遗产', '考古'] },
  { level: 'HSK6', title: 'Bahasa dan Linguistik', context: 'tulisan tentang bahasa', words: ['词汇', '语法', '方言', '词源', '拼写', '音节', '翻译', '母语', '习得', '语境', '语气', '口音'] },
  { level: 'HSK6', title: 'Filsafat dan Etika', context: 'esai reflektif', words: ['伦理', '道德', '真理', '信念', '抽象', '普遍', '必然', '偶然', '自由', '责任', '善恶', '境界'] },
  { level: 'HSK6', title: 'Kata Bernuansa Kuat', context: 'tulisan yang bertenaga', words: ['显著', '微弱', '庞大', '缜密', '含糊', '激烈', '坚固', '灵活', '脆弱', '扭曲', '凸显', '不可避免'] },
  { level: 'HSK6', title: 'Penghubung Formal', context: 'menyusun tulisan akademik', words: ['因而', '从而', '进而', '固然', '诚然', '反之', '此外', '鉴于', '综上所述', '换言之', '一方面', '与此同时'] },
  { level: 'HSK6', title: 'Chengyu Tingkat Lanjut', context: 'membaca kolom dan pidato', words: ['不言而喻', '举世闻名', '举足轻重', '层出不穷', '根深蒂固', '循序渐进', '因地制宜', '潜移默化', '望而生畏', '一如既往', '不遗余力', '锦上添花'] },
  { level: 'HSK6', title: 'Peribahasa dan Ungkapan Rakyat', context: 'memahami percakapan dan tulisan populer', words: ['入乡随俗', '骑虎难下', '拔苗助长', '守口如瓶', '得寸进尺', '事半功倍', '亡羊补牢', '半斤八两', '雪上加霜', '打草惊蛇', '张冠李戴', '对症下药'] },
]

export const ZH_VOCAB_THEMES: VocabTheme[] = [...H1, ...H2, ...H3, ...H4, ...H5, ...H6]
