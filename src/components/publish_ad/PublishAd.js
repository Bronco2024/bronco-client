import React, { useEffect, useState } from 'react';
import './PublishAd.css';
import { db, storage } from '../../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Modal from '../utils/modal/Modal';
import { BREEDS, CATEGORIES, SEEDS_TYPES, SEMEN_TYPES } from "../utils/constants/Constants";

const PublishAd = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const { currentUser, setCurrentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        phoneNumber: '',
        location: '',
        price: '',
        photos: [],
    });

    useEffect(() => {
        const FetchCities = async () => {
            let data = {
                resource_id: 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37',
                limit: 1500//1273
            };

            let cities_arr = [];

            await fetch(`https://data.gov.il/api/action/datastore_search?resource_id=${data.resource_id}&limit=${data.limit}`)
                .then(response => response.json())
                .then(data => {
                    data.result.records.map(item => cities_arr.push((item['שם_ישוב'].trim())));
                })
                .catch(error => console.error('Error:', error));
            setCities(cities_arr);
        }
        FetchCities()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "price" || name === "age") {
            setFormData({ ...formData, [name]: Number(value) });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photos: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.category === "סוסים" && !Object.hasOwn(formData, 'hasCertificate')) {
            setFormData((prevState) => {
                return { ...prevState, hasCertificate: false };
            });
        }

        try {
            const date = new Date();
            const adId = uuidv4();

            const photoURLs = await Promise.all(
                formData.photos.map(async (photo) => {
                    const photoRef = ref(storage, `ads/${adId}/${uuidv4()}`);
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
            });

            await updateDoc(doc(db, "users", currentUser.uid), {
                numberOfAds: currentUser.numberOfAds - 1
            });

            setCurrentUser({
                ...currentUser,
                numberOfAds: currentUser.numberOfAds - 1
            });

            setFormData({
                title: '',
                category: '',
                description: '',
                phoneNumber: '',
                location: '',
                price: '',
                photos: [],
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
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

                <label htmlFor="category"> קטגוריה</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">בחר קטגוריה</option>
                    {CATEGORIES.map((cat, index) => (
                        <option key={index} value={cat.label}>
                            {cat.label}
                        </option>
                    ))}
                </select>

                {formData.category === "סוסים" && (
                    <div className="publish-ad-form">
                        <label htmlFor="breed">גזע</label>
                        <select
                            id="breed"
                            name="breed"
                            value={formData.breed || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="">בחר גזע</option>
                            {BREEDS.map((breed, index) => (
                                <option key={index} value={breed}>
                                    {breed}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="gender">מין</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">בחר מין</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                        </select>

                        <div className="publish-ad-form">

                            <label htmlFor="age">גיל</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '3%', marginBottom: '1%' }}>
                            <label htmlFor="hasCertificate">
                                <input
                                    type="checkbox"
                                    id="hasCertificate"
                                    name="hasCertificate"
                                    checked={formData.hasCertificate || false}
                                    onChange={handleInputChange}
                                />

                                &nbsp; עם תעודה
                            </label>
                        </div>
                    </div>
                )}

                {formData.category === "זרע" && (
                    <div className="publish-ad-form" >
                        <label htmlFor="seeds_types">סוג זרע</label>
                        <div style={{ display:'flex', flexDirection: 'row', direction: 'rtl', gap:'10px' }}>
                            <select
                                id="seeds_types"
                                name="seed_type"
                                value={formData.seed_type || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">בחר סוג זרע</option>
                                {SEEDS_TYPES.map((seed, index) => (
                                    <option key={index} value={seed}>
                                        {seed}
                                    </option>
                                ))}
                            </select>

                            <select
                                id="semen_types"
                                name="semen_type"
                                value={formData.semen_type || ""}
                                onChange={handleChange}
                                required
                            >
                                {SEMEN_TYPES.map((semen, index) => (
                                    <option key={index} value={semen}>
                                        {semen}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <label htmlFor="description">תיאור</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    style={{ height: 100 }}
                />

                <label htmlFor="phoneNumber">מספר טלפון</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="location">אזור</label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">בחר מיקום</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

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

            <Modal isVisible={showModal} title="מודעה פורסמה" onClose={closeModal}>
                <div className="modal-content-custom-publishad">
                    <p>המודעה פורסמה בהצלחה!</p>
                    <div className="modal-buttons-custom-publishad">
                        <button className="close-button-publishad" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PublishAd;
