/* ============================================================
   奇点社区 · Shared interaction helpers
============================================================ */

window.QDC = (function () {
  const QD = window.QD;

  /* ---------- DOM helpers ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  };
  const escape = (s = '') => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------- 频道页 URL ---------- */
  // 11 个频道每个都有专属页：drama / fortune 是历史特殊页，其他都是 {id}-channel.html
  function channelPageUrl(channelId) {
    if (!channelId) return 'home.html';
    if (channelId === 'drama')   return 'drama-channel.html';
    if (channelId === 'fortune') return 'divination-channel.html';
    return channelId + '-channel.html';
  }

  /* ---------- Templates ---------- */
  function tplAvatar(user, size = '') {
    if (!user) return `<div class="avatar ${size}"></div>`;
    const cls = ['avatar', size, user.avatar || 'bg-grad-1', 'has-bg'].filter(Boolean).join(' ');
    const initial = (user.name || user.username || '?').slice(0, 1);
    const ring = user.vip ? 'vip-ring' : '';
    return `<div class="${cls} ${ring}">${initial}${user.vip ? '<div class="vip-flag"></div>' : ''}</div>`;
  }

  function tplChannelPill(ch) {
    if (!ch) return '';
    return `<span class="ch-pill ${ch.color}"><i class="ti ${ch.icon} ico"></i>${ch.name}</span>`;
  }

  function tplPostCard(post) {
    const ch = QD.channelById(post.channelId);
    const author = QD.authorOf(post);
    // 安全提取 images（防止格式错误）
    const images = Array.isArray(post.images) ? post.images.filter(u => typeof u === 'string') : [];
    const thumbs = Array.isArray(post.thumbs) ? post.thumbs : [];
    let media = '';
    if (post.type === 'video' && post.thumb) {
      media = `<div class="post-thumb video" style="background-image:${post.thumb}"></div>`;
    } else if (post.type === 'gallery') {
      // 优先 images，兜底 thumbs
      const cells = images.length
        ? images.slice(0, 9).map(u => `<div class="cell" style="background-image:url('${u.replace(/'/g, '%27')}')"></div>`)
        : thumbs.map(t => `<div class="cell" style="background-image:${t}"></div>`);
      if (cells.length) media = `<div class="post-thumb-grid">${cells.join('')}</div>`;
    } else if (post.type === 'text' && images.length) {
      // 图文帖：在卡片下方显示前 3 张图墙
      const cells = images.slice(0, 3).map(u => `<div class="cell" style="background-image:url('${u.replace(/'/g, '%27')}')"></div>`);
      media = `<div class="post-thumb-grid">${cells.join('')}</div>`;
    }
    const vipBadge = post.vipLocked ? `<span class="badge gold"><i class="ti ti-crown"></i>VIP</span>` : '';
    const hotBadge = post.hot ? `<span class="badge danger"><i class="ti ti-flame"></i>热议</span>` : '';
    const chHref     = channelPageUrl(ch && ch.id);
    const authorHref = `profile.html?uid=${author.id}`;
    const postHref   = `post-detail.html?id=${post.id}`;
    // stopPropagation() 让内部锚点链接不会触发整卡片跳转
    const stop = `event.stopPropagation()`;

    // 频道徽章带 r/ 前缀（reddit 风格,仅卡片上）
    const chPillHtml = ch
      ? `<span class="ch-pill ${ch.color}"><i class="ti ${ch.icon} ico"></i>r/${ch.id} · ${escape(ch.name)}</span>`
      : '';
    // 子频道徽章（轻量,可选）
    const subCh = post.subChannelId ? (QD.subChannelById && QD.subChannelById(post.subChannelId)) : null;
    const subPillHtml = subCh
      ? `<span onclick="${stop};location.href='${channelPageUrl(post.channelId)}?sub=${subCh.id}'" style="cursor:pointer;display:inline-flex">
           <span class="ch-pill ${subCh.color}" style="opacity:0.85"><i class="ti ${subCh.icon} ico"></i>${escape(subCh.name)}</span>
         </span>`
      : '';

    return `
      <article class="post-card" data-post-id="${post.id}" onclick="location.href='${postHref}'" style="cursor:pointer">
        <div class="post-meta">
          <span onclick="${stop};location.href='${chHref}'" style="cursor:pointer;display:inline-flex">${chPillHtml}</span>
          ${subPillHtml}
          <span onclick="${stop};location.href='${authorHref}'" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
            ${tplAvatar(author, 'sm')}
            <span class="comment-name t-sm">${escape(author.name)}</span>
          </span>
          <span class="dot-sep"></span>
          <span>${escape(QD.fmtTime(post.createdAt) || post.createdAtText || '')}</span>
          ${hotBadge} ${vipBadge}
        </div>
        <h3 class="post-title">${escape(post.title)}</h3>
        ${post.excerpt ? `<p class="post-excerpt line-clamp-3">${escape(post.excerpt)}</p>` : ''}
        ${media}
        <div class="post-actions">
          <span class="pa"><i class="ti ti-arrow-big-up"></i>${QD.fmtNum(post.stats.up)}</span>
          <span class="pa"><i class="ti ti-arrow-big-down"></i></span>
          <span class="pa"><i class="ti ti-message-circle"></i>${QD.fmtNum(post.stats.comments)}</span>
          <span class="pa live"><i class="ti ti-broadcast"></i>${post.stats.liveOnline} 在线</span>
          <span class="pa"><i class="ti ti-share-3"></i>${QD.fmtNum(post.stats.share)}</span>
          <span class="pa" style="margin-left:auto"><i class="ti ti-bookmark"></i></span>
        </div>
      </article>
    `;
  }

  function tplLiveMessage(msg) {
    const author = msg.system ? null : QD.authorById[msg.authorId];
    if (msg.system) {
      return `<div class="live-msg sys"><div class="live-msg-body"><div class="live-msg-text">— ${escape(msg.text)} —</div></div></div>`;
    }
    const isBrand = author && author.vip;
    return `
      <div class="live-msg ${isBrand ? 'brand' : ''}">
        ${tplAvatar(author, 'sm')}
        <div class="live-msg-body">
          <div class="live-msg-head">
            <span class="live-msg-name">${escape(author?.name || 'Anon')}</span>
            <span class="live-msg-time">${escape(msg.time || '刚刚')}</span>
          </div>
          <div class="live-msg-text">${escape(msg.text)}</div>
        </div>
      </div>
    `;
  }

  function tplComment(c, indent = 0) {
    const a = QD.authorById[c.authorId];
    const nested = (c.replies || []).map(r => tplComment(r, indent + 1)).join('');
    return `
      <div class="comment">
        ${tplAvatar(a, 'md')}
        <div class="comment-body">
          <div class="comment-head">
            <span class="comment-name">${escape(a?.name || 'Anon')}</span>
            <span>Lv.${a?.level || 1}</span>
            ${c.vipFlair ? '<span class="badge gold">VIP</span>' : ''}
            <span class="dot-sep"></span>
            <span>${escape(c.time)}</span>
          </div>
          <div class="comment-text">${escape(c.text)}</div>
          <div class="comment-actions">
            <span><i class="ti ti-arrow-big-up"></i> ${c.up || 0}</span>
            <span><i class="ti ti-arrow-big-down"></i></span>
            <span><i class="ti ti-message-circle"></i> 回复</span>
            <span><i class="ti ti-dots"></i></span>
          </div>
          ${nested ? `<div class="nested">${nested}</div>` : ''}
        </div>
      </div>
    `;
  }

  /* ---------- Live room simulator ----------
     Element should have .live-room-body inside. Calls every 3-5s
     to push a new message from the pool, auto-scrolls to bottom.
  -------------------------------------------- */
  function startLiveRoom(rootEl, postId) {
    if (!rootEl) return () => {};
    const body = rootEl.querySelector('.live-room-body') || rootEl;
    const seeded = QD.liveMessages.filter(m => !postId || m.postId === postId);
    body.innerHTML = seeded.map(tplLiveMessage).join('');
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });

    const pool = QD.liveIncomingPool.slice();
    let i = 0;
    const push = () => {
      const tmpl = pool[i % pool.length];
      const msg = Object.assign({}, tmpl, { time: '刚刚', postId });
      const html = tplLiveMessage(msg);
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const node = wrap.firstElementChild;
      body.appendChild(node);
      // virtual-scroll cap: keep last 50
      while (body.children.length > 50) body.removeChild(body.firstChild);
      // auto-scroll only if user is near bottom
      const nearBottom = body.scrollHeight - body.scrollTop - body.clientHeight < 80;
      if (nearBottom) body.scrollTop = body.scrollHeight;
      i++;
    };
    const tick = () => {
      push();
      const delay = 2500 + Math.random() * 2500;
      timer = setTimeout(tick, delay);
    };
    let timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }

  /* ---------- Sidebar renderer (Web) ---------- */
  function renderSidebar(rootEl, activeChannel = null) {
    const subs = QD.channels.filter(c => c.subscribed);
    const all = QD.channels;
    // 1) 显式传参；2) body.dataset.channel；3) URL ?ch=（向后兼容）
    const path = location.pathname;
    const basename = path.substring(path.lastIndexOf('/') + 1) || 'home.html';
    const bodyCh = document.body && document.body.dataset && document.body.dataset.channel;
    const urlCh = new URLSearchParams(location.search).get('ch');
    const ch = activeChannel || bodyCh || urlCh || null;
    const isNav = (target) => basename === target;
    // 首页热门只在 home.html 且不在频道上下文时高亮
    const isHome = basename === 'home.html' && !ch;
    const activeClass = (cond) => cond ? 'active' : '';

    rootEl.innerHTML = `
      <div class="sidebar-section">
        <div class="sidebar-title">导航</div>
        <a class="sidebar-link ${activeClass(isHome)}" href="home.html"><i class="ti ti-flame"></i>首页热门</a>
        <a class="sidebar-link ${activeClass(isNav('messages.html'))}" href="messages.html"><i class="ti ti-bell"></i>消息中心<span class="badge">3</span></a>
        <a class="sidebar-link ${activeClass(isNav('creator-center.html'))}" href="creator-center.html"><i class="ti ti-chart-bar"></i>创作者中心</a>
        <a class="sidebar-link ${activeClass(isNav('vip.html'))}" href="vip.html"><i class="ti ti-crown" style="color:#FFD700"></i>黑卡会员</a>
        <a class="sidebar-link ${activeClass(isNav('profile.html'))}" href="profile.html"><i class="ti ti-user"></i>我的主页</a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">已订阅频道 <span style="cursor:pointer"><i class="ti ti-plus"></i></span></div>
        ${subs.map(c => `
          <a class="sidebar-channel ${activeClass(ch === c.id)}" href="${channelPageUrl(c.id)}">
            <span class="ch-dot" style="background:var(--c-${c.color})"></span>
            <span>${c.name}</span>
            <span class="unread ${c.unread > 0 ? 'has' : ''}">${c.unread > 0 ? c.unread : ''}</span>
          </a>
        `).join('')}
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">发现频道</div>
        ${all.filter(c => !c.subscribed).map(c => `
          <a class="sidebar-channel ${activeClass(ch === c.id)}" href="${channelPageUrl(c.id)}">
            <span class="ch-dot" style="background:var(--c-${c.color})"></span>
            <span>${c.name}</span>
            <span class="unread">${QD.fmtNum(c.online)}在线</span>
          </a>
        `).join('')}
      </div>

      <div class="sidebar-section">
        <a class="sidebar-link" href="vip.html" style="background:linear-gradient(135deg,rgba(255,215,0,0.10),rgba(229,170,0,0.05));border:1px solid rgba(255,215,0,0.30)">
          <i class="ti ti-crown" style="color:#FFD700"></i>
          <span>升级黑卡会员</span>
        </a>
      </div>
    `;
  }

  /* ---------- 草稿预览横条 ----------
     当 QD 检测到 localStorage 里有 admin 草稿时，自动在 body 顶部插入一条提示。
     右侧 X 关闭后写 sessionStorage，本会话不再弹（关闭浏览器重新打开会再弹）。
  ----------------------------------------- */
  function injectDraftBannerStyles() {
    if (document.getElementById('qdc-draft-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'qdc-draft-banner-styles';
    style.textContent = `
      #qdc-draft-banner {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 16px;
        background: linear-gradient(180deg, rgba(212,160,74,0.18), rgba(212,160,74,0.10));
        border-bottom: 1px solid rgba(212,160,74,0.40);
        color: var(--warning);
        font-size: 12.5px;
        font-weight: 500;
      }
      #qdc-draft-banner i.ti { font-size: 16px; }
      #qdc-draft-banner a {
        color: var(--warning);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      #qdc-draft-banner a:hover { color: #FFD700; }
      #qdc-draft-banner .grow { flex: 1; }
      #qdc-draft-banner button.close {
        background: transparent;
        border: none;
        color: var(--warning);
        cursor: pointer;
        padding: 4px 8px;
        font-size: 18px;
        line-height: 1;
        border-radius: 4px;
      }
      #qdc-draft-banner button.close:hover { background: rgba(212,160,74,0.20); }
    `;
    document.head.appendChild(style);
  }

  function maybeShowDraftBanner() {
    // 不显示场景：无草稿；用户已 dismiss；某些不需要的页面（这里不限制，由调用方决定）
    if (!QD || !QD.hasDraft || !QD.hasDraft()) return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('qd-draft-banner-dismissed') === '1') return;
    if (document.getElementById('qdc-draft-banner')) return; // 已存在
    injectDraftBannerStyles();

    const bar = document.createElement('div');
    bar.id = 'qdc-draft-banner';
    // admin 入口位置：前台都在 /web 子目录，所以 ../admin/。从根目录则用 admin/。
    const adminHref = location.pathname.includes('/web/') || location.pathname.includes('/h5/')
      ? '../admin/'
      : 'admin/';
    bar.innerHTML = `
      <i class="ti ti-edit"></i>
      <span class="grow">📝 当前预览<b>本地草稿</b>（仅你的浏览器可见）· <a href="${adminHref}">前往 admin 导出发布 →</a></span>
      <button class="close" title="关闭本会话不再提示">✕</button>
    `;
    bar.querySelector('.close').addEventListener('click', () => {
      try { sessionStorage.setItem('qd-draft-banner-dismissed', '1'); } catch (e) {}
      bar.remove();
    });
    // 插到 body 顶部（在 app-shell 之前）
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ---------- Header renderer ---------- */
  function renderHeader(rootEl, opts = {}) {
    // 渲染 header 同时尝试插入草稿横条（每个前台页都调 renderHeader → 自动得到横条）
    maybeShowDraftBanner();


    // 发帖按钮如果当前在某频道下，自动带 ch 参数
    const curCh = new URLSearchParams(location.search).get('ch') || '';
    const editorHref = 'post-editor.html' + (curCh ? '?ch=' + encodeURIComponent(curCh) : '');
    // 搜索框预填当前 ?q= 值（来自 search.html）
    const curQ = new URLSearchParams(location.search).get('q') || '';

    rootEl.innerHTML = `
      <div class="header">
        <a class="logo" href="home.html">
          <span class="logo-mark">奇</span>
          <span>奇点社区</span>
        </a>
        <div class="search-bar">
          <i class="ti ti-search"></i>
          <input id="qd-search-input" placeholder="搜帖子、用户、频道..." value="${escape(curQ)}"
                 onkeydown="if(event.key==='Enter'){const q=this.value.trim();location.href='search.html'+(q?('?q='+encodeURIComponent(q)):'');}">
          <kbd>↵</kbd>
        </div>
        <button class="icon-btn" title="发布新帖" onclick="location.href='${editorHref}'"><i class="ti ti-pencil-plus"></i></button>
        <button class="icon-btn" title="通知" onclick="location.href='messages.html'"><i class="ti ti-bell"></i></button>
        <a class="row gap-2" href="profile.html" style="text-decoration:none">
          ${tplAvatar(Object.assign({ name: QD.user.username, vip: QD.user.vip.active }, { avatar: QD.user.avatar }), 'sm')}
          <span class="t-sm c-2">${escape(QD.user.username)}</span>
        </a>
      </div>
    `;
  }

  /* ---------- Channel page styles (一次性注入) ---------- */
  function injectChannelStyles() {
    if (document.getElementById('qdc-ch-styles')) return;
    const style = document.createElement('style');
    style.id = 'qdc-ch-styles';
    style.textContent = `
      .ch-page-pad { padding: 20px 28px 40px; max-width: 900px; margin: 0 auto; }
      .ch-hero {
        display: flex; align-items: center; gap: 20px;
        padding: 26px 30px;
        margin-bottom: 20px;
        border-radius: var(--r-xl);
        border: 1px solid var(--border-2);
        position: relative; overflow: hidden;
        min-height: 160px;
      }
      .ch-hero::before {
        content: ''; position: absolute;
        top: -50%; right: -10%;
        width: 380px; height: 380px;
        background: radial-gradient(circle, var(--ch-glow, rgba(255,255,255,0.10)), transparent 60%);
        pointer-events: none;
      }
      .ch-hero > * { position: relative; }
      .ch-hero-icon {
        width: 64px; height: 64px;
        border-radius: var(--r-lg);
        display: flex; align-items: center; justify-content: center;
        font-size: 32px;
        flex-shrink: 0;
      }
      .ch-hero-info { flex: 1; min-width: 0; }
      .ch-hero-info h1 { margin: 0 0 4px; font-size: 28px; font-weight: 500; letter-spacing: -0.3px; }
      .ch-hero-info p { margin: 0 0 10px; color: var(--text-2); font-size: 14px; }
      .ch-hero-stats { display: flex; align-items: center; gap: 8px; color: var(--text-3); font-size: 12px; }
      .ch-hero-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
      .ch-empty {
        padding: 60px 24px; text-align: center;
        background: var(--bg-card);
        border-radius: var(--r-lg);
        border: 1px dashed var(--border-2);
        color: var(--text-3);
      }
      .ch-empty i { font-size: 48px; color: var(--text-4); display: block; margin-bottom: 12px; }
      .ch-empty h3 { margin: 0 0 6px; font-weight: 500; color: var(--text-2); font-size: 15px; }
      .ch-empty p { margin: 0 0 18px; font-size: 13px; }

      /* 子频道导航条 */
      .ch-sub-nav {
        display: flex;
        gap: 6px;
        padding: 4px 0 16px;
        overflow-x: auto;
        scrollbar-width: none;
        margin: 0 0 14px;
        border-bottom: 1px solid var(--border-1);
      }
      .ch-sub-nav::-webkit-scrollbar { display: none; }
      .ch-sub-tab {
        flex-shrink: 0;
        padding: 6px 12px;
        font-size: 12px;
        color: var(--text-2);
        background: var(--bg-card);
        border: 1px solid var(--border-1);
        border-radius: var(--r-pill);
        cursor: pointer;
        text-decoration: none;
        white-space: nowrap;
        display: inline-flex; align-items: center; gap: 4px;
      }
      .ch-sub-tab:hover { background: var(--bg-elev); color: var(--text-1); }
      .ch-sub-tab.active {
        background: var(--brand-bg);
        color: var(--brand-200);
        border-color: rgba(127,119,221,0.40);
      }
      .ch-sub-tab .cnt {
        font-size: 10px;
        opacity: 0.7;
      }
      .ch-sub-tab i { font-size: 12px; opacity: 0.7; }
    `;
    document.head.appendChild(style);
  }

  /* ---------- Channel page renderer ---------- */
  // 9 个普通频道页都通过这个函数渲染。drama / fortune 是历史专属页，不走这里。
  function renderChannelPage(channelId) {
    const ch = QD.channelById(channelId);
    if (!ch) {
      document.body.innerHTML = `
        <div style="padding:80px 20px;text-align:center;color:var(--text-2)">
          <h2>频道不存在</h2>
          <p>channelId = <code>${channelId}</code></p>
          <a class="btn btn-primary" href="home.html"><i class="ti ti-arrow-left"></i> 返回首页</a>
        </div>
      `;
      return;
    }

    // 读 URL ?sub= 参数确定当前子频道筛选
    const urlParams = new URLSearchParams(location.search);
    const subChannels = QD.subChannelsOf(channelId);
    const subById = Object.fromEntries(subChannels.map(s => [s.id, s]));
    const urlSubRaw = urlParams.get('sub');
    let activeSub = urlSubRaw && subById[urlSubRaw] ? urlSubRaw : null;
    const activeSubCh = activeSub ? subById[activeSub] : null;

    document.title = (activeSubCh ? activeSubCh.name + ' · ' : '') + ch.name + ' · 奇点社区';
    document.body.dataset.channel = channelId;
    injectChannelStyles();

    // Header + Sidebar
    renderHeader($('#header'));
    renderSidebar($('#sidebar'));

    // 三栏 grid 覆盖：频道页保留右栏（实时房）
    const shell = document.querySelector('.app-shell');
    shell.style.gridTemplateColumns = 'var(--sidebar-w) 1fr var(--rightbar-w)';
    shell.style.gridTemplateAreas = '"header header header" "sidebar main rightbar"';

    // 该频道全部帖子（用于计数 + 全部 tab）
    const all = QD.posts.filter(p => p.channelId === channelId);
    // 每个子频道帖子计数
    const subCounts = {};
    subChannels.forEach(s => {
      subCounts[s.id] = all.filter(p => p.subChannelId === s.id).length;
    });

    // 主区
    const main = $('#channelMain');
    main.innerHTML = `
      <div class="ch-page-pad">
        <div class="ch-hero" style="background: linear-gradient(135deg, var(--c-${ch.color}-bg), var(--bg-card) 70%); --ch-glow: var(--c-${ch.color}-bg)">
          <div class="ch-hero-icon" style="background: var(--c-${ch.color}-bg); color: var(--c-${ch.color})">
            <i class="ti ${ch.icon}"></i>
          </div>
          <div class="ch-hero-info">
            <h1>r/${ch.id} · ${escape(ch.name)}</h1>
            <p>${escape(ch.desc)}</p>
            <div class="ch-hero-stats">
              <span><i class="ti ti-users"></i> ${QD.fmtNum(ch.members)} 成员</span>
              <span class="dot-sep"></span>
              <span class="live-dot" style="font-size:11px">${QD.fmtNum(ch.online)} 在线</span>
              <span class="dot-sep"></span>
              <span>等级 ${ch.level}</span>
            </div>
          </div>
          <div class="ch-hero-actions">
            <button class="btn ${ch.subscribed ? '' : 'btn-primary'}">
              <i class="ti ${ch.subscribed ? 'ti-check' : 'ti-plus'}"></i>
              ${ch.subscribed ? '已订阅' : '订阅'}
            </button>
            <a class="btn btn-primary" href="post-editor.html?ch=${ch.id}">
              <i class="ti ti-pencil-plus"></i> 发帖
            </a>
          </div>
        </div>

        <nav class="ch-sub-nav" id="subNav">
          <a class="ch-sub-tab ${!activeSub ? 'active' : ''}" data-sub="" href="${channelPageUrl(channelId)}">
            <i class="ti ti-stack-2"></i>全部 <span class="cnt">· ${all.length}</span>
          </a>
          ${subChannels.map(s => `
            <a class="ch-sub-tab ${activeSub === s.id ? 'active' : ''}" data-sub="${s.id}" href="${channelPageUrl(channelId)}?sub=${s.id}" title="${escape(s.desc)}">
              <i class="ti ${s.icon}"></i>r/${s.id} ${escape(s.name)} <span class="cnt">· ${subCounts[s.id] || 0}</span>
            </a>
          `).join('')}
        </nav>

        <div class="feed-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h2 id="feedTitle" style="font-size:18px;font-weight:500;margin:0">${activeSubCh ? escape(activeSubCh.name) : escape(ch.name)} · 推荐</h2>
          <div class="seg" id="feedTabs">
            <div class="seg-item active" data-mode="recommend">推荐</div>
            <div class="seg-item" data-mode="latest">最新</div>
            <div class="seg-item" data-mode="hot">热门</div>
            <div class="seg-item" data-mode="oldest">最早</div>
          </div>
        </div>

        <div class="feed-list" id="feed" style="display:flex;flex-direction:column;gap:12px"></div>
      </div>
    `;

    // 推荐分数：stats.up + 新鲜度加成
    function recommendScore(p) {
      const ageMs = Math.max(0, Date.now() - new Date(p.createdAt).getTime());
      const ageHours = Math.max(0.1, ageMs / 3600000);
      return (p.stats?.up || 0) + 5000 / ageHours;
    }
    function getList(mode) {
      // 先按 activeSub 过滤
      let arr = activeSub ? all.filter(p => p.subChannelId === activeSub) : all.slice();
      if (mode === 'recommend') return arr.sort((a, b) => recommendScore(b) - recommendScore(a));
      if (mode === 'latest')    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (mode === 'hot')       return arr.sort((a, b) => {
        if ((b.hot ? 1 : 0) !== (a.hot ? 1 : 0)) return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
        return b.stats.up - a.stats.up;
      });
      if (mode === 'oldest')    return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return arr;
    }
    function paintFeed(mode) {
      const list = getList(mode);
      const feed = $('#feed');
      if (!list.length) {
        const subName = activeSubCh ? activeSubCh.name : ch.name;
        feed.innerHTML = `
          <div class="ch-empty">
            <i class="ti ti-mood-empty"></i>
            <h3>${escape(subName)} 暂时还没有帖子</h3>
            <p>等待你的第一篇内容</p>
            <a class="btn btn-primary" href="post-editor.html?ch=${ch.id}${activeSub ? '&sub=' + activeSub : ''}">
              <i class="ti ti-pencil-plus"></i> 来发第一篇
            </a>
          </div>
        `;
        return;
      }
      feed.innerHTML = list.map(p => tplPostCard(p)).join('');
    }
    paintFeed('recommend');

    $$('#feedTabs .seg-item').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('#feedTabs .seg-item').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        const titleMap = { recommend: '推荐', latest: '最新', hot: '热门', oldest: '最早' };
        const baseName = activeSubCh ? activeSubCh.name : ch.name;
        $('#feedTitle').textContent = baseName + ' · ' + titleMap[tab.dataset.mode];
        paintFeed(tab.dataset.mode);
      });
    });

    // 右栏：实时房 + 热搜
    $('#rightbar').innerHTML = `
      <div class="rightbar-card">
        <div class="rightbar-title row-between">
          <span><i class="ti ti-broadcast" style="color:var(--live)"></i> 实时房 · ${escape(ch.name)}</span>
          <span class="live-dot">LIVE</span>
        </div>
        <div class="live-room" style="height:540px">
          <div class="live-room-body" id="liveBody"></div>
          <div class="live-room-foot">
            <input class="live-input" placeholder="说点什么...">
            <button class="icon-btn"><i class="ti ti-send"></i></button>
          </div>
        </div>
      </div>

      <div class="rightbar-card">
        <div class="rightbar-title"><i class="ti ti-trending-up"></i> 热搜榜</div>
        ${QD.hotSearches.map((h, i) => `
          <div class="row gap-2" style="padding:8px 0; border-bottom:1px solid var(--border-1); cursor:pointer"
               onclick="location.href='search.html?q='+encodeURIComponent('${h.q.replace(/'/g, "\\'")}')">
            <span class="${i < 3 ? 'c-brand' : 'c-3'} t-sm f-medium" style="width:18px">${i+1}</span>
            <span class="grow ellipsis">${h.q}</span>
            <span class="badge ${h.delta.includes('NEW') ? 'brand' : h.delta === '热' ? 'danger' : ''} t-xs">${h.delta}</span>
          </div>
        `).join('')}
      </div>
    `;

    // 实时房：取该频道首帖 id，否则 fallback p001（让消息流仍能工作）
    const firstPost = all[0];
    startLiveRoom(document.querySelector('.live-room'), firstPost ? firstPost.id : 'p001');
  }

  /* ---------- Bottom nav (H5) ---------- */
  function renderH5TabBar(rootEl, active = 'home') {
    rootEl.outerHTML = `
      <nav class="h5-tabbar">
        <a class="h5-tab ${active==='home' ? 'active' : ''}" href="home.html"><i class="ti ti-home"></i>首页</a>
        <a class="h5-tab ${active==='channels' ? 'active' : ''}" href="channels.html"><i class="ti ti-grid-dots"></i>频道</a>
        <a class="h5-tab center" href="post-editor.html"><i class="ti ti-circle-plus-filled"></i></a>
        <a class="h5-tab ${active==='messages' ? 'active' : ''}" href="messages.html"><i class="ti ti-bell"></i>消息</a>
        <a class="h5-tab ${active==='profile' ? 'active' : ''}" href="profile.html"><i class="ti ti-user"></i>我的</a>
      </nav>
    `;
  }

  return { $, $$, el, escape, channelPageUrl, tplAvatar, tplChannelPill, tplPostCard, tplLiveMessage, tplComment, startLiveRoom, renderSidebar, renderHeader, renderChannelPage, renderH5TabBar, maybeShowDraftBanner };
})();
