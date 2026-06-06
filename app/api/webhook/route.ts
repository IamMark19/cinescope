/**
 * POST /api/webhook
 *
 * Receives incoming webhook events (e.g. from a cron service or TVmaze
 * update trigger), validates the secret header, busts the server cache for
 * the affected resource, and pushes an SSE event to all connected clients.
 *
 * Headers expected:
 *   x-webhook-secret: <your WEBHOOK_SECRET>
 *   content-type:     application/json
 *
 * Body:
 *   { event: "show.updated" | "schedule.updated" | "ping", data?: {...} }
 *
 * ─── SSE Live Feed ────────────────────────────────────────────────────────────
 * GET /api/webhook  →  text/event-stream
 * Clients connect once and receive push events whenever this POST fires.
 */

import { NextRequest, NextResponse } from "next/server";
import { bustCache } from "@/lib/tvmaze";
import { validateWebhookSecret } from "@/lib/utils";
import type { WebhookPayload } from "@/types";

// ─── SSE client registry ─────────────────────────────────────────────────────
// Each entry is a controller for an open ReadableStream sent to a browser.
const clients = new Set<ReadableStreamDefaultController<string>>();

function broadcast(event: string, data: unknown) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const ctrl of clients) {
    try { ctrl.enqueue(msg); } catch { clients.delete(ctrl); }
  }
}

// ─── GET — open an SSE connection ────────────────────────────────────────────
export async function GET() {
  let controller: ReadableStreamDefaultController<string>;

  const stream = new ReadableStream<string>({
    start(ctrl) {
      controller = ctrl;
      clients.add(ctrl);

      // Send initial connection event
      ctrl.enqueue(`event: connected\ndata: ${JSON.stringify({ ts: Date.now(), clients: clients.size })}\n\n`);

      // Keep-alive ping every 25 seconds
      const ping = setInterval(() => {
        try { ctrl.enqueue(`: ping\n\n`); } catch { clearInterval(ping); }
      }, 25_000);
    },
    cancel() {
      clients.delete(controller);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",       // disable Nginx buffering
    },
  });
}

// ─── POST — receive a webhook event ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Validate secret
  const secret = req.headers.get("x-webhook-secret");
  if (!validateWebhookSecret(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { event, data } = payload;

  // 3. Bust server-side cache based on event type
  switch (event) {
    case "show.updated":
    case "show.added": {
      const id = (data as { id?: number })?.id;
      if (id) {
        bustCache(`show:${id}`);
        bustCache(`episodes:${id}`);
      }
      bustCache("shows:0"); // refresh first page listing
      break;
    }
    case "schedule.updated":
      bustCache(`schedule:${new Date().toISOString().split("T")[0]}`);
      break;
    case "ping":
      // No cache changes; just used to verify connectivity
      break;
    default:
      // Unknown event — bust everything to be safe
      bustCache();
  }

  // 4. Broadcast to all SSE clients
  broadcast(event, { ...data, _receivedAt: Date.now() });

  console.log(`[webhook] event="${event}" clients=${clients.size}`);

  return NextResponse.json({
    ok: true,
    event,
    clientsNotified: clients.size,
    ts: Date.now(),
  });
}
