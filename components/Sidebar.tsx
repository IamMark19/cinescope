"use client";

import { useState } from "react";
import type { Show, LiveStatus } from "@/types";
import { timeAgo } from "@/lib/utils";
import { AdSidebar, AdSquare } from "@/components/AdBanner";

interface Props {
  topShows: Show[];
  status: LiveStatus;
  onShowClick: (show: Show) => void;
}

function TrendingItem({ show, rank, onClick }: { show: Show; rank: number; onClick: () => void }) {
  return (
    <div
      className="flex gap-3 items-start py-3 border-b border-dark-3 last:border-0 cursor-pointer group"
      onClick={onClick}
    >
      <span className="font-condensed text-[28px] font-black text-dark-3 leading-none min-w-[30px] mt-0.5">
        {rank}
      </span>
      <div>
        <div className="font-condensed text-[15px] font-bold leading-tight text-cs-white group-hover:text-red transition-colors duration-150">
          {show.name}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          ⭐ {show.rating?.average ?? "—"} · {(show.genres[0]) || "TV"}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ topShows, status, onShowClick }: Props) {
  const [webhookResult, setWebhookResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  async function testWebhook() {
    setTesting(true);
    setWebhookResult(null);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": "your_webhook_secret_here",
        },
        body: JSON.stringify({ event: "ping", timestamp: Date.now() }),
      });
      const json = await res.json();
      setWebhookResult(
        res.ok
          ? `✓ Sent · ${json.clientsNotified ?? 0} client(s) notified`
          : `✗ ${json.error}`
      );
    } catch (e) {
      setWebhookResult(`✗ ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setTesting(false);
    }
  }

  return (
    <aside className="flex flex-col gap-8">

      {/* ── SIDEBAR AD #1 — tall banner at the very top ── */}
      <AdSidebar />

      {/* Trending */}
      <div>
        <div className="font-condensed text-[16px] font-black tracking-wide uppercase text-cs-white border-b-2 border-red pb-2.5 mb-4">
          Trending Shows
        </div>
        <div>
          {topShows.length === 0
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="py-3 border-b border-dark-3 last:border-0 space-y-1.5">
                  <div className="h-4 skeleton rounded w-4/5" />
                  <div className="h-3 skeleton rounded w-2/5" />
                </div>
              ))
            : topShows.map((s, i) => (
                <TrendingItem key={s.id} show={s} rank={i + 1} onClick={() => onShowClick(s)} />
              ))}
        </div>
      </div>

      {/* ── SIDEBAR AD #2 — small square between trending and newsletter ── */}
      <AdSquare />

      {/* Newsletter */}
      <div className="bg-dark-2 border border-dark-3 rounded-lg p-5 text-center">
        <div className="text-[32px] mb-2">🎬</div>
        <h3 className="font-condensed text-[20px] font-black text-cs-white mb-1.5">
          Daily Dispatch
        </h3>
        <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
          Get today's top TV and movie news delivered every morning.
        </p>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-dark-3 border border-dark-4 text-cs-white font-body text-[13px] px-3 py-2.5 rounded outline-none placeholder:text-gray-600 focus:border-red transition-colors duration-150"
          />
          <button className="bg-red hover:bg-red-dark text-white font-condensed font-bold text-[13px] tracking-wide uppercase py-2.5 rounded transition-colors duration-150">
            Get Updates
          </button>
        </div>
      </div>

      {/* Webhook test panel */}
      <div className="bg-dark-2 border border-dark-3 rounded-lg p-5">
        <div className="font-condensed text-[16px] font-black tracking-wide uppercase text-cs-white border-b-2 border-red pb-2.5 mb-4">
          ⚡ Webhook Panel
        </div>

        <div className="text-[12px] text-gray-500 space-y-2 mb-4 leading-relaxed">
          <div className="flex justify-between">
            <span>SSE Status</span>
            <span className={status.connected ? "text-emerald-400 font-bold" : "text-yellow-400"}>
              {status.connected ? "● Connected" : "○ Reconnecting"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last event</span>
            <span className="text-cs-white">
              {status.lastSync ? timeAgo(status.lastSync) : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Endpoint</span>
            <span className="text-gold font-mono text-[11px]">POST /api/webhook</span>
          </div>
          <div className="flex justify-between">
            <span>SSE stream</span>
            <span className="text-gold font-mono text-[11px]">GET /api/webhook</span>
          </div>
        </div>

        <button
          onClick={testWebhook}
          disabled={testing}
          className="w-full bg-dark-3 hover:bg-dark-4 border border-dark-4 hover:border-red text-gray-300 font-condensed font-bold text-[12px] tracking-wide uppercase py-2 rounded transition-all duration-150 disabled:opacity-50"
        >
          {testing ? "Sending…" : "🧪 Test Ping Webhook"}
        </button>

        {webhookResult && (
          <div className={`mt-2 text-[11px] text-center font-condensed tracking-wide ${
            webhookResult.startsWith("✓") ? "text-emerald-400" : "text-red"
          }`}>
            {webhookResult}
          </div>
        )}

        <p className="mt-3 text-[10px] text-gray-600 leading-relaxed">
          POST to <code className="text-gold">/api/webhook</code> with header{" "}
          <code className="text-gold">x-webhook-secret</code> to push live
          updates to all connected clients via SSE.
        </p>
      </div>

      {/* ── SIDEBAR AD #3 — tall banner below webhook panel ── */}
      <AdSidebar />

      {/* Cache / DB stats */}
      <div>
        <div className="font-condensed text-[16px] font-black tracking-wide uppercase text-cs-white border-b-2 border-red pb-2.5 mb-4">
          Live Stats
        </div>
        <div className="text-[12px] text-gray-500 space-y-2.5">
          <div className="flex justify-between items-center">
            <span>🗄️ Shows loaded</span>
            <strong className="text-cs-white">{status.showCount.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>📡 Data source</span>
            <strong className="text-gold uppercase text-[11px] tracking-wider">{status.source}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>⚡ Transport</span>
            <strong className="text-gold uppercase text-[11px] tracking-wider">SSE</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>🔄 Server cache</span>
            <strong className="text-cs-white">1 hour TTL</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>🔁 Auto-poll</span>
            <strong className="text-cs-white">5 min</strong>
          </div>
        </div>
      </div>

    </aside>
  );
}
