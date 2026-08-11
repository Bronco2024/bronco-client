import React from "react";
import "./Homepage.css";

const animals = [
  { icon: "🐶", name: "כלבים" },
  { icon: "🐱", name: "חתולים" },
  { icon: "🐴", name: "סוסים" },
  { icon: "🐦", name: "ציפורים" },
  { icon: "🐠", name: "דגים" },
  { icon: "🐰", name: "ארנבים" },
  { icon: "🦎", name: "זוחלים" },
  { icon: "🐹", name: "מכרסמים" },
  { icon: "🐑", name: "חיות משק" },
];

const listings = [
  {
    image: "🐶",
    title: "גור גולדן רטריבר",
    details: "זכר • 4 חודשים",
    location: "תל אביב",
    price: "₪4,500",
  },
  {
    image: "🐱",
    title: "חתול בריטי קצר שיער",
    details: "נקבה • 3 חודשים",
    location: "ירושלים",
    price: "₪2,200",
  },
  {
    image: "🐕",
    title: "גור פומרניאן",
    details: "זכר • 3 חודשים",
    location: "חיפה",
    price: "₪2,800",
  },
  {
    image: "🦜",
    title: "תוכי ארה כחול",
    details: "זכר • שנה",
    location: "ראשון לציון",
    price: "₪1,600",
  },
];

const services = [
  {
    icon: "🩺",
    title: "וטרינרים",
    info: "רופאים וקליניקות",
  },
  {
    icon: "✂️",
    title: "מספרות",
    info: "טיפוח וניקיון",
  },
  {
    icon: "🏠",
    title: "פנסיונים",
    info: "מקום בטוח לחיית המחמד",
  },
  {
    icon: "🎓",
    title: "מאלפים",
    info: "אילוף והתנהגות",
  },
];

function Homepage() {
  return (
    <div className="pet-page" dir="rtl">

      {/* HEADER */}
      <header className="pet-header">

        <div className="brand">
          <div className="brand-icon">🐾</div>

          <div>
            <div className="brand-name">
              Pet<span>Bones</span>
            </div>

            <div className="brand-subtitle">
              עולם החיות במקום אחד
            </div>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#animals">חיות</a>
          <a href="#services">שירותים</a>
          <a href="#shop">חנות</a>
          <a href="#adoption">אימוץ</a>
          <a href="#professionals">בעלי מקצוע</a>
        </nav>

        <div className="header-buttons">
          <button className="header-search">
            🔍
          </button>

          <button className="account-button">
            👤 החשבון שלי
          </button>

          <button className="publish-button">
            ＋ פרסם מודעה
          </button>
        </div>

      </header>


      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <span className="hero-small">
              🐾 ברוכים הבאים ל־PetBones
            </span>

            <h1>
              כל עולם החיות
              <span> במקום אחד</span>
            </h1>

            <p>
              קנו, מכרו, אמצו ומצאו את כל השירותים
              והמוצרים שחיית המחמד שלכם צריכה.
            </p>

          </div>


          <div className="search-box">

            <div className="search-field">
              <span>🔍</span>

              <div>
                <small>מה אתם מחפשים?</small>
                <strong>חיה, מוצר, שירות...</strong>
              </div>
            </div>

            <div className="search-field location">
              <span>📍</span>

              <div>
                <small>איפה?</small>
                <strong>עיר או אזור</strong>
              </div>
            </div>

            <button className="search-button">
              חיפוש
            </button>

          </div>

        </div>


        <div className="hero-animals">
          <div className="big-dog">🐶</div>
          <div className="big-cat">🐱</div>
        </div>

      </section>


      {/* ANIMAL CATEGORIES */}
      <section className="animals-section" id="animals">

        <div className="section-title">
          <div>
            <span>בחרו קטגוריה</span>
            <h2>חיות</h2>
          </div>

          <button>לכל החיות ←</button>
        </div>


        <div className="animal-grid">

          {animals.map((animal, index) => (
            <button className="animal-card" key={index}>

              <div className="animal-icon">
                {animal.icon}
              </div>

              <span>{animal.name}</span>

            </button>
          ))}

        </div>

      </section>


      {/* MARKETPLACE */}
      <section className="marketplace-section">

        <div className="section-title">

          <div>
            <span>מודעות חדשות</span>
            <h2>חיות למכירה</h2>
          </div>

          <button>לכל המודעות ←</button>

        </div>


        <div className="marketplace-layout">

          <div className="listing-grid">

            {listings.map((item, index) => (

              <article className="listing-card" key={index}>

                <button className="favorite">
                  ♡
                </button>

                <div className="listing-image">
                  {item.image}
                </div>

                <div className="listing-content">

                  <h3>{item.title}</h3>

                  <p>{item.details}</p>

                  <div className="listing-location">
                    📍 {item.location}
                  </div>

                  <strong>{item.price}</strong>

                  <button className="contact-button">
                    💬 צור קשר
                  </button>

                </div>

              </article>

            ))}

          </div>


          {/* SERVICES */}
          <aside className="nearby-services" id="services">

            <div className="nearby-title">
              <span>📍</span>
              <h2>שירותים לידך</h2>
            </div>

            {services.map((service, index) => (

              <div className="service-item" key={index}>

                <div className="service-icon">
                  {service.icon}
                </div>

                <div>
                  <strong>{service.title}</strong>
                  <p>{service.info}</p>
                  <small>⭐ 4.{7 + index} • קרוב אליך</small>
                </div>

              </div>

            ))}

            <button className="all-services">
              לכל השירותים
            </button>

          </aside>

        </div>

      </section>


      {/* SHOP */}
      <section className="shop-banner" id="shop">

        <div>
          <span>🛒 PetBones Shop</span>

          <h2>
            כל מה שחיית המחמד
            <br />
            שלכם צריכה
          </h2>

          <p>
            מזון, משחקים, מיטות, ציוד ועוד.
          </p>

          <button>
            לחנות ←
          </button>
        </div>

        <div className="shop-animal">
          🐕
        </div>

      </section>


      {/* TRUST */}
      <section className="trust-section">

        <div>
          <span>🛡️</span>
          <strong>עסקאות בטוחות</strong>
          <p>אנחנו שומרים עליכם</p>
        </div>

        <div>
          <span>✓</span>
          <strong>מודעות מאומתות</strong>
          <p>איכות ואמינות גבוהה</p>
        </div>

        <div>
          <span>🐾</span>
          <strong>קהילת חובבי חיות</strong>
          <p>אלפי חברים כמוך</p>
        </div>

        <div>
          <span>💬</span>
          <strong>שירות לקוחות</strong>
          <p>כאן לכל שאלה</p>
        </div>

      </section>


      {/* FOOTER */}
      <footer className="pet-footer">

        <div className="footer-brand">
          <strong>
            Pet<span>Bones</span>
          </strong>

          <p>
            עולם החיות במקום אחד
          </p>
        </div>

        <div>
          <h3>PetBones</h3>
          <a href="#">אודות</a>
          <a href="#">צור קשר</a>
          <a href="#">תנאי שימוש</a>
        </div>

        <div>
          <h3>חיות</h3>
          <a href="#">כלבים</a>
          <a href="#">חתולים</a>
          <a href="#">ציפורים</a>
        </div>

        <div>
          <h3>שירותים</h3>
          <a href="#">וטרינרים</a>
          <a href="#">מספרות</a>
          <a href="#">פנסיונים</a>
        </div>

      </footer>

    </div>
  );
}

export default Homepage;
