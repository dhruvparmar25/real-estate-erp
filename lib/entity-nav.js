"use client";
import { useMounted } from "@/hooks/use-mounted";
const NAV_ID_KEY = "re-erp:nav-entity-id";
export function stashNavId(id) {
    try {
        window.sessionStorage.setItem(NAV_ID_KEY, id);
    }
    catch {
        /* sessionStorage unavailable */
    }
}
export function readNavId() {
    try {
        return window.sessionStorage.getItem(NAV_ID_KEY);
    }
    catch {
        return null;
    }
}
export function useNavId() {
    const mounted = useMounted();
    const id = mounted ? readNavId() : null;
    return { id, ready: mounted };
}
