"use client";
import dynamic from "next/dynamic";
import { DEFAULT_MAP_HEIGHT } from "@/constants/map.constants";
import { cn } from "@/utils/cn";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
function MapSkeleton({ height = DEFAULT_MAP_HEIGHT, className, }) {
    return (<div className={cn("w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface)", className)} style={{ height }}>
      <LoadingSkeleton className="h-full w-full rounded-none"/>
    </div>);
}
/** Prefer this over MapView — keeps the Google Maps SDK out of the main bundle. */
export const MapViewLazy = dynamic(() => import("@/components/common/MapView").then((mod) => mod.MapView), {
    ssr: false,
    loading: () => <MapSkeleton />,
});
