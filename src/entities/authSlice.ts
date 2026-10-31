import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Role = 'guest' | 'customer' | 'partner' | 'collector' | 'admin'

export interface UserAccount {
  phone: string
  password: string  // ДЕМО: в реальном проекте — только хеш на сервере
  name: string
  email?: string
  role: Role
  bonus: number
  createdAt: string
}

interface AuthState {
  role: Role
  name: string
  phone: string
  email: string
  bonus: number
  users: UserAccount[]
}

// Демо-аккаунты для входа «из коробки»
const SEED_USERS: UserAccount[] = [
  { phone: '+79000000001', password: 'admin123', name: 'Администратор',
    email: 'admin@sladkoezhka.ru', role: 'admin', bonus: 0, createdAt: new Date().toISOString() },
  { phone: '+79000000002', password: 'partner123', name: 'Кондитер Анна',
    email: 'anna@sladkoezhka.ru', role: 'partner', bonus: 0, createdAt: new Date().toISOString() },
  { phone: '+79000000003', password: 'collector123', name: 'Сборщик Игорь',
    email: 'igor@sladkoezhka.ru', role: 'collector', bonus: 0, createdAt: new Date().toISOString() },
  { phone: '+79000000004', password: 'customer123', name: 'Покупатель Мария',
    email: 'maria@mail.ru', role: 'customer', bonus: 250, createdAt: new Date().toISOString() },
]

function loadState(): AuthState {
  const savedSession = localStorage.getItem('auth')
  const savedUsers = localStorage.getItem('users')
  const users: UserAccount[] = savedUsers ? JSON.parse(savedUsers) : SEED_USERS
  const session = savedSession ? JSON.parse(savedSession) : null
  if (session) return { ...session, users }
  return { role: 'guest', name: '', phone: '', email: '', bonus: 0, users }
}

const initialState: AuthState = loadState()

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (s, a: PayloadAction<{ phone: string; password: string; name: string; email?: string }>) => {
      if (s.users.some(u => u.phone === a.payload.phone)) {
        throw new Error('Пользователь с таким телефоном уже существует')
      }
      const user: UserAccount = {
        phone: a.payload.phone,
        password: a.payload.password,
        name: a.payload.name,
        email: a.payload.email,
        role: 'customer',
        bonus: 100,
        createdAt: new Date().toISOString(),
      }
      s.users.push(user)
      localStorage.setItem('users', JSON.stringify(s.users))
      s.role = 'customer'; s.name = user.name; s.phone = user.phone
      s.email = user.email ?? ''; s.bonus = user.bonus
      persistSession(s)
    },

    login: (s, a: PayloadAction<{ phone: string; password: string }>) => {
      const user = s.users.find(u => u.phone === a.payload.phone && u.password === a.payload.password)
      if (!user) throw new Error('Неверный телефон или пароль')
      s.role = user.role
      s.name = user.name
      s.phone = user.phone
      s.email = user.email ?? ''
      s.bonus = user.bonus
      persistSession(s)
    },

    loginAs: (s, a: PayloadAction<Role>) => {
      const demo = SEED_USERS.find(u => u.role === a.payload)
      if (!demo) return
      s.role = demo.role; s.name = demo.name; s.phone = demo.phone
      s.email = demo.email ?? ''; s.bonus = demo.bonus
      persistSession(s)
    },

    spendBonus: (s, a: PayloadAction<number>) => {
      s.bonus = Math.max(0, s.bonus - a.payload)
      persistSession(s)
      syncUser(s)
    },

    addBonus: (s, a: PayloadAction<number>) => {
      s.bonus += a.payload
      persistSession(s)
      syncUser(s)
    },

    logout: (s) => {
      localStorage.removeItem('auth')
      s.role = 'guest'; s.name = ''; s.phone = ''; s.email = ''; s.bonus = 0
    },

    // 🆕 Смена роли пользователя (только из админки)
    changeUserRole: (s, a: PayloadAction<{ phone: string; role: Role }>) => {
      const u = s.users.find(u => u.phone === a.payload.phone)
      if (!u) throw new Error('Пользователь не найден')
      if (u.phone === s.phone && a.payload.role !== 'admin') {
        throw new Error('Нельзя лишить себя прав администратора')
      }
      u.role = a.payload.role
      localStorage.setItem('users', JSON.stringify(s.users))
      // если меняем роль текущего пользователя — обновляем сессию
      if (u.phone === s.phone) {
        s.role = a.payload.role
        persistSession(s)
      }
    },

    // 🆕 Удаление пользователя (только из админки)
    deleteUser: (s, a: PayloadAction<string>) => {
      if (a.payload === s.phone) throw new Error('Нельзя удалить себя')
      s.users = s.users.filter(u => u.phone !== a.payload)
      localStorage.setItem('users', JSON.stringify(s.users))
    },

    // 🆕 Сброс пользователей к seed-данным (для тестов)
    resetUsers: (s) => {
      s.users = SEED_USERS
      localStorage.setItem('users', JSON.stringify(s.users))
    },
  },
})

function persistSession(s: AuthState) {
  const { users, ...session } = s
  localStorage.setItem('auth', JSON.stringify(session))
}

function syncUser(s: AuthState) {
  const idx = s.users.findIndex(u => u.phone === s.phone)
  if (idx >= 0) {
    s.users[idx].bonus = s.bonus
    s.users[idx].name = s.name
    localStorage.setItem('users', JSON.stringify(s.users))
  }
}

export const {
  register, login, loginAs, logout,
  addBonus, spendBonus,
  changeUserRole, deleteUser, resetUsers,
} = slice.actions
export default slice.reducer