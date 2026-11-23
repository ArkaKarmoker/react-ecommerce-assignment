import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchProductById,
  formatCategory,
  formatPrice,
} from '../api/productsApi'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist, selectWishlistItems } from '../store/wishlistSlice'
import ErrorState from '../components/ErrorState'
import { ProductDetailsSkeleton } from '../components/Loader'
import ProductImage from '../components/ProductImage'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [quantitySelection, setQuantitySelection] = useState({
    productId: id,
    count: 1,
  })

  const quantity =
    quantitySelection.productId === id ? quantitySelection.count : 1

  const wishlistItems = useSelector(selectWishlistItems)

  const isWishlisted = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false

  useEffect(() => {
    let isCancelled = false

    async function loadProductData() {
      try {
        const data = await fetchProductById(id)
        if (isCancelled) return
        setProduct(data)
        setError('')
      } catch (err) {
        if (isCancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load product details.'
        )
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadProductData()

    return () => {
      isCancelled = true
    }
  }, [id, retryCount])

  function handleRetry() {
    setLoading(true)
    setError('')
    setRetryCount((prev) => prev + 1)
  }

  function handleDecreaseQuantity() {
    setQuantitySelection({
      productId: id,
      count: Math.max(1, quantity - 1),
    })
  }

  function handleIncreaseQuantity() {
    setQuantitySelection({
      productId: id,
      count: quantity + 1,
    })
  }

  function handleAddToCart() {
    if (!product) return
    dispatch(addToCart({ ...product, quantity }))
    const label =
      quantity > 1
        ? `Added ${quantity} × "${product.title.slice(0, 26)}..." to cart!`
        : `Added "${product.title.slice(0, 30)}..." to cart!`
    toast.success(label)
    setQuantitySelection({ productId: id, count: 1 })
  }

  function handleToggleWishlist() {
    if (!product) return
    dispatch(toggleWishlist(product))
    if (isWishlisted) {
      toast('Removed from Wishlist', { icon: '💔' })
    } else {
      toast.success('Saved to Wishlist!')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && <ProductDetailsSkeleton />}

      {/* Error State */}
      {!loading && error && (
        <ErrorState
          title="Product Not Found"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Product Details Card */}
      {!loading && !error && product && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs sm:rounded-3xl">
          <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
            {/* Image Column */}
            <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-50 p-6 sm:min-h-80 sm:p-8 lg:col-span-5 lg:min-h-96">
              <ProductImage
                src={product.image}
                alt={product.title}
                loading="eager"
                placeholderClassName="inset-0 rounded-2xl"
                className="max-h-64 w-auto object-contain sm:max-h-80 lg:max-h-96"
              />
            </div>

            {/* Info Column */}
            <div className="flex flex-col lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {formatCategory(product.category)}
                </span>

                {product.rating && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.rate} / 5</span>
                    <span className="text-amber-600/80">
                      ({product.rating.count} ratings)
                    </span>
                  </div>
                )}
              </div>

              <h1 className="mt-3.5 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-4 sm:text-3xl">
                {product.title}
              </h1>

              <div className="mt-3.5 flex items-baseline gap-3 sm:mt-4">
                <span
                  data-testid="details-product-price"
                  className="text-2xl font-extrabold text-indigo-600 sm:text-3xl"
                >
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  In Stock
                </span>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5 sm:mt-6 sm:pt-6">
                <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Product Description
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Cart & Wishlist Actions */}
              <div className="mt-6 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Quantity Selector (only selects quantity; adds to cart on Add to Cart click) */}
                    <div
                      aria-label="Select quantity"
                      className="inline-flex h-12 shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 p-1"
                    >
                      <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        aria-label="Decrease selected quantity"
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        data-testid="selected-quantity"
                        className="min-w-9 text-center text-sm font-bold text-slate-900 sm:min-w-11"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        aria-label="Increase selected quantity"
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 sm:h-10 sm:w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold whitespace-nowrap text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.99] sm:flex-initial sm:px-6"
                    >
                      <ShoppingCart className="h-4 w-4 shrink-0" />
                      <span>
                        Add to Cart
                        {quantity > 1 ? ` (${quantity})` : ''}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    className={`inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold whitespace-nowrap transition-colors sm:w-auto ${
                      isWishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 shrink-0 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>
                      {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Value Guarantees */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                  <Truck className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Fast &amp; Free Delivery
                    </p>
                    <p className="text-xs text-slate-500">
                      Free standard shipping on all orders
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Authentic Guarantee
                    </p>
                    <p className="text-xs text-slate-500">
                      30-day hassle-free returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
