import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetCard from "./PetCard";
import Loading from "@/components/loading-screen/Loading";
import useMarketplaceAds from "@/hooks/useMarketplaceAds";
import {
  PET_LOCATIONS,
  filterListings,
  getCategoryBySlug,
} from "@/data/pets";
import "./CategoryListings.css";

const CategoryListings = ({ slug, adoptionOnly = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategoryBySlug(slug);

  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const { listings, loading } = useMarketplaceAds({
    categoryName: adoptionOnly ? undefined : category?.name,
    adoptionOnly,
    limitCount: 50,
  });

  const filteredListings = useMemo(
    () =>
      filterListings(listings, {
        searchText,
        location: selectedLocation,
      }),
    [listings, searchText, selectedLocation]
  );

  const title = adoptionOnly
    ? "אימוץ חיות"
    : category?.name || "כל המודעות";
  const subtitle = adoptionOnly
    ? "חבר חדש מחכה לכם — אולי זה בדיוק הוא."
    : category?.subtitle || "כל המודעות הזמינות באתר";
  const heroImage = adoptionOnly
    ? "/listings/adopt-cat.jpg"
    : category?.image || "/hero-pets.png";

  const handleSearch = (event) => {
    event.preventDefault();

    const nextParams = {};
    if (searchText.trim()) nextParams.q = searchText.trim();
    if (selectedLocation) nextParams.location = selectedLocation;
    setSearchParams(nextParams);
  };

  return (
    <main className="category-page" dir="rtl">
      <section
        className="category-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="category-hero-overlay">
          <button
            type="button"
            className="category-back"
            onClick={() => navigate("/")}
          >
            ← חזרה לדף הבית
          </button>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="category-content">
        <form className="category-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="חיפוש לפי שם, גזע או עיר"
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

          <button type="submit">חיפוש</button>
        </form>

        <p className="category-count">
          {filteredListings.length} מודעות
        </p>

        {loading && filteredListings.length === 0 ? (
          <div className="category-empty">
            <Loading size={64} fullscreen={false} message="טוען מודעות..." />
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <PetCard
                key={listing.id}
                listing={listing}
                showAdoptionBadge={adoptionOnly}
              />
            ))}
          </div>
        ) : (
          <div className="category-empty">
            <h3>לא נמצאו מודעות</h3>
            <p>נסו לשנות את החיפוש או לבחור אזור אחר.</p>
            <button
              type="button"
              className="category-reset"
              onClick={() => {
                setSearchText("");
                setSelectedLocation("");
                setSearchParams({});
              }}
            >
              נקה חיפוש
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryListings;
