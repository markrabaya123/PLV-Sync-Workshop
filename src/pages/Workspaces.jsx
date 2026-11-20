import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";

export default function Workspaces() {
  const { workspaces, addWorkspace, renameWorkspace, archiveWorkspace, deleteWorkspace } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [q, setQ] = useState("");
  const [list, setList] = useState(false);

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addWorkspace(name.trim(), desc.trim());
    setName(""); setDesc("");
  };
  const rename = (w) => {
    const n = prompt("New name", w.name);
    if (n) renameWorkspace(w.id, n);
  };
  const shown = workspaces.filter((w) => w.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Workspaces</h1>
      <form onSubmit={create} className="card flex flex-col gap-2 sm:flex-row">
        <input className="input" placeholder="Workspace name (e.g. Research Methods)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button className="btn-primary whitespace-nowrap">Create</button>
      </form>

      <div className="flex gap-2">
        <input className="input max-w-xs" placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-ghost" onClick={() => setList(!list)}>{list ? "Grid view" : "List view"}</button>
      </div>

      <div className={list ? "space-y-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
        {shown.map((w) => (
          <div key={w.id} className={`card ${w.archived ? "opacity-60" : ""}`}>
            <div className="font-semibold">{w.name} {w.archived && <span className="text-xs text-slate-400">(archived)</span>}</div>
            <div className="mb-3 text-sm text-slate-500">{w.description || "No description"}</div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/w/${w.id}`} className="btn-primary">Open</Link>
              <button className="btn-ghost" onClick={() => rename(w)}>Rename</button>
              <button className="btn-ghost" onClick={() => archiveWorkspace(w.id)}>{w.archived ? "Restore" : "Archive"}</button>
              <button className="btn-ghost text-red-600" onClick={() => confirm("Delete this workspace?") && deleteWorkspace(w.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}