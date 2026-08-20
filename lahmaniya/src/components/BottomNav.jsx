import { NavLink } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="15" rx="8" ry="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 14c2-3 10-3 12 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h2l1.2 10.2A2 2 0 0 0 9.2 18h7.5a2 2 0 0 0 2-1.7L20 8H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20.5" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function BottomNav() {
  const { count } = useCart()

  return (
    <nav className="bottom-nav" aria-label="التنقل الرئيسي">
      <NavLink to="/" end>
        <span className="icon">
          <IconHome />
        </span>
        الرئيسية
      </NavLink>
      <NavLink to="/menu">
        <span className="icon">
          <IconMenu />
        </span>
        القائمة
      </NavLink>
      <NavLink to="/cart">
        <span className="nav-icon-wrap">
          <span className="icon">
            <IconCart />
          </span>
          {count > 0 && <span className="badge">{count}</span>}
        </span>
        السلة
      </NavLink>
    </nav>
  )
}
