import { Skeleton } from "@/src/shared/components/ui/Skeleton";

export default function TeacherDashboardLoading() {
  return (
    <div className="relative space-y-12">
      <div className="max-w-[1200px] mx-auto relative z-10 space-y-12">
        {/* Welcome Banner Skeleton */}
        <Skeleton className="w-full h-32 md:h-40 rounded-[20px]" />

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row-reverse gap-8">
          {/* Courses Skeleton */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-center mb-6">
              <Skeleton className="w-48 h-12 rounded-[10px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Skeleton className="h-[280px] w-full rounded-xl" />
              <Skeleton className="h-[280px] w-full rounded-xl" />
              <Skeleton className="h-[280px] w-full rounded-xl" />
              <Skeleton className="h-[280px] w-full rounded-xl" />
            </div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="flex justify-center mb-6">
              <Skeleton className="w-48 h-12 rounded-[10px]" />
            </div>
            <Skeleton className="w-full h-96 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
