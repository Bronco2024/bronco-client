import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '@/redux/cartSlice';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from "@/context/AuthProvider";
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const handleRemoveItem = async (itemId) => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    const updatedItems = items.filter(item => item.id !== itemId);

    await updateDoc(userDocRef, {
      cart: updatedItems
    });

    dispatch(removeItem(itemId));
  };

  const handleClearCart = async () => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      cart: []
    });

    dispatch(clearCart());
  };

  const handleSubmitCart = () => {
    navigate('/cart/payment-form', { state: { items: items, totalQuantity: totalQuantity, totalPrice: totalPrice } })
  }

  return (
    <div className="cart-container">
      <h2>עגלה מוצרים</h2>
      {items.length === 0 ? (
        <p className="cart-empty">העגלה שלך ריקה</p>
      ) : (
        <>
          <div className="cart-summary">
            <p>
              <strong>מספר פריטים:</strong> {totalQuantity}
            </p>
            <p>
              <strong>סכום כולל:</strong> ₪{totalPrice}
            </p>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              נקה את העגלה
            </button>
          </div>
          <ul className="cart-items">
            {items.map((item) => (
              <li className="cart-item" key={item.id}>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p>
                    מחיר: ₪{item.price} | כמות: {item.quantity}
                  </p>
                  <p>
                    סך הכל: <strong>₪{(item.price * item.quantity)}</strong>
                  </p>
                  <div className="item-images">
                    {item.photos && item.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`item-image-${index}`} className="item-image" />
                    ))}
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  הסר
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {items.length > 0 && (
        <div className="button-container">
          <button className="pay-button" type='submit' onClick={handleSubmitCart}>
            המשך
          </button>
        </div>
      )}

    </div>
  );
};

export default Cart;
