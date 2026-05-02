"use client";

import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { MediaRow } from "@/components/media/MediaRow";
import { ContinueWatchingRow } from "@/components/user/ContinueWatchingRow";
import { WatchlistRow } from "@/components/user/WatchlistRow";
import { useSettingsContext } from "@/context/SettingsContext";
import type { MediaItem } from "@/types/media";

export function HomeContent({
  hero,
  popularMovies,
  popularTv,
  topRatedMovies,
}: {
  hero: MediaItem[];
  popularMovies: MediaItem[];
  popularTv: MediaItem[];
  topRatedMovies: MediaItem[];
}) {
  const { settings } = useSettingsContext();

  return (
    <div className="space-y-10 pb-14 md:space-y-12">
      {settings.showHomeHero ? <HeroCarousel items={hero.slice(0, 5)} /> : null}

      <div className="page-shell space-y-10 md:space-y-12">
        {settings.featureToggles.continueWatching ? <ContinueWatchingRow /> : null}
        {settings.featureToggles.watchlist ? <WatchlistRow /> : null}
        {settings.showTrendingRows ? (
          <>
            <MediaRow title="Trending Now" description="Fresh picks people are opening tonight." items={hero.slice(1, 9)} />
            <MediaRow title="Popular Movies" description="Big-screen films with momentum." items={popularMovies.slice(0, 10)} />
            <MediaRow title="Popular TV" description="Series worth adding to your queue." items={popularTv.slice(0, 10)} />
            <MediaRow title="Top Rated" description="Critic and audience favorites with staying power." items={topRatedMovies.slice(0, 10)} />
          </>
        ) : null}
      </div>
    </div>
  );
}
