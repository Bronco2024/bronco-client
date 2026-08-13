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
    faReceipt
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

                                {/*
                                PAYMENTS
                                This is currently closed until customer
                                decides to make payments in the website.

                                {!currentUser?.isAdmin && (
                                    <>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                toggleProfileDropdown();
                                                navigate('/cart');
                                            }}
                                        >
                                            עגלה
                                            <FontAwesomeIcon
                                                icon={faCartShopping}
                                                style={{ marginLeft: '8px' }}
                                            />
                                        </button>

                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                toggleProfileDropdown();
                                                navigate('/my-purchases');
                                            }}
                                        >
                                            רכישות
                                            <FontAwesomeIcon
                                                icon={faReceipt}
                                                style={{ marginLeft: '8px' }}
                                            />
                                        </button>
                                    </>
                                )}

                                {currentUser?.isAdmin && (
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            toggleProfileDropdown();
                                            navigate('/admin/all-purchases');
                                        }}
                                    >
                                        ניהול רכישות
                                        <FontAwesomeIcon
                                            icon={faReceipt}
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </button>
                                )}
                                */}

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

                {/* IMPORTANT:
                    Do NOT use className="categories" here.
                    Homepage.css already uses .categories.
                */}
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

                <Link to="/">
                    <img
                        src={require('@/assets/horsehub-gold.png')}
                        style={{
                            width: '50px',
                            height: 'auto'
                        }}
                        alt="HorseHub"
                    />
                </Link>

            </div>

        </nav>
    );
};

export default Header;
