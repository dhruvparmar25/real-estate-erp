"use client";
import Select, { components } from "react-select";
import { Icon } from "@/components/common/Icon";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";
function CheckOption(props) {
    return (<components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
            width: "16px",
            height: "16px",
            borderRadius: "4px",
            border: props.isSelected
                ? "none"
                : "1.5px solid var(--color-border)",
            backgroundColor: props.isSelected
                ? "var(--color-primary)"
                : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.1s",
        }}>
          {props.isSelected && (<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>)}
        </div>
        <span>{props.children}</span>
      </div>
    </components.Option>);
}
export default function SearchableMultiSelectField({ label, options, value = [], onChange, onBlur, placeholder = "Select…", required, error, hint, containerClassName, isDisabled, }) {
    const mounted = useMounted();
    const selected = options.filter((o) => value.includes(o.value));
    const styles = {
        control: (base, state) => ({
            ...base,
            minHeight: "44px",
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
            padding: "2px 8px",
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
        multiValue: (base) => ({
            ...base,
            backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
            borderRadius: "4px",
            margin: "2px",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "var(--color-primary)",
            fontSize: "0.75rem",
            padding: "2px 6px",
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "var(--color-primary)",
            "&:hover": {
                backgroundColor: "var(--color-danger)",
                color: "white",
            },
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: "44px",
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
                ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
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
    const labelEl = label ? (<label className="text-tiny font-medium text-(--color-text-primary) flex items-center gap-1">
      {label}
      {required && <span className="text-(--color-danger)">*</span>}
    </label>) : null;
    const feedbackEl = error ? (<p className="text-tiny text-(--color-danger) flex items-start gap-1 mt-0.5 leading-tight">
      <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
      <span className="min-w-0">{error}</span>
    </p>) : hint ? (<p className="text-tiny text-(--color-text-secondary) mt-0.5 leading-tight">{hint}</p>) : null;
    if (!mounted) {
        return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {labelEl}
        <div className="h-11 w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 flex items-center">
          <span className="text-tiny text-(--color-text-secondary)">Loading...</span>
        </div>
        {feedbackEl}
      </div>);
    }
    return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {labelEl}
      <Select isMulti options={options} value={selected} onChange={(opts) => onChange?.(opts.map((o) => o.value))} onBlur={onBlur} placeholder={placeholder} isSearchable isDisabled={isDisabled} closeMenuOnSelect={false} hideSelectedOptions={false} components={{ Option: CheckOption }} styles={styles} menuPortalTarget={mounted ? document.body : undefined} menuPosition="fixed" noOptionsMessage={() => "No options"}/>
      {feedbackEl}
    </div>);
}
