import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';
import './LatestAds.css';
import { db } from '@/firebase';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where
} from 'firebase/firestore';
import * as Sentry from "@sentry/react";

const NUMBER_OF_LATEST_ADS_TO_FETCH = 8;

const LatestAds = () => {
    const navigate = useNavigate();
    const [latestAds, setLatestAds] = useState([]);

    const handleClickOnItem = (ad) => {
        navigate('/item', {
            state: { ad }
        });
    };

    useEffect(() => {
        const fetchLatestAds = async () => {
            try {
                const adsRef = collection(db, "ads");

                const q = query(
                    adsRef,
                    where("availableUntil", ">", new Date()),
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

                Sentry.captureException(error, {
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
        <div className="left-content">

            <h2 className="ad-title-section">
                פורסמו לאחרונה
            </h2>

            <div className="ad-cards-container">

                {latestAds.map((ad) => (

                    <div
                        key={ad.id}
                        className="ad-card-homepage"
                        style={{
                            borderColor: ad?.hasCertificate
                                ? '#0064E0'
                                : undefined,
                            borderWidth: ad?.hasCertificate
                                ? '2px'
                                : undefined
                        }}
                        onClick={() => handleClickOnItem(ad)}
                    >

                        {/* CATEGORY ICON */}

                        {(ad.category === "סוסים" ||
                            ad.category === "זרע" ||
                            ad.category === "אביזרים") && (

                            <div className="feature-icon-container-ads">

                                <div
                                    className="feature-icon-circle"
                                    data-tooltip={ad.category}
                                >

                                    <img
                                        className="feature-icon-ads"
                                        src={
                                            ad.category === "סוסים"
                                                ? require('@/assets/aboutus/horse.png')
                                                : ad.category === "זרע"
                                                    ? require('@/assets/aboutus/sperm.png')
                                                    : require('@/assets/aboutus/tool-box.png')
                                        }
                                        alt={ad.category}
                                        loading="lazy"
                                    />

                                </div>

                            </div>
                        )}

                        {/* IMAGE */}

                        {ad.photos && ad.photos.length > 0 ? (

                            <img
                                src={ad.photos[0]}
                                alt={ad.category || "מודעה"}
                                className="ad-image-homepage"
                                loading="lazy"
                            />

                        ) : (

                            <img
                                src={require('@/assets/no-image.jpg')}
                                alt="אין תמונה"
                                className="ad-image-homepage"
                                loading="lazy"
                            />

                        )}

                        {/* TITLE */}

                        {ad.category === "סוסים" ? (

                            <h2 className="ad-title-homepage">
                                {ad.breed || "סוס"}
                            </h2>

                        ) : ad.category === "זרע" ? (

                            <h2 className="ad-title-homepage">
                                {ad.seed_type || "זרע"}
                            </h2>

                        ) : ad.category === "אביזרים" ? (

                            <h2 className="ad-title-homepage">
                                {ad.accessory || "אביזר"}
                            </h2>

                        ) : (

                            <h2 className="ad-title-homepage">
                                {ad.title || ad.name || ad.category || "מודעה"}
                            </h2>

                        )}

                        {/* PRICE */}

                        {ad.price &&
                            ad.price !== '' && (

                                <p className="ad-price-homepage">
                                    ₪{ad.price}
                                </p>

                            )}

                        {/* DATE */}

                        {ad.createdAt && (

                            <p className="ad-date-create">
                                תאריך פרסום:{" "}
                                {FormatDateTimestampToDate(ad.createdAt)}
                            </p>

                        )}

                        {/* VERIFIED */}

                        {ad.hasCertificate && (

                            <span className="homepage-verified-badge">

                                <img
                                    src={require('@/assets/bitcoin-icons--verify-outline.png')}
                                    alt="מודעה מאומתת"
                                />

                                מודעה מאומתת

                            </span>

                        )}

                    </div>

                ))}

            </div>

            {/* EMPTY STATE */}

            {latestAds.length === 0 && (

                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        padding: "30px",
                        color: "#8a949d"
                    }}
                >
                    אין מודעות להצגה כרגע
                </div>

            )}

        </div>
    );
};

export default LatestAds;
