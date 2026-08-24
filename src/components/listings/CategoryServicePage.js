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
import { useNavigate } from "react-router-dom";
import { getListingPath } from "@/helpers/listing-links";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import ServicePage, { ServiceListingCard } from "@/components/listings/ServicePage";
import ServiceAnimalFilter from "@/components/services/ServiceAnimalFilter";
import Paganation from "@components/utils/paganation/Paganation";
import useServicePageFilters from "@/hooks/useServicePageFilters";
import { filterAdsBySearch } from "@/helpers/listing-search";
import { filterAdsByServiceAnimal } from "@/data/services-catalog";

const CategoryServicePage = ({ service }) => {
  const navigate = useNavigate();
  const {
    searchText,
    setSearchText,
    selectedAnimal,
    setSelectedAnimal,
  } = useServicePageFilters({
    path: service.path,
    pageTitle: service.name,
    description: service.subtitle,
  });

  const [adList, setAdList] = useState([]);
  const [totalAds, setTotalAds] = useState(0);
  const [page, setPage] = useState(1);
  const [afterThis, setAfterThis] = useState(null);
  const [beforeThis, setBeforeThis] = useState(null);

  const categoryFilter = service.category;
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
    navigate(getListingPath(ad), { state: { ad } });
  };

  const visibleAds = useMemo(() => {
    const byAnimal = filterAdsByServiceAnimal(adList, selectedAnimal);
    return filterAdsBySearch(byAnimal, searchText);
  }, [adList, searchText, selectedAnimal]);

  const animalFilter = (
    <ServiceAnimalFilter
      animals={service.animals}
      value={selectedAnimal}
      onChange={setSelectedAnimal}
    />
  );

  return (
    <ServicePage
      title={service.name}
      subtitle={service.subtitle}
      heroImage={service.image}
      count={visibleAds.length}
      countLabel="שירותים"
      searchText={searchText}
      onSearchChange={setSearchText}
      filters={animalFilter}
    >
      {visibleAds.length === 0 ? (
        <p className="ads-page-empty">לא נמצאו שירותים בקטגוריה זו</p>
      ) : (
        <div className="service-listings-stack">
          {visibleAds.map(
            (ad) =>
              !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                <ServiceListingCard
                  key={ad.id}
                  ad={ad}
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
  );
};

export default CategoryServicePage;
