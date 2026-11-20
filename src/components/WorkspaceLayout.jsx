import { NavLink, Outlet, useParams, Navigate } from "react-router-dom";
import { useStore } from "../store";

const tab = ({ isActive }) =>
  `px-4 py-2 text-sm font-medium border-b-2 ${isActive ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"}`;

export default function WorkspaceLayout() {
  const { id } = useParams();
  const { getWs } = useStore();
  const ws = getWs(id);
  if (!ws) return <Navigate to="/workspaces" replace />;

  return (
    <div>
      <h1 className="text-2xl font-bold">{ws.name}</h1>
      <p className="mb-3 text-sm text-slate-500">{ws.description}</p>
      <div className="mb-6 flex border-b border-slate-200">
        <NavLink to={`/w/${id}`} end className={tab}>Overview</NavLink>
        <NavLink to={`/w/${id}/board`} className={tab}>Task Board</NavLink>
        <NavLink to={`/w/${id}/ai`} className={tab}>AI Assistant</NavLink>
        <NavLink to={`/w/${id}/members`} className={tab}>Members</NavLink>
      </div>
      <Outlet />
    </div>
  );
}