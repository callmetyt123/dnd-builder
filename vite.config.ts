import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub 项目站点位于仓库子路径，构建与本地预览共用相同资源前缀。
  base: "/dnd-builder/",
  server: {
    port: 5173,
  },
});
