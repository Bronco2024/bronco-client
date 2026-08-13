import React from "react";
import "./Homepage.css";

const categories = [
  { name: "כלבים", image: "/dogs.jpg" },
  { name: "חתולים", image: "/cats.jpg" },
  { name: "סוסים", image: "/horses.jpg" },
  { name: "ציפורים", image: "/birds.jpg" },
  { name: "דגים", image: "/fish.jpg" },
  { name: "ארנבים", image: "/rabbits.jpg" },
  { name: "זוחלים", image: "/reptiles.jpg" },
  { name: "תרנגולות", image: "/chickens.jpg" },
  { name: "חיות משק", image: "/farm-animals.jpg" },
  { name: "חיות קטנות", image: "/small-animals.jpg" },
];

const listings = [
  {
    id: 1,
    name: "גור גולדן רטריבר",
    type: "כלב",
    location: "תל אביב",
    age: "3 חודשים",
    price: "4,500 ₪",
    image: "/dogs.jpg",
  },
  {
    id: 2,
    name: "חתול בריטי",
    type: "חתול",
    location: "ירושלים",
    age: "2.5 חודשים",
    price: "2,200 ₪",
    image: "/cats.jpg",
  },
  {
    id: 3,
    name: "סוס צעיר",
    type: "סוס",
    location: "חיפה",
    age: "2 שנים",
    price: "12,000 ₪",
    image: "/horses.jpg",
  },
  {
    id: 4,
    name: "תוכי צבעוני",
    type: "ציפור",
    location: "רמת גן",
    age: "8 חודשים",
    price: "250 ₪",
    image: "/birds.jpg",
  },
  {
    id: 5,
    name: "דג נוי",
    type: "דג",
    location: "נתניה",
    age: "6 חודשים",
    price: "30 ₪",
    image: "/fish.jpg",
  },
  {
    id: 6,
    name: "ארנב ננסי",
    type: "ארנב",
    location: "ראשון לציון",
    age: "4 חודשים",
    price: "350 ₪",
    image: "/rabbits.jpg",
  },
  {
    id: 7,
    name: "לטאה מיוחדת",
    type: "זוחל",
    location: "פתח תקווה",
    age: "1 שנה",
    price: "600 ₪",
    image: "/reptiles.jpg",
  },
  {
    id: 8,
    name: "תרנגולות",
    type: "עופות",
    location: "אשדוד",
    age: "7 חודשים",
    price: "180 ₪",
    image: "/chickens.jpg",
  },
  {
    id: 9,
    name: "חיות משק",
    type: "חיית משק",
    location: "באר שבע",
    age: "1 שנה",
    price: "1,500 ₪",
    image: "/farm-animals.jpg",
  },
  {
    id: 10,
    name: "חיה קטנה",
    type: "חיה קטנה",
    location: "הרצליה",
    age: "5 חודשים",
    price: "200 ₪",
    image: "/small-animals.jpg",
  },
];

const adoptionPets = [
  {
    id: 1,
    name: "כלב מחפש בית",
    type: "כלב",
    location: "תל אביב",
    age: "8 חודשים",
    image: "/dogs.jpg",
  },
  {
    id: 2,
    name: "חתול מתוק",
    type: "חתול",
    location: "ירושלים",
    age: "1 שנה",
    image: "/cats.jpg",
  },
  {
    id: 3,
    name: "ארנב קטן",
    type: "ארנב",
    location: "חיפה",
    age: "5 חודשים",
    image: "/rabbits.jpg",
  },
  {
    id: 4,
    name: "תוכי צבעוני",
    type: "ציפור",
    location: "רמת גן",
    age: "10 חודשים",
    image: "/birds.jpg",
  },
];

function Homepage() {
  return (
    <main className="homepage" dir="rtl">

      {/* HERO */}
      <section className="hero">

        <div className="hero-text">

          <span className="hero-label">
            🐾 Pets & Bones
          </span>

          <h1>
            כל מה שחיית המחמד שלך
            <span>צריכה</span>
          </h1>

          <p>
            המקום שמחבר בין חיות מחמד, אנשים ושירותים
            במקום אחד.
          </p>

          <div className="search-box">

            <input
              type="text"
              placeholder="מה אתם מחפשים?"
            />

            <select defaultValue="">
              <option value="" disabled>
                כל האזורים
              </option>
              <option>תל אביב</option>
              <option>ירושלים</option>
              <option>חיפה</option>
              <option>רמת גן</option>
              <option>נתניה</option>
              <option>פתח תקווה</option>
              <option>באר שבע</option>
              <option>אשדוד</option>
            </select>

            <button type="button">
              🔍 חיפוש
            </button>

          </div>

          <div className="hero-info">
            <span>🐾 אלפי מודעות</span>
            <span>✓ אמין ובטוח</span>
            <span>♡ קהילה איכותית</span>
          </div>

        </div>

        <div className="hero-image">
          <img
            src="/hero-pets.png"
            alt="כלב וחתול"
          />
        </div>

      </section>


      {/* CATEGORIES */}
      <section className="categories">

        <div className="section-header">

          <span className="section-kicker">
            גלו את העולם שלנו
          </span>

          <h2>
            🐾 קטגוריות חיות
          </h2>

          <p>
            מצאו את החיה שמתאימה לכם מתוך מגוון קטגוריות
          </p>

        </div>

        <div className="categories-grid">

          {categories.map((category) => (
            <div
              className="category-card"
              key={category.name}
            >

              <div className="category-image">

                <img
                  src={category.image}
                  alt={category.name}
                />

              </div>

              <div className="category-name">
                {category.name}
              </div>

            </div>
          ))}

        </div>

        <button
          className="dark-button"
          type="button"
        >
          לכל הקטגוריות ←
        </button>

      </section>


      {/* LATEST LISTINGS */}
      <section className="latest">

        <div className="section-title">

          <div>

            <span className="section-kicker">
              חדש באתר
            </span>

            <h2>
              מודעות אחרונות
            </h2>

          </div>

          <button
            className="link-button"
            type="button"
          >
            לכל המודעות ←
          </button>

        </div>

        <div className="listings-grid">

          {listings.map((listing) => (
            <article
              className="listing-card"
              key={listing.id}
            >

              <div className="listing-image">

                <img
                  src={listing.image}
                  alt={listing.name}
                />

                <button
                  className="favorite"
                  type="button"
                  aria-label="הוסף למועדפים"
                >
                  ♡
                </button>

                <span className="listing-type">
                  {listing.type}
                </span>

              </div>

              <div className="listing-content">

                <h3>
                  {listing.name}
                </h3>

                <div className="listing-details">

                  <span>
                    📍 {listing.location}
                  </span>

                  <span>
                    🕒 {listing.age}
                  </span>

                </div>

                <strong>
                  {listing.price}
                </strong>

              </div>

            </article>
          ))}

        </div>

        <button
          className="dark-button"
          type="button"
        >
          לכל המודעות ←
        </button>

      </section>


      {/* ADOPTION - LAST SECTION */}
      <section className="adoption-section">

        <div className="section-header">

          <span className="section-kicker">
            ❤️ תנו להם בית
          </span>

          <h2>
            אימוץ חיות
          </h2>

          <p>
            חבר חדש מחכה לכם — אולי זה בדיוק הוא.
          </p>

        </div>

        <div className="adoption-grid">

          {adoptionPets.map((pet) => (
            <article
              className="adoption-card"
              key={pet.id}
            >

              <div className="adoption-image">

                <img
                  src={pet.image}
                  alt={pet.name}
                />

                <span className="adoption-badge">
                  לאימוץ
                </span>

              </div>

              <div className="adoption-content">

                <h3>
                  {pet.name}
                </h3>

                <div className="adoption-details">

                  <span>
                    🐾 {pet.type}
                  </span>

                  <span>
                    📍 {pet.location}
                  </span>

                  <span>
                    🕒 {pet.age}
                  </span>

                </div>

                <button
                  className="adoption-button"
                  type="button"
                >
                  לפרטים ואימוץ ←
                </button>

              </div>

            </article>
          ))}

        </div>

        <button
          className="dark-button"
          type="button"
        >
          לכל חיות האימוץ ←
        </button>

      </section>

    </main>
  );
}

export default Homepage;
