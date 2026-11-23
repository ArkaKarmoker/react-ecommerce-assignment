import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Heart, Star, Eye, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { addToCart, selectCartItems } from '../store/cartSlice'
import { toggleWishlist, selectWishlistItems } from '../store/wishlistSlice'
import { formatCategory, formatPrice } from '../api/productsApi'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const wishlistItems = useSelector(selectWishlistItems)

  const cartEntry = cartItems.find((item) => item.id === product.id)
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  function handleAddToCart() {
    dispatch(addToCart(product))
    toast.success(`Added "${product.title.slice(0, 28)}..." to cart!`)
  }

  function handleToggleWishlist() {
    dispatch(toggleWishlist(product))
    if (isWishlisted) {
      toast('Removed from Wishlist', { icon: '💔' })
    } else {
      toast.success('Saved to Wishlist!')
    }
  }

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
    >
      {/* Top Action Badges */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {formatCategory(product.category)}
        </span>

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'
          }
          className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors ${
            isWishlisted
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-500'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500' : ''}`}
          />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative flex h-44 items-center justify-center bg-slate-50/40 p-5 sm:h-52 sm:p-6"
      >
        <ProductImage
          src={product.image}
          alt={product.title}
          placeholderClassName="inset-0 rounded-xl"
          className="max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-40"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col border-t border-slate-100 p-4 sm:p-5">
        {/* Rating */}
        {product.rating && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {product.rating.rate}
            </span>
            <span>({product.rating.count} reviews)</span>
          </div>
        )}

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors hover:text-indigo-600"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Price & Actions */}
        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span
              data-testid={`product-price-${product.id}`}
              className="text-lg font-bold text-slate-900"
            >
              {formatPrice(product.price)}
            </span>

            {cartEntry && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                <Check className="h-3 w-3" />
                In cart ({cartEntry.quantity})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>

            <Link
              to={`/product/${product.id}`}
              aria-label={`View details for ${product.title}`}
              className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
