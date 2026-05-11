import Image from "next/image";
import { ConcertCard } from "./components/concert-card";
import { apiFetch, Concert } from "./lib/api";

const reviews = [
  {
    name: "Maya Chen",
    quote: "Clean checkout, instant reservation, no refresh panic.",
  },
  {
    name: "Theo Martin",
    quote: "The fastest ticket flow I have used for a packed show.",
  },
  {
    name: "Ari Silva",
    quote: "Minimal, sharp, and the seat status was always clear.",
  },
];

async function getConcerts() {
  try {
    return await apiFetch<Concert[]>("/concerts", { cache: "no-store" });
  } catch {
    return [];
  }
}

export default async function Home() {
  const concerts = await getConcerts();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#070713]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(167,139,250,0.24),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[680px] w-full max-w-6xl content-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
              Live seats, locked fast
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.02] text-white sm:text-7xl">
              Reserve the night before it sells out.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              Discover high-energy concerts, reserve available tickets, and
              complete purchase from one focused ticketing flow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#concerts"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-cyan-300 px-6 font-bold text-slate-950 transition hover:bg-violet-300"
              >
                Browse concerts
              </a>
              <a
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                Create account
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="concerts" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Concerts
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Upcoming shows
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-400">
            Click a concert to inspect live availability and reserve a seat.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {concerts.map((concert, index) => (
            <ConcertCard key={concert.id} concert={concert} index={index} />
          ))}
        </div>

        {concerts.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-zinc-300">
            No concerts are available. Start the server and seed the database.
          </p>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
            Reviews
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Built for the rush
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-lg leading-8 text-zinc-100">“{review.quote}”</p>
              <p className="mt-5 font-semibold text-cyan-200">
                {review.name}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
