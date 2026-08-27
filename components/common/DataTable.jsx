"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
export default function DataTable({ columns, rows, loading, emptyTitle = "Nothing to show", emptyDescription, emptyIcon, emptyAction, rowKey, onRowClick, rowClassName, toolbar, footer, selection, }) {
    const hasRows = rows.length > 0 && !loading;
    const totalCols = columns.length + (selection ? 1 : 0);
    return (<section className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-clip">
      {toolbar && (<div className="px-4 md:px-5 py-3 border-b border-(--color-border) bg-(--color-surface)">
          {toolbar}
        </div>)}

      {loading ? (<div className="p-4 flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (<LoadingSkeleton key={i} className="h-9"/>))}
        </div>) : !hasRows ? (<EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction}/>) : (<div className="overflow-x-auto pb-6">
          <table className="w-full text-small border-collapse" aria-colcount={totalCols}>
            <thead className="bg-(--color-bg) border-b-2 border-(--color-border-strong)">
              <tr>
                {selection && (<th scope="col" style={{ width: "3rem" }} className="px-4 py-3.5 align-middle">
                    <HeaderCheckbox selection={selection}/>
                  </th>)}
                {columns.map((c) => (<th key={c.key} scope="col" style={{
                    width: c.width,
                    minWidth: c.minWidth ?? (c.wrap ? "12rem" : undefined),
                }} className={cn("px-4 py-3.5 text-[11px] uppercase tracking-[0.08em] font-semibold text-(--color-text-primary)/80 text-left whitespace-nowrap", c.align === "right" && "text-right", c.align === "center" && "text-center", c.headerClassName)}>
                    {c.header}
                  </th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = rowKey(row);
                const isSelected = selection?.has(id) ?? false;
                return (<tr key={id} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cn("border-b border-(--color-border) last:border-b-0 transition-colors", isSelected
                        ? "bg-(--color-primary)/[0.12] hover:bg-(--color-primary)/[0.15] shadow-[inset_3px_0_0_var(--color-primary)]"
                        : "hover:bg-(--color-bg)/60", onRowClick && "cursor-pointer", rowClassName?.(row))}>
                    {selection && (<td className="px-4 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                        <RowCheckbox checked={isSelected} onChange={() => selection.onToggle(id)} label={`Select row ${id}`} disabled={selection.isRowEligible?.(id) === false} disabledTitle={selection.ineligibleTitle}/>
                      </td>)}
                    {columns.map((c) => {
                        const content = c.render
                            ? c.render(row)
                            : row[c.key];
                        return (<td key={c.key} style={{
                                width: c.width,
                                minWidth: c.minWidth ?? (c.wrap ? "12rem" : undefined),
                            }} className={cn("px-4 py-3 align-middle text-(--color-text-primary)", c.wrap ? "whitespace-normal break-words" : "whitespace-nowrap", c.truncate && "max-w-0 truncate", c.align === "right" && "text-right", c.align === "center" && "text-center", c.className)} title={c.truncate && typeof content === "string" ? content : undefined}>
                          {content}
                        </td>);
                    })}
                  </tr>);
            })}
            </tbody>
          </table>
        </div>)}

      {footer && hasRows && (<div className={cn("sticky bottom-0 z-10 border-t border-(--color-border)", "bg-(--color-surface)/90 backdrop-blur", "px-4 md:px-5 py-2")}>
          {footer}
        </div>)}
    </section>);
}
function HeaderCheckbox({ selection }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current)
            ref.current.indeterminate = selection.someOnPage;
    }, [selection.someOnPage]);
    return (<input ref={ref} type="checkbox" aria-label="Select all rows on this page" checked={selection.allOnPage} onChange={selection.onToggleAll} className="w-4 h-4 accent-(--color-primary) cursor-pointer"/>);
}
function RowCheckbox({ checked, onChange, label, disabled, disabledTitle, }) {
    return (<input type="checkbox" aria-label={label} checked={checked} onChange={onChange} disabled={disabled} title={disabled ? disabledTitle : undefined} suppressHydrationWarning className={cn("w-4 h-4 accent-(--color-primary)", disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer")}/>);
}
