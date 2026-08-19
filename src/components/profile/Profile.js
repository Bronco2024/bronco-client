import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faPen,
    faPlus,
    faRotateRight,
    faTrash,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthProvider';
import { db, storage } from '@/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import './Profile.css';
import Modal from '@components/utils/modal/Modal';
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from '@components/utils/constants/Functions';
import { AD_STATUS, AD_STATUS_LABELS, getAdStatus } from '@/helpers/ad-approval';
import { isAdoptionListing } from '@/data/pets';
import * as Sentry from "@sentry/react";

const getAdTitle = (ad) =>
    ad.title || ad.name || ad.breed || ad.seed_type || ad.accessory || ad.category || "מודעה";

const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") return "";
    if (typeof price === "number") return `₪${price.toLocaleString("he-IL")}`;
    const trimmed = String(price).trim();
    if (!trimmed) return "";
    if (trimmed.includes("₪") || trimmed.includes("אימוץ")) return trimmed;
    const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
        return `₪${numeric.toLocaleString("he-IL")}`;
    }
    return trimmed;
};

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userAds, setUserAds] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalRenewVisible, setIsModalRenewVisible] = useState(false);
    const [adToRenew, setAdToRenew] = useState(null);
    const [adToDelete, setAdToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const FetchUserAds = async () => {
            if (!currentUser) return;

            const adsCollection = collection(db, 'ads');
            const q = query(adsCollection, where("userId", "==", currentUser.uid));

            try {
                const querySnapshot = await getDocs(q);
                const ads = querySnapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));
                setUserAds(ads);
            } catch (error) {
                console.error("Error fetching user ads:", error);
                Sentry.captureException(`Error fetching user ads`, {
                    tags: {
                        component: "Profile"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        FetchUserAds();
    }, [currentUser, refresh]);

    const adStats = useMemo(() => ({
        total: userAds.length,
        pending: userAds.filter((ad) => getAdStatus(ad) === AD_STATUS.PENDING).length,
        approved: userAds.filter((ad) => getAdStatus(ad) === AD_STATUS.APPROVED).length,
    }), [userAds]);

    const handleUpdateButton = (ad) => {
        navigate('/profile/update_ad', { state: { ad } })
    }

    const handleDeleteButton = (ad) => {
        setIsModalVisible(true)
        setAdToDelete(ad);
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setAdToDelete(null);
    };

    const closeModalRenew = () => {
        setIsModalRenewVisible(false)
        setAdToRenew(null);
    };

    const handleDeleteButtonModal = () => {
        try {
            deleteAdFromFirebase(adToDelete?.id)
            setRefresh(prev => !prev);
        } catch (err) {
            console.log(err)
        }
        closeModal()
    }

    const deleteAdFromFirebase = async (adId) => {
        try {
            const adDocRef = doc(db, 'ads', adId);
            await deleteDoc(adDocRef);

            const imagesRef = ref(storage, `ads/${adId}`);

            const listResult = await listAll(imagesRef);
            const deletePromises = listResult.items.map((fileRef) => deleteObject(fileRef));

            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Error deleting ad:", error);
            Sentry.captureException(`Error deleting ad`, {
                tags: {
                    component: "Profile"
                },
                extra: {
                    info: error
                }
            });
        }
    };

    const handleRenewButtonModal = () => {
        try {
            RenewAdFirebase();
            setRefresh(prev => !prev);
        } catch (err) {
            console.log(err)
        }
        closeModalRenew()
    }

    const handleRenewButton = async (ad) => {
        const isFreeAdoptionRenew = isAdoptionListing(ad);

        if (!currentUser?.isAdmin && currentUser.numberOfAds <= 0 && !isFreeAdoptionRenew) {
            navigate('/subscribe');
            return;
        }

        setIsModalRenewVisible(true);
        setAdToRenew(ad);
    }

    const RenewAdFirebase = async () => {
        /**
         * PAYMENTS
         * This is currently closed until customer decides to make payments in the website
         */
        const dateUntil = new Date()
        dateUntil.setMonth(dateUntil.getMonth() + 1);

        await updateDoc(doc(db, "ads", adToRenew.id), {
            createdAt: new Date(),
            availableUntil: dateUntil
        })
    }

    return (
        <div className="profile-page" dir="rtl">
            <section className="account-hero">
                <div className="account-hero-copy">
                    <span className="section-kicker">החשבון שלי</span>
                    <h1>האזור האישי</h1>
                    <p>כאן אפשר לראות, לעדכן ולחדש את המודעות שלכם.</p>
                    <div className="account-user">
                        <span className="account-user-mark" aria-hidden="true">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <span>{currentUser?.email}</span>
                    </div>
                </div>
                <button
                    type="button"
                    className="account-primary-button"
                    onClick={() => navigate('/publish_ad')}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    פרסום מודעה
                </button>
            </section>

            <section className="account-stats" aria-label="סיכום מודעות">
                <div>
                    <strong>{adStats.total}</strong>
                    <span>מודעות</span>
                </div>
                <div>
                    <strong>{adStats.pending}</strong>
                    <span>ממתינות לאישור</span>
                </div>
                <div>
                    <strong>{adStats.approved}</strong>
                    <span>מאושרות</span>
                </div>
            </section>

            <section className="account-panel">
                <div className="account-panel-header">
                    <h2>המודעות שלך</h2>
                </div>

                {userAds.length > 0 ? (
                    <div className="account-card-list">
                        {userAds.map((ad) => {
                            const status = getAdStatus(ad);
                            const title = getAdTitle(ad);
                            const price = formatPrice(ad.price);
                            const image = ad.photos?.[0] || require('@/assets/no-image.jpg');

                            return (
                                <article key={ad.id} className="account-card">
                                    <button
                                        type="button"
                                        className="account-card-image"
                                        onClick={() => navigate('/item', { state: { ad } })}
                                    >
                                        <img src={image} alt={title} />
                                    </button>

                                    <div className="account-card-body">
                                        <span className={`account-status account-status--${status}`}>
                                            {AD_STATUS_LABELS[status]}
                                        </span>
                                        <h3>{title}</h3>
                                        <p className="account-card-meta">
                                            {ad.category}
                                            {ad.location ? ` · ${ad.location}` : ""}
                                        </p>
                                        {price && <strong className="account-card-price">{price}</strong>}
                                        <small>
                                            <FontAwesomeIcon icon={faClock} />
                                            תקף עד {FormatDateTimestampToDate(ad?.availableUntil)}
                                        </small>
                                    </div>

                                    <div className="account-card-actions">
                                        <button
                                            type="button"
                                            className="account-action account-action--update"
                                            onClick={() => handleUpdateButton(ad)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                            עדכן
                                        </button>
                                        {IsDateNowGreaterThanAdDate(ad?.availableUntil) && (
                                            <button
                                                type="button"
                                                className="account-action account-action--renew"
                                                onClick={() => handleRenewButton(ad)}
                                            >
                                                <FontAwesomeIcon icon={faRotateRight} />
                                                חדש מודעה
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="account-action account-action--delete"
                                            onClick={() => handleDeleteButton(ad)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            מחק
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="account-empty">
                        <h3>עדיין אין מודעות</h3>
                        <p>פרסמו מודעה ראשונה והיא תופיע כאן אחרי האישור.</p>
                        <button
                            type="button"
                            className="account-primary-button"
                            onClick={() => navigate('/publish_ad')}
                        >
                            פרסום מודעה
                        </button>
                    </div>
                )}
            </section>

            <Modal isVisible={isModalVisible} title="מחיקת מודעה" onClose={closeModal}>
                <div className="modal-content-custom">
                    <p>האם אתה בטוח שברצונך למחוק את מודעה זו?</p>
                    <div className="modal-buttons-custom">
                        <button className="cancel-button" onClick={closeModal}>ביטול</button>
                        <button className="confirm-delete-button" onClick={handleDeleteButtonModal}>מחק</button>
                    </div>
                </div>
            </Modal>

            <Modal isVisible={isModalRenewVisible} title="חידוש מודעה" onClose={closeModalRenew}>
                <div className="modal-content-custom">
                    <p>האם אתה בטוח שברצונך לחדש את מודעה זו?</p>
                    <div className="modal-buttons-custom">
                        <button className="cancel-button" onClick={closeModalRenew}>ביטול</button>
                        <button className="confirm-renew-button" onClick={handleRenewButtonModal}>חידוש</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
