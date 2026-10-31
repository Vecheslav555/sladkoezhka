import { Link } from 'react-router-dom'
import { safeImage, defaultImageFor } from '../shared/imagePicker'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Heart, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import type { RootState } from '../app/store'
import { add } from '../entities/cartSlice'
import { useToast } from './Toast'

export default function ProductCard({ productId, index = 0 }: { productId: number; index?: number }) {
  const p = useSelector((s: RootState) => s.catalog.products.find(x => x.id === productId))
  const dispatch = useDispatch()
  const toast = useToast()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  if (!p) return null

  const onAdd = () => {
    dispatch(add({ productId: p.id }))
    setAdded(true)
    toast(`«${p.name}» добавлен в корзину`)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card card-hover overflow-hidden flex flex-col group relative"
    >
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/80 backdrop-blur border border-white/60 shadow-sm hover:scale-110 transition"
        aria-label="В избранное"
      >
        <Heart
          size={18}
          className={`transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`}
        />
      </button>

      <Link to={`/product/${p.slug}`} className="block aspect-[4/3] overflow-hidden bg-brand-100 relative">
        <img
  src={safeImage(p.image, p.category)}
  alt={p.name}
  loading="lazy"
  onError={(e) => {
    const img = e.currentTarget as HTMLImageElement
    if (img.dataset.fb) return
    img.dataset.fb = '1'
    img.src = defaultImageFor(p.category)
  }}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute left-3 top-3 flex flex-col gap-1 text-xs">
          {p.isHit && (
            <span className="bg-amber-400/95 text-amber-950 font-semibold px-2 py-0.5 rounded-full shadow">
              🔥 Хит
            </span>
          )}
          {p.isNew && (
            <span className="bg-emerald-400/95 text-emerald-950 font-semibold px-2 py-0.5 rounded-full shadow">
              ✨ Новинка
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <Link to={`/product/${p.slug}`} className="font-semibold leading-tight hover:text-brand-600 transition">
          {p.name}
        </Link>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" /> 4.8 · {p.weight}
        </div>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gradient">{p.price} ₽</div>
            {p.oldPrice && <div className="text-xs line-through text-slate-400">{p.oldPrice} ₽</div>}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className={`btn-primary !p-2.5 !rounded-full ${added ? 'glow' : ''}`}
            aria-label="В корзину"
          >
            {added ? '✓' : <Plus size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}