"use client";
import { useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
};
export default function Modal({ open, onClose, title, description, size = "md", children, footer }) {
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => { if (e.key === "Escape")
            onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0" style={{ background: "var(--color-overlay)" }} onClick={onClose}/>
      <div className={cn("relative bg-(--color-surface) shadow-xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-(--color-border)", "rounded-t-2xl sm:rounded-xl", sizes[size])}>
        <div className="flex items-start justify-between gap-4 px-4 sm:px-5 py-4 border-b border-(--color-border)">
          <div className="min-w-0 flex-1">
            {title && <h2 className="card-title truncate">{title}</h2>}
            {description && <p className="text-tiny text-(--color-text-secondary) mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="text-(--color-text-secondary) hover:text-(--color-text-primary) flex-shrink-0" aria-label="Close">
            <Icon icon="mdi:close" width={20}/>
          </button>
        </div>
        <div className="px-4 sm:px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (<div className="px-4 sm:px-5 py-3 border-t border-(--color-border) flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 [&>*]:flex-1 [&>*]:sm:flex-none">
            {footer}
          </div>)}
      </div>
    </div>);
}
