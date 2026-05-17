# Wavi · 后台管理 (Admin)

> 一个无后端的 Web 端内容运营工具。所有编辑暂存在浏览器 localStorage，可以**实时预览效果**（仅你自己可见），满意后再"导出 JSON → 替换 → git push"正式发布。

## 入口

- 本地：http://localhost:8080/admin/
- 线上：见仓库 GitHub Pages 域名 + `/admin/`

只支持 HTTP 访问（双击文件打开会因为 CORS 加载不到 JSON）。

---

## 两种使用模式

### 模式 A · 本地预览（快速测试）

适合反复试错、看效果。**别的访客看不到你的改动**。

```
1. 在 admin 编辑内容（顶部"未保存修改"红点亮起）
2. 改动自动暂存到 localStorage（顶部"✓ 本地预览已生效"绿点亮起）
3. 打开任意前台页面，刷新 → 立刻看到改动
4. 前台顶部会出现黄色提示横条："📝 当前预览本地草稿（仅你可见）"
5. 满意了就走模式 B；不满意点 admin 的"重置"按钮丢弃
```

**特点**：
- 改动只存在你这一个浏览器
- 切到其他设备 / 浏览器 / 隐身窗口 → 看不到改动
- 清除浏览器数据 / 用户点 admin "重置" → 改动丢失

### 模式 B · 真发布（上线给所有人看）

```
1. 在 admin 完成所有编辑
2. 点右上角"导出 JSON"，浏览器下载 site-data.json
3. 用下载的文件替换项目根目录下的 data/site-data.json
4. 提交并推送：
     git add data/site-data.json
     git commit -m "update content via admin"
     git push
5. GitHub Pages 1-3 分钟后自动生效
6. 所有访客刷新页面都能看到新内容
```

---

## 6 个管理页

| Tab | 能做什么 | 不能做什么 |
|-----|---------|----------|
| **频道管理** | 编辑 Wavi 新 8 区的 name / desc / icon / color / members / online / unread / 订阅状态 / level。Day 2 之后顶部为新 8 区,下半部分有 11 个 legacy 频道只读区(供帖子 channelId 反查) | 不能删除频道（帖子/视频依赖 channelId）；legacy 区只读 |
| **帖子管理** | 新建 / 编辑 / 删除帖子。字段：标题 / 摘要 / 正文 / 频道 / 作者 / 类型 / 热标 / **VIP 限定** / 标签 | 不能批量导入；删除立即生效 |
| **视频管理** | 短剧 & 影视 双 tab。新建 / 编辑 / 删除。playUrl 自动推断 embedType (mp4 / youtube / bilibili)，10 个预设封面渐变 | 不能上传文件（只填 URL） |
| **热搜榜** | 增删改 q + delta，最多 10 条 | — |
| **横幅管理** | 编辑首页"今日热议"横幅，最多 3 条。可选关联帖子 + 10 个预设渐变 | — |
| **用户管理** | 新建 / 编辑 / 删除作者池。8 个预设头像渐变 | 删除被引用的作者前会弹确认 |

---

## 顶部操作栏指示

| 状态 | 含义 |
|------|------|
| 🔴 "未保存修改" | 你做了改动，目前还在 localStorage（未导出 JSON） |
| 🟢 "✓ 本地预览已生效" | localStorage 中有草稿，前端任意页面刷新就能看到 |
| 🔁 "重置" | 清空 localStorage + 重新 fetch 服务器最新版（丢失所有未导出的编辑） |
| ⬇️ "导出 JSON" | 把 `window.adminState` 序列化为 `site-data.json` 下载 |

---

## 数据流

```
admin 端                                  前台（web/*.html）
────────────                              ──────────────────
[ 用户编辑 ]                                [ 用户访问页面 ]
       │                                          │
       ▼                                          ▼
 mutate adminState                          fetch ../data/site-data.json
       │                                          │
       ▼                                          ▼
 写 localStorage  ◄──────同 key ──────────►   读 localStorage 草稿
       │  (qd-admin-state-v1)                       │
       ▼                                          ▼
 标红点 / 绿点                              草稿覆盖服务器数据
                                                  │
                                                  ▼
                                            顶部出现黄色横条
                                            "📝 当前预览本地草稿"
```

---

## 草稿横条交互

前台页面顶部检测到 localStorage 有草稿时显示一条黄色横条：

```
📝 当前预览本地草稿（仅你的浏览器可见）· 前往 admin 导出发布 →    ✕
```

- 点击"前往 admin 导出发布" → 跳到 admin 页面
- 点击右侧 ✕ → 本会话不再弹（关浏览器再开会重新弹）

---

## 实现要点

- **单文件**：所有 HTML / CSS / JS 都在 `admin/index.html`，无任何外部依赖（除 Tabler 图标 CDN 和 `../shared/styles.css`）
- **状态层**：编辑直接 mutate `adminState`，每次 mutate 后调用 `persist()` 写入 localStorage
- **复用设计 token**：所有颜色 / 圆角 / 间距走 `shared/styles.css` 的 CSS 变量
- **localStorage key**：`qd-admin-state-v1`（前台 `shared/data.js` 也读这个 key 实现预览合并）
- **无路由**：6 个 tab 通过 JS 切换，不改 URL

---

## 已知限制

- 不能上传图片/视频（只能填 URL）
- 不能编辑 comments / liveMessages / liveIncomingPool（数据量小，直接改 JSON 更快）
- 不能编辑当前用户 (`user`) / VIP 配置 (`vipTiers` / `vipBenefits`)
- 没有撤销/重做（误删请用"重置"按钮丢弃所有未保存的修改）
- 多人同时编辑会冲突（localStorage 只属于单浏览器）

## 调试技巧

打开浏览器 DevTools console：

```js
// 查看当前编辑状态
window.adminState

// 查看 localStorage 草稿
JSON.parse(localStorage.getItem('qd-admin-state-v1'))

// 强制清空（重置）
localStorage.removeItem('qd-admin-state-v1'); location.reload();
```
