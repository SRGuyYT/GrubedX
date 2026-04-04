"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { dataLayer } from "@/lib/dataLayer";
import { useSettingsContext } from "@/context/SettingsContext";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";

export function AppBootstrap() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, settings } = useSettingsContext();
  const updateQuery = useUpdateStatus(ready);
  const announcedVersionRef = useRef<string | null>(null);

  const registerServiceWorker = useEffectEvent(async () => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (!settings.offlineCaching) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      return;
    }

    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });

  const applyUiUpdate = useEffectEvent(async () => {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update()));
    }

    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.filter((key) => key.startsWith("grubx-")).map((key) => caches.delete(key)));
    }

    window.location.reload();
  });

  useEffect(() => {
    if (!ready) {
      return;
    }

    void registerServiceWorker();
  }, [ready, registerServiceWorker, settings.offlineCaching]);

  useEffect(() => {
    if (!ready || !settings.prefetchRoutes) {
      return;
    }

    ["/", "/movies", "/tv", "/live", "/search", "/settings"].forEach((href) => router.prefetch(href));
  }, [ready, router, settings.prefetchRoutes]);

  useEffect(() => {
    if (!ready || !settings.autoFocusSearch) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        if (pathname !== "/search") {
          router.push("/search?focus=1");
          return;
        }

        window.dispatchEvent(new Event("grubx:focus-search"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, ready, router, settings.autoFocusSearch]);

  useEffect(() => {
    if (!ready || !updateQuery.data) {
      return;
    }

    const updaterState = updateQuery.data;
    const checkedAt = updaterState.checkedAt ? new Date(updaterState.checkedAt).getTime() : 0;
    const isStale = !checkedAt || Date.now() - checkedAt > 7 * 24 * 60 * 60 * 1000;

    if (
      updaterState.hasUpdate &&
      updaterState.latestVersion &&
      updaterState.dismissedVersion !== updaterState.latestVersion &&
      announcedVersionRef.current !== updaterState.latestVersion
    ) {
      announcedVersionRef.current = updaterState.latestVersion;

      toast.custom((toastId) => (
        <div className="liquid-glass flex max-w-[440px] flex-col gap-3 rounded-[1.5rem] p-4 text-sm text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Updater</p>
            <p className="mt-2 text-base font-semibold">
              Update available: {updaterState.currentVersion} to {updaterState.latestVersion}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
                void applyUiUpdate();
              }}
              className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-black transition hover:brightness-110"
            >
              Update now
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
                void dataLayer.saveUpdaterState({ dismissedVersion: updaterState.latestVersion });
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-[var(--muted)] transition hover:text-white"
            >
              Dismiss
            </button>
            {updaterState.compareUrl ? (
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(toastId);
                  window.open(updaterState.compareUrl ?? updaterState.repoUrl, "_blank", "noopener,noreferrer");
                }}
                className="rounded-full border border-white/10 px-4 py-2 text-[var(--muted)] transition hover:text-white"
              >
                View changes
              </button>
            ) : null}
          </div>
        </div>
      ));
      return;
    }

    if (isStale && announcedVersionRef.current !== "stale-warning") {
      announcedVersionRef.current = "stale-warning";
      toast.message("Your version may be out of date.", {
        description: "GrubX has not checked for updates in at least 7 days.",
        duration: 6000,
      });
    }
  }, [applyUiUpdate, ready, updateQuery.data]);

  return null;
}
