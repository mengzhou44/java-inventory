export type OrderItem = {
  id: number
  productSku: string
  quantity: number
  createdAt?: string
  updatedAt?: string
}

export type Order = {
  id: number
  externalOrderId?: string
  customerId: string
  status: string
  createdAt?: string
  updatedAt?: string
  items: OrderItem[]
}

export type CreateOrderLine = { productSku: string; quantity: number }
export type CreateOrderRequest = { customerId: string; lines: CreateOrderLine[] }

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').toString().replace(/\/+$/, '')
export const ORDERS_API_BASE = apiBaseUrl ? `${apiBaseUrl}/api/orders` : '/api/orders'

export async function apiListOrders(): Promise<Order[]> {
  const res = await fetch(ORDERS_API_BASE)
  if (!res.ok) throw new Error('Failed to load orders')
  return res.json()
}

export async function apiCreateOrder(request: CreateOrderRequest): Promise<Order> {
  const res = await fetch(ORDERS_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Create order failed')
  }
  return res.json()
}
