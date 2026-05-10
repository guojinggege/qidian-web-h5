/* ============================================================
   奇点社区 · Mock Data
   全局可访问，未来对接真实 API 时只替换此文件
============================================================ */

window.QD = (function () {

  /* ---------- 11 Channels ---------- */
  const channels = [
    { id: 'qd',       slug: 'qd',       name: '奇点',       icon: 'ti-sparkles',          color: 'purple', desc: '今天，你的世界观被刷新了吗？', members: 482911, online: 3210, unread: 12,  subscribed: true,  level: '主频道' },
    { id: 'sport',    slug: 'sport',    name: '体育竞技',   icon: 'ti-ball-basketball',  color: 'coral',  desc: 'NBA · 足球 · 电竞 · 综合', members: 318422, online: 5840, unread: 28,  subscribed: true,  level: 'S' },
    { id: 'drama',    slug: 'drama',    name: '短剧',       icon: 'ti-device-tv',         color: 'amber',  desc: '海外华人爽剧 · 霸总 · 穿越', members: 182331, online: 1240, unread: 7,   subscribed: true,  level: 'A' },
    { id: 'game',     slug: 'game',     name: '游戏二次元', icon: 'ti-device-gamepad-2',  color: 'green',  desc: '游戏攻略 · 二次元 · Steam',  members: 251007, online: 4310, unread: 18,  subscribed: true,  level: 'S' },
    { id: 'movie',    slug: 'movie',    name: '影视文化',   icon: 'ti-movie',             color: 'blue',   desc: '电影 · 剧集 · 动漫 · 读书',  members: 142655, online: 922,  unread: 4,   subscribed: true,  level: 'A' },
    { id: 'fortune',  slug: 'fortune',  name: '玄学命理',   icon: 'ti-yin-yang',          color: 'teal',   desc: '八字 · 风水 · 塔罗 · 紫微',  members: 88312,  online: 412,  unread: 2,   subscribed: false, level: 'A' },
    { id: 'gender',   slug: 'gender',   name: '两性颜值',   icon: 'ti-heart',             color: 'pink',   desc: '颜值审美 · 情感 · VIP专区',  members: 421120, online: 6021, unread: 33,  subscribed: true,  level: 'S' },
    { id: 'pickup',   slug: 'pickup',   name: '泡妞学',     icon: 'ti-flame',             color: 'rose',   desc: '男性成长 · 海外华人婚恋',    members: 78421,  online: 588,  unread: 9,   subscribed: false, level: 'B' },
    { id: 'money',    slug: 'money',    name: '财经搞钱',   icon: 'ti-coin',              color: 'lime',   desc: '美股 · 加密 · 海外职场',     members: 165088, online: 1820, unread: 5,   subscribed: true,  level: 'A' },
    { id: 'asmr',     slug: 'asmr',     name: 'ASMR',       icon: 'ti-headphones',        color: 'sky',    desc: '助眠 · 白噪音 · 解压',       members: 52341,  online: 290,  unread: 0,   subscribed: false, level: 'C' },
    { id: 'funny',    slug: 'funny',    name: '搞笑',       icon: 'ti-mood-happy',        color: 'violet', desc: '段子 · 表情包 · 生活笑料',   members: 392111, online: 4221, unread: 16,  subscribed: true,  level: 'S' },
  ];

  /* ---------- Current user ---------- */
  const user = {
    id: 'u_self',
    username: '过路的星辰',
    avatar: 'bg-grad-6',
    level: 23,
    vip: { active: true, tier: 'gold', expiresAt: '2026-08-12' },
    stats: { posts: 142, followers: 1820, following: 332, likes: 12877, coins: 8932 },
    bio: '北美程序员 · 摩羯座 · 半个NBA球迷 · 信玄学的理性人',
    location: '美国 · 加州',
  };

  /* ---------- Authors pool ---------- */
  const authors = [
    { id: 'u01', name: '硅谷郊狼',       avatar: 'bg-grad-1', level: 31, vip: 'gold' },
    { id: 'u02', name: '湾区F2太太',     avatar: 'bg-grad-4', level: 18 },
    { id: 'u03', name: '雪梨咖啡馆老板', avatar: 'bg-grad-5', level: 26, vip: 'silver' },
    { id: 'u04', name: '多伦多冷锅串串', avatar: 'bg-grad-3', level: 14 },
    { id: 'u05', name: '伦敦地铁打工人', avatar: 'bg-grad-2', level: 22 },
    { id: 'u06', name: '东京霓虹猎人',   avatar: 'bg-grad-7', level: 19, vip: 'gold' },
    { id: 'u07', name: '曼谷别再喝椰',   avatar: 'bg-grad-8', level: 28 },
    { id: 'u08', name: '柏林冷面摄影师', avatar: 'bg-grad-6', level: 35, vip: 'gold' },
    { id: 'u09', name: '新加坡组屋叔',   avatar: 'bg-grad-1', level: 12 },
    { id: 'u10', name: '巴黎街头狗仔',   avatar: 'bg-grad-4', level: 21 },
    { id: 'u11', name: '芝加哥风味',     avatar: 'bg-grad-5', level: 9 },
    { id: 'u12', name: '香港中环外卖',   avatar: 'bg-grad-3', level: 17, vip: 'silver' },
  ];
  const authorById = Object.fromEntries(authors.map(a => [a.id, a]));

  /* ---------- Posts ---------- */
  const posts = [
    {
      id: 'p001',
      channelId: 'qd',
      authorId: 'u08',
      type: 'text',
      title: '中世纪欧洲为什么洗澡反而被认为是不健康的？看完这段历史你会笑出声',
      excerpt: '14世纪黑死病爆发后，欧洲医学界普遍相信"皮肤毛孔张开会让瘟疫入侵"，于是禁止洗澡成为主流医学建议。法国国王路易十四一生只洗过3次澡，凡尔赛宫的"香水文化"其实是因为大家臭得受不了……',
      tags: ['冷知识', '世界史'],
      stats: { up: 4821, down: 32, comments: 612, share: 188, view: 84210, live: 142 },
      createdAt: '2分钟前',
      hot: true,
    },
    {
      id: 'p002',
      channelId: 'sport',
      authorId: 'u01',
      type: 'video',
      title: '约基奇这个不看人传球，整个联盟现在已经没人能防了',
      excerpt: '今天打太阳的G3，约老师在篮下吸引3个人包夹之后，反手一个No-look直接喂给底角的KCP……',
      thumb: 'linear-gradient(135deg,#E55A4B,#D4A04A)',
      tags: ['NBA', '掘金'],
      stats: { up: 3128, down: 89, comments: 422, share: 76, view: 52310, live: 88 },
      createdAt: '12分钟前',
    },
    {
      id: 'p003',
      channelId: 'gender',
      authorId: 'u02',
      type: 'gallery',
      title: '海外华人圈最近这种"清冷感"风格的女生，是不是有点过头了？',
      excerpt: '直接上图，大家自己评。我个人觉得这种打扮太刻意，反而失去了那种真正的松弛感……',
      thumbs: [
        'linear-gradient(135deg,#E55A8A,#C77FE5)',
        'linear-gradient(135deg,#9F7FE5,#7F77DD)',
        'linear-gradient(135deg,#4A9FE5,#4ADBCC)',
      ],
      tags: ['颜值审美', '讨论'],
      stats: { up: 2208, down: 412, comments: 1822, share: 38, view: 38120, live: 312 },
      createdAt: '28分钟前',
      vipLocked: false,
    },
    {
      id: 'p004',
      channelId: 'money',
      authorId: 'u05',
      type: 'text',
      title: '在伦敦做Quant 5年，劝退一下想跳金融的弟弟们 — 没你想的那么香',
      excerpt: '看到群里又有几个MIT毕业的小伙伴跳来Quant，我想说几个真实数据。第一年的all-in package确实漂亮，但是……',
      tags: ['职场', '伦敦', '金融'],
      stats: { up: 1840, down: 22, comments: 388, share: 122, view: 28400, live: 41 },
      createdAt: '1小时前',
    },
    {
      id: 'p005',
      channelId: 'fortune',
      authorId: 'u06',
      type: 'text',
      title: '【免费分析】1992年8月15日午时生人，最近事业财运卡点在哪？',
      excerpt: '请玄海大师在线给个方向。这两年换了3次工作都不顺，最近的offer要不要接……',
      tags: ['八字', '事业'],
      stats: { up: 421, down: 4, comments: 88, share: 12, view: 6210, live: 28 },
      createdAt: '2小时前',
    },
    {
      id: 'p006',
      channelId: 'game',
      authorId: 'u04',
      type: 'video',
      title: '黑神话悟空一周年，今年TGA还有戏吗？冷静分析一下',
      excerpt: '从销量、口碑、文化输出三个维度过一遍，再对比一下今年的几个候选作品……',
      thumb: 'linear-gradient(135deg,#4ADB7E,#B8DB4A)',
      tags: ['黑神话', 'TGA'],
      stats: { up: 2911, down: 188, comments: 488, share: 92, view: 41200, live: 122 },
      createdAt: '3小时前',
    },
    {
      id: 'p007',
      channelId: 'funny',
      authorId: 'u11',
      type: 'text',
      title: '我妈说我这种35岁还在写代码的，在国内属于"高级闲人"',
      excerpt: '她说"你们写代码的就是把简单事情搞复杂，然后说自己很累"。我想了一晚上，觉得她说得也不是完全没道理……',
      tags: ['段子', '生活'],
      stats: { up: 6422, down: 51, comments: 1244, share: 421, view: 92340, live: 88 },
      createdAt: '5小时前',
      hot: true,
    },
    {
      id: 'p008',
      channelId: 'drama',
      authorId: 'u03',
      type: 'video',
      title: '《海归霸总的复仇人生》— 第38集刚更，前妻这次终于跪下来了',
      excerpt: '剧透警告。这一集编剧终于不水了，霸总在董事会上甩出DNA报告的那一刻，全场鸦雀无声……',
      thumb: 'linear-gradient(135deg,#D4A04A,#E55A4B)',
      tags: ['短剧', 'VIP'],
      stats: { up: 1822, down: 312, comments: 622, share: 88, view: 24210, live: 199 },
      createdAt: '8小时前',
      vipLocked: true,
    },
  ];

  /* ---------- Comments (nested) ---------- */
  const comments = [
    {
      id: 'c001', postId: 'p001', authorId: 'u01',
      text: '路易十四这个事我专门查过，确实是事实但被夸大了。当时贵族的"擦浴"其实算是另一种洗澡方式，只是不下水池而已。',
      time: '8分钟前', up: 142, down: 3, vipFlair: true,
      replies: [
        { id: 'c001a', authorId: 'u05', text: '楼上专业，请问有信源吗想深入了解', time: '5分钟前', up: 22 },
        { id: 'c001b', authorId: 'u01', text: '推荐看Georges Vigarello的《Concepts of Cleanliness》，专门研究欧洲卫生史的。', time: '3分钟前', up: 38 },
      ],
    },
    {
      id: 'c002', postId: 'p001', authorId: 'u07',
      text: '我老婆是法国人，她小时候奶奶辈确实习惯一周洗一次澡。文化惯性比想象中长很多。',
      time: '15分钟前', up: 88, down: 12,
    },
    {
      id: 'c003', postId: 'p001', authorId: 'u11',
      text: '想到一个冷笑话：所以法国香水产业是被瘟疫培养出来的？？这世界还真是离谱',
      time: '22分钟前', up: 311, down: 2,
      replies: [
        { id: 'c003a', authorId: 'u04', text: '不止 香槟产业某种程度也是 因为水太脏只能喝酒', time: '18分钟前', up: 122 },
      ],
    },
    {
      id: 'c004', postId: 'p001', authorId: 'u12',
      text: '所以你看Versailles的金色装饰其实是用来掩盖屎尿味的，欧洲贵族的审美一半是被臭味逼出来的。我之前去参观时导游就这么讲。',
      time: '30分钟前', up: 612, down: 18,
    },
  ];

  /* ---------- Live room messages (seed) ---------- */
  const liveMessages = [
    { id: 'm01', postId: 'p001', authorId: 'u02', text: '快进到中世纪欧洲人闻到香水就高潮', time: '刚刚' },
    { id: 'm02', postId: 'p001', authorId: 'u04', text: '所以路易十四是不是世界上第一个体味行为艺术家', time: '刚刚' },
    { id: 'm03', postId: 'p001', authorId: 'u07', text: '我老婆补充一下：法国到现在很多老人也不爱天天洗澡', time: '1分钟前' },
    { id: 'm04', postId: 'p001', authorId: 'u01', text: '楼上的发言精准！', time: '1分钟前' },
    { id: 'm05', postId: 'p001', authorId: 'u05', text: '所以现在去伦敦地铁臭也算是文化继承？', time: '2分钟前' },
    { id: 'm06', postId: 'p001', authorId: 'u08', text: '不行了大早上的笑出声了', time: '2分钟前' },
    { id: 'm07', postId: 'p001', authorId: 'sys', text: '湾区F2太太 加入了直播间', time: '2分钟前', system: true },
    { id: 'm08', postId: 'p001', authorId: 'u02', text: '我老公中世纪人，他怎么不举手发言一下', time: '3分钟前' },
  ];

  /* New incoming messages pool used by setInterval simulator */
  const liveIncomingPool = [
    { authorId: 'u01', text: '其实奥斯曼帝国的浴室文化在同时期非常发达，欧洲人是异类' },
    { authorId: 'u04', text: '人类的认知偏差真是跨越千年的稳定特征' },
    { authorId: 'u06', text: '所以日本江户时代的钱汤算先进文明' },
    { authorId: 'u10', text: '听说当时法国人是把香水当药用的' },
    { authorId: 'u05', text: '伦敦还是臭 这个我作证' },
    { authorId: 'u12', text: '不能再笑了 邻居以为我疯了' },
    { authorId: 'u11', text: '楼主下次写什么？我蹲一篇关于厕所历史的' },
    { authorId: 'u02', text: '提醒一下大家：我们现代人也不算多干净 想想键盘上的细菌' },
    { authorId: 'u07', text: '+1 我的机械键盘里能种菜' },
    { authorId: 'u08', text: '其实凡尔赛宫到处拉屎这件事 历史细节比你想象的离谱100倍' },
    { authorId: 'u03', text: '建议出一个《人类卫生进化史》连载' },
    { authorId: 'u09', text: '新加坡组屋公共走廊比凡尔赛干净多了 这话我说10遍' },
    { authorId: 'sys', text: '柏林冷面摄影师 升级到了 Lv.36', system: true },
    { authorId: 'u06', text: '楼上恭喜！请客发红包' },
    { authorId: 'sys', text: '直播间已有 312 人在线', system: true },
  ];

  /* ---------- Dramas ---------- */
  const dramas = [
    { id: 'd01', title: '海归霸总的复仇人生', episodes: 60, vipFree: 5, cover: 'linear-gradient(135deg,#E55A4B,#D4A04A)', tags: ['复仇','霸总'], plays: '4.2亿', rating: 9.2 },
    { id: 'd02', title: '我在伦敦当外卖小哥的那些年', episodes: 42, vipFree: 8, cover: 'linear-gradient(135deg,#4A9FE5,#9F7FE5)', tags: ['现实','海外'], plays: '1.8亿', rating: 8.8 },
    { id: 'd03', title: '穿越成王思聪的我决定先开除自己', episodes: 50, vipFree: 6, cover: 'linear-gradient(135deg,#D4A04A,#4ADB7E)', tags: ['穿越','搞笑'], plays: '3.1亿', rating: 8.5 },
    { id: 'd04', title: '前妻总裁夜夜跪下求我回家', episodes: 88, vipFree: 4, cover: 'linear-gradient(135deg,#E55A8A,#C77FE5)', tags: ['霸总','虐恋'], plays: '6.7亿', rating: 9.4 },
    { id: 'd05', title: '我在硅谷躺平十年后突然成了天才', episodes: 36, vipFree: 6, cover: 'linear-gradient(135deg,#4ADBCC,#4A9FE5)', tags: ['职场','逆袭'], plays: '9800万', rating: 8.9 },
    { id: 'd06', title: '玄学大师我，重生救国回到了2008', episodes: 72, vipFree: 5, cover: 'linear-gradient(135deg,#9F7FE5,#534AB7)', tags: ['玄学','重生'], plays: '2.4亿', rating: 9.0 },
  ];

  /* ---------- 玄学大师 ---------- */
  const masters = [
    { id: 'ms01', name: '玄海道长',  title: '紫微斗数 · 35年经验',  rating: 4.98, orders: 12842, price: 299, avatar: 'bg-grad-7', tags: ['八字', '紫微', '感情'], badge: '人气王' },
    { id: 'ms02', name: '清玄居士',  title: '易经 · 风水堪舆',       rating: 4.95, orders: 8120,  price: 599, avatar: 'bg-grad-5', tags: ['风水', '事业', '财运'], badge: '资深' },
    { id: 'ms03', name: '云水居',    title: '塔罗 · 海外华人婚恋',   rating: 4.92, orders: 6488,  price: 199, avatar: 'bg-grad-4', tags: ['塔罗', '感情'], badge: '新晋' },
    { id: 'ms04', name: '九霄真人',  title: '奇门遁甲 · 高净值咨询', rating: 5.00, orders: 1240,  price: 899, avatar: 'bg-grad-6', tags: ['奇门', '商业'], badge: '大师' },
  ];

  /* ---------- Notifications ---------- */
  const notifications = [
    { id: 'n01', type: 'like',    from: 'u01', text: '点赞了你的帖子《为什么北美华人男生越来越喜欢留胡子？》', time: '5分钟前', read: false },
    { id: 'n02', type: 'comment', from: 'u04', text: '回复了你的评论：「我觉得你说得有点道理但是……」', time: '12分钟前', read: false },
    { id: 'n03', type: 'follow',  from: 'u07', text: '关注了你', time: '1小时前', read: false },
    { id: 'n04', type: 'mention', from: 'u02', text: '在帖子《海外华人圈最近这种清冷感》中 @了你', time: '2小时前', read: true },
    { id: 'n05', type: 'system',  from: 'sys', text: '你的黑卡会员将在 28 天后到期，续费享 8 折优惠', time: '1天前', read: true },
    { id: 'n06', type: 'reward',  from: 'sys', text: '你的帖子获得了 8 个金币打赏（来自 3 位读者）', time: '2天前', read: true },
    { id: 'n07', type: 'system',  from: 'sys', text: '社区新规：从本周起，玄学频道新增"留言不公开"选项', time: '3天前', read: true },
  ];

  /* ---------- Direct messages ---------- */
  const dms = [
    { id: 'dm01', userId: 'u01', last: '那篇关于Quant的讨论我也想加入，能拉我进群吗', time: '3分钟前', unread: 2 },
    { id: 'dm02', userId: 'u06', last: '东京周末有玄学线下会，要不要一起？', time: '1小时前', unread: 1 },
    { id: 'dm03', userId: 'u04', last: '多伦多串串配方我发你了', time: '昨天',   unread: 0 },
    { id: 'dm04', userId: 'u11', last: '哈哈哈那段你妈说的我笑了一整天',     time: '2天前', unread: 0 },
  ];

  /* ---------- Search ---------- */
  const searchSuggestions = ['约基奇 不看人传球', '北美 程序员 35岁', '玄海道长 八字', '海归霸总 第38集', 'NBA 季后赛 G3', '伦敦 Quant 跳槽', '清冷感 颜值', '黑神话 TGA'];
  const hotSearches = [
    { q: '约基奇G3绝杀', delta: '+412%' },
    { q: '海归霸总38集',  delta: 'NEW' },
    { q: '伦敦Quant真实收入', delta: '+88%' },
    { q: '玄海道长在线答疑', delta: '热' },
    { q: '清冷感是不是骗局', delta: '+22%' },
    { q: '黑神话TGA预测',  delta: '+15%' },
  ];

  /* ---------- VIP tiers ---------- */
  const vipTiers = [
    { id: 'month',   name: '月卡',  price: 99,  old: 128,  unit: '/月',   featured: false, save: '省 ¥29',  features: ['全部短剧无限解锁', '玄学频道首次咨询 9 折', '帖子高级排版', 'VIP专属勋章 · 银'] },
    { id: 'season',  name: '季卡',  price: 249, old: 297,  unit: '/3月',  featured: true,  save: '日均 ¥2.7', features: ['全部短剧无限解锁', '玄学频道咨询 8.5 折', '帖子高级排版+置顶卡', 'VIP专属勋章 · 金', '两性颜值VIP专区解锁', '创作者打赏分成 +5%'] },
    { id: 'year',    name: '年卡',  price: 899, old: 1188, unit: '/年',   featured: false, save: '省 ¥289',  features: ['全部短剧无限解锁', '玄学频道咨询 8 折', '帖子高级排版+置顶卡', 'VIP专属勋章 · 黑金', '两性颜值VIP专区解锁', '创作者打赏分成 +10%', '专属客户经理'] },
  ];

  const vipBenefits = [
    { icon: 'ti-device-tv',         name: '全部短剧无限看', desc: '600+部独家海外华人爽剧无限解锁' },
    { icon: 'ti-yin-yang',          name: '玄学咨询折扣',   desc: '玄海等大师付费咨询最低 8 折' },
    { icon: 'ti-heart',             name: '颜值VIP专区',     desc: '解锁仅限会员的两性深度内容' },
    { icon: 'ti-edit',              name: '高级排版+置顶卡', desc: '帖子可使用富文本/分栏/封面图' },
    { icon: 'ti-coin',              name: '打赏分成翻倍',   desc: '创作者可额外获得 5-10% 收益分成' },
    { icon: 'ti-badge',             name: '专属勋章',       desc: '银/金/黑金三档身份标识' },
    { icon: 'ti-shield-check',      name: '广告全免',       desc: '完整去除信息流与开屏广告' },
    { icon: 'ti-user-star',         name: '专属客户经理',   desc: '年卡专享 · 7×24 中文响应' },
  ];

  /* ---------- Helpers ---------- */
  function postById(id) { return posts.find(p => p.id === id); }
  function channelById(id) { return channels.find(c => c.id === id); }
  function authorOf(p) { return authorById[p.authorId] || authors[0]; }
  function fmtNum(n) {
    if (n >= 10000) return (n/10000).toFixed(1) + 'w';
    if (n >= 1000) return (n/1000).toFixed(1) + 'k';
    return String(n);
  }

  return {
    channels, channelById,
    user, authors, authorById, authorOf,
    posts, postById,
    comments,
    liveMessages, liveIncomingPool,
    dramas, masters,
    notifications, dms,
    searchSuggestions, hotSearches,
    vipTiers, vipBenefits,
    fmtNum,
  };
})();
