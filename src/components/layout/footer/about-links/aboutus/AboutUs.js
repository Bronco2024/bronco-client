import React from 'react';
import { ABOUTUS_FEATURES } from '@components/utils/constants/Constants';
import './AboutUs.css'

const AboutUs = () => {
    return (
        <div className="about-section">
            <div className="about-content">
                <div className="about-image-container">
                    <img
                        className="main-image"
                        src="/hero-pets.png"
                        alt="Pets & Bones"
                        loading='lazy'
                    />
                </div>

                <div className="about-text-container">
                    <h2 className="about-heading">Pets & Bones – הבית של חיות המחמד</h2>
                    <p className="about-description">
                        Pets & Bones היא הפלטפורמה שמחברת בין אנשים, חיות מחמד ושירותים במקום אחד.
                        כאן אפשר למצוא מודעות למכירה ולאימוץ, לפרסם חיה, ולגלות וטרינרים, פנסיונים ואביזרים מכל הארץ.
                    </p>

                    <div className="feature-list">
                        {ABOUTUS_FEATURES.map((feature, i) => (
                            <div className="feature-item" key={i}>
                                <div className="feature-icon-container">
                                    <img
                                        className="feature-icon"
                                        src={feature.icon}
                                        alt=""
                                        loading='lazy'
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
                    Pets & Bones הוא לא רק לוח מודעות — זה מקום מפגש.</p>
                    <p><strong>ברוכים הבאים ל־Pets & Bones, המקום שבו מתחיל הסיפור הבא</strong></p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
