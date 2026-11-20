import { Plus } from "lucide-react";
import FileIcon from "../components/FileIcon";
import { Link } from "react-router-dom";
import { useStore } from "../store";

export default function Dashboard() {
  const { user, workspaces } = useStore();
  const active = workspaces.filter((w) => !w.archived);
  const pending = active.flatMap((w) => w.tasks.filter((t) => t.status !== "Done").map((t) => ({ ...t, ws: w })));
  const recent = active.flatMap((w) => w.files.map((f) => ({ ...f, ws: w }))).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <Link to="/workspaces" className="btn-primary"><Plus className="mr-1 h-4 w-4" />New Workspace</Link>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">My Workspaces</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((w) => (
            <Link key={w.id} to={`/w/${w.id}`} className="card hover:border-brand-500">
              <div className="font-semibold">{w.name}</div>
              <div className="text-sm text-slate-500">{w.files.length} files · {w.tasks.length} tasks · {w.members.length} members</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 font-semibold">Pending Tasks</h2>
          {pending.length === 0 && <p className="text-sm text-slate-500">All caught up!</p>}
          <ul className="space-y-2 text-sm">
            {pending.map((t) => (
              <li key={t.id} className="flex justify-between">
                <Link to={`/w/${t.ws.id}/board`} className="hover:text-brand-600">{t.title}</Link>
                <span className="text-slate-400">{t.due}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Recent Files</h2>
          <ul className="space-y-2 text-sm">
            {recent.map((f) => (
              <li key={f.id} className="flex justify-between">
                <Link to={f.type === "Document" ? `/w/${f.ws.id}/doc/${f.id}` : `/w/${f.ws.id}`} className="flex items-center gap-2 hover:text-brand-600">
                    <FileIcon type={f.type} />{f.name}
                </Link>
                <span className="text-slate-400">{f.updated}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}