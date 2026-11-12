// Describes every editable part of the website.
// The admin editor is generated from this list, so to make a new field
// editable: add it to defaultContent.js, use it in App.jsx, and list it here.
//
// field: [key, label, type?, options?]   type: text | textarea | number | url | select

const sections = [
  {
    key: "hero",
    title: "Hero",
    hint: "The first screen visitors see.",
    fields: [
      ["tagline", "Small line above the title"],
      ["titleLine1", "Title line 1"],
      ["titleLine2", "Title line 2 (handwritten style)"],
      ["handwritten", "Handwritten line under the title"],
      ["intro", "Intro paragraph", "textarea"],
      ["ctaText", "Button text"],
      ["ctaLink", "Button link (e.g. #work or https://…)", "url"],
    ],
  },
  {
    key: "marquee",
    title: "Scrolling strip",
    hint: "Words that scroll across the screen below the hero.",
    rootList: { type: "strings", itemLabel: "Word / phrase", newItem: "" },
  },
  {
    key: "story",
    title: "Story line",
    fields: [
      ["line1", "First line"],
      ["line2", "Second line"],
      ["line2Highlight", "Highlighted word"],
    ],
  },
  {
    key: "about",
    title: "About",
    fields: [
      ["label", "Small label"],
      ["title", "Heading"],
      ["titleHighlight", "Heading highlight"],
      ["text", "About text", "textarea"],
    ],
  },
  {
    key: "stats",
    title: "Stats",
    hint: "Animated numbers (projects, years, clients).",
    rootList: {
      type: "objects",
      itemLabel: "Stat",
      fields: [
        ["value", "Number", "number"],
        ["suffix", "After number (e.g. +)"],
        ["label", "Label"],
      ],
      newItem: { value: 0, suffix: "+", label: "" },
    },
  },
  {
    key: "services",
    title: "Services",
    fields: [
      ["label", "Small label"],
      ["title", "Heading"],
      ["titleHighlight", "Heading highlight"],
    ],
    list: {
      key: "items",
      type: "objects",
      itemLabel: "Service",
      fields: [
        ["icon", "Icon (one symbol, e.g. ▶ ◇ ✦)"],
        ["title", "Title"],
        ["text", "Description", "textarea"],
      ],
      newItem: { icon: "✦", title: "", text: "" },
    },
  },
  {
    key: "work",
    title: "Portfolio",
    hint: "Videos: paste a direct .mp4 link (e.g. Cloudinary). Websites: paste the live site link.",
    fields: [
      ["label", "Small label"],
      ["title", "Heading"],
      ["titleHighlight", "Heading highlight"],
    ],
    list: {
      key: "items",
      type: "objects",
      itemLabel: "Project",
      fields: [
        ["type", "Type", "select", ["video", "website"]],
        ["category", "Category (e.g. Reel Editing)"],
        ["title", "Title"],
        ["url", "Video link (.mp4) or website link", "url"],
      ],
      newItem: { type: "video", category: "", title: "", url: "" },
      preview: true,
    },
  },
  {
    key: "contact",
    title: "Contact",
    fields: [
      ["label", "Small label"],
      ["title", "Heading"],
      ["titleHighlight", "Heading highlight"],
      ["text", "Text", "textarea"],
      ["note", "Note"],
      ["formEmail", "Email / FormSubmit alias that receives enquiries"],
      ["smallText", "Small text under the button"],
    ],
    list: {
      key: "serviceOptions",
      type: "strings",
      itemLabel: "Dropdown option",
      newItem: "",
    },
  },
  {
    key: "footer",
    title: "Footer",
    fields: [
      ["title", "Title"],
      ["text", "Text"],
    ],
  },
];

export default sections;
