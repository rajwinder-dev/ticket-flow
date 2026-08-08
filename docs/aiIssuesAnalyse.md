# Backend Services — Issues & Suggestions

Compiled from code review across `AuthService`, `authMiddleware`, `CustomerService`,
`dashboardService`, `MemberService`, `NotificationService`, `InviteService`,
`OrganizationService`, `QueueService`, `QueueGroupService`, `RoleService`,
`TokenService`, `EmailService`, and `SocketService`.

Priority key: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## RoleService

### 🔴 `delete` — role-in-use guard is checking the wrong field

```ts
const userCount = await tenentDb.user.count({
  where: { id: roleId }, // ← filtering `user.id` by a role id
});
```

This will (almost) always return `0`, since a role id will never match a user id.
The "users are already assigned to this role" safety check **can never actually fire**,
so roles get deactivated even while users still hold them.
**Fix:** query the correct relation, e.g. `tenentDb.user.count({ where: { roleId } })`
or `tenentDb.membership.count({ where: { roleId, organizationId } })`.

### 🔴 `delete` — missing `await` on the update call

```ts
const updatedRole = tenentDb.role.update({ ... }); // no await
```

`updatedRole` is a pending `Promise`, not the row. It's passed straight into
`ActivityService.lagActivity({ newData: updatedRole })` and returned to the caller —
both receive an unresolved Promise instead of data.
**Fix:** add `await`.

---

## QueueGroupService

### 🟠 `setDefaultGroup` — non-transactional 3-step default swap

`findFirst` → `updateMany` (clear all defaults) → `update` (set new default) run as three
separate calls. If the process crashes or a request errors between steps 2 and 3, the
organization is left with **zero default groups**, and nothing rolls back step 2.
Concurrent calls can also race and leave more than one group marked default briefly.
**Fix:** wrap all three in `tenantdb.$transaction([...])`.

---

## QueueService

### 🟠 `addAgents` — conflict check isn't scoped to the target queue

```ts
const existingQueueAgents = await tenantdb.queueAgent.findMany({
  where: { organizationId, agentId: { in: agentIds }, active: true },
  // no queueId filter
});
```

An agent already active on **this same queue** gets flagged as a conflict and blocks
the whole request, even though re-adding them to the same queue shouldn't be an error.
**Fix:** if the intent is "blocked only when assigned to a _different_ queue," add
`queueId: { not: queueId }` to the `where`.

### 🟢 `delete` — sequential re-ordering loop

The queue-reorder step does one `await tenantdb.queue.update(...)` per queue inside a
`for` loop (N+1 queries). Not incorrect, just avoidable with `Promise.all`.

---

## authMiddleware

### 🟠 `tenant` — owner lookup not scoped to the organization

```ts
const ownerData = await tenantDb.membership.findFirst({
  where: { isSystem: true, role: { name: 'OWNER' } },
  // no organizationId
});
```

Once there's more than one organization in the table, this can return the **wrong
tenant's** owner (first match wins), setting `req.organization.ownerId` incorrectly.
**Fix:** add `organizationId` to the `where` clause (mirrors the correct, scoped version
in `InviteService.acceptInvite`).

---

## EmailService

### 🟡 `createEmailProvider` — provider limit race + brittle comparison

- `existingProviderCount === 2` should be `>= 2`; if the count ever exceeds 2 for any
  reason, the guard silently stops blocking further creates.
- The count-then-create isn't transactional, so two concurrent "add provider" requests
  can both read `count === 1`, both pass, and leave 3 providers.
  **Fix:** use `>=`, and wrap the check + create in a transaction (or add a DB-level
  unique/check constraint capping providers per org).

### 🟢 `queueEmail` — unscoped provider count

`tenantdb.emailProvider.count()` has no `where` at all, relying entirely on RLS via the
tenant connection. Every sibling method in this file passes `organizationId` explicitly
even though RLS should already cover it — this one is the inconsistent outlier. Add the
filter for defense-in-depth and consistency.

### 🟢 `updateEmailProvider` — leftover debug log

`console.log(id, organizationId)` looks like a debugging leftover; remove before shipping
since it logs IDs to stdout/log aggregators for no functional reason.

---

## TokenService

### 🟡 `createToken` — non-transactional revoke + create

Revoking old pending tokens (`updateMany`) and creating the new token (`create`) are two
separate calls. A crash or dropped connection between them leaves all prior tokens
revoked with **no new token created** — the invite/reset link silently disappears.
**Fix:** wrap both in `prisma.$transaction([...])`.

---

## dashboardService

### 🟡 `getRecentTickets` — missing `organizationId` filter

Unlike `ticketSummary` (which explicitly filters by `organizationId`), this method's
`where` only checks `updatedAt`. It likely works today only because the tenant client
applies row-level security via `set_config`, but it's inconsistent with the rest of the
file and easy to break if RLS setup ever changes.
**Fix:** add `organizationId` explicitly for defense-in-depth and consistency.

---

## CustomerService

### 🟡 `createCustomerIdentity` — redundant/racy identity lookup

The `identityId` used in the upsert's `where` comes from `prisma.customerIdentity.upsert`,
but the `create` branch recomputes it via a **separate** `prisma.customerIdentity.findUnique`
call with a non-null assertion (`!.id`). Both calls run eagerly regardless of which branch
Prisma actually takes. This is two redundant DB round-trips, and the `!` assertion will
throw if that second call somehow returns `null`.
**Fix:** reuse the id from the initial `upsert` result instead of a second query.

### 🟢 `getCustomerByEmail` — identity lookup not scoped to organization

`tenantDb.customerIdentity.findUnique({ where: { email } })` has no `organizationId` filter.
Likely fine if `customerIdentity` is intentionally a cross-org/global table, but worth
confirming — otherwise this could return an identity whose linked `customer` record
belongs to a different org.

---

## InviteService

### 🟡 `getInviteDetails` — silently returns empty data instead of an error

Every other failure path in this file throws an `appError` (400/403/404), but a missing
token record here just falls through to an object full of `undefined`s. Inconsistent
error-handling pattern within the same service — likely worth a 404 `appError` to match.

### 🟢 `inviteMember` — no protection against duplicate concurrent invites

Nothing prevents two simultaneous invite requests for the same email from both
succeeding and creating two live tokens. Low risk if duplicates are harmless UX-wise.

---

## MemberService

### 🟡 Fire-and-forget notifications

`updateRole`, `assignQueue`, and `unassignedQueue` all call
`NotificationService.sendNotification(...)` **without `await`**. If the call rejects,
it becomes an unhandled promise rejection instead of a caught, logged error, and the
caller has already returned by the time it might fail.
**Fix:** `await` the call (and decide whether a notification failure should ever fail
the parent operation, or just be logged).

### 🟢 `unassignedQueue` doesn't return its result

Inconsistent with `assignQueue`/`updateRole`, which both return `data`. Probably harmless
if no caller needs it, but worth confirming intentional.

---

## OrganizationService

### 🟢 `create` — tenant client obtained before org row is guaranteed visible

`getTenantClient(organization.id)` is called right after `prisma.organization.create(...)`
resolves. If the tenant connection pool and the main `prisma` client aren't on the same
transaction/visibility guarantees, there's a narrow window where the tenant-scoped RLS
session doesn't yet "see" the new org. Likely fine on most Postgres setups (read-committed
across connections after commit), but worth a explicit confirmation.

---

## SocketService

### 🟢 Method name typos

`invlidUserQuery` / `invlidOrganizationQuery` (missing the second `a` in "invalidate").
Purely cosmetic — used consistently across `NotificationService` and elsewhere, so
renaming is safe but should be done as one atomic pass across all call sites.

---

## NotificationService

### 🟢 Self-notification guard interacts oddly with system-triggered notifications

`if (userId === recipientId) return;` — since `userId` is typed `string | null`, any
system-triggered notification (`userId: null`) always passes this guard regardless of
who the recipient is. This appears intentional (there's no `actorType: 'SYSTEM'` handling
here to special-case), but worth double-checking it can't be exploited to spam a user by
passing `userId: null` deliberately from a compromised caller.

---

## Summary Table

| Service             | Issue                                              | Priority    |
| ------------------- | -------------------------------------------------- | ----------- |
| RoleService         | `delete` — wrong field in user-count guard         | 🔴 Critical |
| RoleService         | `delete` — missing `await` on role update          | 🔴 Critical |
| QueueGroupService   | `setDefaultGroup` — non-transactional, no rollback | 🟠 High     |
| QueueService        | `addAgents` — conflict check not queue-scoped      | 🟠 High     |
| authMiddleware      | `tenant` — owner lookup not org-scoped             | 🟠 High     |
| EmailService        | `createEmailProvider` — race + `=== 2` guard       | 🟡 Medium   |
| TokenService        | `createToken` — non-transactional revoke/create    | 🟡 Medium   |
| dashboardService    | `getRecentTickets` — missing org filter            | 🟡 Medium   |
| CustomerService     | `createCustomerIdentity` — redundant/racy lookup   | 🟡 Medium   |
| InviteService       | `getInviteDetails` — swallows missing token        | 🟡 Medium   |
| MemberService       | fire-and-forget notifications (no `await`)         | 🟡 Medium   |
| EmailService        | `queueEmail` — unscoped provider count             | 🟢 Low      |
| EmailService        | leftover `console.log` in `updateEmailProvider`    | 🟢 Low      |
| QueueService        | `delete` — sequential reorder loop (N+1)           | 🟢 Low      |
| CustomerService     | `getCustomerByEmail` — identity not org-scoped     | 🟢 Low      |
| InviteService       | `inviteMember` — no duplicate-invite guard         | 🟢 Low      |
| MemberService       | `unassignedQueue` — doesn't return result          | 🟢 Low      |
| OrganizationService | `create` — tenant client visibility timing         | 🟢 Low      |
| SocketService       | method name typos (`invlid...`)                    | 🟢 Low      |
| NotificationService | `null` userId bypasses self-notify guard           | 🟢 Low      |

**Suggested fix order:** address the two 🔴 items first (they're outright bugs, not edge
cases — one guard never works, one call never resolves its data). Then the 🟠 items,
since all three are real race/scoping bugs that can produce wrong data in multi-tenant
or concurrent-request scenarios. 🟡 and 🟢 items are good backlog/cleanup candidates.
