import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Your Firebase init file
import './MyPurchases.css'

const MyPurchases = () => {
    const { currentUser } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const fetchPurchases = async () => {
            try {
                const q = query(collection(db, 'purchases'), where('userId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchases(data);
            } catch (error) {
                console.error("Error fetching purchases:", error);
            }
        };

        fetchPurchases();
    }, [currentUser]);

    const handleClick = (purchase) => {
        navigate(`/purchase/${purchase.id}`, { state: { purchase } });
    };

    const purchasedAtDate = (purchasedAt) => {
        return purchasedAt
            ? new Date(purchasedAt.seconds * 1000)
            : null;
    }

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
        <div className="purchases-page">
            <h2><FontAwesomeIcon icon={faShoppingCart} /> הרכישות שלי</h2>
            {purchases.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>לא נמצאו רכישות להצגה</p>
            ) : (
                <ul className="purchase-list">
                    {purchases.map((purchase) => (
                        <li key={purchase.id} onClick={() => handleClick(purchase)} className="purchase-item">
                            <div>תאריך: {purchasedAtDate(purchase.purchasedAt)?.toLocaleDateString('en-GB')}</div>
                            <div>סכום כולל: ₪{purchase.totalPrice}</div>
                            <div>פריטים: {purchase.totalQuantity}</div>
                            <div>סטטוס: {extractStatus(purchase.status)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPurchases;
