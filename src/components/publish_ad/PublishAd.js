import React, { useState } from 'react';
import './PublishAd.css';
import { db, storage } from '../../firebase';
import { addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const PublishAd = () => {
    const navigate = useNavigate();

    const { currentUser, setCurrentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        phoneNumber: '',
        price: '',
        photos: []
    });

    const categories = [
        { path: 'horses', label: 'סוסים' },
        { path: 'seeds', label: 'זרע' },
        { path: 'accessories', label: 'אביזרים' },
        { path: 'boarding', label: 'פנסיון' },
        { path: 'exhibitors', label: 'מציגים' },
        { path: 'breeders', label: 'מפרזילים' },
        { path: 'schools', label: 'בתי ספר' },
        { path: 'trips', label: 'טיולים' },
        { path: 'products', label: 'תנויות' },
        { path: 'shows-and-competitions', label: 'תצוגות ותחריות' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photos: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const date = new Date();

            const adId = uuidv4(); 

            const photoURLs = await Promise.all(
                formData.photos.map(async (photo, index) => {
                    const photoRef = ref(storage, `ads/${adId}/${index}`); 
                    await uploadBytes(photoRef, photo);
                    return await getDownloadURL(photoRef);
                })
            );

            date.setMonth(date.getMonth() + 1);

            await setDoc(doc(db, "ads", adId), {
                ...formData,
                photos: photoURLs,
                userId: currentUser.uid,
                createdAt: new Date(),
                availableUntil: date
            })

            
            await updateDoc(doc(db, "users", currentUser.uid),{
                numberOfAds: currentUser.numberOfAds - 1
            })

            setCurrentUser({
                ...currentUser,
                numberOfAds: currentUser.numberOfAds - 1
            });

            setFormData({
                title: '',
                category: '',
                description: '',
                phoneNumber: '',
                price: '',
                photos: []
            });
            setShowModal(true);

            
        } catch (error) {
            console.error("Error publishing ad:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/');
    };

    return (
        <div className="publish-ad-container" style={{ textAlign: 'right' }}>
            <h1>פרסם מודעה</h1>
            <form onSubmit={handleSubmit} className="publish-ad-form">
                <label htmlFor="title">כותרת</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <div className='publish-ad-select-div'>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required

                    >
                        <option value="">בחר קטגוריה</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat.label}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <label htmlFor="description">תיאור</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    style={{ height: 100 }}
                ></textarea>

                <label htmlFor="phoneNumber">מספר טלפון</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="price">מחיר</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="photos">תמונות</label>
                <input
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button type="submit" className="publish-button">פרסם מודעה</button>
            </form>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>!המודעה פורסמה בהצלחה</h2>
                        <button onClick={closeModal} className="close-button">סגור</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublishAd;
