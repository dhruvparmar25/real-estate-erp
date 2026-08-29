import { getSessionUser } from "@/lib/actions/auth.actions";

export async function readServerSession() {
  return getSessionUser();
}
