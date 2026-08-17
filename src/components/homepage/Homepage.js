import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faHeart,
  faMagnifyingGlass,
  faPaw,
  faPlus,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import PetCard from "@/components/pets/PetCard";
import ListingMeta from "@/components/pets/ListingMeta";
import Loading from "@/components/loading-screen/Loading";
import useMarketplaceAds from "@/hooks/useMarketplaceAds";
import {
  PET_CATEGORIES,
  PET_LOCATIONS,
  SITE_SERVICES,
  filterListings,
  isAdoptionListing,
  mergeMarketplaceListings,
  getCatalogPool,
} from "@/data/pets";
import "./Homepage.css";

const HERO_TRUST_ITEMS = [
  { icon: faPaw, label: "כל סוגי החיות" },
  { icon: faShieldHalved, label: "אמין ובטוח" },
  { icon: faHeart, label: "קהילה איכותית" },
];

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

const HOMEPAGE_SERVICES = [
  {
    path: "/adoption",
    name: "אימוץ",
    subtitle: "חיות שמחכות לבית חם",
  },
  ...SITE_SERVICES.slice(0, 3),
];

function Homepage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { listings, liveAds, loading } = useMarketplaceAds({ limitCount: 40 });

  const filteredListings = useMemo(
    () =>
      filterListings(listings, {
        searchText,
        location: selectedLocation,
        category: selectedCategory,
      }),
    [listings, searchText, selectedLocation, selectedCategory]
  );

  const featuredListings = filteredListings.slice(0, 10);
  const adoptionListings = useMemo(
    () =>
      mergeMarketplaceListings(
        liveAds.filter(isAdoptionListing),
        getCatalogPool({ adoptionOnly: true })
      ).slice(0, 4),
    [liveAds]
  );

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
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-glow hero-glow--primary" />
          <span className="hero-glow hero-glow--accent" />
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-brand">
              <span className="hero-brand-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faPaw} />
              </span>
              <span>Pets & Bones</span>
            </div>

            <h1 id="hero-heading">
              כל מה שחיית המחמד שלך
              <span>צריכה</span>
            </h1>

            <p className="hero-lead">
              המקום שמחבר בין חיות מחמד, אנשים ושירותים — עם חיפוש חכם, מודעות
              מאושרות וקהילה שדואגת לחיות.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="hero-search-field hero-search-field--wide">
                <label htmlFor="hero-search-text">חיפוש</label>
                <input
                  id="hero-search-text"
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="מה אתם מחפשים?"
                />
              </div>

              <div className="hero-search-field">
                <label htmlFor="hero-search-category">קטגוריה</label>
                <select
                  id="hero-search-category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="">כל הקטגוריות</option>
                  {PET_CATEGORIES.map((category) => (
                    <option key={category.slug} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hero-search-field">
                <label htmlFor="hero-search-location">עיר</label>
                <select
                  id="hero-search-location"
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                >
                  <option value="">כל הערים</option>
                  {PET_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <button className="hero-search-submit" type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>חיפוש</span>
              </button>
            </form>

            <ul className="hero-trust">
              {HERO_TRUST_ITEMS.map((item) => (
                <li key={item.label}>
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="hero-actions">
              <button
                className="hero-primary-button"
                type="button"
                onClick={() => navigate("/publish_ad")}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>פרסום מודעה</span>
              </button>
              <button
                className="hero-secondary-button"
                type="button"
                onClick={() => navigate("/adoption")}
              >
                לאימוץ חיות
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-frame">
              <img src="/hero-pets.png" alt="כלב וחתול" />
              <div className="hero-visual-overlay" aria-hidden="true" />
            </div>

            <div className="hero-stat-card hero-stat-card--listings">
              <strong>{Math.max(listings.length, 1)}+</strong>
              <span>מודעות פעילות</span>
            </div>

            <div className="hero-stat-card hero-stat-card--adoption">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span>מודעות מאושרות על ידי צוות האתר</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="נתוני האתר">
        <div>
          <strong>10</strong>
          <span>קטגוריות חיות</span>
        </div>
        <div>
          <strong>{listings.length}+</strong>
          <span>מודעות פעילות</span>
        </div>
        <div>
          <strong>{adoptionListings.length}</strong>
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

        {loading && featuredListings.length === 0 ? (
          <div className="no-results">
            <Loading size={64} fullscreen={false} message="טוען מודעות..." />
          </div>
        ) : featuredListings.length > 0 ? (
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
          {adoptionListings.map((pet) => (
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
                <ListingMeta
                  type={pet.type}
                  location={pet.location}
                  age={pet.age}
                  className="adoption-meta"
                />
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
          {HOMEPAGE_SERVICES.map((service) => (
            <button
              key={service.path}
              type="button"
              className="service-card"
              onClick={() => navigate(service.path)}
            >
              <h3>{service.name}</h3>
              <p>{service.subtitle}</p>
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
