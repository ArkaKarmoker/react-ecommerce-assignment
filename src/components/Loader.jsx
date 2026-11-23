export function FilterBarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5"
    >
      {/* Top Row: Search + 2 Compact Right-Aligned Dropdowns */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="skeleton-shimmer h-[44px] w-full rounded-xl md:max-w-md md:flex-1" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0">
          <div className="skeleton-shimmer h-[44px] w-full rounded-xl sm:w-40" />
          <div className="skeleton-shimmer h-[44px] w-full rounded-xl sm:w-44" />
        </div>
      </div>

      {/* Bottom Row: Category Pills + Product Count */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="skeleton-shimmer h-7 w-12 rounded-full" />
          <div className="skeleton-shimmer h-7 w-24 rounded-full" />
          <div className="skeleton-shimmer h-7 w-20 rounded-full" />
          <div className="skeleton-shimmer h-7 w-28 rounded-full" />
          <div className="skeleton-shimmer h-7 w-32 rounded-full" />
        </div>
        <div className="flex w-full justify-center pt-1 md:w-auto md:justify-end md:pt-0">
          <div className="skeleton-shimmer h-4 w-36 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs sm:rounded-3xl"
    >
      <span className="sr-only">Loading product details...</span>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10"
      >
        {/* Left Image Column */}
        <div className="lg:col-span-5">
          <div className="skeleton-shimmer min-h-64 h-full w-full rounded-2xl sm:min-h-80 lg:min-h-96" />
        </div>

        {/* Right Info Column */}
        <div className="flex flex-col lg:col-span-7">
          {/* Category + Rating badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="skeleton-shimmer h-6 w-28 rounded-full" />
            <div className="skeleton-shimmer h-6 w-36 rounded-full" />
          </div>

          {/* Title (2 lines) */}
          <div className="mt-4 space-y-2.5">
            <div className="skeleton-shimmer h-7 w-11/12 rounded-lg sm:h-8" />
            <div className="skeleton-shimmer h-7 w-2/3 rounded-lg sm:h-8" />
          </div>

          {/* Price + Stock pill */}
          <div className="mt-4 flex items-center gap-3">
            <div className="skeleton-shimmer h-8 w-28 rounded-lg sm:h-9" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          </div>

          {/* Description */}
          <div className="mt-5 border-t border-slate-100 pt-5 sm:mt-6 sm:pt-6">
            <div className="skeleton-shimmer h-3 w-36 rounded" />
            <div className="mt-3 space-y-2.5">
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="skeleton-shimmer h-4 w-11/12 rounded" />
              <div className="skeleton-shimmer h-4 w-4/5 rounded" />
            </div>
          </div>

          {/* Quantity Picker + Add to Cart + Wishlist */}
          <div className="mt-6 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="skeleton-shimmer h-12 w-32 shrink-0 rounded-xl" />
                <div className="skeleton-shimmer h-12 flex-1 rounded-xl sm:w-40 sm:flex-initial" />
              </div>
              <div className="skeleton-shimmer h-12 w-full rounded-xl sm:w-40" />
            </div>
          </div>

          {/* Value Guarantees */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="skeleton-shimmer h-[66px] rounded-xl" />
            <div className="skeleton-shimmer h-[66px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Loader({
  message = 'Loading products...',
  count = 8,
  showFilterSkeleton = true,
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{message}</span>

      {showFilterSkeleton && <FilterBarSkeleton />}

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
          >
            {/* Header Badges */}
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="skeleton-shimmer h-6 w-24 rounded-full" />
              <div className="skeleton-shimmer h-9 w-9 rounded-full" />
            </div>

            {/* Image Placeholder */}
            <div className="flex h-44 items-center justify-center p-4 sm:h-52 sm:p-5">
              <div className="skeleton-shimmer h-full w-full rounded-xl" />
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col border-t border-slate-100 p-4 sm:p-5">
              {/* Rating */}
              <div className="skeleton-shimmer mb-2.5 h-3.5 w-28 rounded" />

              {/* 2-line Title */}
              <div className="space-y-2">
                <div className="skeleton-shimmer h-4 w-full rounded" />
                <div className="skeleton-shimmer h-4 w-3/4 rounded" />
              </div>

              {/* Price + Action Buttons */}
              <div className="mt-auto pt-4">
                <div className="skeleton-shimmer mb-3 h-6 w-20 rounded-md" />
                <div className="flex items-center gap-2">
                  <div className="skeleton-shimmer h-[42px] flex-1 rounded-xl" />
                  <div className="skeleton-shimmer h-[42px] w-[42px] shrink-0 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
