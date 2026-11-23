import { Search, SlidersHorizontal, ArrowUpDown, RotateCcw, X } from 'lucide-react'
import { formatCategory } from '../api/productsApi'
import Dropdown from './Dropdown'

const SORT_OPTIONS = [
  { value: 'default', label: 'Sort by: Featured' },
  { value: 'low-to-high', label: 'Price: Low to High' },
  { value: 'high-to-low', label: 'Price: High to Low' },
]

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
  categories = [],
  totalCount = 0,
  filteredCount = 0,
  onReset,
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    sortOrder !== 'default'

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat,
      label: formatCategory(cat),
    })),
  ]

  return (
    <section
      aria-label="Product Search and Filters"
      className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md md:flex-1">
          <label htmlFor="product-search" className="sr-only">
            Search products by name
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="product-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name..."
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-9 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Compact Right-Aligned Dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0">
          <Dropdown
            id="category-filter"
            ariaLabel="Filter by category"
            icon={SlidersHorizontal}
            value={selectedCategory}
            onChange={onCategoryChange}
            options={categoryOptions}
          />

          <Dropdown
            id="price-sort"
            ariaLabel="Sort by price"
            icon={ArrowUpDown}
            value={sortOrder}
            onChange={onSortChange}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Category Pills & Results Summary */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {formatCategory(cat)}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center justify-center gap-3 pt-1 text-xs text-slate-500 md:w-auto md:justify-end md:pt-0">
          <span>
            Showing <strong className="text-slate-800">{filteredCount}</strong>{' '}
            of <strong className="text-slate-800">{totalCount}</strong> products
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
