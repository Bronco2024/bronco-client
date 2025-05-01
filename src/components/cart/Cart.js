import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '@/redux/cartSlice';
import './Cart.css';

const Cart = () => {
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  
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
            <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
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
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  הסר
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Cart;
