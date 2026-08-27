import { cn } from "@/utils/cn";
import { ENV } from "@/config/env";
const LOGO = {
    light: "/logo-light.png",
    dark: "/logo-dark.png",
    width: 440,
    height: 154,
    alt: ENV.appName,
};
export default function BrandLogo({ className, priority = false }) {
    const shared = {
        width: LOGO.width,
        height: LOGO.height,
        alt: LOGO.alt,
        draggable: false,
        decoding: "async",
        loading: priority ? "eager" : "lazy",
        fetchPriority: priority ? "high" : "auto",
    };
    const base = "w-auto object-contain select-none";
    return (<>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...shared} alt={LOGO.alt} src={LOGO.light} className={cn(base, "block dark:hidden", className)}/>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...shared} alt={LOGO.alt} src={LOGO.dark} className={cn(base, "hidden dark:block", className)}/>
    </>);
}
