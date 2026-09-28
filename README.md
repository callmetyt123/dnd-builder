# D&D 5R 角色创建器

面向第一次接触 D&D / TRPG 的玩家设计的引导式 5R 三级角色创建器。

## 产品目标

- 新手不理解规则也能沿推荐路径完成合法角色。
- 熟悉规则的玩家可以展开并修改属性、职业选项、武器精通等配置。
- 规则内容限定为 5R 三宝书范围；当前开发切片先实现《玩家手册 2024》的角色创建规则。
- 中文 D&D 术语以 `DND5eChm/5echm_web` 当前发布内容为显示基准；内部规则 ID 始终使用稳定英文 ID。
- 最终目标输出新手速查卡、完整人物卡、PDF 与 PNG。

## 当前里程碑

`0.3.0`：战士与法师双职业闭环

- 首页 / 玩法偏好
- 战士 → 勇士，或法师 → 塑能师
- 矮人
- 士兵或贤者背景，随职业方案匹配
- 标准数组 + 背景属性提升
- 技能、战斗风格、武器精通、起始装备
- 姓名手填、年龄参考、九宫格阵营
- Review / Validator
- `CharacterBuild -> DerivedCharacter` 规则闭环
- 战士：一页速查、三页完整卡；默认法师：三页施法速查、六页完整卡
- 法师戏法、按升级来源区分的法术书、准备法术、贤者魔法学徒
- 法术攻击、DC、学者专精、法术位与奥术回想
- 两个职业各自保存构筑与资源，可来回切换
- HP、临时 HP、生命骰与能力资源持久化；短休／长休恢复
- 浏览器端 PDF、PNG、A4 打印
- 草稿结构校验、异常数据保留与修复导航

后续按照：月亮结社德鲁伊 → 魔契师 → 驯兽师 → 批量补齐 12 职业 / 48 子职推进。

## 开发

```bash
npm ci
npm run dev
```

规则引擎自检：

```bash
npm run test:rules
```

依赖已通过 npm 官方源安装并生成 `package-lock.json`。Vite 7 要求 Node `^20.19.0 || >=22.12.0`。

2026-09-28 v0.3 验证：91 项规则检查、生产构建、桌面／手机流程及 PDF / PNG 导出通过。范围及限制见 [`docs/verification-v0.3.md`](docs/verification-v0.3.md)。历史记录：[`v0.2`](docs/verification-v0.2.md)、[`源码接手`](docs/verification.md)。

## 目录

```text
src/
├── app/              # 应用入口
├── pages/            # Builder 各步骤
├── components/       # 通用 UI / Builder UI
├── data/             # 规则数据
├── rules/            # Effect/派生/校验引擎
├── store/            # Builder 状态和 localStorage
├── utils/            # 按需加载的导出逻辑
└── translations/     # 5echm_web 对照显示层
```

架构说明见 [`docs/architecture.md`](docs/architecture.md)。规则来源说明见 [`docs/rules-sources.md`](docs/rules-sources.md)。
