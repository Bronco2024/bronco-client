import React from "react";
import "./Homepage.css";

const categories = [
  { name: "כלבים", image: "/images/category-dogs.jpg" },
  { name: "חתולים", image: "/images/category-cats.jpg" },
  { name: "סוסים", image: "/images/category-horses.jpg" },
  { name: "ציפורים", image: "/images/category-birds.jpg" },
  { name: "דגים", image: "/images/category-fish.jpg" },
  { name: "ארנבים", image: "/images/category-rabbits.jpg" },
];

/*
  כרגע אלה נתוני הדגמה.
  בהמשך מחליפים אותם בנתונים שמגיעים מהשרת,
  ואז כל מודעה חדשה תופיע כאן אוטומטית.
*/
const listings = [
  {
    id: 1,
    name: "גור גולדן רטריבר",
    type: "כלב",
    location: "תל אביב",
    age: "3 חודשים",
    price: "4,500 ₪",
    image: "/images/listing-dog.jpg",
  },
  {
    id: 2,
    name: "חתול בריטי קצר",
    type: "חתול",
    location: "ירושלים",
    age: "2.5 חודשים",
    price: "2,200 ₪",
    image: "/images/listing-cat.jpg",
  },
  {
    id: 3,
    name: "גור פומרניאן",
    type: "כלב",
    location: "חיפה",
    age: "11 שבועות",
    price: "3,000 ₪",
    image: "/images/listing-pomeranian.jpg",
  },
  {
    id: 4,
    name: "ארנב ננסי",
    type: "ארנב",
    location: "ראשון לציון",
    age: "4 חודשים",
    price: "350 ₪",
    image: "/images/listing-rabbit.jpg",
  },
  {
    id: 5,
    name: "קוקטייל מחמור",
    type: "ציפור",
    location: "רמת גן",
    age: "8 חודשים",
    price: "250 ₪",
    image: "/images/listing-bird.jpg",
  },
  {
    id: 6,
    name: "דג בטא סיאמי",
    type: "דג",
    location: "נתניה",
    age: "6 חודשים",
    price: "30 ₪",
    image: "/images/listing-fish.jpg",
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
            </select>

            <button>
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
          <h2>🐾 קטגוריות חיות</h2>
        </div>

        <div className="categories-grid">

          {categories.map((category) => (
            <div
              className="category-card"
              key={category.name}
            >
              <img
                src={category.image}
                alt={category.name}
              />

              <h3>{category.name}</h3>
            </div>
          ))}

        </div>

        <button className="dark-button">
          לכל הקטגוריות ←
        </button>

      </section>


      {/* LATEST LISTINGS */}
      <section className="latest">

        <div className="section-title">
          <h2>מודעות אחרונות</h2>

          <button className="link-button">
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

                <button className="favorite">
                  ♡
                </button>

                <span className="listing-type">
                  {listing.type}
                </span>

              </div>

              <div className="listing-content">

                <h3>{listing.name}</h3>

                <div className="listing-details">
                  <span>📍 {listing.location}</span>
                  <span>🕒 {listing.age}</span>
                </div>

                <strong>
                  {listing.price}
                </strong>

              </div>

            </article>
          ))}

        </div>

        <button className="dark-button">
          לכל המודעות ←
        </button>

      </section>

    </main>
  );
}

export default Homepage;
