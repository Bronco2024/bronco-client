import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faHouseChimney,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthProvider";
import { db } from "@/firebase";
import {
  formatPurchaseDate,
  getPurchaseJourneyIndex,
  getPurchaseJourneyStep,
  getPurchaseStatusHint,
  getPurchaseStatusLabel,
  PURCHASE_JOURNEY_STEPS,
  PURCHASE_STATUS,
  PURCHASE_STATUS_LABELS,
} from "@/helpers/purchase-status";
import "./MyPurchases.css";

const formatPrice = (price) =>
  `₪${Number(price || 0).toLocaleString("he-IL")}`;

const PurchaseDetails = () => {
  const { currentUser } = useAuth();
  const { id: purchaseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(state?.purchase || null);
  const [status, setStatus] = useState(state?.purchase?.status || "pending");
  const [loading, setLoading] = useState(!state?.purchase);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state?.purchase?.id && state.purchase.id === purchaseId) {
      setPurchase(state.purchase);
      setStatus(state.purchase.status || "pending");
      setLoading(false);
      return;
    }

    if (!purchaseId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "purchases", purchaseId));
        if (cancelled) return;
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setPurchase(data);
          setStatus(data.status || "pending");
        } else {
          setPurchase(null);
        }
      } catch (error) {
        console.error("Error loading purchase:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [purchaseId, state?.purchase]);

  if (loading) {
    return (
      <p className="buyer-orders-empty" dir="rtl">
        טוענים את פרטי ההזמנה...
      </p>
    );
  }

  if (!purchase) {
    return (
      <div className="buyer-orders-empty-card" dir="rtl">
        <h2>לא נמצאה הזמנה</h2>
        <p>חזרו לרשימת ההזמנות ונסו שוב.</p>
        <Link to="/my-purchases" className="buyer-orders-cta">
          להזמנות שלי
        </Link>
      </div>
    );
  }

  const journeyIndex = getPurchaseJourneyIndex(status);
  const currentStep = getPurchaseJourneyStep(status);
  const isCancelled = status === PURCHASE_STATUS.CANCEL;
  const contact = purchase.contactDetails || {};

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setSaving(true);
    try {
      await updateDoc(doc(db, "purchases", purchase.id), { status: newStatus });
      setStatus(newStatus);
      setPurchase((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("שגיאה בעדכון הסטטוס");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="buyer-order-detail" dir="rtl">
      <button
        type="button"
        className="buyer-back"
        onClick={() => navigate("/my-purchases")}
      >
        <FontAwesomeIcon icon={faArrowRight} />
        חזרה להזמנות
      </button>

      <section className="buyer-detail-hero">
        <div className="buyer-orders-hero-glow" aria-hidden="true" />
        <p className="buyer-orders-brand">Petzo</p>
        <p className="buyer-orders-kicker">החוויה של ההזמנה</p>
        <h1>
          {currentStep?.storyTitle || getPurchaseStatusLabel(status)}
        </h1>
        <p className="buyer-detail-meta">
          {currentStep?.storyBody || getPurchaseStatusHint(status)}
        </p>
        <p className="buyer-detail-meta buyer-detail-meta--soft">
          הזמנה #{String(purchase.id).slice(0, 8)}
          {" · "}
          {formatPurchaseDate(purchase.purchasedAt)}
          {" · "}
          {purchase.totalQuantity || 0} פריטים
          {" · "}
          {formatPrice(purchase.totalPrice)}
        </p>
        <span
          className={`buyer-order-status buyer-order-status--${status || "pending"}`}
        >
          {getPurchaseStatusLabel(status)}
        </span>
      </section>

      {!isCancelled ? (
        <section className="buyer-journey" aria-label="מסלול החוויה עד הבית">
          <h2>
            <FontAwesomeIcon icon={faTruckFast} />
            המסע עד הדלת
          </h2>
          <ol className="buyer-journey-steps">
            {PURCHASE_JOURNEY_STEPS.map((step, index) => {
              const done = index < journeyIndex;
              const current = index === journeyIndex;
              return (
                <li
                  key={step.id}
                  className={`${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
                >
                  <span className="buyer-journey-dot">
                    {done || current ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <strong>{step.storyTitle || step.label}</strong>
                    <p>{current ? getPurchaseStatusHint(status) : step.storyBody}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {status === PURCHASE_STATUS.DELIVERED && (
            <p className="buyer-journey-home">
              <FontAwesomeIcon icon={faHouseChimney} />
              החוויה הושלמה — תודה שקניתם ב־Petzo
            </p>
          )}
        </section>
      ) : (
        <section className="buyer-journey buyer-journey--cancelled">
          <h2>ההזמנה בוטלה</h2>
          <p>{getPurchaseStatusHint(PURCHASE_STATUS.CANCEL)}</p>
        </section>
      )}

      {currentUser?.isAdmin && (
        <section className="buyer-admin-panel">
          <h2>ניהול סטטוס (מנהל)</h2>
          <label htmlFor="purchase-status">עדכון סטטוס ללקוח</label>
          <select
            id="purchase-status"
            value={status}
            onChange={handleStatusChange}
            disabled={saving}
          >
            {Object.entries(PURCHASE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {(contact.firstName || contact.phone || contact.city) && (
            <div className="buyer-shipping-block">
              <h3>פרטי משלוח</h3>
              <p>
                {[contact.firstName, contact.lastName].filter(Boolean).join(" ")}
              </p>
              {contact.phone && <p>{contact.phone}</p>}
              {purchase.email && <p>{purchase.email}</p>}
              <p>
                {[contact.address, contact.apartment, contact.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {purchase.paymentMethodLabel && (
                <p>תשלום: {purchase.paymentMethodLabel}</p>
              )}
              {purchase.notes && <p>הערות: {purchase.notes}</p>}
            </div>
          )}
        </section>
      )}

      {!currentUser?.isAdmin && (contact.city || contact.address) && (
        <section className="buyer-shipping-block">
          <h2>כתובת למשלוח</h2>
          <p>
            {[contact.address, contact.apartment, contact.city]
              .filter(Boolean)
              .join(", ")}
          </p>
          {purchase.paymentMethodLabel && (
            <p>תשלום: {purchase.paymentMethodLabel}</p>
          )}
        </section>
      )}

      <section className="buyer-items">
        <h2>פריטים בהזמנה</h2>
        <div className="buyer-items-grid">
          {(purchase.items || []).map((item, idx) => (
            <article className="buyer-item-card" key={`${item.id || item.title}-${idx}`}>
              <img
                src={item.photos?.[0] || item.image || require("@/assets/no-image.jpg")}
                alt={item.title || "מוצר"}
              />
              <div>
                <h3>{item.title || "מוצר"}</h3>
                <p>
                  {formatPrice(item.price)} × {item.quantity || 1}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="buyer-detail-actions">
        <Link to="/our-products" className="buyer-orders-cta">
          המשך לקנות בחנות
        </Link>
      </div>
    </div>
  );
};

export default PurchaseDetails;
