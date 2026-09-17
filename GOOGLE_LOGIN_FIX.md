# إصلاح دخول Google — خطوات يدوية (دقيقة واحدةين)

عشان **Safari** يشتغل، لازم OAuth يبقى على نفس الدومين `petzo.co.il`  
(الكود صار يستخدم `authDomain = petzo.co.il` على الموقع).

## 1) Google Cloud — ضروري مرة وحدة

1. افتح: https://console.cloud.google.com/apis/credentials?project=bronco-65aaf  
2. تحت **OAuth 2.0 Client IDs** افتح العميل:  
   `Web client (auto created by Google Service)`  
   Client ID يبدأ بـ: `317603302387-82a0relctgto8foe8pqp7o9lp3kacvun`
3. **Authorized JavaScript origins** — لازم:
   - `https://petzo.co.il`
   - `https://www.petzo.co.il`
   - `https://bronco-65aaf.firebaseapp.com`
   - `http://localhost:3000`
4. **Authorized redirect URIs** — لازم (مهم لـ Safari):
   - `https://petzo.co.il/__/auth/handler`  ← **بدون هاد Safari بفشل**
   - `https://bronco-65aaf.firebaseapp.com/__/auth/handler`
   - `https://www.petzo.co.il/__/auth/handler` (اختياري)
5. **Save** وانتظر دقيقة

## 2) نشر شاشة الموافقة

1. https://console.cloud.google.com/apis/credentials/consent?project=bronco-65aaf  
2. إذا **Testing**: **Publish app** → Production  
   أو أضف حسابات التجربة تحت Test users

## 3) Firebase Authorized domains

Authentication → Settings → Authorized domains:  
`petzo.co.il` + `www.petzo.co.il` + `localhost`

## 4) تجربة

- Safari أو Chrome: `https://petzo.co.il/login` → התחבר עם Google  
- من فيسبوك/إنستغرام: افتح في المتصفح أولاً

إذا طلع `redirect_uri_mismatch` → الرجوع للخطوة 1 وإضافة  
`https://petzo.co.il/__/auth/handler` ثم Save.
