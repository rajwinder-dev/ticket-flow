# API Reference

TicketFlow exposes a structured REST API built with Express, validated end-to-end with Zod, and protected by an authentication → tenant-resolution → RBAC middleware chain (see [architecture.md](./architecture.md#request-flow) for the full pipeline).

> **Note:** This document describes the conventions the API follows. Fill in the endpoint tables below with your actual routes, request/response shapes, and status codes as the API stabilizes — this file is meant to be the living source of truth for consumers of the API.

## Base URL

```
Local development: http://localhost:3000/api
Docker deployment:  http://localhost/api
```

## Authentication

- All requests (except public auth routes and verified inbound-email webhooks) require a valid session.
- Requests must include the appropriate auth token/cookie issued at login.
- Unauthenticated requests receive `401 Unauthorized`.
- Authenticated requests without permission for the target resource receive `403 Forbidden`.

## Request Validation

All incoming request bodies, query parameters, and path parameters are validated with **Zod** schemas before reaching a controller. Invalid input returns `400 Bad Request` with a structured list of validation errors rather than a generic failure.

## Tenant Scoping

Every request that touches organization-owned data is automatically scoped to the requester's organization by the tenant-resolution middleware. Endpoints do not accept an arbitrary `organizationId` from the client for data access — it's derived from the authenticated session and enforced at the database layer via Row Level Security.

## Error Handling Convention

Errors follow a consistent shape so clients can handle them uniformly:

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Human-readable description of what went wrong"
  }
}
```

Common status codes:

| Status | Meaning                                                           |
| ------ | ----------------------------------------------------------------- |
| `400`  | Validation error                                                  |
| `401`  | Not authenticated                                                 |
| `403`  | Authenticated but not authorized (RBAC)                           |
| `404`  | Resource not found or not in caller's organization                |
| `409`  | Conflict (e.g., optimistic locking conflict on ticket escalation) |
| `500`  | Unexpected server error                                           |

## Endpoint Groups

Organize documented endpoints under these groups as they're written up:

### Auth

- Sign up / log in / log out
- Session/token refresh

### Organizations

- Create organization
- Invite / add member
- Switch active organization

### Users

- Get current user
- Update profile
- Manage roles (Admin only)

### Tickets

- Create ticket
- List / filter tickets
- Get ticket by ID
- Update ticket status (Open → In Progress → Resolved → Closed)
- Escalate ticket (optimistic-locking protected)
- Add comment

### Agent Groups & Queues

- Create/manage agent groups
- Configure queues and routing rules

### Email Providers (Webhooks)

- Link an email provider to an organization
- Provider webhook endpoint (verified, not directly callable by clients)

---

_Tip: as you formalize endpoints, consider generating this reference automatically (e.g., via Zod-to-OpenAPI) so it can't drift from the implementation._
