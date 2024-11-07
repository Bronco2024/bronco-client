import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password === verifyPassword) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    subscribedUntil: null,
                    numberOfAds: 1
                })

                navigate('/');
            } catch (error) {
                const errorCode = error.code;
                if (errorCode === "auth/email-already-in-use") {
                    setError("אימייל זה כבר רשום");

                } else {
                    setError("שגיאה לא צפויה, נסה שוב");
                }
            }
        } else {
            setError("סיסמאות לא זהות");
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="register-button">הרשמה</button>
            </form>

            <p className="register-text">
                כבר יש לך חשבון? <span onClick={handleLoginRedirect} className="login-link">התחברות</span>
            </p>
        </div>
    );
};

export default Register;
