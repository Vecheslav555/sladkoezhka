export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500 flex flex-wrap gap-4 justify-between">
        <div>© {new Date().getFullYear()} Сладкоежка · Калининград</div>
        <div>Все магазины и бренды вымышлены · Фото — Unsplash</div>
      </div>
    </footer>
  )
}