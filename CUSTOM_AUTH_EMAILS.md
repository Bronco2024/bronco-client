# إيميلات Petzo المخصصة (تحقق + نسيت كلمة السر)

Firebase قوالب الإيميل عندك **مقفولة** وما زال فيها Horsehub.  
لهذا الموقع صار يرسل إيميلات **باسم Petzo** عبر Netlify Functions.

## شو صار بالكود
- بعد التسجيل → إيميل تحقق Petzo (زر برتقالي + RTL)
- نسيت סיסמה → إيميل إعادة تعيين Petzo
- إذا الـ Function فشلت → يرجع مؤقتاً لإيميل Firebase الافتراضي

## إعداد Netlify (مرة واحدة — ضروري)

### 1) Firebase Service Account
1. Firebase Console → ⚙️ Project settings → **Service accounts**
2. **Generate new private key** → ينزل ملف JSON
3. افتح الملف، انسخ **كل** المحتوى

### 2) Netlify Environment variables
Site configuration → Environment variables → أضف لـ **Production** (و Preview إن حاب):

| الاسم | القيمة |
|--------|--------|
| `FIREBASE_SERVICE_ACCOUNT` | الصق JSON كامل في سطر واحد (أو كما يدعم Netlify) |
| `SMTP_USER` | `petzo.team@gmail.com` |
| `SMTP_PASS` | Gmail **App Password** (نفس اللي استخدمته بـ SMTP) |
| `SMTP_FROM_NAME` | `Petzo` |
| `SMTP_FROM_EMAIL` | `petzo.team@gmail.com` |
| `SITE_URL` | `https://petzo.co.il` |

اختياري:
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`

### 3) Redeploy
بعد حفظ المتغيرات → **Trigger deploy** / Redeploy الموقع.

### 4) تجربة
1. سجّل حساب جديد
2. لازم يوصل ميل عنوانه مثل: `אימות כתובת האימייל שלך ב-Petzo`
3. المرسل: Petzo / petzo.team@gmail.com
4. جرّب أيضاً שכחתי סיסמה

## ملاحظات أمان
- لا ترفع ملف الـ service account للـ Git
- `FIREBASE_SERVICE_ACCOUNT` و `SMTP_PASS` أسرار فقط في Netlify

إذا الميل ما وصل بعد الإعداد: Netlify → Functions → logs لـ `send-verification-email`
