import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPaw } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import Modal from '@components/utils/modal/Modal';
import * as Sentry from "@sentry/react";
import { handleGoogleSignupAndSignIn } from '../../helpers/firebase-helpers';
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
import { useAuth } from '@/context/AuthProvider';
import {
    resolveAuthReturnTo,
    stashAuthReturnTo,
} from '@/helpers/auth-return';

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentUser, loading: authLoading } = useAuth();
    const didRedirectRef = useRef(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const goAfterAuth = () => {
        if (didRedirectRef.current) return;
        didRedirectRef.current = true;
        const next = resolveAuthReturnTo({
            searchNext: searchParams.get("next") || "",
            fallback: "/",
        });
        navigate(next, { replace: true });
    };

    useEffect(() => {
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
            setError(getAuthErrorMessage(redirectError, 'שגיאה בהרשמה עם Google'));
        }
    }, []);

    const handleLoginRedirect = () => {
        const next = searchParams.get("next");
        navigate(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
    };

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setError('אנא אשר את תנאי השימוש לפני ההרשמה');
            return;
        }
        setError('');

        if (password !== verifyPassword) {
            setError("סיסמאות לא זהות");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );
            await sendSiteEmailVerification(userCredential.user);
            await signOut(auth);
            setShowModal(true);
        } catch (error) {
            setError(getAuthErrorMessage(error?.code, "שגיאה לא צפויה, נסה שוב"));
            if (error?.code !== "auth/email-already-in-use") {
                Sentry.captureException(error, {
                    tags: { component: "Register" },
                    extra: { info: `${error?.code} - ${error?.message}` },
                });
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/login');
    };


    const handleGoogleSignup = async () => {
        if (!agreed) {
            setError('אנא אשר את תנאי השימוש לפני ההרשמה עם Google');
            return;
        }
        try {
            setError('');
            setGoogleLoading(true);
            const result = await handleGoogleSignupAndSignIn();
            if (result?.user) {
                goAfterAuth();
                return;
            }
            // Redirect started — keep loading until navigation.
            return;
        } catch (error) {
            setError(getAuthErrorMessage(error?.code, "שגיאה בהרשמה עם Google"));
            if (error?.code === IN_APP_BROWSER_AUTH_CODE) {
                openInSystemBrowser();
            } else {
                Sentry.captureException(error, {
                    tags: { component: "Register", method: "GoogleSignup" }
                });
            }
            setGoogleLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="auth-brand">
                <span className="auth-brand-mark" aria-hidden="true">
                    <FontAwesomeIcon icon={faPaw} />
                </span>
                <span>{SITE_NAME}</span>
            </div>
            <h2 className="register-title">הירשם</h2>
            <InAppBrowserNotice />
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

                <div className='checkbox-container'>
                    <label>
                        <input type="checkbox" id="agreement" name="agreement" checked={agreed} onChange={handleCheckboxChange} />
                        {' '}קראתי את{' '}
                        <Link
                            to="/regulations"
                            style={{ color: 'blue', textDecoration: 'underline' }}
                        >
                            תנאי השימוש
                        </Link>
                        {' '}ואני מסכים{' '}
                    </label>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="register-button">הרשמה</button>

                <div className="google-signup">
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="google-button"
                        disabled={googleLoading}
                    >
                        {googleLoading ? 'מתחבר…' : 'הירשם עם Google'}
                        <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                    </button>
                </div>

            </form>

            <p className="register-text">
                כבר יש לך חשבון? <span onClick={handleLoginRedirect} className="login-link">התחברות</span>
            </p>

            <Modal isVisible={showModal} title="נשלח מייל אימות" onClose={closeModal}>
                <div className="modal-content-custom-register">
                    <p>שלחנו אליכם מייל לאימות החשבון מ־{SITE_NAME}.</p>
                    <p className="verification-hint">
                        אם המייל לא מופיע בתיבת הדואר, בדקו גם בתיקיית הספאם / דואר זבל
                        וסמנו אותו כ־לא ספאם.
                    </p>
                    <div className="modal-buttons-custom-register">
                        <button className="close-button-register" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Register;
