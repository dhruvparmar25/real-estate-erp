import { cn } from "@/utils/cn";
export default function FormActions({ primary, secondary, hint, className, sticky = true }) {
    return (<div className={cn("bg-(--color-surface) border border-(--color-border) rounded-xl px-4 sm:px-5 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3", sticky && "sticky bottom-2 sm:bottom-4 shadow-lg backdrop-blur bg-(--color-surface)/90 z-40", className)}>
      {hint && (<p className="text-tiny text-(--color-text-secondary) hidden sm:block">{hint}</p>)}
      <div className="flex items-center justify-end gap-2 flex-shrink-0 w-full sm:w-auto [&>*]:flex-1 [&>*]:sm:flex-none">
        {secondary}
        {primary}
      </div>
    </div>);
}
