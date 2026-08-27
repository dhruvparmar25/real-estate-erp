"use client";
import SearchableSelect from "./SearchableSelect";
import { cn } from "@/utils/cn";
export default function FilterToolbar({ selects, selectValues, onSelectChange, filterRightSlot, bulkActions, className, }) {
    const hasFilters = (selects && selects.length > 0) || Boolean(filterRightSlot);
    if (!hasFilters && !bulkActions)
        return null;
    return (<div className={cn("rounded-xl border border-(--color-border) bg-(--color-surface)", "px-3 sm:px-4 py-3", "flex items-center gap-2 flex-wrap", className)}>
      {selects?.map((s) => (<SearchableSelect key={s.key} label={s.label} options={s.options} value={selectValues?.[s.key] ?? "all"} onChange={(v) => onSelectChange?.(s.key, v)}/>))}

      {filterRightSlot}

      {bulkActions && (<>
          {bulkActions}
        </>)}
    </div>);
}
