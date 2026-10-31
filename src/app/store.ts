import { configureStore } from '@reduxjs/toolkit'
import cart from '../entities/cartSlice'
import auth from '../entities/authSlice'
import catalog from '../entities/catalogSlice'
import orders from '../entities/ordersSlice'

export const store = configureStore({
  reducer: { cart, auth, catalog, orders },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch