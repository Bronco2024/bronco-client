import React, { useState } from 'react';
import './Payment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from '../context/AuthProvider';
import Modal from '../utils/modal/Modal';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useAuth();
    const { plan } = location.state || {};
    const [showModal, setShowModal] = useState(false);

    if (!plan) {
        return <p>No plan selected. Please go back and choose a subscription plan.</p>;
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/');
    };

    const handlePayment = async () => {
        switch (plan.id) {
            case 1:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    numberOfAds: increment(1)
                })
                break;

            case 2:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    numberOfAds: increment(2)
                })
                break;

            case 3:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    numberOfAds: increment(4)
                })
                break;

            case 4:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    numberOfAds: 10
                })
                break;

            case 5:
                const date = new Date();
                date.setFullYear(date.getFullYear() + 1);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    subscribedUntil: date,
                    numberOfAds: Number.MAX_VALUE
                })
                break;
            default:
                break;
        }
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setCurrentUser({ uid: currentUser.uid, ...userDoc.data() });
        setShowModal(true);
    };

    return (
        <div className="payment-container">
            <h1>תשלום</h1>
            <div className="plan-details">
                <h2>{plan.title}</h2>
                <p>{plan.description}</p>
                <p className="plan-cost">עלות: ₪{plan.cost}</p>
            </div>
            <button className="pay-button" onClick={handlePayment}>
                <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} />
                תשלום
            </button>

            <Modal isVisible={showModal} title="בוצע בהצלחה" onClose={closeModal}>
                <div className="modal-content-payment">
                    <p>תשלום בוצע בהצלחה!</p>
                    <div className="modal-buttons-payment">
                        <button className="close-button-payment" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default Payment;
