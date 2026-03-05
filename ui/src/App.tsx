import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { InventoryPage } from './pages/inventory'
import { InventoryDetailPage } from './pages/inventory-detail'
import { OrdersPage } from './pages/orders'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:productSku" element={<InventoryDetailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
