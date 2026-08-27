import "./globals.css";
import { AppProviders } from "@/components/common/AppProviders";

export const metadata = {
  title: "Real Estate ERP",
  description: "Real Estate Enterprise Resource Planning System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
