import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";
import { ROGUE_LANGUAGES, ROGUE_MASTERIES, hasSpellStep } from "../data/rogue";
import { BACKGROUNDS } from "../data/backgrounds";
import { WEAPONS } from "../data/weapons";
import { itemNames } from "../data/characterDetails";
import { proficientSkills } from "../rules/origins";
import { validateRogue } from "../rules/validator/validateRogue";
import { skillNames, masteryName, zhCN } from "../translations/zh-CN";

export function RogueConfigurationPage() {
  const { state, dispatch } = useBuilder(), build = state.build, r = build.choices.rogue!;
  const proficient = proficientSkills(build);
  const issues = validateRogue(build).filter((m) => m.targetStep === "configuration");
  const toggle = (ids: string[], id: string) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  return <BuilderShell previous="abilities" next={hasSpellStep(build) ? "spells" : "identity"} nextDisabled={issues.some((m) => m.severity === "blocker")}>
    <section className="page-head"><h1>完善游荡者配置</h1><p>用熟练完成探索，用专精突出你的强项。偷袭是条件伤害，命中数字不自动包含它。</p></section>
    <section className="section"><h2>职业技能 · {r.skills.length}/4</h2><p>推荐察觉、调查、特技和洞悉；罪犯背景已提供巧手、隐匿。更换背景后可以调整。</p><button className="button secondary" onClick={() => dispatch({ type: "skills-recommend" })}>推荐技能与专精</button><div className="choice-pills">{PROFILES.rogue.skills.map((id) => <button key={id} aria-pressed={r.skills.includes(id)} disabled={!r.skills.includes(id) && r.skills.length >= 4} onClick={() => dispatch({ type: "rogue", patch: { skills: toggle(r.skills, id) as typeof r.skills } })}>{skillNames[id]}{BACKGROUNDS[build.backgroundId].skills.includes(id) ? "（背景）" : ""}</button>)}</div></section>
    <section className="section"><h2>技能专精 · {r.expertise.length}/2</h2><p>推荐隐匿与巧手；任何来源的已熟练技能都可选，熟练加值由 +2 变为 +4。</p><div className="choice-pills">{[...new Set([...proficient, ...r.expertise])].map((id) => <button key={id} aria-pressed={r.expertise.includes(id)} disabled={!r.expertise.includes(id) && r.expertise.length >= 2} onClick={() => dispatch({ type: "rogue", patch: { expertise: toggle(r.expertise, id) as typeof r.expertise } })}>{skillNames[id]}{!proficient.includes(id) ? "（已失去熟练，请改选）" : ""}</button>)}</div></section>
    <section className="section"><h2>盗贼黑话与额外语言</h2><p>盗贼黑话自动习得。再选一门尚未掌握的标准或稀有语言；原初语的各方言可以互通。</p><label>职业额外语言<select value={r.extraLanguage} onChange={(e) => dispatch({ type: "rogue", patch: { extraLanguage: e.target.value } })}>{ROGUE_LANGUAGES.map((id) => <option key={id} value={id} disabled={["common", "thieves-cant", ...build.choices.languages].includes(id)}>{zhCN.language[id as keyof typeof zhCN.language]}</option>)}</select></label></section>
    <section className="section"><h2>武器精通 · {build.choices.weaponMasteries.length}/2</h2><p>推荐匕首的迅击与短弓的侵扰。也可选尚未携带的熟练武器，获得实物后才能使用。</p><div className="choice-pills">{ROGUE_MASTERIES.map((id) => <button key={id} aria-pressed={build.choices.weaponMasteries.includes(id)} disabled={!build.choices.weaponMasteries.includes(id) && build.choices.weaponMasteries.length >= 2} onClick={() => dispatch({ type: "weapon-masteries", ids: toggle(build.choices.weaponMasteries, id) })}>{itemNames[id] ?? id} · {masteryName(WEAPONS[id].mastery)}</button>)}</div></section>
    <section className="muted-panel"><h2>起始装备 · 包 A</h2><p>皮甲、2 把匕首、短剑、短弓、20 支箭矢、箭袋、盗贼工具、窃贼套组和 8 GP，另加背景装备。皮甲 AC = 11 + 敏捷。</p>{build.subclassId === "assassin" && <p>刺客额外获得易容工具、制毒工具各一套及熟练。</p>}{build.subclassId === "arcane-trickster" && <p>施法不会额外赠送法器或材料包；到法术步骤核对材料。</p>}</section>
    {issues.map((m) => <p className="validation blocker" key={m.id}>{m.message}</p>)}
  </BuilderShell>;
}
