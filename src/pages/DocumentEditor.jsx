import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store";
import { ArrowLeft, Sparkles, Bold, Italic, Underline, Heading1, Heading2, Pilcrow, List, ListOrdered, AlignLeft, AlignCenter, Undo2, Redo2 } from "lucide-react";

const cmd = (c, v) => document.execCommand(c, false, v);

export default function DocumentEditor() {
  const { id, fid } = useParams();
  const { getWs, saveFile, ask, user } = useStore();
  const ws = getWs(id);
  const file = ws.files.find((f) => f.id === fid);
  const ref = useRef(null);
  const [saved, setSaved] = useState("Saved");
  const [aiOpen, setAiOpen] = useState(true);
  const [comments, setComments] = useState([]);
  const [cText, setCText] = useState("");
  const [aiOut, setAiOut] = useState(null);
  const timer = useRef();

  useEffect(() => { if (ref.current && file) ref.current.innerHTML = file.content; }, [fid]); // eslint-disable-line

  if (!file) return <p>File not found.</p>;

  const onInput = () => {
    setSaved("Saving…");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { saveFile(id, fid, ref.current.innerHTML); setSaved("Saved"); }, 600);
  };

  const exportDoc = () => {
    const html = `<html><body>${ref.current.innerHTML}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "application/msword" }));
    a.download = `${file.name}.doc`;
    a.click();
  };

  const insert = (text) => {
    ref.current.innerHTML += `<p>${text.replace(/\n/g, "<br/>")}</p>`;
    onInput();
  };

  const quick = (p) => setAiOut(ask(id, p));

  const tools = [
  [Bold, "Bold", () => cmd("bold")], [Italic, "Italic", () => cmd("italic")], [Underline, "Underline", () => cmd("underline")],
  [Heading1, "Heading 1", () => cmd("formatBlock", "h1")], [Heading2, "Heading 2", () => cmd("formatBlock", "h2")], [Pilcrow, "Paragraph", () => cmd("formatBlock", "p")],
  [List, "Bulleted list", () => cmd("insertUnorderedList")], [ListOrdered, "Numbered list", () => cmd("insertOrderedList")],
  [AlignLeft, "Align left", () => cmd("justifyLeft")], [AlignCenter, "Align center", () => cmd("justifyCenter")],
  [Undo2, "Undo", () => cmd("undo")], [Redo2, "Redo", () => cmd("redo")],
];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link to={`/w/${id}`} className="inline-flex items-center gap-1 text-sm text-brand-600"><ArrowLeft className="h-4 w-4" />{ws.name}</Link>
          <h1 className="text-xl font-bold">{file.name}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">{saved}</span>
          <span className="flex -space-x-2">
            {ws.members.map((m) => <span key={m.id} title={m.name} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-500 text-xs text-white">{m.name[0]}</span>)}
          </span>
          <button className="btn-ghost" onClick={exportDoc}>Export</button>
          <button className="btn-ghost" onClick={() => setAiOpen(!aiOpen)}><Sparkles className="mr-1 h-4 w-4" />AI Assistant</button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1 rounded-lg border bg-white p-2">
        {tools.map(([Icon, label, fn]) => (
  <button key={label} title={label} onMouseDown={(e) => { e.preventDefault(); fn(); onInput(); }} className="rounded p-2 hover:bg-slate-100">
    <Icon className="h-4 w-4" />
  </button>
))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div ref={ref} contentEditable suppressContentEditableWarning onInput={onInput}
            className="editor min-h-[60vh] rounded-lg border bg-white p-8 shadow-sm" />
          <div className="card mt-4">
            <h3 className="mb-2 font-semibold">Comments</h3>
            {comments.map((c, i) => <p key={i} className="text-sm"><b>{c.by}:</b> {c.text}</p>)}
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="Add a comment…" value={cText} onChange={(e) => setCText(e.target.value)} />
              <button className="btn-primary" onClick={() => { if (cText) { setComments([...comments, { by: user.name, text: cText }]); setCText(""); } }}>Post</button>
            </div>
          </div>
        </div>

        {aiOpen && (
          <aside className="card w-full lg:w-72">
            <h3 className="mb-2 font-semibold">✨ AI Assistant</h3>
            <div className="mb-3 flex flex-wrap gap-1">
              {["Brainstorm ideas", "Suggest an outline", "Explain this concept"].map((p) => (
                <button key={p} className="btn-ghost text-xs" onClick={() => quick(p)}>{p}</button>
              ))}
            </div>
            {aiOut && (
              <div className="space-y-2 text-sm">
                <p className="whitespace-pre-line rounded-lg bg-slate-50 p-2">{aiOut.text}</p>
                <p className="text-xs text-slate-400">Sources: {aiOut.sources.join(", ")}</p>
                <button className="btn-primary w-full" onClick={() => insert(aiOut.text)}>Insert into Document</button>
              </div>
            )}
            <p className="mt-3 text-xs text-slate-400">The AI only suggests. You choose what to insert.</p>
          </aside>
        )}
      </div>
    </div>
  );
}