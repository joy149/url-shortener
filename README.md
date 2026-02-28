# URL Shortener Frontend

React + TypeScript frontend for shortening URLs, with support for user login (Google/GitHub OAuth), per-user URL history, and usage metrics.

## Scripts
- `npm run dev` starts Vite on port `10000`
- `npm run build` builds production assets
- `npm run lint` runs ESLint
- `npm run preview` previews the production build

## Local setup
1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env`
3. Set your API base URL in `.env`:
   - `VITE_API_BASE_URL=https://your-api.example.com`
4. Start the app:
   - `npm run dev`

## Expected backend APIs
See [docs/auth-metrics-backend-contract.md](docs/auth-metrics-backend-contract.md) for required endpoints and payloads.

## Feature status
- Shorten URL: implemented
- OAuth entry points (Google/GitHub): implemented in UI
- Session bootstrap (`?token=` callback + `/auth/me`): implemented
- Per-user URL list (`/urls/my`): implemented UI/API integration
- Metrics dashboard (`/metrics/summary`): implemented UI/API integration

