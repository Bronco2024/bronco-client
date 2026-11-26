import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCheckCircle,
  faCreditCard,
  faHouseChimney,
  faTruck,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useAuth } from "@/context/AuthProvider";
import { clearCart } from "@/redux/cartSlice";
import { updateUserCart } from "@/helpers/firebase-helpers";
import {
  ORDER_PAYMENT_LABELS,
  ORDER_PAYMENT_METHODS,
} from "@/helpers/store-orders";
import { fetchStorePaymentStatus } from "@/helpers/store-payment-client";
import { PURCHASE_JOURNEY_STEPS } from "@/helpers/purchase-status";
import "./ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const orderFromState = location.state || {};
  const orderId = searchParams.get("orderId") || orderFromState.orderId || "";
  const paidQuery = searchParams.get("paid") === "1";
  const [paymentStatus, setPaymentStatus] = useState(
    paidQuery ? "paid" : orderFromState.paymentMethod === ORDER_PAYMENT_METHODS.COD ? "cod" : ""
  );
  const [totalPrice, setTotalPrice] = useState(orderFromState.totalPrice);
  const [checking, setChecking] = useState(Boolean(orderId && paidQuery));

  useEffect(() => {
    let cancelled = false;

    const finishPaid = async () => {
      if (currentUser?.uid) {
        try {
          await updateUserCart(currentUser.uid, []);
        } catch (_error) {
          // non-blocking
        }
      }
      dispatch(clearCart());
    };

    const run = async () => {
      if (!orderId) {
        setChecking(false);
        return;
      }

      if (paidQuery || orderFromState.paymentMethod === ORDER_PAYMENT_METHODS.ONLINE) {
        try {
          const status = await fetchStorePaymentStatus(orderId);
          if (cancelled) return;
          setPaymentStatus(status.paymentStatus || (paidQuery ? "paid" : "pending"));
          if (status.totalPrice != null) setTotalPrice(status.totalPrice);
          if (status.paymentStatus === "paid" || paidQuery) {
            await finishPaid();
          }
        } catch (_error) {
          if (!cancelled && paidQuery) {
            setPaymentStatus("paid");
            await finishPaid();
          }
        }
      } else if (orderFromState.paymentMethod === ORDER_PAYMENT_METHODS.COD) {
        await finishPaid();
      }

      if (!cancelled) setChecking(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [
    orderId,
    paidQuery,
    currentUser?.uid,
    dispatch,
    orderFromState.paymentMethod,
  ]);

  const isPaid = paymentStatus === "paid" || paidQuery;
  const isCod =
    paymentStatus === "cod" ||
    orderFromState.paymentMethod === ORDER_PAYMENT_METHODS.COD;
  const paymentLabel = isPaid
    ? ORDER_PAYMENT_LABELS[ORDER_PAYMENT_METHODS.ONLINE]
    : isCod
      ? ORDER_PAYMENT_LABELS[ORDER_PAYMENT_METHODS.COD]
      : ORDER_PAYMENT_LABELS[orderFromState.paymentMethod] || "תשלום";

  return (
    <div className="thank-you-container" dir="rtl">
      <div className="thank-you-content">
        <p className="thank-you-brand">Petzo</p>
        <FontAwesomeIcon icon={faCheckCircle} className="thank-you-icon" />
        <h1>
          {checking
            ? "בודקים את התשלום..."
            : isPaid
              ? "החוויה התחילה!"
              : "קיבלנו את ההזמנה"}
        </h1>
        <p>
          {isPaid
            ? "תודה. עכשיו אנחנו אורזים — ותוכלו לעקוב עד שהמשלוח מגיע הביתה."
            : isCod
              ? "תודה. נאשר, נארוז, ונעדכן אתכם בכל שלב עד הדלת."
              : "אם סיימתם לשלם, הסטטוס יתעדכן תוך רגעים."}
        </p>
        <p className="thank-you-meta">
          <FontAwesomeIcon icon={isPaid ? faCreditCard : faTruck} />
          {isPaid ? " שולם באתר" : " משלוח עד הבית"}
          {orderFromState.city ? ` · ${orderFromState.city}` : ""}
          {" · "}
          {paymentLabel}
        </p>
        {totalPrice != null && (
          <p className="thank-you-total">
            סה״כ: ₪{Number(totalPrice).toLocaleString("he-IL")}
          </p>
        )}
        {orderId && (
          <p className="thank-you-meta">מספר הזמנה: {orderId}</p>
        )}

        <ol className="thank-you-journey" aria-label="מההזמנה עד הבית">
          {PURCHASE_JOURNEY_STEPS.map((step, index) => (
            <li key={step.id} className={index === 0 ? "is-active" : ""}>
              <span>
                <FontAwesomeIcon
                  icon={
                    index === 0
                      ? faBoxOpen
                      : index === 1
                        ? faTruck
                        : index === 2
                          ? faTruckFast
                          : faHouseChimney
                  }
                />
              </span>
              {step.shortLabel}
            </li>
          ))}
        </ol>
        <p className="thank-you-journey-note">
          אפשר לעקוב אחרי ההזמנה בכל רגע — עד שהמשלוח מגיע הביתה.
        </p>

        <div className="button-container">
          <button type="button" onClick={() => navigate("/my-purchases")}>
            מעקב הזמנות שלי
          </button>
          <Link to="/our-products" className="thank-you-secondary">
            חזרה לחנות
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
