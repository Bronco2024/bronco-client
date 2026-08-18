import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSponsor.css'
import { db, storage } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from '@components/utils/modal/Modal';

const SPONSOR_OPTIONS = [
    { value: "gold", label: "זהב" },
    { value: "silver", label: "כסף" },
    { value: "bronze", label: "ארד" },
];

const AddSponsor = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        link: "",
        sponsor: "",
        photo: ""
    })

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: (e.target.files[0]) });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const metadata = {
            contentType: formData.photo.type,
        };

        const imageId = uuidv4();
        const photoRef = ref(storage, `sponsors/${imageId}`)
        await uploadBytes(photoRef, formData.photo, metadata);
        const photoURL = await getDownloadURL(photoRef);

        await setDoc(doc(db, "sponsors", imageId), {
            ...formData,
            photo: photoURL,
            imageId: imageId
        })

        setFormData({
            link:"",
            photo:"",
            sponsor:""
        })
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/admin');
    };


    return (
        <div className="add-sponsor-page" dir="rtl">
            <section className="add-sponsor-card">
                <span className="section-kicker">ניהול האתר</span>
                <h1>הוסף ספונסור</h1>
                <p>הוסיפו לוגו, קישור וסוג חבילה. אפשר לחזור לרשימה אחרי השמירה.</p>
                <form className="add-sponsor-form" onSubmit={handleSubmit}>
                    <label htmlFor='link'>קישור</label>
                    <input
                        type='text'
                        id="link"
                        name='link'
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://"
                        required
                    />

                    <label htmlFor='sponsor'>סוג ספונסור</label>
                    <select
                        id='sponsor'
                        name="sponsor"
                        value={formData.sponsor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר סוג</option>
                        {SPONSOR_OPTIONS.map((sponsor) => (
                            <option key={sponsor.value} value={sponsor.value}>
                                {sponsor.label}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="photo">לוגו / תמונה</label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />

                    <div className="add-sponsor-actions">
                        <button type="submit" className="publish-sponsor-button">שמירת ספונסור</button>
                        <button
                            type="button"
                            className="add-sponsor-back"
                            onClick={() => navigate('/admin')}
                        >
                            חזרה לניהול
                        </button>
                    </div>
                </form>
            </section>

            <Modal isVisible={showModal} title="ספונסור נוסף" onClose={closeModal}>
                <div className="modal-content-custom-add-sponsors">
                    <p>ספונסור נוסף בהצלחה!</p>
                    <div className="modal-buttons-custom-add-sponsors">
                        <button className="close-button-add-sponsors" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AddSponsor;
