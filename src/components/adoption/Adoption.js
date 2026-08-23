import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faPlus,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import PetCard from "@/components/pets/PetCard";
import Loading from "@/components/loading-screen/Loading";
import useMarketplaceAds from "@/hooks/useMarketplaceAds";
import useSeo from "@/hooks/useSeo";
import { AREA_OPTIONS, getCitiesByArea } from "@/data/city-areas";
import { getPetBreeds } from "@/data/pet-breeds";
import { PET_CATEGORIES } from "@/data/pets";
import { SITE_NAME, SITE_URL } from "@/data/site-config";
import "./Adoption.css";

const ANIMAL_FILTERS = [
  { id: "all", label: "כל החיות" },
  ...PET_CATEGORIES.map(({ name }) => ({ id: name, label: name })),
];

const Adoption = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedAnimal, setSelectedAnimal] = useState(
    searchParams.get("animal") || "all"
  );
  const [selectedGender, setSelectedGender] = useState(
    searchParams.get("gender") || ""
  );
  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedBreed, setSelectedBreed] = useState(
    searchParams.get("breed") || ""
  );
  const [certificateFilter, setCertificateFilter] = useState(
    searchParams.get("certificate") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const { listings, loading } = useMarketplaceAds({
    adoptionOnly: true,
    limitCount: 60,
  });

  useSeo({
    title: `אימוץ חיות | ${SITE_NAME}`,
    description:
      "אמצו חיית מחמד בחינם — כלבים, חתולים ועוד שמחכים לבית חם. אימוץ תמיד ללא תשלום.",
    url: `${SITE_URL}/adoption`,
    image: "/listings/adopt-cat.jpg",
  });

  const breedOptions = useMemo(() => {
    if (selectedAnimal !== "all") {
      return getPetBreeds(selectedAnimal).filter((breed) => breed !== "אחר");
    }
    return Array.from(
      new Set(listings.map((item) => item.breed).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "he"));
  }, [selectedAnimal, listings]);

  const cityOptions = useMemo(
    () => getCitiesByArea(selectedArea),
    [selectedArea]
  );

  const filteredListings = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    const base = listings.filter((item) => {
      const matchesText =
        !text ||
        [item.name, item.title, item.type, item.category, item.location, item.breed, item.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(text));

      const matchesAnimal =
        selectedAnimal === "all" || item.category === selectedAnimal;
      const matchesGender = !selectedGender || item.gender === selectedGender;
      const matchesLocation =
        !selectedLocation || item.location === selectedLocation;
      const matchesBreed = !selectedBreed || item.breed === selectedBreed;
      const matchesCertificate =
        certificateFilter === ""
          ? true
          : certificateFilter === "yes"
            ? Boolean(item.hasCertificate)
            : !item.hasCertificate;

      return (
        matchesText &&
        matchesAnimal &&
        matchesGender &&
        matchesLocation &&
        matchesBreed &&
        matchesCertificate
      );
    });

    if (sortBy === "name") {
      return [...base].sort((a, b) =>
        String(a.name || a.title || "").localeCompare(
          String(b.name || b.title || ""),
          "he"
        )
      );
    }

    return base;
  }, [
    listings,
    searchText,
    selectedAnimal,
    selectedGender,
    selectedLocation,
    selectedBreed,
    certificateFilter,
    sortBy,
  ]);

  const syncParams = (overrides = {}) => {
    const next = {
      q: searchText,
      animal: selectedAnimal,
      gender: selectedGender,
      area: selectedArea,
      location: selectedLocation,
      breed: selectedBreed,
      certificate: certificateFilter,
      sortBy,
      ...overrides,
    };

    const params = {};
    if (next.q?.trim()) params.q = next.q.trim();
    if (next.animal && next.animal !== "all") params.animal = next.animal;
    if (next.gender) params.gender = next.gender;
    if (next.area) params.area = next.area;
    if (next.location) params.location = next.location;
    if (next.breed) params.breed = next.breed;
    if (next.certificate) params.certificate = next.certificate;
    if (next.sortBy && next.sortBy !== "newest") params.sortBy = next.sortBy;
    setSearchParams(params);
  };

  const handleAnimalChange = (animalId) => {
    setSelectedAnimal(animalId);
    setSelectedBreed("");
    syncParams({ animal: animalId, breed: "" });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    syncParams();
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedAnimal("all");
    setSelectedGender("");
    setSelectedArea("");
    setSelectedLocation("");
    setSelectedBreed("");
    setCertificateFilter("");
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <main className="adoption-hub" dir="rtl">
      <section className="adoption-hub-hero">
        <div className="adoption-hub-hero-glow" aria-hidden="true" />
        <div className="adoption-hub-hero-inner">
          <button
            type="button"
            className="adoption-hub-back"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>חזרה לדף הבית</span>
          </button>

          <span className="adoption-hub-kicker">
            <FontAwesomeIcon icon={faHeart} />
            אימוץ תמיד בחינם
          </span>

          <h1>
            תנו בית חם
            <span>לחיית מחמד שמחכה</span>
          </h1>

          <p>
            כלבים, חתולים וחיות נוספות שמחפשים משפחה. האימוץ ב-{SITE_NAME}{" "}
            תמיד ללא תשלום.
          </p>

          <div className="adoption-hub-hero-actions">
            <button
              type="button"
              className="adoption-hub-publish"
              onClick={() => navigate("/publish_ad")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>פרסמו לאימוץ</span>
            </button>
            <a href="#adoption-listings" className="adoption-hub-scroll">
              <FontAwesomeIcon icon={faPaw} />
              <span>למודעות</span>
            </a>
          </div>
        </div>
      </section>

      <section className="adoption-hub-promise" aria-label="הבטחת אימוץ">
        <div className="adoption-hub-promise-inner">
          <div>
            <strong>0 ₪</strong>
            <span>אימוץ תמיד חינם</span>
          </div>
          <div>
            <strong>{Math.max(listings.length, 1)}+</strong>
            <span>חיות מחכות לבית</span>
          </div>
          <div>
            <strong>{PET_CATEGORIES.length}</strong>
            <span>סוגי חיות</span>
          </div>
        </div>
      </section>

      <section
        className="adoption-hub-filters"
        aria-label="סינון לפי סוג חיה"
      >
        <div className="adoption-hub-filters-inner">
          {ANIMAL_FILTERS.map((animal) => (
            <button
              key={animal.id}
              type="button"
              className={`adoption-hub-animal-pill ${
                selectedAnimal === animal.id ? "active" : ""
              }`}
              onClick={() => handleAnimalChange(animal.id)}
            >
              {animal.label}
            </button>
          ))}
        </div>
      </section>

      <section className="adoption-hub-content" id="adoption-listings">
        <form className="adoption-hub-search" onSubmit={handleSearch}>
          <div className="category-filter-field category-filter-field--wide">
            <label htmlFor="adoption-search">חיפוש</label>
            <input
              id="adoption-search"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="שם, גזע, עיר..."
            />
          </div>

          <div className="category-filter-field">
            <label htmlFor="adoption-breed">גזע</label>
            <select
              id="adoption-breed"
              value={selectedBreed}
              onChange={(event) => setSelectedBreed(event.target.value)}
            >
              <option value="">הכל</option>
              {breedOptions.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="adoption-gender">מין</label>
            <select
              id="adoption-gender"
              value={selectedGender}
              onChange={(event) => setSelectedGender(event.target.value)}
            >
              <option value="">הכל</option>
              <option value="זכר">זכר</option>
              <option value="נקבה">נקבה</option>
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="adoption-area">אזור</label>
            <select
              id="adoption-area"
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
            <label htmlFor="adoption-city">עיר</label>
            <select
              id="adoption-city"
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

          <div className="category-filter-field">
            <label htmlFor="adoption-certificate">תעודה</label>
            <select
              id="adoption-certificate"
              value={certificateFilter}
              onChange={(event) => setCertificateFilter(event.target.value)}
            >
              <option value="">הכל</option>
              <option value="yes">עם תעודה</option>
              <option value="no">ללא תעודה</option>
            </select>
          </div>

          <div className="category-filter-field">
            <label htmlFor="adoption-sort">מיון</label>
            <select
              id="adoption-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">הכי חדשים</option>
              <option value="name">לפי שם</option>
            </select>
          </div>

          <button type="submit" className="adoption-hub-submit">
            חיפוש
          </button>
        </form>

        <p className="adoption-hub-count">
          {filteredListings.length} חיות לאימוץ
          {selectedAnimal !== "all" ? ` · ${selectedAnimal}` : ""}
        </p>

        {loading && filteredListings.length === 0 ? (
          <div className="adoption-hub-empty">
            <Loading size={64} fullscreen={false} message="טוען מודעות אימוץ..." />
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <PetCard
                key={listing.id}
                listing={listing}
                showAdoptionBadge
              />
            ))}
          </div>
        ) : (
          <div className="adoption-hub-empty">
            <FontAwesomeIcon icon={faHeart} className="adoption-hub-empty-icon" />
            <h3>לא נמצאו חיות לאימוץ</h3>
            <p>נסו לשנות סינון, או פרסמו חיה שמחכה לבית.</p>
            <div className="adoption-hub-empty-actions">
              <button type="button" className="adoption-hub-reset" onClick={resetFilters}>
                נקה סינון
              </button>
              <button
                type="button"
                className="adoption-hub-publish adoption-hub-publish--dark"
                onClick={() => navigate("/publish_ad")}
              >
                פרסמו לאימוץ
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Adoption;
