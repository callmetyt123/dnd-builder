# D&D 5R 角色创建器

面向第一次接触 D&D / TRPG 的玩家设计的引导式 5R 三级角色创建器。

## 产品目标

- 新手不理解规则也能沿推荐路径完成合法角色。
- 熟悉规则的玩家可以展开并修改属性、职业选项、武器精通等配置。
- 规则内容限定为 5R 三宝书范围；当前开发切片先实现《玩家手册 2024》的角色创建规则。
- 中文 D&D 术语以 `DND5eChm/5echm_web` 当前发布内容为显示基准；内部规则 ID 始终使用稳定英文 ID。
- 最终目标输出新手速查卡、完整人物卡、PDF 与 PNG。

## 当前里程碑

`0.10.0`：车卡完成页与两种输出重新分工，当前开放 6 职业 / 9 子职路线。

- 完成页聚焦检查、修改与带走角色，移除 HP 加减、休息、施法扣位、变形和伙伴等在线冒险操作。
- **新人上手卡**固定一页：角色定位、回合入门、三个常用选择、三项实际熟练技能及两条提醒。不附法术清单或其他数据页。
- 上手建议来自实际所选武器、法术、祈唤、技能、兽形与子职；有合法自定义时，不用默认推荐覆盖它。
- **完整人物卡**保留完整数值、能力、装备和身份；按实际构筑附上起源、法术、兽形、魔宠或伙伴页。
- 完整卡提供当前 HP、临时 HP 的手写位置，以及资源、法术位和生命骰的已用勾选框。旧冒险状态保留在草稿中，但不影响新生成的卡片。
- 两种卡分别支持 PDF、PNG 和打印，手机预览自适应，导出树保持独立 A4 宽度。

已开放：战士／勇士、法师／塑能师、德鲁伊／月亮结社、魔契师／邪魔宗主、游侠／驯兽师，以及游荡者／盗贼、刺客、诡术师、魂刃。全部 10 种族与谱系、16 背景、10 起源专长、标准数组和包 A 继续支持。其他职业法术与兽形仍有已标注的精选范围。

完整目标为 12 职业 / 48 子职及三级合法选项。见 [产品定位](docs/product-scope.md)。本期优先完成新人交付体验，战士子职扩展留待后续阶段。

v0.10：21969 项规则与输出检查通过；包括九条路线 × 十种族 × 十六背景的单页、技能及法术来源验证。90 份上手卡布局样例和九套完整卡通过 A4 DOM 尺寸检查；桌面／手机交互通过。见 [验证记录](docs/verification-v0.10.md)。实际 PDF 下载文件仍由用户手动验看。

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

2026-09-28 v0.4 验证：142 项规则检查、生产构建、桌面／手机交互及三职业存档切换通过。按用户偏好，未验证实际 PDF 下载文件。范围、来源及人工记录边界见 [`docs/verification-v0.4.md`](docs/verification-v0.4.md)。历史记录：[`v0.3`](docs/verification-v0.3.md)、[`v0.2`](docs/verification-v0.2.md)、[`源码接手`](docs/verification.md)。

v0.6：243 项规则检查、生产构建、桌面／手机交互及五职业存档切换通过。范围与截图见 [`docs/verification-v0.6.md`](docs/verification-v0.6.md)。不检查实际 PDF 下载文件。

v0.5 验证与支持范围见 [`docs/verification-v0.5.md`](docs/verification-v0.5.md)。

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

## GitHub Pages

[Website](https://callmetyt123.github.io/dnd-builder/) | [Deployment guide](docs/deployment.md)

Local development: `http://localhost:5173/dnd-builder/`. Production preview: `http://localhost:4173/dnd-builder/`.
