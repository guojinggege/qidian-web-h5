/* ============================================================
   奇点社区 · Data Layer (异步加载器)
   ------------------------------------------------------------
   - 同步创建 window.QD，先用空数组占位
   - QD.ready() 返回 Promise，内部 fetch ../data/site-data.json
   - 加载失败降级到最小兜底数据，页面不会完全空白
   - 保持原有同名 API：QD.channels / QD.posts / QD.user 等
   - 新增：QD.films / QD.banners / QD.fmtTime
============================================================ */

window.QD = (function () {

  /* ---------- 同步初始化：空 state ---------- */
  const state = {
    channels: [],
    subChannels: [],
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
    return state.channels.find(c => c.id === id);
  }
  function subChannelById(id) {
    if (!id) return null;
    return (state.subChannels || []).find(s => s.id === id);
  }
  function subChannelsOf(channelId) {
    return (state.subChannels || []).filter(s => s.parentId === channelId);
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
  // 根目录的 index.html 不加载 data.js，所以统一用 '../data/site-data.json' 即可。
  const DATA_URL = '../data/site-data.json';
  // admin 用同一个 key 暂存草稿；前台 fetch 完后合并它来实现"本地预览"
  const DRAFT_KEY = 'qd-admin-state-v1';

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
    readyPromise = fetch(DATA_URL, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(d => {
        // 先用服务器数据
        applyData(d);
        const serverSnapshot = {
          posts: state.posts.length,
          channels: state.channels.length,
          subChannels: state.subChannels.length,
          dramas: state.dramas.length,
          films: state.films.length,
        };
        // 再"增量合并" admin 草稿（如果有）。增量 = 只覆盖 draft 实际存在的字段。
        // 这样旧草稿不会擦掉 server 端新增的 subChannels 等字段。
        const draft = loadDraft();
        if (draft) {
          const result = mergeDraft(draft);
          state.__hasDraft = true;
          const newSnapshot = {
            posts: state.posts.length,
            channels: state.channels.length,
            subChannels: state.subChannels.length,
            dramas: state.dramas.length,
            films: state.films.length,
          };
          // eslint-disable-next-line no-console
          console.log('[QD] 已合并 admin 草稿（本地预览）', {
            server: serverSnapshot,
            after_merge: newSnapshot,
            draft_replaced: result.replaced,
            draft_id_merged: result.idMerged,
            draft_missing_kept_from_server: result.missing,
          });
          // 草稿"过时"检测：草稿缺 subChannels 但 server 有 → 提示
          if (!('subChannels' in draft) && serverSnapshot.subChannels > 0) {
            console.warn('[QD] ⚠️ 检测到旧草稿（不含 subChannels 字段）。subChannels 已保留服务器数据。如果 admin 编辑过的内容显示不对，可去 admin 点"重置"清空草稿。');
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('[QD] 数据已加载', serverSnapshot);
        }
        // 最后合并用户发布的帖子 (独立 namespace qd-user-posts)
        const userN = mergeUserPosts();
        if (userN) {
          // eslint-disable-next-line no-console
          console.log('[QD] 已合并', userN, '条用户帖子 (qd-user-posts) · 总 posts:', state.posts.length);
        }
        return state;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('[QD] 加载失败，使用降级数据：', err.message || err);
        applyData(fallback);
        // fetch 失败时仍尝试用 admin 草稿（如果有）
        const draft = loadDraft();
        if (draft) {
          applyData(draft);
          state.__hasDraft = true;
        }
        // 同样合并用户帖子
        mergeUserPosts();
        return state;
      });
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
