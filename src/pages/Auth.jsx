import Brand from "../components/Brand";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import ThemeToggle from "../components/ThemeToggle";

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const { login } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!f.email || !f.password || (isReg && !f.name)) return setErr("Please fill in all fields.");
    login({ name: isReg ? f.name : f.email.split("@")[0], email: f.email });
    nav("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
        <div className="fixed right-4 top-4"><ThemeToggle /></div>
      <form onSubmit={submit} className="card w-full max-w-sm space-y-3">
        <div className="text-center">
            <Brand stacked />
          <p className="text-sm text-slate-500">One University Workspace</p>
        </div>
        <h2 className="text-lg font-semibold">{isReg ? "Create account" : "Log in"}</h2>
        {isReg && <input className="input" placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input className="input" placeholder="Email or student ID" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <div className="flex gap-2">
          <input className="input" type={show ? "text" : "password"} placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button type="button" className="btn-ghost" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full">{isReg ? "Create Account" : "Log In"}</button>
        <p className="text-center text-sm text-slate-500">
          {isReg ? <>Already have an account? <Link className="text-brand-600" to="/login">Log in</Link></>
                 : <>No account? <Link className="text-brand-600" to="/register">Sign up</Link></>}
        </p>
      </form>
    </div>
  );
}