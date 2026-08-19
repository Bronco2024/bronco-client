# Firebase SMTP setup (email verification deliverability)

This project uses **Firebase Authentication** for sending **email verification** messages (see `src/helpers/auth-email.js` / `src/helpers/auth-email-helpers.js`).

Because those emails are sent by Firebase on the backend, **SMTP must be configured in your Firebase project** (it cannot be enabled from this React codebase alone).

## Where to configure
1. Open **Firebase Console**
2. Go to **Authentication**
3. Find the **Email** / **Templates** / **Email configuration** section (wording may vary)
4. Enable **SMTP / Email provider** and provide the settings below

## Recommended SMTP settings (from this repo)
The values below are aligned with `src/data/site-config.js` and `src/helpers/firebase-smtp.js`:

- **Host:** `smtp.gmail.com`
- **Port:** `587`
- **From name:** `Petzo` (or `SITE_NAME`)
- **From email:** `petzo.team@gmail.com` (or `CONTACT_EMAIL`)
- **Reply-to:** `petzo.team@gmail.com` (or `CONTACT_EMAIL`)

## After enabling SMTP
- Test by signing up with a new account and verifying the email.
- If it still lands in spam:
  - check the SMTP account reputation,
  - ensure SPF/DKIM/DMARC are configured for the sending domain (if using a custom domain),
  - confirm Firebase Auth email templates are enabled and correct.

## Verification link behavior
This app expects the verification redirect URL to be:
`/login?verified=1` (configured in `auth-email-helpers.js`).

