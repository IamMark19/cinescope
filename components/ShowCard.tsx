"use client";

import Image from "next/image";
import type { Show } from "@/types";
import { getShowImage, getNetwork, stripHtml } from "@/lib/utils";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function RatingBadge({ rating }: { rating: Show["rating"] }) {
  if (!rating?.average) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-gold/10 text-gold border border-gold/25 rounded px-1.5 py-0.5 text-[11px] font-semibold">
      ⭐ {rating.average}
    </span>
  );
}

function GenrePills({ genres, max = 3 }: { genres: string[]; max?: number }) {
  return (
    <>
      {genres.slice(0, max).map((g) => (
        <span
          key={g}
          className="text-[10px] bg-dark-3 text-gray-400 px-2 py-0.5 rounded-full font-condensed uppercase tracking-wide"
        >
          {g}
        </span>
      ))}
    </>
  );
}

function Tag({ label, variant = "default" }: { label: string; variant?: "default" | "tv" | "new" | "review" }) {
  const colors: Record<string, string> = {
    default: "bg-red text-white",
    tv:      "bg-blue-700 text-white",
    new:     "bg-emerald-700 text-white",
    review:  "bg-gold text-yellow-900",
  };
  return (
    <span className={`inline-block ${colors[variant]} font-condensed text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded mb-2`}>
      {label}
    </span>
  );
}

// ─── ShowCard ────────────────────────────────────────────────────────────────
export function ShowCard({ show, onClick }: { show: Show; onClick: () => void }) {
  const src = getShowImage(show, "medium");

  return (
    <article
      onClick={onClick}
      className="bg-dark-2 border border-dark-3 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:border-dark-4"
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden bg-dark-3">
        {src ? (
          <Image
            src={src}
            alt={show.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-condensed text-[11px] uppercase tracking-wider">
            No Image
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="font-condensed text-[16px] font-bold leading-tight text-cs-white group-hover:text-red transition-colors duration-150 mb-1">
          {show.name}
        </h3>
        <p className="text-[12px] text-gray-500">
          {getNetwork(show)} · {show.status}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          <GenrePills genres={show.genres} />
        </div>
        {show.rating?.average && (
          <div className="mt-2">
            <RatingBadge rating={show.rating} />
          </div>
        )}
      </div>
    </article>
  );
}

// ─── HeroCard (main large) ────────────────────────────────────────────────────
export function HeroCardMain({ show, onClick }: { show: Show; onClick: () => void }) {
  const src = getShowImage(show, "original");

  return (
    <article
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer group col-span-2 row-span-2 h-[520px]"
    >
      {src ? (
        <Image
          src={src}
          alt={show.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-dark-3 flex items-center justify-center text-gray-600 font-condensed uppercase tracking-wider">
          {show.name}
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Tag label={(show.genres[0]) || "TV"} />
        <h2 className="font-condensed text-[34px] font-black leading-[1.05] text-white drop-shadow-lg mb-2">
          {show.name}
        </h2>
        <div className="flex items-center gap-3 text-[11px] text-white/50">
          <RatingBadge rating={show.rating} />
          <span>{getNetwork(show)}</span>
          <span>{show.status}</span>
        </div>
        <p className="mt-2 text-[13px] text-white/60 line-clamp-2 max-w-xl">
          {stripHtml(show.summary)}
        </p>
      </div>
    </article>
  );
}

// ─── HeroCard (small) ────────────────────────────────────────────────────────
export function HeroCardSmall({
  show,
  variant = "tv",
  onClick,
}: {
  show: Show;
  variant?: "tv" | "new";
  onClick: () => void;
}) {
  const src = getShowImage(show, "original");

  return (
    <article
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer group h-[258px]"
    >
      {src ? (
        <Image
          src={src}
          alt={show.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-dark-3 flex items-center justify-center text-gray-600 font-condensed uppercase">
          {show.name}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Tag label={variant === "tv" ? "TV" : "New"} variant={variant} />
        <h3 className="font-condensed text-[17px] font-bold leading-tight text-white">
          {show.name}
        </h3>
        <div className="mt-1">
          <RatingBadge rating={show.rating} />
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────
export function ShowCardSkeleton() {
  return (
    <div className="bg-dark-2 border border-dark-3 rounded-md overflow-hidden">
      <div className="h-[200px] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-3/5" />
        <div className="h-3 skeleton rounded w-2/5" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto" }}>
      <div className="skeleton col-span-2 row-span-2" style={{ height: 520 }} />
      <div className="skeleton" style={{ height: 258 }} />
      <div className="skeleton" style={{ height: 258 }} />
    </div>
  );
}
