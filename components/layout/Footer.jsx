import { formatDate } from "@/utils/format";
import { ENV } from "@/config/env";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-(--color-surface) border-t border-(--color-border) px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-tiny text-(--color-text-secondary)">
      <p>© {year} {ENV.appName}. Enterprise Resource Planning.</p>
      <p className="flex items-center gap-3">
        <span>v{ENV.appVersion} (mock)</span>
        <span className="hidden md:inline">·</span>
        <span>Built {formatDate(new Date(), "dd MMM yyyy")}</span>
      </p>
    </footer>
  );
}
