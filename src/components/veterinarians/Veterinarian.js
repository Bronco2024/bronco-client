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
import './Veterinarian.css'
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";

const Boarding = () => {
    const navigate = useNavigate();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);

    const categoryFilter = "וטרינר";
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

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="veterinarian-container">
            <h1 className="veterinarian-title">וטרינר</h1>

            <div className="ads-veterinarian-wrapper">
                {adList.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    adList.map(ad => (
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <div
                                key={ad.id}
                                className="ad-veterinarian-card"
                                onClick={() => handleClickOnItem(ad)}
                            >
                                {ad.photos && ad.photos[0] && (
                                    <img src={ad.photos[0]} alt={ad.title} className="ad-veterinarian-image" />
                                )}
                                {ad.photos.length === 0 && (
                                    <img src={require('@/assets/no-image.jpg')} alt={ad.category} className="ad-veterinarian-image" />
                                )}
                                <h2 className="ad-veterinarian-title">{ad.title}</h2>
                                <p className='ad-veterinarian-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
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
export default Boarding;