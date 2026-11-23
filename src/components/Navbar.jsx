import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Home,
  Menu,
  X,
} from 'lucide-react'
import { selectCartItemCount } from '../store/cartSlice'
import { selectWishlistCount } from '../store/wishlistSlice'

function formatBadgeCount(count) {
  return count > 99 ? '99+' : String(count)
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItemCount = useSelector(selectCartItemCount)
  const wishlistCount = useSelector(selectWishlistCount)

  const navLinkClasses = ({ isActive }) =>
    `inline-flex min-h-[42px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors md:min-h-0 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  const actionLinkClasses = ({ isActive }) =>
    `group inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-3 sm:px-6 sm:py-3.5 lg:px-8"
      >
        {/* Application Logo & Name */}
        <Link
          to="/"
          className="group flex items-center gap-2 focus:outline-none sm:gap-2.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Shop<span className="text-indigo-600">Verse</span>
            </span>
            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Versatile Online Store
            </span>
          </div>
        </Link>

        {/* Desktop Links & Action Icons with Top-Right Corner Badges */}
        <div className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" end className={navLinkClasses}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </NavLink>

          <span
            aria-hidden="true"
            className="mx-1.5 h-5 w-px bg-slate-200"
          />

          {/* Wishlist Link with Icon Corner Badge */}
          <NavLink to="/wishlist" className={actionLinkClasses}>
            <span className="relative inline-flex items-center justify-center">
              <Heart
                className={`h-5 w-5 transition-colors ${
                  wishlistCount > 0 ? 'text-rose-500' : ''
                }`}
              />
              <span
                data-testid="wishlist-item-count"
                aria-label={`Wishlist items: ${wishlistCount}`}
                className={`absolute -top-2 -right-2.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ring-2 ring-white transition-colors ${
                  wishlistCount > 0
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {formatBadgeCount(wishlistCount)}
              </span>
            </span>
            <span>Wishlist</span>
          </NavLink>

          {/* Cart Link with Icon Corner Badge */}
          <NavLink to="/cart" className={actionLinkClasses}>
            <span className="relative inline-flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
              <span
                data-testid="cart-item-count"
                aria-label={`Cart items: ${cartItemCount}`}
                className={`absolute -top-2 -right-2.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ring-2 ring-white transition-colors ${
                  cartItemCount > 0
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {formatBadgeCount(cartItemCount)}
              </span>
            </span>
            <span>Cart</span>
          </NavLink>
        </div>

        {/* Mobile Quick Wishlist, Cart & Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            onClick={() => setMobileMenuOpen(false)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Heart
              className={`h-5 w-5 ${wishlistCount > 0 ? 'text-rose-500' : ''}`}
            />
            <span
              className={`absolute -top-1.5 -right-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ring-2 ring-white ${
                wishlistCount > 0
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {formatBadgeCount(wishlistCount)}
            </span>
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart (${cartItemCount} items)`}
            onClick={() => setMobileMenuOpen(false)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ShoppingCart className="h-5 w-5" />
            <span
              data-testid="mobile-cart-item-count"
              className={`absolute -top-1.5 -right-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ring-2 ring-white ${
                cartItemCount > 0
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {formatBadgeCount(cartItemCount)}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
          <div className="flex flex-col gap-1.5">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                  wishlistCount > 0
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {formatBadgeCount(wishlistCount)}
              </span>
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                  cartItemCount > 0
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {formatBadgeCount(cartItemCount)}
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
