"use client";
import { useState, useMemo, useRef } from "react";
import Button from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import SearchInput from "@/components/common/SearchInput";
export default function DualListSelector({ allItems, selectedIds, onChange, leftTitle = "Available Items", rightTitle = "Selected Items", searchPlaceholder = "Search items...", height = "400px", }) {
    const [leftSearch, setLeftSearch] = useState("");
    const [leftSelection, setLeftSelection] = useState(new Set());
    const [rightSelection, setRightSelection] = useState(new Set());
    const dragRef = useRef(null);
    const [dragOverPanel, setDragOverPanel] = useState(null);
    const availableItems = useMemo(() => allItems.filter((item) => !selectedIds.includes(item.id)), [allItems, selectedIds]);
    const selectedItemsObj = useMemo(() => selectedIds.map((id) => allItems.find((item) => item.id === id)).filter(Boolean), [allItems, selectedIds]);
    const filteredAvailableItems = useMemo(() => {
        if (!leftSearch)
            return availableItems;
        const lower = leftSearch.toLowerCase();
        return availableItems.filter((item) => item.label.toLowerCase().includes(lower));
    }, [availableItems, leftSearch]);
    function moveOneRight(id) {
        if (!selectedIds.includes(id)) {
            onChange([...selectedIds, id]);
        }
        setLeftSelection((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
    function moveOneLeft(id) {
        onChange(selectedIds.filter((x) => x !== id));
        setRightSelection((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
    function handleMoveRight() {
        if (leftSelection.size === 0)
            return;
        onChange([...selectedIds, ...Array.from(leftSelection).filter((id) => !selectedIds.includes(id))]);
        setLeftSelection(new Set());
    }
    function handleMoveLeft() {
        if (rightSelection.size === 0)
            return;
        onChange(selectedIds.filter((id) => !rightSelection.has(id)));
        setRightSelection(new Set());
    }
    function toggleLeft(id) {
        const next = new Set(leftSelection);
        if (next.has(id))
            next.delete(id);
        else
            next.add(id);
        setLeftSelection(next);
    }
    function toggleRight(id) {
        const next = new Set(rightSelection);
        if (next.has(id))
            next.delete(id);
        else
            next.add(id);
        setRightSelection(next);
    }
    return (<div className="flex flex-col md:flex-row gap-4 items-stretch md:h-[var(--desktop-height)]" style={{ "--desktop-height": height }}>
      {/* Left Panel */}
      <div className="flex-1 flex flex-col border border-(--color-border) rounded-xl overflow-hidden bg-(--color-surface) h-[350px] md:h-auto">
        <div className="p-3 border-b border-(--color-border) bg-(--color-bg)">
          <p className="font-semibold text-small mb-2 flex items-center justify-between">
            <span>{leftTitle}</span>
            <span className="text-tiny text-(--color-text-secondary) font-normal px-2 py-0.5 rounded-full bg-(--color-border)/30">
              {availableItems.length} available
            </span>
          </p>
          <SearchInput value={leftSearch} onChange={setLeftSearch} placeholder={searchPlaceholder}/>
          <p className="text-[10px] text-(--color-text-tertiary) mt-1.5">
            Drag or double-click to add <span className="hidden md:inline">→</span><span className="inline md:hidden">↓</span>
          </p>
        </div>
        <div className={`flex-1 overflow-y-auto p-2 transition-colors ${dragOverPanel === "left" ? "bg-(--color-danger)/5" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragOverPanel("left"); }} onDragLeave={() => setDragOverPanel(null)} onDrop={(e) => {
            e.preventDefault();
            setDragOverPanel(null);
            if (dragRef.current?.from === "right")
                moveOneLeft(dragRef.current.id);
            dragRef.current = null;
        }}>
          {filteredAvailableItems.length === 0 ? (<div className="h-full flex items-center justify-center text-tiny text-(--color-text-tertiary)">
              No available items found
            </div>) : (filteredAvailableItems.map((item) => (<div key={item.id} draggable onDragStart={() => { dragRef.current = { id: item.id, from: "left" }; }} onDragEnd={() => { dragRef.current = null; setDragOverPanel(null); }} onClick={() => toggleLeft(item.id)} onDoubleClick={() => moveOneRight(item.id)} className={`group flex items-center gap-1.5 px-2 py-2.5 text-small rounded-lg cursor-grab active:cursor-grabbing transition-colors mb-1 select-none ${leftSelection.has(item.id)
                ? "bg-(--color-primary)/10 text-(--color-primary) font-medium"
                : "hover:bg-(--color-bg) text-(--color-text-primary)"}`}>
                <Icon icon="mdi:drag-vertical" width={14} className="text-(--color-text-tertiary) opacity-30 group-hover:opacity-60 shrink-0"/>
                <span className="flex-1">{item.label}</span>
                {item.subLabel && <span className="text-tiny text-(--color-text-tertiary) shrink-0">{item.subLabel}</span>}
              </div>)))}
        </div>
      </div>

      {/* Middle Controls */}
      <div className="flex md:flex-col justify-center gap-3 p-2 md:p-0">
        <Button variant="outline" size="sm" onClick={handleMoveRight} disabled={leftSelection.size === 0} className="hidden md:flex">
          <Icon icon="mdi:chevron-right" width={20}/>
        </Button>
        <Button variant="outline" size="sm" onClick={handleMoveLeft} disabled={rightSelection.size === 0} className="hidden md:flex">
          <Icon icon="mdi:chevron-left" width={20}/>
        </Button>
        <Button variant="outline" size="sm" onClick={handleMoveRight} disabled={leftSelection.size === 0} className="flex md:hidden flex-1 justify-center">
          Add <Icon icon="mdi:chevron-down" width={18}/>
        </Button>
        <Button variant="outline" size="sm" onClick={handleMoveLeft} disabled={rightSelection.size === 0} className="flex md:hidden flex-1 justify-center">
          Remove <Icon icon="mdi:chevron-up" width={18}/>
        </Button>
      </div>

      {/* Right Panel */}
      <div className={`flex-1 flex flex-col border rounded-xl overflow-hidden transition-colors h-[350px] md:h-auto ${dragOverPanel === "right" ? "border-(--color-primary) bg-(--color-primary)/[0.06]" : "border-(--color-primary)/30 bg-(--color-primary)/[0.02]"}`}>
        <div className="p-3 border-b border-(--color-primary)/20 bg-(--color-primary)/[0.05]">
          <p className="font-semibold text-small mb-1 flex items-center justify-between text-(--color-primary)">
            <span>{rightTitle}</span>
            <span className="text-tiny font-medium px-2 py-0.5 rounded-full bg-(--color-primary)/20">
              {selectedItemsObj.length} added
            </span>
          </p>
          <p className="text-[10px] text-(--color-text-tertiary)">
            double-click or drag to remove <span className="hidden md:inline">←</span><span className="inline md:hidden">↑</span>
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2" onDragOver={(e) => { e.preventDefault(); setDragOverPanel("right"); }} onDragLeave={() => setDragOverPanel(null)} onDrop={(e) => {
            e.preventDefault();
            setDragOverPanel(null);
            if (dragRef.current?.from === "left")
                moveOneRight(dragRef.current.id);
            dragRef.current = null;
        }}>
          {selectedItemsObj.length === 0 ? (<div className="h-full flex items-center justify-center text-tiny text-(--color-text-tertiary)">
              {dragOverPanel === "right" ? "Drop here to add" : "Select items from the left"}
            </div>) : (selectedItemsObj.map((item) => (<div key={item.id} draggable onDragStart={() => { dragRef.current = { id: item.id, from: "right" }; }} onDragEnd={() => { dragRef.current = null; setDragOverPanel(null); }} onClick={() => toggleRight(item.id)} onDoubleClick={() => moveOneLeft(item.id)} className={`group flex items-center gap-1.5 px-2 py-2.5 text-small rounded-lg cursor-grab active:cursor-grabbing transition-colors mb-1 select-none ${rightSelection.has(item.id)
                ? "bg-(--color-danger)/10 text-(--color-danger) font-medium"
                : "hover:bg-(--color-primary)/5 text-(--color-text-primary)"}`}>
                <Icon icon="mdi:drag-vertical" width={14} className="text-(--color-text-tertiary) opacity-30 group-hover:opacity-60 shrink-0"/>
                <span className="flex-1">{item.label}</span>
                {item.subLabel && <span className="text-tiny text-(--color-text-tertiary) ml-1 shrink-0">{item.subLabel}</span>}
                {rightSelection.has(item.id) && <Icon icon="mdi:close" width={16} className="shrink-0"/>}
              </div>)))}
        </div>
      </div>
    </div>);
}
