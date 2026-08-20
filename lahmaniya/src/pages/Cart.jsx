import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, DELIVERY_FEE, FREE_DELIVERY_FROM, formatPrice } from '../data/products'
import { useCart } from '../cart/CartContext'
import { ProductArt } from '../components/ProductArt'
import './Cart.css'

export function Cart() {
  const { items, setQty, remove, count } = useCart()
  const navigate = useNavigate()

  const lines = PRODUCTS.filter((p) => items[p.id]).map((p) => ({
    product: p,
    qty: items[p.id],
    lineTotal: p.price * items[p.id],
  }))

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  if (count === 0) {
    return (
      <main className="page cart empty">
        <h1 className="section-title">السلة فاضية</h1>
        <p className="section-sub">روح على القائمة وضيف لحمانيات ومرتديلا.</p>
        <Link className="btn btn-primary" to="/menu">
          تصفّح القائمة
        </Link>
      </main>
    )
  }

  return (
    <main className="page cart">
      <header>
        <h1 className="section-title">سلتك</h1>
        <p className="section-sub">{count} صنف — راجع الطلب قبل التوصيل.</p>
      </header>

      <ul className="cart-list">
        {lines.map(({ product: p, qty, lineTotal }) => (
          <li key={p.id} className="cart-line">
            <div className="cart-art">
              <ProductArt type={p.image} />
            </div>
            <div className="cart-info">
              <div className="cart-top">
                <h3>{p.name}</h3>
                <button type="button" className="remove" onClick={() => remove(p.id)} aria-label="حذف">
                  حذف
                </button>
              </div>
              <p className="line-price">{formatPrice(lineTotal)}</p>
              <div className="qty">
                <button type="button" aria-label="إنقاص" onClick={() => setQty(p.id, qty - 1)}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" aria-label="زيادة" onClick={() => setQty(p.id, qty + 1)}>
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="totals">
        <div>
          <span>المجموع الفرعي</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div>
          <span>التوصيل</span>
          <strong>{delivery === 0 ? 'مجاني' : formatPrice(delivery)}</strong>
        </div>
        {subtotal < FREE_DELIVERY_FROM && (
          <p className="hint">توصيل مجاني من {formatPrice(FREE_DELIVERY_FROM)}</p>
        )}
        <div className="grand">
          <span>الإجمالي</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>

      <button type="button" className="btn btn-accent btn-block" onClick={() => navigate('/checkout')}>
        متابعة للتوصيل
      </button>
    </main>
  )
}
