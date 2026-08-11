import React from "react";
import "./Homepage.css";

const categories = [
  ["🐶", "כלבים"],
  ["🐱", "חתולים"],
  ["🐴", "סוסים"],
  ["🐦", "ציפורים"],
  ["🐠", "דגים"],
  ["🐰", "ארנבים"],
  ["🦎", "זוחלים"],
  ["🐹", "מכרסמים"],
  ["🐑", "חיות משק"],
];

const services = [
  ["🩺", "וטרינרים"],
  ["✂️", "מספרות"],
  ["🏠", "פנסיונים"],
  ["🎓", "מאלפים"],
  ["🚗", "הסעות"],
  ["🛁", "טיפוח"],
];

const ads = [
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
    title: "תוכי ארה",
    details: "זכר • שנה",
    location: "ראשון לציון",
    price: "₪1,600",
  },
];

function Homepage() {
  return (
    <main className="pet-home" dir="rtl">

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-label">
            🐾 ברוכים הבאים ל־PetBones
          </div>

          <h1>
            כל עולם החיות
            <span>במקום אחד</span>
          </h1>

          <p>
            קנו, מכרו, אמצו ומצאו את כל השירותים
            והמוצרים שחיית המחמד שלכם צריכה.
          </p>

          <div className="hero-search">

            <div className="search-input">
              🔍
              <div>
                <small>מה אתם מחפשים?</small>
                <strong>חיה, שירות, מוצר...</strong>
              </div>
            </div>

            <div className="search-input">
              📍
              <div>
                <small>איפה?</small>
                <strong>עיר או אזור</strong>
              </div>
            </div>

            <button>
              חיפוש
            </button>

          </div>

        </div>

        <div className="hero-pets">
          <div className="pet-circle pet-dog">🐶</div>
          <div className="pet-circle pet-cat">🐱</div>
        </div>

      </section>


      {/* CATEGORIES */}
      <section className="home-section">

        <div className="section-heading">
          <div>
            <small>מצאו את מה שאתם מחפשים</small>
            <h2>חיות</h2>
          </div>

          <button className="text-button">
            לכל החיות ←
          </button>
        </div>

        <div className="category-grid">

          {categories.map(([icon, name]) => (
            <button className="category-card" key={name}>
              <span>{icon}</span>
              <strong>{name}</strong>
            </button>
          ))}

        </div>

      </section>


      {/* ADS */}
      <section className="home-section">

        <div className="section-heading">
          <div>
            <small>המודעות האחרונות</small>
            <h2>חיות למכירה</h2>
          </div>

          <button className="text-button">
            לכל המודעות ←
          </button>
        </div>

        <div className="ads-grid">

          {ads.map((ad) => (
            <article className="ad-card" key={ad.title}>

              <button className="heart-button">
                ♡
              </button>

              <div className="ad-image">
                {ad.image}
              </div>

              <div className="ad-info">

                <h3>{ad.title}</h3>

                <p>{ad.details}</p>

                <div className="ad-location">
                  📍 {ad.location}
                </div>

                <div className="ad-bottom">

                  <strong>{ad.price}</strong>

                  <button>
                    צור קשר
                  </button>

                </div>

              </div>

            </article>
          ))}

        </div>

      </section>


      {/* SERVICES */}
      <section className="services-section">

        <div className="section-heading">
          <div>
            <small>כל מה שחיית המחמד צריכה</small>
            <h2>שירותים</h2>
          </div>

          <button className="text-button">
            לכל השירותים ←
          </button>
        </div>

        <div className="services-grid">

          {services.map(([icon, name]) => (
            <button className="service-card" key={name}>
              <span>{icon}</span>

              <div>
                <strong>{name}</strong>
                <small>מצאו בעלי מקצוע באזור שלכם</small>
              </div>

              <b>←</b>
            </button>
          ))}

        </div>

      </section>


      {/* ADOPTION */}
      <section className="adoption-section">

        <div>
          <small>❤️ תנו להם בית</small>

          <h2>
            חבר חדש
            <br />
            מחכה לכם
          </h2>

          <p>
            גלו בעלי חיים שמחכים לבית חם ואוהב.
          </p>

          <button>
            לחיות לאימוץ ←
          </button>
        </div>

        <div className="adoption-animal">
          🐶
        </div>

      </section>


      {/* SHOP */}
      <section className="shop-section">

        <div>
          <small>🛒 PetBones Shop</small>

          <h2>
            כל מה שחיית המחמד
            <br />
            שלכם צריכה
          </h2>

          <p>
            מזון, משחקים, ציוד ומוצרים נוספים.
          </p>

          <button>
            לחנות ←
          </button>
        </div>

        <div className="shop-animal">
          🐕
        </div>

      </section>

    </main>
  );
}

export default Homepage;
