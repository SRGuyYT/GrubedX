"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpCircle,
  Clapperboard,
  Home,
  Menu,
  MonitorPlay,
  Search,
  Settings2,
  Tv,
  X,
} from "lucide-react";

import { LiveClock } from "@/components/shell/LiveClock";
import { cn } from "@/lib/cn";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Clapperboard },
  { href: "/tv", label: "TV", icon: Tv },
  { href: "/live", label: "Live TV", icon: MonitorPlay },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const isActivePath = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function NavButton({
  item,
  pathname,
  compact = false,
  showUpdateDot = false,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  compact?: boolean;
  showUpdateDot?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-[1.25rem] border transition",
        compact ? "justify-center px-3 py-3.5" : "px-4 py-3.5",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white shadow-[0_10px_30px_rgba(255,106,61,0.14)]"
          : "border-white/8 bg-white/5 text-[var(--muted)] hover:border-white/15 hover:bg-white/8 hover:text-white active:scale-[0.98]",
      )}
    >
      <Icon className={cn("size-5 shrink-0", active ? "text-[var(--accent)]" : "text-current")} />
      {!compact ? <span className="font-medium">{item.label}</span> : null}
      {showUpdateDot ? (
        <span className="absolute right-3 top-3 inline-flex size-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_rgba(255,106,61,0.45)]" />
      ) : null}
    </Link>
  );
}

function BrandBlock({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center rounded-[1.5rem] border border-white/10 bg-white/5 transition hover:border-white/15 hover:bg-white/7",
        compact ? "justify-center p-3" : "gap-3 px-4 py-4",
      )}
    >
      <div className="relative size-11 overflow-hidden rounded-[1rem] border border-white/10 bg-black/40 shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
        <Image src="/64x64.png" alt="GrubX" fill sizes="44px" className="object-cover" priority />
      </div>
      {!compact ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">Streaming Shell</p>
          <p className="mt-1 text-lg font-semibold text-white">GrubX</p>
        </div>
      ) : null}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const updateQuery = useUpdateStatus(true);

  const showUpdateDot = useMemo(
    () =>
      Boolean(
        updateQuery.data?.hasUpdate &&
          updateQuery.data.dismissedVersion !== updateQuery.data.latestVersion &&
          updateQuery.data.latestVersion,
      ),
    [updateQuery.data],
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[rgba(5,8,18,0.82)] backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <BrandBlock />
          <div className="flex items-center gap-2">
            <LiveClock compact />
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-[var(--muted)] transition hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-white/8 transition-all duration-300",
            mobileOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="space-y-3 px-4 py-4">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                item={item}
                pathname={pathname}
                showUpdateDot={item.href === "/settings" && showUpdateDot}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <div className="rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-[var(--muted)]">
              <p className="text-xs uppercase tracking-[0.28em]">Keyboard</p>
              <p className="mt-2">Press / to jump into search. Press Esc to close any open modal.</p>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-24 border-r border-white/8 bg-[rgba(5,8,18,0.72)] px-3 py-5 backdrop-blur-xl md:flex xl:hidden">
        <div className="flex w-full flex-col items-center gap-4">
          <BrandBlock compact />
          <LiveClock compact />
          <nav className="mt-4 flex w-full flex-col gap-3">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                item={item}
                pathname={pathname}
                compact
                showUpdateDot={item.href === "/settings" && showUpdateDot}
              />
            ))}
          </nav>
        </div>
      </aside>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/8 bg-[rgba(5,8,18,0.74)] px-5 py-6 backdrop-blur-xl xl:flex">
        <div className="flex w-full flex-col gap-5">
          <BrandBlock />
          <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Realtime</p>
              <p className="mt-1 text-sm font-medium text-white">Local-first streaming shell</p>
            </div>
            <LiveClock />
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                item={item}
                pathname={pathname}
                showUpdateDot={item.href === "/settings" && showUpdateDot}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Link
              href="/search?focus=1"
              className="flex items-center justify-between rounded-[1.35rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-[var(--muted)] transition hover:border-white/15 hover:text-white"
            >
              <span className="inline-flex items-center gap-3">
                <Search className="size-4" />
                Search all titles
              </span>
              <kbd className="rounded-full border border-white/10 px-2 py-1 text-[11px]">/</kbd>
            </Link>

            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between gap-3">
                <span>App version</span>
                <span className="font-semibold text-white">{updateQuery.data?.currentVersion ?? "4.0.0"}</span>
              </div>
              {showUpdateDot && updateQuery.data?.latestVersion ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2 text-xs text-white">
                  <ArrowUpCircle className="size-4 text-[var(--accent)]" />
                  Update {updateQuery.data.latestVersion} ready
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-[rgba(5,8,18,0.9)] px-2 py-2 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-[1.1rem] px-2 py-2 text-[11px] font-medium transition",
                  active ? "bg-[var(--accent-soft)] text-white" : "text-[var(--muted)]",
                )}
              >
                <Icon className={cn("size-4", active ? "text-[var(--accent)]" : "text-current")} />
                <span>{item.label}</span>
                {item.href === "/settings" && showUpdateDot ? (
                  <span className="absolute right-3 top-2 inline-flex size-2 rounded-full bg-[var(--accent)]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
