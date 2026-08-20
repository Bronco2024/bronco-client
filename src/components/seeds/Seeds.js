import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { ADS_PER_PAGE, SEED_ANIMAL_TYPES, SEMEN_TYPES, getSeedTypesByAnimal } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { AdGridCard } from "@/components/listings/ServicePage";
import CitySelect from "@/components/pets/CitySelect";
import Paganation from "@components/utils/paganation/Paganation";
import "@/components/pets/CategoryListings.css";

const parseNumericPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
        const normalized = Number(price.replace(/[^\d.-]/g, ""));
        return Number.isFinite(normalized) ? normalized : Number.MAX_SAFE_INTEGER;
    }
    return Number.MAX_SAFE_INTEGER;
};

const sortAds = (items, sortBy = "newest") => {
    const sorted = [...items];
    if (sortBy === "priceAsc") {
        sorted.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    } else if (sortBy === "priceDesc") {
        sorted.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }
    return sorted;
};

const Seeds = () => {
    const navigate = useNavigate();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
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

    const getTotalCount = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(collectionRef, where("category", "==", categoryFilter));
        const aggregateQuerySnapshot = await getCountFromServer(q);
        setTotalAds(aggregateQuerySnapshot.data().count);
    }, [categoryFilter]);

    const fetchAds = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limit(ADS_PER_PAGE)
        );
        const querySnapshot = await getDocs(q);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }, [categoryFilter, filters.sortBy]);

    useEffect(() => {
        fetchAds();
        getTotalCount();
    }, [fetchAds, getTotalCount]);

    const handleNextPage = async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            startAfter(afterThis),
            limit(ADS_PER_PAGE)
        );
        const querySnapshot = await getDocs(q);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limitToLast(ADS_PER_PAGE),
            endBefore(beforeThis)
        );
        const querySnapshot = await getDocs(q);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage - 1);
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

        let certificate =
            filters.hasCertificate === "yes"
                ? true
                : filters.hasCertificate === "no"
                ? false
                : "";

        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.minPrice ? [where("price", ">=", filters.minPrice)] : []),
            ...(filters.maxPrice ? [where("price", "<=", filters.maxPrice)] : []),
            ...(filters.seed_animal ? [where("seed_animal", "==", filters.seed_animal)] : []),
            ...(filters.seed_type ? [where("seed_type", "==", filters.seed_type)] : []),
            ...(filters.semen_type ? [where("semen_type", "==", filters.semen_type)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
            ...(filters.hasCertificate ? [where("hasCertificate", "==", certificate)] : []),
        ];

        const totalCountQuery = query(collectionRef, ...filterQueries);
        const totalCountSnapshot = await getCountFromServer(totalCountQuery);
        setTotalAds(totalCountSnapshot.data().count);

        const paginatedQuery = query(collectionRef, ...filterQueries, limit(ADS_PER_PAGE));
        const querySnapshot = await getDocs(paginatedQuery);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);

        setAdList(items);

        if (querySnapshot.docs.length > 0) {
            setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setBeforeThis(querySnapshot.docs[0]);
        } else {
            setAfterThis(null);
            setBeforeThis(null);
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
        navigate("/item", { state: { ad } });
    };

    return (
        <main className="category-page" dir="rtl">
            <section
                className="category-hero"
                style={{ backgroundImage: `url(/farm-animals.jpg)` }}
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
                    <p>לגידול מקצועי ומתקדם</p>
                </div>
            </section>

            <section className="category-content">
                <form className="category-search" onSubmit={applyFilters}>
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

                <p className="category-count">{adList.length} מודעות</p>

                {adList.length === 0 ? (
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
                        {adList.map((ad) =>
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
