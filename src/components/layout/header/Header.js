import './Header.css';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faPlus,
    faSignOut,
    faBars,
    faTimes,
    faHouseUser,
    faGear,
    faCartShopping,
    faReceipt,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { EXTENDED_CATEGORIES } from '@components/utils/constants/Constants';
import Loading from '../../loading-screen/Loading';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, loading, logout } = useAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handlePublishAd = () => {
        if (currentUser === null) {
            navigate('/login');
        } else {
            if (currentUser.numberOfAds > 0) {
                navigate('/publish_ad');
            } else {
                navigate('/subscribe');
            }
        }
    };

    const handleLogout = async () => {
        setShowProfileDropdown(false);
        await logout();
        navigate('/');
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(prev => !prev);
    };

    const handleMenuClick = () => {
        setShowMenu(prev => !prev);
        setShowProfileDropdown(false);
    };

    return (
        <nav className="navbar">

            {/* ================= LEFT SIDE ================= */}
            <div className="navbar-actions">

                <button
                    className="publish-ad-button"
                    onClick={handlePublishAd}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>פרסום מודעה</span>
                </button>

                {loading ? (
                    <div className="header-loading">
                        <Loading size={24} fullscreen={false} />
                    </div>
                ) : currentUser ? (

                    <div className="profile-dropdown-container">

                        <button
                            className={`profile-button ${showProfileDropdown ? 'active' : ''}`}
                            onClick={toggleProfileDropdown}
                        >
                            <span>פרופיל</span>
                            <FontAwesomeIcon icon={faUser} />
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`profile-chevron ${showProfileDropdown ? 'rotate' : ''}`}
                            />
                        </button>

                        {showProfileDropdown && (
                            <div className="profile-dropdown">

                                <div className="dropdown-header">
                                    <div className="dropdown-avatar">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>

                                    <div>
                                        <span>שלום!</span>
                                        <strong>האזור האישי</strong>
                                    </div>
                                </div>

                                <div className="dropdown-divider" />

                                {currentUser?.isAdmin && (
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            navigate('/admin');
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faGear} />
                                        <span>ניהול אתר</span>
                                    </button>
                                )}

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setShowProfileDropdown(false);
                                        navigate('/profile');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faHouseUser} />
                                    <span>אזור אישי</span>
                                </button>

                                <button
                                    className="dropdown-item logout-item"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOut} />
                                    <span>התנתק</span>
                                </button>

                            </div>
                        )}

                    </div>

                ) : (

                    <button
                        className="login-button"
                        onClick={() => navigate('/login')}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        <span>התחברות</span>
                    </button>

                )}

            </div>


            {/* ================= CENTER / RIGHT SIDE ================= */}
            <div className="navbar-main">

                {/* Logo */}
                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() => setShowMenu(false)}
                >
                    <img
                        src={require('@/assets/horsehub-gold.png')}
                        alt="HorseHub"
                    />
                </Link>

                {/* Categories */}
                <div className="categories">

                    <button
                        className="menu-icon"
                        onClick={handleMenuClick}
                        aria-label="פתיחת תפריט"
                    >
                        <FontAwesomeIcon
                            icon={showMenu ? faTimes : faBars}
                        />
                    </button>

                    <div
                        className={`navbar-buttons-category ${
                            showMenu ? "show" : ""
                        }`}
                    >

                        {EXTENDED_CATEGORIES.map((category, index) => (
                            <Link
                                key={index}
                                to={category.path}
                                className="navbar-button-category"
                                onClick={() => setShowMenu(false)}
                            >
                                {category.label}
                            </Link>
                        ))}

                    </div>

                </div>

            </div>

        </nav>
    );
};

export default Header;
