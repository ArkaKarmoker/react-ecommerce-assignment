import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../store/cartSlice'
import { formatCategory, formatPrice } from '../api/productsApi'
import ConfirmModal from '../components/ConfirmModal'
import ProductImage from '../components/ProductImage'

export default function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalItemsCount = useSelector(selectCartItemCount)
  const subtotal = useSelector(selectCartSubtotal)

  // State for confirmation modal (Bonus feature: confirmation message before removing a product)
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    mode: null, // 'single' | 'clear'
    product: null,
  })

  const shippingCost = 0
  const totalPrice = subtotal + shippingCost

  function requestRemoveProduct(product) {
    setConfirmState({
      isOpen: true,
      mode: 'single',
      product,
    })
  }

  function requestClearCart() {
    setConfirmState({
      isOpen: true,
      mode: 'clear',
      product: null,
    })
  }

  function handleConfirmAction() {
    if (confirmState.mode === 'single' && confirmState.product) {
      dispatch(removeFromCart(confirmState.product.id))
      toast.success(`Removed "${confirmState.product.title.slice(0, 26)}..."`)
    } else if (confirmState.mode === 'clear') {
      dispatch(clearCart())
      toast.success('Cleared all items from cart')
    }
    setConfirmState({ isOpen: false, mode: null, product: null })
  }

  function handleDecrease(item) {
    if (item.quantity <= 1) {
      requestRemoveProduct(item)
    } else {
      dispatch(decreaseQuantity(item.id))
    }
  }

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div
          data-testid="empty-cart-message"
          className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs sm:rounded-3xl sm:p-12"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Your shopping cart is empty
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Looks like you haven&apos;t added any products to your cart yet.
            Explore our catalog to find items you&apos;ll love!
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            You have{' '}
            <strong className="text-slate-800">{totalItemsCount}</strong>{' '}
            {totalItemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={requestClearCart}
          className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
        {/* Cart Items List */}
        <section
          aria-label="Cart Items"
          className="space-y-4 lg:col-span-8"
        >
          {cartItems.map((item) => {
            const itemSubtotal = item.price * item.quantity
            return (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:p-5"
              >
                {/* Thumbnail + Details side-by-side on mobile */}
                <div className="flex flex-1 items-start gap-3.5 sm:items-center sm:gap-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2.5 sm:h-24 sm:w-24 sm:p-3"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.title}
                      placeholderClassName="inset-0 rounded-lg"
                      className="max-h-16 w-auto object-contain sm:max-h-20"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {formatCategory(item.category)}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      className="mt-1 line-clamp-2 block text-sm font-bold text-slate-900 hover:text-indigo-600 sm:text-base"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      Unit Price:{' '}
                      <span className="font-semibold text-slate-800">
                        {formatPrice(item.price)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Item Subtotal */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span
                        data-testid={`cart-item-qty-${item.id}`}
                        className="min-w-9 text-center text-sm font-bold text-slate-900"
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => requestRemoveProduct(item)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Item Subtotal</span>
                    <p
                      data-testid={`cart-item-subtotal-${item.id}`}
                      className="text-base font-extrabold text-slate-900"
                    >
                      {formatPrice(itemSubtotal)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Order Summary Panel */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 border-b border-slate-100 pb-5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>
                  Subtotal ({totalItemsCount}{' '}
                  {totalItemsCount === 1 ? 'item' : 'items'})
                </span>
                <span
                  data-testid="cart-subtotal"
                  className="font-semibold text-slate-900"
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping Estimate</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900">
                Total Price
              </span>
              <span
                data-testid="cart-total"
                className="text-2xl font-extrabold text-indigo-600"
              >
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal before removing a product or clearing cart */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={
          confirmState.mode === 'clear'
            ? 'Clear Shopping Cart?'
            : 'Remove Product from Cart?'
        }
        message={
          confirmState.mode === 'clear'
            ? 'Are you sure you want to remove all items from your shopping cart?'
            : `Are you sure you want to remove "${confirmState.product?.title || 'this product'}" from your shopping cart?`
        }
        confirmLabel={
          confirmState.mode === 'clear' ? 'Yes, Clear Cart' : 'Yes, Remove'
        }
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmState({ isOpen: false, mode: null, product: null })
        }
      />
    </div>
  )
}
