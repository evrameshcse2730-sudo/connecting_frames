# Connecting Frames

Portfolio site for **Connecting Frames**: video editing and website development, based in Telangana.
Live at https://connectingframes.in (hosted on Netlify).

## Stack
- React 19 + Vite
- Contact form → [FormSubmit](https://formsubmit.co) (redirects to `/thanks.html`)
- Showreel video hosted on Cloudinary
- Admin panel at `/admin` (Firebase Auth + Firestore) — setup in [ADMIN_SETUP.md](ADMIN_SETUP.md)

## Folder structure
Same layout as the INFIFLOW project.
```
src/
  main.jsx               # React entry, loads index.css
  App.jsx                # shows the website, or the admin panel on /admin
  index.css              # colours, fonts, base styles, scroll-reveal animations
  pages/
    Home/
      Home.jsx           # loads saved content, then renders HomeView
      HomeView.jsx       # page layout + scroll/mouse interactions
  Components/            # one folder per section: <Name>.jsx + <Name>.css
    Navbar/  Hero/  Marquee/  Story/  About/  Stats/
    Services/  Portfolio/  Contact/  Footer/
    Preloader/  Cursor/  BackToTop/
    Scene3D/             # 3D world behind the page (three.js + React Three Fiber)
      quality.js         #   decides 3D on/off + quality per device
      rig.js             #   camera path, film strip path, colours
      world/             #   camera rig, film strip, dust, FPS guard
      stations/          #   one 3D scene per section (hero, iris, leaves, reels…)
  content/
    defaultContent.js    # all website text & items (fallback when Firebase is off)
  firebase/
    firebaseConfig.js    # paste Firebase web config here
    firebase.js          # Firebase app setup (admin only)
    auth.js              # admin login / logout / admin check
    database.js          # content + messages read/write (admin)
    publicApi.js         # lightweight reads/writes for the public site (no SDK)
  utils/
    safeUrl.js           # blocks unsafe links in admin-edited content
  admin/
    AdminApp.jsx/.css    # /admin entry + base admin styles
    AdminRoot.jsx        # login gate, content state, save
    layout/AdminLayout   # top bar + sidebar + page area
    components/          # AdminNavbar, Sidebar, FormFields
    pages/               # AdminLogin, Inbox, SectionEditor, Setup
    config/sections.js   # which fields are editable (drives the editor)
    utils/validate.js    # checks before saving
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

## 3D world
- Loads only after the page is visible, and only on devices that can handle it.
  Weak devices, "reduce motion", data-saver and 2G/3G visitors get the normal site.
- Phones get a lighter version (30fps, lower resolution, fewer particles, no video texture).
- If a device can't keep up, it first lowers resolution, then switches 3D off.
- The page text stays normal HTML on top, so SEO and the admin panel work as before.

## Notes
- To change a section's look, edit `src/Components/<Name>/<Name>.css`. Its mobile rules are
  at the bottom of the same file.
- To add a new section: create `src/Components/<Name>/`, add it to `pages/Home/HomeView.jsx`, put its
  text in `content/defaultContent.js` and list editable fields in `admin/config/sections.js`.
- If you add a new external domain (video host, font, embed), allow it in the
  `Content-Security-Policy` line in `public/_headers`, or the browser will block it.
- Update `<lastmod>` in `sitemap.xml` when content changes.
