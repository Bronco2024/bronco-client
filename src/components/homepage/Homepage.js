import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomePage = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);

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
        fetchSponsors();
    }, []);

    const responsiveGoldSilver = {
        0: { items: 1 },
    };

    const responsiveBronze = {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 },
    };

    const renderItems = (sponsors, type) => {
        const filteredSponsors = sponsors.filter(item => item.sponsor === type);

        return filteredSponsors.map(item => (
            <img
                key={item.id}
                src={item.photo}
                alt="sponsor"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
        ));
    };

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
                        responsive={responsiveGoldSilver}
                        disableDotsControls
                        disableButtonsControls
                    />
                </div>

                <div className='sponsor-wrapper'>
                    <div className='left-content'>
                        <img src={require('../../assets/bronco.png')} alt="aa 1" />
                        <img src={require('../../assets/bronco.png')} alt="aa 2" />
                        <p>Some additional text or content</p>
                    </div>

                    <div className='silver-sponsor'>
                        <div className="title-container">SILVER SPONSOR</div>
                        <AliceCarousel
                            mouseTracking
                            items={renderItems(sponsors, "silver")}
                            autoPlay
                            infinite
                            autoPlayInterval={2000}
                            responsive={responsiveGoldSilver}
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
