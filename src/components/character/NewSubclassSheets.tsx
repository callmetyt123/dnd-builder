import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { spell } from "../../data/spells";
import { WILD_MAGIC, WILD_SPELLS } from "../../data/wildMagic";
import { Header } from "./CharacterSheets";
import { signed } from "../../rules/engine/format";

function specialSpells(b:CharacterBuild) { return b.subclassId==="wild-heart"?["speak-with-animals","beast-sense"]:b.subclassId==="shadow"?["minor-illusion","darkness"]:b.subclassId==="elements"?["elementalism"]:[]; }
export function subclassExtraPages(b:CharacterBuild) { return Number(specialSpells(b).length>0)+(b.subclassId==="wild-magic"?4:0); }
// 不具职业法术位的子职单独列施法来源，避免误授予法术位或职业准备名额。
export function SubclassAppendices({b,c,start,total}:{b:CharacterBuild;c:DerivedCharacter;start:number;total:number}) {
  const ids=specialSpells(b),wis=c.abilities.wisdom.modifier;
  return <>{ids.length>0&&<article className="sheet-page wizard-spell-page" data-sheet-page><Header build={b} title="子职施法速查" page={`${start} / ${total}`}/><p className="casting-strip">感知 · 法术攻击 {signed(wis+2)} · DC {10+wis} · 本来源不提供法术位</p><div className="spell-card-grid">{ids.map(id=>{const s=spell(id)!;return <section className="spell-card" key={id}><h3>{s.name} · {s.level===0?"戏法":`${s.level} 环`}</h3><p>{id==="darkness"?"魔法动作 · 1 功力 · 无成分 · 仍需专注":b.subclassId==="wild-heart"?`${s.time} + 10 分钟 · 仅仪式 · ${s.components}`:`${s.time} · ${s.components}`}</p><p>{s.range} · {s.concentration?"专注 · ":""}{s.duration}</p><p>{s.text}</p>{id==="darkness"&&<p>暗影技艺施展的黑暗你可看穿；每回合开始可将区域移至 60 尺内任意空间。同伴不会自动看穿。</p>}</section>})}</div><p className="sheet-note">野蛮人狂暴中不能施法或维持专注。仪式施法期间也要维持专注；武僧的戏法不消耗功力。</p></article>}
  {b.subclassId==="wild-magic"&&<>{[WILD_MAGIC.slice(0,9),WILD_MAGIC.slice(9,18),WILD_MAGIC.slice(18)].map((rows,i)=><article className="sheet-page" data-sheet-page key={i}><Header build={b} title="狂野魔法浪涌 · d100 速查" page={`${start+i} / ${total}`}/><p className="sheet-note">线下掷 d100 后查表；普通触发须 d20=20，已用混乱之潮后耗位施展术士法术则自动查表。随机效果不是额外准备法术。</p><div className="sheet-features">{rows.map(([range,text])=><div key={range}><b>{range}</b><p>{text}</p></div>)}</div><footer className="sheet-footer">浪涌法术不使用超魔。随机生物由主持人控制并准备怪物数据卡。</footer></article>)}<article className="sheet-page" data-sheet-page><Header build={b} title="浪涌 57–60 · 随机法术" page={`${start+3} / ${total}`}/><p>掷 d10 对应下列法术，使用你的术士施法数值：攻击 {signed(c.spellcasting!.attack)}，DC {c.spellcasting!.dc}。无需专注，持续至通常最大时长；本表不授予高环法术位。</p><div className="sheet-features">{WILD_SPELLS.map((name,i)=><div key={name}><b>{i+1} · {name}</b><p>{[
"90 尺内一点，10 尺球域，感知豁免；失败 1 分钟内不能附赠动作或反应，每回合开始 d10 决定行动：1 随机方向全速走且无动作；2–6 不动也无动作；7–8 不移动，近战攻击触及内随机生物一次，无目标不执行动作；9–10 正常。回合末感知豁免成功结束。",
"150 尺内一点，20 尺球域，敏捷豁免，失败 8d6 火焰，成功半伤；点燃未穿戴或携带可燃物。瞬间。",
"120 尺内一点，20 尺半径雾球，重度遮蔽，1 小时；适度以上风可吹散。",
"浪涌指定 60 尺内随机生物，获得 60 尺飞行且可悬浮，10 分钟；结束失去飞行，空中可能坠落。",
"60 尺内 10 尺方形地面，困难地形 1 分钟；出现时其中生物，以及进入或结束回合者，敏捷豁免失败倒地。每回合至多一次。",
"自己升起至多 20 尺，可动作上下移动至多 20 尺；10 分钟。须攀附固定物才能水平移动；结束缓降。",
"五环产生七枚飞弹，可分配给 120 尺内可见生物；每枚 1d4+1 力场，自动命中，同时结算。瞬间。",
"自身三个镜像，1 分钟；被攻击命中时每个镜像掷 d6，任一 3+ 改为击中镜像并摧毁一像；无镜像结束。盲视／真实视觉等可绕过。",
"对自己感知豁免，失败成为山羊至多 1 小时；替换数据，保留阵营、性格、生物类型、HP 和生命骰，得到等于山羊 HP 的临时 HP，临时 HP 耗尽结束。不能言语、施法，装备融入。请 DM 准备 PHB 附录 B 山羊卡。",
"1 小时内看见隐形生物和物件，也看见以太位面（呈幽影）。"
][i]}</p></div>)}</div></article></>}
  </>;
}
