import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070713]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-white uppercase">
            Rare ticket platform
          </p>
          <p>Fast reservations for high-demand shows.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/#concerts" className="hover:text-white">
            Concerts
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="hover:text-white">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
