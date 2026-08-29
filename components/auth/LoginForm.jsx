"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import Button from "@/components/common/Button";
import { TextField } from "@/components/common/FormField";
import { loginAction } from "@/lib/actions/auth.actions";
import { notifyError } from "@/utils/notify";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [showPwd, setShowPwd] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);
  const lastErrorRef = useRef(null);

  useEffect(() => {
    if (!state?.error || state.error === lastErrorRef.current) return;
    lastErrorRef.current = state.error;
    notifyError(state.error, {
      description: "Double-check the username and password, then try again.",
    });
  }, [state?.error]);

  const handleUsernameEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  const handlePasswordEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRef.current?.click();
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        ref={usernameRef}
        label="Username"
        name="username"
        defaultValue="admin"
        autoComplete="username"
        required
        autoFocus
        onKeyDown={handleUsernameEnter}
        error={state?.fieldErrors?.username?.[0]}
      />

      <TextField
        ref={passwordRef}
        label="Password"
        name="password"
        type={showPwd ? "text" : "password"}
        defaultValue="Admin@123"
        autoComplete="current-password"
        required
        onKeyDown={handlePasswordEnter}
        error={state?.fieldErrors?.password?.[0]}
        trailingIcon={showPwd ? "mdi:eye-off-outline" : "mdi:eye-outline"}
        onTrailingIconClick={() => setShowPwd((s) => !s)}
        trailingIconLabel={showPwd ? "Hide password" : "Show password"}
      />

      <div className="flex items-center justify-between text-tiny">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-(--color-text-secondary)">
          <input
            type="checkbox"
            name="remember"
            className="w-4 h-4 accent-(--color-primary) cursor-pointer"
          />
          <span>Remember me</span>
        </label>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-(--color-danger)/30 bg-(--color-danger-soft) px-3 py-2 text-tiny text-(--color-danger) flex items-center gap-2">
          <Icon icon="mdi:alert-circle-outline" width={16} />
          {state.error}
        </div>
      )}

      <Button ref={submitRef} type="submit" loading={isPending} size="lg" className="w-full mt-2">
        Sign in
      </Button>

      <p className="text-tiny text-center text-(--color-text-tertiary)">
        Mock login: <code className="text-(--color-text-secondary)">admin</code> /{" "}
        <code className="text-(--color-text-secondary)">Admin@123</code>
      </p>
    </form>
  );
}
