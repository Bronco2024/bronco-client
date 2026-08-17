import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetCard from "@/components/pets/PetCard";
import {
  ADOPTION_PETS,
  PET_CATEGORIES,
  PET_LISTINGS,
  PET_LOCATIONS,
  filterListings,
} from "@/data/pets";
import "./Homepage.css";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "חפשו",
    text: "סננו לפי סוג חיה, עיר או מילת חיפוש — ותגיעו למודעות הרלוונטיות במהירות.",
  },
  {
    step: "02",
    title: "השוו ושמרו",
    text: "פתחו כרטיס מודעה, שמרו מועדפים, ובדקו פרטים כמו גיל, מיקום ומחיר.",
  },
  {
    step: "03",
    title: "צרו קשר",
    text: "דברו ישירות עם המפרסם, או פרסמו מודעה משלכם כשאתם מוכנים.",
  },
];

const SERVICES = [
  {
    title: "אימוץ",
    text: "חיות שמחכות לבית חם.",
    path: "/adoption",
  },
  {
    title: "וטרינרים",
    text: "אנשי מקצוע לטיפול וליווי.",
    path: "/veterinarians",
  },
  {
    title: "פנסיון",
    text: "מקומות אמינים לשהייה זמנית.",
    path: "/boarding",
  },
  {
    title: "אביזרים",
    text: "ציוד, מזון וכל מה שצריך בבית.",
    path: "/accessories",
  },
];

function Homepage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredListings = useMemo(
    () =>
      filterListings(PET_LISTINGS, {
        searchText,
        location: selectedLocation,
        category: selectedCategory,
      }),
    [searchText, selectedLocation, selectedCategory]
  );

  const featuredListings = filteredListings.slice(0, 10);

  const goToSearchResults = () => {
    const matchedCategory = PET_CATEGORIES.find(
      (category) => category.name === selectedCategory
    );
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("q", searchText.trim());
    if (selectedLocation) params.set("location", selectedLocation);
    const query = params.toString();
    const path = matchedCategory ? matchedCategory.path : "/listings";
    navigate(`${path}${query ? `?${query}` : ""}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    goToSearchResults();
  };

  const handleCategoryClick = (category) => {
    if (category.path) {
      navigate(category.path);
    }
  };

  return (
    <main className="homepage" dir="rtl">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-label">🐾 Pets & Bones</span>

          <h1>
            כל מה שחיית המחמד שלך
            <span>צריכה</span>
          </h1>

          <p>
            המקום שמחבר בין חיות מחמד, אנשים ושירותים במקום אחד.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="מה אתם מחפשים?"
              aria-label="חיפוש מודעות"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="קטגוריה"
            >
              <option value="">כל הקטגוריות</option>
              {PET_CATEGORIES.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
              aria-label="אזור"
            >
              <option value="">כל האזורים</option>
              {PET_LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button type="submit">חיפוש</button>
          </form>

          <div className="hero-info">
            <span>🐾 כל סוגי החיות</span>
            <span>✓ אמין ובטוח</span>
            <span>♡ קהילה איכותית</span>
          </div>

          <div className="hero-actions">
            <button
              className="dark-button"
              type="button"
              onClick={() => navigate("/publish_ad")}
            >
              ➕ פרסום מודעה
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => navigate("/adoption")}
            >
              לאימוץ חיות
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src="/hero-pets.png" alt="כלב וחתול" />
        </div>
      </section>

      <section className="stats-strip" aria-label="נתוני האתר">
        <div>
          <strong>10</strong>
          <span>קטגוריות חיות</span>
        </div>
        <div>
          <strong>{PET_LISTINGS.length}+</strong>
          <span>מודעות פעילות</span>
        </div>
        <div>
          <strong>{ADOPTION_PETS.length}</strong>
          <span>חיות לאימוץ</span>
        </div>
        <div>
          <strong>כל הארץ</strong>
          <span>חיפוש לפי עיר</span>
        </div>
      </section>

      <section className="categories">
        <div className="section-header">
          <span className="section-kicker">גלו את העולם שלנו</span>
          <h2>🐾 קטגוריות חיות</h2>
          <p>בחרו את סוג החיה שמעניין אתכם</p>
        </div>

        <div className="categories-grid">
          {PET_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`category-card ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />
              </div>
              <div className="category-name">{category.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <span className="section-kicker">פשוט וברור</span>
          <h2>איך זה עובד?</h2>
          <p>שלושה צעדים קצרים עד לחיה הבאה שלכם</p>
        </div>
        <div className="steps-grid">
          {HOW_IT_WORKS.map((item) => (
            <article className="step-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="latest" id="latest-listings">
        <div className="section-title">
          <div>
            <span className="section-kicker">חדש באתר</span>
            <h2>מודעות אחרונות</h2>
          </div>

          <button
            className="link-button"
            type="button"
            onClick={() => navigate("/listings")}
          >
            הצג הכל ←
          </button>
        </div>

        {featuredListings.length > 0 ? (
          <div className="listings-grid">
            {featuredListings.map((listing) => (
              <PetCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>לא נמצאו מודעות</h3>
            <p>נסו לשנות את החיפוש או לבחור קטגוריה אחרת.</p>
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

      <section className="adoption-section">
        <div className="section-header">
          <span className="section-kicker">❤️ תנו להם בית</span>
          <h2>אימוץ חיות</h2>
          <p>חבר חדש מחכה לכם — אולי זה בדיוק הוא.</p>
        </div>

        <div className="adoption-grid">
          {ADOPTION_PETS.map((pet) => (
            <article
              className="adoption-card"
              key={pet.id}
              onClick={() => navigate("/item", { state: { ad: pet } })}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate("/item", { state: { ad: pet } });
                }
              }}
              role="link"
              tabIndex={0}
            >
              <div className="adoption-image">
                <img src={pet.image} alt={pet.name} loading="lazy" />
                <span className="adoption-badge">לאימוץ</span>
              </div>

              <div className="adoption-content">
                <h3>{pet.name}</h3>
                <div className="adoption-details">
                  <span>🐾 {pet.type}</span>
                  <span>📍 {pet.location}</span>
                  <span>🕒 {pet.age}</span>
                </div>
                <button
                  className="adoption-button"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate("/item", { state: { ad: pet } });
                  }}
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
          onClick={() => navigate("/adoption")}
        >
          לכל מודעות האימוץ
        </button>
      </section>

      <section className="services-section">
        <div className="section-header">
          <span className="section-kicker">מעבר למודעות</span>
          <h2>שירותים מסביב לחיות</h2>
          <p>כל מה שצריך אחרי שמצאתם חבר חדש</p>
        </div>
        <div className="services-grid">
          {SERVICES.map((service) => (
            <button
              key={service.path}
              type="button"
              className="service-card"
              onClick={() => navigate(service.path)}
            >
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span>לפרטים ←</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>יש לכם חיה למכירה או לאימוץ?</h2>
          <p>פרסמו מודעה מסודרת עם תמונות, מחיר ופרטי קשר — בחינם.</p>
        </div>
        <button type="button" onClick={() => navigate("/publish_ad")}>
          פרסום מודעה
        </button>
      </section>
    </main>
  );
}

export default Homepage;
