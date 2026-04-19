# Database Design

## Overview

The system uses PostgreSQL with Prisma ORM for type-safe database access.

The schema is designed to support multi-organization workflows, role-based access, and ticket lifecycle management.

---

## Core Entities

### User

Represents a system user.

* Can belong to one or more organizations
* Has a role scoped to each organization

---

### Organization

Logical container for users, tickets, and workflows.

* Supports member management
* Contains groups/queues for ticket routing

---

### Membership

Join table between users and organizations.

* Stores role (USER, AGENT, ADMIN or any custom)
* Used for access control instead of global roles

---

### Ticket

Represents an issue or request.

* Belongs to an organization
* Created by a user
* Has status and priority
* Can be assigned to agents

---

### Comment

Represents discussion within a ticket.

* Linked to ticket and user
* Maintains conversation history

---

## Relationships

* User ↔ Organization (many-to-many via Membership)
* Organization → Ticket (one-to-many)
* Ticket → Comment (one-to-many)
* User → Ticket (creator relationship)

---

## Design Decisions

### 1. Membership-Based Access Control

Roles are scoped per organization instead of globally.

This allows:

* Multi-tenant flexibility
* Cleaner permission management

---

### 2. Non-Destructive User Removal

Users can be removed from an organization without deleting related data.

* Preserves ticket history
* Maintains referential integrity

---

### 3. Explicit Status & Priority Fields

Enums are used for ticket status and priority.

* Ensures consistency
* Simplifies filtering and indexing

---

### 4. Separation of Comments

Comments are stored independently from tickets.

* Keeps ticket model lightweight
* Enables scalable discussion threads

---

## Indexing Strategy

* Ticket status (for filtering)
* Ticket priority
* Foreign keys (userId, organizationId)

---

## Notes

* All timestamps follow ISO 8601 format
* Soft deletes can be added if needed
* Schema optimized for read-heavy operations

## Indexing Strategy (Planned)

Indexes are planned based on query patterns:

- Ticket status and priority for filtering
- Organization and user relationships for access control
- CreatedAt for sorting

Currently not implemented to keep schema simple during early development.
