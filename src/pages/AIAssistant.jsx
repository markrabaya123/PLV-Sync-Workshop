import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { Lock } from "lucide-react";

export default function AIAssistant() {
  const { id } = useParams();
  const { getWs, ask, clearChat } = useStore();
  const ws = getWs(id);
  const [text, setText] = useState("");

  const send = (p) => {
    const msg = (p ?? text).trim();
    if (!msg) return;
    ask(id, msg);
    setText("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-brand-700"><Lock className="h-3 w-3" />Context: {ws.name} only</span>
        <button className="btn-ghost" onClick={() => clearChat(id)}>New Chat</button>
      </div>

      <div className="card mb-3 min-h-[45vh] space-y-3">
        {ws.messages.length === 0 && <p className="text-sm text-slate-500">Ask anything about your project. I read your workspace's documents and tasks, and I suggest but never edit your files.</p>}
        {ws.messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
            <div className={`inline-block max-w-[85%] whitespace-pre-line rounded-xl px-3 py-2 text-left text-sm ${m.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100"}`}>
              {m.text}
            </div>
            {m.sources && (
              <div className="mt-1 text-xs text-slate-400">
                Sources used: {m.sources.join(" · ")}
                <button className="ml-3 text-brand-600" onClick={() => navigator.clipboard.writeText(m.text)}>Copy</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {["Brainstorm ideas", "Suggest an outline", "Explain this concept"].map((p) => (
          <button key={p} className="btn-ghost text-xs" onClick={() => send(p)}>{p}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input" placeholder="Type your prompt…" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="btn-primary" onClick={() => send()}>Send</button>
      </div>
    </div>
  );
}