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
  faMinus,
  faPlus,
  faTrash,
  faTruck,
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
      "מוצרים לחיות מחמד עם הזמנה ותשלום באתר, ומשלוח עד הבית.",
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
    await updateUserCart(currentUser.uid, nextItems.map(toCartProduct).map((item, index) => ({
      ...item,
      quantity: nextItems[index].quantity,
    })));
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
      <section className="store-hero">
        <div className="store-hero-copy">
          <p className="store-kicker">{SITE_NAME} Store</p>
          <h1>חנות מוצרים עד הבית</h1>
          <p>
            בחרו מוצרים לחיות המחמד, שלמו באתר (כרטיס / ביט), ואנחנו נדאג למשלוח
            עד הדלת. אפשר גם לשלם במסירה.
          </p>
          <div className="store-hero-actions">
            <span className="store-pill">
              <FontAwesomeIcon icon={faTruck} />
              משלוח עד הבית
            </span>
            {cartQuantity > 0 && (
              <Link className="store-cart-link" to="/cart">
                לעגלה ({cartQuantity})
              </Link>
            )}
          </div>
        </div>
        <div
          className="store-hero-visual"
          style={{ backgroundImage: `url(${STORE_CATEGORY.image})` }}
          aria-hidden="true"
        />
      </section>

      <section className="store-grid-wrap">
        {visibleAds.length === 0 ? (
          <div className="store-empty">
            <h2>עדיין אין מוצרים בחנות</h2>
            <p>
              ברגע שיתווספו מוצרים תוכלו להוסיף אותם לעגלה ולהזמין משלוח עד הבית.
            </p>
          </div>
        ) : (
          <div className="store-grid">
            {visibleAds.map((ad) => {
              const inCart = cart.find((item) => item.id === ad.id);
              const busy = busyId === ad.id;
              return (
                <article key={ad.id} className="store-card">
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
                    <button
                      type="button"
                      className="store-card-title"
                      onClick={() =>
                        navigate(getListingPath(ad), { state: { ad } })
                      }
                    >
                      {getProductTitle(ad)}
                    </button>
                    {ad.accessory && (
                      <p className="store-card-meta">{ad.accessory}</p>
                    )}
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
