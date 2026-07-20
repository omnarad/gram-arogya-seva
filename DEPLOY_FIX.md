# Fixing "Something went wrong. Please try again."

## What's happening

Your site (`https://omnarad.github.io/register`) is hosted on **GitHub Pages**,
which only serves static files (HTML/CSS/JS). It cannot run your Node.js/Express
backend (`backend/server.js`). So when the Register form calls `/api/auth/register`,
that request goes to `https://omnarad.github.io/api/auth/register` — a URL that
doesn't exist — and GitHub Pages returns its own 404 page instead of a real API
response. The frontend catches that failure and shows the generic message
"Something went wrong. Please try again."

**In short: only half the app (the frontend) is deployed. The backend was never deployed anywhere.**

## The fix (2 steps)

### Step 1 — Deploy the backend
The backend is a plain Express app with a file-based JSON database (`backend/data/db.json`),
so it's simple to host. Free options that support persistent Node processes:

- **Render** (render.com) — free tier, easiest for beginners
- **Railway** (railway.app)
- **Fly.io**

General steps (using Render as the example):
1. Push the `backend/` folder to its own GitHub repo (or point Render at the `backend` subfolder of this repo).
2. Create a new "Web Service" on Render, connect the repo.
3. Build command: `npm install`
4. Start command: `npm start` (or `node server.js`)
5. Add an environment variable if `backend/.env.example` lists any (check that file — e.g. `JWT_SECRET`).
6. Deploy. Render will give you a URL like `https://gram-arogya-seva-api.onrender.com`.
7. Test it works: visit `https://gram-arogya-seva-api.onrender.com/api/health` — you should see `{"status":"ok",...}`.

### Step 2 — Point the frontend at that backend
I've already updated `frontend/src/api/client.js` so the API base URL is configurable
instead of hardcoded to `/api`.

Now:
1. In `frontend/`, copy `.env.production.example` to `.env.production`.
2. Set it to your real backend URL + `/api`:
   ```
   VITE_API_URL=https://gram-arogya-seva-api.onrender.com/api
   ```
3. Rebuild the frontend: `npm run build`
4. Redeploy the built `dist/` folder to GitHub Pages (however you were publishing it before —
   e.g. `gh-pages` npm package, or your GitHub Actions workflow).

That's it — after this, Register/Login and all other API calls will reach your real backend
instead of hitting a 404 on GitHub Pages.

## Local development still works the same way
For local dev, `vite.config.js` already proxies `/api` to `http://localhost:5000`, so
running `npm run dev` in `frontend/` alongside `npm start` in `backend/` works without
needing `.env.production` at all — the code falls back to the relative `/api` path when
`VITE_API_URL` isn't set.

## Bonus fix
I also improved the error handling in `client.js` so that if the frontend ever again
points at a URL with no real API (e.g. wrong `VITE_API_URL`), you'll get a clearer signal
during debugging rather than a silent generic message.
