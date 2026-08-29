import BrandLogo from "@/components/common/BrandLogo";

export default function AuthShell({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-(--color-bg) overflow-hidden">
      <header className="absolute top-0 left-0 z-20 px-6 sm:px-10 pt-6">
        <BrandLogo className="h-12 rounded-md" priority />
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4 sm:px-10 pt-24 pb-10">
        {children}
      </div>
    </div>
  );
}
