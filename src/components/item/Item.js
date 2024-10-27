import React from 'react';
import { useLocation } from 'react-router-dom';

const ItemPage = () => {
    const location = useLocation();
    const { imageUrl } = location.state || {};

    return (
        <div style={{ textAlign: 'center' }}>
            {imageUrl ? (
                <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
            ) : (
                <p>No image available.</p>
            )}
        </div>
    );
};

export default ItemPage;
