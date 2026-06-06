export function Footer() {
  return (
    <footer className="bg-[#080808] border-t-[3px] border-red mt-16 pt-12 pb-8 px-6">
      <div className="max-w-[1280px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr_1fr] gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="font-condensed text-[32px] font-black uppercase mb-3">
              Cine<span className="text-red">Scope</span>
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
              Real-time TV data powered by the TVmaze REST API with live webhook
              updates via Server-Sent Events.
            </p>
            <div className="inline-flex items-center gap-2 bg-dark-2 border border-dark-3 rounded px-3 py-1.5 text-[11px] text-gray-400 font-condensed">
              📡 <span className="text-gold">api.tvmaze.com</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-condensed text-[13px] font-bold tracking-widest uppercase text-gray-400 mb-4">
              Navigation
            </div>
            <div className="space-y-2">
              {["Popular Shows", "Today's Schedule", "Search Shows"].map((l) => (
                <div key={l} className="text-[13px] text-gray-500 hover:text-red transition-colors duration-150 cursor-pointer">
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* API */}
          <div>
            <div className="font-condensed text-[13px] font-bold tracking-widest uppercase text-gray-400 mb-4">
              API Endpoints
            </div>
            <div className="space-y-2">
              {[
                "GET /api/shows?page=N",
                "GET /api/schedule?date=",
                "GET /api/search?q=",
                "GET /api/webhook (SSE)",
                "POST /api/webhook",
              ].map((e) => (
                <div key={e} className="font-mono text-[12px] text-gray-500">
                  {e}
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <div className="font-condensed text-[13px] font-bold tracking-widest uppercase text-gray-400 mb-4">
              Tech Stack
            </div>
            <div className="space-y-2">
              {[
                "Next.js 15 (App Router)",
                "TypeScript",
                "Tailwind CSS",
                "TVmaze REST API",
                "Server-Sent Events (SSE)",
                "Custom React Hooks",
                "Server-side Cache (TTL)",
              ].map((t) => (
                <div key={t} className="text-[13px] text-gray-500">{t}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-dark-3 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-gray-600">
          <div>
            © 2026 CineScope. TV data provided by{" "}
            <span className="text-gold font-semibold">TVmaze</span>
          </div>
          <div className="text-[11px] text-gray-600 font-condensed tracking-wide uppercase">
            Built with Next.js 15 App Router + SSE Webhooks
          </div>
        </div>
      </div>
    </footer>
  );
}
