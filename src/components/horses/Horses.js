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
import ServicePage, { AdGridCard } from "@/components/listings/ServicePage";
import HorseFilters from "@components/utils/filters/HorseFilters";
import Paganation from "@components/utils/paganation/Paganation";

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
        setFilters((prevFilters) => {
            if (name === "district") {
                return { ...prevFilters, district: value, location: "" };
            }
            return { ...prevFilters, [name]: value };
        });
    };

    const applyFilters = async () => {
        if (filters.age === "" &&
            filters.breed === "" &&
            filters.gender === "" &&
            filters.hasCertificate === "" &&
            filters.location === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0 &&
            filters.sortBy === "newest") {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        let certificate = filters.hasCertificate === "yes" ? true : filters.hasCertificate === "no" ? false : "";
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
            ...(filters.minPrice ? [where("price", ">=", (filters.minPrice))] : []),
            ...(filters.maxPrice ? [where("price", "<=", (filters.maxPrice))] : []),
            ...(filters.hasCertificate ? [where("hasCertificate", "==", certificate)] : []),
            // ...(filters.age ? [where("age", "==", parseInt(filters.age))] : []),
            ...(filters.breed ? [where("breed", "==", filters.breed)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
            ...ageQueries
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
    }

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <ServicePage
            title="סוסים"
            subtitle="סוסים וסייחים מכל הגזעים"
            heroImage="/horses.jpg"
            count={adList.length}
            filters={
                <HorseFilters
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
        </ServicePage>
    );
};

export default Horses;
