import React from "react";
import "./Homepage.css";

const categories = [
  {
    name: "כלבים",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "חתולים",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "סוסים",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "ציפורים",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "דגים",
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "ארנבים",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=500&q=80",
  },
];

const ads = [
  {
    name: "גור גולדן רטריבר",
    type: "כלב",
    location: "תל אביב",
    age: "3 חודשים",
    price: "4,500 ₪",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "חתול בריטי קצר שיער",
    type: "חתול",
    location: "ירושלים",
    age: "2.5 חודשים",
    price: "2,200 ₪",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "גור פומרניאן",
    type: "כלב",
    location: "חיפה",
    age: "11 שבועות",
    price: "3,000 ₪",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "ארנב ננסי",
    type: "ארנב",
    location: "ראשון לציון",
    age: "4 חודשים",
    price: "350 ₪",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "תוכי נימפית",
    type: "ציפור",
    location: "רמת גן",
    age: "8 חודשים",
    price: "250 ₪",
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "דג בטא",
    type: "דגים",
    location: "נתניה",
    age: "6 חודשים",
    price: "30 ₪",
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=700&q=80",
  },
];

const services = [
  {
    icon: "✚",
    title: "וטרינרים",
    text: "טיפול רפואי מקצועי",
  },
  {
    icon: "✂",
    title: "מספרות",
    text: "טיפוח וספרות לחיות",
  },
  {
    icon: "⌂",
    title: "פנסיון",
    text: "בית חם בזמן שאתם בחוץ",
  },
  {
    icon: "★",
    title: "אילוף",
    text: "אילוף מקצועי לכלבים",
  },
  {
    icon: "∞",
    title: "טיולים",
    text: "טיולים מהנים ובטוחים",
  },
  {
    icon: "●",
    title: "ציוד ומזון",
    text: "כל מה שחיית המחמד צריכה",
  },
];

const Homepage = () => {
  return (
    <main className="pets-home" dir="rtl">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-content">
            <div className="hero-small-title">
              🐾 Pets & Bones
            </div>

            <h1>
              כל מה שחיית
              <span>המחמד שלך צריכה</span>
            </h1>

            <p>
              מקום אחד לכל בעלי החיים והאנשים שאוהבים אותם.
              מצאו חיות, שירותים ומוצרים במקום אחד.
            </p>

            <div className="hero-search">
              <div className="search-field">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="מה אתם מחפשים?"
                />
              </div>

              <div className="search-field location-field">
                <span>⌖</span>
                <input
                  type="text"
                  placeholder="כל האזורים"
                />
              </div>

              <button className="search-button">
                חיפוש
              </button>
            </div>

            <div className="hero-features">
              <div>
                <strong>🐾 אלפי מודעות</strong>
                <span>מכל הארץ</span>
              </div>

              <div>
                <strong>✓ אמין ובטוח</strong>
                <span>קהילה איכותית</span>
              </div>

              <div>
                <strong>♡ שירות מקצועי</strong>
                <span>אנחנו כאן בשבילך</span>
              </div>
            </div>
          </div>

          <div className="hero-images">
            <div className="orange-circle"></div>

            <img
              className="hero-dog"
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
              alt="כלב"
            />

            <img
              className="hero-cat"
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=85"
              alt="חתול"
            />
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="section-container">

          <div className="section-heading">
            <span>🐾</span>
            <h2>קטגוריות חיות</h2>
            <span>🐾</span>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.name}>
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.name}
                  />
                </div>

                <h3>{category.name}</h3>
              </div>
            ))}
          </div>

          <button className="outline-button">
            לכל הקטגוריות ←
          </button>

        </div>
      </section>

      {/* ADS */}
      <section className="ads-section">
        <div className="section-container">

          <div className="section-title-row">
            <div>
              <span className="orange-line"></span>
              <h2>מודעות אחרונות</h2>
            </div>

            <button className="text-button">
              לכל המודעות ←
            </button>
          </div>

          <div className="ads-grid">
            {ads.map((ad) => (
              <article className="ad-card" key={ad.name}>

                <div className="ad-image">
                  <img src={ad.image} alt={ad.name} />
                  <button className="favorite">♡</button>
                </div>

                <div className="ad-content">
                  <span className="ad-type">{ad.type}</span>

                  <h3>{ad.name}</h3>

                  <div className="ad-details">
                    <span>{ad.age}</span>
                    <span>📍 {ad.location}</span>
                  </div>

                  <strong className="ad-price">
                    {ad.price}
                  </strong>
                </div>

              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ADOPTION */}
      <section className="adoption-section">
        <div className="adoption-container">

          <div className="adoption-text">
            <span className="adoption-icon">♡</span>

            <h2>לאימוץ בית חם</h2>

            <p>
              לפעמים החבר הכי טוב שלך פשוט מחכה
              שמישהו ייתן לו בית ואהבה.
            </p>

            <button>
              לכל חיות האימוץ ←
            </button>
          </div>

          <div className="adoption-images">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85"
              alt="כלב לאימוץ"
            />

            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85"
              alt="חתול לאימוץ"
            />
          </div>

        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="section-container">

          <div className="section-title-row centered">
            <div>
              <span className="orange-line"></span>
              <h2>שירותים לחיות המחמד</h2>
            </div>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.title}>

                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <h2>יש לכם חיית מחמד למכירה?</h2>
          <p>
            פרסמו מודעה והגיעו לאלפי בעלי חיות ברחבי הארץ.
          </p>
        </div>

        <div className="cta-pets">
          🐕 🐈
        </div>
      </section>

    </main>
  );
};

export default Homepage;
