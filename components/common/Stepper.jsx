"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
export default function Stepper({ steps, active, completed, completionStatus, onJump, allowAllJumps, className }) {
    return (<nav className={cn("bg-(--color-surface) border border-(--color-border) rounded-xl px-3 py-3 overflow-x-auto", className)}>
      <ol className="flex items-center gap-1 min-w-max">
        {steps.map((step, idx) => {
            const isActive = idx === active;
            const isActuallyComplete = completionStatus ? (completionStatus[idx] ?? false) : idx < completed;
            const isClickable = !!onJump && (allowAllJumps || isActuallyComplete || idx <= completed);
            return (<li key={step.key} className="flex items-center gap-1">
              <button type="button" onClick={isClickable ? () => onJump(idx) : undefined} disabled={!isClickable} className={cn("flex items-center gap-2 px-3 h-9 rounded-lg text-tiny font-medium transition whitespace-nowrap", isActive
                    ? "bg-(--color-primary) text-(--color-primary-fg) shadow-sm"
                    : isActuallyComplete
                        ? "text-(--color-success) hover:bg-(--color-bg) cursor-pointer"
                        : isClickable
                            ? "text-(--color-text-secondary) hover:bg-(--color-bg) cursor-pointer"
                            : "text-(--color-text-secondary) cursor-not-allowed")}>
                <span className={cn("w-5 h-5 rounded-full inline-flex items-center justify-center text-tiny font-semibold", isActive
                    ? "bg-(--color-primary-fg)/20 text-(--color-primary-fg)"
                    : isActuallyComplete
                        ? "bg-(--color-success)/15 text-(--color-success)"
                        : "bg-(--color-border) text-(--color-text-secondary)")}>
                  {isActuallyComplete ? <Icon icon="mdi:check" width={12}/> : idx + 1}
                </span>
                <span>{step.label}</span>
              </button>
              {idx < steps.length - 1 && (<span className="w-3 h-px bg-(--color-border) flex-shrink-0"/>)}
            </li>);
        })}
      </ol>
    </nav>);
}
