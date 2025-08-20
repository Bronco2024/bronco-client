import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { doc, updateDoc, arrayRemove, arrayUnion, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import './UpdateAd.css'
import { BREEDS, CATEGORIES, EXTENDED_CATEGORIES, SEEDS_TYPES, SEMEN_TYPES, ACCESSORIES_TPYES, DISTRICTS, DISTRICT_NAMES } from "@components/utils/constants/Constants";
import { v4 as uuidv4 } from 'uuid';
import Modal from "@components/utils/modal/Modal"
import { DeletedAttributesAfterUpdateForm } from '@components/utils/constants/Functions';
import * as Sentry from "@sentry/react";

const UpdateAd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const ad = location.state?.ad;
    const [newPhotos, setNewPhotos] = useState({ photos: [] })
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        phoneNumber: '',
        district: '',
        location: '',
        price: '',
        photos: [],
    });

    useEffect(() => {
        if (ad) {
            setFormData(ad)
        }
    }, [ad])

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
        setNewPhotos({ ...newPhotos, photos: Array.from(e.target.files) });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDeletePhoto = async (photoUrl) => {
        const storageRef = ref(storage, `ads/${ad.id}/${photoUrl.split('%2F')[2].split('?')[0]}`);

        try {
            await deleteObject(storageRef);

            const adRef = doc(db, "ads", ad.id);
            await updateDoc(adRef, {
                photos: arrayRemove(photoUrl),
            });

            setFormData((prevData) => ({
                ...prevData,
                photos: prevData.photos.filter((url) => url !== photoUrl),
            }));
        } catch (error) {
            console.error("Error deleting photo:", error);
            Sentry.captureException(`Error deleting photo`, {
                tags: {
                    component: "UpdateAd"
                },
                extra: {
                    info: error
                }
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let dataToSubmit;

        if (!ad?.id) {
            console.error("Ad ID is missing.");
            Sentry.captureException(`Ad ID is missing`, {
                tags: {
                    component: "UpdateAd"
                },
                extra: {
                    info: ad
                }
            });
            return;
        }

        dataToSubmit = {
            ...formData,
            createdAt: Timestamp.now(),
            availableUntil: new Timestamp(formData.availableUntil.seconds, formData.availableUntil.nanoseconds)
        }

        dataToSubmit = DeletedAttributesAfterUpdateForm(dataToSubmit);

        const adRef = doc(db, "ads", ad.id);

        try {
            await setDoc(adRef, dataToSubmit);
        } catch (error) {
            console.error("Error updating ad:", error);
            Sentry.captureException(`Error updating ad`, {
                tags: {
                    component: "UpdateAd"
                },
                extra: {
                    info: error
                }
            });
        }

        if (newPhotos.photos.length > 0) {
            const photoURLs = await Promise.all(
                newPhotos.photos.map(async (photo) => {
                    const photoRef = ref(storage, `ads/${ad.id}/${uuidv4()}`);
                    await uploadBytes(photoRef, photo);
                    return await getDownloadURL(photoRef);
                })
            );

            try {
                await Promise.all(photoURLs.map(photoURL => {
                    return updateDoc(adRef, {
                        photos: arrayUnion(photoURL)
                    });
                }));
                setNewPhotos({ photos: [] })

            } catch (error) {
                console.error("Error updating ad:", error);
                Sentry.captureException(`Error updating ad`, {
                    tags: {
                        component: "UpdateAd"
                    },
                    extra: {
                        info: error
                    }
                });
            }
        }
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/profile');
    };

    return (
        <div className='update-ad-container' style={{ textAlign: 'right' }}>
            <h1>דף עדכון מודעה</h1>
            <form className="update-ad-form" onSubmit={handleSubmit}>

                {((formData.category !== "") &&
                    (formData.category !== "סוסים") &&
                    (formData.category !== "זרע") &&
                    (formData.category !== "אביזרים")) && (
                        <div className='update-ad-form'>
                            <label htmlFor="title">כותרת</label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )
                }

                <label htmlFor="category"> קטגוריה</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">בחר קטגוריה</option>
                    {currentUser?.isAdmin ? (
                        EXTENDED_CATEGORIES.map((cat, index) => (
                            <option key={index} value={cat.label}>
                                {cat.label}
                            </option>
                        ))
                    ) : (
                        CATEGORIES.map((cat, index) => (
                            <option key={index} value={cat.label}>
                                {cat.label}
                            </option>
                        ))
                    )}
                </select>

                {formData.category === "סוסים" && (
                    <div className="update-ad-form">
                        <label htmlFor="breed">גזע</label>
                        <select
                            id="breed"
                            name="breed"
                            value={formData?.breed}
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
                            value={formData?.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">בחר מין</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                        </select>

                        <div className="update-ad-form">

                            <label htmlFor="age">גיל</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData?.age}
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
                                    checked={formData?.hasCertificate}
                                    onChange={handleInputChange}
                                />

                                &nbsp; עם תעודה
                            </label>
                        </div>
                    </div>
                )}

                {formData.category === "זרע" && (
                    <div className="update-ad-form">
                        <label htmlFor="seeds_types">סוג זרע</label>
                        <div style={{ display: 'flex', flexDirection: 'row', direction: 'rtl', gap: '10px' }}>

                            <select
                                id="seeds_types"
                                name="seed_type"
                                value={formData?.seed_type}
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

                        <div style={{ marginTop: '3%', marginBottom: '1%' }}>
                            <label htmlFor="hasCertificate">
                                <input
                                    type="checkbox"
                                    id="hasCertificate"
                                    name="hasCertificate"
                                    checked={formData.hasCertificate || false}
                                    onChange={handleInputChange}
                                />

                                &nbsp; עם תעודת הרבעה
                            </label>
                        </div>
                    </div>
                )}

                {formData.category === "אביזרים" && (
                    <div className="update-ad-form" >
                        <label htmlFor="accessories_type">סוג מוצר</label>
                        <select
                            id="accessory"
                            name="accessory"
                            value={formData.accessory || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="">בחר סוג מוצר</option>
                            {ACCESSORIES_TPYES.map((accessory, index) => (
                                <option key={index} value={accessory}>
                                    {accessory}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <label htmlFor="description">תיאור</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData?.description}
                    onChange={handleChange}
                    required
                    style={{ height: 100 }}
                />

                <label htmlFor="phoneNumber">שם איש קשר</label>
                <input
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="phoneNumber">מספר טלפון</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData?.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="district">אזור</label>
                <div style={{ display: 'flex', flexDirection: 'row', direction: 'rtl', gap: '10px' }}>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר אזור</option>
                        {Object.keys(DISTRICTS).map((districtKey) => (
                            <option key={districtKey} value={districtKey}>
                                {DISTRICT_NAMES[districtKey]}
                            </option>
                        ))}
                    </select>

                    {formData.district && (
                        <>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="">בחר מיקום</option>
                                {DISTRICTS[formData.district].map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                {((formData.category === "סוסים") ||
                    (formData.category === "זרע") ||
                    (formData.category === "אביזרים")) && (
                        <div className='update-ad-form'>
                            <label htmlFor="price">מחיר</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )
                }

                <label htmlFor="photos">תמונות</label>
                <input
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="current-photos">
                    {formData.photos.length > 0 && (
                        <div>
                            <h3>תמונות קיימות</h3>
                            {formData.photos.map((photoUrl, index) => (
                                <div key={index} className="photo-item">
                                    <img src={photoUrl} alt={`Ad ${index + 1}`} style={{ width: 100, height: 100 }} />
                                    <button type="button" className='del-photo-button' onClick={() => handleDeletePhoto(photoUrl)}>מחק</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" className="update-button">עדכן מודעה</button>

            </form>

            <Modal isVisible={showModal} title="עדכון מודעה" onClose={closeModal}>
                <div className="modal-content-custom-updatead">
                    <p>המודעה עודכנה בהצלחה!</p>
                    <div className="modal-buttons-custom-updatead">
                        <button className="close-button-updatead" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UpdateAd;