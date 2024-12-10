import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">

                <div className="footer-section about-us">
                    <h2>עלינו</h2>
                    <p>אנו חברה שעוסקת בסוסים וכל הציוד הנלווה אליו משנת 1990</p>
                </div>

                <div className="footer-logo">
                    <img src={require('../../assets/bronco.png')} alt="Bronco Estd 2024" />
                </div>


                <div className="footer-section credits">
                    <h2>קרדיט</h2>
                    <div className="credit-item">
                        <a href="http://linkedin.com/in/haythamt95" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                            <FontAwesomeIcon icon={faLinkedin} className="linkedin-icon" />
                            Haytham Taweel
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright-text">
                    © Bronco כל הזכויות שמורות ל
                </p>
            </div>


        </div>
    );
};

export default Footer;
