"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Show } from "@/types";
import { useEpisodes } from "@/hooks/useTVmaze";
import { getShowImage, getNetwork, stripHtml, formatDate } from "@/lib/utils";

interface Props {
  show: Show | null;
  onClose: () => void;
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-condensed text-[10px] font-bold tracking-widest uppercase text-gray-500">
        {label}
      </span>
      <span className={`font-condensed text-[18px] font-bold ${gold ? "text-gold" : "text-cs-white"}`}>
        {value}
      </span>
    </div>
  );
}

export function ShowModal({ show, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { episodes, loading: epsLoading } = useEpisodes(show?.id ?? null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const src = getShowImage(show, "original");
  const summary = stripHtml(show.summary);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] bg-black/90 flex items-start justify-center overflow-y-auto py-10 px-4 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="bg-dark border border-dark-3 rounded-xl max-w-[860px] w-full overflow-hidden animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-red rounded-full flex items-center justify-center text-white text-lg transition-colors duration-150"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="relative h-[300px] bg-dark-3 overflow-hidden">
          {src ? (
            <Image
              src={src}
              alt={show.name}
              fill
              className="object-cover"
              sizes="860px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 font-condensed uppercase">
              {show.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="font-condensed text-[36px] font-black text-white leading-tight">
              {show.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Stats row */}
          <div className="flex flex-wrap gap-5 mb-5">
            <Stat label="Rating" value={show.rating?.average ? `⭐ ${show.rating.average}` : "N/A"} gold />
            <Stat label="Status" value={show.status || "—"} />
            <Stat label="Network" value={getNetwork(show) || "—"} />
            <Stat label="Premiered" value={formatDate(show.premiered)} />
            <Stat label="Language" value={show.language || "—"} />
            <Stat label="Runtime" value={show.runtime ? `${show.runtime} min` : "—"} />
          </div>

          {/* Genres */}
          {show.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {show.genres.map((g) => (
                <span key={g} className="text-[11px] bg-dark-3 text-gray-400 px-2.5 py-0.5 rounded-full font-condensed uppercase tracking-wide">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          {summary && (
            <p className="text-[14px] text-white/75 leading-relaxed mb-6">{summary}</p>
          )}

          {/* Episodes */}
          <div>
            <h3 className="font-condensed text-[16px] font-black uppercase tracking-wide text-cs-white border-b-2 border-red pb-2 mb-4">
              Episodes
            </h3>

            {epsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            ) : episodes.length === 0 ? (
              <p className="text-[13px] text-gray-500">No episodes found.</p>
            ) : (
              <div className="episode-scroll space-y-0 divide-y divide-dark-3">
                {episodes.slice(0, 40).map((ep) => (
                  <div key={ep.id} className="grid grid-cols-[80px_1fr] gap-3 py-2.5">
                    <span className="font-condensed text-[13px] font-bold text-red whitespace-nowrap">
                      S{String(ep.season).padStart(2, "0")}E{String(ep.number).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="text-[14px] text-cs-white font-medium leading-tight">{ep.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{ep.airdate || "TBA"}</div>
                    </div>
                  </div>
                ))}
                {episodes.length > 40 && (
                  <p className="text-[12px] text-gray-500 py-2">
                    + {episodes.length - 40} more episodes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
