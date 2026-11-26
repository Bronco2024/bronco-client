import './Header.css';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faPlus,
    faSignOut,
    faBars,
    faTimes,
    faHouseUser,
    faGear,
    faHeart,
    faChevronDown,
    faShoppingBag,
    faStore,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/context/AuthProvider';
import useAdminNotifications from '@/hooks/useAdminNotifications';
import { SITE_SERVICES, MARKETPLACE_CATEGORIES } from '@/data/pets';
import { SITE_NAME } from '@/data/site-config';
import Loading from '../../loading-screen/Loading';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, loading, logout } = useAuth();
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const { unreadCount: adminUnreadCount } = useAdminNotifications(
        Boolean(currentUser?.isAdmin)
    );
    const headerRef = useRef(null);

    const [showMenu, setShowMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showServices, setShowServices] = useState(false);

    const closeMenus = () => {
        setShowMenu(false);
        setShowProfileDropdown(false);
        setShowCategories(false);
        setShowServices(false);
    };

    useEffect(() => {
        closeMenus();
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
                setShowCategories(false);
                setShowServices(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeMenus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = showMenu ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showMenu]);

    const handlePublishAd = () => {
        closeMenus();
        if (currentUser === null) {
            navigate('/login?next=/publish_ad');
        } else {
            navigate('/publish_ad');
        }
    };

    const handleLogout = async () => {
        closeMenus();
        await logout();
        navigate('/');
    };

    const isCategoryActive = MARKETPLACE_CATEGORIES.some(
        (category) => location.pathname === category.path
    );
    const isServiceActive = SITE_SERVICES.some(
        (service) => location.pathname === service.path
    ) || location.pathname === "/services";

    return (
        <nav className="navbar" ref={headerRef}>
            <div className="navbar-inner">
                <Link to="/" className="brand-link" onClick={closeMenus} aria-label={SITE_NAME}>
                    <picture>
                        <source srcSet="/petzo-logo-mark.webp" type="image/webp" />
                        <img
                            className="brand-logo"
                            src="/petzo-logo.jpg"
                            alt={SITE_NAME}
                            width={160}
                            height={149}
                            decoding="async"
                        />
                    </picture>
                </Link>

                <div className="navbar-links">
                    <div className={`categories-menu ${showCategories ? "open" : ""}`}>
                        <button
                            className={`navbar-text-link ${isCategoryActive ? "active" : ""}`}
                            type="button"
                            aria-expanded={showCategories}
                            aria-haspopup="true"
                            onClick={() => {
                                setShowCategories((open) => !open);
                                setShowServices(false);
                                setShowProfileDropdown(false);
                            }}
                        >
                            קטגוריות
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>

                        {showCategories && (
                            <div className="categories-panel" role="menu">
                                {MARKETPLACE_CATEGORIES.map((category) => (
                                    <Link
                                        key={category.slug}
                                        to={category.path}
                                        className="categories-panel-item"
                                        onClick={closeMenus}
                                    >
                                        <img src={category.image} alt="" />
                                        <span>
                                            <strong>{category.name}</strong>
                                            <small>{category.subtitle}</small>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={`categories-menu ${showServices ? "open" : ""}`}>
                        <button
                            className={`navbar-text-link ${isServiceActive ? "active" : ""}`}
                            type="button"
                            aria-expanded={showServices}
                            aria-haspopup="true"
                            onClick={() => {
                                setShowServices((open) => !open);
                                setShowCategories(false);
                                setShowProfileDropdown(false);
                            }}
                        >
                            שירותים
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>

                        {showServices && (
                            <div className="categories-panel services-panel" role="menu">
                                <Link
                                    to="/services"
                                    className="categories-panel-item categories-panel-item--hub"
                                    onClick={closeMenus}
                                >
                                    <span>
                                        <strong>כל השירותים</strong>
                                        <small>מרכז שירותים לכל סוגי החיות</small>
                                    </span>
                                </Link>
                                {SITE_SERVICES.map((service) => (
                                    <Link
                                        key={service.path}
                                        to={service.path}
                                        className="categories-panel-item"
                                        onClick={closeMenus}
                                    >
                                        <img src={service.image} alt="" />
                                        <span>
                                            <strong>{service.name}</strong>
                                            <small>{service.subtitle}</small>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <NavLink
                        to="/adoption"
                        className={({ isActive }) =>
                            `navbar-text-link ${isActive ? "active" : ""}`
                        }
                    >
                        אימוץ
                    </NavLink>
                    <NavLink
                        to="/listings"
                        className={({ isActive }) =>
                            `navbar-text-link ${isActive ? "active" : ""}`
                        }
                    >
                        כל המודעות
                    </NavLink>
                    <NavLink
                        to="/our-products"
                        className={({ isActive }) =>
                            `navbar-text-link ${isActive ? "active" : ""}`
                        }
                    >
                        <FontAwesomeIcon icon={faStore} />
                        חנות
                    </NavLink>
                </div>

                <div className="navbar-buttons">
                    <button
                        className="navbar-button cart-button"
                        onClick={() =>
                            navigate(currentUser ? "/cart" : "/login")
                        }
                        aria-label="עגלת קניות"
                    >
                        <span>עגלה</span>
                        <FontAwesomeIcon icon={faShoppingBag} />
                        {cartQuantity > 0 && (
                            <span className="cart-badge">{cartQuantity}</span>
                        )}
                    </button>

                    <button
                        className="navbar-button favorites-button"
                        onClick={() => navigate('/favorites')}
                        aria-label="מועדפים"
                    >
                        <span>מועדפים</span>
                        <FontAwesomeIcon icon={faHeart} />
                    </button>

                    <button
                        className="publish-ad-button"
                        onClick={handlePublishAd}
                        aria-label="פרסום מודעה"
                    >
                        <span>פרסום מודעה</span>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    {loading ? (
                        <Loading size={24} fullscreen={false} />
                    ) : currentUser ? (
                        <div className="profile-dropdown-container">
                            <button
                                className="navbar-button"
                                onClick={() => {
                                    setShowProfileDropdown((open) => !open);
                                    setShowCategories(false);
                                }}
                                aria-expanded={showProfileDropdown}
                                aria-label="פרופיל"
                            >
                                <span>פרופיל</span>
                                <FontAwesomeIcon icon={faUser} />
                            </button>

                            {showProfileDropdown && (
                                <div className="profile-dropdown">
                                    {currentUser?.isAdmin && (
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                closeMenus();
                                                navigate('/admin');
                                            }}
                                        >
                                            ניהול אתר
                                            {adminUnreadCount > 0 && (
                                                <span className="admin-alert-badge">
                                                    {adminUnreadCount}
                                                </span>
                                            )}
                                            <FontAwesomeIcon icon={faGear} />
                                        </button>
                                    )}

                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            closeMenus();
                                            navigate('/profile');
                                        }}
                                    >
                                        אזור אישי
                                        <FontAwesomeIcon icon={faHouseUser} />
                                    </button>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            closeMenus();
                                            navigate('/favorites');
                                        }}
                                    >
                                        מועדפים
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            closeMenus();
                                            navigate('/my-purchases');
                                        }}
                                    >
                                        ההזמנות שלי
                                        <FontAwesomeIcon icon={faShoppingBag} />
                                    </button>

                                    {currentUser?.isAdmin && (
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                closeMenus();
                                                navigate('/admin/all-purchases');
                                            }}
                                        >
                                            הזמנות חנות
                                            <FontAwesomeIcon icon={faStore} />
                                        </button>
                                    )}

                                    <button
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        התנתק
                                        <FontAwesomeIcon icon={faSignOut} />
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
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                    )}

                    <button
                        className="navbar-button menu-icon"
                        onClick={() => {
                            setShowMenu((open) => !open);
                            setShowCategories(false);
                            setShowServices(false);
                            setShowProfileDropdown(false);
                        }}
                        aria-label={showMenu ? "סגירת תפריט" : "פתיחת תפריט"}
                        aria-expanded={showMenu}
                    >
                        <FontAwesomeIcon icon={showMenu ? faTimes : faBars} />
                    </button>
                </div>
            </div>

            {showMenu && (
                <div className="mobile-menu">
                    <div className="mobile-menu-links">
                        <Link to="/listings" onClick={closeMenus}>כל המודעות</Link>
                        <Link to="/our-products" onClick={closeMenus}>חנות</Link>
                        <Link to="/adoption" onClick={closeMenus}>אימוץ</Link>
                        <Link to="/favorites" onClick={closeMenus}>מועדפים</Link>
                        <Link to="/cart" onClick={closeMenus}>עגלה</Link>
                    </div>
                    <p className="mobile-menu-label">קטגוריות</p>
                    <div className="mobile-categories">
                        {MARKETPLACE_CATEGORIES.map((category) => (
                            <Link
                                key={category.slug}
                                to={category.path}
                                onClick={closeMenus}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                    <p className="mobile-menu-label">שירותים</p>
                    <div className="mobile-categories">
                        <Link to="/services" onClick={closeMenus}>כל השירותים</Link>
                        {SITE_SERVICES.map((service) => (
                            <Link
                                key={service.path}
                                to={service.path}
                                onClick={closeMenus}
                            >
                                {service.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
