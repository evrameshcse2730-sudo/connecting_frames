# Connecting Frames

Portfolio site for **Connecting Frames**: video editing and website development, based in Telangana.
Live at https://connectingframes.in (hosted on Netlify).

## Stack
- React 19 + Vite
- Contact form → [FormSubmit](https://formsubmit.co) (redirects to `/thanks.html`)
- Showreel video hosted on Cloudinary

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
