import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
    faCartPlus,
    faMinus,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
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
import { isStoreProduct, toCartProduct } from '@/helpers/cart-helpers';
import { showCartAddedToast } from '@/helpers/cart-toast';
import { updateUserCart } from '@/helpers/firebase-helpers';
import { loadCart } from '@/redux/cartSlice';
import { useAuth } from '@/context/AuthProvider';
import { isServiceCategory } from '@components/utils/constants/Constants';
import { SITE_NAME, SITE_URL } from '@/data/site-config';
import useSeo from "@/hooks/useSeo";
import ListingCardMedia from "@/components/pets/ListingCardMedia";

const ADS_SUGGESTION_LIMIT = 10;

const getAdTitle = (ad) =>
    getAdDisplayName(ad) || ad.title || ad.name || ad.breed || ad.accessory || 'מודעה';
const getAdImage = (item) => item.photos?.[0] || item.image || require('@/assets/no-image.jpg');

const ItemPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const cartItems = useSelector((state) => state.cart.items);
    const { adId } = useParams();
    const [ad, setAd] = useState(location.state?.ad || null);
    const [loadingAd, setLoadingAd] = useState(!location.state?.ad && Boolean(adId));
    const [similarAds, setSimilarAds] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const carouselRef = useRef(null);
    const [shareStatus, setShareStatus] = useState('');
    const [cartStatus, setCartStatus] = useState('');
    const [storeQty, setStoreQty] = useState(1);

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

            setSimilarAds(filtered);
        } catch {
            setSimilarAds([]);
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
        const cover = photos[0] || require('@/assets/no-image.jpg');
        const items = [];

        // Photos first — cover (photos[0]) is the default display, not an empty video frame.
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

        if (ad.video) {
            const itemIndex = items.length;
            items.push({
                key: 'video',
                thumb: cover,
                kind: 'video',
                node: (
                    <video
                        key="video"
                        controls
                        playsInline
                        preload="metadata"
                        poster={cover}
                        className="media-element"
                        onClick={() => openLightbox(itemIndex)}
                    >
                        <source src={ad.video} type="video/mp4" />
                    </video>
                ),
            });
        }

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

    useEffect(() => {
        setActiveIndex(0);
        setStoreQty(1);
        carouselRef.current?.slideTo?.(0);
    }, [ad?.id]);

    const goToSlide = useCallback((index) => {
        if (index < 0 || index >= mediaItems.length) return;
        setActiveIndex(index);
        // AliceCarousel often ignores controlled activeIndex alone — slideTo syncs the UI.
        carouselRef.current?.slideTo?.(index);
    }, [mediaItems.length]);

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
                const isStoreShare = isStoreProduct(ad);
                await navigator.share({
                    title: `${title} | ${SITE_NAME}`,
                    text: isStoreShare
                        ? `מוצר מ-${SITE_NAME}`
                        : `מודעה מ-${SITE_NAME}`,
                    url: shareUrl,
                });
                setShareStatus(isStoreShare ? 'המוצר שותף' : 'המודעה שותפה');
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
                    <p className="description">ייתכן שהמודעה נמחקה או שכבר אינה זמינה.</p>
                    <button className="item-back" type="button" onClick={() => navigate("/")}>
                        חזרה לדף הבית
                    </button>
                </div>
            </div>
        );
    }

    const isPetAd = isPetMarketplaceCategory(ad.category) || Boolean(ad.type);
    const isServiceAd =
        isServiceCategory(ad.category) || ad.listingKind === "service";
    const isStoreAd = isStoreProduct(ad);
    const showDetails =
        !isStoreAd &&
        (isPetAd ||
            ad.category === "סוסים" ||
            ad.category === "זרע" ||
            ad.category === "אביזרים");
    const whatsappLink = buildWhatsAppLink({
        phoneNumber: ad.phoneNumber,
        title: getAdTitle(ad),
        isService: isServiceAd,
    });

    const handleAddStoreToCart = async () => {
        if (!currentUser) {
            navigate(
                `/login?next=${encodeURIComponent(getListingPath(ad))}`
            );
            return;
        }
        const qty = Math.max(1, Number(storeQty) || 1);
        const product = toCartProduct(ad);
        const existing = cartItems.find((item) => item.id === ad.id);
        const nextCart = existing
            ? cartItems.map((item) =>
                  item.id === ad.id
                      ? { ...item, quantity: item.quantity + qty }
                      : item
              )
            : [...cartItems, { ...product, quantity: qty }];
        dispatch(loadCart(nextCart));
        await updateUserCart(
            currentUser.uid,
            nextCart.map((item) => ({
                ...toCartProduct(item),
                quantity: item.quantity,
            }))
        );
        showCartAddedToast({
            title: product.title || getAdTitle(ad),
            quantity: qty,
        });
        setCartStatus(qty > 1 ? `נוסף ×${qty}` : "נוסף לעגלה");
        window.setTimeout(() => setCartStatus(""), 2000);
    };

    const renderLightbox = () =>
        lightboxIndex !== null && mediaItems[lightboxIndex] ? (
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
                    {mediaItems[lightboxIndex].kind === "video" ? (
                        <video
                            controls
                            playsInline
                            className="item-lightbox-media"
                            autoPlay
                            poster={mediaItems[lightboxIndex].thumb}
                        >
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
        ) : null;

    const renderRelated = () =>
        similarAds.length > 0 ? (
            <div
                className={`related-ads-section${isStoreAd ? " store-related" : ""}`}
            >
                <h2 className="related-ads-title">
                    {isStoreAd
                        ? "מוצרים דומים"
                        : isServiceAd
                          ? "שירותים דומים"
                          : "מודעות דומות"}
                </h2>
                <div className="related-ads-grid">
                    {similarAds.slice(0, 8).map((item) => (
                        <button
                            type="button"
                            className="related-ad-card"
                            key={item.id}
                            onClick={() => handleAdClick(item)}
                        >
                            <ListingCardMedia
                                src={getAdImage(item)}
                                alt={getAdTitle(item)}
                                className="related-ad-image"
                            />
                            <div className="related-ad-info">
                                <h4>{getAdTitle(item)}</h4>
                                {!isStoreAd && item.location && (
                                    <span>{item.location}</span>
                                )}
                                {formatListingPrice(item) && (
                                    <p>{formatListingPrice(item)}</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : null;

    if (isStoreAd) {
        const priceLabel = formatListingPrice(ad);
        return (
            <>
                <div className="store-product-page" dir="rtl">
                    <div className="store-product-shell">
                        <div className="store-product-gallery">
                            <AliceCarousel
                                ref={carouselRef}
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
                                <div className="store-product-thumbs">
                                    {mediaItems.map((item, index) => (
                                        <button
                                            key={item.key}
                                            type="button"
                                            className={`store-product-thumb ${activeIndex === index ? "active" : ""}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={
                                                item.kind === "video"
                                                    ? "סרטון"
                                                    : `תמונה ${index + 1}`
                                            }
                                        >
                                            <img src={item.thumb} alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="store-product-buy">
                            <nav className="store-product-crumb" aria-label="ניווט">
                                <button
                                    type="button"
                                    onClick={() => navigate("/our-products")}
                                >
                                    החנות
                                </button>
                                <span aria-hidden="true">/</span>
                                <span>{getAdTitle(ad)}</span>
                            </nav>

                            <h1>{getAdTitle(ad)}</h1>

                            {ad.accessory ? (
                                <p className="store-product-type">{ad.accessory}</p>
                            ) : null}

                            {priceLabel ? (
                                <p className="store-product-price">{priceLabel}</p>
                            ) : (
                                <p className="store-product-price store-product-price--ask">
                                    מחיר בתיאום
                                </p>
                            )}

                            <div className="store-product-trust">
                                <span>משלוח עד הבית</span>
                                <span>תשלום מאובטח</span>
                                <span>החזרה לפי התקנון</span>
                            </div>

                            {ad.source !== "catalog" && (
                                <div className="store-product-cta">
                                    <div
                                        className="store-product-qty"
                                        role="group"
                                        aria-label="כמות"
                                    >
                                        <button
                                            type="button"
                                            aria-label="הקטן כמות"
                                            onClick={() =>
                                                setStoreQty((q) => Math.max(1, q - 1))
                                            }
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span>{storeQty}</span>
                                        <button
                                            type="button"
                                            aria-label="הגדל כמות"
                                            onClick={() =>
                                                setStoreQty((q) => Math.min(99, q + 1))
                                            }
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        className="store-product-add"
                                        onClick={handleAddStoreToCart}
                                    >
                                        <FontAwesomeIcon icon={faCartPlus} />
                                        {cartStatus || "הוסף לעגלה"}
                                    </button>
                                    <div className="store-product-secondary">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/cart")}
                                        >
                                            לעגלה
                                        </button>
                                        <button type="button" onClick={handleShare}>
                                            <FontAwesomeIcon
                                                icon={shareStatus ? faCopy : faShareNodes}
                                            />
                                            {shareStatus || "שיתוף"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {ad.description ? (
                        <section className="store-product-about">
                            <h2>על המוצר</h2>
                            <p>{ad.description}</p>
                        </section>
                    ) : null}

                    {renderRelated()}

                    <div
                        className="store-product-sticky"
                        aria-hidden={ad.source === "catalog"}
                    >
                        {ad.source !== "catalog" && (
                            <>
                                <div className="store-product-sticky-price">
                                    {priceLabel || "מחיר בתיאום"}
                                </div>
                                <button
                                    type="button"
                                    className="store-product-add"
                                    onClick={handleAddStoreToCart}
                                >
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    {cartStatus || "הוסף לעגלה"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {renderLightbox()}
            </>
        );
    }

    return (
        <>
            <div
                className={`item-page-wrapper${isServiceAd ? " item-page-wrapper--service" : ""}`}
            >
                <div className="item-media">
                    <AliceCarousel
                        ref={carouselRef}
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
                                    className={`item-thumb ${activeIndex === index ? "active" : ""} ${item.kind === "video" ? "item-thumb--video" : ""}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={
                                        item.kind === "video"
                                            ? "סרטון"
                                            : `תמונה ${index + 1}`
                                    }
                                >
                                    <img src={item.thumb} alt="" />
                                    {item.kind === "video" && (
                                        <span className="item-thumb-play" aria-hidden="true">
                                            ▶
                                        </span>
                                    )}
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
                            {isServiceAd && (
                                <span className="item-badge item-badge--service">
                                    שירות
                                </span>
                            )}
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

                        {!isStoreAd && ad.location && (
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
                    {isServiceAd && (
                        <p className="service-note">
                            כרטיס שירות מקצועי — לתיאום פרטים צרו קשר ישירות עם הספק.
                        </p>
                    )}
                    {ad.source === "catalog" && (
                        <p className="service-note">
                            מודעת דוגמה לתצוגה בלבד — אינה מודעה חיה באתר.
                        </p>
                    )}
                    <p className="description">{ad.description}</p>

                    {isServiceAd && (
                        <div className="more-details more-details--service">
                            <h3>פרטי השירות</h3>
                            <dl className="item-details-grid">
                                {Array.isArray(ad.service_animals) &&
                                    ad.service_animals.length > 0 && (
                                    <>
                                        <dt>מתאים ל</dt>
                                        <dd>{ad.service_animals.join(" · ")}</dd>
                                    </>
                                )}
                                {ad.location && (
                                    <>
                                        <dt>אזור</dt>
                                        <dd>{ad.location}</dd>
                                    </>
                                )}
                            </dl>
                            {formatListingPrice(ad) ? (
                                <p className="price">{formatListingPrice(ad)}</p>
                            ) : (
                                <p className="price price--ask">לתיאום מחיר</p>
                            )}
                        </div>
                    )}

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

                    {ad.source !== "catalog" && (
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
                    )}

                    <div className="item-actions">
                        {ad.source !== "catalog" && whatsappLink && (
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
                            {shareStatus || (isServiceAd ? "שיתוף שירות" : "שיתוף מודעה")}
                        </button>
                    </div>

                    <p className="date">תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                </div>
            </div>

            {renderLightbox()}
            {renderRelated()}
        </>
    );
};

export default ItemPage;
