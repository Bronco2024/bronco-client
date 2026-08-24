import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/data/site-config";
import useSeo from "@/hooks/useSeo";
import InfoPageShell from "../InfoPageShell";

const LAST_UPDATED = "08/2026";

const TOC = [
  { id: "collect", label: "אילו נתונים נאספים" },
  { id: "purpose", label: "למה אוספים" },
  { id: "share", label: "שיתוף מידע" },
  { id: "public", label: "מידע במודעות" },
  { id: "cookies", label: "עוגיות וטכנולוגיות" },
  { id: "rights", label: "זכויותיך" },
  { id: "retention", label: "שמירת מידע" },
  { id: "security", label: "אבטחה" },
  { id: "minors", label: "קטינים" },
  { id: "changes", label: "שינויים במדיניות" },
  { id: "contact", label: "יצירת קשר" },
];

const PrivacyPolicy = () => {
  useSeo({
    title: `מדיניות פרטיות | ${SITE_NAME}`,
    description: `מדיניות הפרטיות של ${SITE_NAME} — כיצד אנו אוספים ומשתמשים במידע.`,
    url: `${SITE_URL}/privacy-policy`,
  });

  return (
    <InfoPageShell
      title="מדיניות פרטיות"
      subtitle={`איך ${SITE_NAME} אוסף, משתמש ושומר על המידע שלך.`}
      updatedAt={LAST_UPDATED}
      currentPath="/privacy-policy"
    >
      <article className="info-page-card">
        <p className="info-page-intro">
          ברוכים הבאים ל-{SITE_NAME}. אנו מחויבים להגן על פרטיותך ולשמור על המידע
          שאתה משתף איתנו בעת השימוש באתר. מדיניות זו מסבירה כיצד אנו אוספים,
          משתמשים, משתפים ומשמרים מידע — בהתאם לחוק הגנת הפרטיות, התשמ״א-1981
          ולדין החל בישראל. השימוש באתר כפוף גם ל־
          <Link to="/regulations">תקנון השימוש</Link>.
        </p>

        <nav className="info-page-toc" aria-label="תוכן עניינים">
          <strong>תוכן עניינים</strong>
          <ol>
            {TOC.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>
                  {index + 1}. {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section className="info-page-section" id="collect">
          <h2>1. אילו סוגי נתונים אנו אוספים?</h2>
          <ul>
            <li>
              <strong>מידע חשבון:</strong> שם, כתובת דוא״ל, וסיסמה מוצפנת
              (באמצעות ספקי אימות כגון Firebase Authentication).
            </li>
            <li>
              <strong>מידע במודעות:</strong> תיאורים, תמונות/וידאו, מיקום/עיר,
              מחיר, פרטי קשר וטלפון שתבחרו לפרסם.
            </li>
            <li>
              <strong>מידע טכני:</strong> כתובת IP, סוג דפדפן ומכשיר, ודפוסי
              שימוש בסיסיים לצורך תפעול ואבטחה.
            </li>
            <li>
              <strong>התחברות עם Google:</strong> אם תבחרו להתחבר באמצעות Google,
              נקבל פרטים בסיסיים מהחשבון (כגון דוא״ל ושם) בהתאם להרשאות שתאשרו.
            </li>
          </ul>
        </section>

        <section className="info-page-section" id="purpose">
          <h2>2. למטרות מה אנחנו אוספים את המידע?</h2>
          <ul>
            <li>לאפשר הרשמה, אימות דוא״ל וניהול חשבון.</li>
            <li>לאפשר פרסום, חיפוש ואישור מודעות (כולל אימוץ ושירותים).</li>
            <li>לספק תמיכה ולטפל בפניות.</li>
            <li>לשלוח הודעות תפעוליות חשובות (למשל אימות או עדכון מודעה).</li>
            <li>לשפר את האתר, למנוע הונאה ולעמוד בדרישות חוק.</li>
          </ul>
        </section>

        <section className="info-page-section" id="share">
          <h2>3. עם מי משתפים את המידע?</h2>
          <ul>
            <li>
              ספקי תשתית ושירות (למשל Firebase / Google Cloud, אחסון, דוא״ל
              ופריסה) — רק במידה הנדרשת להפעלת האתר.
            </li>
            <li>כאשר החוק מחייב, או לפי צו שיפוטי.</li>
            <li>במקרה של מיזוג, רכישה או העברת פעילות האתר — בכפוף להגנות מתאימות.</li>
            <li>אין אנו מוכרים את המידע האישי שלך לצדדים שלישיים.</li>
          </ul>
        </section>

        <section className="info-page-section" id="public">
          <h2>4. מידע שמופיע במודעות</h2>
          <p>
            פרטים שתבחרו לכלול במודעה (למשל טלפון, עיר, תמונות ותיאור) עשויים
            להיות גלויים לקהל הרחב. אנא אל תפרסמו מידע רגיש שאינו נחוץ ליצירת
            קשר או לעסקה.
          </p>
        </section>

        <section className="info-page-section" id="cookies">
          <h2>5. עוגיות וטכנולוגיות דומות</h2>
          <p>
            האתר עשוי להשתמש בעוגיות (Cookies) ובאחסון מקומי לצורך התחברות,
            העדפות משתמש ותפעול תקין. ניתן לנהל עוגיות דרך הגדרות הדפדפן; חסימה
            מלאה עלולה לפגוע בחלק מהפונקציות.
          </p>
        </section>

        <section className="info-page-section" id="rights">
          <h2>6. זכויותיך</h2>
          <ul>
            <li>לעיין במידע שנשמר אודותיך.</li>
            <li>לבקש עדכון, תיקון או מחיקה של מידע, בכפוף לדין ולצרכים תפעוליים.</li>
            <li>לבטל קבלת הודעות שיווקיות (אם יישלחו).</li>
            <li>
              לפנות אלינו בכתובת:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </li>
          </ul>
        </section>

        <section className="info-page-section" id="retention">
          <h2>7. שמירת המידע</h2>
          <p>
            המידע יישמר כל עוד החשבון פעיל, כל עוד נדרש להפעלת השירות, או לפי
            דרישות חוק (למשל שמירת רשומות). מודעות שהוסרו עשויות להישמר לפרק זמן
            סביר לצורכי אבטחה ובקרה.
          </p>
        </section>

        <section className="info-page-section" id="security">
          <h2>8. אבטחת המידע</h2>
          <p>
            ננקטים אמצעי אבטחה סבירים (כולל הצפנת תעבורה והגנות מצד ספקי
            התשתית), אך לא ניתן להבטיח אבטחה מוחלטת. האחריות לשמירת סיסמה
            והתקן הגישה שלך היא עליך.
          </p>
        </section>

        <section className="info-page-section" id="minors">
          <h2>9. קטינים</h2>
          <p>
            השירות מיועד למשתמשים בגירים (מעל גיל 18). איננו אוספים ביודעין מידע
            מקטינים. אם התגלה מידע כזה — נפעל למחיקתו.
          </p>
        </section>

        <section className="info-page-section" id="changes">
          <h2>10. שינויים במדיניות</h2>
          <p>
            מדיניות זו עשויה להשתנות מעת לעת. תאריך העדכון יופיע בראש העמוד.
            המשך השימוש באתר לאחר השינוי מהווה הסכמה למדיניות המעודכנת.
          </p>
        </section>

        <section className="info-page-section" id="contact">
          <h2>11. יצירת קשר</h2>
          <div className="info-page-contact">
            <p>
              לשאלות או בקשות בנושא פרטיות:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </section>
      </article>
    </InfoPageShell>
  );
};

export default PrivacyPolicy;
