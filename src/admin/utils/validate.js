// Checks content before saving, so a typo can't break the live site.
const isHttps = (u) => /^https:\/\/[^\s]+$/i.test(u || "");
const isLink = (u) => isHttps(u) || /^#[\w-]*$/.test(u || "") || /^\/[^\s]*$/.test(u || "");

export default function validate(c) {
  const errors = [];

  if (!c.hero.titleLine1.trim()) errors.push("Hero: title line 1 is empty.");
  if (!isLink(c.hero.ctaLink)) errors.push("Hero: button link must start with https://, # or /.");

  c.work.items.forEach((item, i) => {
    if (!item.title.trim()) errors.push(`Portfolio project ${i + 1}: title is empty.`);
    if (!isHttps(item.url)) errors.push(`Portfolio project ${i + 1}: link must start with https://.`);
  });

  c.stats.forEach((s, i) => {
    if (!Number.isFinite(Number(s.value))) errors.push(`Stat ${i + 1}: number is not valid.`);
  });

  if (!/^[^\s/@]+(@[^\s/@]+\.[^\s/@]+)?$/.test(c.contact.formEmail || "")) {
    errors.push("Contact: enter an email address or a FormSubmit alias.");
  }
  if (!c.contact.serviceOptions.length) errors.push("Contact: add at least one dropdown option.");

  const size = JSON.stringify(c).length;
  if (size > 500000) errors.push("Content is too large to save.");

  return errors;
}
