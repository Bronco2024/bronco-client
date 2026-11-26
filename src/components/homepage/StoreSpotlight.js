import React, { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { getListingPath } from "@/helpers/listing-links";
import { STORE_CATEGORY } from "@/data/pets";
import ListingCardMedia from "@/components/pets/ListingCardMedia";
import "./StoreSpotlight.css";

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "";
  if (typeof price === "number") return `₪${price.toLocaleString("he-IL")}`;
  const trimmed = String(price).trim();
  if (!trimmed) return "";
  if (trimmed.includes("₪")) return trimmed;
  const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
  if (Number.isFinite(numeric)) return `₪${numeric.toLocaleString("he-IL")}`;
  return trimmed;
};

const getTitle = (ad) =>
  ad.title || ad.name || ad.accessory || ad.category || "מוצר";

/**
 * Compact store product rail under the combined homepage hero.
 * Full store branding lives in the hero CTA group.
 */
const StoreSpotlight = ({ variant = "rail" }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      const q = query(
        collection(db, "ads"),
        where("category", "==", "חנות"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      const snap = await getDocs(q);
      const items = mapApprovedAdsFromSnapshot(snap).filter(
        (ad) => !IsDateNowGreaterThanAdDate(ad.availableUntil)
      );
      setProducts(items);
    } catch (_error) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (variant === "rail" && products.length === 0) {
    return null;
  }

  return (
    <section
      className="store-spotlight store-spotlight--rail"
      aria-labelledby="store-rail-title"
    >
      <div className="store-spotlight-rail">
        <div className="store-spotlight-rail-head">
          <h3 id="store-rail-title">נבחרים מהחנות</h3>
          <button type="button" onClick={() => navigate(STORE_CATEGORY.path)}>
            לכל המוצרים
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="store-spotlight-rail-track">
          {products.map((ad) => (
            <button
              key={ad.id}
              type="button"
              className="store-spotlight-product"
              onClick={() => navigate(getListingPath(ad), { state: { ad } })}
            >
              <ListingCardMedia
                src={ad.photos?.[0] || ad.image}
                alt={getTitle(ad)}
              />
              <span className="store-spotlight-product-copy">
                <strong>{getTitle(ad)}</strong>
                <em>{formatPrice(ad.price)}</em>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSpotlight;
