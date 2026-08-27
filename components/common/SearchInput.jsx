"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
/** Compact search box used above list tables. */
export default function SearchInput({ value, onChange, placeholder = "Search…", className, autoFocus, }) {
    return (<div className={cn("relative w-full md:w-60 lg:w-82", className)}>
      <Icon icon="mdi:magnify" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"/>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} className="w-full h-9 pl-9  rounded-lg border border-(--color-border) bg-(--color-surface) text-small placeholder:text-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition" suppressHydrationWarning/>
      {value && (<button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md inline-flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg) transition-colors">
          <Icon icon="mdi:close" width={14}/>
        </button>)}
    </div>);
}
