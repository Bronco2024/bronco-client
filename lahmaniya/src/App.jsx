import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { Menu } from './pages/Menu'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Success } from './pages/Success'

function Shell() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/success' || pathname === '/checkout'

  return (
    <div className={`app-shell ${hideNav ? 'app-shell--flush' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </CartProvider>
  )
}
