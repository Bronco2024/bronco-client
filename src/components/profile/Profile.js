import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import './Profile.css';

const Profile = () => {
    const { currentUser, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); 
        navigate('/');  
    };

    return (
        <div className="profile-container">
            <h2>Welcome, {currentUser?.email}</h2>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
};

export default Profile;
