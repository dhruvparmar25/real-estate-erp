"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { format, parseISO, isValid, parse, addMonths, subMonths, startOfMonth, getDay, getDaysInMonth, isBefore, isAfter, isSameDay, } from "date-fns";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { ENV } from "@/config/env";
function isoToDate(iso) {
    if (!iso)
        return null;
    const d = parseISO(iso);
    return isValid(d) ? d : null;
}
function isoToDisplay(iso) {
    const d = isoToDate(iso);
    return d ? format(d, ENV.defaultDateFormat) : "";
}
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function MonthGrid({ viewMonth, selected, today, minDate, maxDate, onSelect, }) {
    const startWeekday = getDay(startOfMonth(viewMonth));
    const daysInMonth = getDaysInMonth(viewMonth);
    const cells = [
        ...Array(startWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    return (<div className="grid grid-cols-7 gap-0.5">
      {WEEK_DAYS.map((d) => (<div key={d} className="h-7 flex items-center justify-center text-[10px] font-semibold text-(--color-text-secondary)/70">
          {d}
        </div>))}
      {cells.map((day, i) => {
            if (!day)
                return <div key={`e-${i}`}/>;
            const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
            const isSelected = selected ? isSameDay(cellDate, selected) : false;
            const isToday = today ? isSameDay(cellDate, today) : false;
            const isDisabled = (minDate ? isBefore(cellDate, minDate) : false) ||
                (maxDate ? isAfter(cellDate, maxDate) : false);
            return (<button key={day} type="button" disabled={isDisabled} onClick={() => onSelect(format(cellDate, "yyyy-MM-dd"))} className={cn("h-7 w-7 mx-auto rounded-md text-tiny font-medium flex items-center justify-center transition-colors", isSelected && "bg-(--color-primary) text-(--color-primary-fg) font-semibold", !isSelected && isToday && "border border-(--color-primary) text-(--color-primary)", !isSelected && !isToday && !isDisabled && "hover:bg-(--color-primary)/10 text-(--color-text-primary)", isDisabled && "opacity-30 cursor-not-allowed text-(--color-text-tertiary)")}>
            {day}
          </button>);
        })}
    </div>);
}
export default function DateField({ label, value, onChange, onBlur, error, placeholder, hint, required, containerClassName, disabled, min, max, }) {
    const selectedDate = isoToDate(value);
    const [open, setOpen] = useState(false);
    const [today, setToday] = useState(null);
    const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date());
    const [inputText, setInputText] = useState(() => isoToDisplay(value));
    const [prevValue, setPrevValue] = useState(value);
    const containerRef = useRef(null);
    if (value !== prevValue) {
        setPrevValue(value);
        setInputText(isoToDisplay(value));
        if (selectedDate)
            setViewMonth(selectedDate);
    }
    useEffect(() => {
        if (!open)
            return;
        const handle = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                onBlur?.();
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open, onBlur]);
    useEffect(() => {
        setToday(new Date());
    }, []);
    const commitText = useCallback((text) => {
        const trimmed = text.trim();
        if (!trimmed) {
            onChange?.("");
            return;
        }
        const parsed = parse(trimmed, ENV.defaultDateFormat, new Date());
        if (isValid(parsed)) {
            onChange?.(format(parsed, "yyyy-MM-dd"));
            setInputText(format(parsed, ENV.defaultDateFormat));
        }
        else {
            setInputText(isoToDisplay(value));
        }
    }, [onChange, value]);
    const handleInputBlur = () => {
        commitText(inputText);
        onBlur?.();
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commitText(inputText);
        }
        if (e.key === "Escape") {
            setInputText(isoToDisplay(value));
            setOpen(false);
        }
    };
    const handleSelect = useCallback((iso) => {
        onChange?.(iso);
        setInputText(isoToDisplay(iso));
        setOpen(false);
        onBlur?.();
    }, [onChange, onBlur]);
    const handleClear = useCallback((e) => {
        e.stopPropagation();
        onChange?.("");
        setInputText("");
        onBlur?.();
    }, [onChange, onBlur]);
    const minDate = isoToDate(min) ?? undefined;
    const maxDate = isoToDate(max) ?? undefined;
    const displayPlaceholder = placeholder ?? ENV.defaultDateFormat.toUpperCase();
    return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (<label className="text-tiny font-medium text-(--color-text-primary) flex items-center gap-1">
          {label}
          {required && <span className="text-(--color-danger)">*</span>}
        </label>)}

      <div className="relative" ref={containerRef}>
        <div className={cn("h-11 w-full flex items-center rounded-lg border border-(--color-border) bg-(--color-surface) px-3 pr-1.5 gap-1 transition", "focus-within:ring-4 focus-within:ring-(--color-primary)/15 focus-within:border-(--color-primary)", error && "border-(--color-danger) focus-within:border-(--color-danger) focus-within:ring-(--color-danger)/15", open && "ring-4 ring-(--color-primary)/15 border-(--color-primary)", disabled && "opacity-60 cursor-not-allowed")} suppressHydrationWarning>
          <input type="text" disabled={disabled} value={inputText} onChange={(e) => setInputText(e.target.value)} onBlur={handleInputBlur} onKeyDown={handleKeyDown} placeholder={displayPlaceholder} className="flex-1 min-w-0 h-full bg-transparent text-small text-(--color-text-primary) placeholder:text-(--color-text-secondary)/80 focus:outline-none disabled:cursor-not-allowed" suppressHydrationWarning/>

          {inputText && !disabled && (<button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={handleClear} className="p-0.5 rounded hover:bg-(--color-bg) text-(--color-text-tertiary) hover:text-(--color-text-secondary) transition-colors flex-shrink-0" aria-label="Clear date">
              <Icon icon="mdi:close" width={14}/>
            </button>)}

          <button type="button" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => !disabled && setOpen((v) => !v)} className="p-1 text-(--color-text-secondary) hover:text-(--color-primary) transition-colors flex-shrink-0 rounded-md hover:bg-(--color-primary)/10" aria-label="Open calendar">
            <Icon icon="mdi:calendar-outline" width={18}/>
          </button>
        </div>

        {open && today && (<div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-[var(--shadow-popover)] p-3 w-[272px]">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setViewMonth((m) => subMonths(m, 1))} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-(--color-bg) text-(--color-text-secondary) transition-colors" aria-label="Previous month">
                <Icon icon="mdi:chevron-left" width={18}/>
              </button>
              <span className="text-small font-semibold text-(--color-text-primary)">
                {format(viewMonth, "MMMM yyyy")}
              </span>
              <button type="button" onClick={() => setViewMonth((m) => addMonths(m, 1))} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-(--color-bg) text-(--color-text-secondary) transition-colors" aria-label="Next month">
                <Icon icon="mdi:chevron-right" width={18}/>
              </button>
            </div>

            <MonthGrid viewMonth={viewMonth} selected={selectedDate} today={today} minDate={minDate} maxDate={maxDate} onSelect={handleSelect}/>

            <div className="mt-2 pt-2 border-t border-(--color-border) flex justify-end">
              <button type="button" onClick={() => handleSelect(format(today, "yyyy-MM-dd"))} className="text-tiny font-medium text-(--color-primary) hover:underline">
                Today
              </button>
            </div>
          </div>)}
      </div>

      {error ? (<p data-field-error className="text-tiny text-(--color-danger) flex items-start gap-1 mt-0.5 leading-tight">
          <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
          <span>{error}</span>
        </p>) : hint ? (<p className="text-tiny text-(--color-text-secondary) mt-0.5 leading-tight">{hint}</p>) : null}
    </div>);
}
