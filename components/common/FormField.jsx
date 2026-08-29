"use client";
import { forwardRef, } from "react";
import { Controller } from "react-hook-form";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useMounted } from "@/hooks/use-mounted";
const fieldBase = "h-11 w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 text-small text-(--color-text-primary) placeholder:text-(--color-text-secondary)/80 transition focus:outline-none focus:ring-4 focus:ring-(--color-primary)/15 focus:border-(--color-primary) disabled:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-100 disabled:text-(--color-text-primary)";
function FieldWrapper({ label, error, hint, required, containerClassName, children, }) {
    return (<div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (<label className="text-tiny font-medium text-(--color-text-primary) flex items-center gap-1">
          {label}
          {required && <span className="text-(--color-danger)">*</span>}
        </label>)}
      {children}
      {error ? (<p data-field-error className="text-tiny text-(--color-danger) flex items-start gap-1 mt-0.5 leading-tight">
          <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
          <span className="min-w-0">{error}</span>
        </p>) : hint ? (<p className="text-tiny text-(--color-text-secondary) mt-0.5 leading-tight">{hint}</p>) : null}
    </div>);
}
export const TextField = forwardRef(function TextField({ label, error, hint, required, containerClassName, className, leadingIcon, trailingIcon, onTrailingIconClick, trailingIconLabel, ...rest }, ref) {
    return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
      <div className="relative">
        {leadingIcon && (<Icon icon={leadingIcon} width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"/>)}
        <input ref={ref} suppressHydrationWarning className={cn(fieldBase, error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/15", leadingIcon && "pl-10", trailingIcon && "pr-10", className)} {...rest}/>
        {trailingIcon &&
            (onTrailingIconClick ? (<button type="button" onClick={onTrailingIconClick} aria-label={trailingIconLabel ?? "Toggle"} tabIndex={0} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40" suppressHydrationWarning>
              <Icon icon={trailingIcon} width={18}/>
            </button>) : (<Icon icon={trailingIcon} width={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"/>))}
      </div>
    </FieldWrapper>);
});
export const TextAreaField = forwardRef(function TextAreaField({ label, error, hint, required, containerClassName, className, rows = 3, ...rest }, ref) {
    return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
      <textarea ref={ref} suppressHydrationWarning rows={rows} className={cn(fieldBase, "h-auto py-2.5 resize-y leading-relaxed", error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/15", className)} {...rest}/>
    </FieldWrapper>);
});
export const SelectField = forwardRef(function SelectField({ label, error, hint, required, containerClassName, className, options, placeholder, ...rest }, ref) {
    return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
      <div className="relative">
        <select ref={ref} suppressHydrationWarning className={cn(fieldBase, "appearance-none pr-10 cursor-pointer", error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/15", className)} {...rest}>
          {placeholder && <option value="" className="bg-(--color-surface) text-(--color-text-secondary)">{placeholder}</option>}
          {options.map((o) => (<option key={o.value} value={o.value} className="bg-(--color-surface) text-(--color-text-primary)">{o.label}</option>))}
        </select>
        <Icon icon="mdi:chevron-down" width={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"/>
      </div>
    </FieldWrapper>);
});
const CustomOption = (props) => {
    return (<components.Option {...props}>
      <div className="flex items-center gap-2 w-full">
        {props.data.avatar && (<div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {props.data.avatar}
          </div>)}
        <div className="flex flex-col min-w-0">
          <span className="truncate leading-tight">{props.data.label}</span>
          {props.data.description && (<span className="text-[11px] text-(--color-text-secondary) truncate leading-tight uppercase tracking-wider mt-0.5">
              {props.data.description}
            </span>)}
        </div>
        {props.isSelected && (<div className="ml-auto">
            <Icon icon="mdi:check" width={14} className="text-(--color-primary)"/>
          </div>)}
      </div>
    </components.Option>);
};
export function SearchSelectField({ label, error, hint, required, containerClassName, options, value, onChange, onBlur, placeholder = "Select…", disabled, creatable, }) {
    const mounted = useMounted();
    // User-typed creatable values may not exist in options yet.
    const selected = options.find((o) => o.value === value) || (value && creatable ? { value, label: value } : null);
    if (!mounted) {
        return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
        <select disabled={disabled} value={value || ""} onChange={(e) => onChange?.(e.target.value)} className={cn(fieldBase, "appearance-none pr-10 cursor-pointer", error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/15", disabled && "bg-(--color-bg) opacity-100 !cursor-not-allowed")} suppressHydrationWarning>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      </FieldWrapper>);
    }
    const styles = {
        control: (base, state) => ({
            ...base,
            minHeight: "44px",
            height: "44px",
            borderRadius: "0.5rem",
            backgroundColor: disabled ? "var(--color-bg)" : "var(--color-surface)",
            borderColor: error
                ? "var(--color-danger)"
                : state.isFocused
                    ? "var(--color-primary)"
                    : "var(--color-border)",
            boxShadow: error && state.isFocused
                ? "0 0 0 2px color-mix(in srgb, var(--color-danger) 20%, transparent)"
                : state.isFocused
                    ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 15%, transparent)"
                    : "none",
            "&:hover": {
                borderColor: disabled ? "var(--color-border)" : error ? "var(--color-danger)" : "var(--color-primary)",
            },
            cursor: disabled ? "not-allowed" : "pointer",
            pointerEvents: disabled ? "auto" : undefined,
            opacity: 1,
            transition: "border-color 0.15s, box-shadow 0.15s",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 12px",
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
            whiteSpace: "nowrap",
        }),
        singleValue: (base) => ({
            ...base,
            color: "var(--color-text-primary)",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: "44px",
        }),
        clearIndicator: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            padding: "6px",
            "&:hover": {
                color: "var(--color-danger)",
                backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                borderRadius: "6px",
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            padding: "6px 12px",
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
                ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                : state.isFocused
                    ? "var(--color-bg)"
                    : "transparent",
            color: state.isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
            fontSize: "0.875rem",
            padding: "8px 12px",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: "var(--color-text-secondary)",
            fontSize: "0.875rem",
        }),
    };
    if (creatable) {
        return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
        <CreatableSelect instanceId={`creatable-${label || placeholder}`} options={options} value={selected} onChange={(opt) => onChange?.(opt ? opt.value : "")} onBlur={onBlur} isDisabled={disabled} placeholder={placeholder} isClearable isSearchable styles={styles} menuPortalTarget={mounted ? document.body : undefined} menuPosition="fixed" formatCreateLabel={(v) => `Create "${v}"`} aria-label={label} noOptionsMessage={() => "No options found"} components={{ Option: CustomOption }}/>
      </FieldWrapper>);
    }
    return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
      <Select instanceId={label || placeholder} options={options} value={selected} onChange={(opt) => {
            onChange?.(opt ? opt.value : "");
        }} onBlur={onBlur} isDisabled={disabled} placeholder={placeholder} isClearable isSearchable styles={styles} menuPortalTarget={mounted ? document.body : undefined} menuPosition="fixed" aria-label={label} noOptionsMessage={() => "No options found"} components={{ Option: CustomOption }}/>
    </FieldWrapper>);
}
export function FormSelectField({ name, control, ...rest }) {
    return (<Controller name={name} control={control} render={({ field, fieldState }) => (<SearchSelectField {...rest} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message}/>)}/>);
}
export function RadioGroupField({ label, required, hint, error, containerClassName, options, value, onChange, name, disabled }) {
    return (<FieldWrapper label={label} error={error} hint={hint} required={required} containerClassName={containerClassName}>
      <div className="flex flex-wrap gap-4 py-1">
        {options.map((o) => (<label key={o.value} className={cn("flex items-center gap-2 cursor-pointer select-none", disabled && "opacity-60 cursor-not-allowed")}>
            <input type="radio" suppressHydrationWarning name={name} value={o.value} checked={value === o.value} onChange={() => onChange?.(o.value)} disabled={disabled} className={cn("w-4 h-4 accent-(--color-primary) focus:outline-none", disabled && "cursor-not-allowed")}/>
            <span className="text-small text-(--color-text-primary)">{o.label}</span>
          </label>))}
      </div>
    </FieldWrapper>);
}
export const CheckboxField = forwardRef(function CheckboxField({ label, description, containerClassName, className, onKeyDown, ...rest }, ref) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.click();
        }
        onKeyDown?.(e);
    };
    return (<label className={cn("flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg) transition focus-within:ring-4 focus-within:ring-(--color-primary)/15 focus-within:border-(--color-primary)", containerClassName)}>
      <input ref={ref} suppressHydrationWarning type="checkbox" onKeyDown={handleKeyDown} className={cn("mt-0.5 w-4 h-4 accent-(--color-primary) focus:outline-none", className)} {...rest}/>
      <div className="min-w-0">
        <p className="text-small text-(--color-text-primary) leading-tight">{label}</p>
        {description && <p className="text-tiny text-(--color-text-secondary) mt-0.5">{description}</p>}
      </div>
    </label>);
});
export default FieldWrapper;
