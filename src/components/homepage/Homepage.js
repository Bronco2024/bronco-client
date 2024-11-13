import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { FormatDateTimestampToDate } from '../utils/constants/Functions';

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
            }
        };

        const fetchLatestAds = async () => {
            try {
                const adsRef = collection(db, "ads");
                const filterQuery = where("availableUntil", ">", new Date());
                const q = query(adsRef, filterQuery, orderBy("createdAt", "desc"), limit(NUMBER_OF_LATEST_ADS_TO_FETCH));
                const querySnapshot = await getDocs(q);

                const ads = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLatestAds(ads);

            } catch (error) {
                console.error("Error fetching sponsors:", error);
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
            height: type === "gold" ? "200px" : "100%"
        };

        return filteredSponsors.map(item => (
            <a href={item.link} target="_blank" rel="noopener noreferrer">
                <img
                    key={item.id}
                    src={item.photo}
                    alt="sponsor"
                    style={{ width: imageFit.width, height: imageFit.height, objectFit: 'cover' }}
                />
            </a>
        ));
    };

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="carousel-container">
            <div className="logo-container">
                <span className="logo-text">BRONCO</span>
                <img src={require('../../assets/bronco.png')} style={{ width: '250px', height: 'auto' }} alt="Bronco Logo" />
                <span className="logo-text">ESTD 2024</span>
            </div>
            <hr className="divider" />

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
                        <h2 className="ad-title-section">להיטים</h2>
                        <div className="ad-cards-container">
                            {latestAds.map(ad => (
                                <div
                                    key={ad.id}
                                    className="ad-card-homepage"
                                    style={{ borderColor: ad?.hasCertificate ? '#0064E0' : null, borderWidth: ad?.hasCertificate ? '2px' : null }}
                                    onClick={() => handleClickOnItem(ad)}
                                >
                                    {ad.photos && ad.photos[0] && (
                                        <img src={ad.photos[0]} alt={ad.category} className="ad-image-homepage" />
                                    )}
                                    {ad.photos.length === 0 && (
                                        <img src={require('../../assets/no-image.jpg')} alt={ad.category} className="ad-image-homepage" />
                                    )}
                                    {ad.category === "סוסים" ? (
                                            <h2 className="ad-title-homepage">{ad.breed}</h2>
                                        ) : ad.category === "זרע" ? (
                                                <h2 className="ad-title-homepage">{ad.seed_type}</h2>
                                        ) :  ad.category === "אביזרים" ? (
                                                <h2 className="ad-title-homepage">{ad.accessory}</h2>
                                        ) : (
                                            <h2 className="ad-title-homepage">{ad.title}</h2>
                                    )}

                                    {(ad.category === "סוסים" || ad.category === "זרע" || ad.category === "אביזרים") && (
                                        <p className="ad-price-homepage">₪{ad.price}</p>
                                    )}
                                    <p className='ad-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
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
        </div>
    );
};

export default HomePage;
