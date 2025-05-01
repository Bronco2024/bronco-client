import React, { useState, useEffect, useCallback } from "react";
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getCountFromServer,
    limitToLast,
    endBefore,
    where,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import './OurProducts.css'
import { ADS_PER_PAGE } from "../utils/constants/Constants";
import { FormatDateTimestampToDate, IsDateNowGreaterThanAdDate } from "../utils/constants/Functions";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, increaseQuantity, decreaseQuantity } from "../redux/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";

const OurProducts = () => {
    const navigate = useNavigate();
    const [adList, setAdList] = useState([]);
    const [totalAds, setTotalAds] = useState(0);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);

    const categoryFilter = "מוצרים שלנו";
    const TOTAL_PAGES = Math.ceil(totalAds / ADS_PER_PAGE);

    const getTotalCount = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter)
        );

        const aggregateQuerySnapshot = await getCountFromServer(q);
        setTotalAds(aggregateQuerySnapshot.data().count);
    }, [categoryFilter]);

    const fetchAds = useCallback(async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limit(ADS_PER_PAGE)
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }, [categoryFilter]);

    useEffect(() => {
        fetchAds();
        getTotalCount();
    }, [fetchAds, getTotalCount]);

    const handleNextPage = async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            startAfter(afterThis),
            limit(ADS_PER_PAGE)
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = async () => {
        const collectionRef = collection(db, "ads");
        const q = query(
            collectionRef,
            where("category", "==", categoryFilter),
            orderBy("createdAt", "desc"),
            limitToLast(ADS_PER_PAGE),
            endBefore(beforeThis)
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdList(items);
        setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setBeforeThis(querySnapshot.docs[0]);
        setPage((prevPage) => prevPage - 1);
    };

    const handleClickOnItem = (ad) => {
        navigate('/item', { state: { ad } });
    };

    const handleAddToCart = (product) => {
        dispatch(addItem(product));
    };

    return (
        <div className="products-container">
            <h1 className="products-title">מוצרים שלנו</h1>

            <div className="ads-products-wrapper">
                {adList.length === 0 ? (
                    <p>לא נמצאו מודעות בקטיגוריה זו</p>
                ) : (
                    adList.map(ad => (
                        !IsDateNowGreaterThanAdDate(ad.availableUntil) && (
                            <div
                                key={ad.id}
                                className="ad-products-card"
                                onClick={() => handleClickOnItem(ad)}
                            >
                                {ad.photos && ad.photos[0] && (
                                    <img src={ad.photos[0]} alt={ad.title} className="ad-products-image" />
                                )}
                                {ad.photos.length === 0 && (
                                    <img src={require('@/assets/no-image.jpg')} alt={ad.category} className="ad-horse-image" />
                                )}
                                <h2 className="ad-products-title">{ad.title}</h2>
                                <p className='ad-products-date-create'>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</p>
                                <p className="ad-products-price">₪{ad.price}</p>

                                {cart.some(item => item.id === ad.id) ? (
                                    <div className="quantity-controls">
                                    <div className="quantity-btns">
                                        <button
                                            className="quantity-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(decreaseQuantity(ad.id));
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="minus-icon" />
                                        </button>
                                        <span className="quantity-count">
                                            {cart.find(item => item.id === ad.id)?.quantity}
                                        </span>
                                        <button
                                            className="quantity-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(increaseQuantity(ad.id));
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                                        </button>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(removeItem(ad.id));
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="remove-icon" />
                                        הסר
                                    </button>
                                </div>
                                
                                ) : (
                                    <button
                                        className="add-to-cart-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(ad);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="add-to-cart-icon" />
                                        הוסף לעגלה
                                    </button>
                                )}
                            </div>
                        )
                    ))
                )}
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>קודם</button>
                <span>דף {page}</span>
                <button onClick={handleNextPage} disabled={page === TOTAL_PAGES || adList.length === 0 || !afterThis}>
                    הבא
                </button>
            </div>
        </div>
    );
};

export default OurProducts;
