import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";

const ROLES = ["Owner", "Editor", "Viewer"];

export default function Members() {
  const { id } = useParams();
  const { getWs, addMember, setRole, removeMember } = useStore();
  const ws = getWs(id);
  const [email, setEmail] = useState("");
  const [role, setR] = useState("Editor");

  const invite = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    addMember(id, email, role);
    setEmail("");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <form onSubmit={invite} className="card flex flex-col gap-2 sm:flex-row">
        <input className="input" placeholder="Invite by email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="input sm:w-32" value={role} onChange={(e) => setR(e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
        <button className="btn-primary">Invite</button>
      </form>

      <div className="card">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="pb-2">Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {ws.members.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="py-2 font-medium">{m.name}</td>
                <td className="text-slate-500">{m.email}</td>
                <td>
                  <select className="rounded border px-1" value={m.role} onChange={(e) => setRole(id, m.id, e.target.value)}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="text-right">
                  {m.role !== "Owner" && <button className="text-red-500" onClick={() => removeMember(id, m.id)}>Remove</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">Owner: full control · Editor: can edit files and tasks · Viewer: read-only.</p>
    </div>
  );
}