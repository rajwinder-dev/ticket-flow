# Database Design

TicketFlow uses **PostgreSQL** with **Prisma** as the ORM, running as a single shared schema across all tenants (organizations), with isolation enforced through **Row Level Security (RLS)** rather than separate databases or schemas per tenant.

> **Note:** This document describes the modeling approach and conventions. Add your actual Prisma schema / ERD here as it's finalized so this stays the canonical reference for the data model.

## Multi-Tenancy Model

- **Approach:** shared schema, shared database, tenant column (`organizationId`) on every tenant-scoped table.
- **Isolation:** enforced at the database level via PostgreSQL Row Level Security policies, not just application-level filtering. See [architecture.md](./architecture.md#multi-tenant-isolation--row-level-security) for the full rationale.
- **Connections:**
  - `DIRECT_URL` — elevated connection used only for running migrations.
  - `DATABASE_URL` — restricted runtime role used by the running application; this role is subject to RLS policies and cannot read/write rows outside the caller's organization.

## Core Entities (high level)

| Entity                            | Purpose                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Organization`                    | A tenant. Owns users, tickets, agent groups, and email provider configuration.                                                         |
| `User`                            | An account, scoped to one or more organizations with a role per organization (Admin, Agent, User).                                     |
| `Ticket`                          | A support/issue record with status, priority, category, and assignment.                                                                |
| `TicketComment`                   | Threaded discussion attached to a ticket.                                                                                              |
| `TicketTransition` / Activity Log | History of status changes and key events for a ticket, used for audit and escalation tracking.                                         |
| `AgentGroup`                      | A group of agents used for routing and queue assignment.                                                                               |
| `Queue`                           | Routes incoming tickets (including emailed-in tickets) to the correct agent group.                                                     |
| `EmailProvider`                   | Per-organization configuration linking an external email provider (e.g., Resend) with encrypted API credentials and a verified domain. |

## Ticket Lifecycle

```
Open → In Progress → Resolved → Closed
```

Status transitions are recorded in an activity/transition history table so the full lifecycle of a ticket is auditable, not just its current state.

## Concurrency: Optimistic Locking

Ticket **escalation** is protected with optimistic locking (typically a version/row-timestamp column) so multiple concurrent escalation attempts don't silently overwrite each other. A conflicting write is rejected (surfaced to the API as `409 Conflict`) rather than corrupting ticket state — see [api.md](./api.md#error-handling-convention). This trades a bit of extra conflict-handling UX complexity for correctness under concurrent updates.

## Indexing Strategy

Indexes are applied to frequently queried columns to keep read paths fast as data grows, in particular:

- `organizationId` on all tenant-scoped tables (supports both RLS enforcement and everyday filtering)
- Ticket status/priority columns used for dashboard filtering
- Foreign keys used in common joins (ticket → agent, ticket → queue, ticket → organization)

## Migrations

Schema changes are managed through Prisma migrations, applied using the elevated `DIRECT_URL` connection:

```bash
pnpm run generate   # regenerate the Prisma client
pnpm run migrate    # apply schema migrations
pnpm run db:setup   # provision the restricted, RLS-governed runtime role
```

`db:setup` is what creates/refreshes the restricted database role that the running application actually connects as — this is what makes Row Level Security enforcement identical in local development and production.
