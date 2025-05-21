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
import { ADS_PER_PAGE, ACCESSORIES_TPYES, DISTRICTS, DISTRICT_NAMES, ADS_PATH_MAP } from "@components/utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import './Accessories.css'

const Accessories = () => {
    const navigate = useNavigate();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);

    const [filters, setFilters] = useState({
        accessory: "",
        minPrice: "",
        maxPrice: "",
        district: "",
        location: ""
    });

    const categoryFilter = "אביזרים";
    const adPath = ADS_PATH_MAP.get(categoryFilter);
    const TOTAL_PAGES = Math.ceil(totalAds / ADS_PER_PAGE);

    const getTotalCount = useCallback(async () => {
        const collectionRef = collection(db, adPath);
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter)
        );

        const aggregateQuerySnapshot = await getCountFromServer(q);
        setTotalAds(aggregateQuerySnapshot.data().count);
    }, [categoryFilter, adPath]);

    const fetchAds = useCallback(async () => {
        const collectionRef = collection(db, adPath);
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limit(ADS_PER_PAGE)
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }, [categoryFilter, adPath]);

    useEffect(() => {
        fetchAds();
        getTotalCount();
    }, [fetchAds, getTotalCount]);

    const handleNextPage = async () => {
        const collectionRef = collection(db, adPath);
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
        const collectionRef = collection(db, adPath);
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
        if (filters.district === "" &&
            filters.location === "" &&
            filters.maxPrice === "" &&
            filters.minPrice === "" &&
            filters.accessory === "") {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        setPage(1);

        const collectionRef = collection(db, adPath);
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.minPrice ? [where("price", ">=", parseFloat(filters.minPrice))] : []),
            ...(filters.maxPrice ? [where("price", "<=", parseFloat(filters.maxPrice))] : []),
            ...(filters.accessory ? [where("accessory", "==", filters.accessory)] : []),
            ...(filters.district ? [where("district", "==", filters.district)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
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
            accessory: "",
            minPrice: "",
            maxPrice: "",
            district: "",
            location: ""
        });
    }

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="accessories-container">
            <h1 className="accessories-title">אביזרים</h1>

            <div className="accessories-filters-box">
                <select
                    id="accessory"
                    name="accessory"
                    value={filters.accessory || ""}
                    onChange={handleFilterChange}
                    required
                >
                    <option value="">בחר סוג מוצר</option>
                    {ACCESSORIES_TPYES.map((accessory, index) => (
                        <option key={index} value={accessory}>
                            {accessory}
                        </option>
                    ))}
                </select>

                <select
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                >
                    <option value="">בחר אזור</option>
                    {Object.keys(DISTRICTS).map((districtKey) => (
                        <option key={districtKey} value={districtKey}>
                            {DISTRICT_NAMES[districtKey]}
                        </option>
                    ))}
                </select>

                {filters.district && (
                    <>
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                        >
                            <option value="">בחר מיקום</option>
                            {DISTRICTS[filters.district].map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <input
                    type="number"
                    name="minPrice"
                    placeholder="מחיר מינימלי"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="מחיר מקסימלי"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                />
                
                <button className="apply-filters" onClick={applyFilters}>חפש</button>
                <button className="reset-filters" onClick={resetFilters}>איפוס</button>
            </div>

            <div className="ads-accessory-wrapper">
                {adList.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    adList.map(ad => (
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <div
                                key={ad.id}
                                className="ad-accessory-card"
                                onClick={() => handleClickOnItem(ad)}
                            >
                                {ad.photos && ad.photos[0] && (
                                    <img src={ad.photos[0]} alt={ad.title} className="ad-accessory-image" />
                                )}
                                {ad.photos.length === 0 && (
                                    <img src={require('@/assets/no-image.jpg')} alt={ad.category} className="ad-accessory-image" />
                                )}
                                <h2 className="ad-accessory-title">{ad.category}</h2>
                                <p className="ad-accessory-price">₪{ad.price}</p>
                                <p className='ad-accessory-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                            </div>
                        )))
                )}
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>קודם</button>
                <span>דף {page}</span>
                <button onClick={handleNextPage} disabled={page === TOTAL_PAGES || adList.length === 0 || !afterThis}>
                    הבא
                </button>
            </div>
        </div>
    )
}
export default Accessories;