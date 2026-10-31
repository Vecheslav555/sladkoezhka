import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Banknote } from 'lucide-react'
import type { RootState } from '../app/store'
import { clear } from '../entities/cartSlice'
import { addOrder } from '../entities/ordersSlice'
import { addBonus, spendBonus } from '../entities/authSlice'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

export default function Checkout() {
  const items = useSelector((s: RootState) => s.cart.items)
  const products = useSelector((s: RootState) => s.catalog.products)
  const promoDiscount = useSelector((s: RootState) => s.cart.promoDiscount)
  const auth = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState({
    city: 'Калининград', street: '', house: '', flat: '',
    date: '', time: '12:00', payment: 'card' as 'card'|'cash', postcard: '', comment: '',
    bonusUse: 0,
  })

  const subtotal = items.reduce((a, i) => {
    const p = products.find(x => x.id === i.productId)
    return a + (p ? p.price * i.qty : 0)
  }, 0)
  const delivery = 200
  const promoSum = Math.round(subtotal * promoDiscount / 100)
  const bonusDiscount = Math.round(subtotal * Math.min(form.bonusUse, 30) / 100)
  const total = subtotal + delivery - promoSum - bonusDiscount

  const submit = () => {
    if (!form.street || !form.house || !form.date) {
      toast('Заполните адрес и дату доставки', 'error')
      return
    }
    if (items.length === 0) {
      toast('Корзина пуста', 'error')
      return
    }
    const id = Math.floor(100000 + Math.random() * 900000)
    const order = {
      id,
      status: 'pending' as const,
      total,
      deliveryFee: delivery,
      address: `${form.city}, ${form.street}, ${form.house}${form.flat ? ', кв. '+form.flat : ''}`,
      createdAt: new Date().toISOString(),
      items: items.map(i => {
        const p = products.find(x => x.id === i.productId)!
        return { productId: p.id, name: p.name, qty: i.qty, price: p.price }
      }),
      bonusEarned: Math.round(total * 0.05),
      bonusUsed: bonusDiscount,
      customer: auth.name || 'Гость',
      payment: form.payment,
      comment: form.comment,
      postcard: form.postcard,
    }
    dispatch(addOrder(order))
    dispatch(addBonus(Math.round(total * 0.05)))
    if (bonusDiscount > 0) dispatch(spendBonus(bonusDiscount))
    dispatch(clear())
    toast(`Заказ #${id} создан!`)
    nav('/order/' + id)
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Оформление заказа</h1>
        <div className="card p-5 grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Город" value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/>
          <input className="input" placeholder="Улица" value={form.street} onChange={e=>setForm({...form, street:e.target.value})}/>
          <input className="input" placeholder="Дом" value={form.house} onChange={e=>setForm({...form, house:e.target.value})}/>
          <input className="input" placeholder="Квартира" value={form.flat} onChange={e=>setForm({...form, flat:e.target.value})}/>
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
          <input className="input" type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})}/>

          <div className="md:col-span-2 flex gap-2">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-medium transition ${
                form.payment === 'card' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-brand-200'
              }`}
              onClick={() => setForm({...form, payment: 'card'})}
            >
              <CreditCard size={18} /> Картой онлайн
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-medium transition ${
                form.payment === 'cash' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-brand-200'
              }`}
              onClick={() => setForm({...form, payment: 'cash'})}
            >
              <Banknote size={18} /> Наличными
            </button>
          </div>

          <input className="input md:col-span-2" placeholder="Текст открытки" value={form.postcard} onChange={e=>setForm({...form, postcard:e.target.value})}/>
          <textarea
            className="input md:col-span-2"
            placeholder="Комментарий к заказу"
            rows={3}
            value={form.comment}
            onChange={e=>setForm({...form, comment:e.target.value})}
          />

          <label className="md:col-span-2 text-sm flex items-center gap-2 flex-wrap">
            <span>Списать бонусов:</span>
            <input
              type="number" min={0} max={30}
              className="input max-w-[80px]"
              value={form.bonusUse}
              onChange={e=>setForm({...form, bonusUse: Number(e.target.value)})}
            />
            <span className="text-slate-500">% (макс. 30%, у вас {auth.bonus} б.)</span>
          </label>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex justify-between text-sm"><span>Товары</span><span>{subtotal} ₽</span></div>
          <div className="flex justify-between text-sm"><span>Доставка</span><span>{delivery} ₽</span></div>
          {promoSum > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Промокод</span><span>−{promoSum} ₽</span></div>}
          {bonusDiscount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Бонусы</span><span>−{bonusDiscount} ₽</span></div>}
          <div className="flex justify-between font-bold text-lg border-t pt-2 items-center">
            <span>К оплате</span>
            <span className="text-gradient text-2xl">{total} ₽</span>
          </div>
          <button className="btn-primary w-full mt-2" onClick={submit}>
            Создать заказ
          </button>
        </div>
      </div>
    </AnimatedPage>
  )
}