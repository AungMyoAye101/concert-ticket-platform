import Link from "next/link";
import Image from "next/image";
import { Concert } from "../lib/api";

const images = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80",
];

export function ConcertCard({
  concert,
  index,
}: {
  concert: Concert;
  index: number;
}) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(concert.date));

  return (
    <Link
      href={`/concerts/${concert.id}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/[0.07]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={images[index % images.length]}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070713] via-[#070713]/10 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-lg bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">
          {concert.stock} available
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm text-cyan-200">{date}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {concert.title}
          </h3>
        </div>
        <p className="text-sm text-zinc-400">{concert.venue}</p>
        <p className="text-sm font-semibold text-violet-200">
          View tickets →
        </p>
      </div>
    </Link>
  );
}
