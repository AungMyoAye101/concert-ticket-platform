"use client";

import { useMemo, useState } from "react";
import { apiFetch, getStoredSession, Ticket } from "../lib/api";
import Modal from "./modal";

type Reservation = {
  id: string;
  ticketId: string;
  status: string;
  expiresAt: string;
};

export function TicketActions({
  concertId,
  initialTickets,
}: {
  concertId: string;
  initialTickets: Ticket[];
}) {
  const [tickets, setTickets] = useState(initialTickets);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [message, setMessage] = useState("");
  const [loadingTicketId, setLoadingTicketId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const availableTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.concertId === concertId && ticket.status === "AVAILABLE",
      ),
    [concertId, tickets],
  );

  const refreshTickets = async () => {
    const nextTickets = await apiFetch<Ticket[]>("/tickets", {
      cache: "no-store",
    });
    setTickets(nextTickets);
  };

  const reserve = async (ticket: Ticket) => {
    const session = getStoredSession();

    if (!session) {
      setMessage("Login first to reserve a ticket.");
      return;
    }

    setMessage("");
    setLoadingTicketId(ticket.id);

    try {
      const data = await apiFetch<Reservation>("/tickets/reserve/pessimistic", {
        method: "POST",
        body: JSON.stringify({ userId: session.user.id, ticketId: ticket.id }),
      });
      setReservation(data);
      setMessage(`Seat ${ticket.seatNumber} reserved.`);
      await refreshTickets();
      setIsOpen(true);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Reservation failed");
    } finally {
      setLoadingTicketId(null);
    }
  };

  const purchase = async () => {
    if (!reservation) {
      return;
    }

    setPurchasing(true);
    setMessage("");

    try {
      await apiFetch("/purchase", {
        method: "POST",
        body: JSON.stringify({ reservationId: reservation.id }),
      });
      setMessage("Purchase successful.");
      setReservation(null);
      await refreshTickets();
      setIsOpen(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Available tickets
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Pick your seat</h2>
        </div>
        {reservation && (
          <button
            onClick={purchase}
            disabled={purchasing}
            className="h-11 rounded-lg bg-violet-300 px-5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {purchasing ? "Purchasing..." : "Purchase reserved ticket"}
          </button>
        )}
      </div>

      {message && (
        <p className="mb-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
          {message}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {availableTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4"
          >
            <div>
              <p className="font-semibold text-white">
                Seat {ticket.seatNumber}
              </p>
              <p className="text-sm text-zinc-400">
                {ticket.category} · ${ticket.price}
              </p>
            </div>
            <button
              onClick={() => reserve(ticket)}
              disabled={loadingTicketId === ticket.id}
              className="h-10 rounded-lg border border-cyan-300/40 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950 disabled:opacity-60"
            >
              {loadingTicketId === ticket.id ? "Reserving" : "Reserve"}
            </button>
          </div>
        ))}
      </div>

      {availableTickets.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-zinc-300">
          No available tickets for this concert right now.
        </p>
      )}
      <Modal
        title="Are you sure ?"
        description={`You are going to purchase `}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        onComfrim={purchase}
      />
    </section>
  );
}
