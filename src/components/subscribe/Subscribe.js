import React from 'react';
import './Subscribe.css';
import { useAuth } from '../context/AuthProvider';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const Subscribe = () => {
    const { currentUser, setCurrentUser } = useAuth();

    const subscriptions = [
        { id: 1, title: "פרסום אחד בלבד לחודש", description: "פרסום מודעה אחת למשך חודש", cost: 50 },
        { id: 2, title: "שתי פרסומים לחודש", description: "פרסום שתי מודעות כל אחת למשך חודש", cost: 90 },
        { id: 3, title: "ארבעה פרסומים לחודש", description: "פרסום 4 מודעות כל אחת למשך חודש", cost: 140 },
        { id: 4, title: "מנוי חודשי עד 10 פרסומים לחודש", description: "תשלום חודשי קבוע ובו אתה מקבל כל חודש עד 10 פרסומים", cost: 300 },
        { id: 5, title: "מנוי שנתי ללא הגבלה", description: "תשלום שנתי קבוע ובו אתה מפרסם ללא הגבלה", cost: 1500 },
    ];

    const handleSubscriptionClick = async (subscription) => {
        const date = new Date();

        switch (subscription.id) {
            case 1:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isSubscribed: true,
                    typeOfSubscription: "single",
                    numberOfAds: increment(1)
                })
                break;

            case 2:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isSubscribed: true,
                    typeOfSubscription: "single",
                    numberOfAds: increment(2)
                })
                break;

            case 3:
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isSubscribed: true,
                    typeOfSubscription: "single",
                    numberOfAds: increment(4)
                })
                break;

            case 4:
                date.setMonth(date.getMonth() + 1);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isSubscribed: true,
                    typeOfSubscription: "monthly",
                    subscribedUntil: date,
                    numberOfAds: 10
                })
                break;

            case 5:
                date.setFullYear(date.getFullYear() + 1);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isSubscribed: true,
                    typeOfSubscription: "yearly",
                    subscribedUntil: date,
                    numberOfAds: Number.MAX_VALUE
                })
                break;
            default:
                break;
        }
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setCurrentUser({ uid: currentUser.uid, ...userDoc.data() });
    };

    return (
        <div className="subscribe-container" style={{ textAlign: 'right' }}>
            <h1>מנויים</h1>
            <div className="subscription-cards">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="subscription-card">
                        <h3>{sub.title}</h3>
                        <p>{sub.description}</p>
                        <p className='subscription-price'>עלות: ₪{sub.cost} </p>
                        <button
                            className="subscribe-button"
                            onClick={() => handleSubscriptionClick(sub)}
                        >
                            בחר
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscribe;
