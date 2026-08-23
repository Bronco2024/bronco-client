import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { getListingPath } from "@/helpers/listing-links";
import { db } from '@/firebase';
import { mapApprovedAdsFromSnapshot } from '@/helpers/ad-approval';
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import ServicePage, { AdGridCard } from "@/components/listings/ServicePage";
import Paganation from "@components/utils/paganation/Paganation";
import useServicePageSearch from "@/hooks/useServicePageSearch";
import { filterAdsBySearch } from "@/helpers/listing-search";
import { faPhoneAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Veterinarian = () => {
    const navigate = useNavigate();
    const { searchText, setSearchText } = useServicePageSearch({
        path: "/veterinarians",
        pageTitle: "וטרינרים",
        description: "רופאים וטיפול מקצועי לחיות מחמד",
    });
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);

    const categoryFilter = "וטרינרים";
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
        const items = mapApprovedAdsFromSnapshot(querySnapshot);
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
        const items = mapApprovedAdsFromSnapshot(querySnapshot);
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
        const items = mapApprovedAdsFromSnapshot(querySnapshot);
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage - 1);
    };

    const handleClickOnItem = (ad) => {
        navigate(getListingPath(ad), { state: { ad } })
    }

    const visibleAds = useMemo(
        () => filterAdsBySearch(adList, searchText),
        [adList, searchText]
    );

    return (
        <ServicePage
            title="וטרינרים"
            subtitle="רופאים וטיפול מקצועי לחיות מחמד"
            heroImage="/services/veterinarian.jpg"
            count={visibleAds.length}
            searchText={searchText}
            onSearchChange={setSearchText}
        >
            {visibleAds.length === 0 ? (
                <p className="ads-page-empty">לא נמצאו מודעות בקטיגוריה זו</p>
            ) : (
                <div className="ads-page-grid">
                    {visibleAds.map((ad) =>
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <AdGridCard
                                key={ad.id}
                                ad={ad}
                                title={ad.title}
                                onClick={handleClickOnItem}
                            >
                                {ad.location && (
                                    <p>
                                        <FontAwesomeIcon icon={faLocationDot} /> {ad.location}
                                    </p>
                                )}
                                {ad.phoneNumber && (
                                    <a
                                        className="phone-link"
                                        href={`tel:${ad.phoneNumber}`}
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <FontAwesomeIcon icon={faPhoneAlt} />
                                        <span>{ad.phoneNumber}</span>
                                    </a>
                                )}
                            </AdGridCard>
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
export default Veterinarian;
