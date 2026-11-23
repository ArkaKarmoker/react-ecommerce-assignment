import { useEffect, useMemo, useState } from 'react'
import { Sparkles, PackageSearch } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../api/productsApi'
import heroBannerImg from '../assets/hero-banner.jpg'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // Search, Category Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')

  useEffect(() => {
    let isCancelled = false

    async function loadStoreData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories().catch(() => null),
        ])

        if (isCancelled) return

        setProducts(productsData)

        if (
          Array.isArray(categoriesData) &&
          categoriesData.length > 0 &&
          categoriesData.every((c) => typeof c === 'string')
        ) {
          setCategories(categoriesData)
        } else {
          const derivedCategories = [
            ...new Set(
              productsData.map((item) => item.category).filter(Boolean)
            ),
          ]
          setCategories(derivedCategories)
        }
        setError('')
      } catch (err) {
        if (isCancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load products. Please check your internet connection.'
        )
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadStoreData()

    return () => {
      isCancelled = true
    }
  }, [retryCount])

  function handleRetry() {
    setLoading(true)
    setError('')
    setRetryCount((prev) => prev + 1)
  }

  // Combined Search + Category Filter + Price Sorting
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    const matched = products.filter((product) => {
      const matchesName =
        normalizedSearch === '' ||
        product.title.toLowerCase().includes(normalizedSearch)
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory

      return matchesName && matchesCategory
    })

    if (sortOrder === 'low-to-high') {
      return [...matched].sort((a, b) => a.price - b.price)
    }
    if (sortOrder === 'high-to-low') {
      return [...matched].sort((a, b) => b.price - a.price)
    }
    return matched
  }, [products, searchQuery, selectedCategory, sortOrder])

  function handleResetFilters() {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortOrder('default')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      {/* Hero Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#4345E0_0%,#4A4EE6_52%,#654FE5_76%,#8448E6_100%)] px-5 py-6 text-white shadow-lg shadow-indigo-600/20 sm:mb-8 sm:rounded-3xl sm:px-10 sm:py-10 lg:py-4">
        {/* Subtle decorative glow accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -bottom-24 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:py-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              New Season Collection
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Discover Quality Products at the Best Prices
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-50/95 sm:mt-2.5 sm:text-base">
              Browse electronics, fashion, jewelry, and everyday essentials with
              instant search, category filtering, and seamless cart management.
            </p>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            <img
              src={heroBannerImg}
              alt="Curated collection featuring electronics, fashion, jewelry, and shopping bag"
              style={{
                maskImage:
                  'radial-gradient(ellipse 47% 47% at 50% 51%, #000 60%, rgba(0, 0, 0, 0.72) 74%, rgba(0, 0, 0, 0.22) 88%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 47% 47% at 50% 51%, #000 60%, rgba(0, 0, 0, 0.72) 74%, rgba(0, 0, 0, 0.22) 88%, transparent 100%)',
              }}
              className="w-full max-w-[260px] object-contain select-none sm:max-w-md lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* Loading Indicator */}
      {loading && <Loader message="Loading products from store..." count={8} />}

      {/* API Error Handling */}
      {!loading && error && (
        <ErrorState
          title="Could not load products"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            categories={categories}
            totalCount={products.length}
            filteredCount={filteredProducts.length}
            onReset={handleResetFilters}
          />

          {filteredProducts.length === 0 ? (
            <div className="my-12 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <PackageSearch className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                No matching products found
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search keyword or clearing active category
                filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <section
              aria-label="Products Grid"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
