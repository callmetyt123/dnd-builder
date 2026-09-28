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
