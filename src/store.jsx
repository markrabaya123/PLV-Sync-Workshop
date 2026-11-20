import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext();
export const useStore = () => useContext(Ctx);
const uid = () => Math.random().toString(36).slice(2, 9);

const seed = [
  {
    id: "w1",
    name: "Thesis Group – IT 3A",
    description: "Capstone project workspace",
    archived: false,
    files: [
      { id: "f1", name: "Chapter 1 – Introduction", type: "Document", updated: "Today", content: "<h1>Chapter 1: Introduction</h1><p>Background of the study goes here.</p><h2>Statement of the Problem</h2><ul><li>Students use too many separate apps.</li><li>Group work is hard to coordinate.</li></ul>" },
      { id: "f2", name: "Budget Plan", type: "Spreadsheet", updated: "Yesterday", content: "" },
      { id: "f3", name: "System Flowchart", type: "Diagram", updated: "2 days ago", content: "" },
    ],
    tasks: [
      { id: "t1", title: "Draft Chapter 1", assignee: "Maria Santos", due: "2026-11-25", status: "In Progress" },
      { id: "t2", title: "Collect related studies", assignee: "Juan Dela Cruz", due: "2026-11-22", status: "To Do" },
      { id: "t3", title: "Design database schema", assignee: "Ana Reyes", due: "2026-11-30", status: "To Do" },
      { id: "t4", title: "Interview survey form", assignee: "Maria Santos", due: "2026-11-18", status: "Done" },
    ],
    members: [
      { id: "m1", name: "Maria Santos", email: "maria@plv.edu.ph", role: "Owner" },
      { id: "m2", name: "Juan Dela Cruz", email: "juan@plv.edu.ph", role: "Editor" },
      { id: "m3", name: "Ana Reyes", email: "ana@plv.edu.ph", role: "Viewer" },
    ],
    messages: [],
    activity: ["Maria edited Chapter 1 – Introduction", "Juan moved 'Interview survey form' to Done"],
  },
];

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("sw_user") || "null"));
  const [workspaces, setWorkspaces] = useState(() => JSON.parse(localStorage.getItem("sw_ws") || "null") || seed);

  useEffect(() => localStorage.setItem("sw_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("sw_ws", JSON.stringify(workspaces)), [workspaces]);

  const upd = (id, fn) => setWorkspaces((ws) => ws.map((w) => (w.id === id ? fn(w) : w)));
  const log = (w, text) => ({ ...w, activity: [text, ...w.activity].slice(0, 8) });

  const api = {
    user, workspaces,
    login: (u) => setUser(u),
    logout: () => setUser(null),
    getWs: (id) => workspaces.find((w) => w.id === id),

    addWorkspace: (name, description) =>
      setWorkspaces((ws) => [...ws, { id: uid(), name, description, archived: false, files: [], tasks: [],
        members: [{ id: uid(), name: user.name, email: user.email, role: "Owner" }], messages: [], activity: ["Workspace created"] }]),
    renameWorkspace: (id, name) => upd(id, (w) => ({ ...w, name })),
    archiveWorkspace: (id) => upd(id, (w) => ({ ...w, archived: !w.archived })),
    deleteWorkspace: (id) => setWorkspaces((ws) => ws.filter((w) => w.id !== id)),

    addFile: (wid, type, name) => {
      const f = { id: uid(), name, type, updated: "Just now", content: type === "Document" ? "<p></p>" : "" };
      upd(wid, (w) => log({ ...w, files: [...w.files, f] }, `${user.name} created ${name}`));
      return f.id;
    },
    saveFile: (wid, fid, content) =>
      upd(wid, (w) => ({ ...w, files: w.files.map((f) => (f.id === fid ? { ...f, content, updated: "Just now" } : f)) })),

    addTask: (wid, t) => upd(wid, (w) => log({ ...w, tasks: [...w.tasks, { id: uid(), status: "To Do", ...t }] }, `${user.name} added task '${t.title}'`)),
    moveTask: (wid, tid, status) => upd(wid, (w) => ({ ...w, tasks: w.tasks.map((t) => (t.id === tid ? { ...t, status } : t)) })),
    deleteTask: (wid, tid) => upd(wid, (w) => ({ ...w, tasks: w.tasks.filter((t) => t.id !== tid) })),

    addMember: (wid, email, role) =>
      upd(wid, (w) => ({ ...w, members: [...w.members, { id: uid(), name: email.split("@")[0], email, role }] })),
    setRole: (wid, mid, role) => upd(wid, (w) => ({ ...w, members: w.members.map((m) => (m.id === mid ? { ...m, role } : m)) })),
    removeMember: (wid, mid) => upd(wid, (w) => ({ ...w, members: w.members.filter((m) => m.id !== mid) })),

    ask: (wid, prompt) => {
      const w = workspaces.find((x) => x.id === wid);
      const reply = fakeAI(prompt, w);
      upd(wid, (ws) => ({ ...ws, messages: [...ws.messages, { id: uid(), role: "user", text: prompt }, { id: uid(), role: "ai", ...reply }] }));
      return reply;
    },
    clearChat: (wid) => upd(wid, (w) => ({ ...w, messages: [] })),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

// Mock AI: only reads the ACTIVE workspace (workspace isolation), suggests but never edits files.
export function fakeAI(prompt, w) {
  const words = prompt.toLowerCase().split(/\W+/).filter((x) => x.length > 3);
  const items = [
    ...w.files.map((f) => ({ label: `${f.type}: ${f.name}`, hay: (f.name + f.content).toLowerCase() })),
    ...w.tasks.map((t) => ({ label: `Task: ${t.title}`, hay: t.title.toLowerCase() })),
  ];
  let sources = items.filter((i) => words.some((x) => i.hay.includes(x))).map((i) => i.label);
  if (!sources.length) sources = items.slice(0, 2).map((i) => i.label);

  const p = prompt.toLowerCase();
  let text;
  if (p.includes("outline"))
    text = "Here is a suggested outline:\n1. Introduction\n2. Review of Related Literature\n3. Methodology\n4. Results and Discussion\n5. Conclusion and Recommendations";
  else if (p.includes("brainstorm"))
    text = `Ideas based on "${w.name}":\n• Break the paper into sections and assign one per member.\n• Turn pending tasks into weekly milestones.\n• Add a comparison table of existing tools.`;
  else if (p.includes("explain"))
    text = "A CRDT lets many people edit the same document at once, then merges every change automatically without conflicts.";
  else
    text = `Based on your workspace, I suggest reviewing your open tasks first, then refining the draft. You decide what to apply, and I never edit files myself.`;
  return { text, sources };
}