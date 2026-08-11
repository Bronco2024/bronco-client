import React from "react";
import "./Homepage.css";

const categories = [
  { name: "כלבים", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500" },
  { name: "חתולים", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500" },
  { name: "ארנבים", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500" },
  { name: "ציפורים", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500" },
  { name: "דגים", image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500" },
  { name: "זוחלים", image: "https://images.unsplash.com/photo-1527159971379-6d4f8e0a3a4f?w=500" },
  { name: "מכרסמים", image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500" },
  { name: "סוסים", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500" },
];

const ads = [
  {
    name: "גור גולדן רטריבר",
    details: "זכר • 3 חודשים",
    city: "תל אביב",
    price: "₪4,500",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=700",
  },
  {
    name: "חתול בריטי קצר שיער",
    details: "נקבה • 2.5 חודשים",
    city: "ירושלים",
    price: "₪2,200",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=700",
  },
  {
    name: "ארנב ננסי",
    details: "זכר • 4 חודשים",
    city: "ראשון לציון",
    price: "₪350",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=700",
  },
  {
    name: "גור פומרניאן",
    details: "זכר • 11 שבועות",
    city: "חיפה",
    price: "₪3,000",
    image: "https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=700",
  },
];

const services = [
  { icon: "🩺", title: "וטרינרים", text: "טיפול רפואי מקצועי" },
  { icon: "✂️", title: "מספרות", text: "טיפוח לכלבים וחתולים" },
  { icon: "🐕", title: "אילוף", text: "אילוף חיובי ומקצועי" },
  { icon: "🏠", title: "פנסיון", text: "בית חם לחיית המחמד" },
  { icon: "🦮", title: "טיולים", text: "טיולים עם כלבים" },
  { icon: "🥣", title: "ציוד ומזון", text: "כל מה שחיית המחמד צריכה" },
];

function Homepage() {
  return (
    <div className="pets-page" dir="rtl">

      {/* HEADER */}
      <header className="main-header">
        <div className="header-inner">

          <div className="brand">
            <span className="brand-name">
              Pets<span>&</span>Bones
            </span>
            <small>העולם של חיות המחמד</small>
          </div>

          <nav className="main-nav">
            <a className="active" href="/">דף הבית</a>
            <a href="/">אימוץ</a>
            <a href="/">מודעות</a>
            <a href="/">שירותים</a>
            <a href="/">מידע</a>
            <a href="/">טיפים</a>
            <a href="/">צור קשר</a>
          </nav>

          <div className="header-actions">
            <button className="account-btn">👤 החשבון שלי</button>
            <button className="post-btn">+ פרסום מודעה</button>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">
            <div className="eyebrow">🐾 ברוכים הבאים ל־Pets & Bones</div>

            <h1>
              כל מה שחיית המחמד
              <br />
              <span>שלך צריכה</span>
            </h1>

            <p>
              קנו, מכרו, אמצו ומצאו את כל מה שחיית המחמד שלכם צריכה
              במקום אחד.
            </p>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200"
              alt="כלב"
            />
            <img
              className="hero-cat"
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=700"
              alt="חתול"
            />
          </div>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="מה אתם מחפשים?"
          />

          <select>
            <option>כל הקטגוריות</option>
            <option>כלבים</option>
            <option>חתולים</option>
            <option>ארנבים</option>
            <option>ציפורים</option>
          </select>

          <input
            type="text"
            placeholder="📍 אזור"
          />

          <button>חיפוש</button>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="section">

        <div className="section-title">
          <h2>קטגוריות חיות 🐾</h2>
          <a href="/">לכל הקטגוריות ←</a>
        </div>

        <div className="categories-grid">

          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}

        </div>

      </section>

      {/* ADS */}
      <section className="section">

        <div className="section-title">
          <h2>מודעות אחרונות</h2>
          <a href="/">לכל המודעות ←</a>
        </div>

        <div className="ads-grid">

          {ads.map((ad) => (
            <div className="ad-card" key={ad.name}>

              <div className="ad-image">
                <img src={ad.image} alt={ad.name} />
                <button className="heart">♡</button>
              </div>

              <div className="ad-content">
                <h3>{ad.name}</h3>
                <p>{ad.details}</p>
                <p>📍 {ad.city}</p>
                <strong>{ad.price}</strong>
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* ADOPTION */}
      <section className="adoption-section">

        <div className="adoption-text">
          <span>❤️ לתת בית, לתת אהבה</span>
          <h2>אימוץ בית חם</h2>
          <p>
            חיות מקסימות שמחכות למשפחה חדשה ולבית מלא באהבה.
          </p>
          <button>לכל חיות האימוץ ←</button>
        </div>

        <div className="adoption-images">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700"
            alt="כלב לאימוץ"
          />
          <img
            src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=700"
            alt="חתול לאימוץ"
          />
        </div>

      </section>

      {/* SERVICES */}
      <section className="section">

        <div className="section-title">
          <h2>שירותים לחיות המחמד</h2>
          <a href="/">לכל השירותים ←</a>
        </div>

        <div className="services-grid">

          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="cta">

        <div>
          <h2>יש לכם חיית מחמד למכירה?</h2>
          <p>פרסמו מודעה והגיעו לאלפי אוהבי חיות.</p>
        </div>

        <button>+ פרסום מודעה</button>

      </section>

      {/* FOOTER */}
      <footer>

        <div className="footer-brand">
          <h2>Pets<span>&</span>Bones 🐾</h2>
          <p>העולם של חיות המחמד</p>
        </div>

        <div>
          <h4>מידע</h4>
          <a href="/">אודותינו</a>
          <a href="/">שאלות נפוצות</a>
          <a href="/">מדיניות פרטיות</a>
        </div>

        <div>
          <h4>שירות לקוחות</h4>
          <a href="/">צור קשר</a>
          <a href="/">תנאי שימוש</a>
        </div>

        <div>
          <h4>עקבו אחרינו</h4>
          <div className="social">◎ &nbsp; f</div>
        </div>

      </footer>

    </div>
  );
}

export default Homepage;
