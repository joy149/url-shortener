# Recent Changes Summary

## Scope
This summarizes the recent auth/login and dashboard updates made for the URL shortener frontend, plus related backend adjustments needed for redirect-based OAuth flow.

## Frontend Changes (`url-shortener`)

### 1. Auth + Session Flow
- Added centralized API/auth layer and typed models.
- Added session bootstrap logic in `useAuth`.
- Supported post-login callback handling (`?postLogin=1`) and `authError` query parsing.
- Switched auth status evaluation to `isAuthenticated = Boolean(user)` so cookie-session logins work without a token in URL.

Key files:
- `src/lib/api.ts`
- `src/lib/config.ts`
- `src/hooks/useAuth.ts`

### 2. OAuth Login UX
- Added login panel and dashboard shell.
- Added post-login behavior: when redirected back after auth, UI opens in logged-in view (defaults to `My URLs` tab).
- Removed Google login from frontend (GitHub-only login button remains).

Key files:
- `src/components/dashboard/AuthPanel.tsx`
- `src/components/mainPage.tsx`
- `src/lib/api.ts`

### 3. User Dashboard
- Added tabbed app layout:
  - `Shorten`
  - `My URLs`
  - `Analytics`
- Added API integrations for:
  - user URLs list
  - summary metrics

Key files:
- `src/components/dashboard/ShortenTab.tsx`
- `src/components/dashboard/MyUrlsTab.tsx`
- `src/components/dashboard/MetricsTab.tsx`
- `src/types/api.ts`

### 4. API Request Behavior
- API calls now include `credentials: include` to support session-cookie auth.
- Request parser now safely handles non-JSON responses for endpoints like logout/redirect-style behavior.

Key file:
- `src/lib/api.ts`

### 5. Docs/Config Added
- Added backend contract document for auth + metrics endpoints.
- Added `.env.example` with API base URL.
- Added project-level `AGENTS.md` instructions.

Key files:
- `docs/auth-metrics-backend-contract.md`
- `.env.example`
- `AGENTS.md`

## Related Backend Adjustments (applied in sibling project)

To fix "Login successful page on backend instead of returning to UI", backend auth flow was adjusted in sibling project `../urlShortner`:
- `/auth/login` now accepts/stores redirect target and provider.
- `/auth/success` now redirects to frontend URL.
- `/auth/failure` now redirects to frontend with `authError`.
- CORS updated for credentialed cross-origin requests.

Backend files changed:
- `../urlShortner/src/main/java/com/jb/urlShortner/urlShortner/controller/AuthController.java`
- `../urlShortner/src/main/java/com/jb/urlShortner/urlShortner/config/CorsConfig.java`

## Validation Run
Frontend validations completed successfully:
- `npm run lint` passed
- `npm run build` passed

Backend build validation was attempted but blocked by missing local Java 17 toolchain.

## Current Login Behavior
- User clicks "Continue with GitHub".
- OAuth completes on backend.
- Backend redirects to frontend URL with `postLogin=1`.
- Frontend loads session via `/auth/me` (cookie-based), then shows logged-in dashboard view.
