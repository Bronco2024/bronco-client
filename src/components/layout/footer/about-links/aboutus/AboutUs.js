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
                        src={require('@/assets/aboutus/aboutus-horse.png')}
                        alt="Main visual"
                        loading='lazy'
                    />
                </div>

                <div className="about-text-container">
                    <h2 className="about-heading">Horsehub – הדהירה שלך מתחילה כאן</h2>
                    <p className="about-description">
                    Horsehub היא הפלטפורמה המובילה בישראל לאוהבי סוסים, רוכבים, מגדלים ואנשי מקצוע. יצרנו מקום אחד שמרכז את כל מה שצריך – לקנייה, טיפול, למידה וחוויה – והכל ברמה הגבוהה ביותר
                    </p>

                    <div className="feature-list">
                        {ABOUTUS_FEATURES.map((feature, i) => (
                            <div className="feature-item" key={i}>
                                <div className="feature-icon-container">
                                    <img
                                        className="feature-icon"
                                        src={feature.icon}
                                        alt="Feature icon"
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
                    <p>אנחנו מאמינים בשירות אישי, מקצועיות בלתי מתפשרת ואהבה אמיתית לעולם הסוסים.<br />
                    Horsehub הוא לא רק אתר – זו קהילה. זו דרך חיים.</p>
                    <p><strong>ברוכים הבאים ל־ Horsehub, המקום שבו הכל מתחיל</strong></p>
                </div>

                <img
                    className="decorative-dots red-dots"
                    src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/cw3.svg"
                    alt="Red dots"
                />
            </div>
        </div>
    );
};

export default AboutUs;
