export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/v1";

export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type Concert = {
  id: string;
  title: string;
  date: string;
  venue: string;
  stock: number;
};

export type Ticket = {
  id: string;
  concertId: string;
  seatNumber: string;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  category: "VIP" | "GENERAL";
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: options.cache,
  });

  const body = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return (body as ApiEnvelope<T>).data;
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("ticket_session");
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function setStoredSession(session: AuthSession) {
  window.localStorage.setItem("ticket_session", JSON.stringify(session));
  window.dispatchEvent(new Event("ticket_session_changed"));
}

export function clearStoredSession() {
  window.localStorage.removeItem("ticket_session");
  window.dispatchEvent(new Event("ticket_session_changed"));
}
