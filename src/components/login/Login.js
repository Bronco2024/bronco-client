import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, reload } from 'firebase/auth';
import { useAuth } from '@/context/AuthProvider';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { logout, currentUser, loading } = useAuth()

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    const handleForgotPassword = () => {
        navigate('/login/forgot-password')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await reload(auth.currentUser);

            if (!auth.currentUser.emailVerified) {
                await logout(); // Sign the user out immediately
                setError("נא לאמת את כתובת האימייל שלך לפני ההתחברות");
                return;
            }

            navigate('/')
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
                setError("אימייל או סיסמה לא נכונים");
            } else {
                setError("שגיאה לא צפויה, נסה שוב");
            }
        }
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button" onClick={handleSubmit}>התחברות</button>
            </form>
            <p className="register-text">
                אין לך חשבון? <span onClick={handleRegisterRedirect} className="register-link">להרשמה</span>
            </p>

            <p className="register-text">
                <span onClick={handleForgotPassword} className="register-link">שכחתי סיסמה</span>
            </p>
        </div>
    );
};

export default Login;
