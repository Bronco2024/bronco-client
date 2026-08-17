import React, { useEffect, useMemo, useState } from "react";
import './Admin.css'
import { db, storage } from '@/firebase';
import { collection, getDocs, deleteDoc, doc, where, orderBy, query, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Modal from '@components/utils/modal/Modal';
import { ref, deleteObject, listAll } from "firebase/storage";
import * as Sentry from "@sentry/react";
import {
    AD_STATUS,
    AD_STATUS_LABELS,
    getAdStatus,
    isAdPending,
} from '@/helpers/ad-approval';


const Admin = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [isModalDeleteAdVisible, setIsModalDeleteAdVisible] = useState(false);
    const [sponsorToDelete, setSponsorToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [showAdsOrSponsors, setShowAdsOrSponsors] = useState("sponsors")
    const [ads, setAds] = useState([])
    const [adStatusFilter, setAdStatusFilter] = useState("pending")

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const goldCollectionRef = collection(db, 'sponsors');
                const querySnapshot = await getDocs(goldCollectionRef);

                const fetchedSponsors = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
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

                const ads = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAds(ads);

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

    const changeShowAdsOrSponsors = (e) => {
        setShowAdsOrSponsors(e.target.value)
    }

    const getAdCardTitle = (ad) =>
        ad.title || ad.name || ad.breed || ad.seed_type || ad.accessory || ad.category || "מודעה";

    return (
        <div className="admin-container">
            <h1>ניהול {showAdsOrSponsors === 'sponsors' ? 'ספונסירים' : 'מודעות'}</h1>

            <button
                className="sponsor-add-button"
                onClick={() => {
                    navigate('/admin/add-sponsor')
                }}>הוסף ספונסור</button>

            <div className="sponsors-container">
                <select
                    className="select-type"
                    value={showAdsOrSponsors}
                    onChange={changeShowAdsOrSponsors}
                >
                    <option value="sponsors">ספונסורים</option>
                    <option value="ads">מודעות</option>
                </select>

                {showAdsOrSponsors === "sponsors" ? (
                    sponsors.length > 0 ? (
                        sponsors.map(sponsor => (
                            <div
                                key={sponsor.id}
                                className="sponsor-card"
                                style={{
                                    borderColor: sponsor.sponsor === "gold" ? "#FFD700"
                                        : sponsor.sponsor === "silver" ? "#C0C0C0"
                                            : "#cd7f32",
                                    borderWidth: '3px',
                                    borderRadius: '10px'
                                }}
                            >
                                {sponsor.photo && (
                                    <img src={sponsor.photo} alt="pojk" className="sponsor-image" loading="lazy" />
                                )}
                                <div className="sponsor-details">
                                    <h4 style={{ direction: 'rtl' }}>לינק:  <a href={sponsor.link} target="_blank" rel="noopener noreferrer">{sponsor.link}</a></h4>
                                    <p style={{ direction: 'rtl' }}>סוג ספונסור: <b>{sponsor.sponsor}</b></p>
                                </div>

                                <div className="sponsor-crud">
                                    <button className='sponsor-delete-button' onClick={() => handleDeleteButton(sponsor)}>מחק</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>לא נמצאו ספונסירים</p>
                    )
                ) : (
                    <>
                        <div className="admin-ads-toolbar">
                            <select
                                className="select-type"
                                value={adStatusFilter}
                                onChange={(event) => setAdStatusFilter(event.target.value)}
                            >
                                <option value="pending">ממתינות לאישור ({pendingCount})</option>
                                <option value="approved">מאושרות</option>
                                <option value="rejected">נדחות</option>
                                <option value="all">כל המודעות הפעילות</option>
                            </select>
                        </div>

                        {filteredAds.length > 0 ? (
                            filteredAds.map(ad => {
                                const status = getAdStatus(ad);

                                return (
                                    <div
                                        key={ad.id}
                                        className="sponsor-card admin-ad-card"
                                    >
                                        {ad.photos && ad.photos[0] ? (
                                            <img
                                                src={ad.photos[0]}
                                                alt={getAdCardTitle(ad)}
                                                className="sponsor-image"
                                                loading="lazy"
                                                onClick={() => {
                                                    navigate('/item', { state: { ad } })
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={require('@/assets/no-image.jpg')}
                                                alt={ad.category}
                                                className="sponsor-image"
                                                loading="lazy"
                                                onClick={() => {
                                                    navigate('/item', { state: { ad } })
                                                }}
                                            />
                                        )}
                                        <div className="sponsor-details">
                                            <span className={`admin-ad-status admin-ad-status--${status}`}>
                                                {AD_STATUS_LABELS[status]}
                                            </span>
                                            <h4 style={{ direction: 'rtl' }}>{getAdCardTitle(ad)}</h4>
                                            <p style={{ direction: 'rtl' }}>{ad.category}</p>
                                            <p style={{ direction: 'rtl' }}>{ad.description}</p>
                                            <p style={{ direction: 'rtl' }}>{ad.location || ad.district || ""}</p>
                                            {ad.price && <p style={{ direction: 'rtl' }}>₪{ad.price}</p>}
                                        </div>

                                        <div className="sponsor-crud admin-ad-actions">
                                            {status === AD_STATUS.PENDING && (
                                                <>
                                                    <button
                                                        className="admin-approve-button"
                                                        onClick={() => updateAdStatus(ad.id, AD_STATUS.APPROVED)}
                                                    >
                                                        אשר
                                                    </button>
                                                    <button
                                                        className="admin-reject-button"
                                                        onClick={() => updateAdStatus(ad.id, AD_STATUS.REJECTED)}
                                                    >
                                                        דחה
                                                    </button>
                                                </>
                                            )}
                                            {status === AD_STATUS.REJECTED && (
                                                <button
                                                    className="admin-approve-button"
                                                    onClick={() => updateAdStatus(ad.id, AD_STATUS.APPROVED)}
                                                >
                                                    אשר
                                                </button>
                                            )}
                                            {status === AD_STATUS.APPROVED && (
                                                <button
                                                    className="admin-reject-button"
                                                    onClick={() => updateAdStatus(ad.id, AD_STATUS.REJECTED)}
                                                >
                                                    הסתר
                                                </button>
                                            )}
                                            <button className='sponsor-delete-button' onClick={() => handleDeleteAdButton(ad)}>מחק</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>לא נמצאו מודעות</p>
                        )}
                    </>
                )}
            </div>

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