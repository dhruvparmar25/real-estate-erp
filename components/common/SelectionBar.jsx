"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
export default function SelectionBar({ count, onClear, clearDisabled, children, className, }) {
    const isDisabled = clearDisabled ?? count <= 0;
    return (<>
      {children}
      <button type="button" onClick={onClear} disabled={isDisabled} title="Clear selection, filters and search" className={cn("inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-tiny font-semibold transition-colors", isDisabled
            ? "text-(--color-text-tertiary) border border-dashed border-(--color-border) bg-transparent cursor-not-allowed opacity-70"
            : "text-(--color-danger) border border-(--color-danger)/40 bg-(--color-danger)/[0.06] hover:bg-(--color-danger)/12 hover:border-(--color-danger)/60 shadow-sm shadow-(--color-danger)/10", className)}>
        <Icon icon="mdi:close" width={14}/>
        Clear all
      </button>
    </>);
}
const TONE_ACTIVE = {
    primary: "text-(--color-primary) border-(--color-primary)/40 bg-(--color-primary)/[0.06] hover:bg-(--color-primary)/12 hover:border-(--color-primary)/60 shadow-sm shadow-(--color-primary)/10",
    success: "text-(--color-success) border-(--color-success)/40 bg-(--color-success)/[0.06] hover:bg-(--color-success)/12 hover:border-(--color-success)/60 shadow-sm shadow-(--color-success)/10",
    warning: "text-(--color-warning) border-(--color-warning)/40 bg-(--color-warning)/[0.06] hover:bg-(--color-warning)/12 hover:border-(--color-warning)/60 shadow-sm shadow-(--color-warning)/10",
    danger: "text-(--color-danger) border-(--color-danger)/40 bg-(--color-danger)/[0.06] hover:bg-(--color-danger)/12 hover:border-(--color-danger)/60 shadow-sm shadow-(--color-danger)/10",
};
const TONE_DISABLED = "text-(--color-text-tertiary) border-dashed border-(--color-border) bg-transparent cursor-not-allowed opacity-70";
export function BulkActionButton({ icon, label, onClick, tone = "primary", disabled, }) {
    return (<button type="button" onClick={onClick} disabled={disabled} className={cn("inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-tiny font-semibold transition-colors border", disabled ? TONE_DISABLED : TONE_ACTIVE[tone])}>
      <Icon icon={icon} width={14}/>
      {label}
    </button>);
}
