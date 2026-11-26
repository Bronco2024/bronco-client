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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCreditCard,
  faMinus,
  faPlus,
  faShoppingBag,
  faTrash,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "@/firebase";
import { mapApprovedAdsFromSnapshot } from "@/helpers/ad-approval";
import { ADS_PER_PAGE } from "@components/utils/constants/Constants";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import { getListingPath } from "@/helpers/listing-links";
import { toCartProduct } from "@/helpers/cart-helpers";
import { updateUserCart } from "@/helpers/firebase-helpers";
import {
  addItem,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/redux/cartSlice";
import { useAuth } from "@/context/AuthProvider";
import ListingCardMedia from "@/components/pets/ListingCardMedia";
import Paganation from "@components/utils/paganation/Paganation";
import useSeo from "@/hooks/useSeo";
import { SITE_NAME, SITE_URL } from "@/data/site-config";
import { STORE_CATEGORY } from "@/data/pets";
import "./OurProducts.css";

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

const getProductTitle = (ad) =>
  ad.title || ad.name || ad.accessory || ad.category || "מוצר";

const OurProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const { currentUser } = useAuth();

  const [adList, setAdList] = useState([]);
  const [totalAds, setTotalAds] = useState(0);
  const [page, setPage] = useState(1);
  const [afterThis, setAfterThis] = useState(null);
  const [beforeThis, setBeforeThis] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const categoryFilter = "חנות";
  const TOTAL_PAGES = Math.ceil(totalAds / ADS_PER_PAGE) || 1;

  useSeo({
    title: `חנות | ${SITE_NAME}`,
    description:
      "חנות Petzo — מוצרים לחיות מחמד, תשלום באתר ומשלוח עד הבית.",
    url: `${SITE_URL}${STORE_CATEGORY.path}`,
  });

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
    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    setBeforeThis(null);
    setPage(1);
  }, [categoryFilter]);

  useEffect(() => {
    fetchAds();
    getTotalCount();
  }, [fetchAds, getTotalCount]);

  const handleNextPage = async () => {
    if (!afterThis) return;
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
    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    setBeforeThis(querySnapshot.docs[0] || null);
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = async () => {
    if (!beforeThis) return;
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
    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    setBeforeThis(querySnapshot.docs[0] || null);
    setPage((prev) => Math.max(1, prev - 1));
  };

  const persistCart = async (nextItems) => {
    if (!currentUser?.uid) return;
    await updateUserCart(
      currentUser.uid,
      nextItems.map((item) => ({
        ...toCartProduct(item),
        quantity: item.quantity,
      }))
    );
  };

  const requireLogin = () => {
    navigate(`/login?next=${encodeURIComponent(STORE_CATEGORY.path)}`);
  };

  const handleAddToCart = async (ad) => {
    if (!currentUser) {
      requireLogin();
      return;
    }
    setBusyId(ad.id);
    try {
      const product = toCartProduct(ad);
      dispatch(addItem(product));
      const existing = cart.find((item) => item.id === ad.id);
      const nextCart = existing
        ? cart.map((item) =>
            item.id === ad.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart, { ...product, quantity: 1 }];
      await persistCart(nextCart);
    } finally {
      setBusyId(null);
    }
  };

  const handleDecrease = async (ad) => {
    if (!currentUser) return;
    setBusyId(ad.id);
    try {
      dispatch(decreaseQuantity(ad.id));
      const nextCart = cart
        .map((item) =>
          item.id === ad.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      await persistCart(nextCart);
    } finally {
      setBusyId(null);
    }
  };

  const handleIncrease = async (ad) => {
    if (!currentUser) return;
    setBusyId(ad.id);
    try {
      dispatch(increaseQuantity(ad.id));
      const nextCart = cart.map((item) =>
        item.id === ad.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      await persistCart(nextCart);
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (ad) => {
    if (!currentUser) return;
    setBusyId(ad.id);
    try {
      dispatch(removeItem(ad.id));
      await persistCart(cart.filter((item) => item.id !== ad.id));
    } finally {
      setBusyId(null);
    }
  };

  const visibleAds = adList.filter(
    (ad) => !IsDateNowGreaterThanAdDate(ad.availableUntil)
  );

  return (
    <div className="store-page" dir="rtl">
      <section
        className="store-hero"
        style={{ backgroundImage: `url(${STORE_CATEGORY.image})` }}
        aria-labelledby="store-hero-title"
      >
        <div className="store-hero-veil" aria-hidden="true" />
        <div className="store-hero-inner">
          <p className="store-hero-brand">
            <picture>
              <source srcSet="/petzo-logo-mark.webp" type="image/webp" />
              <img
                src="/petzo-logo.jpg"
                alt=""
                width={52}
                height={48}
                decoding="async"
              />
            </picture>
            <span>{SITE_NAME}</span>
          </p>

          <h1 id="store-hero-title">
            החנות
            <span>שחיית המחמד שלכם תאהב</span>
          </h1>

          <p className="store-hero-lead">
            מוצרים נבחרים, תשלום באתר, משלוח עד הבית.
          </p>

          <div className="store-hero-cta">
            <a className="store-hero-primary" href="#store-catalog">
              לכל המוצרים
            </a>
            <Link className="store-hero-cart" to="/cart">
              <FontAwesomeIcon icon={faShoppingBag} />
              עגלה{cartQuantity > 0 ? ` (${cartQuantity})` : ""}
            </Link>
          </div>

          <ul className="store-hero-points">
            <li>
              <FontAwesomeIcon icon={faTruckFast} />
              משלוח עד הדלת
            </li>
            <li>
              <FontAwesomeIcon icon={faCreditCard} />
              תשלום מאובטח באתר
            </li>
          </ul>
        </div>
      </section>

      <section className="store-catalog" id="store-catalog">
        <div className="store-catalog-head">
          <div>
            <p className="store-catalog-kicker">הקולקציה</p>
            <h2>מוצרים בחנות</h2>
          </div>
          {cartQuantity > 0 && (
            <Link to="/cart" className="store-catalog-cart">
              לעגלה · {cartQuantity}
            </Link>
          )}
        </div>

        {visibleAds.length === 0 ? (
          <div className="store-empty">
            <h3>המדפים מתמלאים</h3>
            <p>
              בקרוב תוכלו לקנות כאן מוצרים לחיות המחמד — עם משלוח עד הבית.
            </p>
            <Link to="/">חזרה לדף הבית</Link>
          </div>
        ) : (
          <div className="store-grid">
            {visibleAds.map((ad, index) => {
              const inCart = cart.find((item) => item.id === ad.id);
              const busy = busyId === ad.id;
              return (
                <article
                  key={ad.id}
                  className="store-card"
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                >
                  <button
                    type="button"
                    className="store-card-media"
                    onClick={() =>
                      navigate(getListingPath(ad), { state: { ad } })
                    }
                  >
                    <ListingCardMedia
                      src={ad.photos?.[0] || ad.image}
                      alt={getProductTitle(ad)}
                    />
                  </button>
                  <div className="store-card-body">
                    {ad.accessory && (
                      <p className="store-card-meta">{ad.accessory}</p>
                    )}
                    <button
                      type="button"
                      className="store-card-title"
                      onClick={() =>
                        navigate(getListingPath(ad), { state: { ad } })
                      }
                    >
                      {getProductTitle(ad)}
                    </button>
                    <p className="store-card-price">{formatPrice(ad.price)}</p>

                    {inCart ? (
                      <div className="store-qty">
                        <div className="store-qty-controls">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDecrease(ad)}
                            aria-label="הפחת כמות"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span>{inCart.quantity}</span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleIncrease(ad)}
                            aria-label="הוסף כמות"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="store-remove"
                          disabled={busy}
                          onClick={() => handleRemove(ad)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          הסר
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="store-add"
                        disabled={busy}
                        onClick={() => handleAddToCart(ad)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                        הוסף לעגלה
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {visibleAds.length > 0 && (
          <Paganation
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            page={page}
            adList={visibleAds}
            afterThis={afterThis}
            TOTAL_PAGES={TOTAL_PAGES}
          />
        )}
      </section>
    </div>
  );
};

export default OurProducts;
