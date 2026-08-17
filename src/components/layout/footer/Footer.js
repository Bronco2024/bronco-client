import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { PET_CATEGORIES } from '@/data/pets';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="brand-mark" aria-hidden="true">
                            <FontAwesomeIcon icon={faPaw} />
                        </span>
                        <div>
                            <strong>Pets & Bones</strong>
                            <p>המקום שמחבר בין חיות מחמד, אנשים ושירותים במקום אחד.</p>
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <h2>קטגוריות</h2>
                    <div className="footer-links">
                        {PET_CATEGORIES.slice(0, 6).map((category) => (
                            <Link key={category.slug} to={category.path} className="about-link">
                                {category.name}
                            </Link>
                        ))}
                        <Link to="/listings" className="about-link">כל המודעות</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h2>האתר</h2>
                    <div className="footer-links">
                        <Link to="/about-us" className="about-link">אודותינו</Link>
                        <Link to="/adoption" className="about-link">אימוץ</Link>
                        <Link to="/regulations" className="about-link">תקנון</Link>
                        <Link to="/privacy-policy" className="about-link">מדיניות פרטיות</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h2>צור קשר</h2>
                    <div className="contact-item">
                        <a className="contact-link" href="mailto:horsehub.team@gmail.com">
                            horsehub.team@gmail.com
                        </a>
                        <a href="tel:0547926338" className="contact-link">054-792-6338</a>
                    </div>
                    <div className="social-links">
                        <a
                            href="https://www.tiktok.com/@horsehub5?_t=ZS-8z5k2Mo5VBs&_r=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="TikTok"
                        >
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                        <a
                            href="https://www.instagram.com/horse.hub25?igsh=MWU1eWUwbHRjb3FwMQ=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Instagram"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Facebook"
                        >
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright-text">
                    © {new Date().getFullYear()} Pets & Bones. כל הזכויות שמורות.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
