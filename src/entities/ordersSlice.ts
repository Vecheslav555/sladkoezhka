import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Order, OrderStatus } from '../shared/types'
import { SEED_ORDERS } from '../shared/seedData'

interface OrdersState { orders: Order[] }

const saved = localStorage.getItem('orders')
const initialState: OrdersState = saved ? JSON.parse(saved) : { orders: SEED_ORDERS }

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (s, a: PayloadAction<Order>) => {
      s.orders.unshift(a.payload); persist(s)
    },
    setStatus: (s, a: PayloadAction<{ id: number; status: OrderStatus }>) => {
      const o = s.orders.find(o => o.id === a.payload.id)
      if (o) o.status = a.payload.status
      persist(s)
    },
    cancelOrder: (s, a: PayloadAction<number>) => {
      const o = s.orders.find(o => o.id === a.payload)
      if (o) o.status = 'canceled'
      persist(s)
    },
    deleteOrder: (s, a: PayloadAction<number>) => {
      s.orders = s.orders.filter(o => o.id !== a.payload); persist(s)
    },
  },
})
function persist(s: OrdersState) { localStorage.setItem('orders', JSON.stringify(s)) }

export const { addOrder, setStatus, cancelOrder, deleteOrder } = slice.actions
export default slice.reducer