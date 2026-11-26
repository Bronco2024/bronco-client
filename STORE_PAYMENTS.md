# תשלום בחנות Petzo (Grow)

הלקוח משלם באתר דרך **Grow / Meshulam** (כרטיס / ביט), ואז מקבל משלוח עד הבית.

## זרימה

1. לקוח ממלא כתובת ב־`/cart/checkout` ובוחר **תשלום באתר**
2. נוצרת הזמנה ב־Firestore (`purchases`) עם `status: awaiting_payment`
3. Netlify Function `create-store-payment` קוראת ל־Grow `createPaymentProcess`
4. הלקוח מועבר לדף התשלום של Grow
5. Grow שולח webhook ל־`grow-payment-notify` → ההזמנה מסומנת `paid` / `confirmed`
6. הלקוח חוזר ל־`/order/thank-you?orderId=...&paid=1`

## משתני סביבה ב־Netlify

| משתנה | חובה | הערה |
|--------|--------|------|
| `GROW_USER_ID` | כן | מזהה העסק מ־Grow |
| `GROW_PAGE_CODE` | כן | עמוד תשלום (כרטיס/ביט) |
| `GROW_API_KEY` | לא | רק לאינטגרציית פלטפורמה |
| `GROW_ENV` | לא | `sandbox` (ברירת מחדל) או `live` |
| `SITE_URL` | מומלץ | `https://petzo.co.il` |
| `FIREBASE_SERVICE_ACCOUNT` | כן | לעדכון הזמנות מהשרת |

מפתחות מקבלים מ־Grow Support אחרי הרשמה ל־Grow Business.

## בדיקות

- Sandbox: `GROW_ENV=sandbox` + מזהי sandbox
- אחרי ניסיון מוצלח — לבקש מ־Grow מעבר ל־Production ואז `GROW_ENV=live`
