"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthSession, apiFetch, setStoredSession } from "../lib/api";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");

    try {
      if (isSignup) {
        await apiFetch("/users", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
      }

      const session = await apiFetch<AuthSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setStoredSession(session);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-violet-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          {isSignup ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          {isSignup ? "Start reserving live seats." : "Login to your account."}
        </h1>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {isSignup && (
            <label className="block">
              <span className="text-sm text-zinc-300">Name</span>
              <input
                name="name"
                required
                className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0d0d1d] px-4 text-white outline-none transition focus:border-cyan-300"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm text-zinc-300">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0d0d1d] px-4 text-white outline-none transition focus:border-cyan-300"
            />
          </label>
          <label className="block">
            <span className="text-sm text-zinc-300">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0d0d1d] px-4 text-white outline-none transition focus:border-cyan-300"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="h-12 w-full rounded-lg bg-cyan-300 font-bold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-cyan-200 hover:text-white"
          >
            {isSignup ? "Login" : "Create one"}
          </Link>
        </p>
      </div>
    </main>
  );
}
