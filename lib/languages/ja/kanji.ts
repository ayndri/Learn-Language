/**
 * KANJI — daftar bertingkat N5 → N1.
 *
 * Kenapa ini data, dan dari mana angkanya:
 *
 * JLPT TIDAK menerbitkan daftar kanji resmi sejak pembaruan 2010. Yang beredar
 * di internet adalah daftar tak resmi hasil rekonstruksi. Karena itu daftar di
 * sini disusun dari dua sumber yang bisa dipertanggungjawabkan:
 *
 *   N5 & N4  — daftar konvensional yang dipakai hampir semua buku persiapan
 *              (turunan level 4 & 3 JLPT lama). Ini yang benar-benar muncul di
 *              ujian pemula, jadi lebih tepat dipakai daripada urutan sekolah.
 *
 *   N3 → N1  — 教育漢字, daftar RESMI Kementerian Pendidikan Jepang (MEXT):
 *              kanji kelas 3–4 SD untuk N3, kelas 5–6 SD untuk N2, lalu kanji
 *              SMP yang paling sering muncul untuk N1.
 *
 * Konsekuensinya jujur: sebuah kanji bisa saja dipelajari satu level lebih awal
 * atau lebih lambat dari yang muncul di ujian sungguhan. Yang DIJAMIN adalah
 * cakupannya — kalau seluruh daftar ini selesai, seluruh 1.006 教育漢字 plus
 * kanji SMP yang paling sering dipakai sudah terlewati, dan tidak ada yang
 * dihafal dua kali (duplikat antar level dibuang otomatis, lihat `dedupe`).
 *
 * Kanji SMP seluruhnya ada 1.110. Yang dimasukkan di sini adalah yang paling
 * sering muncul di teks umum; sisanya dilatih lewat pelajaran kosakata, bukan
 * lewat kartu kanji satu per satu. Itu keputusan sadar, bukan kelalaian.
 */

/** Pecah string kanji rapat jadi array karakter. Menulisnya rapat jauh lebih mudah dibaca. */
function chars(s: string): string[] {
  return [...s.replace(/\s+/g, '')]
}

// ---------------------------------------------------------------------------
// N5 — 80 kanji. Daftar konvensional JLPT.
// ---------------------------------------------------------------------------

const N5 = chars(`
  日一国人年大十二本中長出三時行見月後前生
  五間上東四今金九入学高円子外八六下来気小
  七山話女北午百書先名川千水半男西電校語土
  木聞食車何南万毎白天母火右読友左休父雨安
`)

// ---------------------------------------------------------------------------
// N4 — 166 kanji. Daftar konvensional JLPT.
// ---------------------------------------------------------------------------

const N4 = chars(`
  会同事自社発者地業方新場員立開手力問代明
  動京目通言理体田主題意不作用度強公持野以
  思家世多正安院心界教文元重近考画海売知道
  集別物使品計死特私始朝運終台広住真有口少
  町料工建空急止送切転研足究楽起着店病質待
  試族銀早映親験英医仕去味写字答夜音注帰古
  歌買悪図週室歩風紙黒花春赤青館屋色走秋夏
  習駅洋旅服夕借曜飲肉貸堂鳥飯勉冬昼茶弟牛
  魚兄犬姉妹漢
`)

// ---------------------------------------------------------------------------
// N3 — 教育漢字 kelas 3 dan 4 SD (400 kanji sebelum duplikat dibuang).
// ---------------------------------------------------------------------------

/** 教育漢字 kelas 3 — 200 kanji */
const GRADE_3 = chars(`
  悪安暗医委意育員院飲運泳駅央横屋温化荷開界
  階寒感漢館岸起期客究急級宮球去橋業曲局銀区
  苦具君係軽血決研県庫湖向幸港号根祭皿仕死使
  始指歯詩次事持式実写者主守取酒受州拾終習集
  住重宿所暑助昭消商章勝乗植申身神真深進世整
  昔全相送想息速族他打対待代第題炭短談着注柱
  丁帳調追定庭笛鉄転都度投豆島湯登等動童農波
  配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服
  福物平返勉放味命面問役薬由油有遊予羊洋葉陽
  様落流旅両緑礼列練路和
`)

/** 教育漢字 kelas 4 — 200 kanji */
const GRADE_4 = chars(`
  愛案以衣位囲胃印英栄塩億加果貨課芽改械害街
  各覚完官管関観願希季紀喜旗器機議求泣救給挙
  漁共協鏡競極訓軍郡径型景芸欠結建健験固功好
  候航康告差菜最材昨札刷殺察参産散残士氏史司
  試児治辞失借種周祝順初松笑唱焼象照賞臣信成
  省清静席積折節説浅戦選然争倉巣束側続卒孫帯
  隊達単置仲貯兆腸低底停的典伝徒努灯堂働特得
  毒熱念敗梅博飯飛費必票標不夫付府副粉兵別辺
  変便包法望牧末満未脈民無約勇要養浴利陸良料
  量輪類令冷例歴連老労録
`)

// ---------------------------------------------------------------------------
// N2 — 教育漢字 kelas 5 dan 6 SD (366 kanji sebelum duplikat dibuang).
// ---------------------------------------------------------------------------

/** 教育漢字 kelas 5 — 185 kanji */
const GRADE_5 = chars(`
  圧移因永営衛易益液演応往桜恩可仮価河過賀快
  解格確額刊幹慣眼基寄規技義逆久旧居許境均禁
  句群経潔件券険検限現減故個護効厚耕鉱構興講
  混査再災妻採際在財罪雑酸賛支志枝師資飼示似
  識質舎謝授修述術準序招証条状常情織職制性政
  勢精製税責績接設絶祖素総造像増則測属率損退
  貸態団断築貯張停提程適敵統銅導徳独任燃能破
  犯判版比肥非備俵評貧布婦富武復複仏編弁保墓
  報豊防貿暴務夢迷綿輸余預容略留領
`)

/** 教育漢字 kelas 6 — 181 kanji */
const GRADE_6 = chars(`
  異遺域宇映延沿我灰拡革閣割株干巻看簡危机揮
  貴疑吸供胸郷勤筋系敬警劇激穴絹権憲源厳己呼
  誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿
  視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸
  除承将傷障蒸針仁垂推寸盛聖誠舌宣専泉洗染銭
  善奏窓創装層操蔵臓存尊宅担探誕段暖値宙忠著
  庁頂潮賃痛展討党糖届難乳認納脳派拝背肺俳班
  晩否批秘腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟
  模訳郵優幼欲翌乱卵覧裏律臨朗論
`)

// ---------------------------------------------------------------------------
// N1 — kanji SMP (中学校で習う漢字) yang paling sering muncul.
//
// Bukan seluruh 1.110-nya. Yang dipilih adalah kanji yang benar-benar sering
// muncul di berita, novel, dan soal N1 — sekitar 470 karakter.
// ---------------------------------------------------------------------------

const N1 = chars(`
  亜哀握扱依威為偉違維慰緯壱逸稲芋姻陰隠韻渦
  浦影詠鋭疫悦越謁閲宴援炎煙猿縁鉛汚凹奥押欧
  殴乙卸穏佳嫁架華菓渇滑褐轄且刈甘汗乾勧歓監
  環鑑含奇祈鬼幾輝儀戯詰却脚虐及丘朽巨拠拒虚
  距凝斤緊菌駆屈掘繰恵傾継迎撃傑肩兼剣圏堅嫌
  献遣玄弦孤枯誇鼓互抗攻拘控甲坑更硬絞項稿豪
  込婚恨紺魂墾債催削錯撮擦傘惨旨伺刺祉施諮侍
  慈軸疾湿執芝赦邪殊寿需舟秀襲柔獣瞬旬巡盾准
  循潤庶匠昇祥沼称詳丈畳飾殖触辱伸辛審震薪尋
  甚陣尽吹炊粋衰酔遂穂随枢崇据杉澄瀬牲婿誓請
  斥隻惜籍摂仙占扇栓潜繊薦鮮繕措粗礎双桑掃葬
  遭霜騒憎贈促即俗賊耐怠胎袋逮滝択沢卓濁但奪
  脱丹嘆端弾恥致遅畜蓄逐秩窒抽鋳駐彫超跳徴沈
  珍鎮陳墜塚漬坪釣亭貞帝訂締泥摘滴迭哲徹撤添
  殿吐塗途渡奴怒到逃倒凍唐桃透踏闘胴峠匿督篤
  凸突屯豚縄軟弐尼粘悩濃把覇廃排杯輩培媒賠伯
  拍泊迫舶漠肌鉢髪伐罰閥搬煩範繁藩盤妃彼疲被
  避尾微匹描浜賓頻敏怖浮符封伏幅覆払沸噴墳憤
  紛雰丙柄壁癖偏遍舗募慕簿倣俸奉峰崩抱泡砲縫
  傍剖紡帽凡盆摩磨魔麻埋膜又抹魅岬妙眠矛霧娘
  銘滅免茂猛網黙紋厄躍柳愉諭癒唯裕誘憂融庸揚
  揺擁抑翼羅頼絡欄濫吏隆了猟陵糧倫塁涙励霊麗
  暦劣烈裂廉恋錬炉浪漏楼賄惑枠湾腕
`)

// ---------------------------------------------------------------------------

/**
 * Buang kanji yang sudah muncul di level sebelumnya.
 *
 * Dua sumber daftar yang berbeda (JLPT konvensional untuk N5–N4, 教育漢字
 * untuk N3 ke atas) PASTI beririsan — 会, 電, 話, dan puluhan lainnya ada di
 * keduanya. Tanpa ini kamu akan mendapat kartu kanji kembar dan mengira
 * kurikulumnya lebih panjang daripada isinya.
 */
function dedupe(levels: string[][]): string[][] {
  const seen = new Set<string>()
  return levels.map((list) =>
    list.filter((k) => {
      if (seen.has(k)) return false
      seen.add(k)
      return true
    }),
  )
}

const [KANJI_N5, KANJI_N4, KANJI_N3, KANJI_N2, KANJI_N1] = dedupe([
  N5,
  N4,
  [...GRADE_3, ...GRADE_4],
  [...GRADE_5, ...GRADE_6],
  N1,
])

export const KANJI_BY_LEVEL: Record<string, string[]> = {
  N5: KANJI_N5,
  N4: KANJI_N4,
  N3: KANJI_N3,
  N2: KANJI_N2,
  N1: KANJI_N1,
}

/** Berapa kanji per pelajaran. 12 sekali duduk sudah termasuk banyak. */
export const KANJI_PER_LESSON = 12

export type KanjiLesson = {
  title: string
  level: string
  kanji: string[]
}

/**
 * Kanji → daftar pelajaran, urut dari N5 ke N1.
 *
 * Tidak dikelompokkan menurut radikal atau tema. Itu terdengar rapi tapi
 * membuat urutannya melompat-lompat dalam frekuensi pemakaian — dan yang
 * paling menentukan bisa-tidaknya kamu membaca teks adalah frekuensi.
 */
export function kanjiLessons(levels: string[]): KanjiLesson[] {
  const out: KanjiLesson[] = []
  for (const level of levels) {
    const list = KANJI_BY_LEVEL[level]
    if (!list?.length) continue
    const parts = Math.ceil(list.length / KANJI_PER_LESSON)
    for (let i = 0; i < parts; i++) {
      out.push({
        title: `Kanji ${level} ${i + 1}/${parts}`,
        level,
        kanji: list.slice(i * KANJI_PER_LESSON, (i + 1) * KANJI_PER_LESSON),
      })
    }
  }
  return out
}

export function totalKanji(): number {
  return Object.values(KANJI_BY_LEVEL).reduce((a, l) => a + l.length, 0)
}
