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
