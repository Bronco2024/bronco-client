import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PRODUCTS,
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  formatPrice,
  nextDeliveryDays,
  formatDayLabel,
} from '../data/products'
import { useCart } from '../cart/CartContext'
import './Checkout.css'

const ORDERS_KEY = 'lahmaniya-orders-v1'

export function Checkout() {
  const { items, count, deliveryDay, setDay, customer, setCustomer, clear } = useCart()
  const navigate = useNavigate()
  const days = useMemo(() => nextDeliveryDays(7), [])

  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [address, setAddress] = useState(customer?.address || '')
  const [notes, setNotes] = useState(customer?.notes || '')
  const [error, setError] = useState('')

  const subtotal = PRODUCTS.reduce((s, p) => s + (items[p.id] || 0) * p.price, 0)
  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  if (count === 0) {
    return (
      <main className="page checkout empty">
        <h1 className="section-title">ما في طلب</h1>
        <p className="section-sub">أضف منتجات للسلة أولاً.</p>
        <Link className="btn btn-primary" to="/menu">
          القائمة
        </Link>
      </main>
    )
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('عبّي الاسم، الموبايل، والعنوان.')
      return
    }
    if (!deliveryDay) {
      setError('اختَر يوم التوصيل.')
      return
    }

    const order = {
      id: `L-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      deliveryDay,
      customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), notes: notes.trim() },
      items: { ...items },
      subtotal,
      delivery,
      total,
    }

    try {
      const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
      localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...prev].slice(0, 20)))
    } catch {
      /* ignore */
    }

    setCustomer(order.customer)
    clear()
    navigate('/success', { state: { order } })
  }

  return (
    <main className="page checkout">
      <header>
        <h1 className="section-title">التوصيل لباب البيت</h1>
        <p className="section-sub">حدّد اليوم والعنوان، ونخلّص الطلب.</p>
      </header>

      <form onSubmit={submit} noValidate>
        <fieldset className="day-pick">
          <legend>يوم التوصيل</legend>
          <div className="day-grid" role="listbox" aria-label="أيام التوصيل">
            {days.map((d) => {
              const iso = d.toISOString()
              const selected = deliveryDay === iso
              return (
                <button
                  key={iso}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`day-chip ${selected ? 'selected' : ''}`}
                  onClick={() => setDay(iso)}
                >
                  {formatDayLabel(d)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="name">الاسم</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="phone">رقم الموبايل</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="05XXXXXXXX"
          />
        </div>
        <div className="field">
          <label htmlFor="address">عنوان البيت</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="الشارع، رقم البناية، الطابق، المدينة"
            autoComplete="street-address"
          />
        </div>
        <div className="field">
          <label htmlFor="notes">ملاحظات (اختياري)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثلاً: خلّي المرتديلا مقطّعة رفيع"
          />
        </div>

        <div className="pay-box">
          <div>
            <span>الإجمالي مع التوصيل</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p>الدفع عند الاستلام — نقداً أو بطاقة عند الباب.</p>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-accent btn-block">
          تأكيد الطلب
        </button>
      </form>
    </main>
  )
}
