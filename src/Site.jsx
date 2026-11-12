import React, { useEffect, useState } from "react";
import App from "./App.jsx";
import defaultContent, { withDefaults } from "./content/defaultContent.js";
import { fetchSiteContent } from "./lib/publicApi.js";

// Loads the content saved in /admin, then renders the site.
// Falls back to the built-in defaults if Firebase is unreachable.
export default function Site() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchSiteContent()
      .then((saved) => alive && setContent(withDefaults(saved)))
      .catch(() => alive && setContent(defaultContent));
    return () => {
      alive = false;
    };
  }, []);

  if (!content) {
    // Same look as the site's own preloader, so there is no flash
    return (
      <div className="preloader">
        <div className="preloader-mark">
          <svg viewBox="0 0 120 120" className="preloader-ring">
            <circle cx="60" cy="60" r="52" />
          </svg>
          <span>CF</span>
        </div>
        <p className="preloader-text">connecting frames</p>
      </div>
    );
  }

  return <App content={content} />;
}
