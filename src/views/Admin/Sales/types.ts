export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
export type DeliveryMethod = 'in_hand' | 'shipping'

export interface OrderItem {
  id: string
  product_id: number
  name_snapshot: string
  price_cents_snapshot: number
  quantity: number
}

export interface ShippingAddress {
  line1?: string | null
  line2?: string | null
  city?: string | null
  postal_code?: string | null
  state?: string | null
  country?: string | null
}

export interface Order {
  id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  email: string | null
  delivery_method: DeliveryMethod
  shipping_cost_cents: number
  discount_code: string | null
  discount_amount_cents: number
  subtotal_cents: number
  total_cents: number
  status: OrderStatus
  shipping_address: ShippingAddress | null
  created_at: string
  paid_at: string | null
  items: OrderItem[]
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  paid: 'green',
  pending: 'yellow',
  refunded: 'blue',
  failed: 'red',
  expired: 'gray',
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}
