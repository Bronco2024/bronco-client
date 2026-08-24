import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './Item.css';
import {
    faPhoneAlt,
    faLocationDot,
    faArrowRight,
    faHeart,
    faShareNodes,
    faCopy,
    faXmark,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatDateTimestampToDate } from '@components/utils/constants/Functions';
import { collection, doc, getDoc, getDocs, limit, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import {
    getSimilarListings,
    isPetMarketplaceCategory,
    isAdoptionListing,
    formatListingAge,
    formatListingPrice,
    getAdDisplayName,
    PET_LISTINGS,
} from '@/data/pets';
import { filterApprovedAds } from '@/helpers/ad-approval';
import {
    buildWhatsAppLink,
    getListingPath,
    getListingShareUrl,
} from '@/helpers/listing-links';
import { SITE_NAME, SITE_URL } from '@/data/site-config';
import useSeo from "@/hooks/useSeo";

const ADS_SUGGESTION_LIMIT = 10;

const getAdTitle = (ad) =>
    getAdDisplayName(ad) || ad.title || ad.name || ad.breed || ad.accessory || 'מודעה';
const getAdImage = (item) => item.photos?.[0] || item.image || require('@/assets/no-image.jpg');

const ItemPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { adId } = useParams();
    const [ad, setAd] = useState(location.state?.ad || null);
    const [loadingAd, setLoadingAd] = useState(!location.state?.ad && Boolean(adId));
    const [similarAds, setSimilarAds] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [shareStatus, setShareStatus] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useSeo({
        title: ad ? `${getAdTitle(ad)} | ${SITE_NAME}` : SITE_NAME,
        description: ad?.description
            ? String(ad.description)
            : `מצאו עוד מודעות ב-${SITE_NAME} או פרסמו חיה חדשה.`,
        image: ad ? getAdImage(ad) : "/hero-pets.jpg",
    });

    useEffect(() => {
        if (location.state?.ad && location.state.ad.id === adId) {
            setAd(location.state.ad);
            setLoadingAd(false);
            return;
        }

        if (!adId) {
            if (!location.state?.ad) setAd(null);
            setLoadingAd(false);
            return;
        }

        let cancelled = false;

        const loadAd = async () => {
            setLoadingAd(true);
            try {
                const snap = await getDoc(doc(db, 'ads', adId));
                if (cancelled) return;

                if (snap.exists()) {
                    setAd({ id: snap.id, ...snap.data() });
                    return;
                }

                const catalogAd = PET_LISTINGS.find((item) => String(item.id) === String(adId));
                setAd(catalogAd || null);
            } catch {
                if (!cancelled) {
                    const catalogAd = PET_LISTINGS.find((item) => String(item.id) === String(adId));
                    setAd(catalogAd || location.state?.ad || null);
                }
            } finally {
                if (!cancelled) setLoadingAd(false);
            }
        };

        loadAd();
        return () => {
            cancelled = true;
        };
    }, [adId, location.state]);

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
                    .filter((docSnap) => docSnap.id !== ad.id)
                    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
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
        setActiveIndex(0);
        setShareStatus('');
        setLightboxIndex(null);
    }, [ad?.id]);

    useEffect(() => {
        if (lightboxIndex === null) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') setLightboxIndex(null);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [lightboxIndex]);

    const openLightbox = useCallback((index) => {
        setActiveIndex(index);
        setLightboxIndex(index);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
    }, []);

    const mediaItems = useMemo(() => {
        if (!ad) return [];
        const photos = ad.photos?.length ? ad.photos : (ad.image ? [ad.image] : []);
        const items = [];

        if (ad.video) {
            items.push({
                key: 'video',
                thumb: photos[0] || require('@/assets/no-image.jpg'),
                kind: 'video',
                node: (
                    <video key="video" controls className="media-element">
                        <source src={ad.video} type="video/mp4" />
                    </video>
                ),
            });
        }

        photos.forEach((photo, index) => {
            const itemIndex = items.length;
            items.push({
                key: `photo-${index}`,
                thumb: photo,
                kind: 'image',
                node: (
                    <img
                        key={`photo-${index}`}
                        src={photo}
                        alt={`${getAdTitle(ad)} ${index + 1}`}
                        className="media-element"
                        onClick={() => openLightbox(itemIndex)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                openLightbox(itemIndex);
                            }
                        }}
                    />
                ),
            });
        });

        if (items.length === 0) {
            items.push({
                key: 'empty',
                thumb: require('@/assets/no-image.jpg'),
                kind: 'image',
                node: (
                    <img
                        src={require('@/assets/no-image.jpg')}
                        alt="empty"
                        className="media-element"
                        onClick={() => openLightbox(0)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                openLightbox(0);
                            }
                        }}
                    />
                ),
            });
        }

        return items;
    }, [ad, openLightbox]);

    const showLightboxPrev = () => {
        if (!mediaItems.length) return;
        setLightboxIndex((prev) => {
            const current = prev ?? 0;
            const next = (current - 1 + mediaItems.length) % mediaItems.length;
            setActiveIndex(next);
            return next;
        });
    };

    const showLightboxNext = () => {
        if (!mediaItems.length) return;
        setLightboxIndex((prev) => {
            const current = prev ?? 0;
            const next = (current + 1) % mediaItems.length;
            setActiveIndex(next);
            return next;
        });
    };

    const handleAdClick = (nextAd) => {
        window.scrollTo(0, 0);
        navigate(getListingPath(nextAd), { state: { ad: nextAd } });
    };

    const handleShare = async () => {
        if (!ad) return;
        const shareUrl = getListingShareUrl(
            ad,
            typeof window !== 'undefined' ? window.location.origin : SITE_URL
        );
        const title = getAdTitle(ad);

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${title} | ${SITE_NAME}`,
                    text: `מודעה מ-${SITE_NAME}`,
                    url: shareUrl,
                });
                setShareStatus('המודעה שותפה');
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            setShareStatus('הקישור הועתק');
        } catch {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShareStatus('הקישור הועתק');
            } catch {
                setShareStatus('לא ניתן לשתף כרגע');
            }
        }
    };

    if (loadingAd) {
        return (
            <div className="item-page-wrapper" dir="rtl">
                <div className="item-info">
                    <h1>טוען מודעה...</h1>
                </div>
            </div>
        );
    }

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

    const isPetAd = isPetMarketplaceCategory(ad.category) || Boolean(ad.type);
    const showDetails =
        isPetAd ||
        ad.category === "סוסים" ||
        ad.category === "זרע" ||
        ad.category === "אביזרים" ||
        ad.category === "חנות";
    const whatsappLink = buildWhatsAppLink({
        phoneNumber: ad.phoneNumber,
        title: getAdTitle(ad),
    });

    return (
        <>
            <div className="item-page-wrapper">
                <div className="item-media">
                    <AliceCarousel
                        mouseTracking
                        items={mediaItems.map((item) => item.node)}
                        infinite={mediaItems.length > 1}
                        disableDotsControls={mediaItems.length < 2}
                        disableButtonsControls={mediaItems.length < 2}
                        activeIndex={activeIndex}
                        onSlideChanged={(event) => setActiveIndex(event.item)}
                        responsive={{ 0: { items: 1 } }}
                    />
                    {mediaItems.length > 1 && (
                        <div className="item-thumbs">
                            {mediaItems.map((item, index) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    className={`item-thumb ${activeIndex === index ? "active" : ""}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <img src={item.thumb} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
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
                            {isAdoptionListing(ad) && (
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
                    {isAdoptionListing(ad) && (
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
                                {formatListingAge(ad) && (
                                    <>
                                        <dt>גיל</dt>
                                        <dd>{formatListingAge(ad)}</dd>
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
                                {ad.accessory && (
                                    <>
                                        <dt>סוג מוצר</dt>
                                        <dd>{ad.accessory}</dd>
                                    </>
                                )}
                                {ad.category === "זרע" && (
                                    <>
                                        <dt>מתאים ל</dt>
                                        <dd>{ad.seed_animal || "לא צוין"}</dd>
                                        <dt>סוג זרע</dt>
                                        <dd>{ad.seed_type} - {ad.semen_type}</dd>
                                    </>
                                )}
                            </dl>
                            {formatListingPrice(ad) && (
                                <p className="price">{formatListingPrice(ad)}</p>
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

                    <div className="item-actions">
                        {whatsappLink && (
                            <a
                                className="whatsapp-link"
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                                וואטסאפ
                            </a>
                        )}
                        <button type="button" className="share-link" onClick={handleShare}>
                            <FontAwesomeIcon icon={shareStatus ? faCopy : faShareNodes} />
                            {shareStatus || "שיתוף מודעה"}
                        </button>
                    </div>

                    <p className="date">תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                </div>
            </div>

            {lightboxIndex !== null && mediaItems[lightboxIndex] && (
                <div className="item-lightbox" onClick={closeLightbox} role="presentation">
                    <button
                        type="button"
                        className="item-lightbox-close"
                        onClick={closeLightbox}
                        aria-label="סגירה"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    {mediaItems.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="item-lightbox-nav item-lightbox-nav--prev"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    showLightboxPrev();
                                }}
                                aria-label="הקודם"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <button
                                type="button"
                                className="item-lightbox-nav item-lightbox-nav--next"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    showLightboxNext();
                                }}
                                aria-label="הבא"
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </>
                    )}

                    <div
                        className="item-lightbox-content"
                        onClick={(event) => event.stopPropagation()}
                        role="presentation"
                    >
                        {mediaItems[lightboxIndex].kind === 'video' ? (
                            <video controls className="item-lightbox-media" autoPlay>
                                <source src={ad.video} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={mediaItems[lightboxIndex].thumb}
                                alt={getAdTitle(ad)}
                                className="item-lightbox-media"
                            />
                        )}
                    </div>
                </div>
            )}

            {similarAds.length > 0 && (
                <div className="related-ads-section">
                    <h2 className="related-ads-title">מודעות דומות</h2>
                    <div className="related-ads-grid">
                        {similarAds.slice(0, 8).map((item) => (
                            <button
                                type="button"
                                className="related-ad-card"
                                key={item.id}
                                onClick={() => handleAdClick(item)}
                            >
                                <img
                                    src={getAdImage(item)}
                                    alt={getAdTitle(item)}
                                    className="related-ad-image"
                                />
                                <div className="related-ad-info">
                                    <h4>{getAdTitle(item)}</h4>
                                    {item.location && <span>{item.location}</span>}
                                    {formatListingPrice(item) && <p>{formatListingPrice(item)}</p>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemPage;
