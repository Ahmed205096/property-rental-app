interface SkeletonLoaderProps {
  className?: string;
}

export default function SkeletonLoader({
  className = "bg-white border border-gray-300 rounded-[12px] p-[24px] shadow-sm min-h-[220px]",
}: SkeletonLoaderProps) {
  return (
    <div className={className}>
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-6 w-1/3 bg-gray-200" />
        <div className="skeleton h-4 w-2/3 bg-gray-200" />
        <div className="skeleton h-4 w-1/2 bg-gray-200" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="skeleton h-24 w-full bg-gray-200" />
          <div className="skeleton h-24 w-full bg-gray-200" />
          <div className="skeleton h-24 w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
