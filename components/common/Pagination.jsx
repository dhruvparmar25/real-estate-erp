"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
/** Sentinel value passed when the user picks "All" rows per page. */
export const PAGE_SIZE_ALL = 9999;
const DEFAULT_PAGE_SIZES = [10, 20, 50, 100, PAGE_SIZE_ALL];
const NAV_BTN = "w-9 h-9 inline-flex items-center justify-center rounded-full " +
    "border border-(--color-border) bg-(--color-surface) " +
    "text-(--color-text-secondary) hover:text-(--color-primary) " +
    "hover:border-(--color-primary)/30 hover:bg-(--color-primary)/[0.06] " +
    "disabled:opacity-40 disabled:hover:bg-(--color-surface) disabled:hover:text-(--color-text-secondary) " +
    "disabled:hover:border-(--color-border) disabled:cursor-not-allowed " +
    "transition-colors";
export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange, pageSizeOptions = DEFAULT_PAGE_SIZES, }) {
    if (total <= 0)
        return null;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, total);
    const visible = buildPageList(page, totalPages);
    const showNav = totalPages > 1;
    return (<div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-between gap-3">
      {/* Left: range summary */}
      <p className="text-tiny text-(--color-text-secondary) text-center md:text-left order-2 md:order-1 md:flex-1 md:min-w-[160px]">
        Showing{" "}
        <span className="font-semibold text-(--color-text-primary)">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-(--color-text-primary)">{total}</span>
      </p>

      {/* Center: page navigation */}
      <div className="flex items-center justify-center gap-1 order-1 md:order-2 flex-shrink-0">
        {showNav ? (<>
            <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={NAV_BTN} aria-label="Previous page">
              <Icon icon="mdi:chevron-left" width={18}/>
            </button>

            {visible.map((entry, idx) => entry === "…" ? (<span key={`gap-${idx}`} aria-hidden className="w-7 text-center text-tiny text-(--color-text-tertiary) select-none">
                  …
                </span>) : (<button key={entry} type="button" onClick={() => onPageChange(entry)} aria-current={entry === page ? "page" : undefined} className={cn("min-w-9 h-9 px-2.5 rounded-full text-tiny font-semibold transition-colors", entry === page
                    ? "bg-(--color-primary) text-(--color-primary-fg) shadow-sm shadow-(--color-primary)/25"
                    : "border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) hover:bg-(--color-primary)/[0.06] hover:border-(--color-primary)/30 hover:text-(--color-primary)")}>
                  {entry}
                </button>))}

            <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={NAV_BTN} aria-label="Next page">
              <Icon icon="mdi:chevron-right" width={18}/>
            </button>
          </>) : (<span className="text-tiny text-(--color-text-tertiary)">Page 1 of 1</span>)}
      </div>

      {/* Right: rows-per-page */}
      {onPageSizeChange ? (<div className="flex items-center justify-center md:justify-end gap-2 order-3 flex-shrink-0 md:flex-1 md:min-w-[160px]">
          <label htmlFor="page-size" className="text-tiny text-(--color-text-secondary) whitespace-nowrap">
            Rows per page
          </label>
          <select id="page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="h-9 pl-2.5 pr-7 rounded-lg border border-(--color-border) bg-(--color-surface) text-tiny font-medium text-(--color-text-primary) hover:border-(--color-primary)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-colors">
            {pageSizeOptions.map((s) => (<option key={s} value={s}>
                {s >= PAGE_SIZE_ALL ? "All" : s}
              </option>))}
          </select>
        </div>) : (<div className="hidden md:block md:flex-1 md:min-w-[160px] order-3" aria-hidden/>)}
    </div>);
}
/**
 * Build the visible page-number list with ellipsis markers.
 * Always shows: first, last, current ± 1.
 *   page=1,  total=10  → [1, 2, 3, "…", 10]
 *   page=5,  total=10  → [1, "…", 4, 5, 6, "…", 10]
 *   page=10, total=10  → [1, "…", 8, 9, 10]
 */
function buildPageList(page, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const out = [];
    const push = (n) => {
        if (out[out.length - 1] !== n)
            out.push(n);
    };
    push(1);
    if (page > 3)
        push("…");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
        push(p);
    }
    if (page < totalPages - 2)
        push("…");
    push(totalPages);
    return out;
}
