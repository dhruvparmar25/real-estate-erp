import Image from "next/image";
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
    priority,
    className: cn("w-auto object-contain select-none", className),
  };

  return (
    <>
      <Image
        src={LOGO.light}
        {...shared}
        className={cn(shared.className, "block dark:hidden")}
      />
      <Image
        src={LOGO.dark}
        {...shared}
        className={cn(shared.className, "hidden dark:block")}
      />
    </>
  );
}
