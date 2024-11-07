import './Header.css';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faSignOut, faBars, faTimes, faHouseUser, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { CATEGORIES } from '../utils/constants/Constants';
import { IsDateNowGreaterThanAdDate } from '../utils/constants/Functions';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, loading, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        const CheckUserYearly = async () => {
            if (currentUser?.subscribedUntil !== null && IsDateNowGreaterThanAdDate(currentUser?.subscribedUntil)) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    subscribedUntil: null,
                    numberOfAds: 0
                })
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                setCurrentUser({ uid: currentUser.uid, ...userDoc.data() });
            }
        }
        CheckUserYearly()
    }, [currentUser, setCurrentUser])

    const handlePublishAd = () => {
        if (currentUser === null) {
            navigate('/login');
        } else {
            if (currentUser.numberOfAds > 0) {
                navigate('/publish_ad')
            } else {
                navigate('/subscribe')
            }
        }
    };

    const handleLogout = async () => {
        toggleProfileDropdown()
        await logout();
        navigate('/');
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    return (
        <nav className='navbar'>
            <div className='navbar-buttons'>
                <button className='publish-ad-button' onClick={handlePublishAd} >
                    פרסום מודעה
                    <FontAwesomeIcon icon={faPlus} style={{ marginLeft: '8px' }} />
                </button>
                {loading ? (
                    <span>Loading...</span>
                ) : currentUser ? (
                    <div className='profile-dropdown-container'>
                        <button className='navbar-button' onClick={toggleProfileDropdown}>
                            פרופיל
                            <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px' }} />
                        </button>
                        {showProfileDropdown && (
                            <div className="profile-dropdown">
                                {currentUser?.isAdmin && (
                                    <button className='dropdown-item'
                                        onClick={() => {
                                            toggleProfileDropdown()
                                            navigate('/admin')
                                        }}
                                    >
                                        ניהול אתר
                                        <FontAwesomeIcon icon={faGear} style={{ marginLeft: '8px' }} />
                                    </button>
                                )}
                                <button className='dropdown-item' onClick={() => {
                                    toggleProfileDropdown()
                                    navigate('/profile')
                                }}>
                                    אזור אישי
                                    <FontAwesomeIcon icon={faHouseUser} style={{ marginLeft: '8px' }} />

                                </button>
                                <button className='dropdown-item' onClick={handleLogout}>
                                    התנתק
                                    <FontAwesomeIcon icon={faSignOut} style={{ marginLeft: '8px' }} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className='navbar-button' onClick={() => navigate('/login')}>
                        התחברות
                        <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px' }} />
                    </button>
                )}
            </div>

            <div className='navbar-logo'>
                <div className="categories">
                    <button className="navbar-button menu-icon" onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
                    </button>
                    <div className={`navbar-buttons-category ${showMenu ? "show" : ""}`}>
                        {CATEGORIES.map((category, index) => (
                            <Link key={index} to={category.path} className='navbar-button-category' onClick={() => setShowMenu(false)}>
                                {category.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <Link to='/'>
                    <img src={require('../../assets/bronco.png')} style={{ width: '50px', height: 'auto' }} alt="Bronco Logo" />
                </Link>
            </div>
        </nav>
    );
};

export default Header;
