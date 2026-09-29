import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub 项目站点位于仓库子路径，构建与本地预览共用相同资源前缀。
  base: "/dnd-builder/",
  // 规则目录增长后，框架依赖独立缓存，避免主包承担所有运行时代码。
  build: { rollupOptions: { output: { manualChunks(id) { if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react-vendor"; } } } },
  server: {
    port: 5173,
  },
});
