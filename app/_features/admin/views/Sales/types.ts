export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
export type DeliveryMethod = 'in_hand' | 'shipping'
export type PreparationFilter = 'all' | 'to_prepare' | 'prepared'

export interface OrderItem {
  id: string
  product_id: number
  name_snapshot: string
  size_snapshot: string | null
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
  prepared_at: string | null
  prepared_by: string | null
  prepared_by_email: string | null
  customer_notified_at: string | null
  customer_notified_by: string | null
  customer_notified_by_email: string | null
  items: OrderItem[]
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  paid: 'green',
  pending: 'yellow',
  refunded: 'blue',
  failed: 'red',
  expired: 'gray',
}

export type OrderPreparation = Pick<Order, 'prepared_at' | 'prepared_by' | 'prepared_by_email'>

export type OrderNotification = Pick<
  Order,
  'customer_notified_at' | 'customer_notified_by' | 'customer_notified_by_email'
>

export function isPrepared(order: Order): boolean {
  return order.prepared_at !== null
}

// Only paid orders can change preparation state; refunded ones keep theirs as history.
export function canTogglePrepared(order: Order): boolean {
  return order.status === 'paid'
}

// Notifying needs a prepared, paid order and someone to email.
export function canNotify(order: Order): boolean {
  return order.status === 'paid' && isPrepared(order) && order.email !== null
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}
