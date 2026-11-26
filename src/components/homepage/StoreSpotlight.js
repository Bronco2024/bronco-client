import React, { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBagShopping,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { getListingPath } from "@/helpers/listing-links";
import { STORE_CATEGORY } from "@/data/pets";
import { SITE_NAME } from "@/data/site-config";
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
 * Full-bleed Petzo Store spotlight — sits at the top of the homepage
 * as one composition: brand, headline, line, CTA, dominant image.
 */
const StoreSpotlight = () => {
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

  return (
    <section className="store-spotlight" aria-labelledby="store-spotlight-title">
      <div
        className="store-spotlight-stage"
        style={{ backgroundImage: `url(${STORE_CATEGORY.image})` }}
      >
        <div className="store-spotlight-veil" aria-hidden="true" />
        <div className="store-spotlight-glow" aria-hidden="true" />

        <div className="store-spotlight-inner">
          <p className="store-spotlight-brand">
            <picture>
              <source srcSet="/petzo-logo-mark.webp" type="image/webp" />
              <img src="/petzo-logo.jpg" alt="" width={44} height={41} />
            </picture>
            <span>{SITE_NAME}</span>
          </p>

          <h2 id="store-spotlight-title">
            החנות שלנו
            <span>מוצרים עד הבית</span>
          </h2>

          <p className="store-spotlight-lead">
            קנו באתר — משלוח עד הדלת. תשלום מאובטח או במסירה.
          </p>

          <div className="store-spotlight-cta">
            <Link to={STORE_CATEGORY.path} className="store-spotlight-primary">
              <FontAwesomeIcon icon={faBagShopping} />
              כניסה לחנות
            </Link>
            <span className="store-spotlight-note">
              <FontAwesomeIcon icon={faTruckFast} />
              משלוח לכל הארץ
            </span>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="store-spotlight-rail">
          <div className="store-spotlight-rail-head">
            <h3>נבחרים מהחנות</h3>
            <button
              type="button"
              onClick={() => navigate(STORE_CATEGORY.path)}
            >
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
                onClick={() =>
                  navigate(getListingPath(ad), { state: { ad } })
                }
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
      )}
    </section>
  );
};

export default StoreSpotlight;
