import { GAMING_SETS } from "./characterDetails";
import type { OriginFeat } from "../rules/types";
// 巧匠仅允许快速制作表中的八种工具；工匠背景则允许全部工匠工具。
export const ARTISAN_TOOLS: Record<string, string> = {"alchemists-supplies": "炼金工具", "brewers-supplies": "酿酒工具", "calligraphers-supplies": "书法工具", "carpenters-tools": "木匠工具", "cartographers-tools": "制图工具", "cobblers-tools": "鞋匠工具", "cooks-utensils": "厨师工具", "glassblowers-tools": "玻璃匠工具", "jewelers-tools": "珠宝匠工具", "leatherworkers-tools": "皮匠工具", "masons-tools": "石匠工具", "painters-supplies": "画家工具", "potters-tools": "陶匠工具", "smiths-tools": "铁匠工具", "tinkers-tools": "修补工具", "weavers-tools": "织布工具", "woodcarvers-tools": "木雕工具"};
export const INSTRUMENTS: Record<string, string> = {"bagpipes": "风笛", "drum": "鼓", "dulcimer": "扬琴", "flute": "长笛", "horn": "号角", "lute": "鲁特琴", "lyre": "里拉琴", "pan-flute": "排箫", "shawm": "唢呐", "viol": "提琴"};
export const CRAFTER_TOOLS = ["carpenters-tools", "leatherworkers-tools", "masons-tools", "potters-tools", "smiths-tools", "tinkers-tools", "weavers-tools", "woodcarvers-tools"];
export const TOOL_OPTIONS = { ...ARTISAN_TOOLS, ...INSTRUMENTS, ...GAMING_SETS, "disguise-kit": "易容工具", "forgery-kit": "文书伪造工具", "herbalism-kit": "草药工具", "navigators-tools": "领航工具", "poisoners-kit": "制毒工具", "thieves-tools": "盗贼工具" };
export const ORIGIN_FEATS: OriginFeat[] = ["alert", "crafter", "healer", "lucky", "magic-initiate", "musician", "savage-attacker", "skilled", "tavern-brawler", "tough"];
export const CRAFTING: Record<string, string> = { "carpenters-tools": "梯子、火把", "leatherworkers-tools": "小箱子、卷轴匣、小包", "masons-tools": "滑轮组", "potters-tools": "壶、油灯", "smiths-tools": "滚珠、桶、铁蒺藜、爪钩、铁锅", "tinkers-tools": "铃铛、铲子、火绒盒", "weavers-tools": "篮子、绳索、捕网、帐篷", "woodcarvers-tools": "短棒、巨棒、长棍" };
