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
    let media = '';
    if (post.type === 'video' && post.thumb) {
      media = `<div class="post-thumb video" style="background-image:${post.thumb}"></div>`;
    } else if (post.type === 'gallery' && post.thumbs) {
      media = `<div class="post-thumb-grid">${post.thumbs.map(t => `<div class="cell" style="background-image:${t}"></div>`).join('')}</div>`;
    }
    const vipBadge = post.vipLocked ? `<span class="badge gold"><i class="ti ti-crown"></i>VIP</span>` : '';
    const hotBadge = post.hot ? `<span class="badge danger"><i class="ti ti-flame"></i>热议</span>` : '';

    return `
      <article class="post-card" data-post-id="${post.id}">
        <div class="post-meta">
          ${tplChannelPill(ch)}
          ${tplAvatar(author, 'sm')}
          <span class="comment-name t-sm">${escape(author.name)}</span>
          <span class="dot-sep"></span>
          <span>${escape(post.createdAt)}</span>
          ${hotBadge} ${vipBadge}
        </div>
        <h3 class="post-title">${escape(post.title)}</h3>
        ${post.excerpt ? `<p class="post-excerpt line-clamp-3">${escape(post.excerpt)}</p>` : ''}
        ${media}
        <div class="post-actions">
          <span class="pa"><i class="ti ti-arrow-big-up"></i>${QD.fmtNum(post.stats.up)}</span>
          <span class="pa"><i class="ti ti-arrow-big-down"></i></span>
          <span class="pa"><i class="ti ti-message-circle"></i>${QD.fmtNum(post.stats.comments)}</span>
          <span class="pa live"><i class="ti ti-broadcast"></i>${post.stats.live} 在线</span>
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
    rootEl.innerHTML = `
      <div class="sidebar-section">
        <div class="sidebar-title">导航</div>
        <a class="sidebar-link active" href="home.html"><i class="ti ti-flame"></i>首页热门</a>
        <a class="sidebar-link" href="messages.html"><i class="ti ti-bell"></i>消息中心<span class="badge">3</span></a>
        <a class="sidebar-link" href="creator-center.html"><i class="ti ti-chart-bar"></i>创作者中心</a>
        <a class="sidebar-link" href="vip.html"><i class="ti ti-crown" style="color:#FFD700"></i>黑卡会员</a>
        <a class="sidebar-link" href="profile.html"><i class="ti ti-user"></i>我的主页</a>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">已订阅频道 <span style="cursor:pointer"><i class="ti ti-plus"></i></span></div>
        ${subs.map(c => `
          <a class="sidebar-channel ${activeChannel === c.id ? 'active' : ''}" href="home.html?ch=${c.slug}">
            <span class="ch-dot" style="background:var(--c-${c.color})"></span>
            <span>${c.name}</span>
            <span class="unread ${c.unread > 0 ? 'has' : ''}">${c.unread > 0 ? c.unread : ''}</span>
          </a>
        `).join('')}
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">发现频道</div>
        ${all.filter(c => !c.subscribed).map(c => `
          <a class="sidebar-channel" href="home.html?ch=${c.slug}">
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

  /* ---------- Header renderer ---------- */
  function renderHeader(rootEl, opts = {}) {
    rootEl.innerHTML = `
      <div class="header">
        <a class="logo" href="../index.html">
          <span class="logo-mark">奇</span>
          <span>奇点社区</span>
        </a>
        <div class="search-bar">
          <i class="ti ti-search"></i>
          <input placeholder="搜帖子、用户、频道..." onclick="location.href='search.html'" readonly>
          <kbd>⌘ K</kbd>
        </div>
        <button class="icon-btn" title="发布"><i class="ti ti-pencil-plus"></i></button>
        <button class="icon-btn" title="通知"><i class="ti ti-bell"></i></button>
        <a class="row gap-2" href="profile.html" style="text-decoration:none">
          ${tplAvatar(Object.assign({ name: QD.user.username, vip: QD.user.vip.active }, { avatar: QD.user.avatar }), 'sm')}
          <span class="t-sm c-2">${escape(QD.user.username)}</span>
        </a>
      </div>
    `;
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

  return { $, $$, el, escape, tplAvatar, tplChannelPill, tplPostCard, tplLiveMessage, tplComment, startLiveRoom, renderSidebar, renderHeader, renderH5TabBar };
})();
