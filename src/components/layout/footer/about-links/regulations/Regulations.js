import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/data/site-config";
import useSeo from "@/hooks/useSeo";
import InfoPageShell from "../InfoPageShell";

const LAST_UPDATED = "08/2026";

const TOC = [
  { id: "intro", label: "מבוא" },
  { id: "consent", label: "הסכמה לתנאים" },
  { id: "changes", label: "שינויים בתקנון" },
  { id: "account", label: "הרשמה וחשבון" },
  { id: "listings", label: "מודעות ותכנים" },
  { id: "adoption", label: "אימוץ" },
  { id: "transactions", label: "עסקאות בין משתמשים" },
  { id: "ip", label: "קניין רוחני" },
  { id: "liability", label: "אחריות" },
  { id: "privacy", label: "פרטיות" },
  { id: "termination", label: "סיום שימוש" },
  { id: "contact", label: "יצירת קשר" },
  { id: "law", label: "דין וסמכות שיפוט" },
];

const Regulations = () => {
  useSeo({
    title: `תקנון שימוש | ${SITE_NAME}`,
    description: `תקנון השימוש באתר ${SITE_NAME} — תנאים לפרסום, אימוץ ושירותים.`,
    url: `${SITE_URL}/regulations`,
  });

  return (
    <InfoPageShell
      title="תקנון שימוש"
      subtitle={`התנאים לשימוש באתר ${SITE_NAME}.`}
      updatedAt={LAST_UPDATED}
      currentPath="/regulations"
    >
      <article className="info-page-card">
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

        <section className="info-page-section" id="intro">
          <h2>1. מבוא</h2>
          <p>
            ברוכים הבאים ל-{SITE_NAME}, אתר המאפשר למשתמשים לפרסם ולחפש מודעות
            של חיות מחמד, אימוץ, אביזרים, זרעים ושירותים נלווים (כגון וטרינריה,
            פנסיון, אילוף והובלה). השימוש באתר כפוף לתנאים המפורטים בתקנון זה.
          </p>
        </section>

        <section className="info-page-section" id="consent">
          <h2>2. הסכמה לתנאים</h2>
          <p>
            בעצם הכניסה לאתר ו/או השימוש בו, אתה מביע את הסכמתך לתנאי תקנון זה
            במלואם. אם אינך מסכים לתנאי כלשהו, עליך להימנע משימוש באתר.
          </p>
        </section>

        <section className="info-page-section" id="changes">
          <h2>3. שינויים בתקנון</h2>
          <p>
            האתר רשאי לשנות תקנון זה מעת לעת, לפי שיקול דעתו הבלעדי. השינויים
            יפורסמו באתר וייכנסו לתוקף 7 ימים לאחר פרסומם. המשך שימושך באתר לאחר
            מועד זה מהווה הסכמה לשינויים.
          </p>
        </section>

        <section className="info-page-section" id="account">
          <h2>4. הרשמה וחשבון משתמש</h2>
          <ul>
            <li>יצירת חשבון: חלק מהשירותים (כגון פרסום מודעה) דורשים הרשמה ואימות דוא״ל.</li>
            <li>גיל: השימוש מיועד לבגירים בלבד (מעל גיל 18).</li>
            <li>פרטים אישיים: חובה לספק פרטים מדויקים ומעודכנים.</li>
            <li>סודיות: האחריות על שמירת סיסמה וחשבון היא שלך בלבד.</li>
            <li>דיווח: חובה לדווח על שימוש בלתי מורשה בחשבון.</li>
            <li>
              סגירת חשבון: האתר רשאי להשעות או לסגור חשבון במקרה של הפרת תנאים,
              תוכן מטעה, או פגיעה במשתמשים / בחיות.
            </li>
          </ul>
        </section>

        <section className="info-page-section" id="listings">
          <h2>5. מודעות, תכנים ואישור מנהל</h2>
          <ul>
            <li>אחריות מלאה לתכנים, לתמונות ולפרטי הקשר שאתה מפרסם.</li>
            <li>
              חל איסור לפרסם תכנים:
              <ul>
                <li>פוגעניים, גזעניים, פורנוגרפיים, או מפרי זכויות.</li>
                <li>שקריים או מטעים (כולל מחיר, מין, גיל, מצב בריאותי או מוצא).</li>
                <li>מעודדי פעילות בלתי חוקית או התעללות בבעלי חיים.</li>
                <li>כוללי וירוסים או תוכנות זדוניות.</li>
              </ul>
            </li>
            <li>
              מודעות חדשות עשויות לעבור בדיקה ואישור מנהל לפני פרסום פומבי.
              האתר רשאי לדחות, להסיר או לערוך מודעה לפי שיקול דעתו.
            </li>
            <li>חובה להחזיק רישיונות ואישורים נדרשים לפי דין (ככל שנדרשים).</li>
            <li>האתר רשאי להשתמש בתכנים שפורסמו לצורכי קידום האתר.</li>
          </ul>
        </section>

        <section className="info-page-section" id="adoption">
          <h2>6. אימוץ</h2>
          <p>
            מודעות אימוץ באתר נועדו לסייע במציאת בית מתאים. {SITE_NAME} אינה
            ארגון אימוץ ואינה צד להסכמי אימוץ בין משתמשים. האחריות לבדיקת התאמה,
            מסמכים ובריאות החיה חלה על הצדדים לעסקה / להעברה בלבד.
          </p>
        </section>

        <section className="info-page-section" id="transactions">
          <h2>7. אי אחריות לעסקאות בין משתמשים</h2>
          <p>
            האתר משמש כפלטפורמה לפרסום מודעות בלבד ואינו צד לעסקאות, לתשלומים
            או להעברות בין משתמשים. אין אחריות לטיב המוצרים/השירותים, לנכונות
            המידע או לקיום העסקה בפועל. מומלץ לבדוק היטב לפני כל התקשרות.
          </p>
        </section>

        <section className="info-page-section" id="ip">
          <h2>8. קניין רוחני</h2>
          <ul>
            <li>כל הזכויות באתר (עיצוב, לוגו, קוד ותוכן מערכתי) שייכות לבעליו.</li>
            <li>מותר שימוש אישי בלבד במסגרת השירות.</li>
            <li>אסור להעתיק, לשכפל או לעשות שימוש מסחרי ללא אישור מראש ובכתב.</li>
          </ul>
        </section>

        <section className="info-page-section" id="liability">
          <h2>9. אחריות</h2>
          <ul>
            <li>השירות ניתן כפי שהוא (&quot;As Is&quot;) ללא התחייבות לזמינות רציפה.</li>
            <li>האתר לא אחראי לנזקים ישירים או עקיפים הנובעים משימוש באתר.</li>
            <li>אין אחריות לשירותים או מוצרים של צדדים שלישיים.</li>
            <li>אחריות תוכן המודעות על המפרסמים בלבד.</li>
          </ul>
        </section>

        <section className="info-page-section" id="privacy">
          <h2>10. פרטיות</h2>
          <p>
            מדיניות הפרטיות שלנו מהווה חלק בלתי נפרד מתקנון זה. ניתן לקרוא אותה
            בעמוד{" "}
            <Link to="/privacy-policy">מדיניות פרטיות</Link>.
          </p>
        </section>

        <section className="info-page-section" id="termination">
          <h2>11. סיום שימוש</h2>
          <p>
            האתר רשאי להפסיק פעילות, לשנות שירותים או לחסום גישה למשתמש בכל עת,
            לרבות במקרה של הפרת תקנון זה.
          </p>
        </section>

        <section className="info-page-section" id="contact">
          <h2>12. יצירת קשר</h2>
          <div className="info-page-contact">
            <p>
              לשאלות בנוגע לתקנון:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </section>

        <section className="info-page-section" id="law">
          <h2>13. דין וסמכות שיפוט</h2>
          <p>
            הדין החל על תקנון זה ועל השימוש באתר הוא דיני מדינת ישראל. סמכות
            השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.
          </p>
        </section>
      </article>
    </InfoPageShell>
  );
};

export default Regulations;
