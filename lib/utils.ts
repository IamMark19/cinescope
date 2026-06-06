import type { Show } from "@/types";

/** Strip HTML tags from TVmaze summary strings */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

/** Get the best available image URL from a show */
export function getShowImage(show: Show, size: "medium" | "original" = "original"): string | null {
  if (!show.image) return null;
  return show.image[size] ?? show.image.medium ?? show.image.original ?? null;
}

/** Get display network name */
export function getNetwork(show: Show): string {
  return show.network?.name ?? show.webChannel?.name ?? "Unknown";
}

/** Format a TVmaze date string */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "TBA";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Format today's date as YYYY-MM-DD */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Human-readable "time ago" string */
export function timeAgo(ms: number): string {
  const secs = Math.floor((Date.now() - ms) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/** Validate an incoming webhook signature */
export function validateWebhookSecret(secret: string | null): boolean {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected || expected === "your_webhook_secret_here") return true; // dev mode
  return secret === expected;
}
