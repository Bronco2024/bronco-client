# Petzo

Petzo (`https://petzo.co.il`) is a Hebrew RTL marketplace for pet listings, adoption, seeds, accessories, and pet-related services in Israel.

## Stack

- React 18 (Create React App + CRACO)
- Firebase (Auth, Firestore, Storage)
- Netlify deployment

## Local development

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm test` | Jest tests |
| `npm run build` | Production build |

## Environment

Optional env vars (`.env`):

- `REACT_APP_SITE_URL` — canonical site URL (default: `https://petzo.co.il`)
- `REACT_APP_ADMIN_EMAIL` — admin notification email

Contact: `petzo.team@gmail.com`

## Key routes

- `/` — homepage with search
- `/listings`, `/adoption` — pet listings
- `/horses`, `/seeds`, `/accessories` — specialty categories
- `/boarding`, `/veterinarians`, `/groomers`, … — services
- `/publish_ad` — create listing (login required)
- `/item/:adId` — listing detail

## Deployment

Build output goes to `build/`. Netlify uses `public/_redirects` for SPA routing. Point custom domain `petzo.co.il` in Netlify and add it to Firebase authorized domains.

## Launch checklist

Before public launch (Google login + verification emails): see **`LAUNCH.md`** and **`FIREBASE_SMTP_SETUP.md`**.
