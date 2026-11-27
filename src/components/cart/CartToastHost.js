import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { CART_ADDED_EVENT } from "@/helpers/cart-toast";
import "./CartToastHost.css";

const HIDE_MS = 1800;

const CartToastHost = () => {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer;
    let clearTimer;

    const onAdded = (event) => {
      const detail = event?.detail || {};
      const quantity = Number(detail.quantity) > 0 ? Number(detail.quantity) : 1;
      const title = String(detail.title || "").trim();
      setToast({
        title,
        quantity,
        key: Date.now(),
      });
      setVisible(true);
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
      hideTimer = window.setTimeout(() => setVisible(false), HIDE_MS);
      clearTimer = window.setTimeout(() => setToast(null), HIDE_MS + 280);
    };

    window.addEventListener(CART_ADDED_EVENT, onAdded);
    return () => {
      window.removeEventListener(CART_ADDED_EVENT, onAdded);
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
    };
  }, []);

  if (!toast) return null;

  const line =
    toast.quantity > 1
      ? `נוסף לעגלה ×${toast.quantity}`
      : "נוסף לעגלה";

  return (
    <div
      className={`cart-toast-host ${visible ? "is-visible" : ""}`}
      role="status"
      aria-live="polite"
      dir="rtl"
    >
      <div className="cart-toast-card" key={toast.key}>
        <span className="cart-toast-icon" aria-hidden="true">
          <FontAwesomeIcon icon={faCartPlus} />
        </span>
        <div>
          <strong>{line}</strong>
          {toast.title ? <p>{toast.title}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default CartToastHost;
