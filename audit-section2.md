## 2. `shared/data.js` 数据结构详解

`data.js` 以 IIFE 包装，挂在 `window.QD`。共导出 17 个顶层成员（14 个数据 + 3 个 helper）。

### 2.1 `QD.channels` — 频道列表

- 类型：`Array<Channel>` · **共 11 条**
- 用途：侧栏频道树、H5 频道页、频道徽章颜色映射

| 字段 | 类型 | 示例值 | 说明 |
|------|------|--------|------|
| `id` | `string` | `'qd'` / `'sport'` | 主键（11 个） |
| `slug` | `string` | `'qd'` | **与 `id` 完全相同**（重复字段） |
| `name` | `string` | `'奇点'` | 中文名 |
| `icon` | `string` | `'ti-sparkles'` | Tabler 图标 class |
| `color` | `string` | `'purple'` / `'coral'` | 频道色键（11 套） |
| `desc` | `string` | `'今天，你的世界观被刷新了吗？'` | 一句话简介 |
| `members` | `number` | `482911` | 成员数 |
| `online` | `number` | `3210` | 当前在线 |
| `unread` | `number` | `12` | 当前用户未读数 |
| `subscribed` | `boolean` | `true` | 当前用户是否订阅 |
| `level` | `string` | `'S'` / `'A'` / `'B'` / `'C'` / `'主频道'` | 内部分级 |

**`subscribed: true` 的频道（实际 8 个）**：`qd / sport / drama / game / movie / gender / money / funny`
**`subscribed: false`（3 个）**：`fortune / pickup / asmr`

**11 个 color 值（与 styles.css `--c-*` token 一一对应）**：`purple / coral / amber / green / blue / teal / pink / rose / lime / sky / violet`

### 2.2 `QD.user` — 当前登录用户

- 类型：`object`（单条）

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'u_self'` | 不在 `authors` 池中 |
| `username` | `string` | `'过路的星辰'` | **注意：字段名是 `username`，作者池是 `name`** |
| `avatar` | `string` | `'bg-grad-6'` | CSS 渐变 class，**不是 URL** |
| `level` | `number` | `23` | |
| `vip` | `object` | `{ active: true, tier: 'gold', expiresAt: '2026-08-12' }` | 嵌套 object，**与 authors.vip 类型不一致** |
| `stats` | `object` | `{ posts: 142, followers: 1820, following: 332, likes: 12877, coins: 8932 }` | |
| `bio` | `string` | `'北美程序员 · 摩羯座…'` | |
| `location` | `string` | `'美国 · 加州'` | |

### 2.3 `QD.authors` + `QD.authorById` — 作者池

- `authors`: `Array<Author>` · **共 12 条**（u01–u12）
- `authorById`: `Object.fromEntries(...)` 派生索引

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'u01'` | u01–u12 |
| `name` | `string` | `'硅谷郊狼'` | **注意：当前用户用 `username`** |
| `avatar` | `string` | `'bg-grad-1'` | CSS 渐变 class |
| `level` | `number` | `31` | |
| `vip` | `string?` | `'gold'` / `'silver'` / 缺省 | **类型为 string，与 `user.vip` 的 object 不一致** |

`vip: 'gold'`（4 人）：u01, u06, u08, u11(无, 是 u11 没有), 实际 = u01, u06, u08
`vip: 'silver'`（2 人）：u03, u12
其余 7 人无 `vip` 字段。

### 2.4 `QD.posts` — 帖子

- 类型：`Array<Post>` · **共 8 条**（p001–p008）

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'p001'` | 主键 |
| `channelId` | `string` | `'qd'` | **指向 `channels.id`**（也等于 slug） |
| `authorId` | `string` | `'u08'` | **指向 `authors.id`** |
| `type` | `string` | `'text'` / `'video'` / `'gallery'` | 决定渲染分支 |
| `title` | `string` | `'中世纪欧洲为什么…'` | |
| `excerpt` | `string` | `'14世纪黑死病爆发后…'` | 摘要，约 80–150 字 |
| `tags` | `string[]` | `['冷知识', '世界史']` | 一般 2–3 个 |
| `stats` | `object` | `{ up, down, comments, share, view, live }` | 6 个计数字段，全部 `number` |
| `createdAt` | `string` | `'2分钟前'` | **相对时间字符串，非时间戳** |
| `thumb` | `string?` | `'linear-gradient(135deg,#E55A4B,#D4A04A)'` | 仅 `type=video`；**CSS 渐变字符串，非 URL** |
| `thumbs` | `string[]?` | 3 段 CSS 渐变 | 仅 `type=gallery` |
| `hot` | `boolean?` | `true` | 仅 p001 / p007 |
| `vipLocked` | `boolean?` | `true` | 仅 p008（短剧）|

**Post type 分布**：text × 4 (p001/p004/p005/p007) · video × 3 (p002/p006/p008) · gallery × 1 (p003)

### 2.5 `QD.comments` — 评论（嵌套）

- 类型：`Array<Comment>` · **共 4 条顶层**（c001–c004），其中 c001、c003 各含 nested replies
- 全部 `postId === 'p001'`（仅一个帖子有评论）

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'c001'` / `'c001a'` | replies 用字母后缀 |
| `postId` | `string` | `'p001'` | **仅顶层有，replies 无** |
| `authorId` | `string` | `'u01'` | 指向 `authors.id` |
| `text` | `string` | `'路易十四这个事我专门查过…'` | |
| `time` | `string` | `'8分钟前'` | 相对时间 |
| `up` | `number` | `142` | |
| `down` | `number?` | `3` | 顶层有，replies 无 |
| `vipFlair` | `boolean?` | `true` | **仅 c001 出现一次；语义不清——和 `author.vip` 重复** |
| `replies` | `Comment[]?` | 同结构（无 postId/down） | 仅 c001 / c003 |

### 2.6 `QD.liveMessages` — 实时房种子消息

- 类型：`Array<LiveMessage>` · **共 8 条**（m01–m08）
- 全部 `postId === 'p001'`

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'m01'` | |
| `postId` | `string` | `'p001'` | |
| `authorId` | `string` | `'u02'` / `'sys'` | `'sys'` 表示系统消息 |
| `text` | `string` | `'快进到中世纪…'` | |
| `time` | `string` | `'刚刚'` / `'2分钟前'` | |
| `system` | `boolean?` | `true` | 仅 m07，与 `authorId='sys'` 重复表达 |

### 2.7 `QD.liveIncomingPool` — 模拟流入池

- 类型：`Array<{authorId, text, system?}>` · **共 15 条**
- 无 `id` / `postId` / `time`（由 `startLiveRoom` 运行时合成）
- 2 条 system 消息（升级提示、在线人数）

### 2.8 `QD.dramas` — 短剧

- 类型：`Array<Drama>` · **共 6 条**（d01–d06）

| 字段 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `id` | `string` | `'d01'` | |
| `title` | `string` | `'海归霸总的复仇人生'` | |
| `episodes` | `number` | `60` | 总集数 |
| `vipFree` | `number` | `5` | 免费试看集数 |
| `cover` | `string` | `'linear-gradient(135deg,#E55A4B,#D4A04A)'` | **CSS 渐变，非 URL** |
| `tags` | `string[]` | `['复仇','霸总']` | |
| `plays` | `string` | `'4.2亿'` | **字符串非数字**，无法排序 |
| `rating` | `number` | `9.2` | 0–10 浮点 |

### 2.9 `QD.masters` — 玄学大师

- 类型：`Array<Master>` · **共 4 条**（ms01–ms04）

| 字段 | 类型 | 示例 |
|------|------|------|
| `id` | `string` | `'ms01'` |
| `name` | `string` | `'玄海道长'` |
| `title` | `string` | `'紫微斗数 · 35年经验'` |
| `rating` | `number` | `4.98`（满分 5） |
| `orders` | `number` | `12842` |
| `price` | `number` | `299`（人民币起价）|
| `avatar` | `string` | `'bg-grad-7'`（CSS 渐变 class）|
| `tags` | `string[]` | `['八字', '紫微', '感情']` |
| `badge` | `string` | `'人气王'` / `'资深'` / `'新晋'` / `'大师'` |

### 2.10 `QD.notifications` — 通知

- 类型：`Array<Notification>` · **共 7 条**（n01–n07）

| 字段 | 类型 | 示例 |
|------|------|------|
| `id` | `string` | `'n01'` |
| `type` | `string` | `'like'` / `'comment'` / `'follow'` / `'mention'` / `'system'` / `'reward'`（6 种）|
| `from` | `string` | `'u01'` / `'sys'` |
| `text` | `string` | 通知文案 |
| `time` | `string` | 相对时间 |
| `read` | `boolean` | `false` / `true`（前 3 条未读）|

### 2.11 `QD.dms` — 私信

- 类型：`Array<DM>` · **共 4 条**（dm01–dm04）

| 字段 | 类型 | 示例 |
|------|------|------|
| `id` | `string` | `'dm01'` |
| `userId` | `string` | `'u01'` —— **字段名 `userId`，但 `notifications` 用 `from`** |
| `last` | `string` | 最后一条消息预览 |
| `time` | `string` | 相对时间 |
| `unread` | `number` | `2` / `0`（前 2 条有未读）|

### 2.12 `QD.searchSuggestions` — 搜索建议

- 类型：`string[]` · **共 8 条**
- 示例：`'约基奇 不看人传球'`, `'玄海道长 八字'`

### 2.13 `QD.hotSearches` — 热搜榜

- 类型：`Array<{q, delta}>` · **共 6 条**
- 示例：`{ q: '约基奇G3绝杀', delta: '+412%' }`
- `delta` 三种形态：`'+xxx%'` / `'NEW'` / `'热'`（字符串非枚举）

### 2.14 `QD.vipTiers` — 会员套餐

- 类型：`Array<Tier>` · **共 3 条**

| 字段 | 类型 | 示例 |
|------|------|------|
| `id` | `string` | `'month'` / `'season'` / `'year'` |
| `name` | `string` | `'月卡'` |
| `price` | `number` | `99` |
| `old` | `number` | `128`（原价）|
| `unit` | `string` | `'/月'` / `'/3月'` / `'/年'` |
| `featured` | `boolean` | 仅 `season=true` |
| `save` | `string` | `'省 ¥29'` / `'日均 ¥2.7'`（字符串非枚举）|
| `features` | `string[]` | 4–7 条权益描述 |

### 2.15 `QD.vipBenefits` — 8 大权益

- 类型：`Array<Benefit>` · **共 8 条**

| 字段 | 类型 | 示例 |
|------|------|------|
| `icon` | `string` | `'ti-device-tv'`（Tabler 图标 class）|
| `name` | `string` | `'全部短剧无限看'` |
| `desc` | `string` | `'600+部独家海外华人爽剧无限解锁'` |

### 2.16 Helpers（顶层导出的 3 个函数）

```js
QD.postById(id)         // posts.find(p => p.id === id) → Post | undefined
QD.channelById(id)      // channels.find(c => c.id === id) → Channel | undefined
QD.authorOf(post)       // authorById[post.authorId] || authors[0] → Author
QD.fmtNum(n)            // 10000 -> '1.0w'  · 1000 -> '1.0k'  · else String(n)
```

### 2.17 实体引用关系图

```
            ┌──────────────────────────────┐
            │   QD.channels (11 条)         │
            │   id === slug, color → CSS    │
            └────────────▲─────────────────┘
                         │ channelId
                         │
            ┌────────────┴──────────┐
            │   QD.posts (8 条)      │
            │   stats.live → 实时房   │
            └───┬─────┬───────────┬─┘
                │     │           │
        postId  │     │ authorId  │ id
                ▼     ▼           ▼
       ┌─────────┐ ┌──────────────────┐
       │comments │ │ QD.authors (12)   │
       │(4 条)   │ │ id: u01–u12       │
       │只对 p001│ │ vip: 'gold'/      │
       │authorId │ │      'silver'     │
       └─────────┘ └─────────▲────────┘
                             │
       ┌─────────────────────┴────────┐
       │ liveMessages (8) / liveIncomingPool (15)  authorId or 'sys'
       │ notifications (7)                          from = authorId or 'sys'
       │ dms (4)                                    userId (字段名不一致)
       └──────────────────────────────────────────┘

       QD.user (单条) — id='u_self'，不在 authors 池中，独立结构

       QD.dramas / masters / vipTiers / vipBenefits / searchSuggestions / hotSearches
            — 各自独立，无外键
```

### 2.18 命名不一致与字段重复

| 现象 | 位置 | 性质 |
|------|------|------|
| `id` 与 `slug` 字段值完全相同 | `channels[*]` | 冗余字段 |
| 当前用户用 `username`，作者池用 `name` | `user.username` vs `authors[*].name` | 字段名不统一 |
| 当前用户 `vip` 是 object，作者 `vip` 是 string | `user.vip.tier` vs `authors[*].vip === 'gold'` | 类型不一致 |
| `notifications.from` vs `dms.userId` | 同样指向 author id，命名不同 | 字段名不统一 |
| `liveMessage.authorId === 'sys'` 与 `liveMessage.system === true` 两种系统标记并存 | 部分 m07 二者都有 | 双重表达 |
| `comments.vipFlair` 与 `authors.vip` 语义重叠 | c001 既属于 u01 (vip:'gold')，又显式 `vipFlair:true` | 字段冗余 |
| `dramas.plays: '4.2亿'` 字符串无法排序 | `dramas[*]` | 数据类型应统一为 number |
| `createdAt: '2分钟前'` 相对时间硬编码 | `posts[*].createdAt`, 所有 `time` 字段 | 无法本地化、无法准确排序 |
| `stats.live` 与 `online` 概念混淆 | `posts[*].stats.live` ≈ 房间在线人数；`channels[*].online` = 频道总在线 | 同名不同义 |

### 2.19 硬编码外部资源 / URL

`data.js` 中**没有任何** `http://` / `https://` URL，也**没有任何**图片路径。**所有"图片"都是 CSS 渐变字符串**（`'linear-gradient(...)'`），由调用方注入到 `style="background-image:..."`。

外部资源仅在 HTML `<link>` 中引入：
- `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.5.0/dist/tabler-icons.min.css`（24 处，每个 HTML 一次）

---

