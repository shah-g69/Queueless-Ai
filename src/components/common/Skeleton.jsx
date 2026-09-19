/**
 * Skeleton – Animated loading placeholder.
 *
 * Props:
 *   className – extra classes
 *   width     – e.g. "w-full", "w-32"
 *   height    – e.g. "h-4", "h-10"
 *   rounded   – e.g. "rounded-xl", "rounded-full"
 */
const Skeleton = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "rounded-lg",
}) => {
  return (
    <div
      className={`skeleton-pulse ${width} ${height} ${rounded} ${className}`}
    />
  );
};

/**
 * SkeletonCard – Pre-built card skeleton matching the dashboard cards.
 */
export const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: "var(--skeleton-bg, #e2e8f0)" }}>
      <div className="flex flex-col gap-3">
        <Skeleton width="w-2/3" height="h-4" />
        <Skeleton width="w-full" height="h-3" />
        <Skeleton width="w-1/2" height="h-3" />
        <div className="mt-2 flex gap-2">
          <Skeleton width="w-20" height="h-8" rounded="rounded-xl" />
          <Skeleton width="w-24" height="h-8" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * SkeletonDashboard – Full dashboard skeleton layout.
 */
export const SkeletonDashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: "#e2e8f020" }}>
        <Skeleton width="w-[58px]" height="h-[58px]" rounded="rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton width="w-32" height="h-5" />
          <Skeleton width="w-20" height="h-3" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-[72px]" height="h-[72px]" rounded="rounded-full" />
        </div>
      </div>

      {/* Banner skeleton */}
      <Skeleton width="w-full" height="h-14" rounded="rounded-xl" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Bottom skeleton */}
      <SkeletonCard />
    </div>
  );
};

export default Skeleton;
