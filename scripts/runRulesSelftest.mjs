// 规则自检启动器：把 tsc 产物标记为 CommonJS 后直接运行，避免 npm 脚本依赖 POSIX 的 printf 重定向。
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, ".tmp-rules");

// 输出目录没有 package.json 时会按根目录的 "type": "module" 处理，导致 CommonJS 产物无法执行。
writeFileSync(join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }));

createRequire(import.meta.url)(join(outDir, "scripts", "selftest.js"));
