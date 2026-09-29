import type { FighterChoices, FighterSubclass, WizardSubclass } from "../rules/types";
// 只声明三级能力；更高等级的能力不进入当前构筑。
export const FIGHTER_SUBCLASSES: Record<FighterSubclass, { name: string; complexity: string; reason: string; features: string[] }> = {
  champion: { name: "勇士", complexity: "推荐 · 较少资源管理", reason: "强化武器重击和运动能力，先熟悉攻击、回气与动作如潮。", features: ["improved-critical", "remarkable-athlete"] },
  "battle-master": { name: "战斗大师", complexity: "适中 · 战技与卓越骰", reason: "选择三种战技，在攻击和保护同伴时花费卓越骰。", features: ["combat-superiority", "student-of-war"] },
  "eldritch-knight": { name: "奥法骑士", complexity: "较复杂 · 武器与法术", reason: "以武器为主，少量奥术补充防护和远程手段；需留意材料和空手。", features: ["knight-spellcasting", "war-bond"] },
  "psi-warrior": { name: "灵能武士", complexity: "适中 · 灵能骰", reason: "用灵能减伤、增强武器伤害或移动同伴；智力影响效果。", features: ["psi-warrior-energy", "protective-field", "psionic-strike", "telekinetic-movement"] },
};
export const WIZARD_SUBCLASSES: Record<WizardSubclass, { name: string; school: string; complexity: string; reason: string; book: string[]; features: string[] }> = {
  evoker: { name: "塑能师", school: "塑能", complexity: "推荐 · 伤害效果直观", reason: "伤害戏法失手仍可半伤；范围法术依然会伤及同伴。", book: ["scorching-ray", "shatter"], features: ["evocation-savant", "potent-cantrip"] },
  abjurer: { name: "防护师", school: "防护", complexity: "适中 · 记录守御 HP", reason: "以防护魔法建立结界，为自己承伤；三级尚不能替同伴承伤。", book: ["arcane-vigor", "mage-armor"], features: ["abjuration-savant", "arcane-ward"] },
  diviner: { name: "预言师", school: "预言", complexity: "适中 · 提前使用预兆", reason: "长休后记录两个 d20，在检定发生前用预兆替换结果。", book: ["see-invisibility", "detect-thoughts"], features: ["divination-savant", "portent"] },
  illusionist: { name: "幻术师", school: "幻术", complexity: "较复杂 · 描述幻象", reason: "用声音和影像误导感官；需要向主持人描述用途，幻象并非实物。", book: ["invisibility", "mirror-image"], features: ["illusion-savant", "improved-illusions"] },
};
export const MANEUVERS: Record<string, { name: string; timing: string; text: string }> = {
  ambush: { name: "伏击", timing: "隐匿或先攻检定时", text: "未失能时消耗 1d8，加到敏捷（隐匿）或先攻结果上。" },
  "bait-and-switch": { name: "换位诈术", timing: "自己回合 · 消耗至少 5 尺移动", text: "与 5 尺内自愿且未失能生物换位，不触发借机攻击。消耗 1d8，选择你或对方获得等于骰值的 AC 加值，至你的下回合开始。" },
  "commanders-strike": { name: "指挥官奇袭", timing: "自己回合 · 攻击动作中替换一次攻击", text: "消耗 1d8；能看见或听见你的伙伴可用反应作一次武器攻击或徒手打击，命中时伤害加此骰值。" },
  "commanding-presence": { name: "领导风范", timing: "威吓、表演或游说检定时", text: "消耗 1d8，将骰值加入该魅力检定。" },
  "disarming-attack": { name: "缴械攻击", timing: "攻击检定命中后", text: "消耗 1d8 加入伤害。目标力量豁免失败，掉落你选的一件持握物到其空间内。" },
  "distracting-strike": { name: "扰乱打击", timing: "攻击检定命中后", text: "消耗 1d8 加入伤害。你的下回合开始前，其他生物对目标的下一次攻击检定有优势。" },
  "evasive-footwork": { name: "灵巧步法", timing: "附赠动作", text: "消耗 1d8，执行撤离；AC 加此骰值至你的下回合开始。" },
  "feinting-attack": { name: "诡诈攻击", timing: "附赠动作", text: "消耗 1d8，选择 5 尺内生物；本回合对其下一次攻击有优势，命中时伤害加此骰值。" },
  "goading-attack": { name: "挑衅攻击", timing: "攻击检定命中后", text: "消耗 1d8 加入伤害。目标感知豁免失败，至你的下回合结束攻击其他生物具有劣势。" },
  "lunging-attack": { name: "突刺攻击", timing: "附赠动作", text: "消耗 1d8 并疾走。本回合直线移动至少 5 尺后，立即以攻击动作中的近战攻击命中，可将骰值加入伤害。" },
  "maneuvering-attack": { name: "灵动攻击", timing: "攻击检定命中后", text: "消耗 1d8 加入伤害。能看见或听见你的自愿生物可用反应移动至多半速；只免于本次攻击目标的借机攻击。" },
  "menacing-attack": { name: "恐吓攻击", timing: "攻击检定命中后", text: "消耗 1d8 加入伤害。目标感知豁免失败则恐慌，至你的下回合结束。" },
  parry: { name: "格挡", timing: "反应 · 被其他生物近战攻击检定伤害", text: "消耗 1d8，减少等于骰值加力量或敏捷调整值的伤害。" },
  "precision-attack": { name: "精准攻击", timing: "攻击检定失手后", text: "消耗 1d8 加入该次攻击检定，可能将失手改为命中。" },
  "pushing-attack": { name: "推撞攻击", timing: "武器或徒手攻击检定命中后", text: "消耗 1d8 加入伤害。大型或更小目标力量豁免失败，被直线推离你至多 15 尺。" },
  rally: { name: "重整旗鼓", timing: "附赠动作", text: "消耗 1d8，30 尺内能看见或听见你的盟友获得骰值 +1 临时 HP（三级）；临时 HP 不叠加。" },
  riposte: { name: "反击", timing: "反应 · 生物近战攻击检定对你失手", text: "消耗 1d8，用武器或徒手打击对攻击者作一次近战攻击检定；命中时伤害加此骰值。" },
  "sweeping-attack": { name: "横扫攻击", timing: "武器或徒手近战攻击检定命中后", text: "消耗 1d8；选择触及内且距原目标不超过 5 尺的另一生物。原攻击检定足以命中它时，造成骰值的同类型伤害。" },
  "tactical-assessment": { name: "战术预估", timing: "调查、历史或洞悉检定时", text: "消耗 1d8，将骰值加入智力（调查或历史）或感知（洞悉）检定。" },
  "trip-attack": { name: "摔绊攻击", timing: "武器或徒手攻击检定命中后", text: "消耗 1d8 加入伤害。大型或更小目标力量豁免失败则倒地。" },
};
export const EXPANDED_FEATURES: Record<string, { name: string; timing: string; text: string }> = {
  "combat-superiority": { name: "卓越战技", timing: "4 枚 d8 · 短休或长休全恢复", text: "掌握三种所选战技；每次攻击只能应用一种。战技、豁免 DC 和操作见子职附页。" },
  "student-of-war": { name: "战争学者", timing: "被动", text: "额外获得一种工匠工具熟练和一项战士技能熟练；熟练不赠送工具实物。" },
  "knight-spellcasting": { name: "奥法骑士施法", timing: "智力施法", text: "两道戏法，三道一环准备法术；两个一环位，长休恢复。升级才可替换一道准备法术；三级没有战争魔法。" },
  "war-bond": { name: "战争联结", timing: "1 小时仪式；召回为附赠动作", text: "武器须始终在触及内，仪式可随短休完成。最多联结两把；不可联结另一战士已联结或他人已同调的武器。未失能时不会被缴械；同位面的联结武器可召回一把到手中。" },
  "psi-warrior-energy": { name: "灵能武士灵能骰", timing: "4 枚 d6 · 短休回 1 枚，长休全恢复", text: "仅供本子职异能使用；无可用灵能骰时不能支付其消耗。" },
  "protective-field": { name: "庇护力场", timing: "反应 · 消耗 1 枚灵能骰", text: "你或 30 尺内可见生物受伤时，减少 1d6 + 智力调整值的伤害，减伤至少 1。" },
  "psionic-strike": { name: "灵能打击", timing: "每个自己的回合一次", text: "武器命中并伤害 30 尺内目标后，消耗 1 枚灵能骰，追加 1d6 + 智力调整值的力场伤害。" },
  "telekinetic-movement": { name: "念力控物", timing: "魔法动作 · 短休或长休恢复", text: "移动 30 尺内可见的其他自愿生物或至多大型未固定物件，至多移动 30 尺到可见空位。微型物件可送入或取离手中。可无需动作消耗 1 枚灵能骰重置次数。" },
  "abjuration-savant": { name: "防护学者", timing: "三级获得", text: "法术书额外收录两道一环或二环防护法术；收录不等于准备。" },
  "divination-savant": { name: "预言学者", timing: "三级获得", text: "法术书额外收录两道一环或二环预言法术；收录不等于准备。" },
  "illusion-savant": { name: "幻术学者", timing: "三级获得", text: "法术书额外收录两道一环或二环幻术法术；收录不等于准备。" },
  "arcane-ward": { name: "奥术守御", timing: "消耗法术位施展防护法术时", text: "可创建结界，每长休只能创建一次，上限为 6 + 智力调整值。先结算自己的抗性和易伤，再由结界承伤，溢出才扣自身 HP；降至零仍存在。耗位施展防护法术可恢复两倍法术位环阶的守御 HP，也可用附赠动作耗位同量恢复，不能超上限。长休后结界结束；三级仅保护自己。" },
  portent: { name: "预兆", timing: "长休后掷并记录两枚 d20", text: "检定发生前，可用一枚预见骰替换你或可见生物的 D20 检定，每回合至多一次。每枚只用一次；下次长休丢弃未使用的结果，重新掷两枚。" },
  "improved-illusions": { name: "强化幻术", timing: "施展幻术时", text: "幻术无需言语；原距离至少 10 尺时增加 60 尺。额外知晓次级幻象，可用附赠动作施展并同时创造声音与影像。原已从职业、种族或专长知晓时，改选一道尚未知晓的法师戏法，额外戏法不占三项职业名额。" },
};

export const defaultFighterChoices = (): FighterChoices => ({ maneuvers: ["precision-attack", "trip-attack", "parry"], studentSkill: "insight", artisanTool: "smiths-tools", cantrips: ["ray-of-frost", "shocking-grasp"], prepared: ["shield", "magic-missile", "jump"], bondedWeapons: ["greatsword", "javelin"] });
