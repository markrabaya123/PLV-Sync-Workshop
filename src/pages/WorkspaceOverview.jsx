import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store";
import { Plus, ChevronDown } from "lucide-react";
import FileIcon from "../components/FileIcon";

export default function WorkspaceOverview() {
  const { id } = useParams();
  const { getWs, addFile } = useStore();
  const nav = useNavigate();
  const ws = getWs(id);
  const [open, setOpen] = useState(false);

  const done = ws.tasks.filter((t) => t.status === "Done").length;
  const pct = ws.tasks.length ? Math.round((done / ws.tasks.length) * 100) : 0;

  const create = (type) => {
    setOpen(false);
    const name = prompt(`${type} name`, `Untitled ${type}`);
    if (!name) return;
    const fid = addFile(id, type, name);
    if (type === "Document") nav(`/w/${id}/doc/${fid}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="card lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Files</h2>
          <div className="relative">
            <button className="btn-primary" onClick={() => setOpen(!open)}>
            <Plus className="mr-1 h-4 w-4" />New File<ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border bg-white p-1 shadow-lg">
                {["Document", "Spreadsheet", "Slides", "Diagram"].map((t) => (
                  <button key={t} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100" onClick={() => create(t)}>{t}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className="divide-y text-sm">
          {ws.files.map((f) => (
            <li key={f.id} className="flex items-center justify-between py-2">
              {f.type === "Document"
  ? <Link to={`/w/${id}/doc/${f.id}`} className="flex items-center gap-2 font-medium hover:text-brand-600"><FileIcon type={f.type} />{f.name}</Link>
  : <span className="flex items-center gap-2 font-medium" title="Editor not in prototype yet"><FileIcon type={f.type} />{f.name}</span>}
              <span className="text-slate-400">{f.type} · {f.updated}</span>
            </li>
          ))}
          {ws.files.length === 0 && <li className="py-4 text-slate-500">No files yet.</li>}
        </ul>
        <p className="mt-3 text-xs text-slate-400">Prototype note: only the Document editor is built; other file types are placeholders.</p>
      </section>

      <div className="space-y-4">
        <section className="card">
          <h2 className="mb-2 font-semibold">Task Progress</h2>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-brand-600" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1 text-sm text-slate-500">{done} of {ws.tasks.length} done ({pct}%)</p>
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Members</h2>
          <ul className="space-y-1 text-sm">
            {ws.members.map((m) => <li key={m.id} className="flex justify-between"><span>{m.name}</span><span className="text-slate-400">{m.role}</span></li>)}
          </ul>
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Recent Activity</h2>
          <ul className="space-y-1 text-sm text-slate-600">{ws.activity.map((a, i) => <li key={i}>• {a}</li>)}</ul>
        </section>
      </div>
    </div>
  );
}