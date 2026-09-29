import { newSubclass } from "../../data/newSubclasses";
import { NEW_SUBCLASS_FEATURES } from "../../data/newSubclassFeatures";
import { isNewClass } from "../../data/newClasses";
import { METAMAGIC } from "../../data/newClassFeatures";
import { newChoices } from "../newClasses";
import { signed } from "../engine/format";
import type { CharacterBuild, DerivedCharacter } from "../types";
import type { BeginnerGuide, GuideAction } from "./beginnerGuide";

// 每条路线只给三个实际可执行的例子；条件加值留在提示中，不污染常驻数值。
export function newClassGuide(b:CharacterBuild,c:DerivedCharacter,basic:GuideAction,weapon:GuideAction,healing?:GuideAction): Pick<BeginnerGuide,"role"|"approach"|"actions"|"reminders"> | undefined {
  if (!isNewClass(b.classId)) return;
  const id=b.classId,q=newChoices(b)!, mod=Math.max(c.abilities.strength.modifier,c.abilities.dexterity.modifier), dc=10+c.abilities.wisdom.modifier;
  const action=(id:string,title:string,when:string,how:string,cost:string):GuideAction=>({id,title,when,how,cost});
  const common="每回合只有一个附赠动作；行动前先说想做什么，再按主持人要求掷骰。";
  let approach="", actions:GuideAction[]=[], reminders:string[]=[];
  if(id==="barbarian") {
    approach="接近敌人后攻击；需要承受伤害时开启狂暴，再决定是否冒险鲁莽攻击。";
    actions=[weapon,action("rage","进入狂暴","准备持续近身作战时","力量攻击伤害 +2，钝击、穿刺、挥砍伤害抗性；力量检定与豁免有优势。每回合攻击敌人、迫使敌人豁免或用附赠动作延续，最长 10 分钟。","附赠动作 · 3 次；短休恢复 1 次、长休全恢复"),action("reckless-attack","提高命中：鲁莽攻击","自己回合第一次攻击时","声明后，力量攻击至下回合开始有优势，但敌人攻击你也有优势。狂暴中使用它，本回合首次力量命中额外 +2d6 同类型伤害。","不占额外动作 · 狂怒每个自己的回合一次")];
    reminders=["狂暴期间不能施法或维持专注。伤害表尚未加入狂暴 +2 和狂怒 2d6。",common];
  } else if(id==="bard") {
    approach="先用戏法或武器；把激励交给同伴，留意敌人成功掷骰时是否使用反应。";
    actions=[basic,action("bardic-inspiration","帮助同伴：诗人激励","60 尺内另一名能看见或听见你的生物需要帮助时","给对方一枚 d6；1 小时内一次 D20 检定失败后可掷骰加到结果。不能给自己，同一生物只能持有一枚。",`附赠动作 · 共 ${Math.max(1,c.abilities.charisma.modifier)} 次，长休恢复`),action("cutting-words","干扰敌人：语出惊人","60 尺内可见敌人属性检定或攻击成功，或掷伤害骰时","掷 d6，从触发的检定或伤害中减去结果；不能降低豁免。与诗人激励共用次数。","反应 · 消耗 1 次诗人激励")];
    reminders=["三级诗人激励仍须长休恢复。万事通只加未熟练技能，不加先攻或豁免。",common];
  } else if(id==="cleric") {
    approach="平时用戏法；需要治疗时选法术或维持生命，先看同伴的当前 HP。";
    actions=[basic,{...healing!,how:healing!.how+" 消耗一环位且在施法当回合治疗时，再恢复 3 HP（生命门徒）。"},action("preserve-life","多人受伤：维持生命","30 尺内有人 HP 不高于上限一半时","在这些生物间分配共 15 点治疗，可包含自己；每个目标最多恢复到 HP 上限一半。不能额外加生命门徒。","魔法动作 · 消耗 1 次引导神力；共 2 次，短休恢复 1 次")];
    reminders=["治疗不能超过上限；生命门徒仅用于消耗法术位的治疗，不增强免费施法或引导神力。","一次只专注一个法术；受伤时作体质豁免维持专注。"];
  } else if(id==="monk") {
    approach="用武器或徒手攻击，再选附赠徒手攻击、疾风连击，或撤离到安全位置。";
    actions=[action("martial-arts","徒手攻击","近战 5 尺内想攻击敌人时",`d20${signed(mod+2)} 达到 AC 后，造成 1d6${signed(mod)} 钝击伤害。也可改擒抱／推撞，让目标作力量或敏捷豁免（DC ${10+mod}）。`,"动作；无甲无盾时也可用附赠动作徒手攻击一次，不耗功力"),action("monk-focus","追加两次：疾风连击","想集中打击近旁敌人时",`分别进行两次徒手攻击。每次命中可选：目标至其下回合开始不能借机攻击；或力量豁免失败推离 15 尺；或敏捷豁免失败倒地（DC ${dc}）。`,"附赠动作 · 消耗 1 点功力；上限 3 点，短休或长休补满"),action("deflect-attacks","保护自己：拨挡攻击","攻击命中你，且包含钝击、穿刺或挥砍伤害时",`将总伤害减少 1d10${signed(c.abilities.dexterity.modifier+3)}。减至 0 后可花 1 点功力反击，目标范围和豁免见完整卡。`,"反应 · 单纯减伤不耗功力")];
    reminders=["无甲无盾时可用附赠动作免费撤离或疾走；花 1 点功力还可附带回避或另一移动效果，详见完整卡。",common];
  } else if(id==="paladin") {
    approach="用武器守住近处；命中后再决定是否至圣斩，需要救人时用圣疗。";
    actions=[weapon,action("paladin-smite","命中后：至圣斩","近战武器或徒手攻击刚刚命中时","立即追加 2d8 光耀伤害；目标为邪魔或亡灵时再 +1d8。重击时这些伤害骰也翻倍。","附赠动作且需言语 · 每长休免费一次，否则耗一个一环位"),action("lay-on-hands","触碰治疗：圣疗","自己或能触碰到的同伴受伤时","从 15 点池中自行分配治疗点，每点恢复 1 HP；也可花 5 点移除中毒，不同时治疗。","附赠动作 · 治疗池长休补满")];
    reminders=[`攻击动作时可消耗一次引导神力，让手持近战武器命中 +${Math.max(1,c.abilities.charisma.modifier)}，持续 10 分钟；不会直接增加伤害。`,q.style==="dueling"?"单手持一把近战武器且没有其他武器时，该武器伤害 +2（未计入表内）；盾牌不妨碍。":common];
  } else {
    const m=METAMAGIC[q.metamagic[0]];
    approach="先用戏法；需要集中施法时开启先天术法，再按情况花术法点修改法术。";
    actions=[basic,action("innate-sorcery","集中施法：先天术法","准备连续使用术士法术时",`持续 1 分钟：术士法术攻击有优势，术士法术豁免 DC 从 ${c.spellcasting!.dc} 提高到 ${c.spellcasting!.dc+1}。起源来源不受益。`,"附赠动作 · 每长休 2 次"),action("metamagic",`修改法术：${m.name}`,"所选法术满足该超魔条件时",m.text,`消耗 ${m.cost} 术法点 · 共 3 点，长休补满；另一种见完整卡`)];
    reminders=["一回合最多消耗一个法术位施法；瞬发法术还有额外限制。法术位与术法点分别记录。","一次只专注一个效果；三级龙族术法尚无伤害抗性或飞行。"];
  }
  const sub=b.subclassId;
  const featureAction=(key:string):GuideAction=>{const f=NEW_SUBCLASS_FEATURES[key];return action(key,f.name,"需要运用子职特长时",f.text,f.timing);};
  if(id==="barbarian" && sub!=="berserker") {
    actions[2]=featureAction(sub==="wild-heart"?"rage-wilds":sub==="world-tree"?"tree-vitality":"divine-fury");
    if(sub==="wild-heart") actions[2]={...actions[2],title:`兽性狂暴：${({bear:"熊",eagle:"鹰",wolf:"狼"} as Record<string,string>)[q.wildHeart??"bear"]}`,how: q.wildHeart==="eagle"?"启动狂暴时可同时疾走和撤离，之后狂暴中可用附赠动作同时执行两者。每次狂暴可改选熊或狼。":q.wildHeart==="wolf"?"狂暴中，盟友攻击你 5 尺内敌人有优势。每次狂暴可改选熊或鹰。":"狂暴中，除力场、心灵、暗蚀、光耀以外的伤害都有抗性。每次狂暴可改选鹰或狼。"};
    reminders=["狂暴力量攻击伤害 +2；不能施法或专注。鲁莽攻击给自己力量攻击优势，也让敌人攻击你有优势。",sub==="zealot"?"附赠动作可消耗任意枚 d12 自疗，共 4 枚，长休补满；不能与启动狂暴同回合各用一次。":"临时生命不相加；子职不会让你在三级获得额外攻击。"];
  }
  if(id==="bard" && sub!=="lore") {
    actions[2]=featureAction(sub==="dance"?"dazzling-footwork":sub==="glamour"?"mantle-inspiration":"combat-inspiration");
    if(sub==="dance") actions[2]={...actions[2],how:`无甲无盾时，徒手命中 d20${signed(c.abilities.dexterity.modifier+2)}，伤害 1d6${signed(c.abilities.dexterity.modifier)} 钝击。在动作、附赠动作或反应中消耗激励，还可在其中徒手打击一次。`};
    approach=newSubclass(b).reason;
    reminders=[sub==="dance"?"皮甲只携带不穿；穿甲或持盾会失去炫目舞步的全部增益。":"三级激励长休恢复；给予同伴激励与其他子职用法共用次数。",common];
  }
  if(id==="cleric" && sub!=="life") {
    actions[1]=healing!;
    actions[2]=featureAction(sub==="light"?"radiance-dawn":sub==="trickery"?"invoke-duplicity":"guided-strike");
    approach=newSubclass(b).reason;
    reminders=[sub==="light"?"守御之光：30 尺内可见生物攻击时，反应使其有劣势；感知次数（至少 1），长休恢复。":sub==="war"?"战争祭司：附赠动作再作一次武器或徒手攻击；感知次数（至少 1），短休或长休恢复。":"诡术祝福：魔法动作给自己或 30 尺内自愿生物隐匿优势；长休或再次使用前持续。","一次只专注一个法术；引导神力与法术位分别记录。"];
  }
  if(id==="monk" && sub!=="open-hand") {
    actions[1]=featureAction(sub==="shadow"?"shadow-arts":sub==="elements"?"elemental-attunement":"hand-healing");
    approach=newSubclass(b).reason;
    reminders=[sub==="mercy"?`徒手命中并伤害后可花 1 功力追加 1d6${signed(c.abilities.wisdom.modifier)} 暗蚀，每回合一次。`:"疾风连击花 1 功力，用附赠动作打两次徒手；没有散打的倒地或阻止借机效果。",common];
  }
  if(id==="paladin" && sub!=="devotion") {
    actions[1]=featureAction(sub==="ancients"?"natures-wrath":sub==="glory"?"inspiring-smite":"vow-enmity");
    reminders=["近战武器或徒手命中后可附赠动作施展至圣斩，需言语：2d8 光耀，对邪魔／亡灵再加 1d8；每长休免费一次，否则耗一环位。",common];
  }
  if(id==="sorcerer" && sub!=="draconic") {
    actions[2]=featureAction(sub==="aberrant"?"telepathic-speech":sub==="clockwork"?"restore-balance":"tides-chaos");
    reminders=["超魔与法术位分别消耗，条件见完整卡；一回合最多消耗一个法术位施法。",sub==="wild-magic"?"混乱之潮用过后，耗位施展术士法术会自动掷浪涌表并恢复潮汐；普通浪涌则先掷 d20，20 才查表。":"无甲 AC 不含法师护甲等临时效果；一次只维持一个专注。"];
  }
  return {role:newSubclass(b).reason,approach,actions,reminders};
}
