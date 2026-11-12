import React, { useEffect, useState } from "react";
import HomeView from "./HomeView.jsx";
import Preloader from "../../Components/Preloader/Preloader.jsx";
import defaultContent, { withDefaults } from "../../content/defaultContent.js";
import { fetchSiteContent } from "../../firebase/publicApi.js";

// Loads the content saved in /admin, then renders the site.
// Falls back to the built-in defaults if Firebase is unreachable.
export default function Home() {
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
    return <Preloader />;
  }

  return <HomeView content={content} />;
}
