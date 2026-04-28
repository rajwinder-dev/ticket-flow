# System Architecture

## Overview

The system follows a modular, layered architecture designed for scalability, maintainability, and clear separation of concerns.

Core layers:

* API Layer (controllers)
* Service Layer (business logic)
* Data Layer (Prisma ORM + PostgreSQL)

---

## High-Level Architecture

```mermaid
flowchart LR
  Client --> API -->  s[Service Layer] --> Database

```

---

## Core Components

### API Layer (Controllers)

Responsible for:

* Handling HTTP requests and responses
* Input validation
* Delegating logic to services

Controllers remain thin and contain no business logic.

---

### Service Layer

Responsible for:

* Core business logic
* Ticket lifecycle management
* Authorization checks (role-based)

This layer ensures logic is reusable and testable.

---

### Data Layer

Handled via Prisma ORM.

Responsible for:

* Database queries
* Schema enforcement
* Type-safe interactions

---

### Realtime Layer

Implemented using WebSockets.

Responsible for:

* Emitting events on ticket updates
* Keeping clients synchronized

---

## Request Flow

Example: Create Ticket

1. Client sends request → POST /tickets
2. zod validate input
3. Controller handle  request/response
4. Service processes business logic
5. Prisma writes to database

---

## Access Control

Access is managed at the organization level using a membership-based model.

* Users have own organization and also join other organization
* Access is revoked by removing membership
* Historical data remains unchanged

---

## Design Decisions

### 1. Layered Architecture

Separates concerns between request handling, logic, and data access.

### 2. Membership-Based RBAC

Roles are scoped per organization instead of global roles.

### 3. Non-Destructive Data Model

only soft delete allowed
activity logs to track user history

---

## Trade-offs

* Monolithic structure instead of microservices (simpler deployment)
* Limited role granularity (no disabled/suspended states)

---

## Scalability Considerations

* API can be horizontally scaled
* Database indexing planned for high-frequency queries
* email layer can be extended with message brokers if needed
* support multiple email providers structure
