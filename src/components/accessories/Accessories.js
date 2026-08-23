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
import { getListingPath } from "@/helpers/listing-links";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { ADS_PER_PAGE, ACCESSORIES_TPYES } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { AdGridCard } from "@/components/listings/ServicePage";
import CitySelect from "@/components/pets/CitySelect";
import Paganation from "@components/utils/paganation/Paganation";
import useUrlSearchQuery from "@/hooks/useUrlSearchQuery";
import useSeo from "@/hooks/useSeo";
import { SITE_NAME, SITE_URL } from "@/data/site-config";
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

const Accessories = () => {
    const navigate = useNavigate();
    const { searchText, setSearchText, hasSearchText } = useUrlSearchQuery();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);

    const [filters, setFilters] = useState({
        accessory: "",
        minPrice: 0,
        maxPrice: 999999,
        district: "",
        location: "",
        sortBy: "newest",
    });

    const categoryFilter = "אביזרים";
    const TOTAL_PAGES = hasSearchText ? 1 : Math.ceil(totalAds / ADS_PER_PAGE);

    useSeo({
        title: `אביזרים | ${SITE_NAME}`,
        description: "צעצועים, כלובים וכל מה שחיית המחמד צריכה",
        url: `${SITE_URL}/accessories`,
    });

    const matchesSearchText = (ad) => {
        const q = searchText.trim().toLowerCase();
        if (!q) return true;

        const values = [
            ad?.name,
            ad?.title,
            ad?.category,
            ad?.location,
            ad?.breed,
            ad?.accessory,
            ad?.type,
            ad?.description,
        ].filter(Boolean);

        return values.some((value) =>
            String(value).toLowerCase().includes(q)
        );
    };

    const getTotalCount = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(collectionRef, where("category", "==", categoryFilter));
        const aggregateQuerySnapshot = await getCountFromServer(q);
        setTotalAds(aggregateQuerySnapshot.data().count);
    }, [categoryFilter]);

    const fetchAds = useCallback(async ({ sortBy } = {}) => {
        const effectiveSortBy = sortBy ?? filters.sortBy;
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limit(ADS_PER_PAGE)
        );
        const querySnapshot = await getDocs(q);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), effectiveSortBy);
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(null);
    }, [categoryFilter, filters.sortBy]);

    useEffect(() => {
        fetchAds();
        getTotalCount();
    }, [fetchAds, getTotalCount]);

    const handleNextPage = async () => {
        if (hasSearchText) return;
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
        if (hasSearchText) return;
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
            if (name === "maxPrice" && normalizedValue === 0) {
                return { ...prevFilters, maxPrice: 999999 };
            }
            return { ...prevFilters, [name]: normalizedValue };
        });
    };

    const applyFilters = async (event) => {
        event.preventDefault();
        const hasSearch = Boolean(searchText.trim());

        if (
            filters.location === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0 &&
            filters.accessory === "" &&
            filters.sortBy === "newest"
            && !hasSearch
        ) {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        setPage(1);

        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.minPrice ? [where("price", ">=", filters.minPrice)] : []),
            ...(filters.maxPrice ? [where("price", "<=", filters.maxPrice)] : []),
            ...(filters.accessory ? [where("accessory", "==", filters.accessory)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
        ];

        if (!hasSearch) {
            const totalCountQuery = query(collectionRef, ...filterQueries);
            const totalCountSnapshot = await getCountFromServer(totalCountQuery);
            setTotalAds(totalCountSnapshot.data().count);
        }

        const paginatedQuery = query(collectionRef, ...filterQueries, limit(ADS_PER_PAGE));
        const querySnapshot = await getDocs(paginatedQuery);
        const items = sortAds(mapApprovedAdsFromSnapshot(querySnapshot), filters.sortBy);
        const filteredItems = hasSearch ? items.filter(matchesSearchText) : items;

        setAdList(filteredItems);
        if (hasSearch) setTotalAds(filteredItems.length);

        if (hasSearch) {
            // When searching by text we filter client-side, so we don't paginate.
            setAfterThis(null);
            setBeforeThis(null);
            return;
        }

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
            accessory: "",
            minPrice: 0,
            maxPrice: 999999,
            district: "",
            location: "",
            sortBy: "newest",
        });
        setSearchText("");
    };

    const handleClickOnItem = (ad) => {
        navigate(getListingPath(ad), { state: { ad } });
    };

    return (
        <main className="category-page" dir="rtl">
            <section
                className="category-hero"
                style={{ backgroundImage: `url(/accessories-hero.png)` }}
            >
                <div className="category-hero-overlay">
                    <button
                        type="button"
                        className="category-back"
                        onClick={() => navigate("/")}
                    >
                        ← חזרה לדף הבית
                    </button>
                    <h1>אביזרים</h1>
                    <p>צעצועים, כלובים וכל מה שחיית המחמד צריכה</p>
                </div>
            </section>

            <section className="category-content">
                <form className="category-search" onSubmit={applyFilters}>
                    <div className="category-filter-field category-filter-field--wide">
                        <label htmlFor="accessories-search-text">חיפוש</label>
                        <input
                            id="accessories-search-text"
                            type="text"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            placeholder="מה אתם מחפשים?"
                        />
                    </div>

                    <div className="category-filter-field">
                        <label htmlFor="category-accessory">סוג מוצר</label>
                        <select
                            id="category-accessory"
                            name="accessory"
                            value={filters.accessory}
                            onChange={handleFilterChange}
                        >
                            <option value="">הכל</option>
                            {ACCESSORIES_TPYES.map((type) => (
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
                            placeholder="מינימום"
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
                            placeholder="מקסימום"
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
                                fetchAds({ sortBy: "newest" });
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
                                    title={ad.title || ad.category}
                                    onClick={handleClickOnItem}
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

export default Accessories;
