import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, where, query, getDocs } from 'firebase/firestore';
import './Horses.css'
import { useNavigate } from 'react-router-dom';

const Horses = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [filters, setFilters] = useState({
        gender: '',
        minPrice: '',
        maxPrice: '',
        hasCertificate: '',
        age: '',
        location: ''
    });

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const horsesCollectionRef = collection(db, 'ads');
                const q = query(horsesCollectionRef, where("category", "==", 'סוסים'));
                const querySnapshot = await getDocs(q);

                const fetchedAds = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAds(fetchedAds);
                setFilteredAds(fetchedAds);

            } catch (error) {
                console.error("Error fetching horse ads:", error);
            }
        };

        fetchAds();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters({
            ...filters,
            [name]: value
        });
    };

    const applyFilters = () => {
        const filtered = ads.filter(ad => {
            let certificate = filters.hasCertificate === "yes" ? true : false;
            return (
                (filters.gender === '' || ad.gender === filters.gender) &&
                (filters.hasCertificate === '' || ad.hasCertificate === certificate) &&
                (filters.location === '' || ad.location === filters.location) &&
                (filters.minPrice === '' || ad.price >= Number(filters.minPrice)) &&
                (filters.maxPrice === '' || ad.price <= Number(filters.maxPrice)) &&
                (filters.age === '' || ad.age === Number(filters.age))
            );
        });
        setFilteredAds(filtered);
    };

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } })
    }

    return (
        <div className="horses-container">
            <h1 className="horses-title">סוסים</h1>

            <div className="filters-box">
                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                    <option value="">מין</option>
                    <option value="זכר">זכר</option>
                    <option value="נקבה">נקבה</option>
                </select>
                <input
                    type="number"
                    name="minPrice"
                    placeholder="מחיר מינימלי"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="מחיר מקסימלי"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                />
                <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                    <option value="">תעודה</option>
                    <option value="yes">כן</option>
                    <option value="no">לא</option>
                </select>
                <input
                    type="number"
                    name="age"
                    placeholder="גיל"
                    value={filters.age}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="מיקום"
                    value={filters.location}
                    onChange={handleFilterChange}
                />
                <button onClick={applyFilters}>חפש</button>
            </div>


            <div className="ads-wrapper">
                {filteredAds.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    filteredAds.map(ad => (
                        <div key={ad.id} className="ad-card" onClick={() => handleClickOnItem(ad)}>
                            {ad.photos && ad.photos[0] && (
                                <img src={ad.photos[0]} alt={ad.title} className="ad-image" />
                            )}
                            <h2 className="ad-title">{ad.title}</h2>
                            <p className="ad-price">₪{ad.price}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Horses;
