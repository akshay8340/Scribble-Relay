# Scribble Relay

A live drawing and guessing game for 2–8 players. One player draws a secret word while everyone else watches the sketch and guesses privately for 45 seconds. Then all guesses and the answer are revealed.

## Scoring and rounds

- First correct guess: 5 points
- Second correct guess: 3 points
- Every later correct guess: 1 point
- Drawing earns no points
- Every player draws five turns; the highest score wins

## Project files

- `index.html` — game UI and browser client
- `api/game.ts` — Vercel multiplayer room API
- `lib/game-service.mjs` — shared room logic and scoring
- `vercel.json` — Vercel function runtime settings
- `package.json` and `package-lock.json` — runtime dependency

The browser calls `/api/game` directly. No server process needs to stay running.
