/* ============================================================
   奇点社区 · 鉴权模块 (前端 mock 实现)
   ------------------------------------------------------------
   设计目标:
   - 所有 API 返回 Promise (为接 Supabase 留接口)
   - 数据存 localStorage
   - 未来切换到真后端,只改本文件的实现,调用方不动
============================================================ */

window.QDAuth = (function () {

  /* ---------- localStorage keys ---------- */
  const USERS_KEY = 'qd-users';
  const CURRENT_KEY = 'qd-current-user';

  /* ---------- helpers ---------- */
  const AVATAR_POOL = ['bg-grad-1','bg-grad-2','bg-grad-3','bg-grad-4','bg-grad-5','bg-grad-6','bg-grad-7','bg-grad-8'];

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('[QDAuth] 解析 qd-users 失败,重置为空数组');
      return [];
    }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function setCurrent(user) {
    if (user) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }
  function isValidEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');
  }
  function pickAvatar() {
    return AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];
  }

  /* ---------- 注册 ---------- */
  function signup({ email, password, username, isCreator } = {}) {
    return new Promise((resolve, reject) => {
      // 校验
      email = (email || '').trim().toLowerCase();
      username = (username || '').trim();
      if (!isValidEmail(email)) return reject(new Error('邮箱格式不正确'));
      if (!password || password.length < 6) return reject(new Error('密码至少 6 位'));
      if (!username || username.length < 2 || username.length > 20) return reject(new Error('用户名长度 2-20 字'));

      const users = loadUsers();
      if (users.some(u => u.email === email)) return reject(new Error('该邮箱已注册'));

      const user = {
        id: 'u_' + Date.now().toString(36),
        email,
        passwordHash: btoa(unescape(encodeURIComponent(password))),
        username,
        isCreator: !!isCreator,
        avatar: pickAvatar(),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);

      // 自动登录 (不写 passwordHash 到 current)
      const current = stripPassword(user);
      current.loginAt = new Date().toISOString();
      setCurrent(current);
      resolve(current);
    });
  }

  /* ---------- 登录 ---------- */
  function login({ email, password } = {}) {
    return new Promise((resolve, reject) => {
      email = (email || '').trim().toLowerCase();
      if (!email || !password) return reject(new Error('请填写邮箱和密码'));

      const users = loadUsers();
      const hash = btoa(unescape(encodeURIComponent(password)));
      const matched = users.find(u => u.email === email && u.passwordHash === hash);
      if (!matched) return reject(new Error('邮箱或密码错误'));

      const current = stripPassword(matched);
      current.loginAt = new Date().toISOString();
      setCurrent(current);
      resolve(current);
    });
  }

  /* ---------- 登出 ---------- */
  function logout() {
    return new Promise(resolve => {
      setCurrent(null);
      // 跳回 home (从 web/ 目录直接 location 即可)
      // 但 logout 可能从 H5 / admin 触发,稍微判断一下
      const path = location.pathname;
      let target;
      if (path.includes('/web/')) target = 'home.html';
      else if (path.includes('/h5/')) target = 'home.html';
      else if (path.includes('/admin/')) target = '../web/home.html';
      else target = 'web/home.html';
      location.href = target;
      resolve();
    });
  }

  /* ---------- 取当前用户 (同步) ---------- */
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      if (!raw) {
        // eslint-disable-next-line no-console
        console.log('[QDAuth] getCurrentUser:', 'no value at LS key', CURRENT_KEY);
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        console.warn('[QDAuth] getCurrentUser: LS value is invalid, treating as logged out', raw);
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('[QDAuth] getCurrentUser exception:', e.message);
      return null;
    }
  }

  /* ---------- 路由保护 (同步) ----------
     未登录 → 跳 login.html?next={原路径+search}
     已登录 → 返回 user
     注意:跳转目标永远是 login.html,不是 register.html
  ---------------------------------------- */
  function requireLogin(redirectTo) {
    const u = getCurrentUser();
    if (u) {
      // eslint-disable-next-line no-console
      console.log('[QDAuth] requireLogin: PASS', { id: u.id, username: u.username, page: location.pathname });
      return u;
    }
    const next = redirectTo || (location.pathname + location.search);
    let loginUrl = 'login.html';
    if (location.pathname.includes('/web/')) loginUrl = 'login.html';
    else if (location.pathname.includes('/h5/')) loginUrl = '../web/login.html';
    else loginUrl = 'web/login.html';
    const target = loginUrl + '?next=' + encodeURIComponent(next);
    console.warn('[QDAuth] requireLogin: BLOCKED (no current user), redirecting to', target);
    location.replace(target);
    throw new Error('Not logged in, redirecting to login');
  }

  /* ---------- helpers (private) ---------- */
  function stripPassword(user) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  /* ---------- 公开 API ---------- */
  return {
    signup,
    login,
    logout,
    getCurrentUser,
    requireLogin,
  };
})();
