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
