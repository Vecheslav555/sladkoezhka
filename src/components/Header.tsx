import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, LogOut, IceCreamBowl, Store, Package, ShieldCheck, LogIn, UserPlus } from 'lucide-react'
import type { RootState } from '../app/store'
import { logout } from '../entities/authSlice'

const ROLE_LABELS: Record<string, string> = {
  customer: 'Покупатель',
  partner: 'Кондитер',
  collector: 'Сборщик',
  admin: 'Админ',
}

export default function Header() {
  const cart = useSelector((s: RootState) => s.cart.items)
  const auth = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const count = cart.reduce((a, i) => a + i.qty, 0)
  const isAuthed = auth.role !== 'guest'

  const links: { to: string; label: string; icon: any }[] = [
    { to: '/catalog', label: 'Каталог', icon: Store },
  ]
  if (isAuthed) links.push({ to: '/profile', label: 'Кабинет', icon: User })
  if (auth.role === 'partner') links.push({ to: '/partner', label: 'Кондитер', icon: Store })
  if (auth.role === 'collector') links.push({ to: '/collector', label: 'Сборщик', icon: Package })
  if (auth.role === 'admin') links.push({ to: '/admin', label: 'Админ-панель', icon: ShieldCheck })

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span
              whileHover={{ rotate: -12, scale: 1.15 }}
              className="grid place-items-center w-10 h-10 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg,#ff7a59,#ff4d8d)' }}
            >
              <IceCreamBowl size={22} />
            </motion.span>
            <span className="text-xl font-extrabold text-gradient hidden sm:inline">Сладкоежка</span>
          </Link>

          <nav className="hidden md:flex gap-1 ml-4 text-sm font-medium">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-brand-50'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {!isAuthed ? (
              <>
                <Link to="/login" className="btn-ghost text-sm !py-2 !px-3">
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Войти</span>
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-3">
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Регистрация</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold">{auth.name}</span>
                  <span className="text-xs text-brand-600">
                    {ROLE_LABELS[auth.role]} · {auth.bonus} б.
                  </span>
                </div>
                <button
                  className="btn-ghost !p-2"
                  onClick={() => { dispatch(logout()); nav('/') }}
                  aria-label="Выйти"
                  title="Выйти"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            <Link to="/cart" className="btn-primary relative">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Корзина</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-white text-brand-600 font-bold text-xs rounded-full min-w-6 h-6 px-1 grid place-items-center shadow"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}