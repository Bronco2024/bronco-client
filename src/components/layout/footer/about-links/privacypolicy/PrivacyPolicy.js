import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="policy-section">
            <h2 className="policy-heading">מדיניות פרטיות ל-Pets & Bones</h2>
            <p className="policy-date">תאריך עדכון אחרון: 08/2026</p>

            <p className="policy-intro">
                ברוכים הבאים ל-Pets & Bones. אנו מחויבים להגן על הפרטיות ולשמור על המידע שאתה משתף איתנו בעת השימוש באתר שלנו.
                מדיניות זו מסבירה כיצד אנו אוספים, משתמשים, משתפים ומשמרים את המידע שלך כדי לספק חוויית שירות מקיפה ובטוחה יותר.
            </p>

            <div className="policy-section-block">
                <h3>1. מהם סוגי הנתונים שאנו אוספים?</h3>
                <ul>
                    <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מכשיר, מיקום גאוגרפי, דפוסי גלישה, פעולות שבוצעו באתר.</li>
                    <li><strong>מידע אישי:</strong> שם, טלפון, דוא"ל, כתובת מגורים, תיאורי פרסום ותמונות של חיות מחמד.</li>
                    <li><strong>שירותי צד שלישי:</strong> לדוגמה התחברות עם פייסבוק או Google.</li>
                    <li><strong>מידע מצדדים שלישיים:</strong> לצורכי שיווק ותפעול האתר.</li>
                </ul>
            </div>

            <div className="policy-section-block">
                <h3>2. למטרות מה אנחנו אוספים את המידע?</h3>
                <ul>
                    <li>לסייע בפרסום ובמכירה של חיות מחמד, אימוץ, אביזרים ושירותים נלווים.</li>
                    <li>לנהל חשבונות ותשלומים.</li>
                    <li>לספק שירות לקוחות ותמיכה.</li>
                    <li>לשלוח עדכונים ומבצעים.</li>
                    <li>לנתח תנועות גלישה ולפתח תכנים מותאמים.</li>
                    <li>לעמוד בדרישות חוקיות.</li>
                </ul>
            </div>

            <div className="policy-section-block">
                <h3>3. עם מי משתפים את המידע שלך?</h3>
                <ul>
                    <li>ספקי שירותים חיצוניים לאחסון, עיבוד ואבטחת מידע.</li>
                    <li>שותפי פרסום וקידום מכירות.</li>
                    <li>צדדים שמעורבים במכירות ופעילות האתר.</li>
                    <li>במקרה של מיזוג, רכישה או מכירה של האתר.</li>
                    <li>כאשר החוק מחייב.</li>
                </ul>
            </div>

            <div className="policy-section-block">
                <h3>4. זכויותיך והגנות על הפרטיות שלך</h3>
                <ul>
                    <li>לעיין במידע שנשמר אודותיך.</li>
                    <li>לבקש עדכון, תיקון או מחיקה.</li>
                    <li>לבטל קבלת הודעות שיווקיות.</li>
                    <li>לפנות אלינו בכתובת: <strong>petsbones@gmail.com</strong>.</li>
                </ul>
            </div>

            <div className="policy-section-block">
                <h3>5. שמירת המידע</h3>
                <p>המידע יישמר בהתאם לצורך או לפי דרישות חוקיות.</p>
            </div>

            <div className="policy-section-block">
                <h3>6. אבטחת המידע</h3>
                <p>ננקטים אמצעי אבטחה סבירים אך לא ניתן להבטיח אבטחה מוחלטת. האחריות לשמירת סיסמאות היא שלך.</p>
            </div>

            <div className="policy-section-block">
                <h3>7. שינויים במדיניות</h3>
                <p>מדיניות זו עשויה להשתנות מעת לעת. המשך השימוש באתר מהווה הסכמה לתנאים המעודכנים.</p>
            </div>

            <div className="policy-section-block">
                <h3>8. יצירת קשר</h3>
                <p>לשאלות או בקשות: <strong><a href='mailto:petsbones@gmail.com'>petsbones@gmail.com</a></strong></p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
