# Rules & Translation Sources

## 规则范围

V1 只考虑 5R 三宝书内容：

- Player's Handbook (2024)
- Dungeon Master's Guide (2024)
- Monster Manual (2025)

角色创建阶段主要使用 PHB 2024；v0.4 已使用 MM 2025 数据实现德鲁伊荒野变形。

## 中文术语

所有 D&D 正式中文术语以以下项目当前结果为准：

- https://github.com/DND5eChm/5echm_web

规则层不以中文字符串作为 ID。

## Editorial 文案

站点中的“一句话玩法”“新手推荐”“复杂度”“构筑 warning”等为本项目自行编写的 UX 文案，与规则译文分开存储。

## v0.2 新增规则核对（2026-09-28）

- [D&D Beyond 2024 战士与勇士](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：起始包 A 含 4 GP、回气／动作如潮／战术思维、重击阈值及重击后移动。
- [2024 装备](https://www.dndbeyond.com/sources/dnd/br-2024/equipment)：矛／短弓的数据与精通、游戏套装、链甲、地城探索者套组及医疗包。
- [2024 角色起源](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins)：矮人感官、抗性、HP 与石中精魂。
- [2024 专长](https://www.dndbeyond.com/sources/dnd/br-2024/feats)：Savage Attacker 的触发与伤害骰处理。
- [2024 规则术语表](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)：长休恢复全部生命骰与 HP。

人物卡规则说明为简写，保留触发时机、资源与限制，不是书籍完整规则的替代品。

中文新增词条已核对 5echm_web `pages` 分支：

- [2024 武器](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/装备/武器.htm)：矛、短弓、侵扰。
- [起源专长](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/专长/起源专长.htm)：凶蛮打手。
- [矮人](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色起源/种族/矮人.htm)：矮人体魄、矮人刚毅、石中精妙；替换了 v0.1 使用的旧显示名称。

## v0.3 法师核对（2026-09-28）

- [2024 法师与塑能师](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：三级 3 道职业戏法、6 道职业准备法术、4/2 法术位；初始 6 道一环、二级新增 2 道一环、三级新增 2 道一或二环，塑能学者额外 2 道塑能法术；仪式学家、学者专精、奥术回想。
- [2024 贤者背景](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins)：体质／智力／感知提升，奥秘／历史熟练、书法工具、魔法学徒（法师）及起始包 A。
- [2024 魔法学徒](https://www.dndbeyond.com/sources/dnd/br-2024/feats)：2 道戏法、1 道始终准备的一环法术，施法属性从智力／感知／魅力中选；免费施法每长休一次，也能消耗法术位。
- [2024 法术](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions)：收录 20 道法师法术；特别区分新版睡眠术的感知豁免与旧版 HP 骰池、新版电爪只阻止借机攻击。
- [2024 装备](https://www.dndbeyond.com/sources/dnd/br-2024/equipment)：匕首灵巧、长棍两用、学者套组内容。
- [2024 规则术语](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)：专注豁免 DC 上限 30，失能／死亡结束专注。

中文名称与法术条件核对以下 `pages` 分支内容；法术卡是本项目重新编写的三级速查摘要：

- [法师](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/法师/法师.htm)：仪式学家、奥术回想、学者。
- [塑能师](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/法师/塑能师.htm)：塑能学者、强力戏法；法术塑形明确为六级能力，不授予三级角色。
- [戏法](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/0环.htm)、[一环](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/1环.htm)、[二环](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/2环.htm)：火焰箭、冷冻射线、粉碎音波等。

## v0.4 月亮德鲁伊核对（2026-09-28）

- [D&D Beyond 2024 德鲁伊](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：d8、4/2 法术位、6 个准备名额、原初职能、德鲁伊语、四种已知形态、两次变形及短休恢复一次。保留 HP、生命骰、心智属性、语言、职业能力与熟练；装备可融入但不提供效果。
- [官方月亮结社介绍](https://www.dndbeyond.com/posts/1755-the-2024-circle-of-the-moon-druid-and-changes-to)：三级 CR 上限 1、AC 至少 13 + 感知、临时 HP 为等级三倍。
- [2024 伤害与治疗](https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game)：临时 HP 不叠加，持续至耗尽或长休；本实现保留变回原形后的临时 HP。此为对通则与变形条文的合并解释，界面允许按主持人裁定修正。
- [2024 规则术语表](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)：长休开始时须至少 1 HP；短休花费生命骰时治疗量至少 1 HP。
- [贤者谏言](https://www.dndbeyond.com/sources/dnd/sae/sage-advice-compendium)：临时 HP 吸收伤害仍需要专注检定，使用完整实际伤害计算 DC。

中文与具体条目核对 `DND5eChm/5echm_web` 的 `pages` 分支：

- [德鲁伊](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/德鲁伊/德鲁伊.htm)、[月亮结社](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/德鲁伊/月亮结社.htm)、[隐士](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色起源/背景/隐士.htm)。
- [起源专长](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/专长/起源专长.htm)：医疗师的战地医疗与治疗骰重掷；起始草药工具不等于医疗包。
- [戏法](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/0环.htm)、[一环](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/1环.htm)、[二环](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/2环.htm)：疗伤术 2d8、治愈真言 2d4、次等复原术附赠动作、2024 月华之光触发时机。
- MM 2025 附录 A：[棕熊](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/棕熊.htm)、[恐狼](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/恐狼.htm)、[狼](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/狼.htm)、[猫](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/猫.htm)、[獾](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/獾.htm)、[豹](https://github.com/DND5eChm/5echm_web/blob/pages/topics/怪物图鉴2025/附录A/豹.htm)。不混用 2014 棕熊爪击、狼倒地豁免或豹的猛扑。

持续时间按“德鲁伊等级一半的小时数”结合一般向下取整规则，在三级显示 1 小时；不使用墙钟自动计时。法器全部融入时无法用于月华之光的材料成分，界面提示玩家安排外部材料或与主持人确认。
