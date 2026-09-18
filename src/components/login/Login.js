import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    reload
} from 'firebase/auth';

import { useAuth } from '@/context/AuthProvider';

import * as Sentry from '@sentry/react';

import {
    handleGoogleSignupAndSignIn
} from '../../helpers/firebase-helpers';
import { sendSiteEmailVerification } from '../../helpers/auth-email';
import { getAuthErrorMessage } from '../../helpers/auth-errors';
import { SITE_NAME } from '@/data/site-config';
import InAppBrowserNotice, {
    openInSystemBrowser,
} from '../auth/InAppBrowserNotice';
import {
    IN_APP_BROWSER_AUTH_CODE,
    consumeGoogleRedirectError,
} from '../../helpers/google-auth-strategy';
import {
    resolveAuthReturnTo,
    stashAuthReturnTo,
} from '@/helpers/auth-return';


const Login = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendStatus, setResendStatus] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    const { currentUser, loading: authLoading, logout } = useAuth();
    const didRedirectRef = useRef(false);

    const goAfterAuth = () => {
        if (didRedirectRef.current) return;
        didRedirectRef.current = true;
        const next = resolveAuthReturnTo({
            searchNext: searchParams.get("next") || "",
            fallback: "/",
        });
        navigate(next, { replace: true });
    };


    /* ================================
       Already signed in / Google redirect finished
    ================================= */

    useEffect(() => {
        // Persist next= for Google redirect round-trips.
        const next = searchParams.get("next");
        if (next) stashAuthReturnTo(next);
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading && currentUser) {
            goAfterAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, currentUser, navigate, searchParams]);

    useEffect(() => {
        const redirectError = consumeGoogleRedirectError();
        if (redirectError) {
            setError(getAuthErrorMessage(redirectError, 'שגיאה בחיבור עם Google'));
        }
    }, []);

    useEffect(() => {
        if (searchParams.get('verified') === '1') {
            setResendStatus('האימייל אומת בהצלחה. אפשר להתחבר עכשיו.');
        }
    }, [searchParams]);


    /* ================================
       Forgot Password
    ================================= */

    const handleForgotPassword = () => {
        navigate('/login/forgot-password');
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

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

            /* Reload user information */

            await reload(userCredential.user);


            /* Check email verification */

            if (!userCredential.user.emailVerified) {

                await logout();

                setNeedsVerification(true);
                setError(
                    'נא לאמת את כתובת האימייל לפני ההתחברות. אם לא מצאתם את המייל, בדקו גם בספאם.'
                );

                return;
            }

            setNeedsVerification(false);
            setResendStatus('');


            /* Login successful */

            goAfterAuth();


        } catch (error) {

            console.error(
                'LOGIN FIREBASE ERROR:',
                error
            );

            setError(getAuthErrorMessage(error?.code));


            Sentry.captureException(error, {
                tags: {
                    component: 'Login',
                    method: 'EmailLogin'
                },
                extra: {
                    errorCode: error?.code,
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
            setGoogleLoading(true);

            const result = await handleGoogleSignupAndSignIn();
            if (result?.user) {
                goAfterAuth();
                return;
            }
            // Redirect started — keep loading until the browser leaves this page.
            return;

        } catch (error) {

            console.error(
                'GOOGLE LOGIN ERROR:',
                error
            );

            setError(getAuthErrorMessage(error?.code, 'שגיאה בחיבור עם Google'));

            // Expected in Facebook/Instagram WebViews — open Chrome/Safari instead.
            if (error?.code === IN_APP_BROWSER_AUTH_CODE) {
                openInSystemBrowser();
            } else {
                Sentry.captureException(error, {
                    tags: {
                        component: 'Login',
                        method: 'GoogleSignin'
                    }
                });
            }
            setGoogleLoading(false);
        }
    };


    const handleResendVerification = async () => {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            setError('נא למלא אימייל וסיסמה כדי לשלוח שוב את מייל האימות');
            return;
        }

        try {
            setResendStatus('');
            setError('');

            const userCredential = await signInWithEmailAndPassword(
                auth,
                cleanEmail,
                password
            );

            if (userCredential.user.emailVerified) {
                await logout();
                setNeedsVerification(false);
                setError('החשבון כבר מאומת. אפשר להתחבר עכשיו.');
                return;
            }

            await sendSiteEmailVerification(userCredential.user);
            await logout();
            setResendStatus(
                'מייל אימות נשלח שוב. בדקו את תיבת הדואר וגם את תיקיית הספאם.'
            );
        } catch (error) {
            setError(getAuthErrorMessage(error?.code, 'לא הצלחנו לשלוח שוב את מייל האימות. נסו שוב.'));
            Sentry.captureException(error, {
                tags: {
                    component: 'Login',
                    method: 'ResendVerification'
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
                <span>{SITE_NAME}</span>
            </div>

            <h2 className="login-title">
                היי, טוב לראות אותך
            </h2>

            <InAppBrowserNotice />


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

                {resendStatus && (
                    <p className="verification-status">
                        {resendStatus}
                    </p>
                )}

                {needsVerification && (
                    <button
                        type="button"
                        className="resend-verification-button"
                        onClick={handleResendVerification}
                    >
                        שלח שוב מייל אימות
                    </button>
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
                        disabled={googleLoading}
                    >

                        {googleLoading ? 'מתחבר…' : 'התחבר עם Google'}

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
                    onClick={() => {
                        const next = searchParams.get("next");
                        navigate(
                            next
                                ? `/register?next=${encodeURIComponent(next)}`
                                : "/register"
                        );
                    }}
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
