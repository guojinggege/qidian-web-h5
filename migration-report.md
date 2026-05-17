# Wavi Commit 4 数据迁移审计报告

生成时间: 2026-05-17T18:40:14.166724
迁移脚本: Commit 4 inline migration
输入: data/site-data.json (90 帖) + data/channels-v2.json (8 区/41 子频道/11 条 migration_map)

## 一、概览

- **总帖子数**: 90
- **迁移成功**: 90
- **作废**: 0 (disposal_rules 严格匹配命中)
- **Overseas 抢救**: 13 帖(title 强匹配 + p156 北美锚点)
- **未映射异常**: 0

### 最终 8 区帖子分布

| 新区 | 中文名 | 帖子数 |
|---|---|---:|
| `midnight` | 深夜情绪区 | 9 |
| `relationships` | 两性关系区 | 10 |
| `visual` | 视觉与穿搭区 | 0 |
| `overseas` | 海外华人区 | 13 |
| `gossip` | 吃瓜观察区 | 26 |
| `otaku` | 游戏二次元区 | 18 |
| `money` | 搞钱与生存区 | 5 |
| `occult` | 玄学怪谈区 | 9 |

## 二、Channel 一级迁移路径

| 旧 channel | 中文名 | → 新 channel | 帖子数 | 备注 |
|---|---|---|---:|---|
| `qd` | 奇点 | `midnight` | 9 |  |
| `sport` | 体育竞技 | `gossip` | 8 |  |
| `game` | 游戏二次元 | `otaku` | 8 |  |
| `asmr` | ASMR | `otaku` | 8 |  |
| `fortune` | 玄学命理 | `occult` | 7 |  |
| `funny` | 搞笑 | `gossip` | 7 |  |
| `movie` | 影视文化 | `gossip` | 6 |  |
| `pickup` | 泡妞学 | `relationships` | 6 |  |
| `money` | 财经搞钱 | `money` | 5 |  |
| `drama` | 短剧 | `gossip` | 5 |  |
| `gender` | 两性颜值 | `overseas` | 4 | 部分由 overseas 抢救转入 |
| `gender` | 两性颜值 | `relationships` | 4 |  |
| `money` | 财经搞钱 | `overseas` | 3 | 部分由 overseas 抢救转入 |
| `drama` | 短剧 | `overseas` | 2 | 部分由 overseas 抢救转入 |
| `drama` | 短剧 | `occult` | 2 |  |
| `movie` | 影视文化 | `otaku` | 2 |  |
| `pickup` | 泡妞学 | `overseas` | 2 | 部分由 overseas 抢救转入 |
| `fortune` | 玄学命理 | `overseas` | 1 | 部分由 overseas 抢救转入 |
| `funny` | 搞笑 | `overseas` | 1 | 部分由 overseas 抢救转入 |

## 三、Sub 子频道精细映射执行情况

**精细规则命中**: 90 帖
**Fallback 到 default_sub**: 0 帖

### 3.1 精细映射规则命中(按规则)

| 规则 | 命中数 |
|---|---:|
| `qd-history→midnight-insomnia` | 3 |
| `drama-domineering→gossip-frontline` | 3 |
| `sport-nba→gossip-frontline` | 2 |
| `gender-look→visual-ootd` | 2 |
| `money-stock→money-side` | 2 |
| `fortune-bazi→occult-fate` | 2 |
| `game-console→otaku-gaming` | 2 |
| `funny-life→gossip-weird` | 2 |
| `drama-revenge→gossip-frontline` | 2 |
| `qd-fact→midnight-insomnia` | 2 |
| `qd-science→midnight-insomnia` | 2 |
| `drama-mystic→occult-night` | 2 |
| `sport-soccer→gossip-frontline` | 2 |
| `sport-mixed→gossip-frontline` | 2 |
| `sport-esports→gossip-frontline` | 2 |
| `fortune-tarot→occult-fate` | 2 |
| `fortune-fengshui→occult-fate` | 2 |
| `fortune-ziwei→occult-fate` | 2 |
| `qd-brain→midnight-insomnia` | 2 |
| `drama-tragic→gossip-frontline` | 2 |
| `game-anime→otaku-anime` | 2 |
| `game-steam→otaku-gaming` | 2 |
| `game-mobile→otaku-gaming` | 2 |
| `movie-film→gossip-internet` | 2 |
| `movie-us→gossip-internet` | 2 |
| `movie-cn→gossip-internet` | 2 |
| `movie-anime→otaku-anime` | 2 |
| `gender-emotion→rel-adult-love` | 2 |
| `gender-marriage→rel-adult-love` | 2 |
| `gender-vip→rel-women-talk` | 2 |
| `money-side→money-side` | 2 |
| `money-property→money-side` | 2 |
| `money-startup→money-side` | 2 |
| `funny-joke→gossip-weird` | 2 |
| `funny-meme→gossip-weird` | 2 |
| `funny-video→gossip-weird` | 2 |
| `pickup-approach→rel-flirt` | 2 |
| `pickup-date→rel-flirt` | 2 |
| `pickup-self→rel-men-talk` | 2 |
| `pickup-case→rel-flirt` | 2 |
| `asmr-sleep→otaku-asmr` | 2 |
| `asmr-relax→otaku-asmr` | 2 |
| `asmr-trigger→otaku-asmr` | 2 |
| `asmr-rp→otaku-asmr` | 2 |

### 3.2 Fallback 详情(无精细规则匹配,走 default_sub)

(无)

## 四、Overseas 抢救清单

**规则**: 标题强匹配 `海外 / 华人 / 海归 / 留学 / 留子 / 北美` 任一关键词
**排除清单**: `['p008', 'p113']` (标题命中但调性不符,留原区)
**抢救总数**: 13

### 4.1 抢救清单逐条

| 帖子 id | 命中词 | 原 channel/sub | → overseas sub | 标题 |
|---|---|---|---|---|
| `p003` | 海外,华人 | visual/visual-ootd | `overseas-life` | 海外华人圈最近这种"清冷感"风格的女生，是不是有点过头了？ |
| `p014` | 海外,华人 | gossip/gossip-frontline | `overseas-life` | 5部海外华人爽剧排行榜 — 第一名让我熬夜追到凌晨3点 |
| `p015` | 海外,华人 | gossip/gossip-frontline | `overseas-life` | 为什么海外华人这么爱看霸总短剧？我想了一年，觉得有个文化心理在底层 |
| `p023` | 海外,华人,北美 | occult/occult-fate | `overseas-life` | 海外华人风水实操：北美公寓格局怎么避开"穿心煞" |
| `p126` | 海外,华人 | visual/visual-ootd | `overseas-life` | 海外华人的健身房文化和国内有什么不同 |
| `p129` | 海外,华人 | relationships/rel-adult-love | `overseas-life` | 海外华人 35+ 还没结婚,真实的心理压力 |
| `p132` | 海外,华人 | relationships/rel-women-talk | `overseas-life` | 海外华人女性的择偶逻辑变化 |
| `p133` | 海外,华人 | money/money-side | `overseas-money` | 海外华人下班后做什么副业 ROI 高? |
| `p137` | 海外,华人 | money/money-side | `overseas-money` | 伦敦海外华人买房,zone 2 还是 zone 3? |
| `p138` | 海外,华人 | money/money-side | `overseas-money` | 海外华人创业,SaaS 还是 e-commerce? |
| `p146` | 海外,华人 | gossip/gossip-weird | `overseas-life` | 海外华人才懂的日常:排队 vs queue 的精神分裂 |
| `p151` | 海外,华人 | relationships/rel-flirt | `overseas-cross-culture` | 海外华人怎么破跨文化的搭讪心理障碍 |
| `p156` | 北美 | relationships/rel-flirt | `overseas-cross-culture` | 一个北美程序员的 2 年情感历程 |

### 4.2 Overseas 内部 sub 分布

| Overseas sub | 帖子数 |
|---|---:|
| `overseas-life` (海外华人圈) | 8 |
| `overseas-students` (留子生存实录) | 0 |
| `overseas-cross-culture` (异国关系) | 2 |
| `overseas-money` (海外捞金日志) | 3 |
| `overseas-cities` (深夜城市) | 0 |

### 4.3 排除帖审计(标题含关键词但留原区)

| 帖子 id | 最终去向 | 标题 | 排除原因 |
|---|---|---|---|
| `p008` | `gossip/gossip-frontline` | 《海归霸总的复仇人生》— 第38集刚更，前妻这次终于跪下来了 | 《海归霸总的复仇人生》— 第38集,核心是短剧追剧,留 gossip-frontline |
| `p113` | `otaku/otaku-anime` | Frieren 这么好看,为什么国内讨论不如海外? | Frieren 国内讨论不如海外 — 动漫话题,留原 movie→gossip-internet |

## 五、Disposal Rules 审计

**关键词清单 (15 个)**:

```
颜值打分, 身材评分, 看脸打分, 撩妹技巧, PUA话术, 把妹教程, OF推荐, OnlyFans, Fansly, 灰产, 黑产, 地下产业, 约炮, 包养, 援交
```

**扫描范围**: 90 帖 × (title + excerpt + body)
**严格匹配命中(title 严格匹配)**: 0 条

✅ **0 条严格命中,所有种子帖子通过敏感词扫描。**

### 5.1 软命中审计(词根命中但不在严格清单)

以下 8 条帖子的标题/正文出现"颜值/PUA/约会/灰/产业"等词根,但都不是严格关键词,且调性正面。**全部保留**:

| 帖子 id | 软命中词 | 审计结论 |
|---|---|---|
| `p131` | — | 「颜值审美的本质 - 进化心理学」— 学术分析,非打分,保留 |
| `p157` | — | 「学长分享:从 PUA 走向真诚的转折点」— 反 PUA 调性,保留 |
| `p152` | — | 「第 3 次约会的 turning point」— 约会经验讨论,无低俗,保留 |
| `p153` | — | 「为什么 50% 的男生第 1 次约会就败了」— 约会经验,保留 |
| `p156` | — | 正文含"约会",约会经验,保留 |
| `p012` | — | 「银河系颜色」— 物理"灰色",无关,保留 |
| `p123` | — | 「国剧高级感」— 影视"灰色"风格,无关,保留 |
| `p125` | — | 「新番第 4 集掉头」— 动漫产业,无关,保留 |

**结论**: 0 作废。disposal_rules 代码已执行,留作运营兜底(后期用户/UGC 帖增多时仍生效)。

## 六、git status (迁移完成后)

迁移后 site-data.json 已就地更新,migration-report.md 新增。详见 commit。

## 七、Cross-Zone 优先级原则

迁移规则的优先级(从高到低,后续运营/Commit 5/6 之后内容分流也按此走):

1. **精细映射表 (legacy_sub → new_sub 17 行)** — source of truth,
   覆盖 SUB_MAP 的所有 44 个 legacy sub
2. **硬地理锚点 (北美/伦敦/纽约/温哥华/留学华人 等具体地名)** — overseas 抢救
3. **软关键词命中 (海归/海外 单独出现)** — 仅作"建议",在排除清单里手动豁免

本次 OVERSEAS_EXCLUDE_IDS = {p008, p113} 是软命中豁免清单,未来运营添加新帖子也按这个清单维护。

**Visual=0 不修** 是因为 p003/p126 本质是 overseas 内容,不是穿搭。
若后续 Wavi 新内容产出有"今日穿搭/男生改造"等真 UGC 调性,直接发到 visual-ootd。
该原则适用未来类似情况。
