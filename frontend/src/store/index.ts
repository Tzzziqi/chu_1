import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
// 队友后面加：
// import productReducer from './productSlice'
// import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // product: productReducer,
    // cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch