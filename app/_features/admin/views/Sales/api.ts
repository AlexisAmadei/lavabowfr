import { supabase } from '@/utils/supabase/supabase'
import type { Order, OrderPreparation } from './types'

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/list-orders', { headers: await authHeaders() })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.orders ?? []
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
