import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, MapPin, Package, Check, CreditCard, Banknote } from 'lucide-react'
import type { RootState } from '../app/store'
import { setStatus } from '../entities/ordersSlice'
import { STATUS_LABELS, type Order, type OrderStatus } from '../shared/types'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

export default function Collector() {
  const orders = useSelector((s: RootState) =>
    s.orders.orders.filter(o => ['pending','accepted','preparing','packing','delivering'].includes(o.status))
  )
  const dispatch = useDispatch()
  const toast = useToast()
  const [taken, setTaken] = useState<number | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  const activeOrders = orders.filter(o => ['packing', 'delivering'].includes(o.status))
  const queueOrders = orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status))

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">📦 Панель сборщика</h1>

        {/* В работе */}
        {activeOrders.length > 0 && (
          <div className="card p-4 border-l-4 border-amber-400">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <Package size={18} className="text-amber-500" />
              В работе ({activeOrders.length})
            </h2>
            <div className="space-y-2">
              {activeOrders.map(o => (
                <CollectorOrderCard
                  key={o.id}
                  order={o}
                  open={openId === o.id}
                  onToggle={() => setOpenId(openId === o.id ? null : o.id)}
                  actionLabel="Собран → курьеру"
                  actionIcon={<Check size={16} />}
                  onAction={() => {
                    dispatch(setStatus({ id: o.id, status: 'delivering' }))
                    setTaken(null)
                    toast(`Заказ #${o.id} передан курьеру`)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Очередь */}
        <div className="card p-4">
          <h2 className="font-bold mb-3">Очередь заказов ({queueOrders.length})</h2>
          {queueOrders.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-6">Очередь пуста 🎉</div>
          ) : (
            <div className="space-y-2">
              {queueOrders.map(o => (
                <CollectorOrderCard
                  key={o.id}
                  order={o}
                  open={openId === o.id}
                  onToggle={() => setOpenId(openId === o.id ? null : o.id)}
                  actionLabel={taken === o.id ? 'Собран → курьеру' : 'Взять в работу'}
                  actionIcon={taken === o.id ? <Check size={16} /> : <Package size={16} />}
                  onAction={() => {
                    if (taken === o.id) {
                      dispatch(setStatus({ id: o.id, status: 'delivering' }))
                      setTaken(null)
                      toast(`Заказ #${o.id} передан курьеру`)
                    } else {
                      dispatch(setStatus({ id: o.id, status: 'packing' }))
                      setTaken(o.id)
                      toast(`Заказ #${o.id} в работе`)
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Заработок */}
        <div className="card p-4 text-sm flex justify-between items-center">
          <div>
            <b>Заработок за сегодня:</b> 1 200 ₽
          </div>
          <div className="text-slate-500">Собрано заказов: {orders.length}</div>
        </div>
      </div>
    </AnimatedPage>
  )
}

// ============== Карточка заказа для сборщика ==============

function CollectorOrderCard({
  order,
  open,
  onToggle,
  actionLabel,
  actionIcon,
  onAction,
}: {
  order: Order
  open: boolean
  onToggle: () => void
  actionLabel: string
  actionIcon: React.ReactNode
  onAction: () => void
}) {
  const itemsCount = order.items.reduce((a, i) => a + i.qty, 0)

  return (
    <div className="border rounded-2xl overflow-hidden">
      <div className="p-3 flex flex-wrap items-center gap-2 justify-between">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
          <div className="min-w-0">
            <div className="font-semibold truncate">
              #{order.id} · {order.customer}
            </div>
            <div className="text-xs text-slate-500">
              {itemsCount} шт. · {order.total} ₽ · {STATUS_LABELS[order.status]}
            </div>
          </div>
        </button>

        <button onClick={onAction} className="btn-primary text-sm !py-2 shrink-0">
          {actionIcon} {actionLabel}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-brand-50/40 border-t"
          >
            <div className="p-3 space-y-3">
              {/* Адрес */}
              <div className="flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin size={14} className="mt-0.5 text-brand-500 shrink-0" />
                <span>{order.address}</span>
              </div>

              {/* Способ оплаты */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                {order.payment === 'card'
                  ? <><CreditCard size={14} className="text-brand-500" /> Оплата картой (оплачен)</>
                  : <><Banknote size={14} className="text-brand-500" /> Наличными — взять с собой</>}
              </div>

              {/* Состав */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Что собрать</div>
                <div className="space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 grid place-items-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-400 text-white text-xs font-bold shrink-0">
                          {it.qty}
                        </span>
                        <span className="truncate">{it.name}</span>
                      </div>
                      <span className="font-semibold whitespace-nowrap">{it.price * it.qty} ₽</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Комментарий / открытка */}
              {(order.comment || order.postcard) && (
                <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 space-y-1">
                  {order.postcard && <div>💌 Открытка: «{order.postcard}»</div>}
                  {order.comment && <div>💬 Комментарий: {order.comment}</div>}
                </div>
              )}

              {/* Итог */}
              <div className="border-t pt-2 flex justify-between font-bold text-brand-700 text-sm">
                <span>К оплате</span>
                <span>{order.total} ₽</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}