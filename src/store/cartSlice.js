import { createSlice } from '@reduxjs/toolkit'

const CART_STORAGE_KEY = 'shopverse_cart_items'

function loadCartFromStorage() {
  try {
    const serialized = localStorage.getItem(CART_STORAGE_KEY)
    if (!serialized) return []
    const parsed = JSON.parse(serialized)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage quota or private mode errors
  }
}

const initialState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      if (!product || product.id === undefined) return

      const quantityToAdd =
        typeof product.quantity === 'number' && product.quantity > 0
          ? product.quantity
          : 1

      const existingItem = state.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantityToAdd
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image: product.image,
          category: product.category,
          description: product.description || '',
          rating: product.rating || { rate: 0, count: 0 },
          quantity: quantityToAdd,
        })
      }

      saveCartToStorage(state.items)
    },

    removeFromCart: (state, action) => {
      const targetId =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.id
          : action.payload

      state.items = state.items.filter((item) => item.id !== targetId)
      saveCartToStorage(state.items)
    },

    increaseQuantity: (state, action) => {
      const targetId =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.id
          : action.payload

      const item = state.items.find((entry) => entry.id === targetId)
      if (item) {
        item.quantity += 1
        saveCartToStorage(state.items)
      }
    },

    decreaseQuantity: (state, action) => {
      const targetId =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.id
          : action.payload

      const item = state.items.find((entry) => entry.id === targetId)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        saveCartToStorage(state.items)
      }
    },

    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartUniqueCount = (state) => state.cart.items.length

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer
