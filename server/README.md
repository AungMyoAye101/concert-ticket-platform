# Concert Ticket Platform API

Express + TypeScript + TypeORM API for high-demand concert ticket reservations.

## Run With Docker

```bash
docker compose up --build
```

The API runs at `http://localhost:3000`, routes are under `/api/v1`, and Swagger is available at:

```text
http://localhost:3000/docs
http://localhost:3000/api-docs
```

## Useful Commands

```bash
yarn install
yarn build
yarn migration:run
yarn seed
yarn dev
```

Production containers run:

```bash
yarn migration:run:prod && yarn start
```

## Main Endpoints

- `GET /api/v1/concerts`
- `POST /api/v1/concerts`
- `POST /api/v1/reserve`
- `POST /api/v1/purchase`
- `POST /api/v1/cleanup/reservations`
- `GET /api/v1/tickets`
- `POST /api/v1/tickets`
- `POST /api/v1/tickets/reserve/optimistic`
- `POST /api/v1/tickets/reserve/pessimistic`

## Double-Selling Protection

`POST /reserve` uses a database transaction, pessimistic row locking on available tickets, and an atomic stock update with `WHERE stock >= :quantity`. If reservation creation fails, the transaction rolls back and stock is not lost.

The Day 3 test endpoints expose both approaches:

- Optimistic: `POST /tickets/reserve/optimistic` updates only when the ticket `version` still matches.
- Pessimistic: `POST /tickets/reserve/pessimistic` locks the ticket row with `pessimistic_write` during the transaction.

## Indexing

- `idx_ticket_concert_id` supports fast ticket lookup by concert.
- `idx_reservation_pending_expires` is a partial index for cleanup scans of pending reservations only.

A partial index is better for cleanup because completed and expired rows do not need to be indexed for the query that only searches `status = 'PENDING'`. The index stays smaller and cheaper to maintain.

## Observability

Every request receives an `X-Correlation-ID`. Logs include the same `correlationId` through `AsyncLocalStorage`, validation failures are logged, and the global error middleware returns:

```json
{
  "error": "CONFLICT",
  "message": "Ticket is not available",
  "ref": "correlation-id"
}
```

Set `SENTRY_DSN` to send captured errors to a self-hosted Sentry instance.
