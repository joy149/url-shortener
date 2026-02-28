# AGENTS.md

## Project Overview
- App type: Single-page React app for URL shortening.
- Stack: Vite 7, React 19, TypeScript, Tailwind CSS 4.
- Package manager: npm (lockfile present: `package-lock.json`).
- Dev server: `vite --port 10000`.

## Source Layout
- Entry point: `src/main.tsx`
- Root app shell: `src/App.tsx`
- Main feature UI: `src/components/mainPage.tsx`
- URL action controls: `src/components/ActionButtons.tsx`
- Global styles: `src/index.css`, `src/App.css`
- Static assets: `src/assets/`, `public/`

## Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Lint codebase: `npm run lint`
- Preview production build: `npm run preview`

## Coding Guidelines
- Use TypeScript-first patterns; avoid `any` unless justified.
- Keep components focused and composable; extract reusable UI logic into components.
- Match existing code style in touched files (naming, semicolons, quote style).
- Avoid adding new dependencies unless required for the task.
- Prefer explicit error handling for network calls and user-visible failure states.

## Behavior and API Notes
- The current shortening API is called from `src/components/mainPage.tsx`.
- If changing API contracts, update UI validation/error messages in the same change.
- Do not silently change endpoint URLs or payload shape without noting it in the summary.

## Validation Before Handoff
- Run `npm run lint` after code changes.
- Run `npm run build` for changes that affect app/runtime behavior.
- If a command cannot be run locally, clearly report that in the handoff.

## File Safety Rules
- Do not edit build outputs in `dist/` manually.
- Do not commit secrets, tokens, or environment values.
- Keep changes scoped to the task; avoid unrelated refactors.

## Handoff Requirements
- Summarize what changed and why.
- List files modified.
- List validation commands run and outcomes.
- Call out assumptions and any follow-up work.
