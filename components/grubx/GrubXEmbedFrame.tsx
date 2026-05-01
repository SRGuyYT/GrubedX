import { notFound } from "next/navigation";

import { GrubXEmbedClientFrame } from "@/components/grubx/GrubXEmbedClientFrame";
import { parsePlaybackOptions } from "@/lib/grubx/params";
import { assertGrubXProvider, resolveGrubXProviderUrl } from "@/lib/grubx/providers";
import type { GrubXMediaType } from "@/types/grubx";

const readParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export function GrubXEmbedFrame({
  provider,
  type,
  id,
  season,
  episode,
  searchParams,
}: {
  provider: string;
  type: GrubXMediaType;
  id: string;
  season?: number;
  episode?: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  try {
    const selectedProvider = assertGrubXProvider(provider);
    const source = resolveGrubXProviderUrl(
      selectedProvider.id,
      type,
      id,
      season,
      episode,
      parsePlaybackOptions(searchParams),
    );
    const strictSandbox = readParam(searchParams.strictSandbox) === "true";

    return (
      <GrubXEmbedClientFrame
        source={source}
        title={`${selectedProvider.name} ${type} embed`}
        strictSandbox={strictSandbox}
      />
    );
  } catch {
    notFound();
  }
}
