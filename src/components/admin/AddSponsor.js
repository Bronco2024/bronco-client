import React, { useState } from 'react';
import './AddSponsor.css'
import { db, storage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddSponsor = () => {
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
        setFormData({ ...formData, photo: (e.target.file) });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageId = uuidv4();
        const photoRef = ref(storage, `sponsors/${imageId}`)
        await uploadBytes(photoRef, formData.photo);
        const photoURL = await getDownloadURL(photoRef);

        await setDoc(doc(db, "sponsors"), {
            ...formData,
            photo: photoURL,
            imageId: imageId
        })

        setFormData({
            link:"",
            photo:"",
            sponsor:""
        })
    }


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
        </div>
    )
}

export default AddSponsor;