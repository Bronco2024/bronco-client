import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { doc, updateDoc, arrayRemove, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import './UpdateAd.css'
import { BREEDS, SEED_ANIMAL_TYPES, SEMEN_TYPES, ACCESSORIES_TPYES, getSeedTypesByAnimal, isServiceCategory } from "@components/utils/constants/Constants";
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
import ServiceAnimalSelect from '@/components/services/ServiceAnimalSelect';
import { getServiceByCategory } from '@/data/services-catalog';
import PublishCategorySelect from '@/components/publish_ad/PublishCategorySelect';
import { getServicePublishCopy } from '@/helpers/publish-categories';
import { omitUndefinedFields } from '@/helpers/firestore-safe';
import { toFirestoreTimestamp } from '@/helpers/firestore-timestamp';
import { withCurrentOption } from '@/helpers/select-options';
import { getNewListingAvailableUntil } from '@/helpers/ad-listing-duration';
import { compressImagesForUpload } from '@/helpers/compress-image';

const UpdateAd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const ad = location.state?.ad;
    const [newPhotos, setNewPhotos] = useState({ photos: [] })
    const [newVideo, setNewVideo] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

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
    const [photoError, setPhotoError] = useState("");

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
        if (name === "seed_animal") {
            setFormData({ ...formData, seed_animal: value, seed_type: "" });
            return;
        }
        if (name === "category") {
            setFormData((prev) => ({
                ...prev,
                category: value,
                service_animals: [],
            }));
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

        if (name === "forAdoption") {
            setFormData((prevData) => ({
                ...prevData,
                forAdoption: checked,
                price: checked ? "" : prevData.price,
            }));
            return;
        }

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

    const handleSetCoverPhoto = async (photoUrl) => {
        const current = formData.photos || [];
        if (!photoUrl || current[0] === photoUrl) return;
        const next = [photoUrl, ...current.filter((url) => url !== photoUrl)];
        setFormData((prev) => ({ ...prev, photos: next }));
        try {
            const adRef = doc(db, "ads", ad.id);
            await updateDoc(adRef, { photos: next });
        } catch (error) {
            console.error("Error setting cover photo:", error);
            Sentry.captureException(`Error setting cover photo`, {
                tags: { component: "UpdateAd" },
                extra: { info: error },
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
        setSubmitError("");

        if (phoneValid === false) {
            setSubmitError("מספר הטלפון אינו תקין");
            return;
        }

        const totalPhotos = (formData.photos?.length || 0) + (newPhotos.photos?.length || 0);
        if (totalPhotos === 0) {
            setPhotoError("יש להשאיר לפחות תמונה אחת");
            setSubmitError("יש להשאיר לפחות תמונה אחת");
            return;
        }
        setPhotoError("");

        if (!ad?.id) {
            console.error("Ad ID is missing.");
            setSubmitError("לא נמצאה מודעה לעדכון. חזרו לפרופיל ונסו שוב.");
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

        setIsSubmitting(true);

        try {
            // Keep original createdAt when present; only refresh availableUntil safely.
            const existingCreatedAt = toFirestoreTimestamp(
                formData.createdAt,
                () => Timestamp.now()
            );
            const availableUntil = toFirestoreTimestamp(
                formData.availableUntil,
                () => Timestamp.fromDate(getNewListingAvailableUntil())
            );

            let dataToSubmit = {
                ...formData,
                id: ad.id,
                userId: formData.userId || currentUser?.uid || ad.userId,
                createdAt: existingCreatedAt,
                availableUntil,
                // After any publisher edit (including rejected ads), re-queue for review.
                status: getAdStatusAfterUpdate(currentUser?.isAdmin),
                updatedAt: Timestamp.now(),
            };

            // Drop client-only / admin review fields that must not wipe incorrectly.
            delete dataToSubmit.breedCustom;
            delete dataToSubmit.ageYears;
            delete dataToSubmit.ageMonths;

            if (formData.category === "סוסים" || isPetMarketplaceCategory(formData.category)) {
                const totalMonths =
                    (Number(formData.ageYears) || 0) * 12 +
                    (Number(formData.ageMonths) || 0);

                dataToSubmit.ageInMonths = totalMonths;
                delete dataToSubmit.age;
                dataToSubmit.breed = resolvePetBreed(formData.breed, formData.breedCustom);
            } else {
                delete dataToSubmit.breed;
            }

            if (!isServiceCategory(formData.category) || !formData.service_animals?.length) {
                delete dataToSubmit.service_animals;
            }

            if (isServiceCategory(formData.category)) {
                dataToSubmit.listingKind = "service";
            }

            if (formData.forAdoption) {
                dataToSubmit.forAdoption = true;
                dataToSubmit.price = "לאימוץ";
            } else {
                delete dataToSubmit.forAdoption;
            }

            dataToSubmit = DeletedAttributesAfterUpdateForm(dataToSubmit);
            dataToSubmit = omitUndefinedFields(dataToSubmit);

            const adRef = doc(db, "ads", ad.id);

            // Upload new media first (compressed), then one Firestore write for photos.
            let photoURLs = [];
            let videoURL = null;

            if (newPhotos.photos.length > 0 || newVideo) {
                const compressedPhotos = newPhotos.photos.length
                    ? await compressImagesForUpload(newPhotos.photos)
                    : [];

                const photoUploadPromise = compressedPhotos.length
                    ? Promise.all(
                        compressedPhotos.map(async (photo) => {
                            const photoRef = ref(storage, `ads/${ad.id}/${uuidv4()}`);
                            await uploadBytes(photoRef, photo);
                            return await getDownloadURL(photoRef);
                        })
                    )
                    : Promise.resolve([]);

                const videoUploadPromise = newVideo
                    ? (async () => {
                        const videoRef = ref(storage, `ads/${ad.id}/${uuidv4()}`);
                        await uploadBytes(videoRef, newVideo);
                        return await getDownloadURL(videoRef);
                    })()
                    : Promise.resolve(null);

                [photoURLs, videoURL] = await Promise.all([
                    photoUploadPromise,
                    videoUploadPromise,
                ]);
            }

            if (photoURLs.length) {
                dataToSubmit.photos = [
                    ...(Array.isArray(dataToSubmit.photos) ? dataToSubmit.photos : []),
                    ...photoURLs,
                ];
            }
            if (videoURL) {
                dataToSubmit.video = videoURL;
            }

            dataToSubmit = omitUndefinedFields(dataToSubmit);
            await setDoc(adRef, dataToSubmit);

            if (photoURLs.length) setNewPhotos({ photos: [] });
            if (videoURL) setNewVideo(null);

            if (dataToSubmit.status === AD_STATUS.PENDING) {
                void createPendingAdNotification({
                    adId: ad.id,
                    ad: {
                        ...dataToSubmit,
                        publisherEmail: currentUser?.email || "",
                    },
                }).catch((notifyError) => {
                    console.warn("Pending ad notification failed", notifyError);
                });
            }

            setShowModal(true);
        } catch (error) {
            console.error("Error updating ad:", error);
            setSubmitError("עדכון המודעה נכשל. בדקו את החיבור ונסו שוב.");
            Sentry.captureException(error, {
                tags: {
                    component: "UpdateAd",
                },
                extra: {
                    adId: ad?.id,
                    status: formData?.status,
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        navigate('/profile');
    };

    const isOtherHorseBreed =
        formData.category === "סוסים" && formData.breed === PET_BREED_OTHER;

    const selectedService = isServiceCategory(formData.category)
        ? getServiceByCategory(formData.category)
        : null;
    const serviceCopy = selectedService
        ? getServicePublishCopy(formData.category)
        : null;

    const showPriceField =
        !formData.forAdoption &&
        Boolean(formData.category) &&
        (
            formData.category === "סוסים" ||
            formData.category === "זרע" ||
            formData.category === "אביזרים" ||
            formData.category === "חנות" ||
            isPetMarketplaceCategory(formData.category) ||
            isServiceCategory(formData.category)
        );

    return (
        <div className="update-ad-container">
            <h1>עדכון מודעה</h1>
            <form className="update-ad-form" onSubmit={handleSubmit}>

                <PublishCategorySelect
                    value={formData.category}
                    onChange={handleChange}
                    isAdmin={Boolean(currentUser?.isAdmin)}
                />

                {isServiceCategory(formData.category) && (
                    <div className="publish-service-block">
                        {serviceCopy?.hint && (
                            <p className="publish-service-hint">{serviceCopy.hint}</p>
                        )}
                        <label htmlFor="title">כותרת השירות</label>
                        <input
                            id="title"
                            name="title"
                            value={formData.title || ""}
                            onChange={handleChange}
                            placeholder={serviceCopy?.titlePlaceholder || "כותרת השירות"}
                            required
                        />
                        <ServiceAnimalSelect
                            value={formData.service_animals || []}
                            suggestedAnimals={selectedService?.animals || []}
                            onChange={(animals) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    service_animals: animals,
                                }))
                            }
                        />
                    </div>
                )}

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
                            {withCurrentOption(BREEDS, formData?.breed).map((breed, index) => (
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
                                    required={false}
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
                                    required={false}
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
                    <div className="publish-ad-option-block">
                        <p className="publish-ad-option-title">אפשרות אימוץ</p>
                        <p className="publish-ad-option-note">
                          המודעה תופיע במרכז האימוץ.
                        </p>
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
                    </div>
                )}

                {formData.category === "זרע" && (
                    <div className="update-ad-form">
                        <label htmlFor="seed_animal">סוג בעל חיים</label>
                        <select
                            id="seed_animal"
                            name="seed_animal"
                            value={formData.seed_animal || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="">בחר סוג בעל חיים</option>
                            {withCurrentOption(SEED_ANIMAL_TYPES, formData.seed_animal).map((animalType, index) => (
                                <option key={index} value={animalType}>
                                    {animalType}
                                </option>
                            ))}
                        </select>

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
                                {withCurrentOption(
                                    getSeedTypesByAnimal(formData.seed_animal),
                                    formData?.seed_type
                                ).map((seed, index) => (
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
                                {withCurrentOption(SEMEN_TYPES, formData.semen_type).map((semen, index) => (
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
                            {withCurrentOption(ACCESSORIES_TPYES, formData.accessory).map((accessory, index) => (
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
                    value={formData?.description || ""}
                    onChange={handleChange}
                    rows={5}
                />

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

                {showPriceField && (
                        <div className='update-ad-form'>
                            <label htmlFor="price">
                                {isServiceCategory(formData.category)
                                    ? (serviceCopy?.priceLabel || "מחיר / תעריף (אופציונלי)")
                                    : "מחיר"}
                            </label>
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

                <label htmlFor="video">סרטון</label>
                <input
                    type="file"
                    id="video"
                    name="video"
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



                <label htmlFor="photos">תמונות *</label>
                <input
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={(event) => {
                        handleFileChange(event);
                        if (event.target.files?.length) {
                            setPhotoError("");
                        }
                    }}
                />
                {photoError && <p className="publish-photo-error">{photoError}</p>}

                <div className="current-photos">
                    {(formData.photos?.length || 0) > 0 && (
                        <div>
                            <h3>תמונות קיימות</h3>
                            <p className="publish-photos-hint">
                                בחרו <strong>תמונת תצוגה</strong> — היא תופיע ראשונה במודעה ובכרטיסים.
                            </p>
                            {formData.photos.map((photoUrl, index) => (
                                <div
                                    key={index}
                                    className={`photo-item ${index === 0 ? "photo-item--cover" : ""}`}
                                >
                                    <img src={photoUrl} alt={`Ad ${index + 1}`} />
                                    <button
                                        type="button"
                                        className={`set-cover-button ${index === 0 ? "is-active" : ""}`}
                                        onClick={() => handleSetCoverPhoto(photoUrl)}
                                    >
                                        {index === 0 ? "תמונת תצוגה ✓" : "בחר לתצוגה"}
                                    </button>
                                    <button type="button" className='del-photo-button' onClick={() => handleDeletePhoto(photoUrl)}>מחק</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {submitError && (
                    <p className="publish-photo-error" role="alert">
                        {submitError}
                    </p>
                )}

                <button
                    type="submit"
                    className="update-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "מעדכן..." : "עדכן מודעה"}
                </button>

            </form>

            {!ad?.id && (
                <p className="publish-photo-error" role="alert">
                    לא נמצאה מודעה לעדכון. חזרו לפרופיל ולחצו שוב על &quot;עדכן&quot;.
                </p>
            )}

            <Modal isVisible={showModal} title="עדכון מודעה" onClose={closeModal}>
                <div className="modal-content-custom-updatead">
                    <p>
                        {currentUser?.isAdmin
                            ? "המודעה עודכנה בהצלחה!"
                            : "המודעה עודכנה ונשלחה לאישור מחדש."}
                    </p>
                    <div className="modal-buttons-custom-updatead">
                        <button className="close-button-updatead" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UpdateAd;