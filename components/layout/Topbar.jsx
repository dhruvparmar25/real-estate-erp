"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { Icon } from "@/components/common/Icon";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/auth/use-logout";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/utils/cn";

const noopSubscribe = () => () => {};
const getIsMacClient = () =>
  typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const getIsMacServer = () => false;

export default function Topbar({ onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const isMac = useSyncExternalStore(noopSubscribe, getIsMacClient, getIsMacServer);

  const displayName = user?.fullName || user?.username || user?.email || "User";
  const email = user?.email ?? "";
  const role = user?.role?.replace(/_/g, " ") ?? "Staff";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape") {
        if (isProfileOpen) setIsProfileOpen(false);
        else if (document.activeElement === searchInputRef.current) searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isProfileOpen]);

  useEffect(() => {
    if (!isProfileOpen) return;
    const onClickAway = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("pointerdown", onClickAway);
    return () => document.removeEventListener("pointerdown", onClickAway);
  }, [isProfileOpen]);

  return (
    <header className="w-full bg-(--color-surface) border-b border-(--color-border) flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 h-16 flex-shrink-0 z-30">
      <button
        className="lg:hidden flex-shrink-0 w-9 h-9 rounded-lg hover:bg-(--color-bg) flex items-center justify-center"
        onClick={onMenuClick}
        aria-label="Open menu"
        suppressHydrationWarning
      >
        <Icon icon="mdi:menu" width={22} />
      </button>

      <div className="relative hidden md:flex flex-1 max-w-md">
        <Icon
          icon="mdi:magnify"
          width={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"
        />
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search projects, leads, bookings…"
          className="w-full h-10 pl-10 pr-20 rounded-lg border border-(--color-border) bg-(--color-bg) text-small placeholder:text-(--color-text-secondary) focus:outline-none focus:bg-(--color-surface) focus:ring-4 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition"
          suppressHydrationWarning
        />
        {searchValue ? (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              searchInputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md hover:bg-(--color-bg) text-(--color-text-secondary) hover:text-(--color-text-primary) inline-flex items-center justify-center transition"
          >
            <Icon icon="mdi:close" width={14} />
          </button>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 min-w-[20px] h-5 rounded-md text-tiny font-semibold text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) shadow-[0_1px_0_rgba(0,0,0,0.05)] inline-flex items-center justify-center leading-none">
              {isMac ? "⌘" : "Ctrl"}
            </kbd>
            <kbd className="px-1.5 min-w-[20px] h-5 rounded-md text-tiny font-semibold text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) shadow-[0_1px_0_rgba(0,0,0,0.05)] inline-flex items-center justify-center leading-none">
              K
            </kbd>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <NotificationBell />
        <ThemeToggle />

        <button
          aria-label="Help"
          className="hidden md:inline-flex w-10 h-10 rounded-full hover:bg-(--color-bg) items-center justify-center text-(--color-text-primary)"
          suppressHydrationWarning
        >
          <Icon icon="mdi:help-circle-outline" width={20} />
        </button>

        <div className="hidden sm:block h-7 w-px bg-(--color-border) mx-1" />

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            className={cn(
              "flex items-center gap-2 pl-1 pr-2 sm:pr-3 h-11 rounded-lg transition-colors",
              isProfileOpen ? "bg-(--color-bg)" : "hover:bg-(--color-bg)"
            )}
            suppressHydrationWarning
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-(--color-primary) to-(--color-secondary) text-white flex items-center justify-center text-tiny font-semibold shadow-sm shadow-(--color-primary)/20">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-small font-semibold text-(--color-text-primary)">{displayName}</p>
              <p className="text-tiny text-(--color-text-secondary) capitalize">{role}</p>
            </div>
            <Icon
              icon="mdi:chevron-down"
              width={14}
              className={cn(
                "hidden sm:block text-(--color-text-secondary) transition-transform",
                isProfileOpen && "rotate-180"
              )}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full pt-2 z-40">
              <div
                role="menu"
                className="w-72 bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden"
                style={{ boxShadow: "var(--shadow-popover)" }}
              >
                <div className="px-4 py-4 border-b border-(--color-border) flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-(--color-primary) to-(--color-secondary) text-white flex items-center justify-center text-small font-semibold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold text-(--color-text-primary) truncate">
                      {displayName}
                    </p>
                    {email ? (
                      <p className="text-tiny text-(--color-text-secondary) truncate">{email}</p>
                    ) : (
                      <p className="text-tiny text-(--color-text-secondary) capitalize truncate">{role}</p>
                    )}
                  </div>
                </div>
                <div className="p-1.5">
                  <DropdownItem
                    icon="mdi:bell-outline"
                    label="Notifications"
                    href={ROUTES.notifications}
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="my-1 h-px bg-(--color-border)" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium text-(--color-danger) hover:bg-(--color-danger)/10 disabled:opacity-50 transition-colors"
                  >
                    <Icon icon="mdi:logout" width={18} />
                    {isPending ? "Logging out…" : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ icon, label, href, onClick }) {
  const cls =
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium text-(--color-text-primary) hover:bg-(--color-bg) transition-colors";
  const content = (
    <>
      <Icon icon={icon} width={18} className="text-(--color-text-secondary)" />
      <span className="flex-1 text-left">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} onClick={onClick} role="menuitem" className={cls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} role="menuitem" className={cls}>
      {content}
    </button>
  );
}
