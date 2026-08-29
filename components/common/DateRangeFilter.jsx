"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { addMonths, endOfMonth, endOfWeek, format, isSameDay, isWithinInterval, parseISO, startOfMonth, startOfWeek, subDays, subWeeks, } from "date-fns";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format";
export const EMPTY_RANGE = { from: null, to: null };
const fmt = (d) => format(d, "yyyy-MM-dd");
const PRESETS = [
    { id: "today", label: "Today", compute: () => { const d = new Date(); return { from: fmt(d), to: fmt(d) }; } },
    { id: "this_week", label: "This Week", compute: () => { const d = new Date(); return { from: fmt(startOfWeek(d)), to: fmt(endOfWeek(d)) }; } },
    { id: "last_week", label: "Last Week", compute: () => { const d = subWeeks(new Date(), 1); return { from: fmt(startOfWeek(d)), to: fmt(endOfWeek(d)) }; } },
    { id: "last_7", label: "Last 7 Days", compute: () => ({ from: fmt(subDays(new Date(), 6)), to: fmt(new Date()) }) },
    { id: "last_30", label: "Last 30 Days", compute: () => ({ from: fmt(subDays(new Date(), 29)), to: fmt(new Date()) }) },
    { id: "this_month", label: "This Month", compute: () => { const d = new Date(); return { from: fmt(startOfMonth(d)), to: fmt(endOfMonth(d)) }; } },
];
function rangeLabel(range) {
    if (!range.from || !range.to)
        return "All";
    if (isSameDay(parseISO(range.from), parseISO(range.to))) {
        return formatDate(range.from);
    }
    return `${formatDate(range.from)} → ${formatDate(range.to)}`;
}
export default function DateRangeFilter({ value, onChange, label = "Date range", className, }) {
    const [open, setOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(() => startOfMonth(value.from ? parseISO(value.from) : new Date()));
    const [pickingFrom, setPickingFrom] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [alignRight, setAlignRight] = useState(false);
    const wrapRef = useRef(null);
    const popupRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onPointer = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setPickingFrom(null);
                setHovered(null);
            }
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setPickingFrom(null);
                setHovered(null);
            }
        };
        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);
    useLayoutEffect(() => {
        if (!open || !wrapRef.current)
            return;
        const rect = wrapRef.current.getBoundingClientRect();
        const popupWidth = popupRef.current?.offsetWidth ?? 560;
        const spaceRight = window.innerWidth - rect.left;
        setAlignRight(spaceRight < popupWidth + 16);
    }, [open]);
    const handleDayClick = (date) => {
        const iso = fmt(date);
        if (!pickingFrom) {
            setPickingFrom(iso);
            onChange({ from: iso, to: iso });
            return;
        }
        const start = parseISO(pickingFrom);
        const [low, high] = date < start ? [date, start] : [start, date];
        onChange({ from: fmt(low), to: fmt(high) });
        setPickingFrom(null);
        setHovered(null);
        setOpen(false);
    };
    const handlePreset = (preset) => {
        onChange(preset.compute());
        setPickingFrom(null);
        setHovered(null);
        setOpen(false);
    };
    const handleReset = () => {
        onChange(EMPTY_RANGE);
        setPickingFrom(null);
        setHovered(null);
        setOpen(false);
    };
    const isActive = !!(value.from && value.to);
    const previewRange = useMemo(() => {
        if (pickingFrom && hovered) {
            const start = parseISO(pickingFrom);
            const [low, high] = hovered < start ? [hovered, start] : [start, hovered];
            return { start: low, end: high };
        }
        if (value.from && value.to) {
            return { start: parseISO(value.from), end: parseISO(value.to) };
        }
        return null;
    }, [pickingFrom, hovered, value.from, value.to]);
    return (<div ref={wrapRef} className={cn("relative inline-block", className)}>
      <div className={cn("h-9 inline-flex items-stretch rounded-lg border text-small min-w-[150px] overflow-hidden", "transition-colors", isActive
            ? "border-(--color-primary)/30 bg-(--color-primary)/[0.06]"
            : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)/30")}>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open} className={cn("flex-1 flex items-center gap-2 pl-3 pr-2 min-w-0", "focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:ring-inset", isActive
            ? "text-(--color-primary) font-medium"
            : "text-(--color-text-primary)")} suppressHydrationWarning>
          <Icon icon="mdi:calendar-outline" width={14} className={isActive ? "text-(--color-primary)" : "text-(--color-text-secondary)"}/>
          <span className="flex-1 text-left truncate">
            {isActive ? rangeLabel(value) : `${label}: All`}
          </span>
          {!isActive && (<Icon icon="mdi:chevron-down" width={14} className={cn("text-(--color-text-secondary) transition-transform", open && "rotate-180")}/>)}
        </button>
        {isActive && (<button type="button" onClick={() => onChange(EMPTY_RANGE)} aria-label={`Clear ${label}`} title={`Clear ${label}`} className="px-2 inline-flex items-center justify-center text-(--color-primary) hover:bg-(--color-primary)/15 transition-colors">
            <Icon icon="mdi:close" width={14}/>
          </button>)}
      </div>

      {open && (<DateRangePopup ref={popupRef} alignRight={alignRight} viewMonth={viewMonth} setViewMonth={setViewMonth} previewRange={previewRange} pickingFrom={pickingFrom} hovered={hovered} setHovered={setHovered} onDayClick={handleDayClick} onPreset={handlePreset} onReset={handleReset}/>)}
    </div>);
}
const DateRangePopup = ({ ref, alignRight, viewMonth, setViewMonth, previewRange, pickingFrom, hovered, setHovered, onDayClick, onPreset, onReset, }) => {
    const nextMonth = useMemo(() => addMonths(viewMonth, 1), [viewMonth]);
    return (<div ref={ref} role="dialog" aria-label="Pick date range" className={cn("absolute z-50 top-full mt-1.5", alignRight ? "right-0" : "left-0", "bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden", "shadow-[var(--shadow-popover,0_10px_30px_rgba(0,0,0,0.12))]", "max-w-[calc(100vw-1rem)]")}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-32 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-(--color-border) bg-(--color-bg)/40 p-1.5 sm:p-2 flex sm:flex-col gap-0.5 overflow-x-auto sm:overflow-visible">
          <p className="hidden sm:block text-[10px] font-semibold tracking-wider text-(--color-text-secondary)/80 px-2 pt-0.5 pb-1 whitespace-nowrap">
            QUICK SELECT
          </p>
          {PRESETS.map((p) => (<button key={p.id} type="button" onClick={() => onPreset(p)} className="text-left px-2 py-1 rounded-md text-tiny font-medium text-(--color-text-primary) hover:bg-(--color-bg) whitespace-nowrap transition-colors">
              {p.label}
            </button>))}
          <div className="hidden sm:block mt-auto pt-1.5 border-t border-(--color-border)">
            <button type="button" onClick={onReset} className="w-full text-left px-2 py-1 rounded-md text-tiny font-semibold text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
              Reset
            </button>
          </div>
        </div>

        <div className="p-2" onMouseLeave={() => pickingFrom && setHovered(null)}>
          <div className="flex items-center justify-between mb-1 px-1">
            <button type="button" onClick={() => setViewMonth(addMonths(viewMonth, -1))} aria-label="Previous month" className="w-6 h-6 rounded-md hover:bg-(--color-bg) text-(--color-text-secondary) inline-flex items-center justify-center">
              <Icon icon="mdi:chevron-left" width={14}/>
            </button>
            <div className="flex-1"/>
            <button type="button" onClick={() => setViewMonth(addMonths(viewMonth, 1))} aria-label="Next month" className="w-6 h-6 rounded-md hover:bg-(--color-bg) text-(--color-text-secondary) inline-flex items-center justify-center">
              <Icon icon="mdi:chevron-right" width={14}/>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
            <CalendarMonth month={viewMonth} range={previewRange} pickingFrom={pickingFrom} hovered={hovered} setHovered={setHovered} onDayClick={onDayClick}/>
            <div className="hidden lg:block">
              <CalendarMonth month={nextMonth} range={previewRange} pickingFrom={pickingFrom} hovered={hovered} setHovered={setHovered} onDayClick={onDayClick}/>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden px-3 py-2 border-t border-(--color-border)">
        <button type="button" onClick={onReset} className="w-full text-center px-3 py-1.5 rounded-md text-small font-semibold text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
          Reset
        </button>
      </div>
    </div>);
};
const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
function CalendarMonth({ month, range, pickingFrom, hovered, setHovered, onDayClick, }) {
    const first = startOfMonth(month);
    const last = endOfMonth(month);
    const startWeekday = first.getDay();
    const daysInMonth = last.getDate();
    const today = new Date();
    return (<div className="select-none w-[224px] flex-shrink-0">
      <p className="text-center text-tiny font-semibold text-(--color-text-primary) mb-1.5">
        {format(month, "MMMM yyyy")}
      </p>
      <div className="grid grid-cols-7 gap-0.5 justify-items-center">
        {WEEK_DAYS.map((d, i) => (<div key={i} className="w-8 h-6 inline-flex items-center justify-center text-[10px] font-semibold text-(--color-text-secondary)/70">
            {d}
          </div>))}
        {Array.from({ length: startWeekday }).map((_, i) => (<div key={`pad-${i}`} className="w-8 h-8"/>))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const inRange = range ? isWithinInterval(date, range) : false;
            const isStart = range ? isSameDay(date, range.start) : false;
            const isEnd = range ? isSameDay(date, range.end) : false;
            const isEdge = isStart || isEnd;
            const isToday = isSameDay(date, today);
            const isPreview = !!pickingFrom && !!hovered;
            return (<button key={day} type="button" onClick={() => onDayClick(date)} onMouseEnter={() => pickingFrom && setHovered(date)} className={cn("w-8 h-8 rounded-full text-[11px] font-medium transition-colors", "focus:outline-none focus:ring-2 focus:ring-(--color-primary)/40", !inRange && !isEdge && "text-(--color-text-primary) hover:bg-(--color-primary)/10", inRange && !isEdge && (isPreview
                    ? "bg-(--color-primary)/[0.08] text-(--color-primary)"
                    : "bg-(--color-primary)/15 text-(--color-primary)"), isEdge && "bg-(--color-primary) text-(--color-primary-fg) shadow-sm", isToday && !isEdge && "ring-1 ring-(--color-primary) ring-inset")}>
              {day}
            </button>);
        })}
      </div>
    </div>);
}
