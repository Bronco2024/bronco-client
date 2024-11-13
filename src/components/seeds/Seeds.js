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
import { db } from '../../firebase';
import './Seeds.css'
import { SEEDS_TYPES, SEMEN_TYPES, ADS_PER_PAGE, DISTRICTS, DISTRICT_NAMES } from "../utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "../utils/constants/Functions";

const Seeds = () => {
    const navigate = useNavigate();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        seed_type: "",
        semen_type: "",
        hasCertificate: "",
        district: "",
        location: ""
    });

    const categoryFilter = "זרע";

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
        if (filters.hasCertificate === "" &&
            filters.seed_type === "" &&
            filters.maxPrice === "" &&
            filters.minPrice === "" &&
            filters.semen_type === "" &&
            filters.district === "" &&
            filters.location === ""
        ) {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }
        setPage(1);

        let certificate = filters.hasCertificate === "yes" ? true : filters.hasCertificate === "no" ? false : "";

        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.minPrice ? [where("price", ">=", parseFloat(filters.minPrice))] : []),
            ...(filters.maxPrice ? [where("price", "<=", parseFloat(filters.maxPrice))] : []),
            ...(filters.seed_type ? [where("seed_type", "==", filters.seed_type)] : []),
            ...(filters.semen_type ? [where("semen_type", "==", filters.semen_type)] : []),
            ...(filters.district ? [where("district", "==", filters.district)] : []),
            ...(filters.location ? [where("location", "==", filters.location)] : []),
            ...(filters.hasCertificate ? [where("hasCertificate", "==", certificate)] : []),
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

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="seeds-container">
            <h1 className="seeds-title">זרעים</h1>

            <div className="filters-box">
                <select
                    name="seed_type"
                    value={filters.seed_type}
                    onChange={handleFilterChange}
                >
                    <option value="">סוג זרע</option>
                    {SEEDS_TYPES.map((seed, index) => (
                        <option key={index} value={seed}>
                            {seed}
                        </option>
                    ))}
                </select>
                <select
                    name="semen_type"
                    value={filters.semen_type}
                    onChange={handleFilterChange}
                >
                    <option value="">טרי/קפוא</option>
                    {SEMEN_TYPES.map((semen, index) => (
                        <option key={index} value={semen}>
                            {semen}
                        </option>
                    ))}
                </select>


                <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                    <option value="">תעודת הרבעה</option>
                    <option value="yes">כן</option>
                    <option value="no">לא</option>
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
                <button onClick={applyFilters}>חפש</button>
            </div>

            <div className="ads-seeds-wrapper">
                {adList.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    adList.map(ad => (
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <div
                                key={ad.id}
                                className="ad-seeds-card"
                                style={{ borderColor: ad?.hasCertificate ? '#0064E0' : null, borderWidth: ad?.hasCertificate ? '2px' : null }}
                                onClick={() => handleClickOnItem(ad)}
                            >
                                {ad.photos && ad.photos[0] && (
                                    <img src={ad.photos[0]} alt={ad.title} className="ad-seeds-image" />
                                )}
                                {ad.photos.length === 0 && (
                                    <img src={require('../../assets/no-image.jpg')} alt={ad.category} className="ad-seeds-image" />
                                )}
                                <h2 className="ad-seeds-title">{ad.seed_type}</h2>
                                <p className="ad-seeds-price">₪{ad.price}</p>
                                <p className='ad-seeds-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                            </div>
                        )

                    ))
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

export default Seeds;