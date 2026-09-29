import { newClassGuide } from "./newClassGuide";
import { isNewClass } from "../../data/newClasses";
import { primalAction } from "./primalGuide";
import { MANEUVERS } from "../../data/expandedSubclasses";
import type { CharacterBuild, DerivedCharacter, DerivedAttack, SkillId } from "../types";
import { spell } from "../../data/spells";
import { WEAPONS } from "../../data/weapons";
import { itemNames, damageNames, features, masteryDescriptions } from "../../data/characterDetails";
import { beast } from "../../data/beasts";
import { derivePrimalCompanion } from "../engine/primalCompanion";
import { warlockCantrip } from "../engine/warlock";
import { signed, damageFormula } from "../engine/format";
import { skillNames, masteryName } from "../../translations/zh-CN";
import { ORIGIN_FEATS } from "../../data/originOptions";

export interface GuideAction { id: string; title: string; when: string; how: string; cost: string }
export interface BeginnerGuide { role: string; approach: string; actions: GuideAction[]; reminders: string[]; skills: { id: SkillId; name: string; modifier: number; example: string }[]; originNames: string[] }
const skillExamples: Record<SkillId, string> = {
  acrobatics: "保持平衡、灵巧穿行", "animal-handling": "安抚或判断动物", arcana: "辨识魔法知识", athletics: "攀爬、游泳、搬动重物", deception: "编造说辞", history: "回忆历史线索", insight: "判断对方意图", intimidation: "威慑对方", investigation: "推理、寻找机关线索", medicine: "判断伤势", nature: "辨识自然知识", perception: "留意声音与异常", performance: "表演吸引注意", persuasion: "说服与协商", religion: "回忆信仰知识", "sleight-of-hand": "巧手操作物件", stealth: "隐蔽行动", survival: "追踪、辨认野外方向",
};
// 这些是行动提示，不替代完整法术卡；只从当前已准备法术中选例子。
const spellUses: Record<string, [string, string]> = {
  alarm: ["准备休息或守住一个入口", "给门窗或小片区域设警报，持续 8 小时；先指定不会触发警报的同伴。能花时间时可改用仪式，方法见完整卡。"],
  "detect-magic": ["怀疑附近存在魔法", "感知 30 尺内的魔法效应，再用动作观察可见目标的灵光；厚实遮挡可能阻断侦测。"],
  "feather-fall": ["自己或同伴正在坠落", "对 60 尺内至多五名坠落生物减缓下落；在法术持续的一分钟内落地可免受坠落伤害。"],
  grease: ["想让追兵难以通过地面", "60 尺内制造一块 10 尺方形油腻地面，成为困难地形，并可能使区域内生物倒地；注意别挡住同伴。"],
  sleep: ["想短暂控制一小群敌人", "60 尺内选 5 尺半径区域；目标先后两次感知豁免失败才会昏迷。伤害或他人摇醒会结束效果，具体条件见完整卡。"],
  thunderwave: ["敌人已经靠近，需要推开他们", "以自己为起点放出 15 尺立方雷鸣；体质豁免失败受 2d8 雷鸣伤害并被推 10 尺，成功半伤且不推。一环施展，会波及盟友。"],
  "burning-hands": ["几个敌人站在你面前", "放出 15 尺锥形火焰；敏捷豁免失败受 3d6 火焰伤害，成功半伤。先确认范围里没有盟友。"],
  "mage-armor": ["准备出发，且目标没有穿护甲", "触碰自愿目标，基础 AC 变成 13 加敏捷调整值，持续 8 小时；穿甲会结束效果。完整卡的常驻 AC 不自动计入此法术。"],
  "scorching-ray": ["想集中火力或攻击多个目标", "120 尺内发出三条射线，可以分配目标；每条分别作法术攻击检定，命中造成 2d6 火焰伤害。"],
  shatter: ["敌人聚集在同伴以外的位置", "60 尺内选 10 尺半径区域；体质豁免失败受 3d8 雷鸣伤害，成功半伤。范围内盟友也会受影响。"],
  "hellish-rebuke": ["被 60 尺内可见敌人伤害", "伤害你的敌人作敏捷豁免；失败受 3d10 火焰伤害，成功半伤。这里按二环契约施法。"],
  command: ["想暂时打断敌人的行动", "60 尺内可见目标感知豁免失败，下回合服从一个命令，如放下持握物或趴下；可用命令及二环目标数量见完整卡。"],
  darkness: ["想用黑暗隔开视线", "60 尺内制造 15 尺半径魔法黑暗；普通黑暗视觉不能看穿，你和盟友也可能看不见。"],
  "hold-person": ["想控制一名类人生物", "60 尺内可见目标感知豁免失败则麻痹；它在自己每回合结束时可再豁免脱离。其他类型生物不适用。"],
  suggestion: ["想劝目标执行一个可行建议", "向 30 尺内能听懂你的可见生物提出简短、可行且不明显伤害它或盟友的行动；感知豁免失败才会执行。先看完整卡的结束条件。"],
  "magic-missile": ["想稳定造成伤害", "120 尺内可见目标：三枚飞弹各造成 1d4+1 力场伤害，可分配目标，不掷命中；护盾术可阻挡。这里按一环施展。"],
  shield: ["被攻击命中或被魔法飞弹选中", "AC +5，包含触发的攻击，持续至你的下回合开始；期间免疫魔法飞弹。"],
  "misty-step": ["想脱离危险位置", "传送到 30 尺内可见且未被占据的位置。"],
  web: ["敌人集中，想限制移动", "在 60 尺内放置蛛网，先确认支撑物和盟友位置；进入或在内开始回合的生物可能被束缚，详见法术卡。"],
  "healing-word": ["60 尺内可见的同伴需要治疗", "同伴恢复 2d4 + 你的施法属性调整值 HP（一环）；在完整卡查看该来源的施法属性。"],
  "cure-wounds": ["能触碰到需要治疗的同伴", "恢复 2d8 + 你的施法属性调整值 HP（一环）；不能超过 HP 上限。"],
  entangle: ["想让一片区域的敌人难以移动", "90 尺内生出 20 尺方形植物；区域成为困难地形，出现时区域内生物力量豁免失败则束缚。先避开盟友。"],
  "faerie-fire": ["想帮助大家发现、攻击敌人", "60 尺内选 20 尺立方区域；敏捷豁免失败的生物发光。能看见它的攻击者获得优势，注意别把盟友也选进去。"],
  hex: ["准备持续攻击一个敌人", "90 尺内诅咒一个可见目标；你的攻击检定命中它时额外造成 1d6 暗蚀伤害。心灵之楔不作攻击检定，不能触发。"],
  "armor-of-agathys": ["预计会被近战攻击", "用二环契约法术位获得 10 临时 HP；法术生效期间被近战攻击命中时，攻击者受 10 寒冷伤害。临时 HP 不叠加，详见法术卡的结束条件。"],
  invisibility: ["想让自愿的同伴或自己隐蔽行动", "触碰目标，使其隐形；目标攻击、造成伤害或施法会结束效果。隐形不代表无声或一定不会被发现。"],
  "disguise-self": ["想改变外貌以便交涉或潜入", "用幻象改变外貌与衣着，持续 1 小时；触摸会揭穿不吻合之处，不能改变实际体型。"],
  "fog-cloud": ["需要遮挡视线", "制造浓雾遮蔽区域；雾也会挡住你和同伴的视线，先商量位置。"],
  "charm-person": ["想尝试缓和与类人生物的交涉", "30 尺内目标作感知豁免；失败后被你魅惑并对你友好。不是控制思想；法术结束后它会知道被你魅惑。"],
};
const attackCantrips: Record<string, [string, string, string]> = {
  "vicious-mockery": ["感知豁免", "1d6 心灵；下回合结束前的下一次攻击有劣势", "60 尺"], "sacred-flame": ["敏捷豁免", "1d8 光耀；该豁免不受半身或四分之三掩护影响", "60 尺"], "sorcerous-burst": ["远程法术攻击", "1d8 所选类型；掷出 8 可追加骰，见完整卡", "120 尺"],
  "fire-bolt": ["远程法术攻击", "1d10 火焰", "120 尺"], "ray-of-frost": ["远程法术攻击", "1d8 寒冷；速度 −10 尺至其下回合开始", "60 尺"],
  "shocking-grasp": ["近战法术攻击", "1d8 闪电；目标至其下回合开始不能借机攻击", "触碰"], "thorn-whip": ["近战法术攻击", "1d6 穿刺；大型或更小目标可被拉近至多 10 尺", "30 尺"],
  "starry-wisp": ["远程法术攻击", "1d8 光耀；目标发光，至你的下回合结束无法受益于隐形", "60 尺"],
  "mind-sliver": ["智力豁免", "1d6 心灵；目标下次豁免减 1d4（你的下回合结束前）", "60 尺"],
};
const spellOrder = ["healing-word", "web", "magic-missile", "armor-of-agathys", "entangle", "shield", "misty-step", "hex", "cure-wounds", "disguise-self", "fog-cloud", "faerie-fire", "invisibility", "charm-person"];
function spellAction(c: DerivedCharacter, id: string): GuideAction {
  const s = spell(id)!;
  const use = spellUses[id];
  const healingModifier = c.spellcasting!.attack - c.proficiencyBonus;
  let how = use?.[1].replace(/ \+ 你的施法属性调整值/g, signed(healingModifier)).replace("；在完整卡查看该来源的施法属性", "") ?? "先翻到完整人物卡中的这道法术，确认目标、范围和效果，再向主持人描述你的做法。";
  if (c.pactMagic && id === "burning-hands") how = how.replace("3d6", "4d6");
  if (c.pactMagic && id === "cure-wounds") how = how.replace("2d8", "4d8").replace("（一环）", "（二环）");
  // 此处只生成职业法术提示；起源法术保留自身的伤害类型。
  if (c.pactMagic?.psychicDamage) how = how.replace(/(暗蚀|火焰|寒冷|光耀|闪电|力场|雷鸣|强酸|毒素|钝击|穿刺|挥砍)(?=伤害)/g, "心灵");
  if (how.includes("豁免")) how += ` 豁免难度 DC ${c.spellcasting!.dc}，由主持人处理。`;
  return { id, title: s.name, when: use?.[0] ?? "需要这道已准备法术的效果时", how,
    cost: `${s.time} · ${c.pactMagic ? "1 格二环契约法术位" : `1 格${s.level === 1 ? "一" : "二"}环法术位`}${s.concentration ? " · 需要专注" : ""} · 成分见完整卡` };
}
function weaponAction(c: DerivedCharacter): GuideAction {
  // 从实际持有的武器中优先选命中较高且无当前属性劣势者，不推荐未持有武器。
  const a: DerivedAttack = [...c.attacks].sort((a, b) => Number(!!a.disadvantage) - Number(!!b.disadvantage) || b.attackBonus - a.attackBonus || Number(!!b.mastery?.unlocked) - Number(!!a.mastery?.unlocked))[0];
  const weapon = WEAPONS[a.weaponId], ranged = weapon.category.endsWith("ranged");
  const mastery = a.mastery?.unlocked ? ` ${masteryName(a.mastery.id)}：${masteryDescriptions[a.mastery.id]}` : "";
  return { id: a.weaponId, title: `用${itemNames[a.weaponId]}攻击`, when: "想直接攻击敌人时", how: `${ranged ? `建议在 ${a.range![0]} 尺内` : "近战 5 尺内"}，掷 d20${signed(a.attackBonus)}，达到目标 AC 就命中；伤害 ${damageFormula(a.damageDice, a.damageModifier)} ${damageNames[a.damageType]}。${a.disadvantage ? ` ${a.disadvantage}。` : ""}${mastery}`, cost: "动作 · 三级通常攻击一次" };
}
function basicAction(c: DerivedCharacter): GuideAction {
  for (const id of c.spellcasting?.cantrips ?? []) {
    const effect = warlockCantrip(c, id), simple = attackCantrips[id];
    if (!effect && !simple) continue;
    const attack = effect ? effect.attack : simple[0].includes("攻击");
    return { id, title: spell(id)!.name, when: "想保留法术位、继续造成伤害时", how: `${effect ? effect.rangeLabel ?? `${effect.range} 尺` : simple[2]}内，${attack ? `掷 d20${signed(c.spellcasting!.attack)} 作${effect ? effect.attackLabel : simple[0]}，达到目标 AC 命中` : `目标作${effect?.save ?? simple[0].replace("豁免", "")}豁免（DC ${c.spellcasting!.dc}），失败`}后造成 ${effect ? effect.damage : simple[1]}。${effect?.note ?? ""}${effect?.push ? "命中大型或更小生物，可推离至多 10 尺。" : ""}`, cost: "动作 · 戏法，不消耗法术位" };
  }
  return weaponAction(c);
}
export function beginnerGuide(build: CharacterBuild, c: DerivedCharacter): BeginnerGuide {
  const selected = [...(c.spellcasting?.prepared ?? [])].sort((a, b) => (spellOrder.includes(a) ? spellOrder.indexOf(a) : 999) - (spellOrder.includes(b) ? spellOrder.indexOf(b) : 999));
  const spells = selected.slice(0, 2).map((id) => spellAction(c, id));
  let role = "", approach = "", actions: GuideAction[] = [], reminders: string[] = [];
  if (build.classId === "fighter") {
    role = "你依靠武器和护甲作战。可以靠近敌人，为同伴争取行动空间。";
    approach = "先选能接近的敌人，用武器攻击；受伤时考虑回气，关键时刻再用动作如潮。";
    actions = [weaponAction(c), { id: "second-wind", title: "受伤时：回气", when: "自己的 HP 降低时", how: "恢复 1d10+3 HP，不超过上限；每长休有 2 次，短休恢复 1 次。", cost: "附赠动作 · 消耗 1 次回气" }, { id: "action-surge", title: "关键时刻：动作如潮", when: "需要再攻击一次或做另一件事时", how: "本回合再获得一个动作，可以再攻击；不能用这额外动作执行魔法动作。每短休或长休恢复 1 次。", cost: "不占动作 · 每回合至多一次 · 消耗 1 次动作如潮" }];
    reminders = [`武器或徒手攻击 d20 掷出 ${c.criticalThreshold === 19 ? "19–20" : "20"} 时重击：伤害骰翻倍，固定加值不翻倍。`, "链甲让隐匿检定有劣势；侦察时可以让更擅长潜行的同伴先走。"];
    if (build.subclassId === "battle-master") {
      const id = build.choices.fighter!.maneuvers[0], m = MANEUVERS[id];
      actions[2] = { id: "combat-superiority", title: `战技：${m.name}`, when: m.timing, how: m.text + ` 若需豁免，DC ${10 + Math.max(c.abilities.strength.modifier, c.abilities.dexterity.modifier)}；其余两项见完整卡。`, cost: "消耗 1 枚卓越骰 · 共 4 枚 d8，短休或长休全恢复" };
      approach = "先用武器攻击；需要战技时查看触发条件，受伤时考虑回气。";
      reminders[1] = "每次攻击只能用一种战技。动作如潮可再获得一个非魔法动作；用后短休或长休恢复。";
    } else if (build.subclassId === "eldritch-knight") {
      actions[2] = spellAction(c, c.spellcasting!.prepared.includes("shield") ? "shield" : c.spellcasting!.prepared[0]);
      approach = "以武器为主；需要魔法效果时再花法术位，受伤时用回气。";
      reminders[1] = "只有两个一环位，长休恢复；材料和空手要求见完整卡。三级不能用一次攻击替换戏法，动作如潮不能执行魔法动作。";
    } else if (build.subclassId === "psi-warrior") {
      actions[2] = { id: "protective-field", title: "同伴受伤：庇护力场", when: "你或 30 尺内可见生物受到伤害时", how: `减少 1d6${signed(c.abilities.intelligence.modifier)} 伤害，减伤至少 1；先告诉主持人你要用反应保护谁。`, cost: "反应 · 消耗 1 枚灵能骰；共 4 枚 d6，短休恢复 1 枚" };
      approach = "先用武器攻击；留意同伴受伤，及时声明庇护力场。";
      reminders[1] = `自己的回合武器命中并伤害 30 尺内目标后，可花一枚灵能骰追加 1d6${signed(c.abilities.intelligence.modifier)} 力场伤害，每个自己的回合一次；灵能骰长休全恢复。`;
    }
  } else if (build.classId === "rogue") {
    role = "你擅长利用时机打出偷袭，也能用熟练技能处理探索中的难题。";
    approach = "先看能否触发偷袭，再选位置攻击；需要退开时，用附赠动作撤离。";
    let attack = weaponAction(c);
    if (build.subclassId === "soulknife") {
      const mod = Math.max(c.abilities.dexterity.modifier, c.abilities.strength.modifier);
      attack = { id: "psychic-blades", title: "用念刃攻击", when: "有一只空手、想攻击敌人时", how: `近战 5 尺或投掷正常射程 60 尺：d20${signed(mod + c.proficiencyBonus)} 达到目标 AC 后造成 ${damageFormula("1d6", mod)} 心灵伤害。命中并造成伤害后，对该目标的下一次攻击有优势，须在你的下回合结束前。`, cost: "动作 · 不耗灵能骰 · 投掷最远 120 尺，超 60 尺有劣势" };
    }
    const subtype: Record<string, GuideAction> = {
      thief: { id: "fast-hands", title: "需要动手操作：快手", when: "开锁、解除陷阱或使用物品时", how: `可用附赠动作进行巧手与盗贼工具操作；巧手 d20${signed(c.skills["sleight-of-hand"].modifier)}。也能用操作动作或物品允许的魔法动作，具体条件见完整卡。`, cost: "附赠动作 · 开锁、拆陷阱需要盗贼工具" },
      assassin: { id: "assassinate", title: "第一轮：抢占先机", when: "战斗刚开始时", how: "先攻有优势；第一轮攻击还未进行过回合的敌人也有优势。在这一轮命中并造成偷袭时，再加 3 点同类型伤害。", cost: "自动适用条件 · 不会自动重击" },
      "arcane-trickster": { id: "mage-hand", title: "探索时：法师之手", when: "想在安全距离操作小物件时", how: "召出可隐形的手；可用附赠动作操控，进行巧手检定。限 30 尺、10 磅，不能攻击或激活魔法物品。", cost: "附赠动作 · 戏法，不耗法术位 · 仍需言语和姿势" },
      soulknife: { id: "psi-bolstered-knack", title: "熟练检定失败：灵振诀窍", when: "熟练的技能或工具检定失败后", how: "有灵能骰时，掷 1d6 加到结果上；只有因此成功才消耗。不能用于攻击、豁免或未熟练的检定。", cost: "不占动作 · 4 枚 d6，短休恢复 1 枚、长休全恢复" },
    };
    actions = [attack, { id: "cunning-action", title: "安全退开：灵巧动作", when: "近旁有敌人，想移动离开时", how: "先用撤离，再移动；本回合移动不触发借机攻击。也可改选疾走或在满足遮蔽与视线条件时躲藏。", cost: "附赠动作 · 不消耗次数" }, subtype[build.subclassId]];
    reminders = ["偷袭：灵巧或远程武器命中，且攻击有优势；或目标 5 尺内有未失能盟友且你无劣势。每回合一次，额外 2d6，未计入上面的伤害。", build.subclassId === "soulknife" ? "第二只手空闲时，本回合可用附赠动作再用一把念刃攻击（1d4 加属性伤害）；会占用撤离所需的附赠动作。" : build.subclassId === "arcane-trickster" ? `已准备：${c.spellcasting!.prepared.map((id) => spell(id)!.name).join("、")}。只有 2 格一环位，长休恢复；施展前查看完整卡的效果与材料。` : "稳定瞄准可让下一次本回合攻击有优势，但须本回合尚未移动，并花附赠动作，之后本回合不能移动。"];
  } else if (build.classId === "druid") {
    const form = beast(build.choices.druid!.knownForms[0])!;
    role = "你能用自然魔法帮助队伍，也能变成已知野兽探索或战斗。";
    approach = "先判断要施法还是变形。远处用戏法；需要兽形能力时，翻到对应兽形卡再变形。";
    actions = [basicAction(c), { id: form.id, title: `变形：${form.name}`, when: "需要所选野兽的行动或探索能力时", how: `变成该已知兽形并获得 ${build.subclassId === "moon" ? 9 : 3} 临时 HP；HP 上限不变，临时 HP 耗尽也不会自动变回。攻击和移动使用完整卡中的兽形数据。`, cost: "附赠动作 · 消耗 1 次荒野变形；上限 2 次，短休恢复 1 次" }, spells[0]];
    reminders = ["兽形只能施展结社明确允许的法术，仍需成分；原形与兽形数值分开查询。", "同一时间只能维持一个专注效果；受伤时提醒主持人进行维持专注的体质豁免。"];
    if (build.subclassId !== "moon") {
      actions[1] = primalAction(build, c)!;
      approach = "先在安全位置用戏法，需要支援或特殊能力时，再花法术位或荒野变形次数。";
      reminders[0] = "野兽形态只能选 CR ≤ 1/4 且无飞行速度的已知形态，获得 3 临时 HP，三级不能在野兽形态施法。";
    }
  } else if (build.classId === "ranger" && c.primalCompanion) {
    const p = derivePrimalCompanion(c, c.primalCompanion!);
    role = "你和原初行侣一起行动，能用武器、自然魔法和伙伴协助队伍。";
    approach = "自己攻击，再考虑用附赠动作指挥伙伴；想施展猎人印记时，先决定这个回合怎样分配附赠动作。";
    actions = [weaponAction(c), { id: "primal-companion", title: `指挥${p.name}`, when: "想让伙伴攻击或做其他事情时", how: `伙伴在你的回合行动。野兽打击：近战 5 尺，d20${signed(p.attack)}，命中造成 ${p.damage} ${damageNames[c.primalCompanion!.damage]}。未指挥时只回避。`, cost: "你的附赠动作；或牺牲自己的一次攻击，仅指挥野兽打击" }, { id: "hunters-mark", title: "持续追击：猎人印记", when: "准备连续攻击一个敌人时", how: "90 尺内标记可见目标；你本人的攻击命中它时额外 +1d6 力场伤害，伙伴不加伤。需要专注。", cost: "附赠动作 · 每长休免费 2 次，用完可耗 1 格一环位" }];
    reminders = ["指挥伙伴、施展或转移猎人印记都可能占用附赠动作，一个回合只能用一个。", "你与伙伴分别记录 HP；伙伴形态、特殊能力和恢复方式见完整卡。"];
  } else if (build.classId === "ranger") {
    role = "你擅长用武器追猎，也能用自然魔法帮助探索与治疗。";
    approach = "先用武器攻击；想持续追击时施展猎人印记，再检查子职能力的触发条件。";
    actions = [weaponAction(c), { id: "hunters-mark", title: "持续追击：猎人印记", when: "准备连续攻击一个敌人时", how: "90 尺内标记可见目标；你的攻击命中它时额外 +1d6 力场伤害。需要专注，转移目标仍用附赠动作。", cost: "附赠动作 · 每长休免费 2 次，用完可耗 1 格一环位" }, primalAction(build, c)!];
    reminders = ["猎人印记与其他专注法术不能同时维持；受伤需作维持专注的体质豁免。", "武器基础伤害不包含条件加伤，触发时再加骰。三级攻击动作通常只有一次攻击。"];
  } else {
    role = build.classId === "wizard" ? "你靠奥术应对不同局面。戏法适合日常使用，法术位留给需要扭转局势的时刻。" : "你用戏法稳定作战，并以少量契约法术和所选祈唤应对关键局面。";
    approach = "先找安全位置；没有特别需求时用常用攻击，遇到危险或机会再考虑下面的法术。";
    actions = [basicAction(c), ...spells];
    reminders = [build.classId === "wizard" ? "三级塑能师还没有保护盟友免受范围法术影响的法术塑形；放范围法术前先确认同伴位置。" : "契约法术位只有 2 格，均为二环，短休或长休恢复；戏法不耗位。祈唤只增强你实际指定的法术。", "同一时间只专注一个效果；受伤时提醒主持人进行维持专注的体质豁免。一回合最多消耗一个法术位施法。"];
  }
  if (build.classId === "warlock" && build.subclassId !== "fiend") {
    actions[2] = primalAction(build, c)!;
    if (build.subclassId === "great-old-one") reminders[1] = "职业惑控与幻术可省去言语、姿势，但材料仍需满足；起源法术不受影响。每次施展职业法术可选择心灵伤害。";
  }
  if (build.classId === "wizard" && build.subclassId !== "evoker") {
    const abilities: Record<string, GuideAction> = {
      abjurer: { id: "arcane-ward", title: "防护自己：奥术守御", when: "消耗法术位施展防护法术时", how: `可创建上限 ${6 + c.abilities.intelligence.modifier} HP 的结界，优先替你承伤，溢出才扣自身 HP；每长休只能创建一次。记录栏与恢复方式见完整卡。`, cost: "随防护法术建立 · 三级仅保护自己" },
      diviner: { id: "portent", title: "掷骰前：使用预兆", when: "你或可见生物即将作 D20 检定时", how: "长休后掷两个 d20 并记下。检定前声明用其中一个结果替换，不能等掷完再选；每回合一次，每个结果用后划掉。", cost: "不占动作 · 每长休两个预见骰" },
      illusionist: { id: "improved-illusions", title: "探索时：次级幻象", when: "想用声音或静止影像误导注意时", how: "90 尺内制造声音与至多 5 尺立方的静止物件影像，可同时创造。先描述想让对方看到或听到什么；幻象没有实体，触摸或调查可能识破。", cost: "附赠动作或动作 · 戏法，不耗位 · 仍需姿势和材料" },
    };
    actions[2] = abilities[build.subclassId];
    reminders[0] = build.subclassId === "illusionist" ? "幻术无需言语；原施法距离至少 10 尺时增加 60 尺，完整卡已显示调整结果。幻象的实际作用需与主持人沟通。" : "有四个一环位和两个二环位，长休恢复；短休时每长休一次可用奥术回想恢复总环阶至多二的法术位。";
  }
  if (isNewClass(build.classId)) {
    const guide = newClassGuide(build, c, basicAction(c), weaponAction(c), build.classId === "cleric" ? spellAction(c, "cure-wounds") : undefined)!;
    ({role, approach, actions, reminders} = guide);
  }
  const skills = (Object.keys(c.skills) as SkillId[]).filter((id) => c.skills[id].proficiency !== "none").sort((a, b) => c.skills[b].modifier - c.skills[a].modifier).slice(0, 3).map((id) => ({ id, name: skillNames[id], modifier: c.skills[id].modifier, example: skillExamples[id] }));
  return { role, approach, actions, reminders, skills, originNames: [...c.speciesFeatures.filter((id) => features[id]), ...ORIGIN_FEATS.filter((id) => c.features.includes(id))].map((id) => features[id].name) };
}
