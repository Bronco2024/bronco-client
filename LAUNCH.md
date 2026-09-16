# قائمة إطلاق Petzo — قبل ما نبلش ننشر

الموقع أونلاين على `https://petzo.co.il`.  
الكود جاهز. اللي تحت **لازم تعمله إنت يدوياً** في Firebase / Gmail / Netlify.

---

## 1) Firebase — نطاقات مصرّح فيها (مهم لـ Google وللإيميل)

1. افتح [Firebase Console](https://console.firebase.google.com) → مشروع Petzo  
2. **Authentication → Settings → Authorized domains**  
3. تأكد موجودة:
   - `petzo.co.il`
   - `petbones.netlify.app`
   - `localhost` (للتطوير)
4. (اختياري) أضف `www.petzo.co.il` إذا فعّلته في Netlify

بدون `petzo.co.il` هنا → Google login ورابط التحقق بيفشلوا.

---

## 2) Firebase — تفعيل طرق الدخول

**Authentication → Sign-in method:**

| الطريقة | لازم |
|---------|------|
| Email/Password | مفعّل |
| Google | مفعّل (Support email = `petzo.team@gmail.com`) |

بعد تفعيل Google، جرّب من الموقع: **התחבר עם Google**.

> ملاحظة تقنية: الموقع يستخدم **redirect** لـ Google (موثوق أكثر من popup).  
> `authDomain` الافتراضي: `bronco-65aaf.firebaseapp.com` (مسجّل عند Google).  
> بروكسي `/__/auth/*` موجود في `netlify.toml` و`public/_redirects`.

### إذا ظهر: Error 400: redirect_uri_mismatch
معناه Google ما عنده رابط الرجوع. الحل السريع بالكود: خليه على `bronco-65aaf.firebaseapp.com`.

عشان تستخدم `petzo.co.il` لاحقاً:
1. [Google Cloud Console](https://console.cloud.google.com/) → مشروع `bronco-65aaf`
2. **APIs & Services → Credentials**
3. افتح **OAuth 2.0 Client ID** (نوع Web client / Auto-created by Google Service)
4. **Authorized redirect URIs** → أضف بالضبط:
   - `https://petzo.co.il/__/auth/handler`
   - `https://bronco-65aaf.firebaseapp.com/__/auth/handler` (خليه موجود)
5. Save
6. بعدها فقط غيّر Netlify env: `REACT_APP_FIREBASE_AUTH_DOMAIN=petzo.co.il` واعمل Redeploy

### مهم — نشر تطبيق Google OAuth
إذا ظهر **Access blocked** والتطبيق Testing:
1. **APIs & Services → OAuth consent screen**
2. **Publish app** (Production)
3. أو أضف إيميلك كـ Test user

---

## 3) إيميلات التحقق / نسيت كلمة السر (Petzo)

قوالب Firebase عندك مقفولة وفيها Horsehub.  
**الحل في الكود:** إيميلات مخصصة عبر Netlify Functions باسم Petzo.

اتبع الملف: **`CUSTOM_AUTH_EMAILS.md`**

باختصار:
1. Firebase → Service accounts → Generate private key  
2. Netlify env: `FIREBASE_SERVICE_ACCOUNT` + `SMTP_PASS` (+ باقي المتغيرات في الملف)  
3. Redeploy  
4. سجّل حساب جديد → لازم يجي ميل `Petzo` مش Horsehub

بديل مؤقت (Firebase SMTP فقط): انظر `FIREBASE_SMTP_SETUP.md` — بس النص قد يبقى Horsehub طالما القوالب مقفولة.

---

## 4) Netlify — متغيرات البيئة (إذا لسه مش مضبوطة)

Site settings → Environment variables → Production:

- كل `REACT_APP_FIREBASE_*` (نفس قيم Firebase)
- `REACT_APP_SITE_URL=https://petzo.co.il`
- `REACT_APP_ADMIN_EMAIL=` (إيميل إشعارات الأدمن)

بعد أي تغيير → **Redeploy**.

---

## 5) أدمن الموقع

1. سجّل/ادخل بالحساب الأدمن  
2. Firebase → **Firestore → users → {uid}**  
3. أضف: `isAdmin: true`  
4. افتح `/admin` وتأكد يشتغل

---

## 6) تجربة سريعة قبل النشر العام

- [ ] `petzo.co.il` يفتح  
- [ ] تسجيل بإيميل → يوصل التحقق  
- [ ] دخول Google  
- [ ] نسيت كلمة السر  
- [ ] نشر إعلان → يظهر pending / تنبيه أدمن  
- [ ] موافقة من `/admin`  
- [ ] صفحات אודות / תקנון / פרטיות  
- [ ] אימוץ + שירותים على الموبايل  

---

## شو الكود بيعمل أصلاً (ما تحتاج تغيّره)

- زر Google على Login/Register  
- إرسال إيميل تحقق بعد التسجيل  
- إعادة إرسال تحقق من Login  
- إعادة تعيين كلمة سر  
- رسائل خطأ أوضح إذا الدومين أو Google مش مفعّلين  

**الخلاصة:** رتّب الخطوات 1–3 اليوم، بعدين 4–6، وبعد ما تنجح التجربة تقدر تبدأ تنشر محتوى حقيقي.
