# API Documentation

## Overview

The API is structured around a RESTful design, handling ticket management, and user roles

For complete request/response testing, use the Bruno collection located in `apps/backend/api`.

---

## Base URL

[http://localhost:PORT/api/v1](http://localhost:PORT/api/v1)

the default PORT for api

- devMode : 4000
- docker : 3000

---

## Authentication

All protected routes require a JWT accessToken can be used with refresh token.

```bash
Header:
Authorization: Bearer <accessToken>
```

---

## Core Resources

### Users

- Authentication (login/register)
- Role management (admin only)

### Tickets

- Create ticket
- Update ticket status
- Fetch tickets (with filters)
- Add comments

### Organization

- Create or join organizations
- Groups and queues
- setup email provider
- invite members

---

## Example Endpoints

### Create Ticket

POST /tickets

Request:
{
"title": "Login issue",
"description": "Unable to login",
"priority": "HIGH"
}

---

### Get Tickets

`GET /tickets?status=OPEN&priority=HIGH`

---

### Update Ticket Status

`PATCH /tickets/:id`

Request:

```json
{
  "status": "RESOLVED"
}
```

---

## Role-Based Access Rules

- Each user can create custom roles under organization and invite members
- User references in tickets are preserved even after membership removal to maintain referential integrity.”

---

## standard success response

```json
{
  "status": "fail" | "success",
  "message": "Error message"
  "data": "<any data>",
  "timeStamp": "2026-04-19T07:43:21.823Z"
}
```

## Error Handling

Standard response format:

```json
{
  "status": "fail",
  "message": "Error message",
  "code": "NOT_FOUND",
  "timeStamp": "2026-04-19T07:43:21.823Z"
}
```

Common HTTP codes:

- 400 → Validation error
- 401 → Unauthorized
- 403 → Forbidden
- 404 → Not found

Retry for refresh token when access token expires

---

## API Testing

All endpoints are available via Bruno collection:

Location: `apps/backend/api`

Steps:

1. Open Bruno
2. Import or open `/api` folder
3. Set environment variables

```env
url: http://localhost:PORT
accessToken: <barer-token>
```

4. Run requests
5. for testing, you run seed `pnpm run seed` then you can use

```sql
 SELECT * FROM "user"
```

login with default password: 123456

---

## Notes

- Filtering is supported via query parameters
- Pagination can be added if needed
- All timestamps are in ISO format
