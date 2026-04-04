export function Footer() {
  return (
    <footer className="page-shell pb-10 pt-14 text-sm text-[var(--muted)]">
      <div className="liquid-glass-soft grid gap-4 rounded-[2rem] px-6 py-6 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em]">Local-first</p>
          <p className="mt-2 leading-6">Continue watching, watchlist, settings, and updater state stay on-device.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em]">Offline-ready</p>
          <p className="mt-2 leading-6">The app shell is cached for quick relaunches and resilient offline browsing.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em]">Streaming data</p>
          <p className="mt-2 leading-6">TMDB and Streamed requests are controlled and rendered through fixed app routes only.</p>
        </div>
      </div>
    </footer>
  );
}
