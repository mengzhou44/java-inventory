import { useState, useEffect, useCallback } from 'react'
import { Table } from 'antd'
import { Page } from '../components/page'
import type { Order, CreateOrderLine } from '../api/orders'
import { apiListOrders, apiCreateOrder } from '../api/orders'
import { apiList as apiListInventory } from '../api/inventory'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [skus, setSkus] = useState<string[]>([])
  const [customerId, setCustomerId] = useState('')
  const [lines, setLines] = useState<CreateOrderLine[]>([{ productSku: '', quantity: 0 }])

  useEffect(() => {
    apiListInventory()
      .then((items) => setSkus(items.map((i) => i.productSku)))
      .catch(() => setSkus([]))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await apiListOrders()
      setOrders(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function addLine() {
    setLines((prev) => [...prev, { productSku: '', quantity: 0 }])
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  function updateLine(index: number, field: 'productSku' | 'quantity', value: string | number) {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    )
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const trimmedCustomerId = customerId.trim()
    if (!trimmedCustomerId) return
    const validLines = lines.filter((l) => l.productSku.trim() && l.quantity > 0)
    if (validLines.length === 0) {
      setError('Add at least one line with SKU and quantity > 0')
      return
    }
    setError(null)
    try {
      await apiCreateOrder({
        customerId: trimmedCustomerId,
        lines: validLines.map((l) => ({ productSku: l.productSku.trim(), quantity: l.quantity })),
      })
      setCustomerId('')
      setLines([{ productSku: '', quantity: 0 }])
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create order failed')
    }
  }

  return (
    <Page>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-slate-800">Order Management</h2>

        {error && (
          <div className="rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-2">
            {error}
          </div>
        )}

        {/* Create order */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Create order</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Customer ID</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 w-64 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="e.g. cust-001"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-600">Order lines</label>
                <button
                  type="button"
                  onClick={addLine}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  + Add line
                </button>
              </div>
              <div className="space-y-2">
                {lines.map((line, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <select
                      value={line.productSku}
                      onChange={(e) => updateLine(index, 'productSku', e.target.value)}
                      className="border border-slate-300 rounded px-3 py-2 w-40 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="">Select SKU</option>
                      {skus.map((sku) => (
                        <option key={sku} value={sku}>
                          {sku}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={line.quantity || ''}
                      onChange={(e) => updateLine(index, 'quantity', Number(e.target.value) || 0)}
                      className="border border-slate-300 rounded px-3 py-2 w-24 focus:ring-2 focus:ring-slate-500"
                      placeholder="Qty"
                    />
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 focus:ring-2 focus:ring-slate-500"
            >
              Create order
            </button>
          </form>
        </section>

        {/* List orders */}
        <section className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Orders</h3>
          <Table<Order>
            rowKey="id"
            loading={loading}
            dataSource={orders}
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId', width: 140 },
              { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
              {
                title: 'Items',
                key: 'items',
                render: (_, record) =>
                  record.items?.length
                    ? record.items.map((i) => `${i.productSku}: ${i.quantity}`).join(', ')
                    : '—',
              },
              {
                title: 'Created',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: 180,
                render: (v: string) => (v ? new Date(v).toLocaleString() : '—'),
              },
            ]}
            locale={{ emptyText: 'No orders yet. Create one above.' }}
            pagination={{ pageSize: 10 }}
          />
        </section>
      </div>
    </Page>
  )
}
