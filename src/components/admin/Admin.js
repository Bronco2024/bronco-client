import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faCheck,
    faEyeSlash,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import './Admin.css'
import { db, storage } from '@/firebase';
import { collection, getDocs, deleteDoc, doc, where, orderBy, query, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { getListingPath } from "@/helpers/listing-links";
import Modal from '@components/utils/modal/Modal';
import { ref, deleteObject, listAll } from "firebase/storage";
import * as Sentry from "@sentry/react";
import {
    AD_STATUS,
    AD_STATUS_LABELS,
    getAdStatus,
    isAdPending,
} from '@/helpers/ad-approval';
import { markAdNotificationsRead } from '@/helpers/admin-notifications';
import useAdminNotifications from '@/hooks/useAdminNotifications';

const SPONSOR_LABELS = {
    gold: "זהב",
    silver: "כסף",
    bronze: "ארד",
};

const Admin = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [isModalDeleteAdVisible, setIsModalDeleteAdVisible] = useState(false);
    const [sponsorToDelete, setSponsorToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("ads");
    const [ads, setAds] = useState([])
    const [adStatusFilter, setAdStatusFilter] = useState("pending")
    const { notifications: adminNotifications, unreadCount: unreadNotificationCount } =
        useAdminNotifications(true);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const goldCollectionRef = collection(db, 'sponsors');
                const querySnapshot = await getDocs(goldCollectionRef);

                const fetchedSponsors = querySnapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));

                setSponsors(fetchedSponsors);

            } catch (error) {
                console.error("Error fetching sponsors:", error);
                Sentry.captureException(`Error fetching sponsors`, {
                    tags: {
                        component: "Admin"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        const fetchAds = async () => {
            try {
                const adsRef = collection(db, "ads");
                const filterQuery = where("availableUntil", ">", new Date());
                const q = query(adsRef, filterQuery, orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const fetchedAds = querySnapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));

                setAds(fetchedAds);

            } catch (error) {
                console.error("Error fetching ads:", error);
                Sentry.captureException(`Error fetching ads`, {
                    tags: {
                        component: "Admin"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        };

        fetchSponsors()
        fetchAds()
    }, [refresh])

    const filteredAds = useMemo(() => {
        if (adStatusFilter === "all") return ads;
        return ads.filter((ad) => getAdStatus(ad) === adStatusFilter);
    }, [ads, adStatusFilter]);

    const pendingCount = useMemo(
        () => ads.filter((ad) => isAdPending(ad)).length,
        [ads]
    );

    const deleteSponsorFromFirebase = async (sponsorId) => {
        try {
            const adDocRef = doc(db, 'sponsors', sponsorId);
            await deleteDoc(adDocRef);

            const imageRef = ref(storage, `sponsors/${sponsorId}`);

            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error deleting sponsor:", error);
            Sentry.captureException(`Error deleting sponsor`, {
                tags: {
                    component: "Admin"
                },
                extra: {
                    info: error
                }
            });
        }
    };

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
                    component: "Admin"
                },
                extra: {
                    info: error
                }
            });
        }
    };

    const updateAdStatus = async (adId, status) => {
        try {
            await updateDoc(doc(db, "ads", adId), {
                status,
                reviewedAt: new Date(),
            });
            await markAdNotificationsRead(adId);
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error("Error updating ad status:", error);
            Sentry.captureException(`Error updating ad status`, {
                tags: {
                    component: "Admin"
                },
                extra: {
                    info: error
                }
            });
        }
    };

    const closeModal = () => {
        setIsModalVisible(false)
        setSponsorToDelete(null);
    };

    const closeModalDeleteAd = () => {
        setIsModalDeleteAdVisible(false)
        setAdToDelete(null);
    };

    const handleDeleteButtonModal = () => {
        try {
            deleteSponsorFromFirebase(sponsorToDelete?.id)
            setRefresh(prev => !prev);
        } catch (err) {
            console.log(err)
        }
        closeModal()
    }

    const handleDeleteAdButtonModal = () => {
        try {
            deleteAdFromFirebase(adToDelete?.id)
            setRefresh(prev => !prev);
        } catch (err) {
            console.log(err)
        }
        closeModalDeleteAd()
    }

    const handleDeleteButton = (sponsor) => {
        setIsModalVisible(true)
        setSponsorToDelete(sponsor);
    }

    const handleDeleteAdButton = (ad) => {
        setIsModalDeleteAdVisible(true)
        setAdToDelete(ad);
    }

    const getAdCardTitle = (ad) =>
        ad.title || ad.name || ad.breed || ad.seed_type || ad.accessory || ad.category || "מודעה";

    return (
        <div className="admin-page" dir="rtl">
            <section className="account-hero admin-hero">
                <div className="account-hero-copy">
                    <span className="section-kicker">ניהול האתר</span>
                    <h1>אזור המנהל</h1>
                    <p>אישור מודעות, מעקב אחרי התראות וניהול ספונסורים במקום אחד.</p>
                </div>
                {activeTab === "sponsors" && (
                    <button
                        type="button"
                        className="account-primary-button"
                        onClick={() => navigate('/admin/add-sponsor')}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        הוסף ספונסור
                    </button>
                )}
            </section>

            <section className="account-stats" aria-label="סיכום ניהול">
                <div>
                    <strong>{pendingCount}</strong>
                    <span>ממתינות לאישור</span>
                </div>
                <div>
                    <strong>{ads.length}</strong>
                    <span>מודעות פעילות</span>
                </div>
                <div>
                    <strong>{unreadNotificationCount}</strong>
                    <span>התראות חדשות</span>
                </div>
                <div>
                    <strong>{sponsors.length}</strong>
                    <span>ספונסורים</span>
                </div>
            </section>

            {unreadNotificationCount > 0 && (
                <section className="admin-notifications-panel">
                    <h2>
                        <FontAwesomeIcon icon={faBell} />
                        התראות חדשות ({unreadNotificationCount})
                    </h2>
                    {adminNotifications.map((notification) => (
                        <button
                            key={notification.id}
                            type="button"
                            className="admin-notification-item"
                            onClick={() => {
                                setActiveTab("ads");
                                setAdStatusFilter("pending");
                                const matchedAd = ads.find((ad) => ad.id === notification.adId);
                                if (matchedAd) {
                                    navigate(getListingPath(matchedAd), { state: { ad: matchedAd } });
                                }
                            }}
                        >
                            <strong>{notification.title}</strong>
                            <span>{notification.category}</span>
                            {notification.location && <span>{notification.location}</span>}
                            <span className="admin-notification-cta">ממתין לאישור</span>
                        </button>
                    ))}
                </section>
            )}

            <section className="account-panel">
                <div className="admin-tabs">
                    <button
                        type="button"
                        className={`admin-tab ${activeTab === "ads" ? "active" : ""}`}
                        onClick={() => setActiveTab("ads")}
                    >
                        מודעות
                        {pendingCount > 0 && <span className="admin-tab-badge">{pendingCount}</span>}
                    </button>
                    <button
                        type="button"
                        className={`admin-tab ${activeTab === "sponsors" ? "active" : ""}`}
                        onClick={() => setActiveTab("sponsors")}
                    >
                        ספונסורים
                    </button>
                </div>

                {activeTab === "sponsors" ? (
                    sponsors.length > 0 ? (
                        <div className="account-card-list">
                            {sponsors.map((sponsor) => (
                                <article
                                    key={sponsor.id}
                                    className={`account-card sponsor-tier sponsor-tier--${sponsor.sponsor}`}
                                >
                                    {sponsor.photo && (
                                        <div className="account-card-image">
                                            <img src={sponsor.photo} alt={sponsor.sponsor} />
                                        </div>
                                    )}
                                    <div className="account-card-body">
                                        <span className={`account-status sponsor-status--${sponsor.sponsor}`}>
                                            {SPONSOR_LABELS[sponsor.sponsor] || sponsor.sponsor}
                                        </span>
                                        <h3>{sponsor.link}</h3>
                                        <p className="account-card-meta">
                                            <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                                                פתיחת הקישור
                                            </a>
                                        </p>
                                    </div>
                                    <div className="account-card-actions">
                                        <button
                                            type="button"
                                            className="account-action account-action--delete"
                                            onClick={() => handleDeleteButton(sponsor)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            מחק
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="account-empty">
                            <h3>אין ספונסורים עדיין</h3>
                            <p>אפשר להוסיף ספונסור חדש מתי שתרצו.</p>
                        </div>
                    )
                ) : (
                    <>
                        <div className="admin-filters">
                            {[
                                { value: "pending", label: `ממתינות (${pendingCount})` },
                                { value: "approved", label: "מאושרות" },
                                { value: "rejected", label: "נדחות" },
                                { value: "all", label: "הכל" },
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    className={`admin-filter ${adStatusFilter === filter.value ? "active" : ""}`}
                                    onClick={() => setAdStatusFilter(filter.value)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {filteredAds.length > 0 ? (
                            <div className="account-card-list">
                                {filteredAds.map((ad) => {
                                    const status = getAdStatus(ad);
                                    const title = getAdCardTitle(ad);
                                    const image = ad.photos?.[0] || require('@/assets/no-image.jpg');

                                    return (
                                        <article key={ad.id} className="account-card">
                                            <button
                                                type="button"
                                                className="account-card-image"
                                                onClick={() => navigate(getListingPath(ad), { state: { ad } })}
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
                                                {ad.price ? <strong className="account-card-price">₪{ad.price}</strong> : null}
                                            </div>
                                            <div className="account-card-actions">
                                                {status === AD_STATUS.PENDING && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="account-action account-action--approve"
                                                            onClick={() => updateAdStatus(ad.id, AD_STATUS.APPROVED)}
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                            אשר
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="account-action account-action--reject"
                                                            onClick={() => updateAdStatus(ad.id, AD_STATUS.REJECTED)}
                                                        >
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                            דחה
                                                        </button>
                                                    </>
                                                )}
                                                {status === AD_STATUS.REJECTED && (
                                                    <button
                                                        type="button"
                                                        className="account-action account-action--approve"
                                                        onClick={() => updateAdStatus(ad.id, AD_STATUS.APPROVED)}
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                        אשר
                                                    </button>
                                                )}
                                                {status === AD_STATUS.APPROVED && (
                                                    <button
                                                        type="button"
                                                        className="account-action account-action--reject"
                                                        onClick={() => updateAdStatus(ad.id, AD_STATUS.REJECTED)}
                                                    >
                                                        <FontAwesomeIcon icon={faEyeSlash} />
                                                        הסתר
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="account-action account-action--delete"
                                                    onClick={() => handleDeleteAdButton(ad)}
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
                                <h3>לא נמצאו מודעות</h3>
                                <p>נסו לשנות את הסינון או להמתין למודעות חדשות.</p>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Modal isVisible={isModalVisible} title="מחיקת ספונסור" onClose={closeModal}>
                <div className="modal-content-custom">
                    <p>האם אתה בטוח שברצונך למחוק את ספונסור זה?</p>
                    <div className="modal-buttons-custom">
                        <button className="cancel-button" onClick={closeModal}>ביטול</button>
                        <button className="confirm-delete-button" onClick={handleDeleteButtonModal}>מחק</button>
                    </div>
                </div>
            </Modal>

            <Modal isVisible={isModalDeleteAdVisible} title="מחיקת מודעה" onClose={closeModalDeleteAd}>
                <div className="modal-content-custom">
                    <p>האם אתה בטוח שברצונך למחוק את מודעה זה?</p>
                    <div className="modal-buttons-custom">
                        <button className="cancel-button" onClick={closeModalDeleteAd}>ביטול</button>
                        <button className="confirm-delete-button" onClick={handleDeleteAdButtonModal}>מחק</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Admin;
