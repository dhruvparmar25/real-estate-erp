"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
/**
 * Wraps a form and wires a global Escape handler so the user can
 * cancel from anywhere on the page. The keyboard-shortcut pill itself
 * is rendered by `<PageHeader keyboardHint />` in the title row.
 */
export default function FormPageLayout({ children, onEscape }) {
    const router = useRouter();
    useEffect(() => {
        if (onEscape === null)
            return;
        const handler = (e) => {
            if (e.key !== "Escape")
                return;
            const target = e.target;
            // Native selects/datepickers use Esc to close their own popup.
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
