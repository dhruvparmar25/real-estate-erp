"use client";
import { cn } from "@/utils/cn";
export default function PageLoader({ label = "Loading…", fullscreen = false, className }) {
    return (<div role="status" aria-live="polite" aria-busy className={cn("flex flex-col items-center justify-center gap-3 text-(--color-text-secondary)", fullscreen ? "fixed inset-0 z-50 bg-(--color-bg)/85 backdrop-blur-sm" : "py-12", className)}>
      <Spinner size={32}/>
      {label ? <p className="text-tiny font-medium">{label}</p> : null}
    </div>);
}
export function Spinner({ size = 20, className }) {
    return (<span aria-hidden className={cn("inline-block app-spinner", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3"/>
        <path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </span>);
}
