import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';
import { CARDS } from '@components/utils/constants/Constants';
import SlidingCard from './SlidingCard';
import ApplicationLink from './ApplicationLink';
import * as Sentry from "@sentry/react";

const NUMBER_OF_LATEST_ADS_TO_FETCH = 8;

const HomePage = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [latestAds, setLatestAds] = useState([])

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const goldCollectionRef = collection(db, 'sponsors');
                const querySnapshot = await getDocs(goldCollectionRef);

                const fetchedSponsors = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setSponsors(fetchedSponsors);

            } catch (error) {
                console.error("Error fetching sponsors:", error);
                Sentry.captureException(`Error fetching sponsors`, {
                    tags: {
                        component: "Homepage"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        const fetchLatestAds = async () => {
            try {
                const categories = ["סוסים", "זרע", "אביזרים"];

                const adsRef = collection(db, "ads");
                const filterQuery = where("availableUntil", ">", new Date());
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
                console.log(ads)
                setLatestAds(ads);

            } catch (error) {
                console.error("Error fetching ads:", error);
                Sentry.captureException(`Error fetching ads`, {
                    tags: {
                        component: "Homepage"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        fetchSponsors();
        fetchLatestAds();
    }, []);

    const responsiveGold = {
        0: { items: 1 },
    };

    const responsiveSilver = {
        0: { items: 2 },
        768: { items: 1 },
    };

    const responsiveBronze = {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 },
    };

    const renderItems = (sponsors, type) => {
        const filteredSponsors = sponsors.filter(item => item.sponsor === type);
        const imageFit = {
            width: "100%",
            height: type === "gold" ? '250px' : "100%"
        };

        return filteredSponsors.map(item => (
            <a href={item.link} target="_blank" rel="noopener noreferrer">
                <img
                    key={item.id}
                    src={item.photo}
                    alt="sponsor"
                    style={{ width: imageFit.width, height: imageFit.height, objectFit: 'fill' }}
                    loading='lazy'
                />
            </a>
        ));
    };

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    //const text_offer_header = "🔥 הירשם עכשיו וקבל פרסום ראשון במתנה 🔥";

    return (
        <div className="carousel-container">
            <div className="logo-container">
                <img
                    src={require('@/assets/horsehub-gold.png')}
                    style={{ width: '20rem', height: 'auto' }}
                    alt="HorseHub Logo"
                    loading='lazy'
                />
            </div>

            {/* <div className="marquee-wrapper">
                <div className="marquee" onClick={() => {
                    navigate('/register')
                }}>
                    <span>{text_offer_header}</span>
                    <span>{text_offer_header}</span>
                </div>
            </div> */}

            <div className='outer-sponsor-container'>
                <div className='outer-sponsor-wrapper gold-sponsor'>
                    <div className="title-container">GOLD SPONSOR</div>
                    <AliceCarousel
                        mouseTracking
                        items={renderItems(sponsors, "gold")}
                        autoPlay
                        infinite
                        autoPlayInterval={2000}
                        responsive={responsiveGold}
                        disableDotsControls
                        disableButtonsControls
                    />
                </div>

                <div className='sponsor-wrapper'>
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

                                    {(ad.category === "סוסים" || ad.category === "זרע" || ad.category === "אביזרים" || ad.category === "חנות") && (
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


                    <div className='silver-sponsor'>
                        <div className="title-container">SILVER SPONSOR</div>
                        <AliceCarousel
                            mouseTracking
                            items={renderItems(sponsors, "silver")}
                            autoPlay
                            infinite
                            autoPlayInterval={2000}
                            responsive={responsiveSilver}
                            disableDotsControls
                            disableButtonsControls
                        />
                    </div>
                </div>

                <div className='bronze-sponsor-wrapper bronze-sponsor'>
                    <div className="title-container">BRONZE SPONSOR</div>
                    <AliceCarousel
                        mouseTracking
                        items={renderItems(sponsors, "bronze")}
                        autoPlay
                        infinite
                        autoPlayInterval={2000}
                        responsive={responsiveBronze}
                        disableDotsControls
                        disableButtonsControls
                    />
                </div>
            </div>

            <div className="slider-container">
                {CARDS.map((card, index) => (
                    <SlidingCard key={index} title={card.title} text={card.text} />
                ))}
            </div>

            <ApplicationLink />
        </div>
    );
};

export default HomePage;
