import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './Item.css'
import { faPhoneAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';

const ItemPage = () => {
    const location = useLocation();
    const ad = location.state?.ad;
    const items = [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!ad) {
        return <div>Loading...</div>;
    }

    // const items = ad.photos && ad.photos.length > 0 ? ad.photos?.map((photo, index) => (
    //     <img key={index} src={photo} alt={`Ad ${index + 1}`} style={{ width: '100%', height: '600px', objectFit: 'contain' }} />
    // )) : [<img src={require("@/assets/no-image.jpg")} alt="empty" style={{ width: '100%', height: '600px', objectFit: 'contain' }} />];

    if (ad.video) {
        items.push(
            <video
                key="video"
                controls
                style={{ width: '100%', height: '600px', objectFit: 'contain' }}
            >
                <source src={ad.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }

    if (ad.photos && ad.photos.length > 0) {
        ad.photos.forEach((photo, index) => {
            items.push(
                <img
                    key={`photo-${index}`}
                    src={photo}
                    alt={`Ad ${index + 1}`}
                    style={{ width: '100%', height: '600px', objectFit: 'contain' }}
                />
            );
        });
    }

    if (items.length === 0) {
        items.push(
            <img
                src={require("@/assets/no-image.jpg")}
                alt="empty"
                style={{ width: '100%', height: '600px', objectFit: 'contain' }}
            />
        );
    }

    return (
        <div className="item-detail-container">

            <AliceCarousel
                mouseTracking
                items={items}
                infinite
                responsive={{ 0: { items: 1 }, 1024: { items: 1 } }}
            />

            <div className="item-location-container">
                <span>{ad.location}</span>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginLeft: '8px' }} />
            </div>

            <h1 className="item-title">{ad.title}</h1>

            <p className="item-description">{ad.description}</p>

            {(ad.category === "סוסים" || ad.category === "זרע" || ad.category === "אביזרים" || ad.category === "חנות") && (
                <>
                    <div className='horizontal-line ' />

                    <div className='more-info'>
                        <h2>פרטים נוספים</h2>
                        {ad.category === "סוסים" && (
                            <div>
                                <p className="item-horse">גיל: {ad.age}</p>
                                <p className="item-horse">גזע: {ad.breed}</p>
                                <p className="item-horse">מין: {ad.gender}</p>
                            </div>
                        )}

                        {ad.category === "זרע" && (
                            <div>
                                <p className="item-horse">סוג זרע: {ad.seed_type} - {ad.semen_type}</p>
                            </div>
                        )}
                        <p className="item-price">₪{ad.price}</p>
                    </div>
                    <div className='horizontal-line ' />
                </>
            )}

            <p style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', fontWeight: 'bold' }}>איש קשר: {ad.contact}</p>
            <div className="item-phone-container">
                <a href={`tel:${ad.phoneNumber}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span>{ad.phoneNumber}</span>
                    <FontAwesomeIcon icon={faPhoneAlt} style={{ marginLeft: '8px' }} />
                </a>
            </div>
            <p className='ad-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>

            {ad.hasCertificate && (
                <span className="verified-badge">
                    <img src={require('@/assets/bitcoin-icons--verify-outline.png')} alt="Verified Badge" />
                    <p>עם תעודה</p>
                </span>
            )}
        </div>
    );
};

export default ItemPage;
