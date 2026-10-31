import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, Shop } from '../shared/types'
import { SEED_PRODUCTS, SEED_SHOPS } from '../shared/seedData'

interface CatalogState { products: Product[]; shops: Shop[] }

const saved = localStorage.getItem('catalog')
const initialState: CatalogState = saved ? JSON.parse(saved)
  : { products: SEED_PRODUCTS, shops: SEED_SHOPS }

const slice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    addProduct: (s, a: PayloadAction<Omit<Product,'id'|'slug'>>) => {
      const id = Math.max(0, ...s.products.map(p=>p.id)) + 1
      const slug = a.payload.name.toLowerCase()
        .replace(/\s+/g,'-').replace(/[^a-zа-я0-9-]/gi,'') + '-' + id
      s.products.unshift({ ...a.payload, id, slug })
      persist(s)
    },
    updateProduct: (s, a: PayloadAction<Product>) => {
      const i = s.products.findIndex(p => p.id === a.payload.id)
      if (i >= 0) s.products[i] = a.payload
      persist(s)
    },
    deleteProduct: (s, a: PayloadAction<number>) => {
      s.products = s.products.filter(p => p.id !== a.payload); persist(s)
    },
    toggleAvailable: (s, a: PayloadAction<number>) => {
      const p = s.products.find(p => p.id === a.payload)
      if (p) p.isAvailable = !p.isAvailable
      persist(s)
    },
    addShop: (s, a: PayloadAction<Omit<Shop,'id'>>) => {
      const id = Math.max(0, ...s.shops.map(x=>x.id)) + 1
      s.shops.unshift({ ...a.payload, id }); persist(s)
    },
    updateShop: (s, a: PayloadAction<Shop>) => {
      const i = s.shops.findIndex(x => x.id === a.payload.id)
      if (i >= 0) s.shops[i] = a.payload
      persist(s)
    },
    deleteShop: (s, a: PayloadAction<number>) => {
      s.shops = s.shops.filter(x => x.id !== a.payload); persist(s)
    },
    resetCatalog: (s) => {
      s.products = SEED_PRODUCTS; s.shops = SEED_SHOPS; persist(s)
    },
  },
})
function persist(s: CatalogState) { localStorage.setItem('catalog', JSON.stringify(s)) }

export const {
  addProduct, updateProduct, deleteProduct, toggleAvailable,
  addShop, updateShop, deleteShop, resetCatalog,
} = slice.actions
export default slice.reducer