import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { db, storage } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import './Profile.css';
import Modal from '../utils/modal/Modal';

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userAds, setUserAds] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchUserAds = async () => {
            if (!currentUser) return;

            const adsCollection = collection(db, 'ads');
            const q = query(adsCollection, where("userId", "==", currentUser.uid));

            try {
                const querySnapshot = await getDocs(q);
                const ads = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserAds(ads);
            } catch (error) {
                console.error("Error fetching user ads:", error);
            }
        };

        fetchUserAds();
    }, [currentUser, refresh]);

    const numberOfAds = (currentUser) => {
        if (currentUser?.numberOfAds > 1000) {
            return "ללא הגבלה";
        }
        return currentUser?.numberOfAds;
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('he-IL');
        }
        return '';
    };

    const handleUpdateButton = (ad) => {
        navigate('/update_ad', { state: { ad } })
    }

    const handleDeleteButton = (ad) => {
        setIsModalVisible(true)
        setAdToDelete(ad);
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setAdToDelete(null);
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
        }
    };

    return (
        <div className="profile-container">
            <h1>ברוך הבא לאזור האישי</h1>

            {currentUser?.isSubscribed === false
                ? <p>לא רשום</p>
                : <p>מספר מודעות שנותרו לך: {numberOfAds(currentUser)}</p>
            }

            <button onClick={() => navigate('/subscribe')} className="subscribe-button-profile">קניית מודעות</button>

            <div className="ads-container">
                <h3>המודעות שלך</h3>
                {userAds.length > 0 ? (
                    userAds.map(ad => (
                        <div key={ad.id} className="ad-card1">
                            {ad.photos && ad.photos[0] && (
                                <img src={ad.photos[0]} alt={ad.title} className="ad-image-profile" />
                            )}
                            <div className="ad-details">
                                <h4 className="ad-title-profile">{ad.title}</h4>
                                <p>{ad.description}</p>
                                <p className="ad-price-profile">₪{ad.price}</p>
                                <small>תקף עד: {formatDate(ad?.availableUntil)}</small>
                            </div>

                            <div className='ad-crud'>
                                <button className='ad-delete-button' onClick={() => handleDeleteButton(ad)}>מחק</button>
                                <button className='ad-update-button' onClick={() => handleUpdateButton(ad)}>עדכן</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>לא נמצאו מודעות</p>
                )}
            </div>

            <Modal isVisible={isModalVisible} title="מחיקת מודעה" onClose={closeModal}>
                <div className="modal-content-custom">
                    <p>האם אתה בטוח שברצונך למחוק את מודעה זו?</p>
                    <div className="modal-buttons-custom">
                        <button className="cancel-button" onClick={closeModal}>ביטול</button>
                        <button className="confirm-delete-button" onClick={handleDeleteButtonModal}>מחק</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;