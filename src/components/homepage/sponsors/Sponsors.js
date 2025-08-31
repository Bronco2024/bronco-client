import React, { useEffect, useState } from 'react';
import './Sponsors.css';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as Sentry from "@sentry/react";
import LatestAds from '../latest_ads/LatestAds';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);

    const responsiveGold = {
        0: { items: 1 },
    };

    const responsiveSilver = {
        0: { items: 3 },
        768: { items: 1 },
    };

    const responsiveBronze = {
        0: { items: 3 },
        768: { items: 3 },
        1024: { items: 3 },
    };

    const renderItems = (sponsors, type) => {
        const filteredSponsors = sponsors.filter(item => item.sponsor === type);

        return filteredSponsors.map(item => (
            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                <div className={`sponsor-image-wrapper ${type}`}>
                    <img
                        src={item.photo}
                        alt="sponsor"
                        className={`sponsor-img ${type}`}
                        loading='lazy'
                    />
                </div>
            </a>
        ));
    };

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

        fetchSponsors();
    }, []);

    return (
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
                <LatestAds />

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
    )
}

export default Sponsors