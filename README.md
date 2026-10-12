# Scribble Relay

A live drawing and guessing game for 2–8 players. One player draws a secret word while everyone else watches the sketch and guesses privately for 45 seconds. Then all guesses and the answer are revealed.

## Scoring and rounds

- First correct guess: 5 points
- Second correct guess: 3 points
- Every later correct guess: 1 point
- Drawing earns no points
- Every player draws five turns; the highest score wins

## Deploy to Vercel

This project deploys from a GitHub repository on Vercel. The game API is served at `/api/game`; room state is stored in Neon Postgres. The API creates its table automatically on first use.

1. Extract `scribble-relay-github.zip` on your computer.
2. Create a new repository on GitHub. Upload the extracted files into the repository root (so `index.html`, `api/`, `lib/`, and `vercel.json` are at the top level), then commit the files.
3. In Vercel, open **Add New → Project**, import that GitHub repository, and deploy with the root directory set to `./`. Keep the project settings detected from `vercel.json`; no build command or output directory is needed. Use Node.js 20 or newer.
4. In the Vercel project, open **Storage / Marketplace**, add the **Neon** Postgres integration, and connect it to this project. Make sure it provides `DATABASE_URL` (or `POSTGRES_URL`) to the deployment.
5. Redeploy after connecting the database if needed. Open the production URL, create a room, then share the in-game invite link with players.

You do not need to run SQL manually. The API initializes the rooms table automatically. The database integration is required for rooms and multiplayer to work across different devices.

## Project files

- `index.html` — game UI and browser client
- `api/game.ts` — Vercel multiplayer room API
- `lib/game-service.mjs` — shared room logic and scoring
- `vercel.json` — Vercel function runtime settings
- `package.json` and `package-lock.json` — runtime dependency

The browser calls `/api/game` directly. No server process needs to stay running.
