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

  const handleSearch = (event) => {
    event.preventDefault();

    const matchedCategory = PET_CATEGORIES.find(
      (category) => category.name === selectedCategory
    );

    if (matchedCategory) {
      const params = new URLSearchParams();
      if (searchText.trim()) params.set("q", searchText.trim());
      if (selectedLocation) params.set("location", selectedLocation);
      const query = params.toString();
      navigate(`${matchedCategory.path}${query ? `?${query}` : ""}`);
      return;
    }

    document.getElementById("latest-listings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCategoryClick = (category) => {
    if (category.path) {
      navigate(category.path);
      return;
    }

    setSelectedCategory(category.name);
    document.getElementById("latest-listings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
            />

            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              <option value="">כל האזורים</option>
              {PET_LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button type="submit">🔍 חיפוש</button>
          </form>

          <div className="hero-info">
            <span>🐾 כל סוגי החיות</span>
            <span>✓ אמין ובטוח</span>
            <span>♡ קהילה איכותית</span>
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
          <img src="/hero-pets.png" alt="כלב וחתול" />
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

      <section className="latest" id="latest-listings">
        <div className="section-title">
          <div>
            <span className="section-kicker">חדש באתר</span>
            <h2>מודעות אחרונות</h2>
          </div>

          <button
            className="link-button"
            type="button"
            onClick={() => {
              setSelectedCategory("");
              setSelectedLocation("");
              setSearchText("");
            }}
          >
            הצג הכל ←
          </button>
        </div>

        {filteredListings.length > 0 ? (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
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
    </main>
  );
}

export default Homepage;
