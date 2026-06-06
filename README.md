# CineScope — Next.js 15 + TVmaze API + SSE Webhooks

A production-grade movie & TV blog powered by the **TVmaze REST API** with
real-time live updates via **Server-Sent Events (SSE)** webhooks.

---

## Tech Stack

| Layer           | Technology                              |
|----------------|-----------------------------------------|
| Framework      | Next.js 15 (App Router, TypeScript)     |
| Styling        | Tailwind CSS + custom CSS variables     |
| Data source    | TVmaze REST API (free, no key needed)   |
| Live updates   | Server-Sent Events (SSE) + webhooks     |
| State          | Custom React hooks (`useTVmaze.ts`)     |
| Server cache   | In-memory TTL cache (1 hour)            |
| Images         | `next/image` with TVmaze CDN            |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local and set WEBHOOK_SECRET

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## Project Structure

```
cinescope/
├── app/
│   ├── api/
│   │   ├── shows/route.ts        # GET /api/shows?page=N
│   │   ├── schedule/route.ts     # GET /api/schedule?date=YYYY-MM-DD
│   │   ├── search/route.ts       # GET /api/search?q=query
│   │   └── webhook/route.ts      # GET (SSE stream) + POST (receive events)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main client page
├── components/
│   ├── Header.tsx                # Sticky nav + search
│   ├── LiveStatusBar.tsx         # SSE connection status bar
│   ├── ShowCard.tsx              # Card + Hero components + skeletons
│   ├── ShowModal.tsx             # Show detail modal + episodes
│   ├── ScheduleList.tsx          # Today's TV schedule
│   ├── Sidebar.tsx               # Trending + webhook test panel
│   └── Footer.tsx
├── hooks/
│   └── useTVmaze.ts              # useShows, useSchedule, useSearch,
│                                 # useWebhook (SSE), useEpisodes
├── lib/
│   ├── tvmaze.ts                 # API client + server-side cache
│   └── utils.ts                  # Shared helpers
├── types/
│   └── index.ts                  # TypeScript types
└── .env.local.example
```

---

## Webhook System

### How it works

```
External trigger            Your server              All browser clients
(cron / TVmaze alert)  →   POST /api/webhook    →   SSE push event
                            ↓
                        Bust server cache
                            ↓
                        Broadcast SSE message
```

### SSE connection (GET /api/webhook)

Each browser tab connects once on page load and stays open. The server sends
events in real-time without polling.

```js
const es = new EventSource('/api/webhook');
es.addEventListener('show.updated', (e) => {
  const data = JSON.parse(e.data);
  // re-fetch shows
});
```

### Sending a webhook (POST /api/webhook)

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your_webhook_secret_here" \
  -d '{"event": "show.updated", "timestamp": 1234567890, "data": {"id": 42}}'
```

### Supported events

| Event              | Effect                                      |
|--------------------|---------------------------------------------|
| `show.updated`     | Busts show + episodes cache, refreshes grid |
| `show.added`       | Same as above                               |
| `episode.added`    | Busts episode cache for that show           |
| `schedule.updated` | Busts today's schedule cache                |
| `ping`             | No cache change; notifies clients only      |

### Auto-polling fallback

Even without webhook events, `useShows` and `useSchedule` auto-poll every 5
minutes (configurable via `NEXT_PUBLIC_POLL_INTERVAL` in `.env.local`).

---

## Environment Variables

```env
# .env.local
TVMAZE_API_BASE=https://api.tvmaze.com
WEBHOOK_SECRET=your_random_secret_here
NEXT_PUBLIC_POLL_INTERVAL=300000   # ms (default: 5 minutes)
REVALIDATE_SECONDS=60
```

---

## Deployment (Vercel)

```bash
vercel deploy
```

Set `WEBHOOK_SECRET` in your Vercel environment variables dashboard.

> **Note:** SSE (GET /api/webhook) requires a **long-lived HTTP connection**.
> This works out of the box on Vercel Edge, Railway, Render, Fly.io, and any
> Node.js host. Serverless functions with short timeouts (AWS Lambda default)
> will disconnect SSE clients frequently — use a longer timeout or a dedicated
> streaming runtime.

---

## Setting up real TVmaze webhooks

TVmaze offers a paid [push API](https://www.tvmaze.com/api#push) that sends
events to your endpoint when shows or episodes are updated. Point it at:

```
POST https://your-domain.com/api/webhook
Header: x-webhook-secret: your_secret
```

For free-tier usage, set up a cron job (Vercel Cron, GitHub Actions, etc.)
that POSTs `{"event": "schedule.updated"}` every hour.

---

## Development tips

- **Test webhook live:** Use the **⚡ Webhook Panel** in the sidebar to send
  a ping and watch the SSE status bar update in real time.
- **Multiple tabs:** Open the app in two tabs, send a webhook POST, and both
  tabs will update simultaneously.
- **Cache inspection:** The sidebar **Live Stats** panel shows the current
  source (`tvmaze` vs `cache`) and last sync time.
