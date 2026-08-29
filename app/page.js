import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

export default function HomePage() {
  redirect(ROUTES.dashboard);
}
