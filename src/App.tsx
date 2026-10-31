import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import RequireRole from './components/RequireRole'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Partner from './pages/Partner'
import Collector from './pages/Collector'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/shop/:slug" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={
              <RequireRole roles={['customer','partner','collector','admin']}>
                <Profile />
              </RequireRole>
            } />
            <Route path="/admin" element={
              <RequireRole roles={['admin']}>
                <Admin />
              </RequireRole>
            } />
            <Route path="/partner/*" element={
              <RequireRole roles={['partner','admin']}>
                <Partner />
              </RequireRole>
            } />
            <Route path="/collector/*" element={
              <RequireRole roles={['collector','admin']}>
                <Collector />
              </RequireRole>
            } />

            <Route
              path="*"
              element={<div className="max-w-6xl mx-auto p-6 text-center">Страница не найдена</div>}
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}