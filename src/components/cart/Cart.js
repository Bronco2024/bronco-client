import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faMinus,
  faPlus,
  faTrash,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthProvider";
import { updateUserCart } from "@/helpers/firebase-helpers";
import { toCartProduct } from "@/helpers/cart-helpers";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/redux/cartSlice";
import "./Cart.css";

const formatPrice = (price) =>
  `₪${Number(price || 0).toLocaleString("he-IL")}`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { currentUser } = useAuth();

  const persist = async (nextItems) => {
    if (!currentUser?.uid) return;
    await updateUserCart(
      currentUser.uid,
      nextItems.map((item) => ({
        ...toCartProduct(item),
        quantity: item.quantity,
      }))
    );
  };

  const handleRemoveItem = async (itemId) => {
    const nextItems = items.filter((item) => item.id !== itemId);
    dispatch(removeItem(itemId));
    await persist(nextItems);
  };

  const handleIncrease = async (itemId) => {
    dispatch(increaseQuantity(itemId));
    const nextItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    await persist(nextItems);
  };

  const handleDecrease = async (itemId) => {
    dispatch(decreaseQuantity(itemId));
    const nextItems = items
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    await persist(nextItems);
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
    await persist([]);
  };

  const handleCheckout = () => {
    navigate("/cart/checkout");
  };

  return (
    <div className="cart-page" dir="rtl">
      <div className="cart-page-header">
        <div>
          <p className="cart-kicker">הזמנה ומשלוח</p>
          <h1>העגלה שלי</h1>
        </div>
        <Link to="/our-products" className="cart-back">
          <FontAwesomeIcon icon={faArrowRight} />
          חזרה לחנות
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty-box">
          <p>העגלה ריקה כרגע.</p>
          <Link to="/our-products" className="cart-primary">
            לכל המוצרים
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-row">
                <img
                  src={item.photos?.[0] || require("@/assets/no-image.jpg")}
                  alt={item.title}
                  className="cart-thumb"
                />
                <div className="cart-row-info">
                  <h2>{item.title}</h2>
                  <p>{formatPrice(item.price)} ליחידה</p>
                  <div className="cart-row-controls">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item.id)}
                      aria-label="הפחת"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item.id)}
                      aria-label="הוסף"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      הסר
                    </button>
                  </div>
                </div>
                <strong className="cart-row-total">
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </li>
            ))}
          </ul>

          <aside className="cart-summary-card">
            <h2>סיכום הזמנה</h2>
            <p>
              <span>פריטים</span>
              <strong>{totalQuantity}</strong>
            </p>
            <p>
              <span>סה״כ לתשלום במסירה</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </p>
            <p className="cart-delivery-note">
              <FontAwesomeIcon icon={faTruck} />
              משלוח עד הבית · תשלום במסירה
            </p>
            <button type="button" className="cart-primary" onClick={handleCheckout}>
              המשך למשלוח
            </button>
            <button type="button" className="cart-clear" onClick={handleClearCart}>
              נקה עגלה
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
