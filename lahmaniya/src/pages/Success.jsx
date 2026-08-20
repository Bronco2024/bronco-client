import { Link, useLocation, Navigate } from 'react-router-dom'
import { formatDayLabel, formatPrice } from '../data/products'
import './Success.css'

export function Success() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return <Navigate to="/" replace />
  }

  const day = order.deliveryDay ? formatDayLabel(new Date(order.deliveryDay)) : ''

  return (
    <main className="page success">
      <div className="success-mark" aria-hidden>
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="#14352f" />
          <path
            d="M24 41l10 10 22-24"
            fill="none"
            stroke="#f4faf7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="section-title">تم تأكيد طلبك</h1>
      <p className="section-sub">
        رقم الطلب <strong>{order.id}</strong>
        {day ? ` — التوصيل يوم ${day}` : ''}. منوصّل لباب البيت.
      </p>

      <div className="success-card">
        <p>
          <span>الاسم</span>
          <strong>{order.customer.name}</strong>
        </p>
        <p>
          <span>العنوان</span>
          <strong>{order.customer.address}</strong>
        </p>
        <p>
          <span>الإجمالي</span>
          <strong>{formatPrice(order.total)}</strong>
        </p>
      </div>

      <Link className="btn btn-primary btn-block" to="/menu">
        اطلب كمان مرة
      </Link>
      <Link className="btn btn-ghost btn-block" to="/">
        الرجوع للرئيسية
      </Link>
    </main>
  )
}
