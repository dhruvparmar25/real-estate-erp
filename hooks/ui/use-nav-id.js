"use client";

import { useMounted } from "@/hooks/use-mounted";
import { readNavId } from "@/utils/entity-nav";

export function useNavId() {
  const mounted = useMounted();
  const id = mounted ? readNavId() : null;
  return { id, ready: mounted };
}
