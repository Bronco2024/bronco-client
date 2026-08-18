import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faHeart,
    faHouse,
    faPaw,
    faPlus,
    faStethoscope,
    faStore,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ABOUTUS_FEATURES } from '@components/utils/constants/Constants';
import { SITE_NAME } from '@/data/site-config';
import './AboutUs.css'

const FEATURE_ICONS = {
    paw: faPaw,
    heart: faHeart,
    box: faBoxOpen,
    stethoscope: faStethoscope,
    house: faHouse,
    users: faUsers,
    plus: faPlus,
    store: faStore,
};

const AboutUs = () => {
    return (
        <div className="about-section">
            <div className="about-content">
                <div className="about-image-container">
                    <img
                        className="main-image"
                        src="/hero-pets.png"
                        alt={SITE_NAME}
                        loading='lazy'
                    />
                </div>

                <div className="about-text-container">
                    <h2 className="about-heading">{SITE_NAME} – הבית של חיות המחמד</h2>
                    <p className="about-description">
                        {SITE_NAME} היא הפלטפורמה שמחברת בין אנשים, חיות מחמד ושירותים במקום אחד.
                        כאן אפשר למצוא מודעות למכירה ולאימוץ, לפרסם חיה, ולגלות וטרינרים, פנסיונים ואביזרים מכל הארץ.
                    </p>

                    <div className="feature-list">
                        {ABOUTUS_FEATURES.map((feature) => (
                            <div className="feature-item" key={feature.title}>
                                <div className="feature-icon-container">
                                    <FontAwesomeIcon
                                        className="feature-icon"
                                        icon={FEATURE_ICONS[feature.icon] || faPaw}
                                    />
                                </div>
                                <div className="feature-text">
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-subtitle">{feature.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="feature-extra-text">
                    <p>אנחנו מאמינים בשקיפות, באחריות כלפי החיות, ובקהילה שמחברת בין אנשים שאוהבים אותן באמת.<br />
                    {SITE_NAME} הוא לא רק לוח מודעות — זה מקום מפגש.</p>
                    <p><strong>ברוכים הבאים ל־{SITE_NAME}, המקום שבו מתחיל הסיפור הבא</strong></p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
