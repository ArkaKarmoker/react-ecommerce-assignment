import { describe, it, expect, beforeEach } from 'vitest'
import cartReducer, {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
} from '../store/cartSlice'
import wishlistReducer, {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../store/wishlistSlice'
import { createAppStore } from '../store/store'

const sampleProductA = {
  id: 1,
  title: 'Fjallraven Backpack',
  price: 109.95,
  category: "men's clothing",
  description: 'Your perfect pack for everyday use.',
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 3.9, count: 120 },
}

const sampleProductB = {
  id: 2,
  title: 'Mens Casual Slim Fit T-Shirt',
  price: 22.3,
  category: "men's clothing",
  description: 'Slim-fitting style, contrast raglan long sleeve.',
  image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg',
  rating: { rate: 4.1, count: 259 },
}

describe('Redux Toolkit Cart Slice & Store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('1. addToCart adds a new product with quantity 1 and increments if added again', () => {
    let state = cartReducer({ items: [] }, addToCart(sampleProductA))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id).toBe(1)
    expect(state.items[0].quantity).toBe(1)

    // Adding the same product increments quantity
    state = cartReducer(state, addToCart(sampleProductA))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem('shopverse_cart_items'))
    expect(saved).toHaveLength(1)
    expect(saved[0].quantity).toBe(2)
  })

  it('2. removeFromCart removes the matching product from the cart', () => {
    let state = cartReducer({ items: [] }, addToCart(sampleProductA))
    state = cartReducer(state, addToCart(sampleProductB))
    expect(state.items).toHaveLength(2)

    state = cartReducer(state, removeFromCart(1))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id).toBe(2)
  })

  it('3. increaseQuantity increases the quantity of a selected product', () => {
    let state = cartReducer({ items: [] }, addToCart(sampleProductA))
    state = cartReducer(state, increaseQuantity(1))
    expect(state.items[0].quantity).toBe(2)

    state = cartReducer(state, increaseQuantity({ id: 1 }))
    expect(state.items[0].quantity).toBe(3)
  })

  it('4. decreaseQuantity decreases quantity when > 1 and keeps minimum at 1', () => {
    let state = cartReducer(
      { items: [] },
      addToCart({ ...sampleProductA, quantity: 3 })
    )
    state = cartReducer(state, decreaseQuantity(1))
    expect(state.items[0].quantity).toBe(2)

    state = cartReducer(state, decreaseQuantity(1))
    expect(state.items[0].quantity).toBe(1)

    // Should not drop below 1 via decreaseQuantity
    state = cartReducer(state, decreaseQuantity(1))
    expect(state.items[0].quantity).toBe(1)
  })

  it('5. clearCart removes all products from the shopping cart', () => {
    let state = cartReducer({ items: [] }, addToCart(sampleProductA))
    state = cartReducer(state, addToCart(sampleProductB))
    expect(state.items).toHaveLength(2)

    state = cartReducer(state, clearCart())
    expect(state.items).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem('shopverse_cart_items'))).toEqual([])
  })

  it('computes cart selectors accurately through configureStore', () => {
    const store = createAppStore({
      cart: { items: [] },
      wishlist: { items: [] },
    })

    store.dispatch(addToCart(sampleProductA)) // 109.95 x 1
    store.dispatch(addToCart(sampleProductA)) // 109.95 x 2
    store.dispatch(addToCart(sampleProductB)) // 22.30 x 1

    const rootState = store.getState()
    expect(selectCartItems(rootState)).toHaveLength(2)
    expect(selectCartItemCount(rootState)).toBe(3)
    expect(selectCartSubtotal(rootState)).toBeCloseTo(109.95 * 2 + 22.3, 2)
  })
})

describe('Redux Toolkit Wishlist Slice (Bonus Feature)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggles, removes, and clears wishlist items with localStorage sync', () => {
    let state = wishlistReducer({ items: [] }, toggleWishlist(sampleProductA))
    expect(state.items).toHaveLength(1)

    // Toggling again removes it
    state = wishlistReducer(state, toggleWishlist(sampleProductA))
    expect(state.items).toHaveLength(0)

    // Add two items then remove one and clear
    state = wishlistReducer(state, toggleWishlist(sampleProductA))
    state = wishlistReducer(state, toggleWishlist(sampleProductB))
    expect(state.items).toHaveLength(2)

    state = wishlistReducer(state, removeFromWishlist(1))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id).toBe(2)

    state = wishlistReducer(state, clearWishlist())
    expect(state.items).toHaveLength(0)
  })
})
