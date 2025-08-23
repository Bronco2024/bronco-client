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
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import './Horses.css'
import HorseFilters from "@components/utils/filters/HorseFilters";
import Paganation from "@components/utils/paganation/Paganation";

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
        location: ""
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
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        console.log("Ads fetched:", items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }, [categoryFilter]);

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
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage - 1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const applyFilters = async () => {
        if (filters.age === "" &&
            filters.breed === "" &&
            filters.gender === "" &&
            filters.hasCertificate === "" &&
            filters.district === "" &&
            filters.location === "" &&
            filters.maxPrice === 999999 &&
            filters.minPrice === 0) {
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
            ...(filters.district ? [where("district", "==", filters.district)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
            ...ageQueries
        ];

        const totalCountQuery = query(collectionRef, ...filterQueries);
        const totalCountSnapshot = await getCountFromServer(totalCountQuery);
        setTotalAds(totalCountSnapshot.data().count);

        const paginatedQuery = query(collectionRef, ...filterQueries, limit(ADS_PER_PAGE));
        const querySnapshot = await getDocs(paginatedQuery);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
            location: ""
        });
    }

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="horses-container">

            <div className="image-filter-container">
                <div
                    className="image-section"
                    style={{
                        backgroundImage: `url(${require('@/assets/horse-arabian2.jpg')})`,
                    }}
                />

                <div className="filter-desktop">
                    <HorseFilters
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        applyFilters={applyFilters}
                        resetFilters={resetFilters}
                    />
                </div>

                <div className="filter-mobile">
                    <HorseFilters
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        applyFilters={applyFilters}
                        resetFilters={resetFilters}
                    />
                </div>
            </div>

            <div className="ads-horses-wrapper">
                {adList.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    adList.map(ad => (
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <div
                                key={ad.id}
                                className="ad-horse-card"
                                style={{ borderColor: ad?.hasCertificate ? '#0064E0' : null, borderWidth: ad?.hasCertificate ? '2px' : null }}
                                onClick={() => handleClickOnItem(ad)}
                            >
                                {(ad.photos && ad.photos[0]) && (
                                    <img src={ad.photos[0]} alt={ad.breed} className="ad-horse-image" />
                                )}
                                {ad.photos.length === 0 && (
                                    <img src={require('@/assets/no-image.jpg')} alt={ad.category} className="ad-horse-image" />
                                )}
                                <h2 className="ad-horse-title">{ad.breed}</h2>
                                <p className="ad-horse-price">₪{ad.price}</p>
                                <p className='ad-horse-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                            </div>
                        )))
                )}
            </div>

            <div style={{ marginBottom: '2%' }}>
                <Paganation
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    page={page}
                    adList={adList}
                    afterThis={afterThis}
                    TOTAL_PAGES={TOTAL_PAGES}
                />
            </div>
        </div>
    );
};

export default Horses;
