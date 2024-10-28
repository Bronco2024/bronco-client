import './Header.css';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const Header = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const { currentUser, loading } = useAuth();

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
    console.log("from header ",currentUser)
    return (
        <nav className='navbar'>
            <div className='navbar-buttons'>
                <button className='navbar-button'>
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
