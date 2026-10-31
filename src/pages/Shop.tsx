import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import type { RootState } from '../app/store'
import ProductCard from '../components/ProductCard'
import AnimatedPage from '../components/AnimatedPage'

export default function ShopPage() {
  const { slug } = useParams()
  const shop = useSelector((s: RootState) => s.catalog.shops.find(x => x.slug === slug))
  const products = useSelector((s: RootState) =>
    s.catalog.products.filter(p => p.shopSlug === slug))

  if (!shop) return <div className="max-w-6xl mx-auto p-6">Магазин не найден</div>

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft size={16} /> На главную
        </Link>
        <div className="card overflow-hidden">
          <div className="aspect-[3/1] bg-brand-100">
            <img src={shop.cover} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-bold">{shop.logo} {shop.name}</h1>
            <p className="text-slate-600 mt-1">{shop.description}</p>
            <div className="text-sm text-slate-500 mt-1">
              ⭐ {shop.rating} · Мин. заказ {shop.minOrder} ₽ · Доставка {shop.deliveryFee} ₽ · {shop.deliveryTime}
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold">Товары магазина</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} productId={p.id} index={i} />)}
          {products.length === 0 && <div className="text-slate-500">Товаров пока нет</div>}
        </div>
      </div>
    </AnimatedPage>
  )
}