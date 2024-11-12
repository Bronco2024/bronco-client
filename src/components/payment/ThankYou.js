import React from 'react';
import './ThankYou.css';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
    const navigate = useNavigate();

    return (
        <div className="thank-you-container">
            <div className="thank-you-content">
                <h1>תודה!</h1>
                <p>תודה על רכישתך. התשלום בוצע בהצלחה!</p>

                <div className="button-container">
                    <button onClick={() => navigate('/')}>חזור לדף הבית</button>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
