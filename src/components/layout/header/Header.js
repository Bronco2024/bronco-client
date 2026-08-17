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
    faHeart
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { PET_CATEGORIES } from '@/data/pets';
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
            navigate('/publish_ad');
        }
    };

    const handleLogout = async () => {
        toggleProfileDropdown();
        await logout();
        navigate('/');
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    return (
        <nav className="navbar">

            <div className="navbar-buttons">

                <button
                    className="navbar-button favorites-button"
                    onClick={() => navigate('/favorites')}
                    aria-label="מועדפים"
                >
                    מועדפים
                    <FontAwesomeIcon
                        icon={faHeart}
                        style={{ marginLeft: '8px' }}
                    />
                </button>

                <button
                    className="publish-ad-button"
                    onClick={handlePublishAd}
                >
                    פרסום מודעה
                    <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginLeft: '8px' }}
                    />
                </button>

                {loading ? (
                    <Loading size={24} fullscreen={false} />
                ) : currentUser ? (

                    <div className="profile-dropdown-container">

                        <button
                            className="navbar-button"
                            onClick={toggleProfileDropdown}
                        >
                            פרופיל
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{ marginLeft: '8px' }}
                            />
                        </button>

                        {showProfileDropdown && (
                            <div className="profile-dropdown">

                                {currentUser?.isAdmin && (
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            toggleProfileDropdown();
                                            navigate('/admin');
                                        }}
                                    >
                                        ניהול אתר
                                        <FontAwesomeIcon
                                            icon={faGear}
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </button>
                                )}

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        toggleProfileDropdown();
                                        navigate('/profile');
                                    }}
                                >
                                    אזור אישי
                                    <FontAwesomeIcon
                                        icon={faHouseUser}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </button>

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        toggleProfileDropdown();
                                        navigate('/favorites');
                                    }}
                                >
                                    מועדפים
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </button>

                                <button
                                    className="dropdown-item"
                                    onClick={handleLogout}
                                >
                                    התנתק
                                    <FontAwesomeIcon
                                        icon={faSignOut}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </button>

                            </div>
                        )}

                    </div>

                ) : (

                    <button
                        className="navbar-button"
                        onClick={() => navigate('/login')}
                    >
                        התחברות
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{ marginLeft: '8px' }}
                        />
                    </button>

                )}

            </div>

            <div className="navbar-logo">

                <div className="header-categories">

                    <button
                        className="navbar-button menu-icon"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {showMenu ? (
                            <FontAwesomeIcon icon={faTimes} />
                        ) : (
                            <FontAwesomeIcon icon={faBars} />
                        )}
                    </button>

                    <div
                        className={`navbar-buttons-category ${
                            showMenu ? "show" : ""
                        }`}
                    >
                        {PET_CATEGORIES.map((category) => (
                            <Link
                                key={category.slug}
                                to={category.path}
                                className="navbar-button-category"
                                onClick={() => setShowMenu(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            to="/adoption"
                            className="navbar-button-category"
                            onClick={() => setShowMenu(false)}
                        >
                            אימוץ
                        </Link>
                    </div>

                </div>

                <Link to="/" className="brand-link">
                    <span className="brand-mark">🐾</span>
                    <span className="brand-text">Pets & Bones</span>
                </Link>

            </div>

        </nav>
    );
};

export default Header;
