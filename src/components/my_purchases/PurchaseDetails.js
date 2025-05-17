// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import './MyPurchases.css';

// const PurchaseDetails = () => {
//     const { state } = useLocation();
//     const purchase = state?.purchase;

//     if (!purchase) {
//         return <p style={{ textAlign: 'center' }}>לא נמצאה הזמנה להצגה.</p>;
//     }

//     const purchasedAtDate = (purchasedAt) => {
//         return purchasedAt
//             ? new Date(purchasedAt.seconds * 1000)
//             : null;
//     }

//     return (
//         <div className="purchase-details">
//             <h2>פרטי הזמנה</h2>
//             <p>סה"כ פריטים: {purchase.totalQuantity}</p>
//             <p>סה"כ מחיר: ₪{purchase.totalPrice}</p>
//             <p>תאריך: {purchasedAtDate(purchase.purchasedAt).toLocaleDateString('en-GB')}</p>

//             <h3>פריטים</h3>
//             <div className="items-grid">
//                 {purchase.items.map((item, idx) => (
//                     <div className="item-card" key={idx}>
//                         <img
//                             src={item.photos?.[0] || require('@/assets/no-image.jpg')}
//                             alt={item.title}
//                             className="item-image"
//                         />
//                         <div className="item-info">
//                             <p className="item-title">{item.title}</p>
//                             <p>₪{item.price} × {item.quantity}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PurchaseDetails;


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthProvider';
import './MyPurchases.css';

const PurchaseDetails = () => {
    const { currentUser } = useAuth();
    const { state } = useLocation();
    const purchase = state?.purchase;

    const [status, setStatus] = useState(purchase?.status || 'pending');

    if (!purchase) {
        return <p style={{ textAlign: 'center' }}>לא נמצאה הזמנה להצגה.</p>;
    }

    const purchasedAtDate = (purchasedAt) => {
        return purchasedAt ? new Date(purchasedAt.seconds * 1000) : null;
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        try {
            const docRef = doc(db, 'purchases', purchase.id);
            await updateDoc(docRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert('שגיאה בעדכון הסטטוס');
        }
    };

    const extractStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'ממתין לאישור';
            case 'confirmed':
                return 'מאושר';
            case 'sent':
                return 'נשלח';
            case 'cancel':
                return 'בוטל';
            default:
                return 'אירעה שגיאה';
        }
    }

    return (
        <div className="purchase-details">
            <h2>פרטי הזמנה</h2>
            <p>סה"כ פריטים: {purchase.totalQuantity}</p>
            <p>סה"כ מחיר: ₪{purchase.totalPrice}</p>
            <p>תאריך: {purchasedAtDate(purchase.purchasedAt).toLocaleDateString('en-GB')}</p>
            <p>סטטוס: 
                {currentUser?.isAdmin ? (
                    <select value={status} onChange={handleStatusChange}>
                        <option value="pending">ממתין לאישור</option>
                        <option value="confirmed">מאושר</option>
                        <option value="sent">נשלח</option>
                        <option value="cancel">בוטל</option>
                    </select>
                ) : (
                    <span> {extractStatus(status)} </span>
                )}
            </p>

            {currentUser?.isAdmin && purchase.contactDetails && (
                <div className="contact-details">
                    <h3>פרטי יצירת קשר</h3>
                    <p>שם: {purchase.contactDetails.firstName + ' ' + purchase.contactDetails.lastName}</p>
                    <p>טלפון: {purchase.contactDetails.phone}</p>
                    <p>אימייל: {purchase.email}</p>
                    <p>כתובת: {purchase.contactDetails.address}</p>
                </div>
            )}

            <h3>פריטים</h3>
            <div className="items-grid">
                {purchase.items.map((item, idx) => (
                    <div className="item-card" key={idx}>
                        <img
                            src={item.photos?.[0] || require('@/assets/no-image.jpg')}
                            alt={item.title}
                            className="item-image"
                        />
                        <div className="item-info">
                            <p className="item-title">{item.title}</p>
                            <p>₪{item.price} × {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PurchaseDetails;
