"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2 text-center">Painel Administrativo</p>
        <h1 className="font-display text-2xl mb-8 text-center">Rui Da Cruz</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          autoFocus
          className="w-full bg-transparent border border-border px-4 py-3 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors mb-4"
        />
        {error && <p className="text-sm text-center mb-4" style={{ color: "#a13f3f" }}>Senha incorreta.</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
