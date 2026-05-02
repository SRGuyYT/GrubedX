"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Home, Loader2, MessageSquare, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { FeatureGate } from "@/components/feedback/FeatureGate";
import { ExternalEmbedFrame } from "@/components/media/ExternalEmbedFrame";
import { cn } from "@/lib/cn";

const ANIME_NEXUS_URL = "https://anime.nexus/";

function AnimeFallback() {
  const [isPending, startTransition] = useTransition();

  const contactTeam = () => {
    startTransition(async () => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          category: "add",
          area: "anime",
          priority: "medium",
          title: "Anime embed fallback triggered",
          message: "The Anime iframe failed to load and fallback UI was shown.",
          pageUrl: "/anime",
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(body?.error ?? "Could not contact the GrubX team right now.");
        return;
      }

      toast.success("Thanks - the GrubX team was notified.");
    });
  };

  return (
    <section className="page-shell grid min-h-[68dvh] place-items-center py-10">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-6 py-8 text-center shadow-2xl md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(242,179,90,0.18),transparent_42%)]" />
        <div className="relative">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-white/10 bg-black/40 text-[var(--accent)]">
            <Sparkles className="size-7" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Open in Browser</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Anime</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
            We couldn&apos;t load the Anime section inside the app. You can still access it directly.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={ANIME_NEXUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black transition active:scale-[0.98]"
            >
              <ExternalLink className="size-4" />
              Open Anime Nexus
            </a>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              <Home className="size-4" />
              Go Home
            </Link>
            <Link
              href="/settings"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              <Settings className="size-4" />
              Open Settings
            </Link>
            <button
              type="button"
              onClick={contactTeam}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
              Contact GrubX Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimeEmbed() {
  const [status, setStatus] = useState<"loading" | "loaded" | "fallback">("loading");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "fallback" : current));
    }, 7000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (status === "fallback") {
    return <AnimeFallback />;
  }

  return (
    <section className="page-shell py-6 md:py-8">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Anime</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Anime Nexus</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Anime Nexus is loaded as an external site inside GrubX when the browser allows it.
          </p>
        </div>
        <a
          href={ANIME_NEXUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <ExternalLink className="size-4" />
          Open in Browser
        </a>
      </div>

      <div className="relative min-h-[72dvh] overflow-hidden rounded-[1.25rem] border border-white/10 bg-black shadow-2xl">
        {status === "loading" ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/70 px-6 text-center backdrop-blur-md">
            <div>
              <Loader2 className="mx-auto size-7 animate-spin text-[var(--accent)]" />
              <p className="mt-4 text-sm font-semibold text-white">Loading Anime Nexus...</p>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                If the browser blocks the embed, GrubX will show an external link instead.
              </p>
            </div>
          </div>
        ) : null}
        <ExternalEmbedFrame
          src={ANIME_NEXUS_URL}
          title="Anime Nexus"
          className={cn("h-[72dvh] min-h-[560px] w-full border-0", status === "loading" ? "opacity-0" : "opacity-100")}
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("fallback")}
        />
      </div>
    </section>
  );
}

export default function AnimePage() {
  return (
    <FeatureGate feature="anime">
      <AnimeEmbed />
    </FeatureGate>
  );
}
