"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthSession, clearStoredSession, getStoredSession } from "../lib/api";

export function NavBar() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const syncSession = () => setSession(getStoredSession());

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("ticket_session_changed", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("ticket_session_changed", syncSession);
    };
  }, []);

  const logout = () => {
    clearStoredSession();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070713]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan-300/40 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.25)]">
            R
          </span>
          <span className="text-base font-semibold tracking-wide text-white">
            RARE TICKET
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {session ? (
            <>
              <span className="hidden text-zinc-400 md:inline mx-2">
                {session.user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-violet-300/30 px-4 py-2 font-medium text-red-400 transition hover:border-violet-200 hover:bg-violet-300/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:bg-violet-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
