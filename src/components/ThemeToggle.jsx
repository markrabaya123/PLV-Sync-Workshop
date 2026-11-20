import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sw_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="btn-ghost"
      onClick={() => setDark(!dark)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}