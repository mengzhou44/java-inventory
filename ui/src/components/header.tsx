import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  return (
    <header className="bg-slate-800 text-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Order Fulfillment</h1>
        <nav className="flex gap-4">
          <Link
            to="/inventory"
            className={location.pathname.startsWith('/inventory') ? 'font-medium underline' : 'hover:underline'}
          >
            Inventory
          </Link>
          <Link
            to="/orders"
            className={location.pathname.startsWith('/orders') ? 'font-medium underline' : 'hover:underline'}
          >
            Orders
          </Link>
        </nav>
      </div>
    </header>
  )
}
