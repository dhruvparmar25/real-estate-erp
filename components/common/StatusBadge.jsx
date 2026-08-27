import { cn } from "@/utils/cn";
const tones = {
    success: "bg-(--color-success-soft) text-(--color-success) border-(--color-success)/30",
    warning: "bg-(--color-warning-soft) text-(--color-warning) border-(--color-warning)/30",
    danger: "bg-(--color-danger-soft) text-(--color-danger) border-(--color-danger)/30",
    info: "bg-(--color-info-soft) text-(--color-info) border-(--color-info)/30",
    neutral: "bg-(--color-bg) text-(--color-text-secondary) border-(--color-border)",
};
export default function StatusBadge({ tone = "neutral", children, className }) {
    return (<span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-tiny font-medium capitalize", tones[tone], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"/>
      {children}
    </span>);
}
