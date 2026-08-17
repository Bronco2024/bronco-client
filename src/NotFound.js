import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <main className="not-found-page" dir="rtl">
            <h1>העמוד לא נמצא</h1>
            <p>יכול להיות שהקישור השתנה או שהעמוד הוסר.</p>
            <Link to="/" className="not-found-link">חזרה לדף הבית</Link>
        </main>
    );
};

export default NotFound;
