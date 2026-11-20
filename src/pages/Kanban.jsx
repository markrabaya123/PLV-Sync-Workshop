import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { User, CalendarDays, Trash2 } from "lucide-react";

const COLS = ["To Do", "In Progress", "Done"];

export default function Kanban() {
  const { id } = useParams();
  const { getWs, addTask, moveTask, deleteTask } = useStore();
  const ws = getWs(id);
  const [f, setF] = useState({ title: "", assignee: ws.members[0]?.name || "", due: "" });
  const [filter, setFilter] = useState("All");

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    addTask(id, f);
    setF({ ...f, title: "", due: "" });
  };
  const tasks = ws.tasks.filter((t) => filter === "All" || t.assignee === filter);

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="card flex flex-col gap-2 md:flex-row">
        <input className="input" placeholder="+ Add card (task title)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <select className="input md:w-48" value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })}>
          {ws.members.map((m) => <option key={m.id}>{m.name}</option>)}
        </select>
        <input type="date" className="input md:w-40" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} />
        <button className="btn-primary">Add</button>
      </form>

      <div className="flex items-center gap-2 text-sm">
        <span>Filter by assignee:</span>
        <select className="input w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {ws.members.map((m) => <option key={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((col) => (
          <div key={col} className="rounded-xl bg-slate-100 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => moveTask(id, e.dataTransfer.getData("tid"), col)}>
            <h3 className="mb-2 font-semibold">{col} <span className="text-slate-400">({tasks.filter((t) => t.status === col).length})</span></h3>
            <div className="min-h-[120px] space-y-2">
              {tasks.filter((t) => t.status === col).map((t) => (
                <div key={t.id} draggable onDragStart={(e) => e.dataTransfer.setData("tid", t.id)}
                  className="card cursor-grab p-3 active:cursor-grabbing">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{t.assignee}</span>
                    {t.due && <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.due}</span>}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <select className="rounded border text-xs" value={t.status} onChange={(e) => moveTask(id, t.id, e.target.value)}>
                      {COLS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <button className="text-red-500" title="Delete" onClick={() => deleteTask(id, t.id)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}