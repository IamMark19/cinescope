"use client";

import type { LiveStatus } from "@/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  status: LiveStatus;
  onRefresh: () => void;
}

export function LiveStatusBar({ status, onRefresh }: Props) {
  const { connected, lastSync, source, showCount } = status;

  return (
    <div className="bg-dark-2 border-b border-dark-3">
      <div className="max-w-[1280px] mx-auto px-6 py-1.5 flex items-center gap-3 text-[11px] font-condensed tracking-wide text-gray-500 flex-wrap">

        {/* Connection dot */}
        <span className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
              connected
                ? "bg-emerald-500 sse-live"
                : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className={connected ? "text-emerald-400" : "text-yellow-400"}>
            {connected ? "LIVE" : "RECONNECTING"}
          </span>
        </span>

        <span className="text-dark-4">|</span>

        {/* Source badge */}
        <span>
          Source:{" "}
          <strong className="text-gold uppercase tracking-wider">{source}</strong>
        </span>

        <span className="text-dark-4">|</span>

        {/* Last sync */}
        <span>
          Synced:{" "}
          <strong className="text-cs-white">
            {lastSync ? timeAgo(lastSync) : "—"}
          </strong>
        </span>

        {showCount > 0 && (
          <>
            <span className="text-dark-4">|</span>
            <span>
              Shows:{" "}
              <strong className="text-cs-white">{showCount.toLocaleString()}</strong>
            </span>
          </>
        )}

        {/* Webhook pill */}
        <span className="ml-auto flex items-center gap-2 bg-dark-3 border border-dark-4 rounded px-2 py-0.5">
          <span className="text-gold">⚡</span>
          <span className="text-gray-400 uppercase tracking-wider">
            SSE Webhook
          </span>
        </span>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 bg-dark-3 hover:bg-red hover:text-white border border-dark-4 hover:border-red rounded px-2 py-0.5 transition-colors duration-150 text-gray-400 uppercase tracking-wider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}
