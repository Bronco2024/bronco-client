import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faPaw
} from '@fortawesome/free-solid-svg-icons';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { auth } from '@/firebase';

import {
    signInWithEmailAndPassword,
    reload,
    getRedirectResult
} from 'firebase/auth';

import { useAuth } from '@/context/AuthProvider';

import * as Sentry from '@sentry/react';

import {
    handleGoogleSignupAndSignIn
} from '../../helpers/firebase-helpers';


const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { logout } = useAuth();


    /* ================================
       Google Redirect Result
    ================================= */

    useEffect(() => {

        const checkRedirectResult = async () => {

            try {

                const result = await getRedirectResult(auth);

                if (result?.user) {
                    navigate('/');
                }

            } catch (error) {

                console.error(
                    'Google redirect error:',
                    error
                );

                setError('שגיאה בחיבור עם Google');

                Sentry.captureException(error, {
                    tags: {
                        component: 'Login',
                        method: 'GoogleRedirect'
                    }
                });
            }
        };

        checkRedirectResult();

    }, [navigate]);


    /* ================================
       Register
    ================================= */

    const handleRegisterRedirect = () => {
        navigate('/register');
    };


    /* ================================
       Forgot Password
    ================================= */

    const handleForgotPassword = () => {
        navigate('/login/forgot-password');
    };


    /* ================================
       Firebase Error Messages
    ================================= */

    const getLoginErrorMessage = (errorCode) => {

        switch (errorCode) {

            case 'auth/invalid-credential':
                return 'האימייל או הסיסמה לא נכונים';

            case 'auth/invalid-email':
                return 'כתובת האימייל אינה תקינה';

            case 'auth/user-not-found':
                return 'לא נמצא משתמש עם כתובת האימייל הזאת';

            case 'auth/wrong-password':
                return 'הסיסמה לא נכונה';

            case 'auth/user-disabled':
                return 'החשבון הזה נחסם';

            case 'auth/too-many-requests':
                return 'בוצעו יותר מדי ניסיונות. נסה שוב מאוחר יותר';

            case 'auth/network-request-failed':
                return 'יש בעיה בחיבור לאינטרנט';

            case 'auth/operation-not-allowed':
                return 'התחברות עם אימייל וסיסמה אינה מופעלת ב-Firebase';

            case 'auth/invalid-api-key':
                return 'יש בעיה בהגדרות Firebase';

            case 'auth/app-not-authorized':
                return 'האתר אינו מורשה להשתמש ב-Firebase';

            case 'auth/unauthorized-domain':
                return 'הדומיין של האתר אינו מורשה ב-Firebase';

            default:
                return 'אירעה שגיאה. נסה שוב';
        }
    };


    /* ================================
       Email / Password Login
    ================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            setError('נא למלא אימייל וסיסמה');
            return;
        }

        try {

            console.log('Trying Firebase login...');

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

            console.log(
                'Firebase login successful:',
                userCredential.user
            );


            /* Reload user information */

            await reload(userCredential.user);


            /* Check email verification */

            if (!userCredential.user.emailVerified) {

                await logout();

                setError(
                    'נא לאמת את כתובת האימייל שלך לפני ההתחברות'
                );

                return;
            }


            /* Login successful */

            navigate('/');


        } catch (error) {

            console.error(
                'LOGIN FIREBASE ERROR:',
                error
            );

            console.error(
                'LOGIN ERROR CODE:',
                error?.code
            );

            console.error(
                'LOGIN ERROR MESSAGE:',
                error?.message
            );


            const errorCode = error?.code;

            const errorMessage =
                getLoginErrorMessage(errorCode);

            setError(errorMessage);


            Sentry.captureException(error, {
                tags: {
                    component: 'Login',
                    method: 'EmailLogin'
                },
                extra: {
                    errorCode: errorCode,
                    errorMessage: error?.message,
                    email: cleanEmail
                }
            });
        }
    };


    /* ================================
       Google Login
    ================================= */

    const handleGoogleSignin = async () => {

        try {

            setError('');

            await handleGoogleSignupAndSignIn();

        } catch (error) {

            console.error(
                'GOOGLE LOGIN ERROR:',
                error
            );

            setError('שגיאה בחיבור עם Google');

            Sentry.captureException(error, {
                tags: {
                    component: 'Login',
                    method: 'GoogleSignin'
                }
            });
        }
    };


    return (

        <div className="login-container">

            <div className="auth-brand">
                <span className="auth-brand-mark" aria-hidden="true">
                    <FontAwesomeIcon icon={faPaw} />
                </span>
                <span>Pets & Bones</span>
            </div>

            <h2 className="login-title">
                היי, טוב לראות אותך
            </h2>


            <form
                className="login-form"
                onSubmit={handleSubmit}
            >

                {/* Email */}

                <label htmlFor="email">
                    מייל
                </label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="yourmail@example.com"
                    required
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />


                {/* Password */}

                <label htmlFor="password">
                    סיסמה
                </label>

                <div className="password-container">

                    <input
                        type={
                            showPassword
                                ? 'text'
                                : 'password'
                        }
                        id="password"
                        name="password"
                        placeholder="הקלד סיסמה"
                        required
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <span
                        className="password-toggle"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                    >

                        <FontAwesomeIcon
                            icon={
                                showPassword
                                    ? faEyeSlash
                                    : faEye
                            }
                        />

                    </span>

                </div>


                {/* Error */}

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {/* Login */}

                <button
                    type="submit"
                    className="login-button"
                >
                    התחברות
                </button>


                {/* Google */}

                <div className="google-signup">

                    <button
                        type="button"
                        onClick={handleGoogleSignin}
                        className="google-button"
                    >

                        התחבר עם Google

                        <FontAwesomeIcon
                            icon={faGoogle}
                            className="google-icon"
                        />

                    </button>

                </div>

            </form>


            {/* Register */}

            <p className="register-text">

                אין לך חשבון?

                <span
                    onClick={handleRegisterRedirect}
                    className="register-link"
                >
                    להרשמה
                </span>

            </p>


            {/* Forgot Password */}

            <p className="register-text">

                <span
                    onClick={handleForgotPassword}
                    className="register-link"
                >
                    שכחתי סיסמה
                </span>

            </p>

        </div>
    );
};


export default Login;
