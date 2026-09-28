import { useRef, useState } from "react";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { normalizePlayState, type PlayAction } from "../rules/engine/playState";
import { CharacterSheets } from "../components/character/CharacterSheets";
import { features } from "../data/characterDetails";
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
    <section className="character-hero no-print"><div className="eyebrow">准备好开始冒险</div><h1>{state.build.identity.name}</h1><p>战士 3 级 · 勇士 · 矮人 · 士兵</p></section>
    <section inert={busy} className="play-panel no-print" aria-label="冒险资源记录"><div className="panel-heading"><div><h2>冒险记录</h2><p>修改即时保存；能力消耗与治疗掷骰结果分别记录。</p></div><div className="rest-actions"><button className="button secondary" onClick={() => setRest("short")}>短休</button><button className="button secondary" onClick={() => setRest("long")}>长休</button></div></div>
      <div className="tracker-grid"><label>当前 HP / {c.maxHp}<input aria-label="当前 HP" type="number" min={0} max={c.maxHp} value={play.hp} onChange={(e) => update({ type: "hp", value: Number(e.target.value) })} /></label><label>临时 HP<input type="number" min={0} max={999} value={play.temporaryHp} onChange={(e) => update({ type: "temporary-hp", value: Number(e.target.value) })} /></label><label>剩余生命骰 / 3d10<input type="number" min={0} max={3} value={play.hitDice} onChange={(e) => update({ type: "hit-dice", value: Number(e.target.value) })} /></label></div>
      <div className="resource-controls">{c.resources.map((r) => <div className="resource-control" key={r.id}><div><b>{features[r.id].name}</b><small>{r.recovery}</small></div><div><button className="button secondary" aria-label={`消耗一次${features[r.id].name}`} disabled={play.remaining[r.id] === 0} onClick={() => update({ type: "resource", id: r.id, value: play.remaining[r.id] - 1 })}>−</button><output aria-label={`${features[r.id].name}剩余次数`}>{play.remaining[r.id]} / {r.max}</output><button className="button secondary" aria-label={`恢复一次${features[r.id].name}`} disabled={play.remaining[r.id] === r.max} onClick={() => update({ type: "resource", id: r.id, value: play.remaining[r.id] + 1 })}>＋</button></div></div>)}</div>
      {rest && <div className="rest-confirm" role="group" aria-label="确认休息"><p>{rest === "short" ? "完成至少 1 小时短休：回气恢复 1 次，动作如潮恢复全部。HP 与生命骰不自动改变，请按实际掷骰填写。" : "满足长休条件并完成至少 8 小时休息：HP、生命骰与所有能力次数恢复全部，临时 HP 清零。"}</p><button className="button primary" onClick={() => { update({ type: "rest", kind: rest }); setRest(null); }}>确认已完成{rest === "short" ? "短休" : "长休"}</button><button className="button secondary" onClick={() => setRest(null)}>取消</button></div>}
    </section>
    <div className="sheet-toolbar no-print"><div className="sheet-tabs" role="group" aria-label="人物卡视图"><button aria-pressed={mode === "quick"} disabled={busy} onClick={() => { setMode("quick"); setDownloadFile(null); setMessage(""); }}>战斗速查</button><button aria-pressed={mode === "full"} disabled={busy} onClick={() => { setMode("full"); setDownloadFile(null); setMessage(""); }}>完整人物卡</button></div><div className="export-actions"><button className="button secondary" disabled={busy} onClick={() => download("pdf")}>导出 PDF</button><button className="button secondary" disabled={busy} onClick={() => download("png")}>导出 PNG</button><button className="button secondary" disabled={busy} onClick={() => window.print()}>打印 / 另存为 PDF</button></div></div>
    <p className="export-status no-print" role="status">{message || (mode === "quick" ? "一页战斗速查，随时翻阅。" : "三页完整人物卡：数值、能力、装备与身份。")}</p>
    {downloadFile && <a className="button primary download-link no-print" href={downloadFile.url} download={downloadFile.filename}>保存 {downloadFile.filename}</a>}
    <div className="sheet-preview"><CharacterSheets build={state.build} character={c} play={play} mode={mode} /></div>
    <div className="export-root" ref={exportRef} aria-hidden="true"><CharacterSheets build={state.build} character={c} play={play} mode={mode} /></div>
  </div>;
}
