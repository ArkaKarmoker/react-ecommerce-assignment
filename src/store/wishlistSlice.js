import { createSlice } from '@reduxjs/toolkit'

const WISHLIST_STORAGE_KEY = 'shopverse_wishlist_items'

function loadWishlistFromStorage() {
  try {
    const serialized = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!serialized) return []
    const parsed = JSON.parse(serialized)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveWishlistToStorage(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

const initialState = {
  items: loadWishlistFromStorage(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      if (!product || product.id === undefined) return

      const index = state.items.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image: product.image,
          category: product.category,
          description: product.description || '',
          rating: product.rating || { rate: 0, count: 0 },
        })
      }
      saveWishlistToStorage(state.items)
    },

    removeFromWishlist: (state, action) => {
      const targetId =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.id
          : action.payload

      state.items = state.items.filter((item) => item.id !== targetId)
      saveWishlistToStorage(state.items)
    },

    removeManyFromWishlist: (state, action) => {
      const ids = Array.isArray(action.payload) ? action.payload : []
      if (ids.length === 0) return

      const idSet = new Set(ids)
      state.items = state.items.filter((item) => !idSet.has(item.id))
      saveWishlistToStorage(state.items)
    },

    clearWishlist: (state) => {
      state.items = []
      saveWishlistToStorage(state.items)
    },
  },
})

export const {
  toggleWishlist,
  removeFromWishlist,
  removeManyFromWishlist,
  clearWishlist,
} = wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length

export default wishlistSlice.reducer
