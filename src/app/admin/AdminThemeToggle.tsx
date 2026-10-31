"use client";

import { useEffect, useState } from "react";

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.getElementById("admin-theme-root");
    const current = root?.getAttribute("data-admin-theme") === "light" ? "light" : "dark";
    // Reads the server-rendered theme off the DOM once on mount; there is no
    // other source for it, so this effect-then-setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  function toggle() {
    const root = document.getElementById("admin-theme-root");
    if (!root) return;
    const next = theme === "light" ? "dark" : "light";
    root.setAttribute("data-admin-theme", next);
    setTheme(next);
    try {
      localStorage.setItem("admin-theme", next);
    } catch {
      // Private browsing or storage disabled — theme just won't persist across visits.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="print:hidden"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 50,
        background: "var(--admin-card)",
        border: "1px solid var(--admin-border-strong)",
        color: "var(--admin-muted)",
        borderRadius: 100,
        padding: "8px 16px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        cursor: "pointer",
      }}
    >
      {theme === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
