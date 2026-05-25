import SkeletonLoader from "@/app/components/SkeletonLoader";

export default function DetailsLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] pb-16 pt-[104px]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-[100px]">
        <SkeletonLoader className="bg-white border border-gray-300 rounded-[12px] p-[24px] shadow-sm min-h-[260px]" />
      </div>
    </main>
  );
}
