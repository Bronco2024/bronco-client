import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // You can keep the same CSS file if the styles are applicable
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const handleLoginRedirect = () => {
        navigate('/login'); // Change this path based on your routing setup
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle the API call with email, password, and verifyPassword
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Verify Password:', verifyPassword);

        if (password === verifyPassword) {
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                console.log(user)

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode)
                console.error(errorMessage)
            });
        } else {
            console.log("passwords dont match")
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">הירשם</h2>
            <form className="register-form" onSubmit={handleSubmit}>
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

                <label htmlFor="verify-password">אמת סיסמה</label>
                <div className="password-container">
                    <input
                        type={showVerifyPassword ? 'text' : 'password'}
                        id="verify-password"
                        name="verify-password"
                        placeholder='אמת סיסמה'
                        required
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <span
                        className="password-toggle"
                        onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    >
                        <FontAwesomeIcon icon={showVerifyPassword ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button type="submit" className="register-button">הרשמה</button>
            </form>
            <p className="register-text">
                כבר יש לך חשבון? <span onClick={handleLoginRedirect} className="login-link">התחברות</span>
            </p>
        </div>
    );
};

export default Register;
