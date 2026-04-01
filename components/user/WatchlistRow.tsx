"use client";

import { MediaRow } from "@/components/media/MediaRow";
import { useSettingsContext } from "@/context/SettingsContext";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";
import type { MediaItem } from "@/types/media";

export function WatchlistRow() {
  const { ready } = useSettingsContext();
  const query = useWatchlistSubscription();
  const items = (query.data ?? []).map(
    (item) =>
      ({
        id: item.mediaId,
        tmdbId: Number(item.mediaId),
        title: item.title,
        mediaType: item.mediaType,
        overview: "Saved to your active mode watchlist.",
        posterPath: item.posterPath,
        backdropPath: item.backdropPath,
        releaseDate: item.addedAt,
        rating: item.rating,
        voteCount: null,
      }) satisfies MediaItem,
  );

  if (!ready || query.isBootstrapping || items.length === 0) {
    return null;
  }

  return <MediaRow title="Watchlist" description="Realtime from your active storage mode." items={items} />;
}
