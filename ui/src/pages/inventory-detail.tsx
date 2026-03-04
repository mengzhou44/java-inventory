import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Descriptions, Spin } from 'antd'
import { Page } from '../components/page'
import { apiGet } from '../api/inventory'
import type { InventoryItem } from '../api/inventory'

function formatDate(s: string | undefined): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

export function InventoryDetailPage() {
  const { productSku } = useParams<{ productSku: string }>()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productSku) return
    setLoading(true)
    setError(null)
    apiGet(decodeURIComponent(productSku))
      .then((data) => setItem(data ?? null))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [productSku])

  if (loading) {
    return (
      <Page>
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      </Page>
    )
  }

  if (error || !item) {
    return (
      <Page>
        <div className="space-y-4">
          <p className="text-red-600">{error ?? 'Item not found.'}</p>
          <Link to="/inventory">
            <Button type="primary">Back to list</Button>
          </Link>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/inventory">
            <Button>Back to list</Button>
          </Link>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Inventory item</h2>
        <Card>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Product SKU">{item.productSku}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{item.quantity}</Descriptions.Item>
            <Descriptions.Item label="Created at">{formatDate(item.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Updated at">{formatDate(item.updatedAt)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </Page>
  )
}
