import type { CharacterBuild, DerivedCharacter } from "../types";
import type { GuideAction } from "./beginnerGuide";
import { signed } from "../engine/format";
import { STAR_FORMS } from "../../data/primalSubclasses";

// 行动说明使用当前构筑的属性和选择；只介绍开卡后可用的三级能力。
export function primalAction(b: CharacterBuild, c: DerivedCharacter): GuideAction | undefined {
  const wis = c.abilities.wisdom.modifier, cha = c.abilities.charisma.modifier;
  const dc = c.spellcasting?.dc, attack = c.spellcasting?.attack ?? 0;
  const wild = "消耗 1 次荒野变形 · 共 2 次，短休恢复 1 次、长休全恢复";
  const actions: Record<string, GuideAction> = {
    land: { id: "lands-aid", title: "支援同伴：大地之援", when: "同伴受伤，附近还有敌人时", how: `60 尺内选一点、10 尺半径；选定敌人体质豁免 DC ${dc}，失败受 2d6 暗蚀伤害，成功半伤。另选区域内一人恢复 2d6 HP。`, cost: `魔法动作 · ${wild}` },
    sea: { id: "wrath-of-sea", title: "近身推敌：瀚海之怒", when: "有敌人在你 5 尺内时", how: `激活 10 分钟海浪光环。激活时或后续附赠动作，选光环内另一可见生物；体质豁免 DC ${dc} 失败受 ${Math.max(1, wis)}d6 寒冷伤害，大型或更小者可推离至多 15 尺。`, cost: `附赠动作 · 激活时${wild}` },
    archfey: { id: "steps-of-the-fey", title: "脱离危险：妖精步伐", when: "近旁有敌人，想换个位置时", how: "用迷踪步传送到 30 尺内可见空位。推荐复苏步伐：传送后你或 10 尺内可见生物获得 1d10 临时 HP，不叠加。另可选嘲弄，见完整卡。", cost: `附赠动作 · 每长休免费 ${Math.max(1, cha)} 次，也可花契约位` },
    celestial: { id: "healing-light", title: "救助同伴：治愈之光", when: "自己或 60 尺内可见同伴受伤时", how: `从独立的 4 枚 d6 中选用 1 至 ${Math.min(4, Math.max(1, cha))} 枚，不超过剩余骰数；恢复所掷总值 HP，不超过上限。这不是法术。`, cost: "附赠动作 · 治疗骰长休全恢复，不耗法术位" },
    "great-old-one": { id: "awakened-mind", title: "悄悄商量：唤醒心灵", when: "需要与一人秘密沟通时", how: `先与 30 尺内可见生物建立连结，持续 3 分钟；之后在 ${Math.max(1, cha)} 英里内双向交谈，使用彼此理解的语言。不能读心，新连结结束旧连结。`, cost: "附赠动作 · 不消耗次数或法术位" },
    hunter: b.choices.ranger?.huntersPrey === "horde-breaker" ? { id: "hunters-prey", title: "相邻敌人：灭族者", when: "两名敌人彼此在 5 尺内时", how: "用武器攻击一名后，可用同一武器额外攻击另一名；后者必须在武器范围内，且你本回合尚未攻击过它。", cost: "每个自己的回合一次 · 不消耗次数" } : { id: "hunters-prey", title: "追击伤者：巨像屠夫", when: "武器命中 HP 尚未回满的生物时", how: "额外掷 1d8，造成与武器相同类型的伤害。先问主持人目标是否已受伤；每回合只能追加一次。", cost: "随武器命中触发 · 不消耗次数" },
    "fey-wanderer": { id: "dreadful-strikes", title: "命中追加：哀惧灵袭", when: "武器命中敌人时", how: `额外造成 1d4 心灵伤害；每名目标每回合至多一次。探索时你也擅长交涉：魅力检定额外 +${Math.max(1, wis)}，纸卡技能已计入。`, cost: "随武器命中触发 · 不消耗次数" },
    "gloom-stalker": { id: "dreadful-strike", title: "关键命中：恐惧打击", when: "武器命中，想加强这次伤害时", how: `额外造成 2d6 心灵伤害，每回合至多一次。战斗首个自己的回合速度是 ${c.speed + 10} 尺；之后恢复 ${c.speed} 尺。`, cost: `随命中触发 · 每长休 ${Math.max(1, wis)} 次` },
  };
  if (b.subclassId === "stars") {
    const star = b.choices.druid?.starForm ?? "archer";
    return { id: "starry-form", title: `星耀形态：${STAR_FORMS[star]}`, when: star === "archer" ? "想追加一次光箭攻击时" : star === "chalice" ? "准备治疗同伴时" : "想更稳地维持专注时", how: star === "archer" ? `激活时及后续附赠动作，对 60 尺内一名生物作远程法术攻击 d20${signed(attack)}，命中受 1d8${signed(wis)} 光耀伤害；形态持续 10 分钟。` : star === "chalice" ? `形态持续 10 分钟；耗位施展恢复 HP 的法术后，可令自己或 30 尺内另一生物再恢复 1d8${signed(wis)} HP。` : "形态持续 10 分钟；智力或感知检定、维持专注的体质豁免，d20 掷出 9 或以下按 10 算。不是全部体质豁免，也不能飞行。", cost: `附赠动作激活 · ${wild}` };
  }
  return actions[b.subclassId];
}
