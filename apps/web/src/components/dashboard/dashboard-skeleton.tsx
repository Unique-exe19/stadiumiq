export function DashboardSkeleton() {
  return (
    <div
      className="pt-24 px-4 sm:px-6 lg:px-8 pb-8 max-w-[1600px] mx-auto animate-pulse"
      aria-label="Loading dashboard..."
      aria-busy="true"
      role="status"
    >
      <div className="h-8 w-64 bg-white/10 rounded-xl mb-2" />
      <div className="h-4 w-40 bg-white/5 rounded-lg mb-6" />
      <div className="grid grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 h-80 bg-white/5 rounded-2xl" />
        <div className="col-span-4 space-y-4">
          <div className="h-36 bg-white/5 rounded-2xl" />
          <div className="h-36 bg-white/5 rounded-2xl" />
        </div>
        <div className="col-span-3 space-y-4">
          <div className="h-48 bg-white/5 rounded-2xl" />
          <div className="h-24 bg-white/5 rounded-2xl" />
        </div>
        <div className="col-span-12 h-40 bg-white/5 rounded-2xl" />
      </div>
      <span className="sr-only">Loading operations dashboard...</span>
    </div>
  );
}
