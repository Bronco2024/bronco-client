import React from "react";
import "./Homepage.css";

const categories = [
  {
    name: "כלבים",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "חתולים",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "ארנבים",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "ציפורים",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "דגים",
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "זוחלים",
    image:
      "https://images.unsplash.com/photo-1527158701062-8b2f6e2e4e5b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "מכרסמים",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "סוסים",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80",
  },
];

const listings = [
  {
    title: "גור גולדן רטריבר",
    location: "תל אביב",
    details: "זכר • 3 חודשים",
    price: "₪4,500",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "חתול בריטי קצר שיער",
    location: "ירושלים",
    details: "נקבה • 2.5 חודשים",
    price: "₪2,200",
    image:
      "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "גור פומרניאן",
    location: "חיפה",
    details: "זכר • 11 שבועות",
    price: "₪3,000",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "ארנב ננסי",
    location: "ראשון לציון",
    details: "זכר • 4 חודשים",
    price: "₪350",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "תוכי ג'אקו",
    location: "באר שבע",
    details: "זכר • 8 חודשים",
    price: "₪250",
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "דג בטא",
    location: "נתניה",
    details: "זכר • 6 חודשים",
    price: "₪30",
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80",
  },
];

const services = [
  { icon: "🩺", title: "וטרינרים", text: "טיפול רפואי מקצועי" },
  { icon: "✂️", title: "מספרות", text: "טיפוח וספא לחיות" },
  { icon: "🐕", title: "אילוף", text: "אילוף חיובי" },
  { icon: "🏠", title: "פנסיון", text: "בית חם ואוהב" },
  { icon: "🦴", title: "טיולים", text: "טיולי כלבים" },
  { icon: "🥣", title: "ציוד ומזון", text: "כל מה שחיית המחמד צריכה" },
];

function Homepage() {
  return (
    <div className="pets-page" dir="rtl">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span>Pets</span>
            <strong>& Bones</strong>
            <small>העולם של חיות המחמד</small>
          </div>

          <nav>
            <a className="active" href="#home">דף הבית</a>
            <a href="#adoption">אימוץ</a>
            <a href="#listings">מודעות</a>
            <a href="#services">שירותים</a>
            <a href="#info">מידע</a>
            <a href="#tips">טיפים</a>
            <a href="#contact">צור קשר</a>
          </nav>

          <button className="post-button">+ פרסום מודעה</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-container">
          <div className="hero-text">
            <span className="eyebrow">🐾 Pets & Bones</span>

            <h1>
              כל מה שחיית המחמד
              <span>שלך צריכה</span>
            </h1>

            <p>
              קנו, מכרו, אמצו ומצאו את כל מה שחיית המחמד שלכם צריכה במקום אחד.
            </p>

            <div className="search-box">
              <input placeholder="מה אתם מחפשים?" />

              <select defaultValue="">
                <option value="">כל הקטגוריות</option>
                <option>כלבים</option>
                <option>חתולים</option>
                <option>ארנבים</option>
                <option>ציפורים</option>
              </select>

              <div className="location">📍 אזור</div>

              <button>חיפוש</button>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
              alt="כלב"
            />

            <div className="hero-cat">
              <img
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500&q=85"
                alt="חתול"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="section-title">
          <span>🐾</span>
          <h2>קטגוריות חיות</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>

        <a className="orange-link" href="#categories">
          לכל הקטגוריות ←
        </a>
      </section>

      {/* LISTINGS */}
      <section className="latest-section" id="listings">
        <div className="section latest-inner">
          <div className="section-title light">
            <span>▌</span>
            <h2>מודעות אחרונות</h2>
          </div>

          <div className="listings-grid">
            {listings.map((item) => (
              <div className="listing-card" key={item.title}>
                <div className="listing-image">
                  <img src={item.image} alt={item.title} />
                  <button className="heart">♡</button>
                </div>

                <div className="listing-content">
                  <h3>{item.title}</h3>
                  <p>{item.details}</p>
                  <p className="location-text">📍 {item.location}</p>
                  <strong>{item.price}</strong>
                </div>
              </div>
            ))}
          </div>

          <button className="white-button">לכל המודעות ←</button>
        </div>
      </section>

      {/* ADOPTION */}
      <section className="adoption-section" id="adoption">
        <div className="adoption-container">
          <div className="adoption-images">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80"
              alt="כלב"
            />
            <img
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80"
              alt="חתול"
            />
          </div>

          <div className="adoption-text">
            <span>♡</span>
            <h2>לאימוץ בית חם</h2>
            <p>חיות מדהימות מחכות לבית אוהב ולמשפחה שתעניק להן אהבה.</p>
            <button>לכל חיות האימוץ ←</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services-section" id="services">
        <div className="section-title">
          <span>▌</span>
          <h2>שירותים לחיות המחמד</h2>
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

        <a className="orange-link" href="#services">
          לכל השירותים ←
        </a>
      </section>

      {/* CTA */}
      <section className="cta">
        <div>
          <h2>יש לכם חיית מחמד?</h2>
          <p>פרסמו מודעה והגיעו לאלפי אוהבי חיות.</p>
        </div>

        <button>+ פרסום מודעה</button>

        <div className="cta-pets">🐶 🐱</div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <span>Pets</span>
              <strong>& Bones</strong>
            </div>
            <p>העולם של חיות המחמד</p>
          </div>

          <div>
            <h4>שירות לקוחות</h4>
            <a href="#contact">צור קשר</a>
            <a href="#terms">תנאי שימוש</a>
          </div>

          <div>
            <h4>מידע</h4>
            <a href="#about">אודותינו</a>
            <a href="#questions">שאלות נפוצות</a>
            <a href="#privacy">מדיניות פרטיות</a>
          </div>

          <div>
            <h4>עקבו אחרינו</h4>
            <div className="socials">
              <span>◎</span>
              <span>f</span>
            </div>
          </div>
        </div>

        <div className="copyright">
          © 2024 Pets & Bones כל הזכויות שמורות
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
