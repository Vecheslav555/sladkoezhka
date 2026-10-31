import type { Category } from './types'

// Открытые изображения Unsplash по категориям
export const CATEGORY_IMAGES: Record<Category, string[]> = {
  'торты': [
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
  ],
  'пирожные': [
    'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80',
  ],
  'конфеты': [
    'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=80',
  ],
  'печенье': [
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80',
  ],
  'зефир': [
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=80',
  ],
  'шоколад': [
    'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80',
  ],
}

/** Случайная картинка категории */
export function randomImageFor(category: Category): string {
  const arr = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES['торты']
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Первая картинка категории (детерминированно) */
export function defaultImageFor(category: Category): string {
  return (CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES['торты'])[0]
}

/** Безопасное получение картинки (fallback по категории) */
export function safeImage(image: string | undefined, category: Category): string {
  return image && image.trim() ? image : defaultImageFor(category)
}