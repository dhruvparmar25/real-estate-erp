"use client";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
const variants = {
    primary: "bg-(--color-primary) text-(--color-primary-fg) hover:bg-(--color-primary-hover) disabled:opacity-60",
    secondary: "bg-(--color-secondary) text-(--color-primary-fg) hover:opacity-90 disabled:opacity-60",
    outline: "border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) hover:bg-(--color-bg) disabled:opacity-60",
    ghost: "bg-transparent text-(--color-text-primary) hover:bg-(--color-bg) disabled:opacity-60",
    danger: "bg-(--color-danger) text-white hover:opacity-90 disabled:opacity-60",
};
const sizes = {
    sm: "h-8 px-3 text-tiny",
    md: "h-10 px-4 text-small",
    lg: "h-11 px-5 text-body",
};
const Button = forwardRef(function Button({ className, variant = "primary", size = "md", loading, icon, disabled, children, ...rest }, ref) {
    return (<button ref={ref} suppressHydrationWarning disabled={disabled || loading} className={cn("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 disabled:cursor-not-allowed", variants[variant], sizes[size], className)} {...rest}>
      {loading ? (<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>) : (icon)}
      {children}
    </button>);
});
export default Button;
