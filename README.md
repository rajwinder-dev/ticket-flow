# TicketFlow

A full-stack, multi-tenant ticket management platform for issue tracking, role-based workflows, organization management, and automated ticket distribution.

TicketFlow is built for small teams and organizations that need a focused, reliable ticketing experience — without the overhead of a bloated project-management suite. It was built as a 2-month deep dive into scalable system design after finishing an internship: the goal was not speed of delivery, but deliberately exploring system design patterns, edge cases, fault tolerance, and iterative architecture refinement.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Key Design Decisions](#key-design-decisions)
- [Trade-offs](#trade-offs)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Challenges & Solutions](#challenges--solutions)
- [Performance Optimizations](#performance-optimizations)
- [Key Learnings](#key-learnings)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **Authentication & Authorization** — session-based auth with role-based access control (Admin, Agent, User)
- **Multi-Tenant Organizations** — each user can create their own organization and join others as a member, with strict tenant data isolation
- **Ticket Lifecycle Management** — Open → In Progress → Resolved → Closed, with transition history and activity logging
- **Ticket Escalation** — escalation workflows with optimistic locking to handle concurrent updates
- **Comment System** — threaded discussion on tickets
- **Inbound Email-to-Ticket Conversion** — turn incoming support emails into tickets automatically
- **Automated Ticket Assignment** — load-balanced routing to the agent with the fewest active tickets
- **Agent Groups & Queue Management** — organize agents into groups and route tickets through queues
- **Queue-Based Email Processing** — background workers handle email ingestion without blocking the main app
- **Structured API** — validated requests/responses with consistent error handling

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, shadcn/ui, React Query, Zustand |
| **Backend** | Node.js, Express, TypeScript, Zod, Prisma, BullMQ, Redis, PostgreSQL |
| **Deployment & DevOps** | Docker, DigitalOcean, CI/CD pipeline |

**Architecture style:** modular, layered structure with clear separation of concerns between controllers, services, and the database layer.

---

## Architecture Overview

The system follows a layered architecture:

- **Controllers** handle request/response concerns
- **Services** contain business logic
- **Prisma** manages database access

This separation keeps routes clean, business logic testable, and the codebase easier to scale and maintain.

**Frontend data flow:**

```
React UI → React Query → Axios API Client → Backend API
```

**Backend request flow:**

```
Client Request
   → Authentication Middleware
   → Tenant Resolution Middleware
   → Permissions / RBAC Middleware
   → API Controller
   → Service Layer
   → Database Layer
   → PostgreSQL
```

**Inbound email processing flow:**

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

When an email arrives, the provider fires a webhook, which is verified against a trusted source before the email body is parsed into a ticket. The ticket is assigned to a default group, routed through the correct queue, and automatically handed to the agent with the fewest active tickets — appearing on that agent's dashboard immediately.

Full write-up: [`docs/architecture.md`](./docs/architecture.md)

---

## Key Design Decisions

1. **Service Layer Abstraction** — business logic is separated from controllers so routes stay thin, reusable, and easy to test.
2. **Prisma ORM** — chosen for type safety and faster iteration, cutting down on runtime query errors.
3. **Role-Based Authorization** — middleware-based role checks enforce access control consistently across every endpoint.
4. **Organization-Based Multi-Tenancy** — every user can create their own organization and join others as a member; data is isolated per tenant at the database level.

---

## Trade-offs

Deliberate scope decisions made to keep the system focused and shippable:

- No microservices — kept deployment simple with a modular monolith instead
- No real-time webhook notifications (yet) — see [Future Improvements](#future-improvements)
- Limited caching to reduce system complexity
- Prioritized backend robustness over UI polish
- Manual authentication (access + refresh tokens) rather than a third-party auth provider *(later replaced — see [Architecture docs](./docs/architecture.md#authentication-evolution))*
- Email handling is integrated inside the app rather than fully externalized

---

## Screenshots

**Ticket Management**
![Ticket system](docs/img/ticket.png)

**Queues and Agent Groups**
![Groups and Queue](docs/img/groups.png)

**Role-Based Access Control**
![RBAC system](docs/img/rbac.png)

---

## Getting Started

### Option 1 — Rapid Deployment (Docker)

Spin up the entire stack (frontend, backend, and database) in containers.

```bash
# 1. Configure environment
cp .env.example .env

# 2. Launch containers
docker compose up -d
```

This initializes three orchestrated containers. Once healthy, the app is available at `http://localhost` (port 80).

### Option 2 — Local Development Mode

Use this if you want active code changes with Hot Module Replacement (HMR).

**Backend setup**

```bash
# 1. Create backend/.env from backend/.env.example

# 2. Install dependencies (from root or /backend)
pnpm install

# 3. Ensure a local PostgreSQL server is running

# 4. Generate the Prisma client and sync the schema
pnpm run generate
pnpm run migrate

# 5. Create the restricted runtime DB role (enables Row Level Security)
pnpm run db:setup
```

**Run everything**

From the root directory:

```bash
pnpm run dev
```

**Default port mapping**

| Service | Port |
|---|---|
| Backend | `3000` (configurable via `.env`) |
| Frontend | `5173` (Vite dev server) |
| PostgreSQL | `5432` |

---

## Documentation

Deeper reference docs live in [`/docs`](./docs) so this README stays scannable:

- [Architecture](./docs/architecture.md) — layered design, request/email flows, and how row-level tenant isolation works
- [API Reference](./docs/api.md) — endpoints, auth, and error handling conventions
- [Database Design](./docs/database.md) — schema, multi-tenancy model, and indexing strategy

---

## Challenges & Solutions

**1. Preventing cross-tenant data leaks in a shared schema**
Running multi-tenant data in a shared database schema makes accidental data leaks an easy mistake. The fix was to split database access into two connection paths — `DIRECT_URL` for internal migrations and `DATABASE_URL` for runtime queries — combined with Postgres Row Level Security, so a query that forgets to filter by `organizationId` fails loudly instead of leaking data. Full write-up: [Row Level Security blog](./docs/architecture.md#row-level-security).

**2. Linking inbound emails to the correct organization**
Accepting tickets via provider webhooks (Resend, Mailgun, etc.) raises the question of which organization an incoming email belongs to. TicketFlow solves this with a per-organization email provider system: users link a supported provider, store encrypted API keys, and configure a webhook URL. Incoming emails are matched against the verified domain linked to that organization before a ticket is created.

More detail in [`docs/architecture.md`](./docs/architecture.md).

---

## Performance Optimizations

- **Lazy loading** at the data-fetching layer to cut initial load time
- **Code splitting** via React `lazy` + `Suspense` for smaller initial bundles
- **React Query caching** — disabled unnecessary refetch-on-focus, added interval-based refetching (WebSockets planned as a future replacement for polling)
- **Database indexing** on frequently queried tables
- **Data prefetching** for smoother perceived performance
- **Background email processing** offloaded to workers so it never blocks the main app
- **Optimistic locking** on ticket escalation to safely allow concurrent escalation attempts (conflict-handling UX is still being refined)

---

## Testing

- Unit tests
- Integration tests

---

## Key Learnings

- Managing a scalable monorepo and inter-package dependency injection
- Multi-tenant data modeling and Row Level Security for enterprise SaaS
- Handling race conditions in state-heavy applications and stabilizing CI/CD for consistent builds
- Designing secure, performant, well-validated APIs

---

## Future Improvements

- **OAuth Integration** — Google/GitHub sign-in
- **Performance Scaling** — advanced caching layers for lookup APIs
- **UI/UX** — full dark mode and expanded accessibility
- **Mobile Experience** — React Native app for basic status tracking
- **Real-time notifications** — replace polling with WebSockets

---

## License

This project is licensed under the MIT License.
