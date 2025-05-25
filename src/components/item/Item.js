import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './Item.css';
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

    if (!ad) return <div>Loading...</div>;

    if (ad.video) {
        items.push(
            <video key="video" controls className="media-element">
                <source src={ad.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }

    if (ad.photos?.length > 0) {
        ad.photos.forEach((photo, index) => {
            items.push(
                <img
                    key={`photo-${index}`}
                    src={photo}
                    alt={`Ad ${index + 1}`}
                    className="media-element"
                />
            );
        });
    }

    if (items.length === 0) {
        items.push(
            <img
                src={require('@/assets/no-image.jpg')}
                alt="empty"
                className="media-element"
            />
        );
    }

    return (
        <div className="item-page-wrapper">
            <div className="item-media">
                <AliceCarousel
                    mouseTracking
                    items={items}
                    infinite
                    disableDotsControls
                    responsive={{ 0: { items: 1 } }}
                />
            </div>

            <div className="item-info">
                <div className="top-row">
                    {ad.hasCertificate ? (
                        <div className="verified">
                            <img src={require('@/assets/bitcoin-icons--verify-outline.png')} alt="verified" />
                            <span>עם תעודה</span>
                        </div>
                    ):(<div className="verified-placeholder" />)}

                    <div className="location">
                        <span>{ad.location}</span>
                        <FontAwesomeIcon icon={faLocationDot} style={{ marginLeft: '8px' }} />
                    </div>
                </div>
                <h1>{ad.title}</h1>
                <p className="description">{ad.description}</p>

                {(ad.category === "סוסים" || ad.category === "זרע" || ad.category === "אביזרים" || ad.category === "חנות") && (
                    <div className="more-details">
                        <h3>פרטים נוספים</h3>
                        {ad.category === "סוסים" && (
                            <>
                                <p><strong>גיל:</strong> {ad.age}</p>
                                <p><strong>גזע:</strong> {ad.breed}</p>
                                <p><strong>מין:</strong> {ad.gender}</p>
                            </>
                        )}
                        {ad.category === "זרע" && (
                            <p><strong>סוג זרע:</strong> {ad.seed_type} - {ad.semen_type}</p>
                        )}
                        <p className="price">₪{ad.price}</p>
                    </div>
                )}

                <div className="contact-box">
                    <span className="contact-person"><strong>איש קשר:</strong> {ad.contact}</span>
                    <a className="phone-link" href={`tel:${ad.phoneNumber}`}>
                        <span>{ad.phoneNumber}</span>
                        <FontAwesomeIcon icon={faPhoneAlt} />
                    </a>
                </div>

                <p className="date">תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
            </div>
        </div>
    );
};

export default ItemPage;
