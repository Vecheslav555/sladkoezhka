import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Phone, Lock, LogIn, ShieldCheck, Store, Package, User } from 'lucide-react'
import { login, loginAs, type Role } from '../entities/authSlice'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

const DEMO_ACCOUNTS: { role: Role; title: string; phone: string; password: string; icon: any; color: string }[] = [
  { role: 'customer', title: 'Покупатель', phone: '+79000000004', password: 'customer123', icon: User, color: 'from-emerald-400 to-teal-500' },
  { role: 'partner', title: 'Кондитер', phone: '+79000000002', password: 'partner123', icon: Store, color: 'from-amber-400 to-orange-500' },
  { role: 'collector', title: 'Сборщик', phone: '+79000000003', password: 'collector123', icon: Package, color: 'from-sky-400 to-indigo-500' },
  { role: 'admin', title: 'Админ', phone: '+79000000001', password: 'admin123', icon: ShieldCheck, color: 'from-rose-400 to-fuchsia-500' },
]

export default function Login() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const loc = useLocation() as any
  const toast = useToast()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = loc.state?.from ?? '/'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone || !password) { setError('Заполните все поля'); return }
    try {
      dispatch(login({ phone, password }))
      toast('Добро пожаловать!')
      nav(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Ошибка входа')
    }
  }

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 space-y-4"
        >
          <div className="text-center">
            <div className="inline-grid place-items-center w-16 h-16 rounded-3xl text-white text-3xl mx-auto mb-3"
                 style={{ background: 'linear-gradient(135deg,#ff7a59,#ff4d8d)' }}>
              🍬
            </div>
            <h1 className="text-2xl font-bold">Вход в Сладкоежку</h1>
            <p className="text-sm text-slate-500 mt-1">Войдите, чтобы делать заказы и получать бонусы</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                placeholder="+7 (900) 000-00-00"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2"
              >
                {error}
              </motion.div>
            )}

            <button type="submit" className="btn-primary w-full">
              <LogIn size={18} /> Войти
            </button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </motion.div>

        <div className="mt-6">
          <div className="text-center text-xs text-slate-400 mb-3">Быстрый демо-вход</div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(a => (
              <motion.button
                key={a.role}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  dispatch(loginAs(a.role))
                  toast(`Вошли как ${a.title}`)
                  nav(a.role === 'admin' ? '/admin' : a.role === 'partner' ? '/partner' : a.role === 'collector' ? '/collector' : '/', { replace: true })
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl text-white font-medium bg-gradient-to-br ${a.color} shadow-md`}
              >
                <a.icon size={18} />
                <div className="text-left leading-tight">
                  <div className="text-sm">{a.title}</div>
                  <div className="text-[10px] opacity-80">{a.phone}</div>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="mt-3 text-center text-xs text-slate-400">
            Пароли: admin123 / partner123 / collector123 / customer123
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}