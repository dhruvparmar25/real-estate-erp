"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
export default function ActiveFilterChips({ selects, values, onClear, onClearAll, className, }) {
    const active = selects
        .map((s) => {
        const v = values[s.key];
        if (!v || v === "all")
            return null;
        const option = s.options.find((o) => o.value === v);
        return option ? { key: s.key, label: s.label, value: option.label } : null;
    })
        .filter((x) => x !== null);
    if (active.length === 0)
        return null;
    return (<div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      <span className="text-tiny text-(--color-text-secondary) mr-1">Filters:</span>
      {active.map((chip) => (<span key={chip.key} className="inline-flex items-center gap-1 pl-2 pr-1 h-6 rounded-full bg-(--color-primary)/10 text-(--color-primary) text-tiny font-medium">
          <span className="text-(--color-primary)/70">{chip.label}:</span>
          <span>{chip.value}</span>
          <button type="button" onClick={() => onClear(chip.key)} aria-label={`Clear ${chip.label} filter`} className="ml-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-(--color-primary)/20 transition-colors">
            <Icon icon="mdi:close" width={10}/>
          </button>
        </span>))}
      {onClearAll && active.length > 1 && (<button type="button" onClick={onClearAll} className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-tiny font-medium text-(--color-text-secondary) hover:text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
          <Icon icon="mdi:filter-remove-outline" width={12}/>
          Clear all
        </button>)}
    </div>);
}
