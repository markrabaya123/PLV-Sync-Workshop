import { NavLink, Outlet, Navigate, useMatch, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileText, ListChecks, Sparkles, Users, ChevronLeft, LogOut } from "lucide-react";
import { useStore } from "../store";
import ThemeToggle from "./ThemeToggle";

export default function MobileShell() {
  const { user, logout, getWs } = useStore();
  const nav = useNavigate();
  const inWs = useMatch("/w/:id/*");
  const inDoc = useMatch("/w/:id/doc/:fid");

  if (!user) return <Navigate to="/login" replace />;

  const id = inWs?.params.id;
  const ws = id ? getWs(id) : null;

  const tabs = ws
    ? [
        { to: `/w/${id}`, end: true, icon: FileText, label: "Files" },
        { to: `/w/${id}/board`, icon: ListChecks, label: "Tasks" },
        { to: `/w/${id}/ai`, icon: Sparkles, label: "AI" },
        { to: `/w/${id}/members`, icon: Users, label: "Team" },
      ]
    : [
        { to: "/", end: true, icon: LayoutDashboard, label: "Home" },
        { to: "/workspaces", icon: FolderOpen, label: "Workspaces" },
      ];

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-3 pb-2"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}
      >
        {ws ? (
          <button onClick={() => nav("/workspaces")} className="flex items-center gap-1 text-sm font-semibold">
            <ChevronLeft className="h-5 w-5" />
            <span className="max-w-[11rem] truncate">{ws.name}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}plv-logo.png`} alt="PLV logo" className="h-8 w-8" />
            <span className="text-sm font-bold text-brand-700">Sync-Workshop</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="btn-ghost" aria-label="Log out" onClick={() => { logout(); nav("/login"); }}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className={`p-4 ${inDoc ? "" : "pb-24"}`}>
        <Outlet />
      </main>

      {!inDoc && (
        <nav
          className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {tabs.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${isActive ? "text-brand-600" : "text-slate-500"}`
              }
            >
              <Icon className="h-6 w-6" />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}