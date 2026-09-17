import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getCountFromServer,
    limitToLast,
    endBefore,
    where,
} from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getListingPath } from "@/helpers/listing-links";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { ADS_PER_PAGE, SEED_ANIMAL_TYPES, SEMEN_TYPES, getSeedTypesByAnimal } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { AdGridCard } from "@/components/listings/ServicePage";
import CitySelect from "@/components/pets/CitySelect";
import Paganation from "@components/utils/paganation/Paganation";
import useSeo from "@/hooks/useSeo";
import { filterAdsBySearch } from "@/helpers/listing-search";
import ListingSearchField from "@/components/listings/ListingSearchField";
import { SITE_NAME, SITE_URL } from "@/data/site-config";
import {
    filterSeedAds,
    sortAdsByPreference,
} from "@/helpers/category-client-filters";
import "@/components/pets/CategoryListings.css";

const SEEDS_FILTER_FETCH_LIMIT = 400;

const Seeds = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get("q") || "");
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const [filterError, setFilterError] = useState("");
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 999999,
        seed_animal: "",
        seed_type: "",
        semen_type: "",
        hasCertificate: "",
        district: "",
        location: "",
        sortBy: "newest",
    });

    const categoryFilter = "זרע";
    const TOTAL_PAGES = Math.ceil(totalAds / ADS_PER_PAGE);

    useSeo({
        title: `זרע | ${SITE_NAME}`,
        description: "זרע לסוסים, כלבים, חתולים וחיות משק — לגידול מקצועי",
        url: `${SITE_URL}/seeds`,
    });

    const visibleAds = useMemo(
        () => filterAdsBySearch(adList, searchText),
        [adList, searchText]
    );

    const getTotalCount = useCallback(async () => {
        try {
            const collectionRef = collection(db, "ads");
            const q = query(collectionRef, where("category", "==", categoryFilter));
            const aggregateQuerySnapshot = await getCountFromServer(q);
            setTotalAds(aggregateQuerySnapshot.data().count);
        } catch (error) {
            console.error("Seeds getTotalCount failed", error);
        }
    }, [categoryFilter]);

    const fetchAds = useCallback(async () => {
        try {
            setFilterError("");
            const collectionRef = collection(db, "ads");
            const q = query(
                collectionRef,
                where("category", "==", categoryFilter),
                orderBy("createdAt", "desc"),
                limit(ADS_PER_PAGE)
            );
            const querySnapshot = await getDocs(q);
            const items = sortAdsByPreference(
                mapApprovedAdsFromSnapshot(querySnapshot),
                filters.sortBy
            );
            setAdList(items);
            setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        } catch (error) {
            console.error("Seeds fetchAds failed", error);
            setAdList([]);
            setFilterError("טעינת המודעות נכשלה. נסו לרענן.");
        }
    }, [categoryFilter, filters.sortBy]);

    useEffect(() => {
        fetchAds();
        getTotalCount();
    }, [fetchAds, getTotalCount]);

    const handleNextPage = async () => {
        try {
            const collectionRef = collection(db, "ads");
            const q = query(
                collectionRef,
                where("category", "==", categoryFilter),
                orderBy("createdAt", "desc"),
                startAfter(afterThis),
                limit(ADS_PER_PAGE)
            );
            const querySnapshot = await getDocs(q);
            const items = sortAdsByPreference(
                mapApprovedAdsFromSnapshot(querySnapshot),
                filters.sortBy
            );
            setAdList(items);
            setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setBeforeThis(querySnapshot.docs[0] || null);
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Seeds next page failed", error);
        }
    };

    const handlePrevPage = async () => {
        try {
            const collectionRef = collection(db, "ads");
            const q = query(
                collectionRef,
                where("category", "==", categoryFilter),
                orderBy("createdAt", "desc"),
                limitToLast(ADS_PER_PAGE),
                endBefore(beforeThis)
            );
            const querySnapshot = await getDocs(q);
            const items = sortAdsByPreference(
                mapApprovedAdsFromSnapshot(querySnapshot),
                filters.sortBy
            );
            setAdList(items);
            setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setBeforeThis(querySnapshot.docs[0] || null);
            setPage((prevPage) => prevPage - 1);
        } catch (error) {
            console.error("Seeds prev page failed", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const normalizedValue =
            name === "minPrice" || name === "maxPrice"
                ? Number(value) || 0
                : value;
        setFilters((prevFilters) => {
            if (name === "district") {
                return { ...prevFilters, district: value, location: "" };
            }
            if (name === "seed_animal") {
                return { ...prevFilters, seed_animal: value, seed_type: "" };
            }
            if (name === "maxPrice" && normalizedValue === 0) {
                return { ...prevFilters, maxPrice: 999999 };
            }
            return { ...prevFilters, [name]: normalizedValue };
        });
    };

    const applyFilters = async (event) => {
        event.preventDefault();

        if (
            filters.hasCertificate === "" &&
            filters.seed_animal === "" &&
            filters.seed_type === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0 &&
            filters.semen_type === "" &&
            filters.location === "" &&
            filters.sortBy === "newest"
        ) {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }
        setPage(1);
        setFilterError("");

        try {
            // Query only by category (+ createdAt). Extra filters run client-side
            // so we don't need a new Firestore composite index for every combo.
            const collectionRef = collection(db, "ads");
            const q = query(
                collectionRef,
                where("category", "==", categoryFilter),
                orderBy("createdAt", "desc"),
                limit(SEEDS_FILTER_FETCH_LIMIT)
            );
            const querySnapshot = await getDocs(q);
            let items = mapApprovedAdsFromSnapshot(querySnapshot);
            items = filterSeedAds(items, filters);
            items = sortAdsByPreference(items, filters.sortBy);

            setTotalAds(items.length);
            setAdList(items.slice(0, ADS_PER_PAGE));
            setAfterThis(null);
            setBeforeThis(null);
        } catch (error) {
            console.error("Seeds applyFilters failed", error);
            setAdList([]);
            setTotalAds(0);
            setFilterError("סינון המודעות נכשל. נסו שוב או אפסו מסננים.");
        }
    };

    const resetFilters = () => {
        setFilters({
            minPrice: 0,
            maxPrice: 999999,
            seed_animal: "",
            seed_type: "",
            semen_type: "",
            hasCertificate: "",
            district: "",
            location: "",
            sortBy: "newest",
        });
    };

    const handleClickOnItem = (ad) => {
        navigate(getListingPath(ad), { state: { ad } });
    };

    return (
        <main className="category-page" dir="rtl">
            <section
                className="category-hero"
                style={{ backgroundImage: `url(/horses.jpg)` }}
            >
                <div className="category-hero-overlay">
                    <button
                        type="button"
                        className="category-back"
                        onClick={() => navigate("/")}
                    >
                        ← חזרה לדף הבית
                    </button>
                    <h1>זרע</h1>
                    <p>סוסים, כלבים, חתולים וחיות משק — לגידול מקצועי</p>
                </div>
            </section>

            <section className="category-content">
                <form className="category-search" onSubmit={applyFilters}>
                    <ListingSearchField
                        id="seeds-search-text"
                        value={searchText}
                        onChange={setSearchText}
                    />

                    <div className="category-filter-field">
                        <label htmlFor="category-seed-animal">סוג בעל חיים</label>
                        <select
                            id="category-seed-animal"
                            name="seed_animal"
                            value={filters.seed_animal}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            {SEED_ANIMAL_TYPES.map((animalType) => (
                                <option key={animalType} value={animalType}>
                                    {animalType}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-seed-type">סוג זרע</label>
                        <select
                            id="category-seed-type"
                            name="seed_type"
                            value={filters.seed_type}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            {getSeedTypesByAnimal(filters.seed_animal).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-semen-type">סוג דגימה</label>
                        <select
                            id="category-semen-type"
                            name="semen_type"
                            value={filters.semen_type}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            {SEMEN_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="category-filter-field">
                        <CitySelect
                            value={filters.location}
                            onChange={(e) =>
                                handleFilterChange({ target: { name: "location", value: e.target.value } })
                            }
                            required={false}
                            emptyLabel="כל הערים"
                            areaValue={filters.district}
                            onAreaChange={(e) =>
                                handleFilterChange({ target: { name: "district", value: e.target.value } })
                            }
                            enableAreaFilter
                            areaLabel="אזור"
                        />
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-certificate">תעודת הרבעה</label>
                        <select
                            id="category-certificate"
                            name="hasCertificate"
                            value={filters.hasCertificate}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            <option value="yes">יש תעודה</option>
                            <option value="no">ללא תעודה</option>
                        </select>
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-min-price">מחיר מינימלי</label>
                        <input
                            id="category-min-price"
                            type="number"
                            name="minPrice"
                            min={0}
                            value={filters.minPrice || ""}
                            onChange={handleFilterChange}
                            placeholder="מ-"
                        />
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-max-price">מחיר מקסימלי</label>
                        <input
                            id="category-max-price"
                            type="number"
                            name="maxPrice"
                            min={0}
                            value={filters.maxPrice === 999999 ? "" : filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="עד-"
                        />
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-sort">מיון</label>
                        <select
                            id="category-sort"
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                        >
                            <option value="newest">הכי חדשים</option>
                            <option value="priceAsc">מחיר מהנמוך לגבוה</option>
                            <option value="priceDesc">מחיר מהגבוה לנמוך</option>
                        </select>
                    </div>

                    <button type="submit" className="category-submit">
                        חיפוש
                    </button>
                </form>

                <p className="category-count">{visibleAds.length} מודעות</p>
                {filterError ? (
                    <p className="category-count" style={{ color: "#c0392b" }}>
                        {filterError}
                    </p>
                ) : null}

                {visibleAds.length === 0 ? (
                    <div className="category-empty">
                        <h3>לא נמצאו מודעות</h3>
                        <p>נסו לשנות את החיפוש או לבחור עיר אחרת.</p>
                        <button
                            type="button"
                            className="category-reset"
                            onClick={() => {
                                resetFilters();
                                fetchAds();
                                getTotalCount();
                                setPage(1);
                            }}
                        >
                            נקה חיפוש
                        </button>
                    </div>
                ) : (
                    <div className="listings-grid">
                        {visibleAds.map((ad) =>
                            !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                                <AdGridCard
                                    key={ad.id}
                                    ad={ad}
                                    title={ad.seed_type || ad.title}
                                    onClick={handleClickOnItem}
                                    verified={Boolean(ad?.hasCertificate)}
                                />
                            )
                        )}
                    </div>
                )}

                <Paganation
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    page={page}
                    adList={adList}
                    afterThis={afterThis}
                    TOTAL_PAGES={TOTAL_PAGES}
                />
            </section>
        </main>
    );
};

export default Seeds;
