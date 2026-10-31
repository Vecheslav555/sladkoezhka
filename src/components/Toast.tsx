import { motion, AnimatePresence } from 'framer-motion'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

type ToastKind = 'success' | 'error'
interface ToastItem { id: number; kind: ToastKind; msg: string }

const ToastCtx = createContext<(msg: string, kind?: ToastKind) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<ToastItem[]>([])

  const push = useCallback((msg: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setList(l => [...l, { id, kind, msg }])
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), 2500)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed z-[100] top-4 right-4 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {list.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-2 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl text-white font-medium ${
                t.kind === 'success' ? 'bg-emerald-500/95' : 'bg-rose-500/95'
              }`}
            >
              {t.kind === 'success'
                ? <CheckCircle2 size={18} />
                : <AlertCircle size={18} />}
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}