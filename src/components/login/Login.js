import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegisterRedirect = () => {
        navigate('/register'); // Change this path based on your routing setup
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the API call with email and password
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <h2 className="login-title">היי, טוב לראות אותך</h2>
            <form className="login-form">
                <label htmlFor="email">מייל</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='yourmail@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">סיסמה</label>
                <div className="password-container">

                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder='הקלד סיסמה'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                <button type="submit" className="login-button" onClick={handleSubmit}>התחברות</button>
            </form>
            <p className="register-text">
                אין לך חשבון? <span onClick={handleRegisterRedirect} className="register-link">להרשמה</span>
            </p>
        </div>
    );
};

export default Login;
