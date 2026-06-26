# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this is

Harmony AI — a CBT-based AI mental-health support web app. A React 19 SPA (Vite + Tailwind v4) served by an Express server that proxies chat to the Google Gemini API and persists everything in Supabase (Postgres + Auth). Originally scaffolded in Google AI Studio, since migrated to a standalone app.

## Commands

- `npm run dev` — runs `tsx server.ts`. The single Express process serves both the API and the Vite dev middleware (SPA, HMR enabled) on **http://localhost:3000** (override with `PORT`). There is no separate frontend dev server.
- `npm run lint` — `tsc --noEmit`. This is the only type/lint check; there is **no test suite, no ESLint, no Prettier**.
- `npm run build` — `vite build` (client → `dist/`) **and** `esbuild` bundles `server.ts` → `dist/server.cjs`.
- `npm run start` — `node dist/server.cjs` (production; set `NODE_ENV=production` so the server serves static `dist/` instead of Vite middleware).
- `npm run clean` — `rm -rf dist server.js` (Unix `rm`; on Windows PowerShell use `Remove-Item -Recurse -Force dist, server.js`).

## Architecture

**One server, two roles** (`server.ts`): defines all `/api/*` routes, then mounts Vite as middleware in dev (or static `dist/` in prod). The SPA and API share the same origin and port, which is why `API_URL` in `src/lib/api.ts` is an empty string (relative fetches).

**Auth is split across two Supabase clients:**
- Client (`src/lib/supabase.ts`) uses the **anon key** and drives the login flow: `signInWithOtp` → 8-digit email code → `verifyOtp` (see `src/pages/AuthPage.tsx`). On success the session `access_token` is stored in `localStorage` under the key `token`.
- `src/lib/api.ts` sends that token as a **raw `Authorization` header (no `Bearer` prefix)**.
- Server (`src/server/db-supabase.ts`) uses the **service-role key** (`supabaseAdmin`, bypasses RLS). The `requireAuth` middleware in `server.ts` calls `supabaseAdmin.auth.getUser(token)`, then `syncProfile` to upsert a row in the `profiles` table and attaches it as `req.user`.

**Dev bypass:** when Supabase env vars are missing (`VITE_SUPABASE_URL`/`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`), `requireAuth` skips token validation and attaches a hardcoded dummy user — so the UI runs without credentials, but DB-backed routes still need a reachable Supabase instance.

**Data layer** (`src/server/db-supabase.ts`, exported as `dbServiceAsync`): the only DB module. Tables are `profiles`, `chats`, `messages`. Note `better-sqlite3` is in `package.json` but is **not used** by the active code path — Supabase is the live backend.

**Schema vs. app naming mismatch (important):** the `messages` table column is **`sender`**, but the rest of the codebase uses **`role`** (`'user' | 'model'`). `createMessage`/`getMessagesByChat` translate between them. Preserve this mapping when touching message code. `free_messages_left` is decremented non-atomically (read-then-write) — there is no RPC, acknowledged as MVP-level.

**Chat / Gemini flow** (`POST /api/chats/:chatId/message`): enforces the free-message limit (10 free, then `is_subscribed` gating), saves the user message, loads the last ~10 messages as Gemini history, builds a **dynamic system instruction** by appending the user's onboarding profile (name/age/concerns/goals) to the base CBT therapist `SYSTEM_INSTRUCTION`, and calls `gemini-2.5-flash`. Gemini errors are caught and a fallback assistant message is persisted instead of failing the request. **Gemini is server-side only** — the API key never reaches the client.

**Frontend** (`src/`): React Router routes in `App.tsx` (`/` landing → `/auth` → `/onboard` → `/chat`). Two context providers wrap everything: `AuthContext` (user + token, rehydrates via `/api/me` on load) and `LanguageContext` (in-app **en/ru** i18n; all UI copy lives as a `translations` object in `src/contexts/LanguageContext.tsx`, not a separate locale file). The `@/*` path alias maps to the repo root.

## Environment

Env vars are loaded from `.env` via `dotenv` (imported at the top of `server.ts`). See `.env.example`:
- `GEMINI_API_KEY` — server-side Gemini access.
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — client Supabase (injected into the bundle via `define` in `vite.config.ts`).
- `SUPABASE_SERVICE_ROLE_KEY` — server-side admin Supabase. If missing, the auth dev bypass activates.
- `PORT` — optional, defaults to 3000.
