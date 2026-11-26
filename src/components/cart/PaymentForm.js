import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCreditCard,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthProvider";
import { db } from "@/firebase";
import { clearCart } from "@/redux/cartSlice";
import { updateUserCart } from "@/helpers/firebase-helpers";
import {
  buildStoreOrderPayload,
  createStoreOrder,
  ORDER_PAYMENT_METHODS,
} from "@/helpers/store-orders";
import { startOnlineStorePayment } from "@/helpers/store-payment-client";
import { PET_LOCATIONS } from "@/data/pets";
import "./PaymentForm.css";

const PaymentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    ORDER_PAYMENT_METHODS.ONLINE
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: currentUser?.email || "",
    phone: "",
    city: "",
    address: "",
    apartment: "",
    notes: "",
  });

  const cities = useMemo(
    () => [...PET_LOCATIONS].sort((a, b) => a.localeCompare(b, "he")),
    []
  );

  useEffect(() => {
    if (searchParams.get("cancelled") === "1") {
      setError("התשלום בוטל. אפשר לנסות שוב או לבחור תשלום במסירה.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!items.length) {
      setError("העגלה ריקה.");
      return;
    }

    if (!formData.city.trim() || !formData.address.trim()) {
      setError("נא למלא עיר וכתובת למשלוח.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildStoreOrderPayload({
        userId: currentUser?.uid,
        contactDetails: formData,
        items,
        paymentMethod,
        notes: formData.notes,
      });
      const orderId = await createStoreOrder(db, payload);

      if (paymentMethod === ORDER_PAYMENT_METHODS.ONLINE) {
        const payment = await startOnlineStorePayment(orderId);
        if (payment.alreadyPaid && payment.redirectUrl) {
          await updateUserCart(currentUser.uid, []);
          dispatch(clearCart());
          window.location.assign(payment.redirectUrl);
          return;
        }
        if (!payment.url) {
          throw new Error("לא התקבלה כתובת תשלום");
        }
        // Keep cart until payment completes — webhook/thank-you clear it.
        window.location.assign(payment.url);
        return;
      }

      await updateUserCart(currentUser.uid, []);
      dispatch(clearCart());
      navigate("/order/thank-you", {
        state: {
          orderId,
          totalPrice: payload.totalPrice,
          totalQuantity: payload.totalQuantity,
          city: formData.city,
          paymentMethod,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Error creating store order/payment:", err);
      if (err.code === "grow_not_configured") {
        setError(
          "תשלום באתר עדיין לא הוגדר אצל הספק. אפשר לבחור תשלום במסירה, או להוסיף מפתחות Grow ב-Netlify."
        );
      } else {
        setError(err.message || "לא הצלחנו להשלים את ההזמנה. נסו שוב.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="checkout-page" dir="rtl">
        <div className="checkout-empty">
          <h1>אין פריטים לתשלום</h1>
          <Link to="/our-products">חזרה לחנות</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" dir="rtl">
      <div className="checkout-header">
        <div>
          <p className="checkout-kicker">שלב אחרון</p>
          <h1>
            <FontAwesomeIcon icon={faTruck} />
            משלוח ותשלום
          </h1>
        </div>
        <Link to="/cart" className="checkout-back">
          <FontAwesomeIcon icon={faArrowRight} />
          חזרה לעגלה
        </Link>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-row">
            <label>
              שם פרטי
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </label>
            <label>
              שם משפחה
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </label>
          </div>

          <div className="checkout-row">
            <label>
              אימייל
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>
            <label>
              טלפון
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </label>
          </div>

          <label>
            עיר
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">בחרו עיר</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label>
            רחוב ומספר בית
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              autoComplete="street-address"
              placeholder="לדוגמה: הרצל 15"
            />
          </label>

          <label>
            דירה / קומה (אופציונלי)
            <input
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              placeholder="דירה 4"
            />
          </label>

          <label>
            הערות לשליח (אופציונלי)
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="קוד לבניין, שעות נוחות וכו׳"
            />
          </label>

          <fieldset className="checkout-payment-methods">
            <legend>אמצעי תשלום</legend>
            <label className="checkout-pay-option">
              <input
                type="radio"
                name="paymentMethod"
                value={ORDER_PAYMENT_METHODS.ONLINE}
                checked={paymentMethod === ORDER_PAYMENT_METHODS.ONLINE}
                onChange={() => setPaymentMethod(ORDER_PAYMENT_METHODS.ONLINE)}
              />
              <span>
                <strong>
                  <FontAwesomeIcon icon={faCreditCard} /> תשלום באתר
                </strong>
                <small>כרטיס אשראי / ביט דרך Grow — מאובטח</small>
              </span>
            </label>
            <label className="checkout-pay-option">
              <input
                type="radio"
                name="paymentMethod"
                value={ORDER_PAYMENT_METHODS.COD}
                checked={paymentMethod === ORDER_PAYMENT_METHODS.COD}
                onChange={() => setPaymentMethod(ORDER_PAYMENT_METHODS.COD)}
              />
              <span>
                <strong>
                  <FontAwesomeIcon icon={faTruck} /> תשלום במסירה
                </strong>
                <small>מזומן או ביט כשהשליח מגיע</small>
              </span>
            </label>
          </fieldset>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="checkout-submit" disabled={submitting}>
            {submitting
              ? "מעבד..."
              : paymentMethod === ORDER_PAYMENT_METHODS.ONLINE
                ? "המשך לתשלום מאובטח"
                : "אישור הזמנה ומשלוח"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>סיכום</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <strong>
                  ₪{(item.price * item.quantity).toLocaleString("he-IL")}
                </strong>
              </li>
            ))}
          </ul>
          <p className="checkout-total">
            <span>{totalQuantity} פריטים</span>
            <strong>₪{Number(totalPrice).toLocaleString("he-IL")}</strong>
          </p>
        </aside>
      </div>
    </div>
  );
};

export default PaymentForm;
