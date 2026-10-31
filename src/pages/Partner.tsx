import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '../app/store'
import AnimatedPage from '../components/AnimatedPage'

export default function Partner() {
  const [tab, setTab] = useState<'products'|'orders'|'stats'>('products')
  const products = useSelector((s: RootState) => s.catalog.products)
  const orders = useSelector((s: RootState) => s.orders.orders)
  const revenue = orders.reduce((a,o)=>a+o.total,0)

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">👩‍🍳 Панель кондитера</h1>
        <div className="flex gap-2">
          <button className={`btn-ghost ${tab==='products'?'bg-brand-500 text-white border-brand-500':''}`} onClick={()=>setTab('products')}>Товары</button>
          <button className={`btn-ghost ${tab==='orders'?'bg-brand-500 text-white border-brand-500':''}`} onClick={()=>setTab('orders')}>Заказы</button>
          <button className={`btn-ghost ${tab==='stats'?'bg-brand-500 text-white border-brand-500':''}`} onClick={()=>setTab('stats')}>Статистика</button>
        </div>

        {tab==='products' && (
          <div className="card p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">Мои товары</h2>
              <Link to="/admin" className="btn-ghost text-sm">Управление →</Link>
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b">
                <tr><th className="py-2">Название</th><th>Цена</th><th>Статус</th></tr>
              </thead>
              <tbody>
                {products.slice(0,8).map(p=>(
                  <tr key={p.id} className="border-b last:border-none">
                    <td className="py-2">{p.name}</td>
                    <td>{p.price} ₽</td>
                    <td><span className={p.isAvailable?'text-emerald-600':'text-red-500'}>{p.isAvailable?'В продаже':'Стоп-лист'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='orders' && (
          <div className="card p-4 text-sm space-y-2">
            <h2 className="font-bold mb-2">Входящие заказы</h2>
            {orders.map(o => (
              <div key={o.id} className="flex justify-between items-center border rounded-xl p-3">
                <div>
                  <div className="font-semibold">#{o.id} · {o.customer}</div>
                  <div className="text-xs text-slate-500">{o.items.map(i=>i.name).join(', ')}</div>
                </div>
                <Link to="/admin" className="btn-ghost text-xs">Изменить статус</Link>
              </div>
            ))}
          </div>
        )}

        {tab==='stats' && (
          <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              ['Заказов', orders.length],
              ['Выручка', `${revenue} ₽`],
              ['Товаров', products.length],
              ['Рейтинг', '4.8 ⭐'],
            ].map(([k,v])=>(
              <div key={String(k)} className="bg-gradient-to-br from-brand-100 to-fuchsia-100 rounded-xl p-4">
                <div className="text-xs text-slate-500">{k}</div>
                <div className="font-bold text-lg text-brand-700">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}