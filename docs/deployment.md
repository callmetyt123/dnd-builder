# GitHub Pages 部署

- 代码仓库：<https://github.com/callmetyt123/dnd-builder>
- 站点地址：<https://callmetyt123.github.io/dnd-builder/>
- 发布分支：`main`
- 工作流：`.github/workflows/ci.yml`，显示名称 **CI and Pages**。

## 首次启用（仓库管理员操作）

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions → CI and Pages → Run workflow**，选择 `main` 后运行。
4. 等待 `check` 和 `deploy` 两个任务均通过，然后打开站点地址。

如果首次推送发生在 Pages 启用之前，`check` 可通过，但 `deploy` 会因 Pages 未配置而失败；启用后重新运行工作流即可。GitHub Free 使用公开仓库提供 Pages，私有仓库的可用性取决于账号套餐；仓库公开性由管理员决定。

## 后续发布

功能分支创建 PR 后会执行规则检查和生产构建；只有 `main` 的推送或针对 `main` 的手动运行会发布。测试或构建失败不会进入部署。部署上传 `dist` 产物，不将它提交到 Git，也不需要本地 SSH 私钥或个人访问令牌作为 Actions secret。

## 本地运行

```bash
npm ci
npm run dev
# http://localhost:5173/dnd-builder/

npm run test:rules
npm run build
npm run preview
# http://localhost:4173/dnd-builder/
```

Vite 的 `base` 固定为 `/dnd-builder/`。更换仓库名或改为自定义域名时，应同步调整该值。当前页面步骤使用应用状态，不依赖服务器路径路由。

角色数据保存在访问者浏览器的 localStorage 中，不上传到 GitHub；线上域名与 localhost 的存档互相独立。PDF、PNG 仍在浏览器中生成。实际 PDF 下载文件由用户手动验收。

## 仓库身份

本仓库本地 Git 配置使用 `callmetyt123 <1530271921@qq.com>`，并通过仓库级 `core.sshCommand` 选择个人 SSH 密钥。全局 Git 身份不变；其他电脑克隆后需要自行设置仓库级身份和认证，因为 `.git/config` 不进入版本控制。不要把 SSH 私钥提交到仓库或上传为 Pages 构建文件。
