import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faFilter,
  faPhone,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  formatPurchaseDate,
  getNextPurchaseStatus,
  getNextPurchaseStatusLabel,
  getPurchaseBuyerName,
  getPurchaseStatusLabel,
  isPurchaseInProgress,
  PURCHASE_STATUS,
} from "@/helpers/purchase-status";
import "./AllPurchases.css";

const FILTERS = [
  { id: "open", label: "בטיפול" },
  { id: "all", label: "הכל" },
  { id: "delivered", label: "הגיעו" },
  { id: "cancel", label: "בוטלו" },
];

const AllPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("open");
  const [updatingId, setUpdatingId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchAllPurchases = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "purchases"),
          orderBy("purchasedAt", sortDirection)
        );
        const snapshot = await getDocs(q);
        if (cancelled) return;
        setPurchases(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching all purchases:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllPurchases();
    return () => {
      cancelled = true;
    };
  }, [sortDirection]);

  const visible = useMemo(() => {
    return purchases.filter((purchase) => {
      const status = purchase.status || PURCHASE_STATUS.PENDING;
      if (filter === "open") return isPurchaseInProgress(status);
      if (filter === "delivered") return status === PURCHASE_STATUS.DELIVERED;
      if (filter === "cancel") return status === PURCHASE_STATUS.CANCEL;
      return true;
    });
  }, [purchases, filter]);

  const openCount = useMemo(
    () =>
      purchases.filter((purchase) =>
        isPurchaseInProgress(purchase.status || PURCHASE_STATUS.PENDING)
      ).length,
    [purchases]
  );

  const handleClick = (purchase) => {
    navigate(`/purchase/${purchase.id}`, { state: { purchase } });
  };

  const advanceStatus = async (event, purchase) => {
    event.stopPropagation();
    const next = getNextPurchaseStatus(purchase.status);
    if (!next) return;
    setUpdatingId(purchase.id);
    try {
      await updateDoc(doc(db, "purchases", purchase.id), {
        status: next,
        statusUpdatedAt: serverTimestamp(),
      });
      setPurchases((prev) =>
        prev.map((item) =>
          item.id === purchase.id ? { ...item, status: next } : item
        )
      );
    } catch (error) {
      console.error("Error advancing purchase status:", error);
      alert("שגיאה בעדכון הסטטוס");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="all-purchases-page" dir="rtl">
      <header className="all-purchases-header">
        <p className="all-purchases-brand">Petzo</p>
        <h1>
          <FontAwesomeIcon icon={faClipboardList} />
          הזמנות החנות
        </h1>
        <p>
          {openCount > 0
            ? `${openCount} הזמנות בטיפול — עדכנו סטטוס והלקוח רואה את זה מיד`
            : "אין הזמנות פתוחות כרגע"}
        </p>
        <Link to="/admin" className="all-purchases-back">
          חזרה לניהול
        </Link>
      </header>

      <div className="all-purchases-toolbar">
        <label className="all-purchases-filter">
          <FontAwesomeIcon icon={faFilter} />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="סינון הזמנות"
          >
            {FILTERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <select
          className="select-type"
          value={sortDirection}
          onChange={(event) => setSortDirection(event.target.value)}
          aria-label="מיון"
        >
          <option value="desc">החדשות ביותר</option>
          <option value="asc">הישנות ביותר</option>
        </select>
      </div>

      {loading ? (
        <p className="all-purchases-empty">טוענים הזמנות...</p>
      ) : visible.length === 0 ? (
        <p className="all-purchases-empty">לא נמצאו הזמנות להצגה</p>
      ) : (
        <ul className="all-purchase-list">
          {visible.map((purchase) => {
            const status = purchase.status || PURCHASE_STATUS.PENDING;
            const contact = purchase.contactDetails || {};
            const nextLabel = getNextPurchaseStatusLabel(status);
            const busy = updatingId === purchase.id;

            return (
              <li key={purchase.id} className="all-purchase-item">
                <button
                  type="button"
                  className="all-purchase-main"
                  onClick={() => handleClick(purchase)}
                >
                  <div className="all-purchase-top">
                    <strong>{getPurchaseBuyerName(purchase)}</strong>
                    <span
                      className={`buyer-order-status buyer-order-status--${status}`}
                    >
                      {getPurchaseStatusLabel(status)}
                    </span>
                  </div>
                  <div className="all-purchase-meta">
                    <span>{formatPurchaseDate(purchase.purchasedAt)}</span>
                    <span>
                      {purchase.totalQuantity || 0} פריטים · ₪
                      {Number(purchase.totalPrice || 0).toLocaleString("he-IL")}
                    </span>
                    {purchase.paymentMethodLabel && (
                      <span>{purchase.paymentMethodLabel}</span>
                    )}
                    {contact.city && <span>{contact.city}</span>}
                  </div>
                  {(contact.phone || purchase.email) && (
                    <div className="all-purchase-contact">
                      {contact.phone && (
                        <span>
                          <FontAwesomeIcon icon={faPhone} /> {contact.phone}
                        </span>
                      )}
                      {purchase.email && <span>{purchase.email}</span>}
                    </div>
                  )}
                </button>
                {nextLabel && (
                  <button
                    type="button"
                    className="all-purchase-advance"
                    disabled={busy}
                    onClick={(event) => advanceStatus(event, purchase)}
                  >
                    <FontAwesomeIcon icon={faTruckFast} />
                    {busy ? "מעדכן..." : `הבא: ${nextLabel}`}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AllPurchases;
