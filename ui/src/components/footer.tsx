export function Footer() {
  return (
    <footer className="mt-auto bg-slate-700 text-slate-200 text-sm py-4">
      <div className="container mx-auto px-4 text-center">
        My Inventory © {new Date().getFullYear()}
      </div>
    </footer>
  )
}
