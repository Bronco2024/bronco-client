import React, { useEffect, useState } from "react";
import './Admin.css'
import { db, storage } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Modal from '../utils/modal/Modal';
import { ref, deleteObject } from "firebase/storage";

const Admin = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sponsorToDelete, setSponsorToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);

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
            }
        };

        fetchSponsors()
    }, [refresh])

    const deleteSponsorFromFirebase = async (sponsorId) => {
        try {
            const adDocRef = doc(db, 'sponsors', sponsorId);
            await deleteDoc(adDocRef);

            const imageRef = ref(storage, `sponsors/${sponsorId}`);

            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false)
        setSponsorToDelete(null);
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

    const handleDeleteButton = (sponsor) => {
        setIsModalVisible(true)
        setSponsorToDelete(sponsor);
    }

    return (
        <div className="admin-container">
            <h1>דף ניהול ספונסירים</h1>

            <button
                className="sponsor-add-button"
                onClick={() => {
                    navigate('/add-sponsor')
                }}>הוסף ספונסור</button>

            <div className="sponsors-container">
                <h3>ספונסירים</h3>
                {sponsors.length > 0 ? (
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
                                <img src={sponsor.photo} alt="pojk" className="sponsor-image" />
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
        </div>
    )
}

export default Admin;