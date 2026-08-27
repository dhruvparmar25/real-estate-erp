"use client";
import Select from "react-select";
import { Icon } from "@/components/common/Icon";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";
export default function SearchableSelectField({ label, options, value = "", onChange, onBlur, placeholder = "Select…", required, error, hint, containerClassName, isClearable = false, isDisabled, }) {
    const mounted = useMounted();
    const selected = options.find((o) => o.value === value) ?? null;
    const styles = {
        control: (base, state) => ({
            ...base,
            minHeight: "44px",
            height: "44px",
            width: "100%",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-surface)",
            borderColor: error
                ? "var(--color-danger)"
                : state.isFocused
                    ? "var(--color-primary)"
                    : "var(--color-border)",
            boxShadow: state.isFocused
                ? error
                    ? "0 0 0 4px color-mix(in srgb, var(--color-danger) 15%, transparent)"
                    : "0 0 0 4px color-mix(in srgb, var(--color-primary) 15%, transparent)"
                : "none",
            "&:hover": {
                borderColor: error ? "var(--color-danger)" : "var(--color-border)",
            },
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
            transition: "border-color 0.15s, box-shadow 0.15s",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 8px",
            height: "44px",
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
            color: "color-mix(in srgb, var(--color-text-secondary) 80%, transparent)",
            fontSize: "0.875rem",
        }),
        singleValue: (base) => ({
            ...base,
            color: "var(--color-text-primary)",
            fontSize: "0.875rem",
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: "44px",
        }),
        clearIndicator: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            padding: "4px",
            "&:hover": {
                color: "var(--color-danger)",
                backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                borderRadius: "4px",
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            padding: "4px 8px",
            "&:hover": { color: "var(--color-text-primary)" },
        }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (base) => ({
            ...base,
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
    const formatOptionLabel = (option, { context }) => {
        if (option.subLabel) {
            if (context === "menu") {
                return (<div className="flex flex-col leading-snug">
            <span className="font-medium">{option.label}</span>
            <span className="text-[12px] text-(--color-text-secondary)">{option.subLabel}</span>
          </div>);
            }
            else {
                return (<span>
            {option.label} <span className="text-(--color-text-secondary)">({option.subLabel})</span>
          </span>);
            }
        }
        return <span>{option.label}</span>;
    };
    const filterOption = (candidate, input) => {
        if (!input)
            return true;
        const lowerInput = input.toLowerCase();
        const matchLabel = candidate.label.toLowerCase().includes(lowerInput);
        const matchSubLabel = candidate.data.subLabel?.toLowerCase().includes(lowerInput) ?? false;
        return matchLabel || matchSubLabel;
    };
    const labelEl = label ? (<label className="text-tiny font-medium text-(--color-text-primary) flex items-center gap-1">
      {label}
      {required && <span className="text-(--color-danger)">*</span>}
    </label>) : null;
    const feedbackEl = error ? (<p data-field-error className="text-tiny text-(--color-danger) flex items-start gap-1 mt-0.5 leading-tight">
      <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
      <span className="min-w-0">{error}</span>
    </p>) : hint ? (<p className="text-tiny text-(--color-text-secondary) mt-0.5 leading-tight">{hint}</p>) : null;
    if (!mounted) {
        return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {labelEl}
        <div className="relative">
          <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={isDisabled} className={cn("h-11 w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 text-small text-(--color-text-primary) appearance-none pr-10 cursor-pointer focus:outline-none disabled:opacity-60", error && "border-(--color-danger)")}>
            <option value="">{placeholder}</option>
            {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
          <Icon icon="mdi:chevron-down" width={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"/>
        </div>
        {feedbackEl}
      </div>);
    }
    return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {labelEl}
      <Select options={options} value={selected} onChange={(opt) => onChange?.(opt ? opt.value : "")} onBlur={onBlur} placeholder={placeholder} isClearable={isClearable} isSearchable isDisabled={isDisabled} styles={styles} formatOptionLabel={formatOptionLabel} filterOption={filterOption} menuPortalTarget={document.body} menuPosition="fixed" noOptionsMessage={() => "No options"}/>
      {feedbackEl}
    </div>);
}
