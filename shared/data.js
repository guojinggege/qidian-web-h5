/* ============================================================
   Wavi · Data Layer (异步加载器)
   ------------------------------------------------------------
   - 同步创建 window.QD，先用空数组占位
   - QD.ready() 返回 Promise，并行 fetch site-data.json + channels-v2.json
   - channels/subChannels 来自 channels-v2.json (新 8 区结构)
   - posts/users/messages 等仍来自 site-data.json
   - 旧 channels 保留在 state.legacyChannels (帖子 chip fallback)
   - 加载失败降级到最小兜底数据，页面不会完全空白
   - 保持原有同名 API：QD.channels / QD.posts / QD.user 等
============================================================ */

window.QD = (function () {

  /* ---------- 同步初始化：空 state ---------- */
  const state = {
    channels: [],
    subChannels: [],
    legacyChannels: [],
    legacySubChannels: [],
    user: null,
    authors: [],
    authorById: {},
    posts: [],
    comments: [],
    liveMessages: [],
    liveIncomingPool: [],
    dramas: [],
    films: [],
    masters: [],
    notifications: [],
    dms: [],
    searchSuggestions: [],
    hotSearches: [],
    banners: [],
    vipTiers: [],
    vipBenefits: [],
  };

  /* ---------- 降级兜底（fetch 失败时启用） ---------- */
  const fallback = {
    channels: [
      { id: 'qd', slug: 'qd', name: '奇点', icon: 'ti-sparkles', color: 'purple', desc: '数据加载失败', members: 0, online: 0, unread: 0, subscribed: true, level: '主频道' },
    ],
    user: { id: 'u_self', username: '游客', avatar: 'bg-grad-6', level: 1, vip: { active: false }, stats: { posts: 0, followers: 0, following: 0, likes: 0, coins: 0 }, bio: '', location: '' },
    authors: [
      { id: 'u01', name: '加载中', avatar: 'bg-grad-1', level: 1 },
    ],
    posts: [
      { id: 'p_err', channelId: 'qd', authorId: 'u01', type: 'text', title: '⚠️ 内容加载失败', excerpt: '请检查 data/site-data.json 是否存在，或刷新页面重试。', body: '页面所需数据未能加载。可能原因：\n\n1. 当前未通过 HTTP 服务器访问（双击 HTML 文件直接打开会触发 CORS 阻断）\n2. data/site-data.json 文件被移动或删除\n3. 网络异常\n\n请运行 `python3 -m http.server 8080` 后从 http://localhost:8080 访问。', tags: [], stats: { up: 0, down: 0, comments: 0, share: 0, view: 0, liveOnline: 0 }, createdAt: new Date().toISOString(), createdAtText: '刚刚' },
    ],
    comments: [],
    liveMessages: [],
    liveIncomingPool: [
      { authorId: 'u01', text: '数据加载失败，实时房不可用' },
    ],
    dramas: [],
    films: [],
    masters: [],
    notifications: [],
    dms: [],
    searchSuggestions: [],
    hotSearches: [],
    banners: [],
    vipTiers: [],
    vipBenefits: [],
  };

  /* ---------- Helpers ---------- */
  function postById(id) {
    return state.posts.find(p => p.id === id);
  }
  function channelById(id) {
    return state.channels.find(c => c.id === id)
      || (state.legacyChannels || []).find(c => c.id === id);
  }
  function subChannelById(id) {
    if (!id) return null;
    return (state.subChannels || []).find(s => s.id === id)
      || (state.legacySubChannels || []).find(s => s.id === id);
  }
  function subChannelsOf(channelId) {
    const v2 = (state.subChannels || []).filter(s => s.parentId === channelId);
    if (v2.length) return v2;
    // 旧频道页(qd-channel.html 等)迁移 banner 倒计时期间,fallback 显示旧 sub-channels
    return (state.legacySubChannels || []).filter(s => s.parentId === channelId);
  }
  function authorOf(post) {
    if (!post) return state.authors[0];
    return state.authorById[post.authorId] || state.authors[0] || { id: '?', name: 'Anonymous', avatar: 'bg-grad-1', level: 1 };
  }
  function fmtNum(n) {
    if (n == null) return '';
    if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '亿';
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + 'w';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }
  function fmtTime(iso) {
    if (!iso) return '';
    const t = typeof iso === 'string' ? new Date(iso).getTime() : Number(iso);
    if (!t || Number.isNaN(t)) return '';
    const diff = Date.now() - t;
    if (diff < 0) return '刚刚';
    const min = Math.floor(diff / 60000);
    if (min < 1) return '刚刚';
    if (min < 60) return min + '分钟前';
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + '小时前';
    const d = Math.floor(hr / 24);
    if (d < 7) return d + '天前';
    if (d < 30) return Math.floor(d / 7) + '周前';
    if (d < 365) return Math.floor(d / 30) + '个月前';
    return Math.floor(d / 365) + '年前';
  }

  /* ---------- 数据加载 ---------- */
  // 所有调用方都位于 /web/*.html / /h5/*.html / /admin/*.html，
  // 根目录的 index.html 不加载 data.js，所以统一用 '../data/...' 即可。
  const DATA_URL = '../data/site-data.json';
  const CHANNELS_V2_URL = '../data/channels-v2.json';
  // admin 用同一个 key 暂存草稿；前台 fetch 完后合并它来实现"本地预览"
  const DRAFT_KEY = 'qd-admin-state-v1';

  /* ---------- channels-v2 适配层 ----------
     v2 文件字段是 snake_case (sub_channels / tagline / description / tags)
     现有渲染器读 camelCase + 旧字段 (subChannels / desc / icon / members / online / unread / subscribed / level)
     这里做字段映射,JSON 文件保持与 wavi-channels.json 字节一致(承诺不动)。
  ---------------------------------------- */
  // 默认订阅分配 (Q2 拍板): 4 个默认订阅 + 4 个"推荐你也看看"
  const V2_SUBSCRIBED_DEFAULTS = {
    midnight: true, relationships: true, overseas: true, gossip: true,
    visual: false, otaku: false, money: false, occult: false,
  };
  // 每个新频道的 tabler-icon
  const V2_CHANNEL_ICONS = {
    midnight: 'ti-moon',
    relationships: 'ti-heart',
    visual: 'ti-camera',
    overseas: 'ti-world',
    gossip: 'ti-flame',
    otaku: 'ti-device-gamepad-2',
    money: 'ti-coin',
    occult: 'ti-yin-yang',
  };
  // 合成的统计数 (原型展示用,接真用户系统时切动态值)
  const V2_CHANNEL_STATS = {
    midnight:      { members: 482911, online: 3210, unread: 12, level: '主频道' },
    relationships: { members: 251007, online: 2840, unread: 28, level: 'S' },
    visual:        { members: 182331, online: 1240, unread: 7,  level: 'A' },
    overseas:      { members: 318422, online: 5840, unread: 18, level: 'S' },
    gossip:        { members: 142655, online: 922,  unread: 4,  level: 'A' },
    otaku:         { members: 88312,  online: 1100, unread: 9,  level: 'A' },
    money:         { members: 95000,  online: 800,  unread: 6,  level: 'A' },
    occult:        { members: 77000,  online: 600,  unread: 3,  level: 'A' },
  };
  const SUB_ICON_PALETTE = ['ti-bookmark','ti-star','ti-bulb','ti-message','ti-flame','ti-bell'];

  function adaptChannelsV2(v2) {
    const newChannels = [];
    const newSubs = [];
    (v2.channels || []).forEach(c => {
      const stats = V2_CHANNEL_STATS[c.id] || { members: 0, online: 0, unread: 0, level: 'A' };
      newChannels.push({
        id: c.id,
        slug: c.slug,
        name: c.name,
        icon: V2_CHANNEL_ICONS[c.id] || 'ti-hash',
        color: c.color,
        desc: c.tagline || c.description || '',
        tagline: c.tagline,
        description: c.description,
        members: stats.members,
        online: stats.online,
        unread: stats.unread,
        subscribed: V2_SUBSCRIBED_DEFAULTS[c.id] === undefined ? false : V2_SUBSCRIBED_DEFAULTS[c.id],
        level: stats.level,
        order: c.order,
      });
      (c.sub_channels || []).forEach((s, idx) => {
        newSubs.push({
          id: s.id,
          parentId: c.id,
          slug: s.slug,
          name: s.name,
          desc: (s.tags || []).join(' · '),
          icon: SUB_ICON_PALETTE[idx % SUB_ICON_PALETTE.length],
          color: c.color,
          tags: s.tags || [],
        });
      });
    });
    return { newChannels, newSubs };
  }

  // 全量替换（用于首次 server 加载 / fallback）。任何字段缺失都视为空。
  function applyData(d) {
    state.channels         = d.channels         || [];
    state.subChannels      = d.subChannels      || [];
    state.user             = d.user             || null;
    state.authors          = d.authors          || [];
    state.posts            = d.posts            || [];
    state.comments         = d.comments         || [];
    state.liveMessages     = d.liveMessages     || [];
    state.liveIncomingPool = d.liveIncomingPool || [];
    state.dramas           = d.dramas           || [];
    state.films            = d.films            || [];
    state.masters          = d.masters          || [];
    state.notifications    = d.notifications    || [];
    state.dms              = d.dms              || [];
    state.searchSuggestions = d.searchSuggestions || [];
    state.hotSearches      = d.hotSearches      || [];
    state.banners          = d.banners          || [];
    state.vipTiers         = d.vipTiers         || [];
    state.vipBenefits      = d.vipBenefits      || [];
    state.authorById = Object.fromEntries(state.authors.map(a => [a.id, a]));
  }

  // 增量合并（用于 admin draft 覆盖 server 数据）。
  // 策略分两类：
  //   - ID_MERGE_FIELDS: posts/authors/dramas/films/masters → 按 id 合并，保留 server 新增 + draft 修改
  //   - REPLACE_FIELDS: 其它（channels/subChannels/user/banners 等）→ draft 有就整体覆盖
  // 这样可以避免旧草稿擦掉 server 新增字段（subChannels）+ 新种子帖。
  const ID_MERGE_FIELDS = ['posts', 'authors', 'dramas', 'films', 'masters'];
  // admin 后台有编辑入口的字段 → draft 有就替换
  const REPLACE_FIELDS = [
    'channels', 'subChannels', 'user',
    'hotSearches', 'banners', 'vipTiers', 'vipBenefits',
  ];
  // admin 后台没有编辑入口的字段 → 永远用 server,忽略 draft (防止旧 draft 擦掉
  // server 端新加的字段, 比如 notifications 的 targetUrl)
  const SERVER_ONLY_FIELDS = [
    'comments', 'liveMessages', 'liveIncomingPool',
    'notifications', 'dms', 'searchSuggestions',
  ];
  function mergeDraft(draft) {
    const replaced = [];
    const idMerged = {};
    const missing = [];
    const skippedServerOnly = [];
    // 1. 整体替换的字段
    for (const k of REPLACE_FIELDS) {
      if (k in draft && draft[k] !== undefined && draft[k] !== null) {
        state[k] = draft[k];
        replaced.push(k);
      } else {
        missing.push(k);
      }
    }
    // 2. by-id 合并的字段
    for (const k of ID_MERGE_FIELDS) {
      if (k in draft && Array.isArray(draft[k])) {
        const serverArr = state[k] || [];
        const draftArr = draft[k];
        const map = new Map(serverArr.map(item => [item.id, item]));
        for (const item of draftArr) {
          if (item && item.id) map.set(item.id, item);
        }
        const beforeLen = serverArr.length;
        state[k] = Array.from(map.values());
        idMerged[k] = { server: beforeLen, draft: draftArr.length, total: state[k].length };
      } else {
        missing.push(k);
      }
    }
    // 3. SERVER_ONLY: 永远忽略 draft 里的这些字段 (避免 draft 擦掉 server 新字段)
    for (const k of SERVER_ONLY_FIELDS) {
      if (k in draft) skippedServerOnly.push(k);
    }
    // 重建 authorById
    state.authorById = Object.fromEntries((state.authors || []).map(a => [a.id, a]));
    return { replaced, idMerged, missing, skippedServerOnly };
  }

  // 读取 admin 草稿（如果有）。结构：{ data: {完整 site-data 快照}, savedAt }
  // 返回 draft.data 或 null
  function loadDraft() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.data) return null;
      return parsed.data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[QD] admin 草稿解析失败，忽略草稿继续用服务器数据:', e.message);
      return null;
    }
  }

  // 标记，供 UI 检测"是否正在预览草稿"
  state.__hasDraft = false;

  // 读取用户发布的帖子 (localStorage 'qd-user-posts')
  // 这些帖子永远在 QD.posts 最前面 (按 createdAt 倒序)
  function loadUserPosts() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem('qd-user-posts');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.warn('[QD] qd-user-posts 解析失败，忽略:', e.message);
      return [];
    }
  }

  // 把用户帖子合并进 state.posts (插在最前面,按 createdAt 倒序)
  function mergeUserPosts() {
    const userPosts = loadUserPosts();
    if (!userPosts.length) return 0;
    // 去重: 如果 server / draft 里已有同 id, 用 user 版覆盖
    const map = new Map(state.posts.map(p => [p.id, p]));
    for (const up of userPosts) {
      if (up && up.id) map.set(up.id, up);
    }
    state.posts = Array.from(map.values());
    // 按 createdAt 倒序 (新帖在前)
    state.posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return userPosts.length;
  }

  let readyPromise = null;
  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      let serverData = null;
      let v2Data = null;
      try {
        const [r1, r2] = await Promise.all([
          fetch(DATA_URL, { cache: 'no-store' }),
          fetch(CHANNELS_V2_URL, { cache: 'no-store' }),
        ]);
        if (!r1.ok) throw new Error('site-data HTTP ' + r1.status);
        if (!r2.ok) throw new Error('channels-v2 HTTP ' + r2.status);
        serverData = await r1.json();
        v2Data = await r2.json();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[QD] 加载失败，使用降级数据：', err.message || err);
        applyData(fallback);
        const draftF = loadDraft();
        if (draftF) { applyData(draftF); state.__hasDraft = true; }
        mergeUserPosts();
        return state;
      }
      // 1. site-data.json → 灌入 posts / users / messages / 旧 channels
      applyData(serverData);
      state.legacyChannels = serverData.channels || [];
      state.legacySubChannels = serverData.subChannels || [];
      const serverSnapshot = {
        posts: state.posts.length,
        legacyChannels: state.legacyChannels.length,
        legacySubChannels: state.legacySubChannels.length,
        dramas: state.dramas.length,
      };
      // 2. admin 草稿合并 (可能改 channels/posts/users 等)
      const draft = loadDraft();
      if (draft) {
        const result = mergeDraft(draft);
        state.__hasDraft = true;
        // eslint-disable-next-line no-console
        console.log('[QD] 已合并 admin 草稿（本地预览）', {
          server: serverSnapshot,
          draft_replaced: result.replaced,
          draft_id_merged: result.idMerged,
        });
      }
      // 3. channels-v2.json overlay → 永远赢 (Commit 3: 新结构生效)
      const { newChannels, newSubs } = adaptChannelsV2(v2Data);
      state.channels = newChannels;
      state.subChannels = newSubs;
      // 4. 用户本地帖子最后合并
      const userN = mergeUserPosts();
      // eslint-disable-next-line no-console
      console.log('[QD] 数据已加载', {
        channels_v2: state.channels.length,
        subChannels_v2: state.subChannels.length,
        legacy_channels: state.legacyChannels.length,
        posts: state.posts.length,
        user_posts: userN,
        site_version: (v2Data.site && v2Data.site.version) || 'unknown',
      });
      return state;
    })();
    return readyPromise;
  }

  // 暴露：让前端知道是否有草稿（草稿横条用）
  function hasDraft() {
    return !!state.__hasDraft;
  }

  /* ---------- 装配公开 API ----------
     既要保持 QD.channels / QD.posts 等直接属性访问（兼容现有代码），
     又要暴露 helpers 与 ready()。所以把 helpers 直接挂到 state 上。
  ---------------------------------------- */
  return Object.assign(state, {
    postById,
    channelById,
    subChannelById,
    subChannelsOf,
    authorOf,
    fmtNum,
    fmtTime,
    ready,
    hasDraft,
  });
})();
