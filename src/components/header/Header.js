import './Header.css';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const Header = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const { currentUser, loading, logout } = useAuth();

    const categories = [
        { path: '/horses', label: 'סוסים' },
        { path: '/seeds', label: 'זרע' },
        { path: '/accessories', label: 'אביזרים' },
        { path: '/boarding', label: 'פנסיון' },
        { path: '/exhibitors', label: 'מציגים' },
        { path: '/breeders', label: 'מפרזילים' },
        { path: '/schools', label: 'בתי ספר' },
        { path: '/trips', label: 'טיולים' },
        { path: '/products', label: 'תנויות' },
        { path: '/shows-and-competitions', label: 'תצוגות ותחריות' },
    ];

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handlePublishAd = () => {
        if (currentUser === null) {
            navigate('/login');
        } else {
            if(currentUser.isSubscribed && currentUser.numberOfAds > 0){
                navigate('/publish_ad')
            } else {
                navigate('/subscribe')
            }
        }
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className='navbar'>
            <div className='navbar-buttons'>
                {currentUser && (
                    <button className='navbar-button' style={{ backgroundColor: 'red' }} onClick={handleLogout}>
                        התנתק
                        <FontAwesomeIcon icon={faSignOut} style={{ marginLeft: '8px' }} />
                    </button>
                )}

                <button className='navbar-button' onClick={handlePublishAd}>
                    פרסום מודעה
                    <FontAwesomeIcon icon={faPlus} style={{ marginLeft: '8px' }} />
                </button>

                {loading ? (
                    <span>Loading...</span>
                ) : currentUser ? (
                    <button className='navbar-button' onClick={() => navigate('/profile')}>
                        פרופיל
                        <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px' }} />
                    </button>
                ) : (
                    <button className='navbar-button' onClick={() => navigate('/login')}>
                        התחברות
                        <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px' }} />
                    </button>
                )}
            </div>

            <div className='navbar-logo'>
                <div className='categories' onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    קטיגוריות
                    {showDropdown && (
                        <div className="dropdown">
                            {categories.map((category, index) => (
                                <Link key={index} to={category.path} className="dropdown-item">
                                    {category.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link to='/'>
                    <img src={require('../../assets/bronco.png')} style={{ width: '50px', height: 'auto' }} alt="Bronco Logo" />
                </Link>

            </div>
        </nav>
    );
};

export default Header;
