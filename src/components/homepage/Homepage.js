import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const categories = [
  { name: "כלבים", type: "כלב", image: "/dogs.jpg" },
  { name: "חתולים", type: "חתול", image: "/cats.jpg" },
  { name: "סוסים", type: "סוס", image: "/horses.jpg", route: "/horses" },
  { name: "ציפורים", type: "ציפור", image: "/birds.jpg" },
  { name: "דגים", type: "דג", image: "/fish.jpg" },
  { name: "ארנבים", type: "ארנב", image: "/rabbits.jpg" },
  { name: "זוחלים", type: "זוחל", image: "/reptiles.jpg" },
  { name: "תרנגולות", type: "עופות", image: "/chickens.jpg" },
  { name: "חיות משק", type: "חיית משק", image: "/farm-animals.jpg" },
  { name: "חיות קטנות", type: "חיה קטנה", image: "/small-animals.jpg" },
];

const listings = [
  {
    id: 1,
    name: "גור גולדן רטריבר",
    type: "כלב",
    category: "כלבים",
    location: "תל אביב",
    age: "3 חודשים",
    price: "4,500 ₪",
    image: "/dogs.jpg",
  },
  {
    id: 2,
    name: "חתול בריטי",
    type: "חתול",
    category: "חתולים",
    location: "ירושלים",
    age: "2.5 חודשים",
    price: "2,200 ₪",
    image: "/cats.jpg",
  },
  {
    id: 3,
    name: "סוס צעיר",
    type: "סוס",
    category: "סוסים",
    location: "חיפה",
    age: "2 שנים",
    price: "12,000 ₪",
    image: "/horses.jpg",
  },
  {
    id: 4,
    name: "תוכי צבעוני",
    type: "ציפור",
    category: "ציפורים",
    location: "רמת גן",
    age: "8 חודשים",
    price: "250 ₪",
    image: "/birds.jpg",
  },
  {
    id: 5,
    name: "דג נוי",
    type: "דג",
    category: "דגים",
    location: "נתניה",
    age: "6 חודשים",
    price: "30 ₪",
    image: "/fish.jpg",
  },
  {
    id: 6,
    name: "ארנב ננסי",
    type: "ארנב",
    category: "ארנבים",
    location: "ראשון לציון",
    age: "4 חודשים",
    price: "350 ₪",
    image: "/rabbits.jpg",
  },
  {
    id: 7,
    name: "לטאה מיוחדת",
    type: "זוחל",
    category: "זוחלים",
    location: "פתח תקווה",
    age: "1 שנה",
    price: "600 ₪",
    image: "/reptiles.jpg",
  },
  {
    id: 8,
    name: "תרנגולות",
    type: "עופות",
    category: "תרנגולות",
    location: "אשדוד",
    age: "7 חודשים",
    price: "180 ₪",
    image: "/chickens.jpg",
  },
  {
    id: 9,
    name: "חיות משק",
    type: "חיית משק",
    category: "חיות משק",
    location: "באר שבע",
    age: "1 שנה",
    price: "1,500 ₪",
    image: "/farm-animals.jpg",
  },
  {
    id: 10,
    name: "חיה קטנה",
    type: "חיה קטנה",
    category: "חיות קטנות",
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
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const text = searchText.trim().toLowerCase();

      const matchesText =
        !text ||
        listing.name.toLowerCase().includes(text) ||
        listing.type.toLowerCase().includes(text) ||
        listing.category.toLowerCase().includes(text) ||
        listing.location.toLowerCase().includes(text);

      const matchesLocation =
        !selectedLocation ||
        listing.location === selectedLocation;

      const matchesCategory =
        !selectedCategory ||
        listing.category === selectedCategory;

      return (
        matchesText &&
        matchesLocation &&
        matchesCategory
      );
    });
  }, [searchText, selectedLocation, selectedCategory]);

  const handleSearch = (event) => {
    event.preventDefault();

    document
      .getElementById("latest-listings")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleCategoryClick = (category) => {
    if (category.route) {
      navigate(category.route);
      return;
    }

    setSelectedCategory(category.name);

    document
      .getElementById("latest-listings")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleListingClick = (listing) => {
    navigate("/item", {
      state: {
        ad: listing,
      },
    });
  };

  const handleFavorite = (event, listing) => {
    event.stopPropagation();

    const favorites =
      JSON.parse(
        localStorage.getItem("pets_bones_favorites") || "[]"
      );

    const exists = favorites.some(
      (item) => item.id === listing.id
    );

    const updatedFavorites = exists
      ? favorites.filter(
          (item) => item.id !== listing.id
        )
      : [...favorites, listing];

    localStorage.setItem(
      "pets_bones_favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <main className="homepage" dir="rtl">

      {/* =========================
          HERO
      ========================= */}

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

          <form
            className="search-box"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="מה אתם מחפשים?"
            />

            <select
              value={selectedLocation}
              onChange={(event) =>
                setSelectedLocation(event.target.value)
              }
            >
              <option value="">
                כל האזורים
              </option>

              <option value="תל אביב">
                תל אביב
              </option>

              <option value="ירושלים">
                ירושלים
              </option>

              <option value="חיפה">
                חיפה
              </option>

              <option value="רמת גן">
                רמת גן
              </option>

              <option value="נתניה">
                נתניה
              </option>

              <option value="פתח תקווה">
                פתח תקווה
              </option>

              <option value="באר שבע">
                באר שבע
              </option>

              <option value="אשדוד">
                אשדוד
              </option>

              <option value="הרצליה">
                הרצליה
              </option>

              <option value="ראשון לציון">
                ראשון לציון
              </option>
            </select>

            <button type="submit">
              🔍 חיפוש
            </button>

          </form>

          <div className="hero-info">

            <span>
              🐾 כל סוגי החיות
            </span>

            <span>
              ✓ אמין ובטוח
            </span>

            <span>
              ♡ קהילה איכותית
            </span>

          </div>

          <button
            className="dark-button"
            type="button"
            onClick={() => navigate("/publish_ad")}
          >
            ➕ פרסום מודעה
          </button>

        </div>

        <div className="hero-image">

          <img
            src="/hero-pets.png"
            alt="כלב וחתול"
          />

        </div>

      </section>


      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="categories">

        <div className="section-header">

          <span className="section-kicker">
            גלו את העולם שלנו
          </span>

          <h2>
            🐾 קטגוריות חיות
          </h2>

          <p>
            בחרו את סוג החיה שמעניין אתכם
          </p>

        </div>

        <div className="categories-grid">

          {categories.map((category) => (

            <button
              key={category.name}
              type="button"
              className={`category-card ${
                selectedCategory === category.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleCategoryClick(category)
              }
            >

              <div className="category-image">

                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />

              </div>

              <div className="category-name">
                {category.name}
              </div>

            </button>

          ))}

        </div>

        {selectedCategory && (

          <button
            className="dark-button"
            type="button"
            onClick={() => setSelectedCategory("")}
          >
            הצג את כל החיות
          </button>

        )}

      </section>


      {/* =========================
          LATEST LISTINGS
      ========================= */}

      <section
        className="latest"
        id="latest-listings"
      >

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
            onClick={() => {
              setSelectedCategory("");
              setSelectedLocation("");
              setSearchText("");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            הצג הכל ←
          </button>

        </div>

        {filteredListings.length > 0 ? (

          <div className="listings-grid">

            {filteredListings.map((listing) => (

              <article
                className="listing-card"
                key={listing.id}
                onClick={() =>
                  handleListingClick(listing)
                }
              >

                <div className="listing-image">

                  <img
                    src={listing.image}
                    alt={listing.name}
                    loading="lazy"
                  />

                  <button
                    className="favorite"
                    type="button"
                    aria-label="הוסף למועדפים"
                    onClick={(event) =>
                      handleFavorite(event, listing)
                    }
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

        ) : (

          <div className="no-results">

            <h3>
              לא נמצאו מודעות
            </h3>

            <p>
              נסו לשנות את החיפוש או לבחור קטגוריה אחרת.
            </p>

            <button
              className="dark-button"
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedLocation("");
                setSelectedCategory("");
              }}
            >
              נקה חיפוש
            </button>

          </div>

        )}

      </section>


      {/* =========================
          ADOPTION
      ========================= */}

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
                  loading="lazy"
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
                  onClick={() =>
                    navigate("/publish_ad")
                  }
                >
                  לפרטים ואימוץ ←
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Homepage;
