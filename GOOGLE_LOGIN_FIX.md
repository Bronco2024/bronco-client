# إصلاح دخول Google — خطوات يدوية

## ليش Safari كان فاشل
على Netlify في متغير قديم:
`REACT_APP_FIREBASE_AUTH_DOMAIN=bronco-65aaf.firebaseapp.com`  
هاد كان يرجّع OAuth لدومين تاني، وSafari بيكسر.

الكود هلق **بلغي هالمتجاوز** على `petzo.co.il` ويستخدم نفس الدومين.

## 1) Google Cloud — ضروري مرة وحدة

1. افتح: https://console.cloud.google.com/apis/credentials?project=bronco-65aaf  
2. تحت **OAuth 2.0 Client IDs** افتح:  
   `Web client (auto created by Google Service)`
3. **Authorized JavaScript origins**:
   - `https://petzo.co.il`
   - `https://www.petzo.co.il`
   - `https://bronco-65aaf.firebaseapp.com`
4. **Authorized redirect URIs** (مهم):
   - `https://petzo.co.il/__/auth/handler`  ← بدونو بطلع redirect_uri_mismatch
   - `https://bronco-65aaf.firebaseapp.com/__/auth/handler`
5. **Save** وانتظر دقيقة

## 2) Netlify (مستحسن)

Site configuration → Environment variables:
- احذف `REACT_APP_FIREBASE_AUTH_DOMAIN`  
  أو غيّره لـ `petzo.co.il`
- بعدين Trigger deploy

## 3) Firebase Authorized domains

`petzo.co.il` + `www.petzo.co.il` + `localhost`

## 4) تجربة

Safari/Chrome: `https://petzo.co.il/login` → התחבר עם Google
