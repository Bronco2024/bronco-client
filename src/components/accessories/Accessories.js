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
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { mapApprovedAdsFromSnapshot } from '@/helpers/ad-approval';
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import AccessoriesFilters from "@components/utils/filters/AccessoriesFilters";
import ServicePage, { AdGridCard } from "@/components/listings/ServicePage";
import Paganation from "@components/utils/paganation/Paganation";

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
    const TOTAL_PAGES = Math.ceil(totalAds / ADS_PER_PAGE);

    const getTotalCount = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter)
        );

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
            if (name === "maxPrice" && normalizedValue === 0) {
                return { ...prevFilters, maxPrice: 999999 };
            }
            return { ...prevFilters, [name]: normalizedValue };
        });
    };

    const applyFilters = async () => {
        if (filters.location === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0 &&
            filters.accessory === "" &&
            filters.sortBy === "newest") {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        setPage(1);

        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.minPrice ? [where("price", ">=", (filters.minPrice))] : []),
            ...(filters.maxPrice ? [where("price", "<=", (filters.maxPrice))] : []),
            ...(filters.accessory ? [where("accessory", "==", filters.accessory)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
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
            accessory: "",
            minPrice: 0,
            maxPrice: 999999,
            district: "",
            location: "",
            sortBy: "newest",
        });
    }

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <ServicePage
            title="אביזרים"
            subtitle="ציוד, מזון וכל מה שצריך בבית"
            heroImage="/services/accessories.jpg"
            count={adList.length}
            filters={
                <AccessoriesFilters
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    applyFilters={applyFilters}
                    resetFilters={resetFilters}
                />
            }
        >
            {adList.length === 0 ? (
                <p className="ads-page-empty">לא נמצאו מודעות בקטיגוריה זו</p>
            ) : (
                <div className="ads-page-grid">
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
        </ServicePage>
    )
}
export default Accessories;