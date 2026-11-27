# إيميلات طلبات المتجر (شاري + أدمن)

بعد كل طلب جديد الموقع يحاول:

1. **Netlify Function + SMTP** (`SMTP_PASS`) — الأفضل  
2. **Netlify Forms** (`store-order`) — يعمل بدون SMTP إذا فعّلت الإشعار مرة  
3. FormSubmit / EmailJS — احتياطي (FormSubmit غالباً محجوب بـ Cloudflare)

## لازم الآن على Netlify (دقيقتين)

### أ) إشعار فوري بدون SMTP (Forms)
1. افتح [Netlify](https://app.netlify.com) → موقع **petbones**  
2. بعد ما ينشر آخر deploy: **Forms** → لازم تشوف فورم اسمه `store-order`  
3. **Form notifications** → **Add notification** → **Email notification**  
4. إلى: `bronco.estd2024@gmail.com` (أو إيميل الأدمن)  
5. اختياري: Autoresponse على حقل `buyerEmail` بنص تأكيد الطلب

### ب) SMTP ثابت (موصى فيه للإطلاق)
Site configuration → Environment variables → Production:

| الاسم | قيمة |
|--------|------|
| `FIREBASE_SERVICE_ACCOUNT` | JSON كامل من Firebase → Service accounts |
| `SMTP_USER` | `petzo.team@gmail.com` |
| `SMTP_PASS` | Gmail **App Password** |
| `SMTP_FROM_NAME` | `Petzo` |
| `SMTP_FROM_EMAIL` | `petzo.team@gmail.com` |

بعد الحفظ → **Trigger deploy**.

## فحص سريع
1. اعمل طلب COD من الموقع  
2. لازم يوصل ميل للأدمن + تأكيد للشاري  
3. وكمان يظهر الطلب في `/admin` (صندوق الإشعارات)
