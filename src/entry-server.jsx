// Server-side render entry, used only at build time (scripts/prerender.mjs)
// to put the homepage's real text into index.html for Google and other crawlers.
import { renderToString } from "react-dom/server";
import HomeView from "./pages/Home/HomeView.jsx";
import defaultContent, { withDefaults } from "./content/defaultContent.js";
import firebaseConfig from "./firebase/firebaseConfig.js";

export { defaultContent, withDefaults, firebaseConfig };

export function render(content) {
  return renderToString(<HomeView content={content} prerender />);
}
