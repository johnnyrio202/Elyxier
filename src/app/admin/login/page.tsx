"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--admin-bg)",
        color: "var(--admin-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
      }}
    >
      <form
        action={formAction}
        style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <p style={{ color: "var(--admin-accent)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
            Elyxier
          </p>
          <h1 style={{ fontSize: 24, margin: 0 }}>Admin Login</h1>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          style={{
            background: "transparent",
            border: "1px solid var(--admin-border-strong)",
            borderRadius: 4,
            color: "var(--admin-ink)",
            fontSize: 15,
            padding: "12px 14px",
            outline: "none",
          }}
        />
        {error && <p style={{ color: "var(--admin-danger)", fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "var(--admin-accent)",
            color: "var(--admin-accent-ink)",
            border: "none",
            borderRadius: 4,
            padding: "12px 0",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: pending ? "default" : "pointer",
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
