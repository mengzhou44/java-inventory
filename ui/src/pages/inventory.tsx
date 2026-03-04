import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, Popconfirm, Table } from 'antd'
import { Page } from '../components/page'
import type { InventoryItem } from '../api/inventory'
import { apiList, apiCreate, apiAdjust, apiDelete } from '../api/inventory'

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createSku, setCreateSku] = useState('')
  const [createQty, setCreateQty] = useState(0)

  const [adjustSku, setAdjustSku] = useState<string | null>(null)
  const [adjustDelta, setAdjustDelta] = useState(0)
  const [adjustReason, setAdjustReason] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await apiList()
      setItems(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createSku.trim()) return
    setError(null)
    try {
      await apiCreate(createSku.trim(), createQty)
      setCreateSku('')
      setCreateQty(0)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed')
    }
  }

  async function handleAdjust(e: React.FormEvent) {
    e.preventDefault()
    if (adjustSku == null) return
    setError(null)
    try {
      await apiAdjust(adjustSku, adjustDelta, adjustReason)
      setAdjustSku(null)
      setAdjustDelta(0)
      setAdjustReason('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Adjust failed')
    }
  }

  async function handleDelete(productSku: string) {
    setError(null)
    try {
      await apiDelete(productSku)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <Page>
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-slate-800">Inventory Management</h2>

      {error && (
        <div className="rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-2">
          {error}
        </div>
      )}

      {/* Create */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-slate-700 mb-4">Add item</h3>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Product SKU</label>
            <input
              type="text"
              value={createSku}
              onChange={(e) => setCreateSku(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 w-48 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="e.g. SKU-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Initial quantity</label>
            <input
              type="number"
              min={0}
              value={createQty}
              onChange={(e) => setCreateQty(Number(e.target.value))}
              className="border border-slate-300 rounded px-3 py-2 w-24 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 focus:ring-2 focus:ring-slate-500"
          >
            Create
          </button>
        </form>
      </section>

      {/* List */}
      <section className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h3 className="text-lg font-medium text-slate-700 mb-4">Items</h3>
        <Table<InventoryItem>
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={[
            {
              title: 'Product SKU',
              dataIndex: 'productSku',
              key: 'productSku',
              render: (sku: string) => (
                <Link to={`/inventory/${encodeURIComponent(sku)}`} className="text-blue-600 hover:underline">
                  {sku}
                </Link>
              ),
            },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 120 },
            {
              title: 'Actions',
              key: 'actions',
              width: 180,
              render: (_, record) => (
                <span className="space-x-2">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setAdjustSku(record.productSku)
                      setAdjustDelta(0)
                      setAdjustReason('')
                    }}
                  >
                    Adjust
                  </Button>
                  <Popconfirm
                    title="Delete this item?"
                    description={`Remove "${record.productSku}" from inventory?`}
                    onConfirm={() => handleDelete(record.productSku)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="link" size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </span>
              ),
            },
          ]}
          locale={{ emptyText: 'No inventory items. Add one above.' }}
          pagination={false}
        />
      </section>

      {/* Adjust modal / inline */}
      {adjustSku != null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Adjust: {adjustSku}</h3>
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Delta (+/-)</label>
                <input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="border border-slate-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g. correction, damage"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAdjustSku(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </Page>
  )
}
