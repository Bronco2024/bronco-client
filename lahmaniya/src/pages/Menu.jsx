import { PRODUCTS, formatPrice } from '../data/products'
import { useCart } from '../cart/CartContext'
import { ProductArt } from '../components/ProductArt'
import './Menu.css'

const LABELS = {
  rolls: 'لحمانيات',
  mortadella: 'مرتديلا',
  combo: 'باقات',
}

export function Menu() {
  const { items, add, setQty } = useCart()
  const groups = ['rolls', 'mortadella', 'combo']

  return (
    <main className="page menu">
      <header className="menu-head">
        <h1 className="section-title">القائمة</h1>
        <p className="section-sub">نقّي اللي بدك، وعدّل الكمية من هون.</p>
      </header>

      {groups.map((cat) => (
        <section key={cat} className="menu-group">
          <h2>{LABELS[cat]}</h2>
          <ul>
            {PRODUCTS.filter((p) => p.category === cat).map((p) => {
              const qty = items[p.id] || 0
              return (
                <li key={p.id} className="product-row">
                  <div className="product-art-wrap">
                    <ProductArt type={p.image} />
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="product-meta">
                      <span className="price">{formatPrice(p.price)}</span>
                      <span className="unit">/ {p.unit}</span>
                    </div>
                    {qty === 0 ? (
                      <button type="button" className="btn btn-primary add-btn" onClick={() => add(p.id)}>
                        أضف
                      </button>
                    ) : (
                      <div className="qty" aria-label={`كمية ${p.name}`}>
                        <button type="button" aria-label="إنقاص" onClick={() => setQty(p.id, qty - 1)}>
                          −
                        </button>
                        <span>{qty}</span>
                        <button type="button" aria-label="زيادة" onClick={() => setQty(p.id, qty + 1)}>
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}
