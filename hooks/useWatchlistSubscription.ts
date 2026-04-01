"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useSettingsContext } from "@/context/SettingsContext";
import { queryKeys } from "@/lib/queryKeys";
import { dataLayer } from "@/lib/dataLayer";
import type { WatchlistItem } from "@/types/data-layer";

export const useWatchlistSubscription = () => {
  const queryClient = useQueryClient();
  const { ready, mode, scope } = useSettingsContext();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const queryKey = queryKeys.watchlist(mode, scope.mode === "account" ? scope.uid : null);

  useEffect(() => {
    if (!ready) {
      setIsBootstrapping(true);
      return;
    }

    setIsBootstrapping(true);
    return dataLayer.subscribeWatchlist(
      scope,
      (items) => {
        queryClient.setQueryData(queryKey, items);
        setIsBootstrapping(false);
      },
      () => {
        queryClient.setQueryData(queryKey, []);
        setIsBootstrapping(false);
      },
    );
  }, [queryClient, queryKey, ready, scope]);

  const query = useQuery<WatchlistItem[]>({
    queryKey,
    queryFn: async () => (queryClient.getQueryData<WatchlistItem[]>(queryKey) ?? []),
    enabled: ready,
    initialData: [],
    staleTime: Number.POSITIVE_INFINITY,
  });

  return {
    ...query,
    isBootstrapping,
  };
};
