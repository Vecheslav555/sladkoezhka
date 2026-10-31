import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Truck, ShieldCheck, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import ProductCard from '../components/ProductCard'
import AnimatedPage from '../components/AnimatedPage'

const CATEGORIES = [
  { name: 'торты', emoji: '🎂' },
  { name: 'пирожные', emoji: '🧁' },
  { name: 'конфеты', emoji: '🍬' },
  { name: 'печенье', emoji: '🍪' },
  { name: 'зефир', emoji: '☁️' },
  { name: 'шоколад', emoji: '🍫' },
] as const

export default function Home() {
  const products = useSelector((s: RootState) => s.catalog.products)
  const shops = useSelector((s: RootState) => s.catalog.shops)
  const [q, setQ] = useState('')

  const hits = useMemo(() => products.filter(p => p.isHit).slice(0, 4), [products])
  const news = useMemo(() => products.filter(p => p.isNew).slice(0, 4), [products])
  const found = useMemo(
    () => q ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())) : [],
    [products, q]
  )

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/85 via-fuchsia-500/60 to-amber-400/60" />
          </div>

          <div className="relative px-6 md:px-12 py-16 md:py-24 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles size={14} /> Доставка по Калининграду за 60 минут
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight drop-shadow">
                Сладости,<br />которые дарят счастье
              </h1>
              <p className="mt-4 text-white/90 max-w-md">
                Торты, пирожные и десерты от лучших кондитеров города. Свежее каждое утро.
              </p>

              <div className="mt-6 relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-2xl bg-white/95 text-slate-800 pl-11 pr-4 py-3 outline-none shadow-xl focus:ring-4 focus:ring-white/40 transition"
                  placeholder="Найти торт, конфеты, зефир…"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden md:block absolute right-10 top-10 text-7xl drop-shadow-lg"
          >
            🍰
          </motion.div>
        </section>

        {q && (
          <section>
            <h2 className="text-xl font-bold mb-3">Результаты поиска</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {found.map((p, i) => <ProductCard key={p.id} productId={p.id} index={i} />)}
              {found.length === 0 && <div className="text-slate-500">Ничего не найдено</div>}
            </div>
          </section>
        )}

        {/* Преимущества */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, title: 'Доставка 60 мин', text: 'по Калининграду' },
            { icon: ShieldCheck, title: 'Свежие продукты', text: 'проверенные кондитеры' },
            { icon: Clock, title: 'Работаем 9–22', text: 'каждый день' },
            { icon: Sparkles, title: 'Бонусы 5%', text: 'с каждого заказа' },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card p-4 flex items-start gap-3"
            >
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-fuchsia-100 text-brand-600 shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-xs text-slate-500">{text}</div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Категории */}
        <section>
          <h2 className="text-xl font-bold mb-3">Категории</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/catalog?category=${c.name}`}
                  className="card card-hover p-4 flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-sm font-semibold capitalize">{c.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Хиты */}
        <section>
          <h2 className="text-xl font-bold mb-3">🔥 Хиты</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {hits.map((p, i) => <ProductCard key={p.id} productId={p.id} index={i} />)}
          </div>
        </section>

        {/* Новинки */}
        <section>
          <h2 className="text-xl font-bold mb-3">✨ Новинки</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {news.map((p, i) => <ProductCard key={p.id} productId={p.id} index={i} />)}
          </div>
        </section>

        {/* Магазины */}
        <section>
          <h2 className="text-xl font-bold mb-3">🏪 Кондитерские</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shops.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/shop/${s.slug}`} className="card card-hover overflow-hidden block">
                  <div className="aspect-[16/9] bg-brand-100 overflow-hidden">
                    <img
                      src={s.cover}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{s.logo} {s.name}</div>
                    <div className="text-sm text-slate-500">⭐ {s.rating} · {s.deliveryTime}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  )
}