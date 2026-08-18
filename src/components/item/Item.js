import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './Item.css';
import { faPhoneAlt, faLocationDot, faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';
import { collection, getDocs, limit, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import {
    getSimilarListings,
    isPetMarketplaceCategory,
} from '@/data/pets';
import { filterApprovedAds } from '@/helpers/ad-approval';

const ADS_SUGGESTION_LIMIT = 10;

const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') return '';
    if (typeof price === 'string' && (price.includes('₪') || price.includes('אימוץ'))) {
        return price;
    }
    return `₪${price}`;
};

const getAdTitle = (ad) => ad.title || ad.name || ad.breed || 'מודעה';
const getAdImage = (item) => item.photos?.[0] || item.image || require('@/assets/no-image.jpg');

const ItemPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const ad = location.state?.ad;
    const items = [];
    const [similarAds, setSimilarAds] = useState([]);

    const fetchSimilarAds = useCallback(async () => {
        if (!ad?.category) return;

        if (ad.source === 'catalog') {
            setSimilarAds(getSimilarListings(ad));
            return;
        }

        try {
            const now = Timestamp.now();
            const collectionRef = collection(db, 'ads');
            const q = query(
                collectionRef,
                where('category', '==', ad.category),
                where('availableUntil', '>=', now),
                limit(ADS_SUGGESTION_LIMIT)
            );

            const querySnapshot = await getDocs(q);
            const filtered = filterApprovedAds(
                querySnapshot.docs
                    .filter(doc => doc.id !== ad.id)
                    .map(doc => ({ id: doc.id, ...doc.data() }))
            );

            setSimilarAds(filtered.length > 0 ? filtered : getSimilarListings(ad));
        } catch {
            setSimilarAds(getSimilarListings(ad));
        }
    }, [ad]);

    useEffect(() => {
        fetchSimilarAds();
    }, [fetchSimilarAds]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [ad?.id]);

    const handleAdClick = (nextAd) => {
        window.scrollTo(0, 0);
        navigate('/item', { state: { ad: nextAd } });
    };

    if (!ad) {
        return (
            <div className="item-page-wrapper" dir="rtl">
                <div className="item-info">
                    <h1>המודעה לא נמצאה</h1>
                    <p className="description">חזרו לדף הבית ובחרו מודעה מהרשימה.</p>
                    <button className="item-back" type="button" onClick={() => navigate("/")}>
                        חזרה לדף הבית
                    </button>
                </div>
            </div>
        );
    }

    const photos = ad.photos?.length ? ad.photos : (ad.image ? [ad.image] : []);
    const isPetAd = isPetMarketplaceCategory(ad.category) || Boolean(ad.type);
    const showDetails =
        isPetAd ||
        ad.category === "סוסים" ||
        ad.category === "זרע" ||
        ad.category === "אביזרים" ||
        ad.category === "חנות";

    if (ad.video) {
        items.push(
            <video key="video" controls className="media-element">
                <source src={ad.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }

    photos.forEach((photo, index) => {
        items.push(
            <img
                key={`photo-${index}`}
                src={photo}
                alt={`${getAdTitle(ad)} ${index + 1}`}
                className="media-element"
            />
        );
    });

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
        <>
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
                    <button
                        className="item-back"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                        חזרה
                    </button>

                    <div className="top-row">
                        <div className="item-badges">
                            {ad.forAdoption && (
                                <span className="item-badge item-badge--adoption">
                                    <FontAwesomeIcon icon={faHeart} />
                                    לאימוץ
                                </span>
                            )}
                            {ad.hasCertificate ? (
                                <span className="item-badge item-badge--verified">
                                    <img src={require('@/assets/bitcoin-icons--verify-outline.png')} alt="" />
                                    עם תעודה
                                </span>
                            ) : null}
                            {ad.category && (
                                <span className="item-badge">{ad.category}</span>
                            )}
                        </div>

                        {ad.location && (
                            <div className="location">
                                <span>{ad.location}</span>
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                        )}
                    </div>
                    <h1>{getAdTitle(ad)}</h1>
                    {ad.forAdoption && (
                        <p className="adoption-note">מודעה לאימוץ — תנו בית חם לחיית מחמד.</p>
                    )}
                    <p className="description">{ad.description}</p>

                    {showDetails && (
                        <div className="more-details">
                            <h3>פרטים נוספים</h3>
                            <dl className="item-details-grid">
                                {ad.type && (
                                    <>
                                        <dt>סוג</dt>
                                        <dd>{ad.type}</dd>
                                    </>
                                )}
                                {ad.age && (
                                    <>
                                        <dt>גיל</dt>
                                        <dd>{ad.age}</dd>
                                    </>
                                )}
                                {ad.breed && (
                                    <>
                                        <dt>גזע</dt>
                                        <dd>{ad.breed}</dd>
                                    </>
                                )}
                                {ad.gender && (
                                    <>
                                        <dt>מין</dt>
                                        <dd>{ad.gender}</dd>
                                    </>
                                )}
                                {ad.category === "זרע" && (
                                    <>
                                        <dt>סוג זרע</dt>
                                        <dd>{ad.seed_type} - {ad.semen_type}</dd>
                                    </>
                                )}
                            </dl>
                            {formatPrice(ad.price) && (
                                <p className="price">{formatPrice(ad.price)}</p>
                            )}
                        </div>
                    )}

                    <div className="contact-box">
                        <span className="contact-person">
                            <strong>איש קשר:</strong> {ad.contact || 'לא צוין'}
                        </span>
                        {ad.phoneNumber && (
                            <a className="phone-link" href={`tel:${ad.phoneNumber}`}>
                                <span>{ad.phoneNumber}</span>
                                <FontAwesomeIcon icon={faPhoneAlt} />
                            </a>
                        )}
                    </div>

                    <p className="date">תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                </div>
            </div>

            {similarAds.length > 0 && (
                <div className="related-ads-section">
                    <h2 className="related-ads-title">מודעות דומות</h2>
                    <div className="related-ads-scroll">
                        {similarAds.map((item) => (
                            <div
                                className="related-ad-card"
                                key={item.id}
                                onClick={() => handleAdClick(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={getAdImage(item)}
                                    alt={getAdTitle(item)}
                                    className="related-ad-image"
                                />
                                <div className="related-ad-info">
                                    <h4>{getAdTitle(item)}</h4>
                                    {formatPrice(item.price) && <p>{formatPrice(item.price)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemPage;
