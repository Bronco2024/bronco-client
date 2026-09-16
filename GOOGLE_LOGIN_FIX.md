# إصلاح دخول Google — خطوات يدوية (دقيقة واحدةين)

الخطأ اللي شفته (`redirect_uri_mismatch`) ودخول Google اللي «ما بزبط» على الموبايل  
يحتاج إعداد في **Google Cloud** مرة واحدةحدة. الكود لحاله ما بيقدر يضيفه.

## 1) Authorized JavaScript origins + Redirect URIs

1. افتح: https://console.cloud.google.com/apis/credentials?project=bronco-65aaf  
2. تحت **OAuth 2.0 Client IDs** افتح العميل اللي اسمه غالباً:  
   `Web client (auto created by Google Service)`  
   Client ID يبدأ بـ: `317603302387-82a0relctgto8foe8pqp7o9lp3kacvun`
3. **Authorized JavaScript origins** — لازم موجودة:
   - `https://petzo.co.il`
   - `https://www.petzo.co.il` (إذا مستخدم)
   - `https://bronco-65aaf.firebaseapp.com`
   - `http://localhost:3000` (للتطوير)
4. **Authorized redirect URIs** — لازم موجودة:
   - `https://bronco-65aaf.firebaseapp.com/__/auth/handler`
   - `https://petzo.co.il/__/auth/handler`
   - `https://www.petzo.co.il/__/auth/handler` (اختياري)
5. **Save**

## 2) نشر شاشة الموافقة (مهم جداً)

1. https://console.cloud.google.com/apis/credentials/consent?project=bronco-65aaf  
2. إذا الحالة **Testing**:
   - إما **Publish app** → Production  
   - أو أضف إيميلك (`qubtyluay@gmail.com` وأي حساب بتجرّب فيه) تحت **Test users**
3. بدون هالخطوة، Google بيمنع الحسابات اللي مش Test users.

## 3) Firebase Authorized domains

Firebase Console → Authentication → Settings → Authorized domains:  
`petzo.co.il` + `petbones.netlify.app` + `localhost`

## 4) بعد ما تحفظ

- انتظر دقيقة
- امسح كاش الموبايل / جرّب نافذة خاصة
- `https://petzo.co.il/login` → התחבר עם Google

إذا لسه فاشل، ابعت صورة الشاشة الجديدة (النص الأحمر تحت الخطأ).
