import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import ProductCard from '../components/ProductCard'
import AnimatedPage from '../components/AnimatedPage'

const CATS = ['все','торты','пирожные','конфеты','печенье','зефир','шоколад']

export default function Catalog() {
  const products = useSelector((s: RootState) => s.catalog.products)
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('category') ?? 'все'
  const [sort, setSort] = useState<'new'|'price_asc'|'price_desc'>('new')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    let l = products.filter(p => cat === 'все' || p.category === cat)
    if (q) l = l.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    if (sort === 'price_asc')  l = [...l].sort((a,b)=>a.price-b.price)
    if (sort === 'price_desc') l = [...l].sort((a,b)=>b.price-a.price)
    return l
  }, [products, cat, sort, q])

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Каталог</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATS.map(c => (
            <button
              key={c}
              className={`btn-ghost capitalize ${cat === c ? 'bg-brand-500 text-white border-brand-500' : ''}`}
              onClick={() => setSp(c === 'все' ? {} : { category: c })}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input className="input max-w-sm" placeholder="Поиск…" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input max-w-[180px]" value={sort} onChange={e=>setSort(e.target.value as any)}>
            <option value="new">Сначала новые</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((p, i) => <ProductCard key={p.id} productId={p.id} index={i} />)}
          {list.length === 0 && <div className="text-slate-500">Ничего не найдено</div>}
        </div>
      </div>
    </AnimatedPage>
  )
}