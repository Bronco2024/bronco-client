import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import Modal from '@components/utils/modal/Modal';
import * as Sentry from "@sentry/react";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!agreed){
            setError('אנא אשר את תנאי השימוש לפני ההרשמה');
            return;
        }
        setError('');

        if (password === verifyPassword) {
            try {
                await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    const user = userCredential.user;
                    sendEmailVerification(user).then(async () => {
                        await signOut(auth);
                        setShowModal(true);
                    })
                })

                // await setDoc(doc(db, "users", user.uid), {
                //     email: user.email,
                //     subscribedUntil: null,
                //     numberOfAds: 1
                // })

                // navigate('/');
            } catch (error) {
                const errorCode = error.code;
                const errorCodeAndMessage = `${errorCode} - ${error}`;

                if (errorCode === "auth/email-already-in-use") {
                    setError("אימייל זה כבר רשום");

                } else {
                    setError("שגיאה לא צפויה, נסה שוב");
                    Sentry.captureException(`Error in register`, {
                        tags: {
                            component: "Register"
                        },
                        extra: {
                            info: errorCodeAndMessage
                        }
                    });
                }
            }
        } else {
            setError("סיסמאות לא זהות");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/login');
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

                <div className='checkbox-container'>
                    <label>
                        <input type="checkbox" id="agreement" name="agreement" checked={agreed} onChange={handleCheckboxChange} />
                        {' '}קראתי את{' '}
                        <a
                            href="/terms-and-conditions.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'blue', textDecoration: 'underline' }}
                        >
                            תנאי הימוש
                        </a>
                        {' '}ואני מסכים{' '}
                    </label>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="register-button">הרשמה</button>
            </form>

            <p className="register-text">
                כבר יש לך חשבון? <span onClick={handleLoginRedirect} className="login-link">התחברות</span>
            </p>

            <Modal isVisible={showModal} title="מודעה פורסמה" onClose={closeModal}>
                <div className="modal-content-custom-register">
                    <p>מייל נשלח אליך לצורך אימות</p>
                    <div className="modal-buttons-custom-register">
                        <button className="close-button-register" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Register;
