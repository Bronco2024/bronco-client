# إصلاح www.petzo.co.il

المشكلة الحالية: DNS لـ `www` يوجّه لـ Netlify، لكن **شهادة SSL** لسه `*.netlify.app`  
→ المتصفح يرفض `https://www.petzo.co.il` (certificate mismatch).

## المطلوب منك في Netlify (مرة واحدةحدة)

1. افتح [Netlify](https://app.netlify.com) → موقع **petbones**
2. **Domain management** / **Domain settings**
3. **Add domain alias**: `www.petzo.co.il`
4. انتظر Netlify يجهّز شهادة Let's Encrypt لـ www (دقائق)
5. خلّي **Primary domain** = `petzo.co.il`
6. فعّل **Redirect www → apex** إذا ظهر الخيار (أو يعتمد على redirect بالكود بعد الدمج)

## DNS عند مزوّد الدومين

لازم يبقى تقريباً:

| Type | Name | Value |
|------|------|--------|
| A / ALIAS / NETLIFY | `@` / `petzo.co.il` | حسب تعليمات Netlify |
| CNAME | `www` | `petbones.netlify.app` |

(الـ CNAME موجود عندك أصلاً)

## بعد ما الشهادة تشتغل

- `https://www.petzo.co.il` يفتح أو يحوّل لـ `https://petzo.co.il`
- أضف `www.petzo.co.il` في Firebase → Authentication → Authorized domains
- أضف في Google Cloud OAuth:
  - JS origin: `https://www.petzo.co.il`
  - Redirect: `https://www.petzo.co.il/__/auth/handler` (اختياري إذا بتخلي www بدون redirect)

## تحقق سريع

```bash
curl -sI https://www.petzo.co.il | head
```

لازم تشوف `HTTP/2 200` أو `301` إلى `petzo.co.il` — **مش** خطأ SSL.
