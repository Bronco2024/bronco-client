import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <main className="not-found-page" dir="rtl">
            <span className="not-found-kicker">404</span>
            <h1>העמוד לא נמצא</h1>
            <p>יכול להיות שהקישור השתנה או שהעמוד הוסר. אפשר לחזור לדף הבית או לעיין בכל המודעות.</p>
            <div className="not-found-actions">
                <Link to="/" className="not-found-link">חזרה לדף הבית</Link>
                <Link to="/listings" className="not-found-secondary">כל המודעות</Link>
            </div>
        </main>
    );
};

export default NotFound;
