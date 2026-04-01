"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { useSettingsContext } from "@/context/SettingsContext";
import type { MediaItem, SeasonSummary } from "@/types/media";

export function MovieCard({
  media,
  seasons,
}: {
  media: MediaItem;
  seasons?: SeasonSummary[];
}) {
  const { settings } = useSettingsContext();
  const imageWidth = settings.dataSaver ? "w342" : "w500";

  return (
    <article className="group relative flex h-full w-full flex-col cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      <Link href={`/title/${media.mediaType}/${media.id}`} className="liquid-glass-soft flex h-full flex-col overflow-hidden rounded-[1.6rem]">
        <div className="relative block aspect-[2/3] w-full overflow-hidden">
          <Image
            src={
              media.posterPath
                ? `https://image.tmdb.org/t/p/${imageWidth}${media.posterPath}`
                : "/512x512.png"
            }
            alt={media.title}
            fill
            sizes="220px"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
              {media.rating ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-2 py-1">
                  <Star className="size-3 fill-[var(--accent)] text-[var(--accent)]" />
                  {media.rating.toFixed(1)}
                </span>
              ) : null}
              {media.releaseDate ? (
                <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1">
                  {new Date(media.releaseDate).getFullYear()}
                </span>
              ) : null}
            </div>
            <h3 className="line-clamp-2 text-lg font-semibold text-white">{media.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{media.overview || "No overview available."}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
