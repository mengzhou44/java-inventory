export type InventoryItem = {
  id: number
  productSku: string
  quantity: number
  createdAt?: string
  updatedAt?: string
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').toString().replace(/\/+$/, '')
export const API_BASE = apiBaseUrl ? `${apiBaseUrl}/api/inventory` : '/api/inventory'

export async function apiList(): Promise<InventoryItem[]> {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to load inventory')
  return res.json()
}

export async function apiGet(productSku: string): Promise<InventoryItem | null> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(productSku)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load item')
  return res.json()
}

export async function apiCreate(productSku: string, initialQuantity: number): Promise<InventoryItem> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productSku, initialQuantity }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Create failed')
  }
  return res.json()
}

export async function apiAdjust(productSku: string, delta: number, reason: string): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productSku, delta, reason }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Adjust failed')
  }
  return res.json()
}

export async function apiDelete(productSku: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(productSku)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
}
