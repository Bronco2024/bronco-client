import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { faker } from '@faker-js/faker';
import 'react-alice-carousel/lib/alice-carousel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const items = Array.from({ length: 10 }, () => {
        const imageUrl = faker.image.urlLoremFlickr({ width: 100, height: 150, category: 'horses' });

        return (
            <div className="carousel-item" onClick={() => navigate('/item', { state: { imageUrl } })}>
                <img src={imageUrl} alt="Fake" />
            </div>
        );
    });

    const responsive = {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 },
        1200: { items: 4 },
    };

    const renderNextButton = ({ isDisabled }) => {
        return <FontAwesomeIcon icon={faArrowCircleRight} size='2x' />;
    };

    const renderPrevButton = ({ isDisabled }) => {
        return <FontAwesomeIcon icon={faArrowCircleLeft} size='2x' />;
    };

    return (
        <div className="carousel-container">
            <div className="logo-container">
                <span className="logo-text">BRONCO</span>
                <img src={require('../../assets/bronco.png')} style={{ width: '250px', height: 'auto' }} alt="Bronco Logo" />
                <span className="logo-text">ESTD 2024</span>
            </div>
            <hr className="divider" />

            <h2 className="carousel-title">להיטים</h2>
            <AliceCarousel
                mouseTracking
                items={items}
                autoPlay
                infinite
                autoPlayInterval={2000}
                responsive={responsive}
                disableDotsControls
                renderPrevButton={renderPrevButton}
                renderNextButton={renderNextButton}
            />
        </div>
    );
};

export default HomePage;
