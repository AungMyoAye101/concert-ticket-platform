import Link from "next/link";
import Image from "next/image";
import { TicketActions } from "../../components/ticket-actions";
import { apiFetch, Concert, Ticket } from "../../lib/api";

async function getConcert(id: string) {
  try {
    return await apiFetch<Concert>(`/concerts/${id}`, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

async function getTickets() {
  try {
    return await apiFetch<Ticket[]>("/tickets", { cache: "no-store" });
  } catch {
    return [];
  }
}

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [concert, tickets] = await Promise.all([getConcert(id), getTickets()]);

  if (!concert) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-1 flex-col justify-center px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Not found
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Concert unavailable
        </h1>
        <Link href="/" className="mt-6 font-semibold text-cyan-200">
          Back to concerts
        </Link>
      </main>
    );
  }

  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(concert.date));

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#070713]/78" />
        <div className="relative mx-auto flex min-h-[430px] w-full max-w-6xl flex-col justify-end px-4 py-14 sm:px-6">
          <Link href="/" className="mb-8 text-sm font-semibold text-cyan-200">
            ← Back to concerts
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-200">
            {date}
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white">
            {concert.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
            <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2">
              {concert.venue}
            </span>
            <span className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-cyan-100">
              {concert.stock} seats in stock
            </span>
          </div>
        </div>
      </section>

      <TicketActions concertId={concert.id} initialTickets={tickets} />
    </main>
  );
}
