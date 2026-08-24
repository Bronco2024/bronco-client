import React, { useEffect, useState } from 'react';
import './PublishAd.css';
import { db, storage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '@components/utils/modal/Modal';
import { BREEDS, SEED_ANIMAL_TYPES, SEMEN_TYPES, ACCESSORIES_TPYES, getSeedTypesByAnimal, isServiceCategory } from "@components/utils/constants/Constants";
import { isPetMarketplaceCategory } from "@/data/pets";
import BreedSelect from "@/components/pets/BreedSelect";
import CitySelect from "@/components/pets/CitySelect";
import { PET_BREED_OTHER, resolvePetBreed } from "@/data/pet-breeds";
import * as Sentry from "@sentry/react";
import FloatingInput from '../../my_components/FloatingInput';
import { isPhoneNumberIsraeliValid } from '@components/utils/constants/Functions';
import { getInitialAdStatus, AD_STATUS } from '@/helpers/ad-approval';
import { createPendingAdNotification } from '@/helpers/admin-notifications';
import ServiceAnimalSelect from '@/components/services/ServiceAnimalSelect';
import { getServiceByCategory } from '@/data/services-catalog';
import PublishCategorySelect from '@/components/publish_ad/PublishCategorySelect';
import {
    getServicePublishCopy,
    resolvePublishCategoryFromQuery,
} from '@/helpers/publish-categories';

const PublishAd = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentUser, setCurrentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [pendingApproval, setPendingApproval] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [phoneValid, setPhoneValid] = useState(true);
    const [photoError, setPhotoError] = useState("");

    const [formData, setFormData] = useState({
        contact: '',
        category: '',
        description: '',
        phoneNumber: '',
        location: '',
        district: '',
        breedCustom: '',
        photos: [],
        video: null,
        service_animals: [],
        title: '',
        price: '',
    });

    useEffect(() => {
        const fromQuery = resolvePublishCategoryFromQuery({
            category: searchParams.get("category") || "",
            slug: searchParams.get("slug") || "",
        });
        if (!fromQuery) return;
        setFormData((prev) =>
            prev.category ? prev : { ...prev, category: fromQuery, service_animals: [] }
        );
    }, [searchParams]);

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
        setFormData({ ...formData, photos: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(phoneValid === false) {
            return;
        }

        if (!formData.photos || formData.photos.length === 0) {
            setPhotoError("יש להוסיף לפחות תמונה אחת");
            return;
        }
        setPhotoError("");
        setUploading(true);

        if ((formData.category === "סוסים" || formData.category === "זרע")
            && !Object.hasOwn(formData, 'hasCertificate')) {
            setFormData((prevState) => {
                return { ...prevState, hasCertificate: false };
            });
        }

        try {
            const date = new Date();
            const adId = uuidv4();
            const metadata = {
                adId: adId
            };

            const photoURLs = await Promise.all(
                formData.photos.map(async (photo) => {
                    const photoRef = ref(storage, `ads/${adId}/${uuidv4()}`);
                    await uploadBytes(photoRef, photo, metadata);
                    return await getDownloadURL(photoRef);
                })
            );

            let videoURL = null;
            if (formData.video) {
                const videoRef = ref(storage, `ads/${adId}/video.mp4`);
                await uploadBytes(videoRef, formData.video, metadata);
                videoURL = await getDownloadURL(videoRef);
            }

            date.setMonth(date.getMonth() + 1);

            let adData = {
                ...formData,
                photos: photoURLs,
                video: videoURL || null,
                userId: currentUser.uid,
                createdAt: new Date(),
                availableUntil: date,
                status: getInitialAdStatus(currentUser?.isAdmin),
            };

            if (formData.forAdoption) {
                adData.forAdoption = true;
                if (!adData.price) adData.price = "לאימוץ";
            }

            if (formData.category === "סוסים" || isPetMarketplaceCategory(formData.category)) {
                const totalMonths =
                    (Number(formData.ageYears) || 0) * 12 +
                    (Number(formData.ageMonths) || 0);

                adData.ageInMonths = totalMonths;
                delete adData.age;
            }

            adData.breed = resolvePetBreed(formData.breed, formData.breedCustom);
            delete adData.breedCustom;

            if (!isServiceCategory(formData.category) || !formData.service_animals?.length) {
                delete adData.service_animals;
            }

            await setDoc(doc(db, "ads", adId), adData);

            if (adData.status === AD_STATUS.PENDING) {
                await createPendingAdNotification({
                    adId,
                    ad: {
                        ...adData,
                        publisherEmail: currentUser?.email || "",
                    },
                });
            }

            /**
             * PAYMENTS
             * This is currently closed until customer decides to make payments in the website
             */
            // await updateDoc(doc(db, "users", currentUser.uid), {
            //     numberOfAds: increment(-1)
            // });

            // setCurrentUser({
            //     ...currentUser,
            //     numberOfAds: currentUser.numberOfAds - 1
            // });

            setFormData({
                category: '',
                description: '',
                phoneNumber: '',
                location: '',
                photos: [],
                video: null
            });

            setShowModal(true);
            setPendingApproval(!currentUser?.isAdmin);

        } catch (error) {
            console.error("Error publishing ad:", error);
            Sentry.captureException(`Error publishing ad`, {
                tags: {
                    component: "PublishAd"
                },
                extra: {
                    info: error
                }
            });
        } finally {
            setUploading(false);
        }

    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/');
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
        <div className="publish-ad-container">
            <h1>פרסם מודעה</h1>
            <p className="publish-ad-lead">
                מלאו את הפרטים לפי סוג המודעה (חיה, מוצר או שירות), הוסיפו תמונות ברורות,
                והמודעה תופיע באתר לאחר אישור מנהל.
            </p>
            <form onSubmit={handleSubmit} className="publish-ad-form">

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
                            suggestedAnimals={
                                selectedService?.animals || []
                            }
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

                        {isOtherHorseBreed && (
                            <>
                                <label htmlFor="breedCustom">פרט את הגזע</label>
                                <input
                                    id="breedCustom"
                                    name="breedCustom"
                                    value={formData.breedCustom || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}

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
                                    checked={formData.hasCertificate || false}
                                    onChange={handleInputChange}
                                />
                                עם תעודה
                            </label>
                        </div>
                    </div>
                )
                }

                {isPetMarketplaceCategory(formData.category) && formData.category !== "סוסים" && (
                    <div className="publish-ad-form">
                        <BreedSelect
                            category={formData.category}
                            breed={formData.breed || ""}
                            breedCustom={formData.breedCustom || ""}
                            onChange={handleChange}
                        />

                        <label htmlFor="gender">מין</label>
                        <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">בחר מין</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                        </select>

                        <div className="publish-ad-form">
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
                                    checked={formData.hasCertificate || false}
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

                {
                    formData.category === "זרע" && (
                        <div className="publish-ad-form" >
                            <label htmlFor="seed_animal">סוג בעל חיים</label>
                            <select
                                id="seed_animal"
                                name="seed_animal"
                                value={formData.seed_animal || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">בחר סוג בעל חיים</option>
                                {SEED_ANIMAL_TYPES.map((animalType, index) => (
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
                                    value={formData.seed_type || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">בחר סוג זרע</option>
                                    {getSeedTypesByAnimal(formData.seed_animal).map((seed, index) => (
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
                    )
                }

                {
                    formData.category === "אביזרים" && (
                        <div className="publish-ad-form" >
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
                    )
                }

                <label htmlFor="description">תיאור</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
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
                    value={formData.phoneNumber}
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
                    value={formData.location}
                    onChange={handleChange}
                    areaValue={formData.district || ""}
                    enableAreaFilter
                />

                {
                    showPriceField && (
                        <div className='publish-ad-form'>
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

                {formData.category && (
                    <div className='publish-ad-form'>
                        <label htmlFor="video">סרטון</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
                        />
                    </div>
                )}

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
                    required
                />
                {photoError && <p className="publish-photo-error">{photoError}</p>}

                <button type="submit" className="publish-button" disabled={uploading}>
                    {uploading ? "...מפרסם" : "פרסם מודעה"}
                </button>
            </form >

            <Modal
                isVisible={showModal}
                title={pendingApproval ? "המודעה נשלחה לאישור" : "מודעה פורסמה"}
                onClose={closeModal}
            >
                <div className="modal-content-custom-publishad">
                    <p>
                        {pendingApproval
                            ? "המודעה נשמרה בהצלחה ותוצג באתר לאחר אישור מנהל."
                            : "המודעה פורסמה בהצלחה!"}
                    </p>
                    <div className="modal-buttons-custom-publishad">
                        <button className="close-button-publishad" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default PublishAd;
