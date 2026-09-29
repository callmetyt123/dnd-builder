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

## v0.5 邪魔魔契师核对（2026-09-28 至 29）

- [D&D Beyond 2024 职业规则](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：三级魔契师 d8、魅力施法、感知／魅力豁免；两道戏法、四道准备、三项祈唤、两个二环契约位；短休全部恢复。秘法回流按法术位上限一半向上取整，三级恢复一个。
- 同页邪魔宗主：三级始终准备燃烧之手、命令术、灼热射线、暗示术；黑暗赐福包括别人使你 10 尺内敌人降至 0 HP 的触发。未授予六级能力。
- 中文：[魔契师](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/魔契师/魔契师.htm)、[魔能祈唤选项](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/魔契师/魔能祈唤选项.htm)、[邪魔宗主](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/魔契师/邪魔宗主.htm)。收录苦痛魔爆、斥力魔爆、魔能长枪、魔能意志、魔鬼视界、邪魔活力、幽影护甲。
- [流浪者](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色起源/背景/流浪者.htm)、[起源专长](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/专长/起源专长.htm)：敏捷／感知／魅力，洞悉与隐匿、盗贼工具熟练、幸运。赌具只有实物，不授予熟练。职业与背景共四把匕首、31 GP。
- 法术继续对照上述 CHM 戏法／一环／二环页：2024 黯冰狱铠为附赠动作，二环获得 10 临时 HP、反伤 10；任意正值临时 HP 均能维持效果。脆弱诅咒二环可专注四小时。邪魔活力是一环虚假生命，2d4+4 取最大值 12。

三级四道职业准备中至多两道二环，是按成长路径推导：三级新增一道，并可替换一道旧法术。祈唤和法术为明确标注的精选子集；没有刃／链／书契约、升级器或任意背景组合。法术摘要由本项目重新编写。

## v0.6 驯兽师游侠核对（2026-09-29）

- [D&D Beyond 2024 职业规则](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：游侠生命骰、属性豁免、起始装备、三级准备数量和一环法术位、宿敌、熟练探险家及武器精通。
- [官方 2024 游侠变更介绍](https://www.dndbeyond.com/posts/1759-2024-ranger-vs-2014-ranger-whats-new)：原初伙伴使用新版感知缩放，不套用旧版伙伴数值或提前授予高等级特性。
- CHM [游侠](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/游侠/游侠.htm)、[驯兽师](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/角色职业/游侠/驯兽师.htm)：原初行侣、三种数据卡、指挥方式、复活和长休替换。大地与海洋 HP 20、天空 HP 16；所有属性检定与豁免加入游侠熟练加值，被动察觉按此派生为 14。
- CHM [一环法术](https://github.com/DND5eChm/5echm_web/blob/pages/topics/玩家手册2024/法术详述/1环.htm)：猎人印记、捕获打击、神莓术、大步奔行。摘要明确新版施法时机、专注及食用神莓的附赠动作；疗伤术不继承隐士医疗师重掷。
- 流浪者背景、幸运和矮人条目沿用前述已核对来源。游侠与背景装备包合计 23 GP；赌具实物不授予熟练。重型远程武器使用敏捷 13 门槛，箭术只加远程武器攻击，不加投掷匕首或伙伴攻击。

本阶段仅提供箭术／防御两种风格、四种携带武器的精通、标准语言子集与八道候选准备法术，界面明确标注范围。每长休最多替换一道准备法术以说明提示，构筑编辑器不追踪升级或休息历史。额外攻击、七级伙伴训练与十一级伙伴强化均未授予三级角色。


## v0.7 背景组合核对（2026-09-29）

- 重新核对 [2024 角色起源](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins) 中的背景属性、熟练、工具、专长及装备来源。各职业装备包与所选背景包独立相加。
- 重新核对 [2024 专长](https://www.dndbeyond.com/sources/dnd/br-2024/feats) 中的魔法学徒：两道戏法、一道始终准备的一环法术、自选智力／感知／魅力、一长休一次免费施展或用已有法术位；不提供法术位，不占职业准备名额。
- 隐士／流浪者及医疗师／幸运沿用前述 CHM 已核对条目；重复熟练只计一次，不自动赋予专精或任意新技能。修复建议始终从当前职业的可选技能中重新选择。
- 法器资格仍取决于具体职业规则；背景提供普通长棍不会使其自动成为奥术法器。
- 人物卡治疗重掷依据实际医疗师专长显示，已不再绑定德鲁伊职业；旧版固定配对限制已由本版本取代。

## v0.8 起源核对（2026-09-29）

- PHB 2024：16 背景的属性、技能、工具、专长及装备包 A；10 种族及三级内谱系能力；10 起源专长。
- 官方公开交叉核对：[Character Origins](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins)、[Feats](https://www.dndbeyond.com/sources/dnd/br-2024/feats)。公开基本规则未收录的条目使用下述中文参考核对。
- 中文术语及条目：[DND5eChm/5echm_web，pages 分支](https://github.com/DND5eChm/5echm_web/tree/pages) 中 PHB2024 背景、种族、专长和法术章节。Sage 显示名统一为「智者」。项目数据采用自行整理的机制摘要。
- 魔法学徒牧师／德鲁伊／法师的戏法与一环法术目录，以及三级种族施法，合计涉及 80 个不同法术；49 条为本轮新增摘要，其他复用共享字典。这不表示职业法术目录全部开放。
- MM 2025 猫：AC 12、HP 2、步行／攀爬 40 尺、黑暗视觉 60 尺，敏捷豁免 +4、察觉 +3、隐匿 +4。寻获魔宠附页不允许其攻击；其他合法形态提示准备对应数据卡。
- 三级边界：龙裔不获得五级飞行；歌利亚不获得五级巨大形态；阿斯莫天界启示仅按当前激活方式提供临时效果。精灵冥想为 4 小时，兽人冲刺资源可短休恢复。

- 荒野变形保留原生物类型；纸卡标注为类人生物（兽形）。核对：[官方职业规则](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)。

## v0.9 游荡者核对（2026-09-29）

- [官方职业规则](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes)：游荡者核心、偷袭、专精、稳定瞄准和盗贼三级特性。
- [DND5eChm/5echm_web 的 pages 分支](https://github.com/DND5eChm/5echm_web/tree/pages)：`玩家手册2024/角色职业/游荡者/` 下游荡者、盗贼、刺客、诡术师、魂刃条目；中文术语与未公开子职三级内容以这些条目核对，自行编写机制摘要。
- 诡术师：法师之手加两道戏法，三道一环准备法术，两个一环法术位；没有旧版学派限制，长休不重选准备。魂刃：4d6 灵能骰，短休恢复一枚；念刃有 60/120 尺射程、自带侵扰，可用于借机攻击，第二击仍加攻击属性。
- 刺客：先攻优势，首轮条件攻击优势及偷袭 +3，同轮固定加伤不会变成自动重击；工具额外授予实物与熟练。
- [语言表](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character)：补齐标准语言龙语，职业额外语言覆盖标准／稀有表，原初方言不当作额外独立名额。
- [装备](https://www.dndbeyond.com/sources/dnd/br-2024/equipment)：包 A 与窃贼套组（附盖提灯、7 瓶油等）；补录游荡者可熟练的全部武器。精通不自动赠送物品。
- [规则术语表](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary)：纸卡补充躲藏的前提、DC 15、结束条件，以及轻型／迅击的动作限制。Acrobatics 中文统一为参考中的「特技」。
