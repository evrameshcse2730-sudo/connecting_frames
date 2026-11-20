import { safeUrl } from "./safeUrl.js";

// Instagram profile URL → safe link + "@handle" label (null if not set)
export function instagramProfile(url) {
  const m = String(url || "").match(/^https:\/\/(www\.)?instagram\.com\/([\w.]+)/i);
  if (!m) return null;
  return { href: safeUrl(url), handle: `@${m[2]}` };
}
