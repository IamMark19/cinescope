import type { Show, Episode, SearchResult, ShowsResponse, ScheduleResponse } from "@/types";

const BASE = process.env.TVMAZE_API_BASE ?? "https://api.tvmaze.com";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ─── Simple in-memory server cache ───────────────────────────────────────────
interface CacheEntry<T> {
  data: T;
  ts: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

function fromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function toCache<T>(key: string, data: T): void {
  cache.set(key, { data, ts: Date.now() });
}
export function bustCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}
export function getCacheAge(key: string): number | null {
  const e = cache.get(key);
  return e ? Date.now() - e.ts : null;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function tvFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Accept": "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`TVmaze ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getShows(page = 0): Promise<ShowsResponse> {
  const key = `shows:${page}`;
  const cached = fromCache<Show[]>(key);
  if (cached) {
    return { data: cached, cached: true, cachedAt: cache.get(key)?.ts, source: "cache", page, hasMore: true };
  }
  const data = await tvFetch<Show[]>(`/shows?page=${page}`);
  toCache(key, data);
  return { data, cached: false, source: "tvmaze", page, hasMore: data.length === 250 };
}

export async function getShow(id: number): Promise<Show> {
  const key = `show:${id}`;
  const cached = fromCache<Show>(key);
  if (cached) return cached;
  const data = await tvFetch<Show>(`/shows/${id}?embed=nextepisode`);
  toCache(key, data);
  return data;
}

export async function getEpisodes(showId: number): Promise<Episode[]> {
  const key = `episodes:${showId}`;
  const cached = fromCache<Episode[]>(key);
  if (cached) return cached;
  const data = await tvFetch<Episode[]>(`/shows/${showId}/episodes`);
  toCache(key, data);
  return data;
}

export async function getSchedule(date?: string): Promise<ScheduleResponse> {
  const d = date ?? new Date().toISOString().split("T")[0];
  const key = `schedule:${d}`;
  const cached = fromCache<Episode[]>(key);
  if (cached) {
    return { data: cached, cached: true, cachedAt: cache.get(key)?.ts, source: "cache", date: d };
  }
  const data = await tvFetch<Episode[]>(`/schedule?country=US&date=${d}`);
  // Ensure unique IDs for DB storage
  const tagged = data.map((ep, i) => ({ ...ep, id: ep.id ?? 900000 + i }));
  toCache(key, tagged);
  return { data: tagged, cached: false, source: "tvmaze", date: d };
}

export async function searchShows(q: string): Promise<Show[]> {
  const data = await tvFetch<SearchResult[]>(`/search/shows?q=${encodeURIComponent(q)}`);
  return data.map((r) => r.show).filter(Boolean);
}

export async function getUpdates(): Promise<Record<string, number>> {
  return tvFetch<Record<string, number>>("/updates/shows");
}
