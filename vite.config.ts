import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 编辑器用原子写入时会在源码目录留下隐藏临时目录（`.<文件名>.<pid>.<uuid>.tmpdir`）；
// Windows 上监听这类临时文件的句柄会以 EBUSY 结束整个开发服务器，因此直接跳过隐藏目录。
// 项目内的源码与资源目录都不以点开头，排除它们不影响热更新。
const HIDDEN_PATH = /(^|[\\/])\.[^\\/]/;

export default defineConfig({
  plugins: [react()],
  // GitHub 项目站点位于仓库子路径，构建与本地预览共用相同资源前缀。
  base: "/dnd-builder/",
  // 规则目录增长后，框架依赖独立缓存，避免主包承担所有运行时代码。
  build: { rollupOptions: { output: { manualChunks(id) { if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react-vendor"; } } } },
  server: {
    port: 5173,
    watch: { ignored: (path: string) => HIDDEN_PATH.test(path) },
  },
});
