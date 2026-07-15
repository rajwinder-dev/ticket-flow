# Architecture

This document goes deeper into how TicketFlow is structured internally: the layered backend design, the two main request flows, and how multi-tenant data isolation is enforced.

## Layered Backend Design

TicketFlow follows a classic layered architecture to keep concerns separated and the codebase testable:

- **Controllers** — parse and validate incoming requests, call the appropriate service, and shape the response. They contain no business logic.
- **Services** — own the actual business logic (ticket transitions, assignment rules, escalation, etc.) and are reusable across controllers, background workers, and jobs.
- **Database Layer (Prisma)** — the only layer that talks to PostgreSQL directly, giving type-safe queries and a single place to enforce data-access rules.

This separation means a service can be reused by an HTTP controller, a queue worker, or a CLI script without duplicating logic, and it keeps individual files small and easy to reason about.

## Request Flow

Every authenticated API request passes through the same middleware pipeline before reaching business logic:

```
Client Request
   → Authentication Middleware   (who is making this request?)
   → Tenant Resolution Middleware (which organization does this belong to?)
   → Permissions / RBAC Middleware (are they allowed to do this?)
   → API Controller
   → Service Layer
   → Database Layer
   → PostgreSQL
```

Putting tenant resolution and permission checks in middleware — rather than scattering `if` checks through controllers — means every route gets the same guarantees automatically, and a new route can't accidentally skip a security check.

## Inbound Email Processing Flow

Tickets don't only get created through the UI — they can also come in as emails from customers:

```
Email Provider (Resend / any provider)
   → Webhook Endpoint
   → Provider Verification
   → Email Parsing
   → Ticket Creation
   → Assign to Default Group
   → Queue Routing
   → Agent Assignment
   → Load Balancing (least active tickets)
   → Ticket appears on Dashboard
```

1. The configured email provider sends a webhook event when a new email arrives.
2. The webhook payload is verified to confirm it actually came from a trusted provider (signature/domain check).
3. The email is parsed and converted into a ticket record.
4. The new ticket is placed in a default group and routed through the correct queue.
5. A load-balancing step assigns the ticket to whichever agent currently has the fewest active tickets.
6. The ticket becomes visible on that agent's dashboard for processing.

Email intake itself runs through **BullMQ** background workers backed by **Redis**, so parsing and assignment never block the main application thread.

## Multi-Tenant Isolation & Row Level Security

Running many organizations on a single shared database schema is efficient, but it creates one serious risk: a missing `WHERE organizationId = ...` clause in any query could leak one tenant's data to another.

**Solution:**

- Two separate database connection strings are used:
  - `DIRECT_URL` — used only for schema migrations, run by trusted tooling.
  - `DATABASE_URL` — used for all runtime application queries, connected as a restricted database role.
- PostgreSQL **Row Level Security (RLS)** policies are applied to tenant-scoped tables. The restricted runtime role is denied access to rows unless the query explicitly scopes by `organizationId`.
- The practical effect: if a developer forgets the tenant filter in a query, the database itself rejects/returns no rows rather than silently leaking cross-tenant data. This turns a subtle application bug into an immediate, loud failure during development.

The local dev setup includes a dedicated script (`pnpm run db:setup`) that provisions this restricted runtime role so RLS is enforced identically in development and production.

## Email Provider Linking

Because tickets can arrive via webhook from an external email provider, the system needs a reliable way to know which organization an inbound email belongs to:

1. An organization admin selects a supported email provider (e.g., Resend) from within TicketFlow.
2. They link it to their organization and store their provider API key, which is encrypted at rest.
3. TicketFlow gives them a per-organization webhook URL to configure with that provider.
4. When an email arrives, TicketFlow verifies the sending/receiving domain against the one linked to the organization before creating a ticket — ensuring emails are routed to the correct tenant.

## Authentication Evolution

Authentication started as a manual implementation (access token + refresh token pair). This was later replaced with a more robust, race-condition-free authentication system ("better-auth") as part of the project's architectural refinement phase, removing a class of subtle race-condition bugs present in the original manual token-refresh logic.

## Development Timeline

The system evolved through four phases:

**Phase 1 — Core Architecture & Setup**
Monorepo structure, tooling (ESLint/Prettier), initial Prisma schema, base auth module.

**Phase 2 — Feature Implementation & Domain Logic**
Organization/user management, core ticket module (categories, priorities, status transitions), escalation workflows, transition history, activity logging, SMTP/Resend + React Email integration.

**Phase 3 — Infrastructure, Optimization & Production Readiness**
Docker for frontend/backend, Nginx proxy tuning, type-safe permission-based access control, Row Level Security rollout, responsive UI polish (sidebar, org switcher, loading skeletons), rate limiting, optimistic locking, standardized error handling.

**Phase 4 — Architectural Refinement & Finalization**
Extracted core services (database, email, workers) into dedicated packages, migrated the build to TurboRepo, replaced manual auth with "better-auth," moved the email service into its own worker, upgraded tenant filtering to strict Row Level Security, final bug fixes and documentation pass.
