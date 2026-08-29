import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg) p-6">
      <LoadingSkeleton className="h-10 w-48" />
    </div>
  );
}
