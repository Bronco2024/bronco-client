import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPassword.css'
import Modal from '@components/utils/modal/Modal';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const closeModal = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await sendPasswordResetEmail(auth, email)
            .then(() => {
                setIsModalVisible(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode," ",errorMessage)
            });
    }

    const handleRegisterRedirect = () => {
        navigate('/register');
    }

    return (
        <div className="forgot-password-container">
            <h2 className="forgot-password-title">חידוש סיסמה</h2>
            <form className="forgot-password-form">
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

                <button type="submit" className="forgot-password-button" onClick={handleSubmit}>שלח קוד</button>
            </form>
            <p className="register-text">
                אין לך חשבון? <span onClick={handleRegisterRedirect} className="register-link">להרשמה</span>
            </p>

            <Modal isVisible={isModalVisible} title="לינק נשלח" onClose={closeModal}>
                <div className="modal-content-custom">
                    <p>לינק נשלח למייל שהוכנס</p>
                    <div className="modal-buttons-custom">
                        <button className="close-button-forgot-password" onClick={closeModal}>סגור</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ForgotPassword;