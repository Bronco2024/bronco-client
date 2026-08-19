import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { doc, updateDoc, arrayRemove, arrayUnion, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import './UpdateAd.css'
import { BREEDS, CATEGORIES, EXTENDED_CATEGORIES, SEEDS_TYPES, SEMEN_TYPES, ACCESSORIES_TPYES } from "@components/utils/constants/Constants";
import { isPetMarketplaceCategory } from "@/data/pets";
import BreedSelect from "@/components/pets/BreedSelect";
import CitySelect from "@/components/pets/CitySelect";
import { PET_BREED_OTHER, resolvePetBreed } from "@/data/pet-breeds";
import { v4 as uuidv4 } from 'uuid';
import Modal from "@components/utils/modal/Modal"
import { DeletedAttributesAfterUpdateForm } from '@components/utils/constants/Functions';
import * as Sentry from "@sentry/react";
import FloatingInput from '../../my_components/FloatingInput';
import { isPhoneNumberIsraeliValid } from '@components/utils/constants/Functions';
import { getAdStatusAfterUpdate, AD_STATUS } from '@/helpers/ad-approval';
import { createPendingAdNotification } from '@/helpers/admin-notifications';

const UpdateAd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const ad = location.state?.ad;
    const [newPhotos, setNewPhotos] = useState({ photos: [] })
    const [newVideo, setNewVideo] = useState(null);

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
        video: null,
        breedCustom: '',
    });

    const [phoneValid, setPhoneValid] = useState(true);

    useEffect(() => {
        if (ad) {
            const data = { ...ad };
            if (data.ageInMonths != null && data.ageYears == null) {
                data.ageYears = Math.floor(data.ageInMonths / 12);
                data.ageMonths = data.ageInMonths % 12;
            }
            setFormData(data);
        }
    }, [ad])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "district") {
            setFormData({ ...formData, district: value, location: "" });
            return;
        }
        if (name === "price" || name === "ageYears" || name === "ageMonths") {
            let numericValue = Number(value);

            if (name === "ageYears") {
                numericValue = Math.max(0, numericValue); // no negative years
            }

            if (name === "ageMonths") {
                if (numericValue < 0) numericValue = 0;
                if (numericValue > 11) numericValue = 11;
            }

            setFormData({ ...formData, [name]: numericValue });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setNewPhotos({ ...newPhotos, photos: Array.from(e.target.files) });
    };

    const handleVideoChange = (e) => {
        if (e.target.files[0]) {
            setNewVideo(e.target.files[0]);
        }
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

    const handleDeleteVideo = async (videoUrl) => {
        const storageRef = ref(storage, `ads/${ad.id}/${videoUrl.split('%2F')[2].split('?')[0]}`);

        try {
            await deleteObject(storageRef);

            const adRef = doc(db, "ads", ad.id);
            await updateDoc(adRef, {
                video: null,
            });

            setFormData((prevData) => ({
                ...prevData,
                video: null,
            }));
        } catch (error) {
            console.error("Error deleting video:", error);
            Sentry.captureException(`Error deleting video`, {
                tags: { component: "UpdateAd" },
                extra: { info: error }
            });
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phoneValid === false) {
            return;
        }
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
            availableUntil: new Timestamp(formData.availableUntil.seconds, formData.availableUntil.nanoseconds),
            status: getAdStatusAfterUpdate(currentUser?.isAdmin),
        }

        if (formData.category === "סוסים" || isPetMarketplaceCategory(formData.category)) {
            const totalMonths =
                (Number(formData.ageYears) || 0) * 12 +
                (Number(formData.ageMonths) || 0);

            dataToSubmit.ageInMonths = totalMonths;
            delete dataToSubmit.age;
        }

        dataToSubmit.breed = resolvePetBreed(formData.breed, formData.breedCustom);
        delete dataToSubmit.breedCustom;

        dataToSubmit = DeletedAttributesAfterUpdateForm(dataToSubmit);

        const adRef = doc(db, "ads", ad.id);

        try {
            await setDoc(adRef, dataToSubmit);

            if (dataToSubmit.status === AD_STATUS.PENDING) {
                await createPendingAdNotification({
                    adId: ad.id,
                    ad: {
                        ...dataToSubmit,
                        publisherEmail: currentUser?.email || "",
                    },
                });
            }
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

        if (newVideo) {
            const videoRef = ref(storage, `ads/${ad.id}/${uuidv4()}`);
            await uploadBytes(videoRef, newVideo);
            const videoURL = await getDownloadURL(videoRef);

            try {
                await updateDoc(adRef, {
                    video: videoURL
                });
                setNewVideo(null);
            } catch (error) {
                console.error("Error updating ad video:", error);
                Sentry.captureException(`Error updating ad video`, {
                    tags: { component: "UpdateAd" },
                    extra: { info: error }
                });
            }
        }

        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/profile');
    };

    const isOtherHorseBreed =
        formData.category === "סוסים" && formData.breed === PET_BREED_OTHER;

    return (
        <div className="update-ad-container">
            <h1>עדכון מודעה</h1>
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

                        {isOtherHorseBreed && (
                            <>
                                <label htmlFor="breedCustom">פרט את הגזע</label>
                                <input
                                    id="breedCustom"
                                    name="breedCustom"
                                    value={formData?.breedCustom || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}

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
                            <div className="age-row">
                                <FloatingInput
                                    label={'שנים'}
                                    type={'number'}
                                    id={"ageYears"}
                                    value={formData.ageYears ?? ''}
                                    onChange={handleChange}
                                    min={"0"}
                                    placeholder={' '}
                                />
                                <FloatingInput
                                    label={'חודשים'}
                                    type={'number'}
                                    id={"ageMonths"}
                                    value={formData.ageMonths || ''}
                                    onChange={handleChange}
                                    min={"0"}
                                    max={"11"}
                                    placeholder={' '}
                                />
                            </div>
                        </div>

                        <div className="checkbox-row">
                            <label htmlFor="hasCertificate">
                                <input
                                    type="checkbox"
                                    id="hasCertificate"
                                    name="hasCertificate"
                                    checked={formData?.hasCertificate}
                                    onChange={handleInputChange}
                                />
                                עם תעודה
                            </label>
                        </div>
                    </div>
                )}

                {isPetMarketplaceCategory(formData.category) && formData.category !== "סוסים" && (
                    <div className="update-ad-form">
                        <BreedSelect
                            category={formData.category}
                            breed={formData?.breed || ""}
                            breedCustom={formData?.breedCustom || ""}
                            onChange={handleChange}
                        />

                        <label htmlFor="gender">מין</label>
                        <select
                            name="gender"
                            value={formData?.gender || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">בחר מין</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                        </select>

                        <div className="update-ad-form">
                            <label htmlFor="age">גיל</label>
                            <div className="age-row">
                                <FloatingInput
                                    label={'שנים'}
                                    type={'number'}
                                    id={"ageYears"}
                                    value={formData.ageYears ?? ''}
                                    onChange={handleChange}
                                    min={"0"}
                                    placeholder={' '}
                                />
                                <FloatingInput
                                    label={'חודשים'}
                                    type={'number'}
                                    id={"ageMonths"}
                                    value={formData.ageMonths || ''}
                                    onChange={handleChange}
                                    min={"0"}
                                    max={"11"}
                                    placeholder={' '}
                                />
                            </div>
                        </div>

                        <div className="checkbox-row">
                            <label htmlFor="hasCertificate">
                                <input
                                    type="checkbox"
                                    id="hasCertificate"
                                    name="hasCertificate"
                                    checked={formData?.hasCertificate || false}
                                    onChange={handleInputChange}
                                />
                                עם תעודה
                            </label>
                        </div>
                    </div>
                )}

                {isPetMarketplaceCategory(formData.category) && (
                    <div className="checkbox-row">
                        <label htmlFor="forAdoption">
                            <input
                                type="checkbox"
                                id="forAdoption"
                                name="forAdoption"
                                checked={formData.forAdoption || false}
                                onChange={handleInputChange}
                            />
                            מודעה לאימוץ
                        </label>
                    </div>
                )}

                {formData.category === "זרע" && (
                    <div className="update-ad-form">
                        <label htmlFor="seeds_types">סוג זרע</label>
                        <div className="seed-row">

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

                        <div className="checkbox-row">
                            <label htmlFor="hasCertificate">
                                <input
                                    type="checkbox"
                                    id="hasCertificate"
                                    name="hasCertificate"
                                    checked={formData.hasCertificate || false}
                                    onChange={handleInputChange}
                                />
                                עם תעודת הרבעה
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

                <label htmlFor="phoneNumber">שם איש קשר</label>
                <input
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="phoneNumber" className="phone-label">
                    <span>מספר טלפון</span>
                    {formData.phoneNumber && (
                        <span className={`phone-status ${phoneValid ? "is-valid" : "is-invalid"}`}>
                            {phoneValid ? "מספר תקין" : "מספר לא תקין"}
                        </span>
                    )}
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData?.phoneNumber}
                    onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        handleChange({ target: { name: 'phoneNumber', value: numericValue } });
                        setPhoneValid(isPhoneNumberIsraeliValid(numericValue));
                    }}
                    required
                    maxLength={10}
                    className={phoneValid ? 'valid-phone' : 'invalid-phone'}

                />

                <CitySelect
                    value={formData.location || ""}
                    onChange={handleChange}
                    areaValue={formData.district || ""}
                    enableAreaFilter
                />

                {((formData.category === "סוסים") ||
                    (formData.category === "זרע") ||
                    (formData.category === "אביזרים") ||
                    isPetMarketplaceCategory(formData.category)) && (
                        <div className='update-ad-form'>
                            <label htmlFor="price">מחיר</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '');
                                    handleChange({ target: { name: 'price', value: numericValue } });
                                }}
                                min={0}
                                onInput={(e) => {
                                    if (e.target.value > 999999) e.target.value = 999999;
                                }}
                            />
                        </div>
                    )
                }

                <label htmlFor="videos">וידאו</label>
                <input
                    type="file"
                    id="videos"
                    name="videos"
                    multiple
                    accept="video/*"
                    onChange={handleVideoChange}
                />

                <div className="current-photos">
                    {formData.video && (
                        <div>
                            <h3>וידאו קיים</h3>
                            <div className="photo-item">
                                <video width="300" controls>
                                    <source src={formData.video} type="video/mp4" />
                                    הדפדפן שלך לא תומך בווידאו.
                                </video>
                                <button type="button" className='del-photo-button' onClick={() => handleDeleteVideo(formData.video)}>מחק</button>
                            </div>
                        </div>
                    )}
                </div>



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
                                    <img src={photoUrl} alt={`Ad ${index + 1}`} />
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