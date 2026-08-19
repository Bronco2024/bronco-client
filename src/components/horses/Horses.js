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
import { ADS_PER_PAGE, BREEDS } from "@components/utils/constants/Constants";
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

const sortHorseAds = (items, sortBy = "newest") => {
    const sorted = [...items];
    if (sortBy === "priceAsc") {
        sorted.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    } else if (sortBy === "priceDesc") {
        sorted.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }
    return sorted;
};

const Horses = () => {
    const navigate = useNavigate();

    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const [filters, setFilters] = useState({
        gender: "",
        minPrice: 0,
        maxPrice: 999999,
        hasCertificate: "",
        age: "",
        breed: "",
        district: "",
        location: "",
        sortBy: "newest",
    });

    const categoryFilter = "סוסים";
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
        const items = sortHorseAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
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
        const items = sortHorseAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
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
        const items = sortHorseAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
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
            if (name === "maxPrice" && normalizedValue === 0) {
                return { ...prevFilters, maxPrice: 999999 };
            }
            return { ...prevFilters, [name]: normalizedValue };
        });
    };

    const applyFilters = async (event) => {
        event.preventDefault();

        if (
            filters.age === "" &&
            filters.breed === "" &&
            filters.gender === "" &&
            filters.hasCertificate === "" &&
            filters.location === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0 &&
            filters.sortBy === "newest"
        ) {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        let certificate =
            filters.hasCertificate === "yes"
                ? true
                : filters.hasCertificate === "no"
                ? false
                : "";
        setPage(1);
        let ageQueries = [];
        if (filters.age === "foal") {
            ageQueries = [where("ageInMonths", "<=", 9)];
        } else if (filters.age === "young") {
            ageQueries = [where("ageInMonths", ">=", 9), where("ageInMonths", "<=", 24)];
        } else if (filters.age === "adult") {
            ageQueries = [where("ageInMonths", ">=", 24), where("ageInMonths", "<=", 84)];
        } else if (filters.age === "senior") {
            ageQueries = [where("ageInMonths", ">", 84)];
        }

        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.gender ? [where("gender", "==", filters.gender)] : []),
            ...(filters.minPrice ? [where("price", ">=", filters.minPrice)] : []),
            ...(filters.maxPrice ? [where("price", "<=", filters.maxPrice)] : []),
            ...(filters.hasCertificate ? [where("hasCertificate", "==", certificate)] : []),
            ...(filters.breed ? [where("breed", "==", filters.breed)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
            ...ageQueries,
        ];

        const totalCountQuery = query(collectionRef, ...filterQueries);
        const totalCountSnapshot = await getCountFromServer(totalCountQuery);
        setTotalAds(totalCountSnapshot.data().count);

        const paginatedQuery = query(collectionRef, ...filterQueries, limit(ADS_PER_PAGE));
        const querySnapshot = await getDocs(paginatedQuery);
        const items = sortHorseAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);

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
            gender: "",
            minPrice: 0,
            maxPrice: 999999,
            hasCertificate: "",
            age: "",
            breed: "",
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
                    <h1>סוסים</h1>
                    <p>סוסים וסייחים מכל הגזעים</p>
                </div>
            </section>

            <section className="category-content">
                <form className="category-search" onSubmit={applyFilters}>
                    <div className="category-filter-field">
                        <label htmlFor="category-breed">גזע / סוג</label>
                        <select
                            id="category-breed"
                            name="breed"
                            value={filters.breed}
                            onChange={handleFilterChange}
                        >
                            <option value="">כל הגזעים</option>
                            {BREEDS.map((breed) => (
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
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
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
                        <label htmlFor="category-age">גיל</label>
                        <select
                            id="category-age"
                            name="age"
                            value={filters.age}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            <option value="foal">סייח</option>
                            <option value="young">צעיר</option>
                            <option value="adult">בוגר</option>
                            <option value="senior">מבוגר</option>
                        </select>
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-certificate">תעודה</label>
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
                                    title={ad.breed}
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

export default Horses;
