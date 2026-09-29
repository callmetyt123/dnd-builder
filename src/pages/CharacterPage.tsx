import { useRef, useState } from "react";
import { SPECIES } from "../data/species";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { CharacterSheets } from "../components/character/CharacterSheets";
import { zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";
import { exportCharacter } from "../utils/exportCharacter";

export function CharacterPage() {
  const { state, dispatch } = useBuilder();
  const c = deriveCharacter(state.build);
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [downloadFile, setDownloadFile] = useState<{ url: string; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);
  async function download(format: "pdf" | "png") {
    if (!exportRef.current || busy) return;
    setBusy(true); setDownloadFile(null); setMessage(`正在生成 ${format.toUpperCase()}…`);
    try {
      const file = await exportCharacter(exportRef.current, format, `${state.build.identity.name}-${mode === "quick" ? "新人上手卡" : "完整人物卡"}`);
      setDownloadFile(file);
      setMessage(`${format.toUpperCase()} 已生成，点击下方链接保存。`);
    } catch { setMessage("导出失败，请重试；也可以使用「打印 / 另存为 PDF」。"); }
    finally { setBusy(false); }
  }
  return <div className="character-page">
    <header className="character-header no-print"><button className="button secondary" disabled={busy} onClick={() => dispatch({ type: "step", step: "review" })}>← 返回检查与修改</button><span>D&D 5R · 车卡完成</span></header>
    <section className="character-hero no-print"><div className="eyebrow">你的角色已准备好</div><h1>{state.build.identity.name}</h1><p>{zhCN.class[state.build.classId]} 3 级 · {zhCN.subclass[state.build.subclassId]} · {SPECIES[state.build.speciesId].name} · {zhCN.background[state.build.backgroundId]}</p><p>先看一页上手指南，再带上完整人物卡。游玩时可以使用打印件或电子文件。</p></section>
    <section className="handoff-intro no-print" aria-label="两种卡片怎么用"><div><h2>先读：新人上手卡</h2><p>一页告诉你擅长什么、轮到你时怎么做，以及几个常用选择。内容根据你的角色生成。</p></div><div><h2>随身带：完整人物卡</h2><p>查询全部数值、能力和装备；按角色附上法术、兽形或伙伴卡。空格与方框供游玩时填写。</p></div></section>
    <div className="sheet-toolbar no-print"><div className="sheet-tabs" role="group" aria-label="人物卡视图">{(["quick", "full"] as const).map((value) => <button key={value} aria-pressed={mode === value} disabled={busy} onClick={() => { setMode(value); setDownloadFile(null); setMessage(""); }}>{value === "quick" ? "新人上手卡 · 1 页" : "完整人物卡"}</button>)}</div><div className="export-actions"><button className="button secondary" disabled={busy} onClick={() => download("pdf")}>导出当前卡 PDF</button><button className="button secondary" disabled={busy} onClick={() => download("png")}>导出当前卡 PNG</button><button className="button secondary" disabled={busy} onClick={() => window.print()}>打印当前卡</button></div></div>
    <p className="export-status no-print" role="status">{message || (mode === "quick" ? "当前预览：仅一页新人上手卡。想查询全部能力或记录 HP，请切换到完整人物卡。" : "当前预览：完整人物卡及必要附页。按车卡配置生成，临时状态留给游玩时填写。")}</p>
    {downloadFile && <a className="button primary download-link no-print" href={downloadFile.url} download={downloadFile.filename}>保存 {downloadFile.filename}</a>}
    <div className="sheet-preview"><CharacterSheets build={state.build} character={c} mode={mode} /></div>
    <div className="export-root" ref={exportRef} aria-hidden="true"><CharacterSheets build={state.build} character={c} mode={mode} /></div>
  </div>;
}
