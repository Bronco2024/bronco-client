import './Header.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <nav className='navbar'>
            <div className='navbar-buttons'>
                <button className='navbar-button'>
                    פרסום מודעה
                    <FontAwesomeIcon icon={faPlus} style={{ marginLeft: '8px' }} />
                </button>
                <button className='navbar-button'>
                    התחברות
                    <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px' }} />
                </button>
            </div>
            
            <Link to='/' className='navbar-logo'>
                <img src={require('../../assets/bronco.png')} style={{ width: '50px', height: 'auto' }} alt="Bronco Logo" />
            </Link>
        </nav>
    );
};

export default Header;
