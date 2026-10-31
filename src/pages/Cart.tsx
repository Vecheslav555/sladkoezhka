import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { safeImage } from '../shared/imagePicker'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react'
import type { RootState } from '../app/store'
import { remove, setQty, applyPromo } from '../entities/cartSlice'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

export default function CartPage() {
  const items = useSelector((s: RootState) => s.cart.items)
  const promo = useSelector((s: RootState) => s.cart.promoDiscount)
  const products = useSelector((s: RootState) => s.catalog.products)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const [code, setCode] = useState('')

  const detailed = items.map((i, idx) => {
    const p = products.find(x => x.id === i.productId)
    if (!p) return null
    const v = p.variants?.find(v => v.name === i.variant)
    const price = p.price + (v?.priceDelta ?? 0)
    return { ...i, idx, p, price, sum: price * i.qty }
  }).filter(Boolean) as Array<{ idx:number; p:any; price:number; sum:number; qty:number; variant?:string }>

  const subtotal = detailed.reduce((a, i) => a + i.sum, 0)
  const delivery = subtotal > 0 ? 200 : 0
  const discount = Math.round(subtotal * promo / 100)
  const total = subtotal + delivery - discount

  if (items.length === 0) {
    return (
      <AnimatedPage>
        <div className="max-w-6xl mx-auto p-6 text-center py-16">
          <div className="text-7xl mb-4">🛒</div>
          <p className="text-slate-600 text-lg">Корзина пуста</p>
          <Link to="/catalog" className="btn-primary mt-6 inline-flex">
            <ShoppingBag size={18} /> В каталог
          </Link>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Корзина</h1>
          <AnimatePresence>
            {detailed.map(i => (
              <motion.div
                key={i.idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="card p-3 flex gap-3 items-center"
              >
                <img
  src={safeImage(i.p.image, i.p.category)}
  alt=""
  className="w-20 h-20 object-cover rounded-2xl bg-brand-100 shrink-0"
/>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${i.p.slug}`} className="font-semibold hover:text-brand-600">
                    {i.p.name}
                  </Link>
                  {i.variant && <div className="text-xs text-slate-500">{i.variant}</div>}
                  <div className="text-brand-600 font-bold">{i.price} ₽</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border-2 border-brand-200 rounded-xl bg-white">
                    <button className="px-2 py-1" onClick={() => dispatch(setQty({ index: i.idx, qty: i.qty - 1 }))}>−</button>
                    <span className="px-2 font-semibold">{i.qty}</span>
                    <button className="px-2 py-1" onClick={() => dispatch(setQty({ index: i.idx, qty: i.qty + 1 }))}>+</button>
                  </div>
                  <button
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                    onClick={() => {
                      dispatch(remove(i.idx))
                      toast('Удалено из корзины', 'success')
                    }}
                  >
                    <Trash2 size={12} /> Удалить
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="card p-5 h-fit space-y-3 sticky top-20">
          <h2 className="font-bold text-lg">Итого</h2>
          <div className="flex justify-between text-sm"><span>Товары</span><span>{subtotal} ₽</span></div>
          <div className="flex justify-between text-sm"><span>Доставка</span><span>{delivery} ₽</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Промокод</span><span>−{discount} ₽</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Всего</span><span className="text-gradient">{total} ₽</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="SWEET10"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <button
              className="btn-ghost"
              onClick={() => {
                if (code.toUpperCase() === 'SWEET10') {
                  dispatch(applyPromo({ code, discount: 10 }))
                  toast('Промокод применён: −10%')
                } else {
                  toast('Промокод не найден', 'error')
                }
              }}
            >
              OK
            </button>
          </div>
          <button className="btn-primary w-full" onClick={() => nav('/checkout')}>
            Оформить заказ <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </AnimatedPage>
  )
}