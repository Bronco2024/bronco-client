import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTruck } from "@fortawesome/free-solid-svg-icons";
import { ORDER_PAYMENT_LABELS } from "@/helpers/store-orders";
import "./ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state || {};
  const isStoreOrder = Boolean(order.orderId || order.paymentMethod);

  return (
    <div className="thank-you-container" dir="rtl">
      <div className="thank-you-content">
        <FontAwesomeIcon icon={faCheckCircle} className="thank-you-icon" />
        <h1>ההזמנה התקבלה!</h1>
        {isStoreOrder ? (
          <>
            <p>
              תודה על ההזמנה. נאשר אותה ונודיע לכם כשהמשלוח בדרך אליכם.
            </p>
            <p className="thank-you-meta">
              <FontAwesomeIcon icon={faTruck} />
              משלוח עד הבית
              {order.city ? ` · ${order.city}` : ""}
              {" · "}
              {ORDER_PAYMENT_LABELS[order.paymentMethod] || "תשלום במסירה"}
            </p>
            {order.totalPrice != null && (
              <p className="thank-you-total">
                סה״כ לתשלום במסירה: ₪
                {Number(order.totalPrice).toLocaleString("he-IL")}
              </p>
            )}
          </>
        ) : (
          <p>תודה! נשמח לראותכם שוב בחנות.</p>
        )}

        <div className="button-container">
          <button type="button" onClick={() => navigate("/my-purchases")}>
            ההזמנות שלי
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
