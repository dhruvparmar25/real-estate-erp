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
  return (
    <>
      <Image
        src={LOGO.light}
        alt={LOGO.alt}
        width={LOGO.width}
        height={LOGO.height}
        priority={priority}
        className={cn("w-auto object-contain select-none block dark:hidden", className)}
      />
      <Image
        src={LOGO.dark}
        alt={LOGO.alt}
        width={LOGO.width}
        height={LOGO.height}
        priority={priority}
        className={cn("w-auto object-contain select-none hidden dark:block", className)}
      />
    </>
  );
}
