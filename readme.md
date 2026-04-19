# Ticket Management System

## Overview

A full-stack ticket management system built to handle issue tracking, role-based workflows,and organization tenet system

This project focuses on scalable backend architecture, clean separation of concerns, and efficient data handling.

---

## Features

- Role-based access control (Admin, Agent, User)
- Ticket lifecycle management (Open → In Progress → Resolved → Closed)
- Comment system for ticket discussions
- email provider integration
- Structured API with validation and error handling

---

## Tech Stack

- Backend: Express + TypeScript
- Database: PostgreSQL with Prisma
- Architecture: modular stricture

---

## Architecture Overview

The system follows a layered architecture:

- Controllers handle request/response
- Services contain business logic
- Prisma manages database access

This separation allows better scalability and maintainability.

Detailed architecture: [Architecture docs](./docs/architecture.md)

---

## Key Design Decisions

### 1. Service Layer Abstraction

Business logic is separated from controllers to keep routes clean and reusable.

### 2. Prisma ORM

Used for type safety and faster development, reducing runtime query errors.

### 3. Role-Based Authorization

Middleware-based role checks ensure secure access control across endpoints.

### 4. Organization based structure

---

## Each user can create there own organization and join other as member

## Trade-offs

- Did not implement microservices to keep deployment simple
- Did not add real time webhook notification
- Limited caching to reduce system complexity
- Focused on backend strength over UI polish

---

## API Reference

See: [API docs](./docs/api.md)

---

## Database Design

See [database docs](./docs/database.md)

---

## Running Locally

<your commands here>
