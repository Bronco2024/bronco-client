import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTruck } from '@fortawesome/free-solid-svg-icons';
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

import { useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import './PaymentForm.css'; // Create this CSS file with the styles below

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { items, totalQuantity, totalPrice } = location.state || {};
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        console.log(items)
        console.log(totalQuantity)
        console.log(totalPrice)
        console.log(currentUser)

        const purchase = {
            userId: currentUser?.uid || null,
            email: formData.email,
            contactDetails: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
            },
            items: items || [],
            totalQuantity,
            totalPrice,
            purchasedAt: serverTimestamp(),
            status: 'pending'
        };

        try {
            await addDoc(collection(db, "purchases"), purchase);
            await handleClearCart();
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
            });
            navigate('/subscribe/payment/thank-you');
        } catch (error) {
            console.error("Error adding purchase: ", error);
            alert("הייתה שגיאה. נסה שוב.");
        }
    };

    const handleClearCart = async () => {
        if (!currentUser) return;
    
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          cart: []
        });
    
        dispatch(clearCart());
      };

    return (
        <div className="cart-container">
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <FontAwesomeIcon icon={faTruck} />
                פרטי משלוח
                <FontAwesomeIcon icon={faTruck} />
            </h2>
            <form className="payment-form" onSubmit={handleSubmit}>
                <div className="name-row">
                    <div className="form-group">
                        <label htmlFor="firstName">שם פרטי</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">שם משפחה</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="email">אימייל</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="name-row">

                    <div className="form-group">
                        <label htmlFor="phone">טלפון</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">כתובת</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="button-container">
                    <button className="pay-button" type='submit'>
                        <FontAwesomeIcon icon={faCreditCard} style={{ marginLeft: "8px" }} />
                        לתשלום
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
