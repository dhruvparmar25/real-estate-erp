"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function FormPageLayout({ children, onEscape }) {
    const router = useRouter();
    useEffect(() => {
        if (onEscape === null)
            return;
        const handler = (e) => {
            if (e.key !== "Escape")
                return;
            const target = e.target;
            // Let native selects handle Esc first.
            if (target?.tagName === "SELECT")
                return;
            e.preventDefault();
            (onEscape ?? (() => router.back()))();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onEscape, router]);
    return <>{children}</>;
}
