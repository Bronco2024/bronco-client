import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBoxOpen,
  faHouseChimney,
  faShoppingBag,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthProvider";
import { db } from "@/firebase";
import {
  formatPurchaseDate,
  getPurchaseJourneyIndex,
  getPurchaseStatusHint,
  getPurchaseStatusLabel,
  getPurchaseThumbnails,
  PURCHASE_JOURNEY_STEPS,
  PURCHASE_STATUS,
} from "@/helpers/purchase-status";
import "./MyPurchases.css";

const formatPrice = (price) =>
  `₪${Number(price || 0).toLocaleString("he-IL")}`;

const MyPurchases = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "purchases"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        data.sort((a, b) => {
          const aSec = a.purchasedAt?.seconds || 0;
          const bSec = b.purchasedAt?.seconds || 0;
          return bSec - aSec;
        });
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [currentUser]);

  const activeCount = useMemo(
    () =>
      purchases.filter(
        (purchase) =>
          purchase.status !== PURCHASE_STATUS.DELIVERED &&
          purchase.status !== PURCHASE_STATUS.CANCEL
      ).length,
    [purchases]
  );

  return (
    <div className="buyer-orders" dir="rtl">
      <section className="buyer-orders-hero">
        <p className="buyer-orders-kicker">מהחנות עד הדלת</p>
        <h1>
          <FontAwesomeIcon icon={faShoppingBag} />
          ההזמנות שלי
        </h1>
        <p className="buyer-orders-lead">
          עקבו אחרי כל רכישה — מאישור ההזמנה, דרך המשלוח, ועד שהמוצרים מגיעים
          הביתה.
        </p>
        <ul className="buyer-orders-promises">
          <li>
            <FontAwesomeIcon icon={faBoxOpen} />
            אישור והכנה
          </li>
          <li>
            <FontAwesomeIcon icon={faTruckFast} />
            משלוח בדרך
          </li>
          <li>
            <FontAwesomeIcon icon={faHouseChimney} />
            עד הדלת
          </li>
        </ul>
      </section>

      {loading ? (
        <p className="buyer-orders-empty">טוענים את ההזמנות...</p>
      ) : purchases.length === 0 ? (
        <div className="buyer-orders-empty-card">
          <h2>עדיין אין הזמנות</h2>
          <p>כשתקנו מהחנות, תוכלו לעקוב כאן אחרי הסטטוס עד הבית.</p>
          <Link to="/our-products" className="buyer-orders-cta">
            לחנות Petzo
          </Link>
        </div>
      ) : (
        <>
          <p className="buyer-orders-count">
            {purchases.length} הזמנות
            {activeCount > 0 ? ` · ${activeCount} בטיפול` : ""}
          </p>
          <ul className="buyer-order-list">
            {purchases.map((purchase) => {
              const thumbs = getPurchaseThumbnails(purchase, 3);
              const journeyIndex = getPurchaseJourneyIndex(purchase.status);
              const isCancelled = purchase.status === PURCHASE_STATUS.CANCEL;

              return (
                <li key={purchase.id}>
                  <button
                    type="button"
                    className="buyer-order-card"
                    onClick={() =>
                      navigate(`/purchase/${purchase.id}`, {
                        state: { purchase },
                      })
                    }
                  >
                    <div className="buyer-order-card-top">
                      <div className="buyer-order-thumbs" aria-hidden="true">
                        {thumbs.length > 0 ? (
                          thumbs.map((src) => (
                            <img key={src} src={src} alt="" />
                          ))
                        ) : (
                          <span className="buyer-order-thumb-fallback">
                            <FontAwesomeIcon icon={faBoxOpen} />
                          </span>
                        )}
                      </div>
                      <div className="buyer-order-summary">
                        <span
                          className={`buyer-order-status buyer-order-status--${purchase.status || "pending"}`}
                        >
                          {getPurchaseStatusLabel(purchase.status)}
                        </span>
                        <strong>{formatPrice(purchase.totalPrice)}</strong>
                        <span>
                          {formatPurchaseDate(purchase.purchasedAt)}
                          {" · "}
                          {purchase.totalQuantity || 0} פריטים
                        </span>
                      </div>
                    </div>

                    <p className="buyer-order-hint">
                      {getPurchaseStatusHint(purchase.status)}
                    </p>

                    {!isCancelled && (
                      <ol className="buyer-mini-journey" aria-hidden="true">
                        {PURCHASE_JOURNEY_STEPS.map((step, index) => (
                          <li
                            key={step.id}
                            className={
                              index <= journeyIndex
                                ? "is-done"
                                : index === journeyIndex + 1
                                  ? "is-next"
                                  : ""
                            }
                          >
                            <span />
                            {step.shortLabel}
                          </li>
                        ))}
                      </ol>
                    )}

                    <span className="buyer-order-open">
                      פרטי הזמנה ומעקב
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyPurchases;
