/**
 * HANZI — daftar bertingkat HSK 1 → HSK 6.
 *
 * Kenapa ini data, dan dari mana daftarnya:
 *
 * HSK menerbitkan daftar KOSAKATA resmi (150 kata di HSK 1, 5.000 kata sampai
 * HSK 6), bukan daftar karakter. Daftar karakter yang beredar adalah hasil
 * penurunan dari daftar kosakata itu — dan itu juga yang dilakukan di sini:
 * karakter di tiap level adalah karakter yang muncul di kosakata level tersebut.
 *
 * Konsekuensinya jujur, sama seperti pada kanji Jepang: sebuah karakter bisa
 * saja dipelajari satu level lebih awal atau lebih lambat dari urutan di buku
 * tertentu. Yang DIJAMIN adalah cakupannya (±2.700 karakter, kurang lebih
 * sebanyak 2.663 karakter HSK 6), bukan penempatan tiap karakternya.
 *
 * Dan satu hal yang harus dinyatakan terus terang: pembagian antara HSK 5 dan
 * HSK 6 adalah bagian daftar ini yang paling TIDAK bisa dipertanggungjawabkan.
 * HSK 1–4 masih bisa diturunkan dari daftar kosakatanya dengan cukup yakin;
 * di dua tingkat teratas, yang tersisa adalah beberapa ribu karakter yang
 * frekuensinya sudah sama-sama rendah, dan urutan mana yang "HSK 5" dan mana
 * yang "HSK 6" berbeda-beda antar buku. Praktisnya itu tidak merugikan: pada
 * tingkat itu kamu sudah membaca kata, bukan lagi mengeja karakter, dan kedua
 * daftar toh dilewati semuanya kalau jalurnya diselesaikan.
 *
 * Yang ditulis di sini bentuk SEDERHANA (简体字) — yang dipakai di Tiongkok
 * daratan, Singapura, dan seluruh ujian HSK. Bentuk tradisionalnya tidak ditulis
 * di daftar ini melainkan ikut di kartunya (lihat field `traditional` pada jenis
 * item `hanzi`), karena yang berguna adalah tahu bahwa 学 pernah ditulis 學 —
 * bukan menghafal dua daftar sekaligus.
 *
 * PENTING: karakter TIDAK sama dengan kata. 电 dan 话 masing-masing satu
 * karakter; 电话 (telepon) adalah kata. Kartu karakter melatih bahan mentahnya —
 * arti inti, bacaan, dan contoh kata; menyusunnya jadi kosakata dilatih di
 * jalur kosakata. Itu sebabnya keduanya jalur terpisah, bukan satu.
 */

/** Pecah string karakter rapat jadi array. Menulisnya rapat jauh lebih mudah dibaca. */
function chars(s: string): string[] {
  return [...s.replace(/\s+/g, '')]
}

// ---------------------------------------------------------------------------
// HSK 1 — karakter dari 150 kata daftar HSK 1.
// ---------------------------------------------------------------------------

const HSK1 = chars(`
  爱八爸杯子北京本不客气菜茶吃出租车打电话大的
  点脑视东西都读对起多少儿二饭馆飞机分钟高兴个
  工作狗汉语好号喝和很后面回会火站几家叫今天九
  开看见块来老师了冷里六妈吗买猫没关系有米名字
  明哪那呢能你年女朋友漂亮苹果七前钱请去热人认
  识三商上午谁什十时候是书水睡觉说四岁他太听同
  学喂我五喜欢下雨先生现在想小姐些写谢星期校一
  衣医院椅月再这中住桌昨坐做
`)

// ---------------------------------------------------------------------------
// HSK 2 — karakter baru dari 150 kata tambahan di HSK 2.
// ---------------------------------------------------------------------------

const HSK2 = chars(`
  吧白百帮助报纸比别宾长唱歌穿次从错篮球到得等
  弟第懂房间非常服务员告诉哥给公共汽斤司贵过还
  孩黑红场鸡蛋件教室姐介绍进近就咖啡始考试可课
  快乐累离两零路旅游卖慢忙每妹门条男您牛奶旁边
  跑步便宜票妻床千铅晴让日班身体病声音事情表送
  虽然但它踢足题跳舞外完玩晚往为问希洗笑新姓休
  息雪颜色羊肉药要也已经意思因阴泳右鱼远运早丈
  找着真正知道准备走最左
`)

// ---------------------------------------------------------------------------
// HSK 3 — karakter baru dari 300 kata tambahan di HSK 3.
// ---------------------------------------------------------------------------

const HSK3 = chars(`
  阿姨矮安静搬办法包饱抱方被鼻较赛必须变化冰箱
  单参加草层差城市成绩迟带担糕当灯低铁定季冬短
  段锻炼耳朵烧放干净敢冒刚钢够故顾挂刮惯广播国
  程害怕河板护照花环境换黄答婚礼活或者极级乎记
  检查简健康讲交通角脚育接结束解决借济理精神久
  酒旧举例句拒绝聚渴刻厅肯空调苦裤款筷蓝虎物历
  史脸练凉辆聊邻居留楼绿满帽拿耐难南内力努爬盘
  胖啤瓶葡萄普通其实奇怪骑气球万清楚况秋取全容
  易如散伞扫嗓森沙网稍失望狮湿实世纪适应收拾首
  瘦叔树数刷双平顺态谈糖躺讨厌特疼提甜填腿脱袜
  碗忘险卫围夏香相像心闻信李兴趣熊修需许爷业镜
  阳养求钥匙叶般以艺术银应影永勇油友谊邮局戏元
  愿越亮阅云允杂志掌片急整常确挣枝植只值指重周
  主注祝贺抓专转赚仔细总结租嘴座位
`)

// ---------------------------------------------------------------------------
// HSK 4 — karakter baru dari 600 kata tambahan di HSK 4.
//
// Di sinilah karakter yang membentuk kosakata abstrak mulai masuk: 律, 議, 際,
// 質, 標 dan kawan-kawannya. Sampai HSK 3 kamu belajar karakter untuk benda dan
// kegiatan; dari HSK 4 kamu belajar karakter untuk gagasan.
// ---------------------------------------------------------------------------

const HSK4 = chars(`
  按爱护安排暗傲百般包括保护抱歉倍被子笨比如毕
  竟标准表达表格表示表演饼博物馆不管不仅部分擦
  猜材才财采参观餐厅厕所差不多产品尝长城长江常
  识超市成功成为诚实吃惊迟到充满重复抽烟出差出
  发出生出现厨房传真窗户词典从来粗糙醋存打扮打
  扰大概大使馆大约大夫代表代替戴单位当然导游倒
  到底道歉得意登等待地点地球地址调查掉丢动作堵
  独立肚子度短信对比对待对话对面对象吨顿多亏躲
  额恶儿童而且发生发展法律翻译烦恼反对反应方便
  方法方面方向房东放弃放暑假放松份丰富风景风俗
  否则符合付款复印复杂父亲富负责改变干杯赶敢感
  激感觉感情感谢刚才钢琴高档格外各估计故意刮胡
  子挂号关键观众管理光冠军规定规律国籍国际果汁
  过程海关海洋害羞寒假汗航班好处好像号码合格合
  适何况和平河流恨猴厚后悔忽然壶互相护士怀疑回
  忆汇率婚姻活泼火柴伙伴或许基础激动积累即将及
  时急忙寄计划记者纪律技术既然继续加班加油站家
  具假如价格坚持减肥剪建议将来奖金交流交换郊区
  骄傲角度饺子教材教练教授接触接待节约结果结婚
  结帐解释尽管紧张进步进行禁止京剧精彩经常经济
  经历经验警察竞争竟然镜子究竟九九巨大具体距离
  聚会俱乐部决赛绝对角色军均卡开心开玩笑看法考
  虑烤肯定空气空闲恐怕控制苦口味夸库存快递宽困
  难扩大垃圾拉辣浪费老虎老实劳驾乐观雷类型冷静
  离婚理发理解理论理想力气历来立刻粮联系凉快聊
  天了解列临时零食浏览流利流行乱律绿论落骂麦满
  足毛巾矛盾眉媒煤没什么美丽魅迷路密码免费秒民
  族明确名牌命令摩托模仿模糊末陌生某母亲目标目
  的耐心难道难受内容能力年代年龄宁愿农村弄努力
  暖偶尔拍排队派盼判断陪培养赔佩配批评脾气皮肤
  篇骗片面漂亮乒乓平衡平静平均评价凭破坡普遍普
  通话期待期间其次其余奇迹企业启齐骑气候气氛谦
  虚签证前途浅强调墙抢桥巧妙亲爱亲切勤奋轻松清
  楚情景请假求穷区区别取消趣全部权确认群然而燃
  绕热闹人才人口人民人生任何任务扔仍然日程仍容
  易如何入软弱洒散乱嗓子扫墓森林沙漠沙滩闪伤商
  量稍微舌绍设备社会射摄影伸身份深申请甚至升生
  产生动生活生命省失眠失望诗湿师傅十分实际实力
  食物使用世纪市场事实试卷收获收入手术手续受不
  了受到售寿舒适输熟悉数量数字帅摔双方税顺便顺
  利说明思考私人撕死似乎宿舍随便随时碎所有锁台
  太阳态度谈判躺趟烫讨论逃桃套特点特色疼痛提供
  提前提醒题目体会体现填空条件挑跳舞停止通过通
  知同情同时统统推推迟退退休脱土豆吐团突然图案
  途徒推荐晚会万一王完美完全玩具网络危险威胁维
  修伟大味道位置温度温柔文件文具文明文章闻问候
  卧室握无论无所谓武术舞台勿误物质雾吸取吸引希
  望习惯洗衣机戏剧系统细节夏令营先后咸显然现金
  羡慕相处相当相反相关相信详细享受响想念项目消
  息小吃小气效果笑话辛苦欣赏信封信号信任行动行
  为形成形容幸福性别性格兄弟胸修改休闲需求许可
  宣传选择学期学历学问寻找询问严格严肃研究盐眼
  光演出演讲阳台养成样式邀请要不要求钥匙也许业
  务叶子夜页一切一致衣架依然遗憾以及以来艺术议
  论义意外意义因此银河引起印刷英俊营业影子应付
  硬勇气用功优点优秀幽默由于邮局犹豫游览友好有
  趣于是娱乐与其愉快语言语法预报预防原来原谅原
  因愿望约会阅读钥云允许运气运输灾杂志咱们暂时
  赞成脏造成责任增加窄摘展开占战争长辈掌握账户
  招待着火着凉照常照片哲整个正常正好正确正式证
  明政府挣支持支票知识直接直到值得指导指挥至今
  至于志愿制造质量治疗秩序中介中旬钟表种类重量
  周到周末逐渐主动主观主人主席主张煮注册祝福抓
  紧专门专业转变赚钱撞准确准时着装资格资金资料
  紫仔细自动自豪自觉自然自私自信字幕总裁总结总
  之组成组织最好最初尊敬遵守作家作用作者座位做
  梦
`)

// ---------------------------------------------------------------------------
// HSK 5 — karakter umum yang belum lewat di HSK 1–4.
//
// Daftar terpanjang, dan itu memang bentuknya: setelah HSK 4, yang tersisa
// adalah seluruh sisa karakter yang masih lazim dipakai. Dipisah dari HSK 6
// menurut frekuensi pemakaian, bukan menurut daftar resmi — lihat catatan
// di kepala file soal pembagian dua tingkat teratas ini.
// ---------------------------------------------------------------------------

const HSK5 = chars(`
  哀唉癌矮碍爱昂熬傲奥巴拔霸摆败拜斑板伴瓣绑榜
  傍磅包薄宝饱抱豹爆卑悲背贝倍逼鼻币闭壁避臂弊
  蔽辩辨遍辫标彪
  编便辫标彪表憋别宾冰兵柄病拨波剥博搏膊补捕布
  步部裁材财踩彩踏参蚕残惭灿仓苍舱操曹槽草册测
  层曾插叉茶察差拆柴缠产铲颤昌尝常偿场厂畅倡超
  朝潮吵炒车彻沉陈趁称撑成承诚乘程惩秤持池迟持
  尺齿斥赤翅冲充崇虫抽仇愁筹丑臭初除厨橱础储触
  川穿传船串疮窗床创吹垂锤纯词慈辞磁此次刺赐匆
  聪从丛粗促醋簇窜催脆村寸措错搭达答打大呆代带
  待怠贷袋逮担丹单胆旦弹淡蛋当挡党荡刀导岛倒盗
  道稻德登等瞪蹬滴敌笛底地弟帝递缔颠典点电垫殿
  雕吊调掉跌叠蝶丁盯钉顶订定丢东冬董动冻洞都斗
  豆逗督毒独读堵杜度渡端短断段缎堆队对兑吨蹲盾
  顿多夺朵躲堕额恶饿恩儿而尔耳二发乏罚阀法帆番
  翻凡烦繁反犯饭泛方防妨房仿访纺放飞非菲肥匪废
  沸费分芬坟粉份奋愤丰风封疯峰锋逢缝讽凤佛否夫
  肤敷幅福辐抚府斧腐父付妇负附复傅赋腹覆该改盖
  概干甘杆肝赶敢感刚钢岗港高搞稿告哥胳割格隔革
  阁个各给根跟耕更工弓公功攻供恭宫巩共贡勾沟钩
  狗构购够估姑孤古骨股鼓固故顾雇瓜刮挂怪关观官
  冠管贯惯灌光广归规硅轨鬼柜贵桂跪滚棍锅国果裹
  过哈孩海害含寒喊汉汗旱行航毫豪好号浩耗喝合何
  和河荷核盒贺赫黑痕很狠恨恒横衡红洪虹后厚候呼
  忽狐胡湖糊互户护花华划滑化话怀坏欢环缓幻换唤
  荒皇黄晃灰恢挥回悔汇会绘婚浑混活火伙或获祸击
  基机肌鸡积极及吉级即急疾集籍几己挤纪技忌际剂
  季既继寄计记纪加夹佳家嘉甲价驾架假嫁监尖坚间
  肩艰兼检减剪简见件建剑健渐鉴键江姜将僵奖讲匠
  降交郊浇娇骄胶焦角脚搅缴叫轿较教阶接街节劫结
  捷截姐解介戒届界借巾今斤金津紧锦仅尽劲近进晋
  浸禁京经茎精惊晶睛景警竟净径竞敬静境镜纠究九
  酒久旧救就舅居局菊橘举巨句拒具俱剧惧据聚捐卷
  倦决绝觉爵军君均俊卡开凯刊看康抗考烤靠科壳可
  渴克刻客课肯坑空孔恐控口扣哭苦库裤夸块快宽款
  狂况亏葵愧昆困扩阔垃拉喇腊蜡辣来赖兰蓝篮览懒
  烂郎狼朗浪捞劳老乐雷类累泪冷厘离梨黎礼李里理
  力历厉立利例俐痢连怜莲联廉练炼恋良凉粮两亮谅
  辆量疗聊辽了料列烈裂邻林临淋灵零龄铃领另令溜
  留流柳六龙笼隆楼漏露炉卤鲁陆录路旅屡律虑率绿
  乱掠略伦轮论罗萝逻落骆妈麻马码骂吗埋买迈卖脉
  馒满慢忙茫盲毛矛茅冒帽貌么没眉媒煤每美妹门闷
  们萌蒙梦弥迷米秘密蜜眠免面苗描秒妙庙灭民敏名
  明鸣命摸模摩磨魔莫墨默谋某母亩木目牧墓幕拿哪
  纳奶耐男南难囊恼脑闹呢内嫩能尼泥你逆年念娘酿
  鸟尿捏您宁凝牛扭纽农浓弄努怒女暖挪哦欧偶趴爬
  怕拍排牌派攀盘判盼盆碰培赔陪佩配喷盆朋捧碰批
  披皮疲脾匹屁片偏篇骗飘漂票拼贫频品乒平评凭瓶
  破迫剖仆铺葡蒲普谱七妻期欺齐奇骑棋旗乞岂启起
  气弃汽器恰千迁牵铅谦签前钱浅遣欠枪墙抢悄敲桥
  巧切且怯亲侵钦琴禽勤青轻倾清情晴请庆穷丘秋求
  球区曲驱屈趋渠取娶去趣圈全权泉拳劝券缺却确群
  然燃染嚷让绕扰热人仁忍认任扔仍日容溶熔融柔肉
  如儒乳入软锐润若撒洒萨塞赛三伞散桑丧嗓扫嫂色
  森僧沙纱傻晒山删闪陕善扇伤商赏上尚烧稍勺少绍
  奢舍设社射涉摄申伸身深神审甚肾慎升生声牲绳省
  圣胜盛剩尸失师诗施湿十什石时识实食蚀史使始驶
  士世市式事势视试饰室是适逝释收手守首寿受授瘦
  书叔殊舒疏输蔬熟暑属曙
  述树数刷摔衰甩帅双霜爽水税睡顺说硕司丝私思斯
  撕死四寺似饲耸送颂搜艘苏俗诉肃素速塑宿诉酸算
  虽随岁碎穗孙损笋缩所索锁他它她塔踏台抬太态泰
  贪摊谈坛坦叹汤唐堂糖躺趟烫涛逃桃陶讨套特腾疼
  藤梯提题体替天添田甜填挑条调跳贴铁厅听停亭挺
  通同铜童统痛偷投头透突图徒途涂土吐兔团推腿退
  吞屯托拖脱驼妥拓挖哇娃瓦歪外弯完玩顽晚碗万汪
  亡王网往望危威微违围唯维伟伪尾委卫未位味谓胃
  温文纹闻问翁窝我卧握乌污屋无五武舞务物误雾夕
  西吸希牺析息稀锡习洗喜戏系细虾瞎峡狭下夏仙先
  纤鲜咸嫌显险现县限线宪陷羡献乡相香箱详想享响
  向巷象像橡削消宵销小晓孝校笑效些歇协胁鞋写血
  谢辛心欣新信兴星刑形型醒姓幸性凶兄胸雄休修羞
  绣朽秀袖须虚需徐许序叙宣悬旋选穴学雪血寻询巡
  循迅压呀丫烟延严言岩沿炎研盐颜眼演厌宴验央羊
  阳杨洋仰养样妖腰邀摇遥咬药要耀爷也叶页夜液一
  衣医依仪宜移遗疑椅乙已以蚁义议亦异役译易疫益
  谊意毅因阴音银引饮印英婴樱鹰迎盈营蝇影应映硬
  拥永勇用优忧幽悠尤由邮犹油游友有又右幼诱于予
  余鱼娱渔愉与宇羽雨语玉育郁狱预域欲遇喻愈冤元
  园员原圆援缘远愿怨院愿约月阅悦越云匀允运孕杂
  灾栽宰载再在咱赞脏葬遭糟早枣造噪则责择泽贼怎
  增赠扎渣闸炸摘宅窄债展占战站张章涨掌丈仗账障
  招昭朝着找沼照罩遮折哲者这浙珍真诊阵振震争征
  挣睁蒸整正证郑政症之支枝知织肢脂执直值职植殖
  只旨址纸指止趾志制质治秩致智置中忠终钟种众重
  州舟周洲粥轴宙昼皱朱竹逐主煮嘱助住注驻柱祝著
  抓专砖转赚庄装壮状撞追坠准捉桌浊咨姿资滋子紫
  仔字自宗综总纵走奏租族祖阻组钻嘴最罪醉尊遵昨
  左作坐座做
`)

// ---------------------------------------------------------------------------
// HSK 6 — karakter yang tersisa: jarang berdiri sendiri, tapi lazim di 成语,
// bahasa tulis, dan nama.
//
// Tingkat ini isinya kata, bukan karakter: hampir semua karakter dasar sudah
// dilewati di HSK 1–5, dan yang baru muncul di sini adalah karakter yang
// hampir selalu terikat pada satu-dua kata tertentu. Karena itu daftarnya
// TIDAK memuat seluruh sisa 汉字 — cuma yang benar-benar terpakai.
// ---------------------------------------------------------------------------

const HSK6 = chars(`
  蔼艾昂拗傲奥芭拔霸罢柏摆拜颁伴瓣绑镑豹暴悲卑
  贝辈奔笨崩甭泵蹦逼鄙毙弊臂辟蔽庇碧编鞭贬辩辨
  辫遍辨飙彬濒摈丙秉柄薄勃博搏膊哺捕簿裁猜彩踩
  睬蔡餐残惭灿仓沧舱操糙槽册厕插岔诧拆豺柴掺缠
  蝉阐颤昌娼场敞倡钞巢潮嘲吵炒撤彻辰沉陈趁撑呈
  澄惩澈痴驰迟斥赤炽仇筹畴踌绸丑臭雏储矗触揣穿
  川喘串疮闯创吹垂锤椎纯淳蠢慈磁雌辞赐簇窜篡摧
  璀脆淬粹瘁蹉搓磋撮措错搭怠贷逮耽胆诞蛋惮档荡
  悼盗祷蹈稻堤缔颠癜巅垫惦悼吊碟蝶叠丁盯锭铤谛
  蒂缔掂颠雕陡兜逗督毒渎笃睹妒杜堆兑敦顿钝夺垛
  堕鹅额厄遏恩恍谔耳饵贰罚阀筏帆藩凡烦繁贩梵仿
  访纺妨肪菲翡吠沸氛芬愤丰枫锋蜂逢缝奉俸敷伏俘
  符幅辐抚辅腐赴附咐赋缚伐乏筏钙盖秆尴橄敢赣冈
  纲岗港皋膏搞稿羔割葛蛤隔阁铬鸽给根跟亘耕梗弓
  躬拱贡勾沟钩苟垢构购菇姑辜咕鼓臀鼓固雇顾寡卦
  挂乖拐怪棺贯灌罐惯瓜刮寡怪涵函憾旱悍捍航毫豪
  壕耗诲貉喝褐痕恒亨衡轰哄烘弘洪宏虹侯喉猴吼忽
  狐胡壶蝴糊互沪户护花哗华滑猾化桦怀徊坏欢环缓
  唤患荒煌辉惶恍晃徽毁悔汇贿混豁获祸霍讥饥肌姬
  迹积绩籍嫉挤脊纪伎剂寂寄冀夹佳嘉颊甲钾贾稼歼
  监坚艰兼捡俭剪简荐践鉴键僵疆缰讲奖桨匠酱侨浇
  骄胶椒焦礁狡搅缴较轿窖阶皆揭嗟劫杰洁截竭姐诫
  藉巾斤筋谨襟锦仅尽劲晋浸禁茎荆惊晶睛兢竞径炯
  窘鞠拘俱剧倦捐鹃卷眷倔倔厥崛爵菌俊竣骏卡慨勘
  堪坎慷炕靠柯磕颗壳咳渴克刻垦
  垦恳坑吭空孔恐控寇枯窟酷夸垮跨挎块侩宽款狂况
  亏窥葵魁馈溃愧昆捆廓阔垃啦喇腊辣莱赖兰栏拦懒
  滥狼廊朗浪捞牢烙勒雷擂垒肋泪蕾棱厘狸篱黎礼隶
  俐吏莉粒栗痢例连帘怜涟联廉镰恋链粮谅辆辽疗僚
  燎撩瞭列烈裂猎邻鳞凛玲铃陵零龄岭令溜浏琉硫柳
  笼聋垄拢陇搂喽漏芦卢炉虏鲁陆碌鹿禄戮吕侣屡虑
  掠伦沦仑萝罗逻锣裸洛骆络妈麻蚂玛骂埋迈脉瞒馒
  蔓漫慢茫盲莽茅茂冒贸媒煤霉每昧焖萌蒙猛盟弥迷
  谜觅泌蜜眠棉勉缅描瞄渺庙蔑苗妙灭闽敏冥铭谬摸
  膜摩魔抹莫寞漠墨谋牟亩募慕暮穆呐纳耐奈囊挠恼
  馁妮泥拟逆匿溺蔫拈捻酿宁凝拧扭纽浓弄奴努怒纽
  暖挪懦哦鸥呕偶趴帕拍徘攀盘畔庞抛咆刨陪培赔佩
  沛喷盆棚捧碰披疲脾匹僻譬篇偏骗飘瓢漂瞟撇拼贫
  频聘乒屏瓶萍坡颇迫剖仆脯葡朴谱曝凄漆栖戚齐旗
  祈骑岂启弃泣汽契砌洽掐钳潜遣谴歉呛腔强抢炝敲
  乔侨桥翘窍切怯钦芹擒琴禽寝沁氢倾清蜻擎顷庆穹
  穷琼秋囚酋泅趋渠躯屈驱蛆娶趣圈券劝缺瘸阙壤扰
  惹韧仁刃认蓉溶熔融柔揉儒孺蠕辱软锐瑞润撒萨塞
  赛伞散丧嗓搔骚扫涩瑟嫂僧砂纱裳梢烧稍艄勺哨奢
  蛇舍慎渗甥牲绳圣盛尸施湿诗狮拾蚀驶矢屎誓逝仕
  侍饰释售兽枢殊疏赎蜀薯曙墅漱刷衰摔甩栓涮爽帅
  税睡瞬硕搜艘嫂苏俗肃诉塑溯酸隧遂穗隼笋缩梭嗦
  锁塌塔踏胎苔坛毯叹碳汤唐堂膛糖倘趟涛滔淘陶讨
  腾藤剔梯蹄剃惕替添田恬甜舔挑跳贴铁帖厅亭庭挺
  艇通铜童桶捅筒统偷投透凸秃屠涂徒途吐兔湍团颓
  腿蜕吞屯托妥拓挖蛙洼娃瓦歪弯玩顽宛婉腕汪亡枉
  妄旺威巍微违唯桅伟伪纬萎慰卫喂谓瘟纹稳翁窝蜗
  卧握呜巫诬乌污呜芜吾梧武侮舞勿雾夕吸昔袭媳嘻
  熄膝袜溪蟋席习洗玺喜溪暇峡狭霞辖仙纤衔嫌显险
  藓县宪陷馅羡献乡厢镶详享响巷橡削嚣硝销晓孝哮
  歇协胁挟携鞋邪泄屑械谢薪芯锌辛欣衅腥刑邢型醒
  杏凶汹雄熊嗅羞袖锈墟虚需嘘徐叙蓄婿絮宣悬旋璇
  雪削勋熏寻巡询驯讯迅循押鸦鸭崖哑雅淹延焰蜒沿
  炎盐颜衍演厌堰扬羊佯痒仰恙妖腰邀摇遥窑咬耀椰
  噎耶野冶液谒揖夷宜怡贻遗颐疑蚁毅亦役疫翼吟因
  阴姻淫殷吟隐婴樱鹰盈萤莹赢颖佣拥庸雍踊咏涌恿
  幽悠尤忧犹诱渝愉逾愚舆宇屿羽玉狱誉预豫渊缘辕
  苑愿冤援猿岳跃钥晕蕴酝孕匀允杂灾栽宰载攒赞脏
  葬遭糟凿枣藻噪躁灶泽贼赠扎渣闸咋摘斋宅窄债瞻
  盏斩崭辗占栈涨帐障招昭沼罩遮辙蜇哲蔗贞侦斟诊
  枕镇征怔挣狰蒸筝拯症郑芝枝汁脂蜘执殖旨址纸挚
  掷滞秩帜稚忠钟舟粥轴宙皱朱株诸竹烛瞩嘱著铸驻
  拽专砖转赚撰庄妆桩壮撞卓拙灼浊镯滋姿孜咨谘紫
  棕踪宗综纵邹揍租阻钻攥嘴罪醉尊遵琢佐
`)

// ---------------------------------------------------------------------------

/**
 * Dua belas karakter pelajaran pengantar.
 *
 * Dipilih karena masing-masing memperlihatkan satu jenis goresan dasar, dan
 * dikeluarkan dari daftar tingkat di bawah supaya TIDAK dapat kartu dua kali.
 * Itu bukan kerapian: kunci anti-duplikat item adalah `hanzi:<karakter>` dengan
 * unique constraint per pengguna, jadi kartu kedua bukan cuma mubazir — ia
 * DITOLAK, dan pelajaran HSK 1 yang seharusnya memuat 一 diam-diam kehilangan
 * satu kartunya.
 */
const INTRO = chars('一二三十口日月人大小上下')

/**
 * Buang karakter yang sudah muncul di level sebelumnya, dan yang bukan
 * karakter Han.
 *
 * Dua hal yang harus disaring, dan keduanya pernah kejadian:
 *
 * DUPLIKAT. Daftar tiap level diturunkan dari daftar kosakata level itu, dan
 * kosakata PASTI memakai ulang karakter — 学 ada di 学生 (HSK 1), 学期 (HSK 4),
 * dan 学术 (HSK 6). Tanpa penyaringan ini kamu mendapat kartu kembar dan
 * mengira kurikulumnya lebih panjang daripada isinya.
 *
 * BUKAN KARAKTER HAN. Daftar sepanjang ini ditulis tangan, dan huruf Latin
 * atau hangul yang tanpa sengaja terselip akan lolos ke kartu — menghasilkan
 * kartu "hanzi" yang isinya bukan hanzi. Lebih baik dibuang di sini daripada
 * ketahuan sebagai kartu rusak setelah satu panggilan AI terbakar.
 */
function clean(levels: string[][]): string[][] {
  // Diisi lebih dulu dengan karakter pelajaran pengantar: itu yang membuatnya
  // tidak muncul lagi sebagai kartu di tingkat mana pun.
  const seen = new Set<string>(INTRO)
  return levels.map((list) =>
    list.filter((c) => {
      if (!/^\p{Script=Han}$/u.test(c)) return false
      if (seen.has(c)) return false
      seen.add(c)
      return true
    }),
  )
}

const [C1, C2, C3, C4, C5, C6] = clean([HSK1, HSK2, HSK3, HSK4, HSK5, HSK6])

export const HANZI_BY_LEVEL: Record<string, string[]> = {
  HSK1: C1,
  HSK2: C2,
  HSK3: C3,
  HSK4: C4,
  HSK5: C5,
  HSK6: C6,
}

/**
 * Berapa karakter per pelajaran.
 *
 * Sama dengan kanji: 12 sekali duduk sudah termasuk banyak. Kartu hanzi bahkan
 * lebih berat daripada kartu kanji dalam satu hal — tiap kartu membawa dua kata
 * contoh beserta pinyin dan artinya, jadi yang dihafal bukan 12 hal tapi 12
 * kelompok kecil.
 */
export const HANZI_PER_LESSON = 12

export type HanziLesson = {
  title: string
  level: string
  /** karakter yang dilatih; kosong untuk pelajaran pengantar cara menulis */
  hanzi: string[]
  /** kalau diisi, dipakai sebagai `focus` pelajaran alih-alih daftar karakternya */
  focus?: string
  context?: string
}

/**
 * Hanzi → daftar pelajaran, urut dari HSK 1 ke HSK 6.
 *
 * `withIntro` menentukan pelajaran pengantar ikut atau tidak, dan itu keputusan
 * yang sama dengan kana: pelajar yang memulai dari HSK 4 sudah menulis 一二三
 * bertahun-tahun, jadi menyodorkan pelajaran urutan goresan padanya cuma
 * membuang waktu dan panggilan AI. Konsekuensinya jujur: kalau pengantarnya
 * dilewati, dua belas karakter itu tidak mendapat kartu sama sekali — dan itu
 * memang tidak masalah, karena tidak ada pelajar tingkat menengah yang butuh
 * kartu hafalan untuk 一.
 *
 * Pelajaran PERTAMA bukan daftar karakter, tapi cara karakter itu dibangun:
 * urutan goresan, 部首 (radikal), dan mengapa 好 = 女 + 子. Ini bukan pengantar
 * yang bisa dilewati. Karakter yang dihafal sebagai gambar utuh akan tertukar
 * satu sama lain begitu jumlahnya lewat seratus (认/让/认, 情/清/请); karakter
 * yang dilihat sebagai susunan radikal tidak. Dua belas karakter di pelajaran
 * itu dipilih karena masing-masing memperlihatkan satu jenis goresan dasar.
 *
 * Sisanya tidak dikelompokkan menurut radikal atau tema, dan itu keputusan yang
 * sama seperti pada kanji: pengelompokan begitu terdengar rapi tapi membuat
 * urutannya melompat-lompat dalam frekuensi pemakaian — dan frekuensi itulah
 * yang menentukan bisa-tidaknya kamu membaca teks.
 */
export function hanziLessons(levels: string[], withIntro = true): HanziLesson[] {
  const out: HanziLesson[] = []
  const beginner = levels[0]

  if (withIntro && beginner && HANZI_BY_LEVEL[beginner]?.length) {
    out.push({
      title: 'Cara Hanzi Dibangun',
      level: beginner,
      hanzi: INTRO,
      focus:
        'Delapan goresan dasar (横 一, 竖 丨, 撇 丿, 点 丶, 提, 折, 钩, 弯) dan dua aturan yang tidak ' +
        'boleh dilanggar: atas sebelum bawah, kiri sebelum kanan. Lalu 部首 (radikal): 好 = 女 + 子, ' +
        '请 = 讠 + 青, 河 = 氵 + 可 — radikal memberi petunjuk ARTI (氵 air, 讠 bicara, 忄 hati), ' +
        'dan bagian sisanya sering memberi petunjuk BUNYI. Dua belas karakter di pelajaran ini ' +
        'dipilih karena tiap satunya memperlihatkan satu goresan dasar.',
      context: 'pondasi: karakter yang dihafal sebagai gambar akan tertukar, yang dibaca sebagai susunan tidak',
    })
  }

  for (const level of levels) {
    const list = HANZI_BY_LEVEL[level]
    if (!list?.length) continue
    const parts = Math.ceil(list.length / HANZI_PER_LESSON)
    for (let i = 0; i < parts; i++) {
      out.push({
        title: `Hanzi ${level} ${i + 1}/${parts}`,
        level,
        hanzi: list.slice(i * HANZI_PER_LESSON, (i + 1) * HANZI_PER_LESSON),
      })
    }
  }
  return out
}

/** Termasuk dua belas karakter pelajaran pengantar, yang tidak ada di daftar tingkat. */
export function totalHanzi(): number {
  return INTRO.length + Object.values(HANZI_BY_LEVEL).reduce((a, l) => a + l.length, 0)
}
