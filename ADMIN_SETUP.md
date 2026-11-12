# Admin panel setup (one time, ~15 minutes)

Admin panel URL: **https://connectingframes.in/admin**

Until these steps are done, the website shows its built-in content and `/admin`
shows a "setup pending" page. Nothing breaks.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it `connecting-frames`.
   Google Analytics is not needed.
2. In the project: **Project settings (⚙) → General → Your apps → Web (`</>`)**.
   Register an app (no hosting needed).
3. Copy the `firebaseConfig` values into [`src/firebase/firebaseConfig.js`](src/firebase/firebaseConfig.js).

## 2. Turn on the database
1. **Build → Firestore Database → Create database**. Pick location `asia-south1 (Mumbai)`,
   start in **production mode**.
2. Open the **Rules** tab, replace everything with the contents of
   [`firestore.rules`](firestore.rules), click **Publish**.

## 3. Turn on login and create your admin account
1. **Build → Authentication → Get started → Email/Password → Enable**.
2. **Users tab → Add user**: your email and a strong password.
3. Copy the new user's **User UID**.
4. Go to **Firestore Database → Data → Start collection**:
   - Collection ID: `admins`
   - Document ID: *paste the User UID*
   - Add a field `role` = `owner` → **Save**.

Only accounts listed in `admins` can edit the site or read messages.

## 4. Deploy
Commit and push. Netlify rebuilds, then log in at `/admin`.

## Using the admin panel
- **Inbox**: every contact form message (the email via FormSubmit still arrives too).
- **Hero, About, Stats, Services, Portfolio, Contact, Footer, Scrolling strip, Story line**:
  edit text, add/remove/reorder items, then press **Save**. Changes are live on the next page refresh.
- **Portfolio videos**: upload the video to Cloudinary (or any host) and paste the direct
  `https://…mp4` link. A preview shows below the field.
- If you add a video/image host other than Cloudinary, allow it in the
  `Content-Security-Policy` line in [`public/_headers`](public/_headers).

## Security notes
- The Firebase config in `firebaseConfig.js` is public by design. Protection comes from
  `firestore.rules` (only `admins` can write) and your password.
- Use a strong, unique password for the admin account.
- Search engines are told not to index `/admin`.
