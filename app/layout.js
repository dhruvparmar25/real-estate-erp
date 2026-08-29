import { cookies } from "next/headers";
import "./globals.css";
import { AppProviders } from "@/components/common/AppProviders";
import { THEME_COOKIE } from "@/store/ui.store";

export const metadata = {
  title: "Real Estate ERP",
  description: "Real Estate Enterprise Resource Planning System",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      className={initialTheme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProviders initialTheme={initialTheme}>{children}</AppProviders>
      </body>
    </html>
  );
}
