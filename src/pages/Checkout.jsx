import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  clearCart,
} from '../store/cartSlice'
import { removeManyFromWishlist } from '../store/wishlistSlice'
import { formatPrice } from '../api/productsApi'
import ProductImage from '../components/ProductImage'

export default function Checkout() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalItemsCount = useSelector(selectCartItemCount)
  const subtotal = useSelector(selectCartSubtotal)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  })

  const [placedOrder, setPlacedOrder] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handlePlaceOrder(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    const orderSnapshot = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: { ...formData },
      items: [...cartItems],
      itemCount: totalItemsCount,
      subtotal,
      total: subtotal,
      placedAt: new Date().toLocaleString(),
    }

    const purchasedProductIds = cartItems.map((item) => item.id)

    setPlacedOrder(orderSnapshot)
    dispatch(clearCart())
    dispatch(removeManyFromWishlist(purchasedProductIds))
    toast.success('Order placed successfully!')
  }

  // Order Confirmation Screen
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          data-testid="order-confirmation"
          className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-xs sm:p-10"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Order Confirmed • {placedOrder.orderId}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Thank you for your purchase, {placedOrder.customer.fullName}!
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              A confirmation email has been sent to{' '}
              <strong className="text-slate-700">
                {placedOrder.customer.email}
              </strong>
              .
            </p>
          </div>

          {/* Order Summary Receipt */}
          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">
              Order Summary ({placedOrder.itemCount}{' '}
              {placedOrder.itemCount === 1 ? 'item' : 'items'})
            </h2>

            <div className="mt-4 divide-y divide-slate-200/70">
              {placedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="pr-4">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-extrabold text-slate-900">
              <span>Total Paid</span>
              <span className="text-indigo-600">
                {formatPrice(placedOrder.total)}
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty Cart guard on Checkout page
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            No items to checkout
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add some products to your shopping cart before proceeding to
            checkout.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Store</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12"
      >
        {/* Shipping & Payment Details */}
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555 234 5678"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Market Street, Apt 4B"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold text-slate-700"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
                  formData.paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <span>Credit / Debit Card</span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
                  formData.paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-4 max-h-72 divide-y divide-slate-100 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-50 p-1">
                      <ProductImage
                        src={item.image}
                        alt={item.title}
                        placeholderClassName="inset-0 rounded-md"
                        className="max-h-10 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <p className="line-clamp-1 text-xs font-bold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>
                  Subtotal ({totalItemsCount}{' '}
                  {totalItemsCount === 1 ? 'item' : 'items'})
                </span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
            >
              Place Order ({formatPrice(subtotal)})
            </button>
          </div>
        </aside>
      </form>
    </div>
  )
}
