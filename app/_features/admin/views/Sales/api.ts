import { supabase } from '@/utils/supabase/supabase'
import type { Order, OrderNotification, OrderPreparation } from './types'

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchOrders(): Promise<{ orders: Order[]; notificationsEnabled: boolean }> {
  const res = await fetch('/api/list-orders', { headers: await authHeaders() })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return { orders: json.orders ?? [], notificationsEnabled: json.notificationsEnabled === true }
}

export async function setOrderPrepared(orderId: string, prepared: boolean): Promise<OrderPreparation> {
  const res = await fetch('/api/set-order-prepared', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ orderId, prepared }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.order
}

// Resolves to the notification record, or { alreadyNotifiedAt } when the server
// refuses a non-confirmed second send.
export async function notifyCustomer(
  orderId: string,
  resend: boolean,
): Promise<{ order: OrderNotification } | { alreadyNotifiedAt: string }> {
  const res = await fetch('/api/notify-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ orderId, resend }),
  })
  const json = await res.json().catch(() => ({}))
  if (res.status === 409 && json.alreadyNotifiedAt) return { alreadyNotifiedAt: json.alreadyNotifiedAt }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return { order: json.order }
}
