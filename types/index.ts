// ─── TVmaze Core Types ───────────────────────────────────────────────────────

export interface TVmazeImage {
  medium: string | null;
  original: string | null;
}

export interface TVmazeRating {
  average: number | null;
}

export interface TVmazeNetwork {
  id: number;
  name: string;
  country?: { name: string; code: string; timezone: string } | null;
}

export interface TVmazeSchedule {
  time: string;
  days: string[];
}

export interface TVmazeExternals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

export interface Show {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: TVmazeSchedule;
  rating: TVmazeRating;
  weight: number;
  network: TVmazeNetwork | null;
  webChannel: TVmazeNetwork | null;
  image: TVmazeImage | null;
  summary: string | null;
  updated: number;
  _links: {
    self: { href: string };
    previousepisode?: { href: string; name?: string };
    nextepisode?: { href: string; name?: string };
  };
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number | null;
  rating: TVmazeRating;
  image: TVmazeImage | null;
  summary: string | null;
  _links: {
    self: { href: string };
    show?: { href: string; name?: string };
  };
  // Only present in /schedule endpoint
  show?: Show;
  _embedded?: { show?: Show };
}

export interface SearchResult {
  score: number;
  show: Show;
}

// ─── App-level Types ─────────────────────────────────────────────────────────

export type Section = "popular" | "schedule" | "search";

export interface LiveStatus {
  connected: boolean;
  lastSync: number | null;
   source: "tvmaze" | "cache" |"Webhook"|"api";
  showCount: number;
}

// ─── Webhook Types ───────────────────────────────────────────────────────────

export type WebhookEvent =
  | "show.updated"
  | "show.added"
  | "episode.added"
  | "schedule.updated"
  | "ping";

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: number;
  data?: Partial<Show> | Partial<Episode> | Record<string, unknown>;
}

// ─── API Route Response Types ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  cached: boolean;
  cachedAt?: number;
  source: "tvmaze" | "cache" |"Webhook"|"api";
}

export interface ShowsResponse extends ApiResponse<Show[]> {
  page: number;
  hasMore: boolean;
}

export interface ScheduleResponse extends ApiResponse<Episode[]> {
  date: string;
}
