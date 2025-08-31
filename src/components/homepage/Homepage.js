import React from 'react';
import './Homepage.css';
import { CARDS } from '@components/utils/constants/Constants';
import SlidingCard from './sliding_cards/SlidingCard';
import ApplicationLink from './app_link/ApplicationLink';
import Sponsors from './sponsors/Sponsors';

const HomePage = () => {
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

            <Sponsors/>

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