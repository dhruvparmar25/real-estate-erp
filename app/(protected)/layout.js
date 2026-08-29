import { redirect } from "next/navigation";
import { readServerSession } from "@/lib/auth";
import { ROUTES } from "@/constants/routes.constants";
import AppShell from "@/components/layout/AppShell";

export default async function ProtectedLayout({ children }) {
  const session = await readServerSession();
  if (!session) redirect(`${ROUTES.login}?next=${ROUTES.dashboard}`);
  return <AppShell>{children}</AppShell>;
}
