"use client";
import { Icon } from "@/components/common/Icon";
import SearchableSelect from "./SearchableSelect";
import { cn } from "@/utils/cn";
export default function Filters({ search, onSearchChange, searchPlaceholder = "Search…", hideSearch, selects = [], values = {}, onSelectChange, onReset, rightSlot, className, }) {
    const hasFilters = search || selects.some((s) => values[s.key] && values[s.key] !== "all");
    return (<div className={cn("flex flex-col md:flex-row md:items-center gap-2 md:gap-3 md:flex-wrap", className)}>
      {!hideSearch && (<div className="relative w-full md:flex-1 md:min-w-[220px] md:max-w-md">
          <Icon icon="mdi:magnify" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"/>
          <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="w-full h-10 pl-10 pr-3 rounded-lg border border-(--color-border) bg-(--color-surface) text-small focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary)"/>
        </div>)}

      {selects.length > 0 && (<div className="flex flex-wrap gap-2">
          {selects.map((s) => (<SearchableSelect key={s.key} label={s.label} options={s.options} value={values[s.key] ?? "all"} onChange={(v) => onSelectChange?.(s.key, v)} minWidth={160}/>))}
        </div>)}

      <div className="flex items-center justify-between gap-2 md:contents">
        {hasFilters && onReset && (<button onClick={onReset} className="h-10 px-3 inline-flex items-center gap-1 text-small text-(--color-text-secondary) hover:text-(--color-danger)">
            <Icon icon="mdi:filter-remove-outline" width={16}/>
            Reset
          </button>)}

        {rightSlot && (<div className="md:ml-auto flex items-center gap-2">{rightSlot}</div>)}
      </div>
    </div>);
}
