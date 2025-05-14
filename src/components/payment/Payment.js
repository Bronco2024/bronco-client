import React, { useState, useEffect, useRef } from 'react';
import './Payment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from '@/context/AuthProvider';
import Modal from '@components/utils/modal/Modal';
import axios from 'axios';


const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useAuth();
    const { plan } = location.state || {};
    const [showModal, setShowModal] = useState(false);
    const [paymentWindow, setPaymentWindow] = useState(null);
    const windowCheckIntervalRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        if (paymentWindow && paymentWindow.closed) {
          clearInterval(windowCheckIntervalRef.current);
        }
      }, [paymentWindow]);

    if (!plan) {
        return <p>No plan selected. Please go back and choose a subscription plan.</p>;
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/');
    };

    const updateSubscrptionInFirebase = async () => {
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



    const createPaymentGrowAPI = async () => {
        console.log(formData)
        console.log(plan)
        updateSubscrptionInFirebase()
        return;

        try{
            const response = await axios.post(`http://localhost:3456/payment/createPayment`, {
                fullName: formData.firstName + " " + formData.lastName,
                phone: formData.phone,
                email: formData.email,
                sum: plan.cost
            });

            if (response.data.err) {
                console.error(response.data.err.message);
                return;
            }

            const paymentUrl = response.data.data.url;
            const processId = response.data.data.processId;
            const processToken = response.data.data.processToken;

            const newWindow = window.open(paymentUrl);
            setPaymentWindow(newWindow);

            windowCheckIntervalRef.current = setInterval(() => {
                if (newWindow.closed) {
                    clearInterval(windowCheckIntervalRef.current);
                    handlePaymentWindowClosed(processId, processToken);
                }
            }, 1000);
        }catch(error){
            alert(error);
        }
    }

    const handlePaymentWindowClosed = async (processId, processToken) => {
        try {
            const response = await axios.get(`http://localhost:3456/payment/status`, {
                params: {
                    processId,
                    processToken
                }
            });

            if (response.data === true) {
                updateSubscrptionInFirebase();
                navigate('/subscribe/payment/thank-you');
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            alert('Error checking payment status. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        createPaymentGrowAPI();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="payment-container">
            <h1>תשלום</h1>
            <div className="plan-details">
                <h2>{plan.title}</h2>
                <p>{plan.description}</p>
                <p className="plan-cost">עלות: ₪{plan.cost}</p>
            </div>

            <div className='contact-info-container'>
                <form onSubmit={handleSubmit} className="contact-payment-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor='lastName'>שם משפחה</label>
                            <input
                                id='lastName'
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor='firstName'>שם פרטי</label>
                            <input
                                id='firstName'
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor='email'>מייל</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor='phone'>מספר טלפון</label>
                    <input
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <div className="button-container">
                        <button type="submit" className="pay-button">
                            <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: "8px" }} />
                            תשלום
                        </button>
                    </div>
                </form>

            </div>

            {/* <Modal isVisible={showModal} title="בוצע בהצלחה" onClose={closeModal}>
                <div className="modal-content-payment">
                    <p>תשלום בוצע בהצלחה!</p>
                    <div className="modal-buttons-payment">
                        <button className="close-button-payment" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal> */}

        </div>
    );
};

export default Payment;
