import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, reload, getRedirectResult } from 'firebase/auth';
import { useAuth } from '@/context/AuthProvider';
import * as Sentry from "@sentry/react";
import { handleGoogleSignupAndSignIn } from '../../helpers/firebase-helpers';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { logout, currentUser, loading } = useAuth()

    useEffect(() => {
        getRedirectResult(auth)
          .then((result) => {
            if (result?.user) {
              console.log("Signed in:", result.user);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

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
            const errorCodeAndMessage = `${errorCode} - ${error}`;

            if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
                setError("אימייל או סיסמה לא נכונים");
            } else {
                setError("שגיאה לא צפויה, נסה שוב");
                Sentry.captureException(`Error in login`, {
                    tags: {
                        component: "Login"
                    },
                    extra: {
                        info: errorCodeAndMessage
                    }
                });
            }
        }
    };

    const handleGoogleSignin = async () => {
        try {
            handleGoogleSignupAndSignIn();
        } catch (error) {
            setError("שגיאה בחיבור עם Google");
            Sentry.captureException(error, {
                tags: { component: "Login", method: "GoogleSignin" }
            });
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
                <div className="google-signup">
                    <button type="button" onClick={handleGoogleSignin} className="google-button">
                        <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                        התחבר עם Google
                    </button>
                </div>
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
