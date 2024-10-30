import React from 'react';
import { useLocation } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './Item.css'

const ItemPage = () => {
    const location = useLocation();
    const ad = location.state?.ad;

    if (!ad) {
        return <div>Loading...</div>;
    }

    const items = ad.photos?.map((photo, index) => (
        <img key={index} src={photo} alt={`Ad Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
    ));

    return (
        <div className="item-detail-container">
            <AliceCarousel 
                mouseTracking 
                items={items} 
                infinite
                responsive={{ 0: { items: 1 }, 1024: { items: 1 } }}
            />

            <h1 className="item-title">{ad.title}</h1>

            <p className="item-description">{ad.description}</p>

            <p className="item-price">₪{ad.price}</p>

            <p className="item-phone">טלפון: {ad.phoneNumber}</p>
        </div>
    );
};

export default ItemPage;
