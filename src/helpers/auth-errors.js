/** Shared Hebrew messages for Firebase Auth errors (login / register / Google). */

export const getAuthErrorMessage = (errorCode, fallback = "אירעה שגיאה. נסו שוב.") => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "האימייל או הסיסמה לא נכונים";
    case "auth/invalid-email":
      return "כתובת האימייל אינה תקינה";
    case "auth/user-not-found":
      return "לא נמצא משתמש עם כתובת האימייל הזאת";
    case "auth/user-disabled":
      return "החשבון הזה נחסם";
    case "auth/too-many-requests":
      return "בוצעו יותר מדי ניסיונות. נסו שוב מאוחר יותר";
    case "auth/network-request-failed":
      return "יש בעיה בחיבור. אם פתחתם מפייסבוק/אינסטגרם — פתחו את האתר ב-Chrome או Safari ונסו שוב.";
    case "auth/in-app-browser":
      return "התחברות עם Google לא עובדת בדפדפן של פייסבוק/אינסטגרם. פתחו את Petzo ב-Chrome או Safari.";
    case "auth/operation-not-allowed":
      return "שיטת ההתחברות אינה מופעלת ב-Firebase. הפעילו Email/Password או Google ב-Console.";
    case "auth/unauthorized-domain":
      return "הדומיין אינו מורשה ב-Firebase. הוסיפו petzo.co.il ב-Authorized domains.";
    case "auth/popup-closed-by-user":
      return "חלון Google נסגר לפני השלמת ההתחברות";
    case "auth/popup-blocked":
      return "הדפדפן חסם את חלון Google. אפשרו חלונות קופצים ונסו שוב.";
    case "auth/cancelled-popup-request":
      return "בקשת ההתחברות בוטלה. נסו שוב.";
    case "auth/account-exists-with-different-credential":
      return "כבר קיים חשבון עם האימייל הזה בשיטת התחברות אחרת";
    case "auth/email-already-in-use":
      return "אימייל זה כבר רשום";
    case "auth/weak-password":
      return "הסיסמה חלשה מדי (לפחות 6 תווים)";
    case "auth/invalid-api-key":
      return "יש בעיה בהגדרות Firebase";
    case "auth/app-not-authorized":
      return "האתר אינו מורשה להשתמש ב-Firebase";
    case "auth/internal-error":
      return "שגיאה פנימית בהתחברות Google. נסו שוב או השתמשו באימייל וסיסמה.";
    case "auth/web-storage-unsupported":
      return "הדפדפן חוסם אחסון מקומי. אפשרו cookies ונסו שוב.";
    case "auth/redirect-cancelled-by-user":
      return "ההתחברות עם Google בוטלה";
    case "auth/missing-or-invalid-nonce":
      return "בקשת Google נכשלה. נסו שוב.";
    default:
      if (String(errorCode || "").includes("redirect_uri")) {
        return "הגדרות Google לא שלמות (redirect_uri). עדכנו ב-Google Cloud לפי GOOGLE_LOGIN_FIX.md";
      }
      return fallback;
  }
};
