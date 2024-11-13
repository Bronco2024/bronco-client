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
import './Horses.css'
import { BREEDS, ADS_PER_PAGE, DISTRICTS, DISTRICT_NAMES } from "../utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "../utils/constants/Functions";

const Horses = () => {
    const navigate = useNavigate();

    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const [filters, setFilters] = useState({
        gender: "",
        minPrice: "",
        maxPrice: "",
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
            filters.maxPrice === "" &&
            filters.minPrice === "") {
            fetchAds();
            getTotalCount();
            setPage(1);
            return;
        }

        let certificate = filters.hasCertificate === "yes" ? true : filters.hasCertificate === "no"? false:"";
        setPage(1);
        
        const collectionRef = collection(db, "ads");
        const filterQueries = [
            where("category", "==", categoryFilter),
            ...(filters.gender ? [where("gender", "==", filters.gender)] : []),
            ...(filters.minPrice ? [where("price", ">=", parseFloat(filters.minPrice))] : []),
            ...(filters.maxPrice ? [where("price", "<=", parseFloat(filters.maxPrice))] : []),
            ...(filters.hasCertificate ? [where("hasCertificate", "==", certificate)] : []),
            ...(filters.age ? [where("age", "==", parseInt(filters.age))] : []),
            ...(filters.breed ? [where("breed", "==", filters.breed)] : []),
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

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="horses-container">
            <h1 className="horses-title">סוסים</h1>

            <div className="filters-box">
                <select
                    id="breed"
                    name="breed"
                    value={filters.breed || ""}
                    onChange={handleFilterChange}
                    required
                >
                    <option value="">גזע</option>
                    {BREEDS.map((breed, index) => (
                        <option key={index} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>

                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                    <option value="">מין</option>
                    <option value="זכר">זכר</option>
                    <option value="נקבה">נקבה</option>
                </select>

                <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                    <option value="">תעודה</option>
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
                    name="age"
                    placeholder="גיל"
                    value={filters.age}
                    onChange={handleFilterChange}
                />
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
                                    <img src={require('../../assets/no-image.jpg')} alt={ad.category} className="ad-horse-image" />
                                )}
                                <h2 className="ad-horse-title">{ad.breed}</h2>
                                <p className="ad-horse-price">₪{ad.price}</p>
                                <p className='ad-horse-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
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
    );
};

export default Horses;
