"use client";
import { useMemo } from "react";
import { passwordStrength } from "@/utils/password-strength";
import { cn } from "@/utils/cn";
const STRENGTH_TONE = [
    "bg-(--color-danger)",
    "bg-(--color-danger)",
    "bg-(--color-warning)",
    "bg-(--color-info)",
    "bg-(--color-success)",
];
export default function PasswordStrengthMeter({ password, hint = "Min 8 chars, mix of upper / lower / digit / special.", }) {
    const strength = useMemo(() => passwordStrength(password), [password]);
    if (!password)
        return null;
    return (<div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((i) => (<div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < strength.score ? STRENGTH_TONE[strength.score] : "bg-(--color-border)")}/>))}
      </div>
      <p className="text-tiny text-(--color-text-secondary)">
        Strength:{" "}
        <span className="font-semibold text-(--color-text-primary)">
          {strength.label}
        </span>
        {hint ? ` · ${hint}` : ""}
      </p>
    </div>);
}
