# Firebase SMTP setup (email verification deliverability)

This project uses **Firebase Authentication** for:

- email verification after sign-up (`sendSiteEmailVerification`)
- password reset (`sendSitePasswordReset`)

Those emails are sent by **Firebase**, not by this React app. You must configure SMTP in the Firebase project.

## 1) Create a Gmail App Password (`petzo.team@gmail.com`)

1. Sign in to `petzo.team@gmail.com`
2. Open [Google Account Security](https://myaccount.google.com/security)
3. Turn on **2-Step Verification**
4. Create an **App password** (name: `Petzo Firebase`)
5. Copy the 16-character password — use it only in Firebase SMTP (never commit it)

## 2) Configure SMTP in Firebase

1. Open **Firebase Console** → your project
2. Go to **Authentication**
3. Open **Templates** / **Email** / **SMTP settings** (wording varies)
4. Enable custom SMTP:

| Field | Value |
|-------|--------|
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `petzo.team@gmail.com` |
| Password | Gmail App Password |
| From name | `Petzo` |
| From email | `petzo.team@gmail.com` |
| Reply-to | `petzo.team@gmail.com` |

Values match `src/data/site-config.js` / `src/helpers/firebase-smtp.js`.

## 3) Templates

Update Firebase email templates:

- **Email address verification** — sender name Petzo
- **Password reset** — sender name Petzo

App continue URLs:

- Verification → `{origin}/login?verified=1`
- Password reset → `{origin}/login`

## 4) Authorized domains

Authentication → Settings → Authorized domains must include:

- `petzo.co.il`
- `petbones.netlify.app`
- `localhost`

## 5) Test

1. Register a new account with a real inbox
2. Confirm the verification email arrives (check spam)
3. Click the link → login page with success message
4. Test **שכחתי סיסמה**

If mail still lands in spam: keep using SMTP + App Password, avoid sudden bulk sends, and consider SPF/DKIM if you later send from a custom domain mailbox.

See also: `LAUNCH.md`
