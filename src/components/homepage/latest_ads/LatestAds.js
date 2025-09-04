import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';
import './LatestAds.css';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import * as Sentry from "@sentry/react";

const NUMBER_OF_LATEST_ADS_TO_FETCH = 8;
const categories = ["סוסים", "זרע", "אביזרים"];

const LatestAds = () => {
    const navigate = useNavigate();
    const [latestAds, setLatestAds] = useState([])

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    useEffect(() => {
        const fetchLatestAds = async () => {
            try {

                const adsRef = collection(db, "ads");
                const q = query(
                    adsRef,
                    where("availableUntil", ">", new Date()),
                    where("category", "in", categories),
                    orderBy("createdAt", "desc"),
                    limit(NUMBER_OF_LATEST_ADS_TO_FETCH)
                );
                const querySnapshot = await getDocs(q);

                const ads = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLatestAds(ads);
            } catch (error) {
                console.error("Error fetching ads:", error);
                Sentry.captureException(`Error fetching ads`, {
                    tags: {
                        component: "LatestAds"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        fetchLatestAds();
    }, []);

    return (
        <div className='left-content'>
            <h2 className="ad-title-section">פורסמו לאחרונה</h2>
            <div className="ad-cards-container">
                {latestAds.map(ad => (
                    <div
                        key={ad.id}
                        className="ad-card-homepage"
                        style={{ borderColor: ad?.hasCertificate ? '#0064E0' : null, borderWidth: ad?.hasCertificate ? '2px' : null }}
                        onClick={() => handleClickOnItem(ad)}
                    >
                        {categories.includes(ad.category) && (
                            <div className="feature-icon-container-ads">
                                <div className="feature-icon-circle" data-tooltip={ad.category}>
                                    <img
                                        className="feature-icon-ads"
                                        src={
                                            ad.category === "סוסים"
                                                ? require('@/assets/aboutus/horse.png')
                                                : ad.category === "זרע"
                                                    ? require('@/assets/aboutus/sperm.png')
                                                    : ad.category === "אביזרים"
                                                        ? require('@/assets/aboutus/tool-box.png')
                                                        : null
                                        }
                                        alt="Feature icon"
                                        loading='lazy'
                                    />
                                </div>
                            </div>
                        )}

                        {ad.photos && ad.photos[0] && (
                            <img
                                src={ad.photos[0]}
                                alt={ad.category}
                                className="ad-image-homepage"
                                loading='lazy'
                            />
                        )}
                        {ad.photos.length === 0 && (
                            <img
                                src={require('@/assets/no-image.jpg')}
                                alt={ad.category}
                                className="ad-image-homepage"
                            />
                        )}
                        {ad.category === "סוסים" ? (
                            <h2 className="ad-title-homepage">{ad.breed}</h2>
                        ) : ad.category === "זרע" ? (
                            <h2 className="ad-title-homepage">{ad.seed_type}</h2>
                        ) : ad.category === "אביזרים" ? (
                            <h2 className="ad-title-homepage">{ad.accessory}</h2>
                        ) : (
                            <h2 className="ad-title-homepage">{ad.title}</h2>
                        )}

                        {(ad.price && ad.price !== '') && (ad.category === "סוסים" || ad.category === "זרע" || ad.category === "אביזרים"
                        ) && (
                                <p className="ad-price-homepage">₪{ad.price}</p>
                            )}
                        <p className='ad-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>

                        {ad.hasCertificate && (
                            <span className="homepage-verified-badge">
                                <img src={require('@/assets/bitcoin-icons--verify-outline.png')} alt="Verified Badge" />
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LatestAds;