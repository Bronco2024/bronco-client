import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'
import Modal from '@components/utils/modal/Modal';
import * as Sentry from "@sentry/react";
import { sendSitePasswordReset } from '@/helpers/auth-email';
import { getAuthErrorMessage } from '@/helpers/auth-errors';
import { SITE_NAME } from '@/data/site-config';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError('נא להזין כתובת אימייל');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await sendSitePasswordReset(cleanEmail);
            setIsModalVisible(true);
        } catch (err) {
            setError(getAuthErrorMessage(err?.code, 'לא הצלחנו לשלוח קישור לאיפוס סיסמה'));
            Sentry.captureException(err, {
                tags: { component: "ForgotPassword" },
                extra: { info: `${err?.code} - ${err?.message}` },
            });
        } finally {
            setLoading(false);
        }
    }

    const handleRegisterRedirect = () => {
        navigate('/register');
    }

    return (
        <div className="forgot-password-container">
            <h2 className="forgot-password-title">חידוש סיסמה</h2>
            <form className="forgot-password-form" onSubmit={handleSubmit}>
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="forgot-password-button" disabled={loading}>
                    {loading ? 'שולח…' : 'שלח קישור לאיפוס'}
                </button>
            </form>
            <p className="register-text">
                אין לך חשבון? <span onClick={handleRegisterRedirect} className="register-link">להרשמה</span>
            </p>

            <Modal isVisible={isModalVisible} title="לינק נשלח" onClose={closeModal}>
                <div className="modal-content-custom">
                    <p>שלחנו קישור לאיפוס סיסמה מ־{SITE_NAME} למייל שהוזן.</p>
                    <p>בדקו גם בתיקיית הספאם אם המייל לא מופיע.</p>
                    <div className="modal-buttons-custom">
                        <button className="close-button-forgot-password" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ForgotPassword;
