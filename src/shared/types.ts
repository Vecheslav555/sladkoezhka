export type Category = 'торты' | 'пирожные' | 'конфеты' | 'печенье' | 'зефир' | 'шоколад'

export interface Shop {
  id: number; slug: string; name: string; logo: string; cover: string;
  rating: number; minOrder: number; deliveryFee: number; deliveryTime: string;
  description: string; isActive: boolean;
}

export interface ProductVariant {
  name: string; type: 'упаковка' | 'декор' | 'начинка'; priceDelta: number;
}

export interface Product {
  id: number; slug: string; shopSlug: string; name: string; category: Category;
  description: string; price: number; oldPrice?: number; weight: string;
  image: string; composition: string; allergens: string; shelfLife: string;
  calories: number; isNew?: boolean; isHit?: boolean; isAvailable: boolean;
  variants?: ProductVariant[];
}

export interface CartItem { productId: number; qty: number; variant?: string }

export type OrderStatus =
  | 'pending' | 'accepted' | 'preparing' | 'packing'
  | 'delivering' | 'delivered' | 'canceled';

export interface OrderLine { productId: number; name: string; qty: number; price: number }

export interface Order {
  id: number; status: OrderStatus; total: number; deliveryFee: number;
  address: string; createdAt: string; items: OrderLine[];
  bonusEarned: number; bonusUsed: number;
  customer: string;
  payment: 'card' | 'cash';
  comment?: string;
  postcard?: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает подтверждения', accepted: 'Принят',
  preparing: 'Готовится', packing: 'Собирается',
  delivering: 'В доставке', delivered: 'Доставлен', canceled: 'Отменён',
};

export const STATUS_FLOW: OrderStatus[] = [
  'pending','accepted','preparing','packing','delivering','delivered'
];