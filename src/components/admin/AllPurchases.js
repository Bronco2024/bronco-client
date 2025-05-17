// AllPurchases.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { query, collection, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import './AllPurchases.css'; // reuse same styles

const AllPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllPurchases = async () => {
            try {
                const q = query(
                    collection(db, 'purchases'),
                    orderBy('purchasedAt', 'asc') // oldest first
                  );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchases(data);
            } catch (error) {
                console.error('Error fetching all purchases:', error);
            }
        };

        fetchAllPurchases();
    }, []);

    const handleClick = (purchase) => {
        navigate(`/purchase/${purchase.id}`, { state: { purchase } });
    };

    const purchasedAtDate = (purchasedAt) => {
        return purchasedAt ? new Date(purchasedAt.seconds * 1000) : null;
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
        <div className="all-purchases-page">
            <h2><FontAwesomeIcon icon={faClipboardList} /> כל הרכישות</h2>
            {purchases.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
                    לא נמצאו רכישות להצגה
                </p>
            ) : (
                <ul className="all-purchase-list">
                    {purchases.map((purchase) => (
                        <li key={purchase.id} onClick={() => handleClick(purchase)} className="all-purchase-item">
                            <div>תאריך: {purchasedAtDate(purchase.purchasedAt)?.toLocaleDateString('en-GB')}</div>
                            <div>סכום כולל: ₪{purchase.totalPrice}</div>
                            <div>פריטים: {purchase.totalQuantity}</div>
                            <div>סטטוס: {extractStatus(purchase.status)}</div>
                            <div>משתמש: {purchase.contactDetails.firstName + ' ' + purchase.contactDetails.lastName}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AllPurchases;
