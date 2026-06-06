"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Show, Episode, LiveStatus } from "@/types";

const POLL_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_POLL_INTERVAL ?? "300000",
  10
);

// ─── useShows ─────────────────────────────────────────────────────────────────
export function useShows(initialPage = 0) {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [source, setSource] = useState<"tvmaze" | "cache">("tvmaze");

  const fetchPage = useCallback(async (p: number, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const res = await fetch(`/api/shows?page=${p}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setShows((prev) => (append ? [...prev, ...json.data] : json.data));
      setHasMore(json.hasMore);
      setLastSync(Date.now());
      setSource(json.source);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load shows");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  // Auto-polling
  useEffect(() => {
    const id = setInterval(() => fetchPage(0, false), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  }, [page, fetchPage]);

  const refresh = useCallback(() => fetchPage(0, false), [fetchPage]);

  return { shows, loading, loadingMore, error, hasMore, lastSync, source, loadMore, refresh };
}

// ─── useSchedule ──────────────────────────────────────────────────────────────
export function useSchedule(date?: string) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const url = date ? `/api/schedule?date=${date}` : "/api/schedule";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setEpisodes(json.data ?? []);
      setLastSync(Date.now());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Refresh schedule every 5 minutes
  useEffect(() => {
    const id = setInterval(fetch_, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetch_]);

  return { episodes, loading, error, lastSync, refresh: fetch_ };
}

// ─── useSearch ────────────────────────────────────────────────────────────────
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResults(json.data ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback((q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 2) { setResults([]); return; }
    timerRef.current = setTimeout(() => search(q), 350);
  }, [search]);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return { query, results, loading, error, setQuery: handleQueryChange, search, clear };
}

// ─── useWebhook (SSE live updates) ────────────────────────────────────────────
/**
 * Connects to GET /api/webhook (Server-Sent Events).
 * Whenever the server broadcasts an event (triggered by POST /api/webhook),
 * the `onEvent` callback fires with the event name and data.
 *
 * The hook handles:
 *  - Automatic reconnection with exponential back-off
 *  - Connection state tracking
 *  - Clean-up on unmount
 */
export function useWebhook(onEvent: (event: string, data: unknown) => void) {
  const [status, setStatus] = useState<LiveStatus>({
    connected: false,
    lastSync: null,
    source: "api",
    showCount: 0,
  });
  const retryRef = useRef(0);
  const esRef    = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let destroyed = false;

    function connect() {
      if (destroyed) return;

      const es = new EventSource("/api/webhook");
      esRef.current = es;

      es.addEventListener("connected", () => {
        retryRef.current = 0;
        setStatus((s) => ({ ...s, connected: true, lastSync: Date.now(), source: "webhook" }));
      });

      // Listen for all TVmaze webhook event types
      const events = ["show.updated", "show.added", "episode.added", "schedule.updated", "ping"];
      for (const ev of events) {
        es.addEventListener(ev, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            onEventRef.current(ev, data);
            setStatus((s) => ({ ...s, lastSync: Date.now() }));
          } catch { /* malformed payload */ }
        });
      }

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setStatus((s) => ({ ...s, connected: false }));
        if (!destroyed) {
          // Exponential back-off: 1s, 2s, 4s, 8s … max 30s
          const delay = Math.min(1000 * 2 ** retryRef.current, 30_000);
          retryRef.current++;
          setTimeout(connect, delay);
        }
      };
    }

    connect();
    return () => {
      destroyed = true;
      esRef.current?.close();
    };
  }, []);

  const updateCount = useCallback((n: number) => {
    setStatus((s) => ({ ...s, showCount: n }));
  }, []);

  return { status, updateCount };
}

// ─── useEpisodes ──────────────────────────────────────────────────────────────
export function useEpisodes(showId: number | null) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    fetch(`/api/shows?page=0`) // placeholder — see note
      .then(() =>
        // Episodes come from TVmaze directly in a real setup;
        // here we hit TVmaze from the client for simplicity since
        // the show detail modal is client-only.
        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      )
      .then((r) => r.json())
      .then((data: Episode[]) => {
        setEpisodes(data);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [showId]);

  return { episodes, loading, error };
}
