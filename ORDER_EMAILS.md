# إيميلات طلبات المتجر (شاري + أدمن)

بعد كل طلب جديد الموقع يحاول:

1. **Netlify Function + SMTP** (`SMTP_PASS`) — الأفضل  
2. **Netlify Forms** (`store-order`) — يعمل بدون SMTP إذا فعّلت الإشعار مرة  
3. FormSubmit / EmailJS — احتياطي (FormSubmit غالباً محجوب بـ Cloudflare)

## لازم الآن على Netlify (دقيقتين)

### أ) إشعار فوري بدون SMTP (Forms)
1. افتح [Netlify](https://app.netlify.com) → موقع **petbones**  
2. **Site configuration → Forms** — تأكد إن Form detection شغال  
3. بعد آخر deploy: **Forms** → لازم تشوف فورم `store-order`  
   (صفحة التسجيل: `https://petzo.co.il/store-order-form.html`)  
4. **Form notifications** → **Add notification** → **Email notification**  
5. إلى: `bronco.estd2024@gmail.com` (أو إيميل الأدمن)  
6. اختياري: Autoresponse على حقل `buyerEmail` بنص تأكيد الطلب  

إذا Forms فاضي بعد الـ deploy: Site configuration → Build & deploy → Forms → فعّل detection وعمل **Clear cache and deploy**.

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

## إذا الميل عند المشتري يروح Junk / ספאם
الكود صار يرسل From مطابق لـ SMTP، عنوان أقصر، وheaders أفضل. كمان:

1. من Gmail المشتري: افتح الميل → **דיווח על לא ספאם / Not spam**  
2. أضف `petzo.team@gmail.com` لجهات الاتصال  
3. حل طويل الأمد (أفضل بكثير من Gmail الحر):  
   إيميل على الدومين `orders@petzo.co.il` (Google Workspace أو Brevo/Resend)  
   مع SPF + DKIM على `petzo.co.il`
