import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function NotificationsLoading() {
  return (
    <div className="pb-6 w-full max-w-6xl mx-auto">
      <LoadingSkeleton className="h-8 w-48 mb-2" />
      <LoadingSkeleton className="h-4 w-72 mb-5" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>

      <LoadingSkeleton className="h-14 rounded-xl mb-5" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
