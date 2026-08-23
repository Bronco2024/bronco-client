import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faMagnifyingGlass,
  faPaw,
  faPlus,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import PetCard from "@/components/pets/PetCard";
import ListingMeta from "@/components/pets/ListingMeta";
import Loading from "@/components/loading-screen/Loading";
import useMarketplaceAds from "@/hooks/useMarketplaceAds";
import {
  MARKETPLACE_CATEGORIES,
  SITE_SERVICES,
  filterListings,
  isAdoptionListing,
  mergeMarketplaceListings,
  getCatalogPool,
} from "@/data/pets";
import { getFeaturedServices } from "@/data/services-catalog";
import { getListingPath } from "@/helpers/listing-links";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/data/site-config";
import useSeo from "@/hooks/useSeo";
import SponsorsStrip from "@/components/homepage/SponsorsStrip";
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

const FEATURED_SERVICES = getFeaturedServices().slice(0, 6);

function Homepage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { listings, liveAds, loading } = useMarketplaceAds({ limitCount: 40 });

  useSeo({
    title: `${SITE_NAME} | לוח חיות מחמד`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value) {
      setSelectedService("");
    }
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    if (event.target.value) {
      setSelectedCategory("");
    }
  };

  const filteredListings = useMemo(
    () =>
      filterListings(listings, {
        searchText,
        category: selectedCategory,
      }),
    [listings, searchText, selectedCategory]
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
    const matchedService = SITE_SERVICES.find(
      (service) => service.path === selectedService
    );
    const matchedCategory = MARKETPLACE_CATEGORIES.find(
      (category) => category.name === selectedCategory
    );
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("q", searchText.trim());
    const query = params.toString();
    const path = matchedService
      ? matchedService.path
      : matchedCategory
        ? matchedCategory.path
        : "/listings";
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
      <section
        className="hero"
        aria-labelledby="hero-heading"
        style={{ backgroundImage: "url(/hero-pets.png)" }}
      >
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-logo">
            <FontAwesomeIcon icon={faPaw} />
            <span>{SITE_NAME}</span>
          </div>

          <h1 id="hero-heading">
            כל מה שחיית המחמד
            <span>שלכם צריכה</span>
          </h1>

          <p className="hero-lead">
            מרקטפלייס חכם לבעלי חיים ואוהבים
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-row">
              <FontAwesomeIcon icon={faThLarge} className="hero-search-icon" />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">כל הקטגוריות</option>
                {MARKETPLACE_CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hero-search-row">
              <FontAwesomeIcon icon={faBriefcase} className="hero-search-icon" />
              <select
                value={selectedService}
                onChange={handleServiceChange}
              >
                <option value="">כל השירותים</option>
                {SITE_SERVICES.map((service) => (
                  <option key={service.path} value={service.path}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hero-search-row">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="hero-search-icon" />
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="חיפוש מוצרים ושירותים..."
              />
            </div>

            <button className="hero-search-submit" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span>חיפוש</span>
            </button>
          </form>

          <button
            className="hero-publish-button"
            type="button"
            onClick={() => navigate("/publish_ad")}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>פרסם מודעה</span>
          </button>
        </div>
      </section>

      <section className="categories">
        <div className="section-header">
          <span className="section-kicker">
            <FontAwesomeIcon icon={faPaw} />
            קטגוריות פופולריות
          </span>
        </div>

        <div className="categories-grid">
          {MARKETPLACE_CATEGORIES.map((category) => (
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
                setSelectedService("");
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
          <span className="section-kicker">תנו להם בית</span>
          <h2>אימוץ חיות</h2>
          <p>חבר חדש מחכה לכם — אולי זה בדיוק הוא.</p>
        </div>

        <div className="adoption-grid">
          {adoptionListings.map((pet) => (
            <article
              className="adoption-card"
              key={pet.id}
              onClick={() => navigate(getListingPath(pet), { state: { ad: pet } })}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(getListingPath(pet), { state: { ad: pet } });
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
                    navigate(getListingPath(pet), { state: { ad: pet } });
                  }}
                >
                  לפרטים ואימוץ ←
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="adoption-section-actions">
          <button
            className="dark-button"
            type="button"
            onClick={() => navigate("/adoption")}
          >
            לכל מודעות האימוץ
          </button>
          <button
            className="adoption-publish-link"
            type="button"
            onClick={() => navigate("/publish_ad")}
          >
            יש חיה לאימוץ? פרסמו מודעה
          </button>
        </div>
      </section>

      <section className="services-section">
        <div className="section-header">
          <span className="section-kicker">מעבר למודעות</span>
          <h2>שירותים לכל סוגי החיות</h2>
          <p>וטרינרים, פנסיון, הסעות, אילוף — מסודר לפי מה שמתאים לכם</p>
        </div>
        <div className="services-grid services-grid--featured">
          {FEATURED_SERVICES.map((service) => (
            <button
              key={service.path}
              type="button"
              className="service-card service-card--featured"
              style={{ "--service-accent": service.accent }}
              onClick={() => navigate(service.path)}
            >
              {service.isNew && <span className="service-card-badge">חדש</span>}
              <h3>{service.name}</h3>
              <p>{service.subtitle}</p>
              <div className="service-card-animals">
                {service.animals.slice(0, 3).map((animal) => (
                  <span key={animal}>{animal}</span>
                ))}
              </div>
              <span>לפרטים ←</span>
            </button>
          ))}
        </div>
        <button
          className="services-hub-link"
          type="button"
          onClick={() => navigate("/services")}
        >
          לכל השירותים — מרכז השירותים ←
        </button>
      </section>

      <SponsorsStrip />

      <section className="cta-banner">
        <div>
          <h2>יש לכם חיה למכירה או לאימוץ?</h2>
          <p>פרסמו מודעה מסודרת עם תמונות, מחיר ופרטי קשר.</p>
        </div>
        <button type="button" onClick={() => navigate("/publish_ad")}>
          פרסום מודעה
        </button>
      </section>
    </main>
  );
}

export default Homepage;
