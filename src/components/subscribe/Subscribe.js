import React, { useState } from 'react';
import './Subscribe.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Subscribe = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const subscriptions = [
        { id: 1, title: "פרסום אחד בלבד לחודש", description: "פרסום מודעה אחת למשך חודש", cost: 30 },
        { id: 2, title: "שתי פרסומות לחודש", description: "פרסום שתי מודעות כל אחת למשך חודש", cost: 50 },
        { id: 3, title: "ארבע פרסומות לחודש", description: "פרסום 4 מודעות כל אחת למשך חודש", cost: 90 },
        { id: 4, title: "עשר פרסומות לחודש", description: "פרסום 10 מודעות כל אחת למשך חודש", cost: 200 },
        { id: 5, title: "מנוי שנתי ללא הגבלה", description: "שלם פעם אחת ותוכל לפרסם ללא הגבלה למשך שנה", cost: 1000 },
    ];

    const handleSubscriptionClick = async (subscription) => {
        if (subscription.id === selectedPlan) {
            setSelectedPlan(null)
        }
        else {
            setSelectedPlan(subscription.id);
        }
    };

    const handleProceedToPayment = () => {
        const plan = subscriptions.find(plan => plan.id === selectedPlan);
        navigate('/subscribe/payment', { state: { plan } });
    };

    return (
        <div className="subscribe-container" style={{ textAlign: 'right' }}>
            <h1>מנויים</h1>
            <div className="subscription-cards">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className={`subscription-card ${selectedPlan === sub.id ? 'selected' : ''}`}>
                        <h3>{sub.title}</h3>
                        <p>{sub.description}</p>
                        <p className='subscription-price'>עלות: ₪{sub.cost} </p>
                        <button
                            className="subscribe-button"
                            onClick={() => handleSubscriptionClick(sub)}
                            style={{ backgroundColor: selectedPlan === sub.id ? '#28a745' : '#007bff' }}
                        >
                            {selectedPlan === sub.id ? (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} />
                                    נבחר
                                </>
                            ) : 'בחר'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <button className="proceed-button" onClick={handleProceedToPayment}>
                        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
                        המשך לתשלום
                    </button>
                </div>
            )}
        </div>
    );
};

export default Subscribe;
