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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[rgba(5,8,18,0.82)] backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between gap-3 py-3">
          <BrandBlock />

          <nav className="hidden items-center gap-2 xl:flex">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                item={item}
                pathname={pathname}
                showUpdateDot={item.href === "/settings" && showUpdateDot}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search?focus=1"
              className="hidden items-center justify-between gap-3 rounded-full border border-white/8 bg-white/5 px-4 py-3 text-sm text-[var(--muted)] transition hover:border-white/15 hover:text-white md:flex"
            >
              <span className="inline-flex items-center gap-3">
                <Search className="size-4" />
                <span className="hidden xl:inline">Search all titles</span>
              </span>
              <kbd className="keyboard-only rounded-full border border-white/10 px-2 py-1 text-[11px]">/</kbd>
            </Link>

            <LiveClock />
            {showUpdateDot && updateQuery.data?.latestVersion ? (
              <Link
                href="/settings"
                className="hidden items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2 text-xs text-white xl:inline-flex"
              >
                <ArrowUpCircle className="size-4 text-[var(--accent)]" />
                Update {updateQuery.data.latestVersion}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-[var(--muted)] transition hover:text-white xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-white/8 transition-all duration-300 xl:hidden",
            mobileOpen ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="page-shell space-y-3 py-4">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                item={item}
                pathname={pathname}
                showUpdateDot={item.href === "/settings" && showUpdateDot}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <div className="keyboard-only rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-[var(--muted)]">
              <p className="text-xs uppercase tracking-[0.28em]">Keyboard</p>
              <p className="mt-2">Press / to jump into search. Press Esc to close any open modal.</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
