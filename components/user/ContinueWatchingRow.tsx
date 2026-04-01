"use client";

import { MediaRow } from "@/components/media/MediaRow";
import { useSettingsContext } from "@/context/SettingsContext";
import { useContinueWatchingSubscription } from "@/hooks/useContinueWatchingSubscription";
import type { MediaItem } from "@/types/media";

export function ContinueWatchingRow() {
  const { ready } = useSettingsContext();
  const query = useContinueWatchingSubscription();
  const items = (query.data ?? []).map(
    (item) =>
      ({
        id: item.mediaId,
        tmdbId: Number(item.mediaId),
        title: item.title,
        mediaType: item.mediaType,
        overview:
          item.season && item.episode
            ? `Resume on Season ${item.season}, Episode ${item.episode}.`
            : "Resume from your most recent playback position.",
        posterPath: item.posterPath,
        backdropPath: item.backdropPath,
        releaseDate: item.updatedAt,
        rating: item.progress,
        voteCount: null,
      }) satisfies MediaItem,
  );

  if (!ready || query.isBootstrapping || items.length === 0) {
    return null;
  }

  return (
    <MediaRow
      title="Continue Watching"
      description="Realtime progress sorted by the latest playback activity."
      items={items}
    />
  );
}
