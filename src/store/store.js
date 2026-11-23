import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'

export function createAppStore(preloadedState) {
  return configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
    preloadedState,
  })
}

export const store = createAppStore()

export default store
