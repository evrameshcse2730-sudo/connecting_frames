import "./SetupNotice.css";

export default function SetupNotice() {
  return (
    <div className="ad-center">
      <div className="ad-card ad-setup">
        <h1>Admin setup pending</h1>
        <p>
          Firebase is not connected yet. The website is running on its built-in content until
          you finish these steps (full guide in <code>ADMIN_SETUP.md</code>):
        </p>
        <ol>
          <li>Create a Firebase project and add a Web app.</li>
          <li>
            Paste the config into <code>src/firebase/firebaseConfig.js</code>.
          </li>
          <li>Enable Firestore and Email/Password sign-in.</li>
          <li>
            Publish <code>firestore.rules</code>, create your admin user and add it to the{" "}
            <code>admins</code> collection.
          </li>
        </ol>
        <a className="ad-btn" href="/">
          ← Back to website
        </a>
      </div>
    </div>
  );
}
