export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-[var(--shadow-popover)] px-8 py-10 sm:px-10">
      {children}
    </div>
  );
}
