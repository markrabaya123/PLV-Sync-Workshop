import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useStore } from "../store";
import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";

const link = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-brand-100 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`;

export default function Shell() {
  const { user, logout, workspaces } = useStore();
  const nav = useNavigate();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:w-60 md:border-b-0 md:border-r">
        <div className="mb-4"><Brand /></div>
        <nav className="space-y-1">
          <NavLink to="/" end className={link}>Dashboard</NavLink>
          <NavLink to="/workspaces" className={link}>Workspaces</NavLink>
        </nav>
        <div className="mb-1 mt-5 px-3 text-xs font-semibold uppercase text-slate-400">My Workspaces</div>
        <nav className="space-y-1">
          {workspaces.filter((w) => !w.archived).map((w) => (
            <NavLink key={w.id} to={`/w/${w.id}`} className={link}>{w.name}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <input className="input max-w-xs" placeholder="Search in workspace…" />
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle />
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="font-medium">{user.name}</span>
            <button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>Log Out</button>
          </div>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}