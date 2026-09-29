# Architecture

## 数据流

```text
RulesData + TranslationData + EditorialData
                  │
CharacterBuild ───┤
                  ▼
             collectEffects
                  ▼
            DerivedCharacter
                  │
                  ├─ Validator
                  ├─ Quick Reference
                  ├─ Full Sheet
                  └─ Export (later)
```

## 三类内容严格分离

- **Rules**：可计算规则事实，如 `hitDie = 10`、链甲 AC 16。
- **Translation**：正式中文名词/正文，统一对照 5echm_web。
- **Editorial**：新手摘要、推荐原因、复杂度、warning 文案。

## V1 角色状态

`CharacterBuild` 只保存玩家选择，不保存 HP / AC / attack bonus 等派生值。

临场或休息后可切换的选择后续放入 `CharacterPlayDefaults`，不污染永久 Build。

## v0.3 已落地的双职业边界

- `data/profiles.ts` 按职业方案提供生命骰、固定 HP 成长、豁免、技能、背景属性与装备来源；固定支持 fighter/champion/soldier 和 wizard/evoker/sage，两者均为三级矮人。
- `CharacterBuild.choices.wizard` 记录戏法、1–2 级法术书、3 级新增法术、塑能学者额外法术、准备项和魔法学徒。保留旧 fighter 字段与 schemaVersion 1 以兼容 v0.1/v0.2 草稿；不宣称已具备任意职业／背景组合模型。
- `validateWizard` 校验来源、学派、环阶、数量、重复与准备子集。`buildShape` 负责不可信 JSON 的结构门禁，`parseDraft` 把不完整人物卡恢复到检查页。
- `BuilderState.profiles` 保存未激活职业的构筑与冒险状态；切换前归档当前方案，刷新时分别校验这些快照。
- `DerivedCharacter.spellcasting` 保存两个施法来源的攻击与 DC。专长法术独立于 6 个职业准备名额；法术书仪式可未准备。
- `DerivedResource.shortRestRestore` 驱动普通短休恢复；奥术回想是随短休提交的原子操作，验证空缺后一起恢复法术位并消费次数。
- `WizardSheets` 补充施法速查和每页最多 6 道法术的卡片，PDF / PNG 沿用固定宽度的通用导出管线。

## v0.4 变形与职业边界

- `choices.druid` 保存技能、原初职能、职业戏法、六道准备法术、四种已知形态。结社法术与德鲁伊语法术由规则派生，不占选择名额。
- `druidSpells.ts` 提供德鲁伊子集，共享 `spell()` 字典供人物卡显示；法师验证始终限于原 `SPELL_LIST`，避免跨职业误选。
- `beasts.ts` 保存六种 MM 2025 野兽的属性、感官、移动、熟练与动作；不存储独立 HP，避免套用旧版血池。
- `deriveWildShape(base, formId)` 只接受已知合法形态，从原形生成展示快照；保留 HP、生命骰、心智属性、职业能力和熟练，体能属性与种族感官由兽形替换。技能／豁免重新按角色熟练计算，再与野兽数值取高。
- `PlayState` 新增 `formId`、`incapacitated`、`companion`，旧草稿无需迁移。变形、伤害、魔宠召唤和休息在纯函数中更新，再通过同一归一化边界保存。
- 临时 HP 不叠加；受伤先扣临时 HP，再扣共用 HP。0 HP 按通常昏迷处理；手动失能标记需要手动解除。长休入口要求至少 1 HP，不能代替救治。
- `DruidSheets` 用同一组件树输出预览和导出 DOM。完整卡保留原形并增加当前兽形页，两种视图都列出可施展法术及兽形限制。
- 时间流逝、专注检定、材料可用性、治疗掷骰和魔宠行动由玩家管理。装备固定按全部融入处理；不实现装备自由穿戴和回合引擎。

## v0.5 契约魔法与祈唤

- `choices.warlock` 保存技能、两道戏法、四道职业准备、三项祈唤（含目标戏法）和赌具实物选择；邪魔四道法术由规则自动加入。背景固定流浪者，工具熟练为盗贼工具。
- `validateWarlock` 限制职业法术白名单、三级至多两道二环准备、可复选祈唤的不同目标及伤害／攻击／射程前提。共享法术字典不扩大其他职业白名单。
- `pactMagic` 派生二环契约位、随意施法、黑暗赐福值与条件优势。`warlockCantrip` 只修正绑定的戏法；专注优势不授予全部体质豁免。
- 契约施法与秘法回流在 `updatePlayState` 原子扣除资源。`warlockArmor` 区分皮甲、无甲和法师护甲；祈唤移除后保持无甲，不自动穿甲。八小时长休使法师护甲到期。
- `agathys` 在临时 HP 耗尽或一小时休息后结束；正值临时 HP 被其他来源替换时保留。反伤、时间、专注、成分、目标与触发条件由玩家确认，未实现回合引擎。
- 保留 schemaVersion 1、旧职业字段与存档键；新增字段可缺省。四职业分别保存构筑及冒险记录。
- `WarlockSheets` 共用预览／导出 DOM，卡面标示原环阶、二环实际效果及祈唤一环随意施法。

## v0.6 游侠与独立伙伴

- `choices.ranger` 保存技能、专精、额外语言、战斗风格、准备法术、赌具和初始伙伴；武器精通沿用公共选择字段。职业／子职／背景固定为游侠／驯兽师／流浪者。
- `data/ranger.ts` 保存精选法术和三种原初野兽数据；`validateRanger` 校验数量、重复、熟练前提与形态伤害类型。共享法术字典不扩大其他职业的合法选择。
- `derivePrimalCompanion` 按游侠感知和熟练加值生成伙伴 AC、攻击、伤害、检定与豁免。伙伴不使用普通野兽数据，也不继承矮人 HP 或箭术加值。
- `PlayState.primal` 保存实际伙伴的形态、外观、伤害类型、HP、临时 HP、生命骰及存活／死亡／等待复活／消失状态。构筑中的初始选择不会覆盖已经存在的伙伴。
- `rangerPlay` 原子扣除施法或复活资源。复活分为扣位和确认一分钟已过两步；刷新保留等待状态。0 HP 与死亡分开记录，游侠死亡会使伙伴消失。
- 长休后的替换机会只能使用一次，并在其他冒险记录操作后结束，避免将它存成随时可用的免费治疗。短休不自动治疗伙伴；长休仅恢复一同休息且至少 1 HP 的存活伙伴，不复活死者。
- 游侠专注记录在新专注、失能、0 HP 或休息时更新。实际时间、目标、距离、成分、掷骰及动作经济由玩家确认，不实现回合引擎。
- `RangerSheets` 输出三页速查或五页完整卡，共用预览和固定宽度导出 DOM。schemaVersion 1 与既有存档键不变，五职业状态独立保存。


## v0.7 背景与职业解耦

`data/profiles.ts` 仅提供职业数据，`data/backgrounds.ts` 提供背景数据；规则引擎按 `backgroundId` 合并装备、熟练、专长与资源。`rules/origins.ts` 封装合法推荐加值、显式技能调整与工具熟练。

`choices.origin` 保存背景赌具和魔法学徒选择，`DerivedCharacter.originMagic` 与职业施法分别输出。所有职业的卡片通过共同出口追加背景附页。`store/migrateBuild.ts` 在结构校验之前迁移 v0.6 字段；已存在但格式错误的 origin 不会被默认值覆盖。

## v0.8 角色起源

`choices.species` 保存谱系、体型、施法属性、技能及人类专长；`choices.origin` 保存背景工具与专长配置。`FeatChoices` 共享技能／工匠／音乐家／魔法学徒选择结构。推荐从其他来源尚未提供的熟练中选择，重复熟练保留合法性提示，不变成专精。

`origins.ts` 与 `species.ts` 按来源派生能力、技能、工具和资源。`innateMagic` 分别记录背景、人类专长及种族施法属性、DC、免费次数与资源 ID；同名法术不会合并不同来源的免费次数。旧 `originMagic` 仅保留背景兼容视图。`validateOrigins.ts` 验证各列表与重复专长限制。

`OriginSheets` 为五职业统一追加起源能力／资源和各施法来源附页；职业主卡不重复展开这些条目。`FamiliarSheet` 提供起源寻获魔宠说明、猫的数据和空白记录。荒野变形按兽形显示速度、感官和抗性，不把原形种族法术当作兽形可用能力。

迁移先补齐旧草稿缺失字段，再做结构与规则检查；已经存在但无效的字段保留在恢复流程中，避免静默覆盖用户选择。共享法术字典加入起源条目，职业可选目录保持各自范围。

## v0.9 游荡者四子职

`RogueChoices` 保存职业技能、两项技能专精、额外语言以及诡术师的两道自选戏法和三道准备法术。法师之手由子职派生，不占自选名额。四个子职共享一个职业草稿；切换子职不创建新角色。

`changeRogueSubclass` 保留起源、属性、身份与配置选择，按新派生结果立即归一化资源。失去的法术位和灵能骰不会继续隐藏在冒险记录里。`hasSpellStep` 统一控制导航与旧草稿恢复，非诡术师不进入法术步骤。

`validateRogue` 验证名额、熟练来源、语言重复和法术目录。`rogueWeaponProficient` 同时约束武器精通与攻击熟练；偷袭、首轮暗杀和念刃额外攻击不写入普通武器的无条件伤害。

`RogueSheets` 共享速查／完整视图的行动与能力页，完整模式再加技能和装备身份；诡术师法术独立附页。`rogueSpellText` 只调整当前子职适用的法术说明，避免把魔契师说明混入新人纸卡。起源法术和魔宠附页继续走公共出口。


## v0.10 车卡结果

- `CharacterPage` 只负责两种输出的说明、预览、返回修改和导出，不挂载冒险记录面板。
- `CharacterSheets` 的 `quick` 分支仅渲染 `BeginnerSheet`；`full` 分支渲染职业、起源、法术及需要的附页。保留内部 mode 值兼容调用，不等于旧战斗速查的产品语义。
- `rules/guides/beginnerGuide.ts` 从实际派生角色中选择常用行动与熟练技能，复用武器攻击数值、魔契师祈唤修正、伙伴派生。未准备法术不进入建议；没有攻击戏法时回退到持有的武器。
- 输出入口以 `normalizePlayState(undefined, character)` 创建初始参考状态，仅用于兼容完整卡组件。传入的历史 `play` 不影响输出；不删除或覆盖持久化的旧状态。完整卡资源用空白和方框表达线下记录。
- `handoffSelftest.ts` 验证全部 1440 个路线／种族／背景组合，以及自定义法术、祈唤、兽形、旧状态隔离和完成页无冒险操作。

## v0.11 新人创建引导

`rules/guides/onboarding.ts` 集中定义玩法偏好排序、分步骤推荐及预览说明。偏好匹配优先于复杂度排序；推荐只覆盖本步骤，使用现有起源切换和技能校正规则。跨职业切换仍恢复各自配置，但沿用最近的玩法偏好。

`StepGuide` 使用同一模型预览和提交推荐。`BuilderShell` 统一筛出当前步骤的 blocker，与各页面原有门禁合并；跨步骤问题由检查清单处理。`ReviewPage` 将 blocker 与 warning/info 分区，提供命名明确的修改链接。手机固定底栏增加清单入口后，相应增加内容底部留白。

`onboardingSelftest.ts` 覆盖偏好排序、缓存切换、全部九路线／十种族／十六背景组合的推荐合法性、无关字段保留、源对象不可变性、卫士戏法数量以及可选建议不阻断生成。
