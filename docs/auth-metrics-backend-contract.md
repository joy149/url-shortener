# Auth + Metrics Backend Contract

This frontend expects the following APIs for user login, per-user URL storage, and analytics.

## Auth

### Start OAuth
- `GET /auth/google`
- `GET /auth/github`
- Behavior: starts OAuth flow and redirects to provider.

### OAuth callback (server-side)
- After successful login, backend should redirect back to frontend with token in query param:
  - Example: `https://your-frontend.example.com/?token=<jwt_or_session_token>`

### Current user
- `GET /auth/me`
- Header: `Authorization: Bearer <token>`
- Response:
```json
{
  "id": "user_123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "avatarUrl": "https://...",
  "provider": "google"
}
```

### Logout
- `POST /auth/logout`
- Header: `Authorization: Bearer <token>`
- Response: `204 No Content`

## URL APIs

### Create short URL
- `POST /shorten`
- Optional header: `Authorization: Bearer <token>`
- Request:
```json
{
  "longUrl": "https://example.com",
  "expirationInDays": 7
}
```
- Response:
```json
{
  "hashValue": "https://short.ly/abc123"
}
```

### List user URLs
- `GET /urls/my`
- Header: `Authorization: Bearer <token>`
- Response:
```json
[
  {
    "id": "url_1",
    "longUrl": "https://example.com/page",
    "shortUrl": "https://short.ly/a1b2",
    "createdAt": "2026-02-28T08:20:30.000Z",
    "expirationAt": "2026-03-07T08:20:30.000Z",
    "clickCount": 12
  }
]
```

## Metrics

### User summary
- `GET /metrics/summary`
- Header: `Authorization: Bearer <token>`
- Response:
```json
{
  "totalUrls": 24,
  "totalClicks": 928,
  "activeUrls": 18,
  "expiredUrls": 6
}
```

## Frontend env var
- `VITE_API_BASE_URL=https://your-api.example.com`
