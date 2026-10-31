import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Phone, Lock, User, Mail, UserPlus, Check } from 'lucide-react'
import { register } from '../entities/authSlice'
import { useToast } from '../components/Toast'
import AnimatedPage from '../components/AnimatedPage'

export default function Register() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')

  const valid =
    form.name.trim().length >= 2 &&
    /^\+?\d[\d\s()-]{9,}$/.test(form.phone) &&
    form.password.length >= 6 &&
    form.password === form.confirm &&
    agree

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!valid) {
      if (form.password !== form.confirm) setError('Пароли не совпадают')
      else if (form.password.length < 6) setError('Пароль должен быть не менее 6 символов')
      else setError('Проверьте заполнение полей')
      return
    }
    try {
      dispatch(register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
      }))
      toast('Регистрация успешна! Добро пожаловать 🎉')
      nav('/')
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации')
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
              ✨
            </div>
            <h1 className="text-2xl font-bold">Регистрация покупателя</h1>
            <p className="text-sm text-slate-500 mt-1">Получите 100 приветственных бонусов</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                placeholder="Ваше имя"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                placeholder="+7 (900) 000-00-00"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
              />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                type="email"
                placeholder="Email (необязательно)"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                type="password"
                placeholder="Пароль (мин. 6 символов)"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                type="password"
                placeholder="Повторите пароль"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                autoComplete="new-password"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-0.5 accent-brand-500"
              />
              <span>
                Я согласен с условиями сервиса и обработкой персональных данных
              </span>
            </label>

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
              <UserPlus size={18} /> Зарегистрироваться
            </button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Войти
            </Link>
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
          {[
            ['🎁', '100 бонусов'],
            ['⚡', 'Быстрый заказ'],
            ['❤️', 'История покупок'],
          ].map(([e, t]) => (
            <div key={t} className="card p-3">
              <div className="text-2xl">{e}</div>
              <div className="mt-1">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  )
}