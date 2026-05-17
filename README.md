# Wavi · 静态原型 (Phase 1)

> **对得上电波的人都在这里。**
> 面向深夜、孤独、有共鸣感的成年人社区。Reddit 式深度盖楼 + Discord 式实时聊天双轨并行。

**当前阶段**:Phase 1 — 静态 HTML/CSS/JS Demo,零依赖、可直接部署。

> 本仓库历史前身为「奇点社区」(qidian)。Day 2 完成 Wavi 全站重构 — 见 `PROJECT_CARD.md` 与 `migration-report.md`。

---

## 快速预览

### 方式 1 · 本地服务器(推荐)

```bash
# 任选其一
python3 -m http.server 8080
npx serve .
php -S 0.0.0.0:8080
```
然后访问 http://localhost:8080

(双击 `index.html` 直接打开会因 CORS 加载不到 JSON,数据层会降级到 fallback。开发请用 HTTP server。)

### 方式 2 · 一键部署

- Vercel: `npx vercel --prod`
- GitHub Pages: 推到 main 分支,Settings → Pages → main / root
- Netlify: 拖拽整个文件夹到 https://app.netlify.com/drop

---

## 频道结构 (Wavi 2.0)

**8 个一级区 + 41 个二级子频道**(详见 `data/channels-v2.json`)

```
1. 深夜情绪区 (midnight)       — 今晚谁也不睡
   今晚睡不着 / 忏悔教堂 / 匿名来信 / 成年人崩溃瞬间 / 深夜电台 / 匿名树洞

2. 两性关系区 (relationships)  — 成年人之间的事
   暧昧研究所 / 深夜关系 / 成年人爱情 / 男生真心话 / 女生深夜话题

3. 视觉与穿搭区 (visual)       — Look of the day
   Look of the Day / 摄影作品集 / 生活感记录 / 氛围美学研究所 / 变美实验室

4. 海外华人区 (overseas)       — 在别的国家想家
   海外华人圈 / 留子生存实录 / 异国关系 / 海外捞金日志 / 深夜城市

5. 吃瓜观察区 (gossip)         — 今天又有大瓜
   吃瓜前线 / 华人互联网观察 / 离谱人类图鉴 / 今天也很怪 / 深夜爆料局

6. 游戏二次元区 (otaku)        — 屏幕背后的恋人
   二次元深夜档 / 游戏荷尔蒙 / AI 共处实验 / 声音恋人 / ASMR 频道

7. 搞钱与生存区 (money)        — 钱、活着、和野心
   搞钱研究所 / 内容创作者经济 / 富人观察局 / 打工人生存 / 地下俱乐部

8. 玄学怪谈区 (occult)         — 深夜从来不是巧合
   玄学命理 / 深夜玄学局 / 人间怪谈 / 禁忌档案 / 平行世界研究会
```

**会员区废除**:付费墙改为帖子级标记 `vip_only: true`,任何区任何子频道下的帖子都可标。
非 VIP 用户看到金色"VIP 解锁"占位卡片,VIP 用户看完整内容。

---

## 目录结构

```
ai-web-platform/
├── index.html                  # 根导航中心
├── README.md                   # 本文件
├── PROJECT_CARD.md             # 项目阶段卡片(Day 1/2/3+)
├── migration-report.md         # Commit 4 数据迁移审计报告
│
├── shared/                     # 共享设计系统
│   ├── styles.css              # 设计 Token + 组件样式(含 12 色频道色板)
│   ├── data.js                 # 数据加载层(并行 fetch site-data + channels-v2)
│   ├── components.js           # 渲染辅助 + 实时房模拟器 + VIP gate
│   └── auth.js                 # 鉴权模块(前端 mock)
│
├── data/
│   ├── site-data.json          # 90 帖 + 12 作者 + 评论 + 实时房消息池等
│   └── channels-v2.json        # Wavi 新 8 区 + 41 子频道 + 迁移 map
│
├── admin/                      # 后台运营工具(单文件)
│   ├── index.html
│   └── README.md
│
├── web/                        # Web 桌面版 (1280px+ 三栏)
│   ├── home.html               # 首页
│   ├── post-detail.html        # 帖子详情(评论 + 实时房双栏)
│   ├── post-editor.html        # 发帖编辑器(6 种类型)
│   ├── vip.html                # 黑卡会员
│   ├── search.html / messages.html / profile.html
│   ├── login.html / register.html
│   ├── creator-center.html / creator-login.html
│   ├── booking.html / master-detail.html / notice-detail.html
│   ├── drama-watch.html        # 短剧观看
│   │
│   ├── # 8 个新 channel 入口 (Wavi 2.0)
│   ├── midnight-channel.html       # 深夜情绪区
│   ├── relationships-channel.html  # 两性关系区
│   ├── visual-channel.html         # 视觉与穿搭区
│   ├── overseas-channel.html       # 海外华人区
│   ├── gossip-channel.html         # 吃瓜观察区
│   ├── otaku-channel.html          # 游戏二次元区
│   ├── money-channel.html          # 搞钱与生存区
│   ├── occult-channel.html         # 玄学怪谈区
│   │
│   ├── # 10 个旧入口的 301 redirect stub
│   ├── qd-channel.html → midnight-channel.html
│   ├── sport-channel.html / drama-channel.html / movie-channel.html / funny-channel.html → gossip-channel.html
│   ├── game-channel.html / asmr-channel.html → otaku-channel.html
│   ├── divination-channel.html → occult-channel.html
│   ├── gender-channel.html → visual-channel.html
│   ├── pickup-channel.html → relationships-channel.html
│   │
│   └── _archive/               # 旧 11 频道页归档(回滚保留)
│
└── h5/                         # H5 移动版 (max 480px, 底部 5Tab)
    ├── home.html / channels.html / post-detail.html / post-editor.html
    ├── profile.html / settings.html / vip.html
    ├── messages.html / search.html
    ├── drama-watch.html
    │
    └── _archive/               # h5/drama-channel.html, h5/divination-channel.html
```

---

## 设计系统

### 颜色
- **基底**: `#0E0E12` / 卡片 `#1A1A22` / 悬浮 `#232330`
- **品牌**: `#7F77DD` (300) / `#534AB7` (600)
- **12 套频道色板**:
  - coral / amber / green / blue / teal / purple / rose (新 8 区使用前 7 个) + indigo (深夜情绪专用 `#5C6BC0`)
  - pink / violet / lime / sky (Phase 1 旧调色板保留)
- **状态色**: success `#4ADB7E` / warning `#D4A04A` / danger `#E55A4B` / live `#FF4B5E`

### 字号
11px (辅助) / 12px (次) / **13px (默认)** / 15px (强调) / 18px (小标题) / 22px (标题) / 32px (Hero)

详见 `shared/styles.css` 顶部的 `:root` token。

---

## 数据加载层 (`shared/data.js`)

`QD.ready()` 并行 fetch 两个数据源:
- `data/site-data.json` — 90 帖 + 用户 + 评论 + 媒体等
- `data/channels-v2.json` — Wavi 新 8 区 + 41 子频道 + 迁移 map

适配层(`adaptChannelsV2`)把 v2 snake_case 字段映射为现有渲染器读的 camelCase。
旧 11 频道保留在 `state.legacyChannels` 用于帖子 chip 反查 + admin 只读区。

`QD.channelById` / `subChannelById` 都带 legacy fallback,保证老帖子 channelId 也能反查到。

---

## VIP 解锁机制 (Commit 6)

帖子级付费墙(代替旧"深夜会员区"):

```js
// 数据
{ "id": "p001", "vip_only": true, ... }

// 渲染门控 (shared/components.js)
function isVipLocked(post) {
  return post.vip_only && !(QD.user.vip.active === true);
}
```

- **feed 卡片**: 锁定时显示金色 vip-locked card(标题可见 + "升级 VIP" CTA + 隐藏正文/媒体)
- **详情页**: 锁定时显示大号 vip-locked-detail 面板替换 body
- **admin**: 编辑帖子表单有"VIP 限定"下拉切换

---

## 实时房模拟

帖子详情页右侧的实时讨论房使用 `setInterval` 模拟:
- 初始展示 8 条种子消息
- 每 2.5-5 秒随机间隔 push 新消息(来自 `liveIncomingPool`)
- 滚到底部自动跟随,否则保持位置
- 虚拟滚动保留最近 50 条

实现见 `shared/components.js` 的 `startLiveRoom()`。

---

## Phase 2+ 演进路线

| Phase | 范围 | 工期 |
|-------|------|-----|
| **1** ✅ | 静态 UI Demo(本仓库) | 1-3 天 |
| **2** | Next.js 14 + TypeScript + Tailwind 重构 | 1-2 周 |
| **3** | PostgreSQL + NextAuth + 帖子/评论 API | 2-3 周 |
| **4** | Stripe 订阅 + WebSocket 实时房 + 短剧解锁 | 2-3 周 |
| **5** | 内测 → 公测 → 上线运营 | 持续 |

---

## 已知简化

由于 Phase 1 仅作设计验证,以下场景被刻意简化:
- 没有真实路由 / 状态管理(用 query string 传 postId / ?sub=)
- 没有真实图片,所有"图片"都用 CSS 渐变模拟
- 实时房消息是固定池循环,不与服务器通信
- 表单提交、点赞、订阅等只更新前端 DOM(本地持久化用 localStorage)
- 短剧播放器是静态封面,不播放真实视频
- VIP gate 是前端门控(纯 mock,真发布需后端鉴权)
- 旧频道 redirect stub 是 meta refresh + JS replace,等效 301 在静态站的实现

这些会在 Phase 2-4 中替换为真实实现。

---

## 验收检查清单

- [x] 25+ 个页面全部可访问
- [x] 共用同一套 CSS 设计系统
- [x] 深色主题统一
- [x] 移动端首屏 ≤ 100KB(不含图片)
- [x] 桌面端首屏 ≤ 300KB
- [x] 所有图标使用 Tabler Icons(无 emoji)
- [x] Web 三栏布局(1280px+) / H5 底部 5Tab(max 480px)
- [x] 实时房消息真实滚动
- [x] Mock 数据集中在 `data/site-data.json` + `data/channels-v2.json`
- [x] 旧 URL 301 重定向到新区
- [x] VIP 解锁前端门控就位

---

## License

私有项目 · © 2026 Wavi
