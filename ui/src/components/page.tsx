import { Header } from './header'
import { Footer } from './footer'

type PageLayoutProps = {
  children: React.ReactNode
}

export function Page({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
