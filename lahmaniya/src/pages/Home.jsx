import { Link } from 'react-router-dom'
import './Home.css'

export function Home() {
  return (
    <main className="page home">
      <section className="hero" aria-label="لحمانيا">
        <div className="hero-glow" aria-hidden />
        <p className="hero-kicker">توصيل لباب البيت</p>
        <h1 className="brand">لحمانيا</h1>
        <p className="hero-lead">
          لحمانيات طازجة ومرتديلا جاهزة — اختَر الكمية ويوم التوصيل، ونوصل لباب بيتك.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-accent" to="/menu">
            اطلب الآن
          </Link>
          <a className="btn btn-ghost" href="#how">
            كيف يشتغل؟
          </a>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="plate plate-a">
            <svg viewBox="0 0 200 140">
              <ellipse cx="100" cy="118" rx="70" ry="14" fill="rgba(18,33,30,0.15)" />
              <ellipse cx="78" cy="78" rx="48" ry="28" fill="#f3e6c8" />
              <ellipse cx="78" cy="70" rx="40" ry="20" fill="#e8d4a8" />
              <rect x="108" y="52" width="58" height="42" rx="10" fill="#c45c4a" />
              <circle cx="137" cy="73" r="10" fill="rgba(255,255,255,0.22)" />
            </svg>
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <h2 className="section-title">ثلاث خطوات وبس</h2>
        <p className="section-sub">من الموبايل لباب البيت — بدون تعقيد.</p>
        <ol className="steps">
          <li>
            <strong>اختَر</strong>
            <span>لحمانيات ومرتديلا بالكمية اللي بدك إياها</span>
          </li>
          <li>
            <strong>حدّد اليوم</strong>
            <span>اختَر يوم التوصيل المناسب لبيتك</span>
          </li>
          <li>
            <strong>استلم</strong>
            <span>نوصل الطلب طازج لباب البيت</span>
          </li>
        </ol>
      </section>
    </main>
  )
}
