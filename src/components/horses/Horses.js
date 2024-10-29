import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, where, query, getDocs } from 'firebase/firestore';
import './Horses.css'

const Horses = () => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const horsesCollectionRef = collection(db, 'ads');
                const q = query(horsesCollectionRef, where("category", "==", 'סוסים'));
                const querySnapshot = await getDocs(q);

                const fetchedAds = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAds(fetchedAds);
            } catch (error) {
                console.error("Error fetching horse ads:", error);
            }
        };

        fetchAds();
    }, []);

    return (
        <div className="horses-container">
        <h1 className="horses-title">סוסים</h1>
        <div className="ads-wrapper">
            {ads.length === 0 ? (
                <p>לא נמצאו מודעות בקטיגוריה זו</p>
            ) : (
                ads.map(ad => (
                    <div key={ad.id} className="ad-card">
                        {ad.photos && ad.photos[0] && (
                            <img src={ad.photos[0]} alt={ad.title} className="ad-image" />
                        )}
                        <h2 className="ad-title">{ad.title}</h2>
                        <p className="ad-price">Price: ₪{ad.price}</p>
                    </div>
                ))
            )}
        </div>
    </div>
    );
};

export default Horses;
