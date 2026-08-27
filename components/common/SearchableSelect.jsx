"use client";
import Select from "react-select";
import { useMounted } from "@/hooks/use-mounted";
export default function SearchableSelect({ label, options, value, onChange, minWidth = 140, }) {
    const mounted = useMounted();
    const isActive = value !== "all";
    // SSR / first-hydration fallback — avoids emotion CSS mismatch
    if (!mounted) {
        return (<select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} style={{ minWidth, height: 36 }} className="appearance-none rounded-lg border border-(--color-border) bg-(--color-surface) text-small text-(--color-text-primary) px-3 cursor-pointer" suppressHydrationWarning>
        <option value="all">{label}: All</option>
        {options.map((o) => (<option key={o.value} value={o.value}>
            {o.label}
          </option>))}
      </select>);
    }
    const selected = isActive ? (options.find((o) => o.value === value) ?? null) : null;
    const styles = {
        control: (base, state) => ({
            ...base,
            minHeight: "36px",
            height: "36px",
            minWidth: `${minWidth}px`,
            borderRadius: "0.5rem",
            backgroundColor: isActive
                ? "color-mix(in srgb, var(--color-primary) 6%, transparent)"
                : "var(--color-surface)",
            borderColor: state.isFocused
                ? "var(--color-primary)"
                : isActive
                    ? "color-mix(in srgb, var(--color-primary) 30%, transparent)"
                    : "var(--color-border)",
            boxShadow: state.isFocused
                ? "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)"
                : "none",
            "&:hover": {
                borderColor: "color-mix(in srgb, var(--color-primary) 30%, transparent)",
            },
            cursor: "pointer",
            flexWrap: "nowrap",
            transition: "border-color 0.15s, box-shadow 0.15s",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 8px",
            height: "36px",
            flexWrap: "nowrap",
        }),
        input: (base) => ({
            ...base,
            color: "var(--color-text-primary)",
            fontSize: "0.875rem",
            margin: 0,
            padding: 0,
        }),
        placeholder: (base) => ({
            ...base,
            color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontSize: "0.875rem",
            fontWeight: isActive ? 500 : 400,
            whiteSpace: "nowrap",
        }),
        singleValue: (base) => ({
            ...base,
            color: isActive ? "var(--color-primary)" : "var(--color-text-primary)",
            fontSize: "0.875rem",
            fontWeight: isActive ? 500 : 400,
            whiteSpace: "nowrap",
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: "36px",
        }),
        clearIndicator: (base) => ({
            ...base,
            color: "var(--color-primary)",
            padding: "4px",
            "&:hover": {
                color: "var(--color-primary)",
                backgroundColor: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                borderRadius: "4px",
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            padding: "4px 8px",
            "&:hover": {
                color: "var(--color-text-primary)",
            },
        }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (base) => ({
            ...base,
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 9999,
            minWidth: "100%",
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "color-mix(in srgb, var(--color-primary) 15%, transparent)"
                : state.isFocused
                    ? "var(--color-bg)"
                    : "transparent",
            color: state.isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
            fontSize: "0.875rem",
            padding: "8px 12px",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "color-mix(in srgb, var(--color-primary) 20%, transparent)",
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            fontSize: "0.875rem",
        }),
    };
    return (<Select instanceId={label} options={options} value={selected} onChange={(opt) => onChange(opt ? opt.value : "all")} placeholder={`${label}: All`} isClearable={isActive} isSearchable styles={styles} menuPortalTarget={document.body} menuPosition="fixed" aria-label={label} noOptionsMessage={() => "No options"}/>);
}
