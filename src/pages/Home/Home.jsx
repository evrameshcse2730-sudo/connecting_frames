import React, { Suspense, lazy, useEffect, useState } from "react";
import HomeView from "./HomeView.jsx";
import Preloader from "../../Components/Preloader/Preloader.jsx";
import { detectQuality } from "../../Components/Scene3D/quality.js";
import defaultContent, { withDefaults } from "../../content/defaultContent.js";
import { fetchSiteContent } from "../../firebase/publicApi.js";

// three.js is only downloaded on devices that can run it, after the page is visible
const Scene3D = lazy(() => import("../../Components/Scene3D/Scene3D.jsx"));

// Loads the content saved in /admin, then renders the site.
// Falls back to the built-in defaults if Firebase is unreachable.
export default function Home() {
  const [content, setContent] = useState(null);
  const [quality, setQuality] = useState(null);

  // Start the 3D world only after the page has shown (preloader takes ~1.4s)
  useEffect(() => {
    if (!content) return;
    const q = detectQuality();
    if (!q) return;
    const start = () => setQuality(q);
    const id = "requestIdleCallback" in window ? null : setTimeout(start, 1600);
    const idle = id === null ? window.requestIdleCallback(start, { timeout: 2500 }) : null;
    return () => (id !== null ? clearTimeout(id) : window.cancelIdleCallback(idle));
  }, [content]);

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

  return (
    <>
      {quality && (
        <Suspense fallback={null}>
          <Scene3D quality={quality} content={content} onTooSlow={() => setQuality(null)} />
        </Suspense>
      )}
      <HomeView content={content} />
    </>
  );
}
