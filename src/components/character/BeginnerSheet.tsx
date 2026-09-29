import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { beginnerGuide } from "../../rules/guides/beginnerGuide";
import { signed } from "../../rules/engine/format";
import { Header } from "./CharacterSheets";

// 上手卡固定一页，不追加数据附页；完整资料由另一种输出承担。
export function BeginnerSheet({ build, c }: { build: CharacterBuild; c: DerivedCharacter }) {
  const guide = beginnerGuide(build, c);
  return <article className="sheet-page beginner-sheet" data-sheet-page>
    <Header build={build} title="新人上手卡 · 先看这一页" page="1 / 1" />
    <section className="beginner-role"><h3>你的角色怎么玩</h3><p>{guide.role}</p><p><b>第一次可以这样试：</b>{guide.approach}</p></section>
    <section className="beginner-turn"><h3>轮到你时</h3><p>先说你想做什么 → 移动（通常至多 {c.speed} 尺）→ 选一个动作。移动可以分开在动作前后进行。</p><p><b>附赠动作</b>是某些能力允许的额外选择，每回合最多一个，不必用满。<b>反应</b>须有触发条件，用过后到你的下回合开始才恢复。</p></section>
    <section><h3>先记住这三个选择</h3><div className="beginner-actions">{guide.actions.map((a, i) => <div className="beginner-action" key={a.id}><span className="beginner-number">{i + 1}</span><div><h4>{a.title}</h4><p className="beginner-when">{a.when}</p><p>{a.how}</p><small>{a.cost}</small></div></div>)}</div></section>
    <div className="beginner-bottom"><section><h3>战斗以外，你也能帮忙</h3>{guide.skills.map((s) => <p key={s.id}><b>{s.name} {signed(s.modifier)}</b> · {s.example}</p>)}<p className="sheet-note">先描述做法，主持人再决定检定。需要检定时，掷 d20 加卡上的数值；其他技能也能尝试。</p></section><section><h3>最容易忘的两件事</h3>{guide.reminders.map((text) => <p key={text}>{text}</p>)}</section></div>
    <footer className="sheet-footer"><b>不知道怎么办时：</b>直接说「我想……，可以怎么做？」d20 是二十面骰，AC 是护甲等级。优势掷两个 d20 取高，劣势取低。<br />其他起源能力：{guide.originNames.join("、")}。完整数值、能力条件与法术见完整人物卡；本页是建议，不是固定操作顺序。</footer>
  </article>;
}
