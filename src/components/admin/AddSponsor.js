import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSponsor.css'
import { db, storage } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from '@components/utils/modal/Modal';

const AddSponsor = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        link: "",
        sponsor: "",
        photo: ""
    })

    const sponsors = [
        "gold",
        "silver",
        "bronze"
    ]

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
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
        navigate('/');
    };


    return (
        <div className="add-sponsor-container">
            <h1>הוסף ספונסור</h1>
            <form className="add-sponsor-form" onSubmit={handleSubmit}>
                <label htmlFor='link'>לינק</label>
                <input
                    type='text'
                    id="link"
                    name='link'
                    value={formData.link}
                    onChange={handleChange}
                    required
                />

                <label htmlFor='sponsor'>ספונסר</label>
                <select
                    id='sponsor'
                    name="sponsor"
                    value={formData.sponsor}
                    onChange={handleChange}
                    required
                >
                    <option value="">בחר סוג</option>
                    {sponsors.map((sponsor, index) => (
                        <option key={index} value={sponsor}>
                            {sponsor}
                        </option>
                    ))}
                </select>

                <label htmlFor="photo">תמונה</label>
                <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button type="submit" className="publish-sponsor-button">פרסם ספונסור</button>

            </form>

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