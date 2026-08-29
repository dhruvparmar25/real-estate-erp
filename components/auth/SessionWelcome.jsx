"use client";

import { useEffect, useRef } from "react";
import { LOGIN_FLASH_COOKIE } from "@/constants/auth.constants";
import { notifySuccess } from "@/utils/notify";

function readFlashCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOGIN_FLASH_COOKIE}=`));
  if (!match) return null;
  const value = match.slice(LOGIN_FLASH_COOKIE.length + 1);
  if (!value) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function clearFlashCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${LOGIN_FLASH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export default function SessionWelcome() {
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    const flash = readFlashCookie();
    if (!flash) return;
    shownRef.current = true;
    clearFlashCookie();
    const name = flash.first_name?.trim() || flash.fullName?.trim() || "back";
    const role = flash.role_display_name?.trim() || flash.role?.trim() || "your workspace";
    notifySuccess(`Welcome, ${name}`, {
      id: "session-welcome",
      description: `Signed in as ${role}. Ready to pick up where you left off.`,
    });
  }, []);

  return null;
}
