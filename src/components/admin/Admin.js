import React, { useEffect, useState } from "react";
import './Admin.css'
import { db, storage } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);

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
    }, [])


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
                                <h4>לינק</h4>
                                <p style={{ direction: 'rtl' }}>סוג ספונסור: {sponsor.sponsor}</p>
                            </div>

                            <div className="sponsor-crud">
                                <button className='sponsor-delete-button'>מחק</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>לא נמצאו ספונסירים</p>
                )}
            </div>
        </div>
    )
}

export default Admin;