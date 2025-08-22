import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">

                <div className="footer-section about-us">
                    <h2>תכירו אותנו</h2>
                    <div className="about-links">
                        <Link to="/about-us" className="about-link">אודותינו</Link>
                        <Link to="/regulations" className="about-link">תקנון</Link>
                        <Link to="/privacy-policy" className="about-link">מדיניות פרטיות</Link>
                    </div>
                </div>

                {/* <div className="footer-logo">
                    <img src={require('@/assets/horsehub-gold.png')} alt="HorseHub" loading='lazy'/>
                </div> */}

                <div className="footer-section social">
                    <h2>עקבו אחרינו</h2>
                    <div className="social-links">
                        <a
                            href="https://www.tiktok.com/@horsehub5?_t=ZS-8z5k2Mo5VBs&_r=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>

                        <a
                            href="https://www.instagram.com/horse.hub25?igsh=MWU1eWUwbHRjb3FwMQ=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>

                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </div>
                </div>

                <div className="footer-section contact">
                    <h2>צור קשר</h2>
                    <div className="contact-item">
                        <a
                            className="contact-link"
                            href='mailto:horsehub.team@gmail.com'>horsehub.team@gmail.com</a>
                        <a href='tel:0527502293'
                            className="contact-link"
                        >0527502293</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright-text">
                     HorseHub כל הזכויות שמורות ל ©
                </p>
            </div>
        </div>
    );
};

export default Footer;
