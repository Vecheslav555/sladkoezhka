import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '../app/store'
import { STATUS_LABELS } from '../shared/types'
import AnimatedPage from '../components/AnimatedPage'

export default function Profile() {
  const auth = useSelector((s: RootState) => s.auth)
  const orders = useSelector((s: RootState) => s.orders.orders)

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Личный кабинет</h1>
        <div className="card p-5">
          <div className="text-lg font-semibold">👤 {auth.name || 'Гость'}</div>
          <div className="text-sm text-slate-500">Роль: {auth.role}</div>
          <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-pink-100 px-4 py-2 rounded-2xl">
            <span className="text-2xl">💎</span>
            <span>Бонусный баланс: <b className="text-brand-600">{auth.bonus}</b></span>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-3">История заказов</h2>
          {orders.length === 0 ? (
            <div className="text-slate-500 text-sm">Заказов пока нет</div>
          ) : (
            <div className="space-y-2">
              {orders.map(o => (
                <Link
                  key={o.id}
                  to={`/order/${o.id}`}
                  className="flex justify-between items-center border rounded-2xl p-3 hover:bg-brand-50 transition"
                >
                  <div>
                    <div className="font-semibold">Заказ #{o.id}</div>
                    <div className="text-xs text-slate-500">{STATUS_LABELS[o.status]}</div>
                  </div>
                  <div className="text-brand-600 font-bold">{o.total} ₽</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  )
}