# Connecting Frames

Portfolio site for **Connecting Frames**: video editing and website development, based in Telangana.
Live at https://connectingframes.in (hosted on Netlify).

## Stack
- React 19 + Vite
- Contact form → [FormSubmit](https://formsubmit.co) (redirects to `/thanks.html`)
- Showreel video hosted on Cloudinary

- Admin panel at `/admin` (Firebase Auth + Firestore) — setup in [ADMIN_SETUP.md](ADMIN_SETUP.md)

## Folder structure
```
src/
  main.jsx               # picks the website or the admin panel by URL
  Site.jsx               # loads saved content, then renders the website
  App.jsx / App.css      # the website itself
  content/
    defaultContent.js    # all website text & items (fallback when Firebase is off)
  lib/
    firebaseConfig.js    # paste Firebase web config here
    publicApi.js         # lightweight reads/writes for the public site (no SDK)
    firebase.js          # full Firebase SDK, used only by /admin
  admin/
    AdminApp.jsx         # entry for /admin
    Panel.jsx            # login gate + dashboard + section editor
    Login.jsx, Inbox.jsx, SetupNotice.jsx
    sections.js          # which fields are editable (drives the editor)
    fields.jsx           # form inputs & list editor
    validate.js          # checks before saving
    admin.css
firestore.rules          # database security rules (paste into Firebase console)
public/                  # static files, Netlify _headers / _redirects
```

## Scripts
```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve dist/ locally
npm run lint     # oxlint
```

## Files in `public/`
| File | Purpose |
| --- | --- |
| `_headers` | Netlify security headers (CSP, HSTS, etc.) and asset caching |
| `robots.txt`, `sitemap.xml` | Search engine crawling |
| `og-image.jpg` | 1200×630 preview image for WhatsApp / social shares |
| `logo.webp`, `favicon.png`, `apple-touch-icon.png` | Optimized logo and icons |
| `thanks.html` | Page shown after the contact form is sent |

## Notes
- If you add a new external domain (video host, font, embed), allow it in the
  `Content-Security-Policy` line in `public/_headers`, or the browser will block it.
- Update `<lastmod>` in `sitemap.xml` when content changes.
