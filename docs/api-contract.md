# Stray Rescue Grid — Frontend API Contract

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a supported user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Return current user and role |
| POST | `/auth/logout` | End the current session |

## Rescue Tickets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/tickets` | Create a citizen rescue report |
| GET | `/tickets` | List tickets with filters |
| GET | `/tickets/{ticket_id}` | View ticket details |
| PATCH | `/tickets/{ticket_id}` | Update permitted ticket fields |
| POST | `/tickets/{ticket_id}/media` | Upload or register a photograph |
| POST | `/tickets/{ticket_id}/status` | Add a status transition |

## Dispatch

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dispatch/volunteers/available` | List available volunteers |
| GET | `/dispatch/recommendations/{ticket_id}` | Recommend volunteers and facilities |
| POST | `/assignments` | Assign a ticket to a volunteer |
| POST | `/assignments/{assignment_id}/accept` | Accept an assignment |
| POST | `/assignments/{assignment_id}/reject` | Reject an assignment |
| GET | `/assignments/my` | List a volunteer's assignments |

## Facilities

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/facilities` | List facilities and filters |
| POST | `/facilities` | Create a facility |
| GET | `/facilities/{facility_id}/capacity` | View facility capacity |
| PATCH | `/facilities/{facility_id}/capacity` | Update facility capacity |

## Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard/summary` | Counts of open, critical, assigned, and completed cases |
| GET | `/dashboard/response-times` | Response-time metrics |
| GET | `/dashboard/hotspots` | Aggregated incident locations |

## Frontend Integration Rules

- Frontend routes should use the agreed API endpoints.
- Backend authorization is authoritative.
- The frontend must not trust user-submitted role, priority, assignment, or facility-capacity values.
- API changes should be communicated to the team before frontend integration.