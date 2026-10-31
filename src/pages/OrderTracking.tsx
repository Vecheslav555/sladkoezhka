import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle2, Package } from 'lucide-react'
import type { RootState } from '../app/store'
import { STATUS_FLOW, STATUS_LABELS, type OrderStatus } from '../shared/types'
import AnimatedPage from '../components/AnimatedPage'

export default function OrderTracking() {
  const { id } = useParams()
  const order = useSelector((s: RootState) => s.orders.orders.find(o => String(o.id) === id))

  if (!order) return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto p-6">Заказ #{id} не найден</div>
    </AnimatedPage>
  )

  const idx = STATUS_FLOW.indexOf(order.status)
  const canceled = order.status === 'canceled'

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Заказ #{order.id}</h1>
        {canceled ? (
          <div className="card p-4 border-rose-300 text-rose-700">Заказ отменён</div>
        ) : (
          <div className="card p-4">
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex-1 min-w-[110px] text-center text-xs rounded-lg py-2 flex flex-col items-center gap-1
                    ${i <= idx ? 'bg-brand-500 text-white' : 'bg-brand-100 text-slate-500'}`}
                >
                  {i <= idx ? <CheckCircle2 size={16}/> : <Package size={16}/>}
                  {STATUS_LABELS[s as OrderStatus]}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-5 space-y-2">
          <div className="text-sm text-slate-500">Адрес</div>
          <div>{order.address}</div>
          <div className="text-sm text-slate-500 mt-2">Состав</div>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{it.name} × {it.qty}</span>
              <span>{it.price * it.qty} ₽</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Итого</span><span>{order.total} ₽</span>
          </div>
          <div className="text-sm text-emerald-600">Начислено бонусов: +{order.bonusEarned}</div>
        </div>
      </div>
    </AnimatedPage>
  )
}