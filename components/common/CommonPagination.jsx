"use client";
import { useEffect } from "react";
import { Icon } from "@/components/common/Icon";
function getPageNumbers(current, total) {
    if (total <= 5)
        return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total]);
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1)
            result.push("...");
        result.push(sorted[i]);
    }
    return result;
}
export default function CommonPagination({ page, setPage, total, limit, setLimit, label = "Records", }) {
    const STANDARD_SIZES = [8, 10, 20, 50, 100];
    useEffect(() => {
        if (!STANDARD_SIZES.includes(limit) && limit !== total && total > 0) {
            setLimit(total);
        }
    }, [total, limit, setLimit]);
    const totalPages = Math.ceil(total / limit) || 0;
    const start = total > 0 ? (page - 1) * limit + 1 : 0;
    const end = Math.min(page * limit, total);
    const pages = getPageNumbers(page, totalPages);
    return (<div className="flex bg-(--color-surface) flex-col md:flex-row items-center justify-between gap-4 border border-(--color-border) px-4 py-2 mt-4 rounded-lg">
      <div className="text-sm text-(--color-text-secondary)">
        {start}-{end} of {total} {label}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setPage(1)} disabled={page === 1} className="p-1.5 border border-(--color-border) rounded-md disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-(--color-bg)">
          <Icon icon="mdi:chevron-double-left" width={18}/>
        </button>

        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-1.5 border border-(--color-border) rounded-md disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-(--color-bg)">
          <Icon icon="mdi:chevron-left" width={18}/>
        </button>

        {pages.map((p, i) => p === "..." ? (<span key={`dots-${i}`} className="px-1.5 text-sm text-(--color-text-secondary) select-none">...</span>) : (<button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md text-sm cursor-pointer ${page === p
                ? "bg-(--color-primary) text-white"
                : "border border-(--color-border) hover:bg-(--color-bg)"}`}>
              {p}
            </button>))}

        <button onClick={() => setPage(page + 1)} disabled={page === totalPages || totalPages === 0} className="p-1.5 border border-(--color-border) rounded-md disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-(--color-bg)">
          <Icon icon="mdi:chevron-right" width={18}/>
        </button>

        <button onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0} className="p-1.5 border border-(--color-border) rounded-md disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-(--color-bg)">
          <Icon icon="mdi:chevron-double-right" width={18}/>
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <select value={limit} onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
        }} className="border border-(--color-border) bg-(--color-surface) rounded-md px-2 py-1 cursor-pointer outline-none">
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          {total > 0 && <option value={total}>All</option>}
        </select>
        <span className="text-(--color-text-secondary)">per Page</span>
      </div>
    </div>);
}
