# Harmony AI

A personal AI-powered psychological support assistant based on Cognitive Behavioral Therapy (CBT). React 19 + Vite + Tailwind v4 frontend, Express backend, Google Gemini for chat, Supabase for auth and persistence.

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create your env file and fill in the values (see comments in the file):
   ```sh
   cp .env.example .env
   ```
   - `GEMINI_API_KEY` — required for AI chat responses.
   - Supabase keys — optional for local dev. If omitted, auth is bypassed with a dummy user (API routes that hit the database still require a running Supabase instance).
3. Start the dev server (API + Vite with HMR, single process):
   ```sh
   npm run dev
   ```
   The app runs at http://localhost:3000 (override with `PORT`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Express + Vite middleware with HMR) |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm run build` | Build client (`dist/`) and bundle server (`dist/server.cjs`) |
| `npm run start` | Run production build (`NODE_ENV=production node dist/server.cjs`) |
