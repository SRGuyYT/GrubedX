"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Clapperboard,
  Sparkles,
  Home,
  Music,
  MonitorPlay,
  Search,
  Settings2,
  Tv,
  Video,
  Youtube,
} from "lucide-react";

import { LiveClock } from "@/components/shell/LiveClock";
import { useSettingsContext } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";
import type { FeatureToggles } from "@/types/settings";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  feature?: keyof FeatureToggles;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Clapperboard, feature: "movies" },
  { href: "/tv", label: "TV", icon: Tv, feature: "tv" },
  { href: "/live", label: "Live TV", icon: MonitorPlay, feature: "live" },
  { href: "/anime", label: "Anime", icon: Sparkles, feature: "anime" },
  { href: "/youtube", label: "YouTube", icon: Youtube, feature: "youtube" },
  { href: "/tiktok", label: "TikTok", icon: Video, feature: "tiktok" },
  { href: "/spotify", label: "Spotify", icon: Music, feature: "spotify" },
  { href: "/ai", label: "AI Server", icon: Bot, feature: "aiServer" },
  { href: "/search", label: "Search", icon: Search, feature: "search" },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const isActivePath = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function NavButton({
  item,
  pathname,
  showLabels,
  showIcons,
}: {
  item: NavItem;
  pathname: string;
  showLabels: boolean;
  showIcons: boolean;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex min-h-11 min-w-0 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border px-3 py-2.5 text-sm font-semibold transition md:min-h-0 lg:px-3 xl:px-4",
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-[0_10px_32px_rgba(242,179,90,0.18)]"
          : "border-transparent text-[var(--muted)] hover:bg-white/8 hover:text-white active:scale-[0.98]",
      )}
    >
      {showIcons ? <Icon className="size-4 shrink-0 text-current" /> : null}
      {showLabels ? <span className="inline whitespace-nowrap md:hidden lg:inline">{item.label}</span> : null}
    </Link>
  );
}

function BrandBlock({
  showLogo,
  logoSize,
  name,
}: {
  showLogo: boolean;
  logoSize: "small" | "medium" | "large";
  name: string;
}) {
  const sizeClass = logoSize === "small" ? "size-8" : logoSize === "large" ? "size-11" : "size-9";
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-full border border-white/10 bg-black/45 px-3 py-2 transition hover:border-white/18 hover:bg-white/8"
    >
      {showLogo ? (
        <div className={cn("relative overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_10px_28px_rgba(0,0,0,0.32)]", sizeClass)}>
          <Image src="/64x64.png" alt={name} fill sizes="44px" className="object-cover" priority />
        </div>
      ) : null}
      <span className="hidden text-sm font-semibold text-white sm:inline">{name}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettingsContext();
  const nav = useMemo(() => {
    const aiServerUrl = settings.aiServerUrl || process.env.NEXT_PUBLIC_AI_SERVER_URL || "https://xthat.sky0cloud.dpdns.org";
    return navItems
      .filter((item) => !item.feature || settings.featureToggles[item.feature])
      .map((item) =>
        item.feature === "aiServer" && settings.aiOpenMode === "new-tab"
          ? { ...item, href: aiServerUrl, label: settings.aiServerLabel || item.label, external: true }
          : item,
      );
  }, [settings.aiOpenMode, settings.aiServerLabel, settings.aiServerUrl, settings.featureToggles]);
  const [playerChromeHidden, setPlayerChromeHidden] = useState(false);

  useEffect(() => {
    const isPlayerRoute = pathname.startsWith("/player") || pathname.startsWith("/embed");
    const syncPlayerChromeState = () => {
      setPlayerChromeHidden(
        isPlayerRoute ||
          document.body.classList.contains("grubx-player-open") ||
          document.documentElement.classList.contains("grubx-player-open"),
      );
    };

    syncPlayerChromeState();

    const observer = new MutationObserver(syncPlayerChromeState);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("grubx:player-chrome-change", syncPlayerChromeState);

    return () => {
      observer.disconnect();
      window.removeEventListener("grubx:player-chrome-change", syncPlayerChromeState);
    };
  }, [pathname]);

  if (playerChromeHidden) {
    return null;
  }

  return (
    <>
      <header className="site-navbar fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="page-shell flex items-center justify-between gap-3 py-4 pointer-events-auto">
          <BrandBlock showLogo={settings.showLogo} logoSize={settings.logoSize} name={settings.websiteName} />

          <nav className="liquid-glass hidden max-w-[calc(100vw-18rem)] items-center gap-1 overflow-x-auto rounded-full p-1.5 md:flex">
            {nav.map((item) => (
              <NavButton key={item.href} item={item} pathname={pathname} showLabels={settings.showNavLabels} showIcons={settings.showNavIcons} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search?focus=1"
              className="liquid-glass-soft hidden items-center justify-between gap-3 rounded-full px-4 py-3 text-sm text-[var(--muted)] transition hover:border-white/15 hover:text-white 2xl:flex"
            >
              <span className="inline-flex items-center gap-3">
                <Search className="size-4" />
                <span className="hidden xl:inline">Search all titles</span>
              </span>
              <kbd className="keyboard-only rounded-full border border-white/10 px-2 py-1 text-[11px]">/</kbd>
            </Link>

            <div className="hidden 2xl:block">
              <LiveClock />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/76 px-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl md:hidden">
          <nav className="flex w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/6 p-1">
            {nav.map((item) => (
              <NavButton key={item.href} item={item} pathname={pathname} showLabels={settings.showNavLabels} showIcons={settings.showNavIcons} />
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
