import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetCard from "./PetCard";
import Loading from "@/components/loading-screen/Loading";
import useMarketplaceAds from "@/hooks/useMarketplaceAds";
import { getPetBreeds } from "@/data/pet-breeds";
import { AREA_OPTIONS, getCitiesByArea } from "@/data/city-areas";
import { SITE_NAME } from "@/data/site-config";
import useSeo from "@/hooks/useSeo";
import {
  getCategoryBySlug,
} from "@/data/pets";
import "./CategoryListings.css";

const parseNumericPrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const normalized = Number(price.replace(/[^\d.-]/g, ""));
    return Number.isFinite(normalized) ? normalized : Number.MAX_SAFE_INTEGER;
  }
  return Number.MAX_SAFE_INTEGER;
};

const formatPriceForQuery = (value) =>
  Number.isFinite(value) && value > 0 ? String(value) : "";

const CategoryListings = ({ slug, adoptionOnly = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategoryBySlug(slug);

  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "");
  const [selectedBreed, setSelectedBreed] = useState(searchParams.get("breed") || "");
  const [selectedGender, setSelectedGender] = useState(searchParams.get("gender") || "");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 999999
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const { listings, loading } = useMarketplaceAds({
    categoryName: adoptionOnly ? undefined : category?.name,
    adoptionOnly,
    limitCount: 50,
  });

  const breedOptions = useMemo(() => {
    if (!adoptionOnly && category?.name) {
      return getPetBreeds(category.name).filter((breed) => breed !== "אחר");
    }
    const fallbackBreeds = Array.from(
      new Set(listings.map((item) => item.breed).filter(Boolean))
    );
    return fallbackBreeds.sort((a, b) => a.localeCompare(b, "he"));
  }, [adoptionOnly, category?.name, listings]);
  const cityOptions = useMemo(
    () => getCitiesByArea(selectedArea),
    [selectedArea]
  );

  const filteredListings = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    const base = listings.filter((item) => {
      const matchesText =
        !text ||
        [
          item.name,
          item.title,
          item.type,
          item.category,
          item.location,
          item.breed,
          item.description,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(text));

      const matchesLocation = !selectedLocation || item.location === selectedLocation;
      const matchesBreed = !selectedBreed || item.breed === selectedBreed;
      const matchesGender = !selectedGender || item.gender === selectedGender;

      const numericPrice = parseNumericPrice(item.price);
      const matchesMin = !minPrice || numericPrice >= minPrice;
      const matchesMax = !maxPrice || numericPrice <= maxPrice;

      return (
        matchesText &&
        matchesLocation &&
        matchesBreed &&
        matchesGender &&
        matchesMin &&
        matchesMax
      );
    });

    if (sortBy === "priceAsc") {
      return [...base].sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    }

    if (sortBy === "priceDesc") {
      return [...base].sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }

    return base;
  }, [
    listings,
    searchText,
    selectedLocation,
    selectedBreed,
    selectedGender,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const title = adoptionOnly
    ? "אימוץ חיות"
    : category?.name || "כל המודעות";
  const subtitle = adoptionOnly
    ? "חבר חדש מחכה לכם — אולי זה בדיוק הוא."
    : category?.subtitle || "כל המודעות הזמינות באתר";
  const heroImage = adoptionOnly
    ? "/listings/adopt-cat.jpg"
    : category?.image || "/hero-pets.png";

  useSeo({
    title: `${title} | ${SITE_NAME}`,
    description: subtitle,
    image: heroImage,
  });

  const handleSearch = (event) => {
    event.preventDefault();

    const nextParams = {};
    if (searchText.trim()) nextParams.q = searchText.trim();
    if (selectedArea) nextParams.area = selectedArea;
    if (selectedLocation) nextParams.location = selectedLocation;
    if (selectedBreed) nextParams.breed = selectedBreed;
    if (selectedGender) nextParams.gender = selectedGender;
    if (minPrice) nextParams.minPrice = formatPriceForQuery(minPrice);
    if (maxPrice && maxPrice < 999999) nextParams.maxPrice = formatPriceForQuery(maxPrice);
    if (sortBy !== "newest") nextParams.sortBy = sortBy;
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
          <div className="category-filter-field category-filter-field--wide">
            <label htmlFor="category-search-text">חיפוש</label>
            <input
              id="category-search-text"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="מה אתם מחפשים?"
            />
          </div>

          <div className="category-filter-field">
            <label htmlFor="category-breed">גזע / סוג</label>
            <select
              id="category-breed"
              value={selectedBreed}
              onChange={(event) => setSelectedBreed(event.target.value)}
            >
              <option value="">כל הגזעים</option>
              {breedOptions.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="category-gender">מין</label>
            <select
              id="category-gender"
              value={selectedGender}
              onChange={(event) => setSelectedGender(event.target.value)}
            >
              <option value="">הכל</option>
              <option value="זכר">זכר</option>
              <option value="נקבה">נקבה</option>
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="category-area">אזור</label>
            <select
              id="category-area"
              value={selectedArea}
              onChange={(event) => {
                setSelectedArea(event.target.value);
                setSelectedLocation("");
              }}
            >
              {AREA_OPTIONS.map((option) => (
                <option key={option.value || "all-areas"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="category-city">עיר</label>
            <select
              id="category-city"
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              <option value="">כל הערים</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {!adoptionOnly && (
            <>
              <div className="category-filter-field">
                <label htmlFor="category-min-price">מחיר מינימלי</label>
                <input
                  id="category-min-price"
                  type="number"
                  min={0}
                  value={minPrice || ""}
                  onChange={(event) => setMinPrice(Number(event.target.value) || 0)}
                  placeholder="מינימום"
                />
              </div>

              <div className="category-filter-field">
                <label htmlFor="category-max-price">מחיר מקסימלי</label>
                <input
                  id="category-max-price"
                  type="number"
                  min={0}
                  value={maxPrice === 999999 ? "" : maxPrice}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value) || 999999)
                  }
                  placeholder="מקסימום"
                />
              </div>
            </>
          )}

          <div className="category-filter-field category-filter-field--wide">
            <label htmlFor="category-sort">מיון</label>
            <select
              id="category-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">הכי חדשים</option>
              {!adoptionOnly && (
                <>
                  <option value="priceAsc">מחיר מהנמוך לגבוה</option>
                  <option value="priceDesc">מחיר מהגבוה לנמוך</option>
                </>
              )}
            </select>
          </div>

          <button type="submit" className="category-submit">
            חיפוש
          </button>
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
            <p>נסו לשנות את החיפוש או לבחור עיר אחרת.</p>
            <button
              type="button"
              className="category-reset"
              onClick={() => {
                setSearchText("");
                setSelectedArea("");
                setSelectedLocation("");
                setSelectedBreed("");
                setSelectedGender("");
                setMinPrice(0);
                setMaxPrice(999999);
                setSortBy("newest");
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
