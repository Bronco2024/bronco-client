import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userAds, setUserAds] = useState([]);

    useEffect(() => {
        const fetchUserAds = async () => {
            if (!currentUser) return;

            const adsCollection = collection(db, 'ads');
            const q = query(adsCollection, where("userId", "==", currentUser.uid));

            try {
                const querySnapshot = await getDocs(q);
                const ads = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserAds(ads);
            } catch (error) {
                console.error("Error fetching user ads:", error);
            }
        };

        fetchUserAds();
    }, [currentUser]);

    const numberOfAds = (currentUser) => {
        if (currentUser?.numberOfAds > 1000) {
            return "ללא הגבלה";
        }
        return currentUser?.numberOfAds;
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('he-IL');
        }
        return '';
    };

    return (
        <div className="profile-container">
            <h1>ברוך הבא לאזור האישי</h1>

            {currentUser?.isSubscribed === false
                ? <p>לא רשום</p>
                : <p>מספר מודעות שנותרו לך: {numberOfAds(currentUser)}</p>
            }

            <button onClick={() => navigate('/subscribe')} className="subscribe-button-profile">קניית מודעות</button>

            <div className="ads-container">
                <h3>המודעות שלך</h3>
                {userAds.length > 0 ? (
                    userAds.map(ad => (
                        <div key={ad.id} className="ad-card1">
                            {ad.photos && ad.photos[0] && (
                                <img src={ad.photos[0]} alt={ad.title} className="ad-image-profile" />
                            )}
                            <div className="ad-details">
                                <h4 className="ad-title-profile">{ad.title}</h4>
                                <p>{ad.description}</p>
                                <p className="ad-price-profile">₪{ad.price}</p>
                                <small>תקף עד: {formatDate(ad?.availableUntil)}</small>
                            </div>

                            <div className='ad-crud'>
                                <button className='ad-delete-button'>מחק</button>
                                <button className='ad-update-button'>עדכן</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>לא נמצאו מודעות</p>
                )}
            </div>
        </div>
    );
};

export default Profile;