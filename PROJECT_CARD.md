# Wavi Project Card

> 对得上电波的人都在这里。
> 项目状态卡片 · 阶段 / 完成度 / 下一步。

---

## 当前状态

| 维度 | 值 |
|---|---|
| **代号** | Wavi |
| **历史前身** | 奇点社区 (qidian) |
| **阶段** | Phase 1 · Day 2 完成 |
| **代号 slogan** | 对得上电波的人都在这里 |
| **定位** | 面向深夜、孤独、有共鸣感的成年人社区 |
| **数据规模** | 90 帖 · 12 作者 · 8 一级区 · 41 二级子频道 |
| **页面数** | 25+ HTML(Web 25 + H5 12 + admin 1 + 12 legacy redirects) |
| **代码量** | ~zero dependency · 纯 HTML/CSS/JS |
| **部署** | GitHub Pages / Vercel / Netlify 任意 |

---

## Day 1 · 静态 UI Demo(✅ 完成)

奇点社区(qidian)原型完成。

- ✅ 23 个核心页面(Web 11 + H5 12) — Reddit 风深度盖楼 + Discord 风实时聊天
- ✅ 11 频道结构 + 4-5 子频道 / 区
- ✅ 设计系统(深色主题 / 11 色频道色板 / 字号 / 圆角)
- ✅ 实时房 setInterval 模拟
- ✅ 6 种发帖类型(图文/图集/视频/提问/语音/投票)
- ✅ 黑卡会员页 + VIP tier 配置
- ✅ admin 后台(频道/帖子/视频/横幅/热搜/用户)
- ✅ 鉴权 mock 模块 + 路由保护
- ✅ 消息中心 / 个人主页 / 创作者中心 / 玄学预约 / 短剧观看

---

## Day 2 · Wavi 全站重构(✅ 完成 · 本次)

7 个 commit 完成 qidian → Wavi 重命名 + 频道结构重塑 + VIP gate 重构。

| Commit | SHA | 范围 |
|---|---|---|
| 1 | `c7842b1` | chore(rename): qidian → wavi 全局字符串替换(45 文件 / 全 HTML title + slogan 注入 + logo 字符) |
| 2 | `0debbd9` | feat(channels): 引入 data/channels-v2.json 作为并行配置(8 区 / 41 子频道 / 11 迁移映射) |
| 3 | `8a0270d` | feat(channels): 前端切换到新 8 区结构 + 迁移 banner(12 文件 / data.js adapter / admin 顶替) |
| 4 | `bfb9352` | refactor(data): 90 帖按 migration_map 迁移到新 8 区 + migration-report.md 审计 |
| 5 | `480d9dd` | feat(channels): 删除旧频道入口 + 301 重定向(12 文件归档到 _archive/) |
| 6 | `76e167a` | feat(ui): vip_only 帖子标记(代替旧会员区,5 帖测试样本) |
| 7 | (本 commit) | docs: 更新 README + PROJECT_CARD + admin/README |

**关键产出:**

- 全局品牌:奇点社区 → Wavi(60+ 处字符串)
- Slogan 注入:header 站名旁 italic 灰 / 首页 hero / footer / h5 banner
- 频道结构:11 旧 → 8 新 + 41 子频道
  - 新增差异化区:**海外华人区**(13 帖)
  - 合并娱乐瓜:**吃瓜观察区**(26 帖,整合体育/短剧/影视/搞笑)
  - 重命名:奇点 → 深夜情绪 · 财经搞钱 → 搞钱与生存
- 色板:11 → 12(新增 `--c-indigo: #5C6BC0` 给深夜情绪区)
- 数据迁移:90 帖 0 作废 · 17 行精细 sub-map 100% 命中 · overseas 抢救 13 帖
- 旧 URL 兼容:meta-refresh + JS replace 实现等效 301 重定向,query / hash 透传
- VIP 付费墙重构:从"独立会员区"改为"帖子级 `vip_only` 字段"

**审计资产:**
- `migration-report.md` — 数据迁移完整审计(8 区分布 / 17 条 sub-map 命中 / 13 帖 overseas 抢救清单 / 8 条 disposal 软命中审计 / Cross-Zone 优先级原则)

---

## Day 3+ 路线(待启动)

### 内容补强(运营驱动)

- visual 区:目前 0 帖(p003/p126 因含"海外华人"被抢救走) — 需新生产纯穿搭/美学 UGC
- overseas 区充实:虽然 13 帖打底,但 5 个子频道分布不均
- midnight 区:9 帖来自旧"奇点"(知识型),与新调性(深夜情绪)不完全贴合,需新生产情绪类内容
- gossip 26 帖:虽合预期但密度高,可单独评估是否需"内容分流"task

### admin 待办

- 帖子编辑器 channel 下拉对老 channelId(已迁移过)的兼容显示
- legacy 频道区的"完整归档"按钮(一键移除 legacy 显示,精简 UI)
- VIP 限定 badge 在帖子列表的渲染样式(Day 2 已知小问题)

### Phase 2 准备

| Phase | 范围 | 预估 |
|---|---|---|
| **2** | Next.js 14 + TypeScript + Tailwind 重构 | 1-2 周 |
| **3** | PostgreSQL + NextAuth + 帖子/评论 API | 2-3 周 |
| **4** | Stripe 订阅 + WebSocket 实时房 + 短剧解锁 | 2-3 周 |
| **5** | 内测 → 公测 → 上线运营 | 持续 |

---

## 关键文件指南

| 想了解 | 看这里 |
|---|---|
| 频道结构(source of truth) | `data/channels-v2.json` |
| 帖子/作者/评论数据 | `data/site-data.json` |
| 数据加载逻辑 + 字段适配 | `shared/data.js` |
| UI 渲染 + VIP gate + 实时房 | `shared/components.js` |
| 设计 token + 12 色频道色板 | `shared/styles.css` |
| 数据迁移审计 | `migration-report.md` |
| 后台运营工具说明 | `admin/README.md` |
| 历史前身归档 | `web/_archive/` + `h5/_archive/` |

---

## 回滚指南

如需回滚某次 Day 2 commit:
```bash
git log --oneline                    # 找 SHA
git revert <SHA>                     # 反向 commit
# 或针对具体文件
git checkout <SHA>~1 -- <file>
```

如需回滚整个 Wavi 重构(回到 Day 1 奇点):
```bash
git checkout 0886262                 # Day 1 收官 commit
```

旧 11 频道页可以从 `_archive/` 拉回 web/:
```bash
mv web/_archive/qd-channel.html web/qd-channel.html   # 覆盖 redirect stub
```

---

© 2026 Wavi
