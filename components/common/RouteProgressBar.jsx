"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
const FADE_OUT_MS = 250;
const MIN_VISIBLE_MS = 120;
function isInternalNavigationClick(e) {
    if (e.defaultPrevented)
        return false;
    if (e.button !== 0)
        return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return false;
    const anchor = e.target?.closest?.("a");
    if (!anchor)
        return false;
    if (anchor.hasAttribute("download"))
        return false;
    if (anchor.target && anchor.target !== "_self")
        return false;
    const href = anchor.getAttribute("href");
    if (!href)
        return false;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
        return false;
    if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin))
        return false;
    try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin)
            return false;
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
            return false;
        }
    }
    catch {
        return false;
    }
    return true;
}
export default function RouteProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [phase, setPhase] = useState("idle");
    const startedAtRef = useRef(null);
    const completeTimerRef = useRef(null);
    const fadeTimerRef = useRef(null);
    const clearTimers = useCallback(() => {
        if (completeTimerRef.current !== null) {
            window.clearTimeout(completeTimerRef.current);
            completeTimerRef.current = null;
        }
        if (fadeTimerRef.current !== null) {
            window.clearTimeout(fadeTimerRef.current);
            fadeTimerRef.current = null;
        }
    }, []);
    const start = useCallback(() => {
        clearTimers();
        startedAtRef.current = Date.now();
        setPhase("loading");
    }, [clearTimers]);
    const complete = useCallback(() => {
        const startedAt = startedAtRef.current;
        const elapsed = startedAt === null ? 0 : Date.now() - startedAt;
        const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
        clearTimers();
        completeTimerRef.current = window.setTimeout(() => {
            completeTimerRef.current = null;
            setPhase("completing");
            fadeTimerRef.current = window.setTimeout(() => {
                fadeTimerRef.current = null;
                setPhase("idle");
                startedAtRef.current = null;
            }, FADE_OUT_MS);
        }, wait);
    }, [clearTimers]);
    useEffect(() => {
        const onClick = (e) => {
            if (isInternalNavigationClick(e))
                start();
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [start]);
    useEffect(() => {
        if (startedAtRef.current !== null)
            complete();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);
    useEffect(() => clearTimers, [clearTimers]);
    if (phase === "idle")
        return null;
    return (<div role="progressbar" aria-busy aria-label="Loading next page" className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none overflow-hidden">
      <div className={cn("h-full origin-left bg-gradient-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primary) shadow-[0_0_8px_var(--color-primary)]", phase === "loading" ? "route-progress-loading" : "route-progress-complete")}/>
    </div>);
}
