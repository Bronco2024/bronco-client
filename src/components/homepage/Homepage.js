import React from "react";
import "./Homepage.css";

const services = [
  { icon: "🐾", title: "אימוץ", text: "מצאו חבר חדש לחיים" },
  { icon: "🛒", title: "חנות", text: "מזון, צעצועים ואביזרים" },
  { icon: "✂️", title: "טיפוח וספר", text: "טיפוח מקצועי לחיות שלכם" },
  { icon: "🏠", title: "פנסיון", text: "אירוח בטוח ונוח לחיות" },
  { icon: "🎓", title: "אילוף", text: "אילוף והתנהגות מקצועית" },
  { icon: "🩺", title: "וטרינר", text: "טיפול וייעוץ רפואי" },
];

const categories = [
  ["🐶", "כלבים"],
  ["🐱", "חתולים"],
  ["🐴", "סוסים"],
  ["🐰", "ארנבים"],
  ["🐠", "דגים"],
  ["🦜", "ציפורים"],
  ["🦎", "זוחלים"],
  ["🐢", "אחרים"],
];

const ads = [
  { image: "🐶", title: "גור גולדן רטריבר", location: "תל אביב", price: "4,500 ₪" },
  { image: "🐱", title: "חתול מקסים לאימוץ", location: "חיפה", price: "לאימוץ" },
  { image: "🐴", title: "סוס ערבי יפהפה", location: "השרון", price: "18,000 ₪" },
  { image: "🦜", title: "תוכי ארה מקאו", location: "ירושלים", price: "3,200 ₪" },
];

function Homepage() {
  return (
    <div className="pet-homepage" dir="rtl">

      {/* Header */}
      <header className="pet-header">
        <div className="pet-logo">
          <span>🐾</span>
          <div>
            <strong>עולם החיות</strong>
            <small>כל מה שחיות המחמד שלכם צריכות</small>
          </div>
        </div>

        <nav>
          <a className="active">דף הבית</a>
          <a>חיות לאימוץ</a>
          <a>חנות</a>
          <a>שירותים</a>
          <a>וטרינרים</a>
          <a>מאמרים</a>
          <a>צור קשר</a>
        </nav>

        <button className="login-btn">התחבר / הירשם</button>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="welcome">ברוכים הבאים ל־</span>

          <h1>עולם החיות 🐾</h1>

          <p>
            הפלטפורמה המובילה לכל צרכי חיות המחמד שלכם
          </p>

          <div className="hero-badges">
            <span>🛡️ שירות אמין</span>
            <span>🏷️ מחירים הוגנים</span>
            <span>👨‍⚕️ אנשי מקצוע</span>
            <span>🏠 הכל במקום אחד</span>
          </div>

          <div className="hero-buttons">
            <button className="main-btn">🔎 חיפוש שירותים</button>
            <button className="secondary-btn">כל השירותים</button>
          </div>
        </div>

        <div className="hero-animals">
          <div>🐶</div>
          <div>🐱</div>
          <div>🐰</div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <h2>השירותים שלנו 🐾</h2>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <button>לפרטים נוספים ←</button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>קטגוריות פופולריות 🐾</h2>

        <div className="categories-grid">
          {categories.map(([icon, title]) => (
            <div className="category" key={title}>
              <div>{icon}</div>
              <span>{title}</span>
            </div>
          ))}
        </div>

        <button className="outline-btn">צפייה בכל הקטגוריות ←</button>
      </section>

      {/* Ads */}
      <section className="section">
        <h2>מודעות מומלצות 🐾</h2>

        <div className="ads-grid">
          {ads.map((ad) => (
            <div className="ad-card" key={ad.title}>
              <div className="ad-image">{ad.image}</div>

              <div className="ad-content">
                <span className="sale-tag">למכירה</span>
                <h3>{ad.title}</h3>
                <p>{ad.location}</p>
                <strong>{ad.price}</strong>
              </div>
            </div>
          ))}
        </div>

        <button className="outline-btn">צפייה בכל המודעות</button>
      </section>

      {/* Trust */}
      <section className="trust-section">
        <div>
          <span>🔒</span>
          <strong>תשלום מאובטח</strong>
          <small>הקנייה שלך מוגנת</small>
        </div>

        <div>
          <span>🚚</span>
          <strong>משלוחים מהירים</strong>
          <small>משלוח עד הבית</small>
        </div>

        <div>
          <span>🎧</span>
          <strong>שירות לקוחות</strong>
          <small>זמינים עבורכם 24/7</small>
        </div>

        <div>
          <span>⭐</span>
          <strong>דירוגים גבוהים</strong>
          <small>אלפי לקוחות מרוצים</small>
        </div>
      </section>

      {/* App */}
      <section className="app-banner">
        <div>
          <h2>האפליקציה של עולם החיות 📱</h2>
          <p>כל השירותים והחיות בכף היד שלכם</p>
          <button>הורידו את האפליקציה</button>
        </div>

        <div className="phone">📱</div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div>
          <strong>+15,000</strong>
          <span>לקוחות מרוצים</span>
        </div>

        <div>
          <strong>+5,000</strong>
          <span>חיות שאומצו</span>
        </div>

        <div>
          <strong>+2,000</strong>
          <span>שירותים בוצעו</span>
        </div>

        <div>
          <strong>+800</strong>
          <span>עסקים שותפים</span>
        </div>
      </section>

    </div>
  );
}

export default Homepage;
