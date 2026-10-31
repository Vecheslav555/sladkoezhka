import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../shared/types'

interface CartState { items: CartItem[]; promo: string | null; promoDiscount: number }

const saved = localStorage.getItem('cart')
const initialState: CartState = saved ? JSON.parse(saved)
  : { items: [], promo: null, promoDiscount: 0 }

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (s, a: PayloadAction<{ productId: number; qty?: number; variant?: string }>) => {
      const ex = s.items.find(i => i.productId === a.payload.productId && i.variant === a.payload.variant)
      if (ex) ex.qty += a.payload.qty ?? 1
      else s.items.push({ productId: a.payload.productId, qty: a.payload.qty ?? 1, variant: a.payload.variant })
      persist(s)
    },
    remove: (s, a: PayloadAction<number>) => {
      s.items = s.items.filter((_, i) => i !== a.payload); persist(s)
    },
    setQty: (s, a: PayloadAction<{ index: number; qty: number }>) => {
      if (a.payload.qty <= 0) s.items.splice(a.payload.index, 1)
      else s.items[a.payload.index].qty = a.payload.qty
      persist(s)
    },
    applyPromo: (s, a: PayloadAction<{ code: string; discount: number }>) => {
      s.promo = a.payload.code; s.promoDiscount = a.payload.discount; persist(s)
    },
    clearPromo: (s) => { s.promo = null; s.promoDiscount = 0; persist(s) },
    clear: (s) => { s.items = []; s.promo = null; s.promoDiscount = 0; persist(s) },
  },
})
function persist(s: CartState) { localStorage.setItem('cart', JSON.stringify(s)) }

export const { add, remove, setQty, applyPromo, clearPromo, clear } = slice.actions
export default slice.reducer