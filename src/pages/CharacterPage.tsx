import { SPECIES } from "../data/species";
import { RangerPlayPanel } from "../components/character/RangerPlayPanel";
import { WarlockPlayPanel } from "../components/character/WarlockPlayPanel";
import { DruidPlayPanel } from "../components/character/DruidPlayPanel";
import { useRef, useState } from "react";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { normalizePlayState, type PlayAction } from "../rules/engine/playState";
import { CharacterSheets } from "../components/character/CharacterSheets";
import { features } from "../data/characterDetails";
import { zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";
import { exportCharacter } from "../utils/exportCharacter";

export function CharacterPage() {
  const { state, dispatch } = useBuilder();
  const c = deriveCharacter(state.build);
  const play = normalizePlayState(state.play, c);
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [downloadFile, setDownloadFile] = useState<{ url: string; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [rest, setRest] = useState<"short" | "long" | null>(null);
  const [recover, setRecover] = useState<"" | "one-first" | "two-first" | "one-second">("");
  const exportRef = useRef<HTMLDivElement>(null);
  const update = (action: PlayAction) => dispatch({ type: "play", action });
  async function download(format: "pdf" | "png") {
    if (!exportRef.current || busy) return;
    setBusy(true); setDownloadFile(null); setMessage(`正在生成 ${format.toUpperCase()}…`);
    try {
      const file = await exportCharacter(exportRef.current, format, `${state.build.identity.name}-${mode === "quick" ? "战斗速查" : "完整人物卡"}`);
      setDownloadFile(file);
      setMessage(`${format.toUpperCase()} 已生成，点击下方链接保存。`);
    } catch {
      setMessage("导出失败，请重试；也可以使用「打印 / 另存为 PDF」。");
    } finally { setBusy(false); }
  }
  return <div className="character-page">
    <header className="character-header no-print"><button className="button secondary" disabled={busy} onClick={() => dispatch({ type: "step", step: "review" })}>← 返回检查</button><span>D&D 5R · 你的冒险者</span></header>
    <section className="character-hero no-print"><div className="eyebrow">准备好开始冒险</div><h1>{state.build.identity.name}</h1><p>{zhCN.class[state.build.classId]} 3 级 · {zhCN.subclass[state.build.subclassId]} · {SPECIES[state.build.speciesId].name} · {zhCN.background[state.build.backgroundId]}</p></section>
    {c.primalCompanion && <div inert={busy}><RangerPlayPanel c={c} play={play} /></div>}
    {c.pactMagic && <div inert={busy}><WarlockPlayPanel c={c} play={play} /></div>}
    {c.wildShape && <div inert={busy}><DruidPlayPanel c={c} play={play} /></div>}
    <section inert={busy} className="play-panel no-print" aria-label="冒险资源记录"><div className="panel-heading"><div><h2>冒险记录</h2><p>{(c.wildShape || c.pactMagic || c.primalCompanion) ? "修改即时保存；职业操作按钮已自动扣除次数，下方加减用于手动记录或校正。" : "修改即时保存；能力消耗与治疗掷骰结果分别记录。"}</p></div><div className="rest-actions"><button className="button secondary" onClick={() => { setRecover(""); setRest("short"); }}>短休</button><button className="button secondary" disabled={play.hp === 0} onClick={() => setRest("long")}>长休</button></div></div>
      {play.hp === 0 && <p className="hint">长休需要至少 1 HP 才能开始；先记录获得的治疗。</p>}
      <div className="tracker-grid"><label>当前 HP / {c.maxHp}<input aria-label="当前 HP" type="number" min={0} max={c.maxHp} value={play.hp} onChange={(e) => update({ type: "hp", value: Number(e.target.value) })} /></label><label>临时 HP<input type="number" min={0} max={999} value={play.temporaryHp} onChange={(e) => update({ type: "temporary-hp", value: Number(e.target.value) })} /></label><label>剩余生命骰 / 3d{c.hitDie}<input type="number" min={0} max={3} value={play.hitDice} onChange={(e) => update({ type: "hit-dice", value: Number(e.target.value) })} /></label></div>
      <div className="resource-controls">{c.resources.map((r) => <div className="resource-control" key={r.id}><div><b>{features[r.id].name}{(c.speciesFeatures.includes(r.id) || r.id === "species-magic") && play.formId ? "（兽形不可用）" : ""}</b><small>{r.recovery}</small></div><div><button className="button secondary" aria-label={`消耗一次${features[r.id].name}`} disabled={play.remaining[r.id] === 0 || ((c.speciesFeatures.includes(r.id) || r.id === "species-magic") && !!play.formId)} onClick={() => update({ type: "resource", id: r.id, value: play.remaining[r.id] - 1 })}>−</button><output aria-label={`${features[r.id].name}剩余次数`}>{play.remaining[r.id]} / {r.max}</output><button className="button secondary" aria-label={`恢复一次${features[r.id].name}`} disabled={play.remaining[r.id] === r.max} onClick={() => update({ type: "resource", id: r.id, value: play.remaining[r.id] + 1 })}>＋</button></div></div>)}</div>
      {rest && <div className="rest-confirm" role="group" aria-label="确认休息">
        <p>{rest === "short" ? c.primalCompanion ? "完成至少一小时短休：不恢复游侠法术位或每日资源；角色与伙伴的生命骰、治疗结果分别记录，专注法术已到期。" : c.pactMagic ? "完成至少 1 小时短休：恢复全部契约法术位，黯冰狱铠结束；秘法回流、背景每日资源和石中精妙不恢复。HP 和生命骰按实际掷骰记录。" : c.wildShape ? "完成至少 1 小时短休：荒野变形恢复 1 次，兽形结束；法术位不恢复，HP 和生命骰按实际掷骰记录。" : c.spellcasting ? "完成至少 1 小时短休；HP 和生命骰按实际掷骰记录。可使用奥术回想恢复法术位，每长休一次。" : "完成至少 1 小时短休：回气恢复 1 次，动作如潮恢复全部。HP 与生命骰不自动改变，请按实际掷骰填写。" : "满足长休条件并完成所需休息（通常 8 小时，精灵出神 4 小时）：HP、生命骰与所有能力次数恢复全部，临时 HP 清零。"}{rest === "short" && state.build.speciesId === "orc" && "兽人激昂冲锋也会恢复全部次数。"}{rest === "long" && state.build.speciesId === "human" && "人类获得英雄激励，请另行记录。"}{rest === "long" && c.primalCompanion && "伙伴仅在存活、至少 1 HP 且共同休息时恢复；死亡伙伴需复活，或长休后召唤新伙伴。"}</p>
        {rest === "short" && state.build.classId === "wizard" && <label>奥术回想<select value={recover} onChange={(e) => setRecover(e.target.value as typeof recover)} disabled={play.remaining["arcane-recovery"] === 0}>
          <option value="">本次不使用{play.remaining["arcane-recovery"] === 0 ? "（已消耗）" : ""}</option>
          <option value="one-first" disabled={play.remaining["spell-slot-1"] >= 4}>恢复 1 个一环法术位</option>
          <option value="two-first" disabled={play.remaining["spell-slot-1"] > 2}>恢复 2 个一环法术位</option>
          <option value="one-second" disabled={play.remaining["spell-slot-2"] >= 2}>恢复 1 个二环法术位</option>
        </select></label>}
        <button className="button primary" onClick={() => { update({ type: "rest", kind: rest, recover: recover || undefined }); setRest(null); }}>确认已完成{rest === "short" ? "短休" : "长休"}</button><button className="button secondary" onClick={() => setRest(null)}>取消</button>
      </div>}
    </section>
    <div className="sheet-toolbar no-print"><div className="sheet-tabs" role="group" aria-label="人物卡视图"><button aria-pressed={mode === "quick"} disabled={busy} onClick={() => { setMode("quick"); setDownloadFile(null); setMessage(""); }}>战斗速查</button><button aria-pressed={mode === "full"} disabled={busy} onClick={() => { setMode("full"); setDownloadFile(null); setMessage(""); }}>完整人物卡</button></div><div className="export-actions"><button className="button secondary" disabled={busy} onClick={() => download("pdf")}>导出 PDF</button><button className="button secondary" disabled={busy} onClick={() => download("png")}>导出 PNG</button><button className="button secondary" disabled={busy} onClick={() => window.print()}>打印 / 另存为 PDF</button></div></div>
    <p className="export-status no-print" role="status">{message || (c.primalCompanion ? "人物卡包含独立伙伴记录与指挥规则；伙伴形态使用当前冒险记录。" : c.pactMagic ? "人物卡包含当前护甲、契约资源、祈唤与法术；二环效果已单独标注。" : c.wildShape ? "人物卡跟随当前形态；完整卡包含原形、已知兽形与准备法术。导出内容含当前资源记录。" : c.spellcasting ? mode === "quick" ? "施法速查与可施展法术，每页独立排版。" : "核心数值、能力、装备及完整法术书，未准备法术会明确标注。" : mode === "quick" ? "战斗速查与起源附页，随时翻阅。" : "完整人物卡：数值、职业能力、装备与身份，另附起源能力。")}</p>
    {downloadFile && <a className="button primary download-link no-print" href={downloadFile.url} download={downloadFile.filename}>保存 {downloadFile.filename}</a>}
    <p className="export-status no-print">另附起源能力页{c.innateMagic.length ? `与 ${c.innateMagic.length} 页起源法术，分别记录种族、背景和人类专长的属性、次数与成分` : "，记录种族与背景的条件能力"}。</p>
    <div className="sheet-preview"><CharacterSheets build={state.build} character={c} play={play} mode={mode} /></div>
    <div className="export-root" ref={exportRef} aria-hidden="true"><CharacterSheets build={state.build} character={c} play={play} mode={mode} /></div>
  </div>;
}
