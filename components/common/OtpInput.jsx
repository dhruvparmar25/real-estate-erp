"use client";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
export default function OtpInput({ value, onChange, onComplete, length = 6, error, disabled, autoFocus = true, label, }) {
    const inputsRef = useRef([]);
    useEffect(() => {
        if (autoFocus)
            inputsRef.current[0]?.focus();
    }, [autoFocus]);
    const digits = value.padEnd(length, " ").slice(0, length).split("");
    const focusAt = (index) => {
        const target = inputsRef.current[Math.max(0, Math.min(index, length - 1))];
        target?.focus();
        target?.select();
    };
    const writeAt = (index, char) => {
        const next = (value + " ".repeat(length)).slice(0, length).split("");
        next[index] = char;
        const joined = next.join("").replace(/\s+$/, "");
        onChange(joined);
        if (joined.length === length && !joined.includes(" "))
            onComplete?.(joined);
    };
    const handleChange = (index) => (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (!raw) {
            writeAt(index, "");
            return;
        }
        if (raw.length === 1) {
            writeAt(index, raw);
            if (index < length - 1)
                focusAt(index + 1);
            return;
        }
        distributePaste(raw, index);
    };
    const distributePaste = (text, startIndex = 0) => {
        const cleaned = text.replace(/\D/g, "").slice(0, length - startIndex);
        if (!cleaned)
            return;
        const next = (value + " ".repeat(length)).slice(0, length).split("");
        for (let i = 0; i < cleaned.length; i += 1) {
            next[startIndex + i] = cleaned[i];
        }
        const joined = next.join("").replace(/\s+$/, "");
        onChange(joined);
        const lastFilled = Math.min(startIndex + cleaned.length, length) - 1;
        focusAt(lastFilled + 1 < length ? lastFilled + 1 : lastFilled);
        if (joined.length === length && !joined.includes(" "))
            onComplete?.(joined);
    };
    const handleKeyDown = (index) => (e) => {
        const current = digits[index]?.trim() ?? "";
        if (e.key === "Backspace") {
            if (current) {
                writeAt(index, "");
                return;
            }
            e.preventDefault();
            if (index > 0) {
                writeAt(index - 1, "");
                focusAt(index - 1);
            }
            return;
        }
        if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusAt(index - 1);
            return;
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            focusAt(index + 1);
            return;
        }
        if (e.key === "Delete") {
            e.preventDefault();
            writeAt(index, "");
        }
    };
    const handlePaste = (index) => (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        distributePaste(text, index);
    };
    const boxBase = "h-12 w-11 sm:h-14 sm:w-12 rounded-lg border bg-(--color-surface) text-center text-h3 font-semibold text-(--color-text-primary) focus:outline-none transition";
    return (<div className="flex flex-col gap-2">
      {label && (<label className="text-tiny font-medium text-(--color-text-primary)">
          {label}
        </label>)}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {Array.from({ length }).map((_, index) => (<input key={index} ref={(el) => {
                inputsRef.current[index] = el;
            }} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={1} disabled={disabled} value={digits[index]?.trim() ?? ""} onChange={handleChange(index)} onKeyDown={handleKeyDown(index)} onPaste={handlePaste(index)} onFocus={(e) => e.currentTarget.select()} aria-label={`Digit ${index + 1}`} aria-invalid={error ? "true" : "false"} className={cn(boxBase, error
                ? "border-(--color-danger) focus:border-(--color-danger) focus:ring-4 focus:ring-(--color-danger)/15"
                : "border-(--color-border) focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/15", disabled && "opacity-60 cursor-not-allowed")}/>))}
      </div>
      {error && (<p className="text-tiny text-(--color-danger) flex items-start gap-1 mt-0.5 leading-tight">
          <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
          <span>{error}</span>
        </p>)}
    </div>);
}
