"use client";
import PageHeader from "./PageHeader";
import FilterToolbar from "./FilterToolbar";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import SelectionBar from "./SelectionBar";
import SearchInput from "./SearchInput";
import { cn } from "@/utils/cn";
export default function ListPageShell({ title, description, breadcrumbs, actions, search, onSearchChange, searchPlaceholder, selects, selectValues, onSelectChange, onResetFilters, filterRightSlot, selectionCount = 0, onClearSelection, bulkActions, selection, statsBar, columns, rows, loading, emptyTitle, emptyIcon, emptyDescription, emptyAction, page, totalPages, total, pageSize, onPageChange, onPageSizeChange, pageSizeOptions, }) {
    const isSelected = selectionCount > 0;
    const handleClearAll = () => {
        onClearSelection?.();
        onResetFilters?.();
        onSearchChange("");
    };
    const hasActiveFilters = selects?.some((s) => (selectValues?.[s.key] ?? "all") !== "all") ?? false;
    const hasAnythingToClear = isSelected || hasActiveFilters || search.length > 0;
    return (<div className="flex flex-col gap-3">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} actions={actions}/>

      <FilterToolbar selects={selects} selectValues={selectValues} onSelectChange={onSelectChange} filterRightSlot={filterRightSlot} bulkActions={bulkActions != null ? (<SelectionBar count={selectionCount} onClear={handleClearAll} clearDisabled={!hasAnythingToClear}>
              {bulkActions}
            </SelectionBar>) : null}/>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {statsBar ? statsBar : (<p className={cn("text-tiny whitespace-nowrap", isSelected
                ? "font-semibold text-(--color-primary)"
                : "text-(--color-text-tertiary) hidden sm:block")}>
            {isSelected ? `${selectionCount} selected` : " "}
          </p>)}
        <div className="flex-shrink-0 ml-auto">
          <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder}/>
        </div>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} rowKey={(r) => r.id} emptyTitle={emptyTitle} emptyDescription={emptyDescription} emptyIcon={emptyIcon} emptyAction={emptyAction} selection={selection} footer={<Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} pageSizeOptions={pageSizeOptions}/>}/>
    </div>);
}
