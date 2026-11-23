import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from '../store/wishlistSlice'
import { addToCart } from '../store/cartSlice'
import { formatCategory, formatPrice } from '../api/productsApi'
import ProductImage from '../components/ProductImage'
import ConfirmModal from '../components/ConfirmModal'

export default function Wishlist() {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(selectWishlistItems)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  function handleMoveToCart(product) {
    dispatch(addToCart(product))
    dispatch(removeFromWishlist(product.id))
    toast.success(`Moved "${product.title.slice(0, 26)}..." to cart!`)
  }

  function handleRemove(product) {
    dispatch(removeFromWishlist(product.id))
    toast('Removed from Wishlist', { icon: '💔' })
  }

  function handleConfirmClearWishlist() {
    dispatch(clearWishlist())
    setConfirmClearOpen(false)
    toast.success('Wishlist cleared')
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Your Wishlist is Empty
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Save your favorite items here while browsing so you can easily find
            and purchase them later.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1 ? 'product' : 'products'} saved for
            later
          </p>
        </div>

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Wishlist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {formatCategory(product.category)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(product)}
                  aria-label={`Remove ${product.title} from wishlist`}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                className="my-4 flex h-40 items-center justify-center rounded-xl bg-slate-50/40 p-4 sm:h-44"
              >
                <ProductImage
                  src={product.image}
                  alt={product.title}
                  placeholderClassName="inset-0 rounded-xl"
                  className="max-h-32 w-auto object-contain sm:max-h-36"
                />
              </Link>

              <Link
                to={`/product/${product.id}`}
                className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
              >
                {product.title}
              </Link>

              <div className="mt-auto pt-4">
                <p className="mb-3 text-lg font-bold text-slate-900">
                  {formatPrice(product.price)}
                </p>
                <button
                  type="button"
                  onClick={() => handleMoveToCart(product)}
                  className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      <ConfirmModal
        isOpen={confirmClearOpen}
        title="Clear Wishlist?"
        message="Are you sure you want to remove all saved items from your wishlist?"
        confirmLabel="Yes, Clear Wishlist"
        onConfirm={handleConfirmClearWishlist}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  )
}
