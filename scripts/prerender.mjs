// Runs after `vite build`: renders the homepage to HTML and puts it inside
// <div id="root"> in dist/index.html, so search engines see the real content
// without running JavaScript. The browser app then takes over as usual.
//
// Content comes from Firebase (what was saved in /admin) when reachable,
// otherwise from src/content/defaultContent.js.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const indexPath = path.join(root, "dist", "index.html");
const ssrEntry = pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href;

const { render, withDefaults, defaultContent, firebaseConfig } = await import(ssrEntry);

async function loadSavedContent() {
  const { projectId, apiKey } = firebaseConfig;
  if (!projectId) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/site/content?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      headers: { Referer: "https://connectingframes.in/" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.log(`prerender: no saved content (HTTP ${res.status}), using defaults`);
      return null;
    }
    const doc = await res.json();
    const json = doc?.fields?.json?.stringValue;
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.log(`prerender: could not reach Firebase (${err.message}), using defaults`);
    return null;
  }
}

const saved = await loadSavedContent();
const content = saved ? withDefaults(saved) : defaultContent;
const appHtml = render(content);

const marker = '<div id="root"></div>';
const index = fs.readFileSync(indexPath, "utf8");
if (!index.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}
fs.writeFileSync(indexPath, index.replace(marker, `<div id="root">${appHtml}</div>`));

console.log(
  `prerender: homepage HTML written (${Math.round(appHtml.length / 1024)} KB, content from ${saved ? "Firebase" : "defaults"})`
);
