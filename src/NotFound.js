import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import useSeo from "@/hooks/useSeo";
import { SITE_NAME } from "@/data/site-config";

const NotFound = () => {
    useSeo({
        title: `404 | ${SITE_NAME}`,
        description: "העמוד לא נמצא — בדקו את הקישור או חזרו לדף הבית.",
        image: "/hero-pets.png",
    });

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
