import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, RotateCcw, Package, Image as ImageIcon,
  Shuffle, Users, ShieldCheck, Store, ShoppingBag, Search, UserCog,
} from 'lucide-react'
import type { RootState } from '../app/store'
import type { Product, Category } from '../shared/types'
import {
  addProduct, updateProduct, deleteProduct, toggleAvailable, resetCatalog,
} from '../entities/catalogSlice'
import { setStatus, deleteOrder } from '../entities/ordersSlice'
import { changeUserRole, deleteUser, resetUsers, type Role } from '../entities/authSlice'
import { STATUS_LABELS, STATUS_FLOW, type OrderStatus } from '../shared/types'
import { randomImageFor, defaultImageFor, safeImage } from '../shared/imagePicker'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

const CATS: Category[] = ['торты','пирожные','конфеты','печенье','зефир','шоколад']

const emptyProduct: Omit<Product,'id'|'slug'> = {
  shopSlug:'tortilina', name:'', category:'торты', description:'',
  price:0, weight:'', image: defaultImageFor('торты'), composition:'',
  allergens:'', shelfLife:'', calories:0, isAvailable:true,
}

const ROLE_META: Record<Role, { label: string; icon: any; color: string }> = {
  guest:     { label: 'Гость',      icon: Users,       color: 'bg-slate-100 text-slate-600' },
  customer:  { label: 'Покупатель', icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-700' },
  partner:   { label: 'Кондитер',   icon: Store,       color: 'bg-amber-100 text-amber-700' },
  collector: { label: 'Сборщик',    icon: Package,     color: 'bg-sky-100 text-sky-700' },
  admin:     { label: 'Админ',      icon: ShieldCheck, color: 'bg-rose-100 text-rose-700' },
}

const ASSIGNABLE_ROLES: Role[] = ['customer','partner','collector','admin']

export default function Admin() {
  const [tab, setTab] = useState<'products'|'orders'|'users'|'stats'>('products')
  const products = useSelector((s: RootState) => s.catalog.products)
  const orders = useSelector((s: RootState) => s.orders.orders)
  const users = useSelector((s: RootState) => s.auth.users)
  const me = useSelector((s: RootState) => s.auth.phone)
  const dispatch = useDispatch()
  const toast = useToast()

  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState(emptyProduct)
  const [userQuery, setUserQuery] = useState('')

  const current = creating ? draft : editing
  const patch = (p: Partial<typeof emptyProduct>) => {
    if (creating) setDraft({ ...draft, ...p })
    else if (editing) setEditing({ ...editing, ...p })
  }

  const onChangeCategory = (category: Category) => {
    patch({ category, image: defaultImageFor(category) })
  }

  const rerollImage = () => {
    if (!current) return
    patch({ image: randomImageFor(current.category) })
    toast('Картинка подобрана автоматически 🎲')
  }

  const saveNew = () => {
    if (!draft.name || !draft.price) { toast('Заполните название и цену', 'error'); return }
    const image = draft.image?.trim() ? draft.image : defaultImageFor(draft.category)
    dispatch(addProduct({ ...draft, image }))
    setCreating(false)
    setDraft(emptyProduct)
    toast('Товар добавлен')
  }

  const saveEdit = () => {
    if (!editing) return
    const image = editing.image?.trim() ? editing.image : defaultImageFor(editing.category)
    dispatch(updateProduct({ ...editing, image }))
    setEditing(null)
    toast('Товар обновлён')
  }

  const totalRevenue = orders.reduce((a, o) => a + o.total, 0)
  const orderCount = orders.length
  const avg = orderCount ? Math.round(totalRevenue / orderCount) : 0

  // 🔍 Фильтр пользователей
  const filteredUsers = useMemo(() => {
    const q = userQuery.toLowerCase().trim()
    if (!q) return users
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    )
  }, [users, userQuery])

  // 📊 Счётчики по ролям
  const roleCounts = useMemo(() => {
    const c: Record<string, number> = {}
    users.forEach(u => { c[u.role] = (c[u.role] ?? 0) + 1 })
    return c
  }, [users])

  const onChangeRole = (phone: string, name: string, role: Role) => {
    try {
      dispatch(changeUserRole({ phone, role }))
      toast(`Роль «${name}» → ${ROLE_META[role].label}`)
    } catch (err: any) {
      toast(err.message ?? 'Ошибка', 'error')
    }
  }

  const onDeleteUser = (phone: string, name: string) => {
    if (!confirm(`Удалить пользователя «${name}»?`)) return
    try {
      dispatch(deleteUser(phone))
      toast('Пользователь удалён')
    } catch (err: any) {
      toast(err.message ?? 'Ошибка', 'error')
    }
  }

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">⚙️ Админ-панель</h1>
          <button
            className="btn-ghost text-sm"
            onClick={() => {
              if (confirm('Сбросить каталог к исходным данным?')) {
                dispatch(resetCatalog())
                toast('Каталог сброшен')
              }
            }}
          >
            <RotateCcw size={14} /> Сброс каталога
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key:'products', label:'Товары',       icon: Package },
            { key:'orders',   label:'Заказы',       icon: ShoppingBag },
            { key:'users',    label:'Пользователи', icon: UserCog },
            { key:'stats',    label:'Аналитика',    icon: ShieldCheck },
          ].map(t => (
            <button
              key={t.key}
              className={`btn-ghost text-sm ${tab===t.key ? 'bg-brand-500 text-white border-brand-500' : ''}`}
              onClick={()=>setTab(t.key as any)}
            >
              <t.icon size={14}/> {t.label}
              {t.key === 'users' && (
                <span className="ml-1 text-xs bg-white/30 px-1.5 rounded">{users.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ================= ТОВАРЫ ================= */}
        {tab === 'products' && (
          <div className="card p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">Товары ({products.length})</h2>
              <button
                className="btn-primary text-sm"
                onClick={()=>{
                  setCreating(true)
                  setDraft({ ...emptyProduct, image: defaultImageFor(emptyProduct.category) })
                }}
              >
                <Plus size={16}/> Добавить
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b">
                  <tr>
                    <th className="py-2">Фото</th>
                    <th>Название</th>
                    <th>Магазин</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b last:border-none hover:bg-brand-50/50">
                      <td className="py-2">
                        <img
                          src={safeImage(p.image, p.category)}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-brand-100"
                        />
                      </td>
                      <td>{p.name}</td>
                      <td className="text-slate-500">{p.shopSlug}</td>
                      <td className="font-semibold">{p.price} ₽</td>
                      <td>
                        <button
                          onClick={()=>dispatch(toggleAvailable(p.id))}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            p.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {p.isAvailable ? <><Eye size={12}/> В продаже</> : <><EyeOff size={12}/> Стоп-лист</>}
                        </button>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <button
                          onClick={()=>setEditing(p)}
                          className="text-brand-600 text-xs mr-3 hover:underline inline-flex items-center gap-1"
                        >
                          <Pencil size={12}/> Изменить
                        </button>
                        <button
                          onClick={()=>{
                            if (confirm(`Удалить «${p.name}»?`)) {
                              dispatch(deleteProduct(p.id)); toast('Товар удалён')
                            }
                          }}
                          className="text-rose-500 text-xs hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 size={12}/> Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ЗАКАЗЫ ================= */}
      {tab === 'orders' && (
  <div className="card p-4">
    <h2 className="font-bold mb-3">Заказы ({orders.length})</h2>

    {orders.length === 0 ? (
      <div className="text-slate-500 text-sm py-4 text-center">Заказов пока нет</div>
    ) : (
      <div className="space-y-2">
        {orders.map(o => (
          <OrderRow
            key={o.id}
            order={o}
            onChangeStatus={(status) => {
              dispatch(setStatus({ id: o.id, status }))
              toast(`Статус #${o.id}: ${STATUS_LABELS[status]}`)
            }}
            onDelete={() => {
              if (confirm(`Удалить заказ #${o.id}?`)) {
                dispatch(deleteOrder(o.id))
                toast('Заказ удалён')
              }
            }}
          />
        ))}
      </div>
    )}
  </div>
)}
        {/* ================= ПОЛЬЗОВАТЕЛИ ================= */}
        {tab === 'users' && (
          <div className="space-y-3">
            {/* Счётчики по ролям */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ASSIGNABLE_ROLES.map(r => {
                const M = ROLE_META[r]
                return (
                  <div key={r} className="card p-3 flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl grid place-items-center ${M.color}`}>
                      <M.icon size={16}/>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{M.label}</div>
                      <div className="font-bold">{roleCounts[r] ?? 0}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="card p-4">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <h2 className="font-bold">Пользователи ({users.length})</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="input pl-9 max-w-xs text-sm"
                      placeholder="Поиск по имени, телефону, email…"
                      value={userQuery}
                      onChange={e => setUserQuery(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn-ghost text-sm"
                    onClick={() => {
                      if (confirm('Сбросить список пользователей к демо-данным? Все изменения будут потеряны.')) {
                        dispatch(resetUsers()); toast('Пользователи сброшены')
                      }
                    }}
                  >
                    <RotateCcw size={14}/> Сброс
                  </button>
                </div>
              </div>

              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 border-b">
                    <tr>
                      <th className="py-2">Пользователь</th>
                      <th>Телефон</th>
                      <th>Email</th>
                      <th>Бонусы</th>
                      <th>Роль</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredUsers.map(u => {
                        const isMe = u.phone === me
                        const M = ROLE_META[u.role]
                        return (
                          <motion.tr
                            key={u.phone}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b last:border-none hover:bg-brand-50/50"
                          >
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-400 grid place-items-center text-white text-xs font-bold">
                                  {u.name.slice(0,1).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold flex items-center gap-1">
                                    {u.name}
                                    {isMe && <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 rounded">вы</span>}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    с {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="font-mono text-xs">{u.phone}</td>
                            <td className="text-xs text-slate-500">{u.email || '—'}</td>
                            <td>
                              <span className="text-xs font-semibold text-amber-600">💎 {u.bonus}</span>
                            </td>
                            <td>
                              <select
                                className={`text-xs font-medium rounded-xl px-2 py-1 border-0 outline-none cursor-pointer ${M.color}`}
                                value={u.role}
                                onChange={e => onChangeRole(u.phone, u.name, e.target.value as Role)}
                                disabled={isMe}
                                title={isMe ? 'Нельзя изменить свою роль' : 'Сменить роль'}
                              >
                                {ASSIGNABLE_ROLES.map(r => (
                                  <option key={r} value={r}>{ROLE_META[r].label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => onDeleteUser(u.phone, u.name)}
                                disabled={isMe}
                                title={isMe ? 'Нельзя удалить себя' : 'Удалить'}
                                className="text-rose-500 hover:text-rose-700 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={16}/>
                              </button>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center text-slate-500 py-6 text-sm">Пользователей не найдено</div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
                💡 <b>Как это работает:</b> смените роль в выпадающем списке — пользователь сразу получит доступ к
                соответствующей панели при следующем входе: <b>Кондитер</b> → «Панель кондитера»,
                <b> Сборщик</b> → «Панель сборщика», <b>Админ</b> → «Админ-панель».
              </div>
            </div>
          </div>
        )}

        {/* ================= АНАЛИТИКА ================= */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Заказов', orderCount],
              ['Выручка', `${totalRevenue} ₽`],
              ['Средний чек', `${avg} ₽`],
              ['Товаров', products.length],
            ].map(([k, v]) => (
              <motion.div
                key={String(k)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-4 text-center"
              >
                <div className="text-xs text-slate-500">{k}</div>
                <div className="text-2xl font-bold text-gradient mt-1">{v}</div>
              </motion.div>
            ))}
            <div className="card p-4 md:col-span-4">
              <h3 className="font-bold mb-2">Топ-5 товаров по количеству заказов</h3>
              {(() => {
                const counter: Record<string, number> = {}
                orders.forEach(o => o.items.forEach(i => {
                  counter[i.name] = (counter[i.name] ?? 0) + i.qty
                }))
                const top = Object.entries(counter).sort((a,b)=>b[1]-a[1]).slice(0,5)
                return top.length === 0
                  ? <div className="text-sm text-slate-500">Пока нет данных</div>
                  : <div className="space-y-1">
                      {top.map(([name, qty]) => (
                        <div key={name} className="flex justify-between text-sm">
                          <span>{name}</span><span className="font-semibold">{qty} шт.</span>
                        </div>
                      ))}
                    </div>
              })()}
            </div>
          </div>
        )}

        {/* ================= МОДАЛКА ТОВАРА ================= */}
        {(creating || editing) && current && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4"
            onClick={()=>{ setCreating(false); setEditing(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e)=>e.stopPropagation()}
              className="card p-5 max-w-2xl w-full max-h-[90vh] overflow-auto space-y-3"
            >
              <h3 className="font-bold text-lg">
                {creating ? 'Новый товар' : `Редактирование: ${editing?.name}`}
              </h3>

              <div className="flex gap-3 items-start">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-brand-100 shrink-0 relative">
                  <img src={safeImage(current.image, current.category)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <button type="button" onClick={rerollImage} className="btn-ghost text-sm w-full">
                    <Shuffle size={16} /> Случайная картинка
                  </button>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <ImageIcon size={12}/> или вставьте URL вручную:
                  </div>
                  <input
                    className="input text-xs"
                    placeholder="https://…"
                    value={current.image}
                    onChange={e=>patch({ image: e.target.value })}
                  />
                  <div className="text-[10px] text-slate-400">
                    Пустое поле → подставится картинка категории «{current.category}»
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input className="input" placeholder="Название" value={current.name}
                  onChange={e=>patch({ name: e.target.value })}/>
                <select className="input" value={current.category}
                  onChange={e=>onChangeCategory(e.target.value as Category)}>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <input className="input" placeholder="Магазин (slug)" value={current.shopSlug}
                  onChange={e=>patch({ shopSlug: e.target.value })}/>
                <input className="input" type="number" placeholder="Цена, ₽" value={current.price}
                  onChange={e=>patch({ price: Number(e.target.value) })}/>
                <input className="input" placeholder="Вес" value={current.weight}
                  onChange={e=>patch({ weight: e.target.value })}/>
                <input className="input" placeholder="Срок хранения" value={current.shelfLife}
                  onChange={e=>patch({ shelfLife: e.target.value })}/>
                <input className="input" type="number" placeholder="Ккал" value={current.calories}
                  onChange={e=>patch({ calories: Number(e.target.value) })}/>
                <input className="input" placeholder="Аллергены" value={current.allergens}
                  onChange={e=>patch({ allergens: e.target.value })}/>
                <textarea className="input md:col-span-2" rows={2} placeholder="Описание"
                  value={current.description} onChange={e=>patch({ description: e.target.value })}/>
                <textarea className="input md:col-span-2" rows={2} placeholder="Состав"
                  value={current.composition} onChange={e=>patch({ composition: e.target.value })}/>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button className="btn-ghost" onClick={()=>{ setCreating(false); setEditing(null) }}>Отмена</button>
                <button className="btn-primary" onClick={creating ? saveNew : saveEdit}>
                  <Package size={16}/> {creating ? 'Создать' : 'Сохранить'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}

// =============== Компонент строки заказа ===============
import { ChevronDown, ChevronUp, MapPin, Phone, CreditCard, Banknote, MessageSquare } from 'lucide-react'

function OrderRow({
  order,
  onChangeStatus,
  onDelete,
}: {
  order: any
  onChangeStatus: (s: OrderStatus) => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const itemsCount = order.items.reduce((a: number, i: any) => a + i.qty, 0)
  const subtotal = order.items.reduce((a: number, i: any) => a + i.price * i.qty, 0)

  return (
    <div className="border rounded-2xl overflow-hidden">
      {/* Заголовок заказа */}
      <div className="p-3 flex flex-wrap items-center gap-2 justify-between bg-white">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
          <div className="min-w-0">
            <div className="font-semibold truncate">
              #{order.id} · {order.customer}
            </div>
            <div className="text-xs text-slate-500">
              {itemsCount} шт. · {order.total} ₽ ·{' '}
              {new Date(order.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <select
            className="input py-1 text-sm max-w-[200px]"
            value={order.status}
            onChange={e => onChangeStatus(e.target.value as OrderStatus)}
          >
            {STATUS_FLOW.concat(['canceled']).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s as OrderStatus]}</option>
            ))}
          </select>
          <button
            className="text-rose-500 hover:text-rose-700 p-1"
            onClick={onDelete}
            title="Удалить заказ"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Раскрывающийся состав */}
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
              {/* Адрес и оплата */}
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin size={14} className="mt-0.5 text-brand-500 shrink-0" />
                  <span>{order.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {order.payment === 'card'
                    ? <><CreditCard size={14} className="text-brand-500" /> Оплата картой</>
                    : <><Banknote size={14} className="text-brand-500" /> Наличными курьеру</>}
                </div>
                {order.postcard && (
                  <div className="flex items-start gap-1.5 sm:col-span-2">
                    <MessageSquare size={14} className="mt-0.5 text-brand-500 shrink-0" />
                    <span>Открытка: «{order.postcard}»</span>
                  </div>
                )}
                {order.comment && (
                  <div className="flex items-start gap-1.5 sm:col-span-2">
                    <MessageSquare size={14} className="mt-0.5 text-brand-500 shrink-0" />
                    <span>Комментарий: {order.comment}</span>
                  </div>
                )}
              </div>

              {/* Состав */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Состав заказа</div>
                <div className="space-y-1">
                  {order.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 grid place-items-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold shrink-0">
                          {it.qty}
                        </span>
                        <span className="truncate">{it.name}</span>
                      </div>
                      <span className="font-semibold whitespace-nowrap">{it.price * it.qty} ₽</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Итоги */}
              <div className="border-t pt-2 space-y-1 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Товары</span><span>{subtotal} ₽</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Доставка</span><span>{order.deliveryFee} ₽</span>
                </div>
                {order.bonusUsed > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Бонусы списаны</span><span>−{order.bonusUsed} ₽</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-brand-700 pt-1 border-t">
                  <span>Итого</span><span>{order.total} ₽</span>
                </div>
                <div className="flex justify-between text-xs text-amber-600">
                  <span>Начислено бонусов</span><span>+{order.bonusEarned}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}