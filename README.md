# D&D 5R 角色创建器

面向第一次接触 D&D / TRPG 的玩家设计的引导式 5R 三级角色创建器。

## 产品目标

- 新手不理解规则也能沿推荐路径完成合法角色。
- 熟悉规则的玩家可以展开并修改属性、职业选项、武器精通等配置。
- 规则内容限定为 5R 三宝书范围；当前开发切片先实现《玩家手册 2024》的角色创建规则。
- 中文 D&D 术语以 `DND5eChm/5echm_web` 当前发布内容为显示基准；内部规则 ID 始终使用稳定英文 ID。
- 最终目标输出新手速查卡、完整人物卡、PDF 与 PNG。

## 当前里程碑

`0.1.0`：第一条 Vertical Slice

- 首页 / 玩法偏好
- 战士 → 勇士
- 矮人
- 士兵背景
- 标准数组 + 背景属性提升
- 技能、战斗风格、武器精通、起始装备
- 姓名手填、年龄参考、九宫格阵营
- Review / Validator
- `CharacterBuild -> DerivedCharacter` 规则闭环
- 新手速查页

后续按照：法师/塑能师 → 月亮结社德鲁伊 → 魔契师 → 驯兽师 → 批量补齐 12 职业 / 48 子职推进。

## 开发

```bash
npm install
npm run dev
```

规则引擎自检：

```bash
npm run test:rules
```

> 当前生成环境无法访问 npm registry，因此仓库暂未生成 `package-lock.json`。首次在联网环境执行 `npm install` 后请提交 lockfile。

## 目录

```text
src/
├── app/              # 应用入口
├── pages/            # Builder 各步骤
├── components/       # 通用 UI / Builder UI
├── data/             # 规则数据
├── rules/            # Effect/派生/校验引擎
├── store/            # Builder 状态和 localStorage
└── translations/     # 5echm_web 对照显示层
```

架构说明见 [`docs/architecture.md`](docs/architecture.md)。规则来源说明见 [`docs/rules-sources.md`](docs/rules-sources.md)。
