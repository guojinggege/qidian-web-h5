# 奇点社区 · 静态原型 (Phase 1)

> 面向全球华人男性的泛娱乐社区平台。Reddit 式深度盖楼 + Discord 式实时聊天双轨并行。

**当前阶段**：Phase 1 — 静态 HTML/CSS/JS Demo，零依赖、可直接部署。

---

## 快速预览

### 方式 1 · 本地打开
直接双击 `index.html`，浏览器会打开导航首页，从那里可以跳转到所有 23 个页面。

### 方式 2 · 本地服务器（推荐，避免相对路径限制）
```bash
# 任选其一
python3 -m http.server 8080
npx serve .
php -S 0.0.0.0:8080
```
然后访问 http://localhost:8080

### 方式 3 · 一键部署到 Vercel / GitHub Pages / Netlify
```bash
# Vercel
npx vercel --prod

# GitHub Pages
# 把整个目录推到 main 分支，开启 Settings → Pages → main / root

# Netlify
# 拖拽整个文件夹到 https://app.netlify.com/drop
```

---

## 目录结构

```
ai-web-platform/
├── index.html                  # 根导航中心（23 页索引入口）
├── README.md                   # 本文件
│
├── shared/                     # 共享设计系统
│   ├── styles.css              # 设计 Token + 组件样式
│   ├── data.js                 # 全局 Mock 数据
│   └── components.js           # 渲染辅助 + 实时房模拟器
│
├── web/                        # Web 桌面版 (1280px+ 三栏)
│   ├── home.html               # W01 首页
│   ├── post-detail.html        # W02 帖子详情（评论+实时房双栏）
│   ├── post-editor.html        # W03 发帖编辑器
│   ├── vip.html                # W04 黑卡会员
│   ├── search.html             # W05 搜索结果
│   ├── messages.html           # W06 消息中心
│   ├── profile.html            # W07 用户主页
│   ├── creator-center.html     # W08 创作者中心
│   ├── drama-channel.html      # W09 短剧频道
│   ├── drama-watch.html        # W10 短剧观看
│   └── divination-channel.html # W11 玄学频道
│
└── h5/                         # H5 移动版 (max 480px，底部 5Tab)
    ├── home.html               # H01 首页
    ├── channels.html           # H02 频道列表
    ├── post-detail.html        # H03 帖子详情（Tab 切换）
    ├── post-editor.html        # H04 发帖编辑器
    ├── profile.html            # H05 个人中心
    ├── settings.html           # H06 设置页
    ├── vip.html                # H07 黑卡会员
    ├── divination-channel.html # H08 玄学频道
    ├── drama-channel.html      # H09 短剧频道
    ├── drama-watch.html        # H10 短剧观看（TikTok 风格）
    ├── messages.html           # H11 消息中心
    └── search.html             # H12 搜索
```

---

## 设计系统

### 颜色
- **基底**: `#0E0E12` / 卡片 `#1A1A22` / 悬浮 `#232330`
- **品牌**: `#7F77DD` (300) / `#534AB7` (600)
- **11 套频道色板**: coral / amber / green / pink / purple / blue / teal / violet / lime / sky / rose
- **状态色**: success `#4ADB7E` / warning `#D4A04A` / danger `#E55A4B` / live `#FF4B5E`

### 字号
11px (辅助) / 12px (次) / **13px (默认)** / 15px (强调) / 18px (小标题) / 22px (标题) / 32px (Hero)

### 圆角
4 / 8 / 12 / 16 / 20 / 999

详见 `shared/styles.css` 文件顶部的 `:root` token 定义。

---

## 实时房模拟

帖子详情页右侧的实时讨论房使用 `setInterval` 模拟新消息流入：
- 初始展示 8 条种子消息
- 每 2.5-5 秒随机间隔 push 一条新消息（来自 `liveIncomingPool`）
- 用户向下滚动到底部时自动跟随，否则保持当前阅读位置
- 虚拟滚动：保留最近 50 条，更早的会被丢弃

实现见 `shared/components.js` 的 `startLiveRoom()`。

---

## 数据替换说明（接入真实 API 时）

所有 Mock 数据都集中在 `shared/data.js`，未来接入真实后端时：

1. 把 `data.js` 改造成异步加载（`fetch('/api/channels')` 等）
2. 把 `QD.channels` / `QD.posts` 等改成异步 Promise 或返回缓存
3. 把 `QDC.startLiveRoom()` 中的 setInterval 替换为真实 WebSocket 订阅

---

## Phase 2+ 演进路线

| Phase | 范围 | 工期 |
|-------|------|-----|
| **1** ✅ | 静态 UI Demo（本仓库） | 1-3 天 |
| **2** | Next.js 14 + TypeScript + Tailwind 重构 | 1-2 周 |
| **3** | PostgreSQL + NextAuth + 帖子/评论 API | 2-3 周 |
| **4** | Stripe 订阅 + WebSocket 实时房 + 短剧解锁 | 2-3 周 |
| **5** | 内测 → 公测 → 上线运营 | 持续 |

---

## 已知简化

由于 Phase 1 仅作设计验证，以下场景被刻意简化：
- 没有真实路由、状态管理（用 query string 传 postId）
- 没有真实图片，所有"图片"都用 CSS 渐变模拟
- 实时房消息是固定池循环，不与服务器通信
- 表单提交、点赞、订阅等交互只更新前端 DOM
- 短剧播放器是静态封面，不播放真实视频
- 玄学预约 modal 仅展示流程，未接入支付

这些都会在 Phase 2-4 中逐步替换为真实实现。

---

## 验收检查清单

- [x] 23 个页面全部可访问
- [x] 共用同一套 CSS 设计系统（无重复定义）
- [x] 深色主题统一，未使用纯黑/纯白
- [x] 移动端首屏 ≤ 100KB（不含图片）
- [x] 桌面端首屏 ≤ 300KB
- [x] 所有图标使用 Tabler Icons（无 emoji）
- [x] Web 三栏布局（1280px+）/ H5 底部 5Tab（max 480px）
- [x] 实时房消息真实滚动（setInterval 模拟）
- [x] Mock 数据集中在 `shared/data.js`

---

## License

私有项目 · © 2026 Singularity Community Ltd.
