import { useParams, Link } from 'react-router-dom'
import { safeImage, defaultImageFor } from '../shared/imagePicker'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ArrowLeft } from 'lucide-react'
import type { RootState } from '../app/store'
import { add } from '../entities/cartSlice'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

export default function ProductPage() {
  const { slug } = useParams()
  const product = useSelector((s: RootState) => s.catalog.products.find(x => x.slug === slug))
  const shop = useSelector((s: RootState) =>
    product ? s.catalog.shops.find(x => x.slug === product.shopSlug) : null)
  const [variant, setVariant] = useState(product?.variants?.[0]?.name ?? '')
  const [qty, setQty] = useState(1)
  const dispatch = useDispatch()
  const toast = useToast()

  if (!product) return (
    <div className="max-w-6xl mx-auto p-6">Товар не найден</div>
  )

  const priceDelta = product.variants?.find(v => v.name === variant)?.priceDelta ?? 0
  const totalPrice = product.price + priceDelta

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-4">
          <ArrowLeft size={16} /> Назад в каталог
        </Link>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card overflow-hidden aspect-square bg-brand-100"
          >
           <img
  src={safeImage(product.image, product.category)}
  alt={product.name}
  onError={(e) => {
    const img = e.currentTarget as HTMLImageElement
    if (img.dataset.fb) return
    img.dataset.fb = '1'
    img.src = defaultImageFor(product.category)
  }}
  className="w-full h-full object-cover"
/>
          </motion.div>
          <div className="space-y-4">
            {shop && (
              <Link to={`/shop/${shop.slug}`} className="text-sm text-slate-500 hover:text-brand-600">
                🏪 {shop.name} · ⭐ {shop.rating}
              </Link>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-slate-600">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gradient">{totalPrice} ₽</span>
              {product.oldPrice && (
                <span className="text-base line-through text-slate-400">{product.oldPrice} ₽</span>
              )}
            </div>

            {product.variants && (
              <div>
                <div className="font-medium mb-2">Вариант упаковки</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.name}
                      className={`btn-ghost text-sm ${variant===v.name ? 'bg-brand-500 text-white border-brand-500' : ''}`}
                      onClick={() => setVariant(v.name)}
                    >
                      {v.name} {v.priceDelta>0 && `+${v.priceDelta}₽`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="card p-3"><b>Вес:</b> {product.weight}</div>
              <div className="card p-3"><b>Срок:</b> {product.shelfLife}</div>
              <div className="card p-3"><b>КБЖУ:</b> {product.calories} ккал</div>
              <div className="card p-3"><b>Аллергены:</b> {product.allergens}</div>
            </div>
            <div className="card p-3 text-sm"><b>Состав:</b> {product.composition}</div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-brand-200 rounded-2xl bg-white">
                <button className="px-4 py-2" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <span className="px-3 font-semibold">{qty}</span>
                <button className="px-4 py-2" onClick={()=>setQty(q=>q+1)}>+</button>
              </div>
              <button
                className="btn-primary flex-1"
                onClick={() => {
                  dispatch(add({ productId: product.id, qty, variant }))
                  toast(`«${product.name}» × ${qty} в корзине`)
                }}
              >
                <ShoppingBag size={18} /> В корзину — {totalPrice*qty} ₽
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}