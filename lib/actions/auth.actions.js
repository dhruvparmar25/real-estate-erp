"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ENV } from "@/config/env";
import { ROUTES } from "@/constants/routes.constants";
import { LOGIN_FLASH_COOKIE } from "@/constants/auth.constants";
import { findMockUser, MOCK_CREDENTIALS } from "@/lib/auth-data";

const SESSION_TTL_SECONDS = 24 * 60 * 60;
const COOKIE_SECURE = process.env.NODE_ENV === "production";

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(token) {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (typeof parsed.user_id !== "string") return null;
    if (typeof parsed.exp !== "number") return null;
    if (parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function setSessionCookie(user) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = {
    user_id: user.id,
    username: user.username,
    role: user.role,
    exp,
  };
  const store = await cookies();
  store.set(ENV.sessionCookieName, encodePayload(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  const flash = Buffer.from(
    JSON.stringify({
      first_name: user.fullName?.split(" ")[0] ?? user.username,
      fullName: user.fullName,
      role: user.role,
      role_display_name: user.roleDisplayName,
    }),
    "utf8"
  ).toString("base64url");

  store.set(LOGIN_FLASH_COOKIE, flash, {
    httpOnly: false,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: 30,
  });
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(ENV.sessionCookieName)?.value;
  if (!token) return null;
  return decodePayload(token);
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  const user = findMockUser(session.username);
  if (!user) return null;
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    permissions: user.permissions,
  };
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prev, formData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return { fieldErrors: flat.fieldErrors };
  }

  const { username, password } = parsed.data;
  const user = findMockUser(username);
  const expected = user ? MOCK_CREDENTIALS[user.username] : null;

  if (!user || !expected || expected !== password) {
    return { error: "Invalid username or password." };
  }

  await setSessionCookie(user);
  redirect(ROUTES.dashboard);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ENV.sessionCookieName);
  store.delete(LOGIN_FLASH_COOKIE);
  redirect(ROUTES.login);
}
