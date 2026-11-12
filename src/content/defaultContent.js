// Default website content.
// The live site loads the saved version from Firebase (edited in /admin);
// this file is the fallback when Firebase is not set up or not reachable.

const defaultContent = {
  hero: {
    tagline: "Video editor and web creator based in Telangana",
    titleLine1: "Connecting",
    titleLine2: "Frames",
    handwritten: "every frame tells a story ♡",
    intro:
      "I create meaningful videos and thoughtful digital experiences — from cinematic edits to modern websites, every detail is crafted to tell a story.",
    ctaText: "Explore My Work",
    ctaLink: "#work",
  },

  marquee: [
    "Reel Editing",
    "Colour Grading",
    "Web Development",
    "Motion Graphics",
    "Visual Storytelling",
  ],

  story: {
    line1: "Some stories are not just watched.",
    line2: "They're",
    line2Highlight: "felt.",
  },

  about: {
    label: "a little about me",
    title: "From frames to",
    titleHighlight: "digital stories.",
    text:
      "I work across video editing and website development, transforming ideas into engaging visual stories and thoughtful digital experiences. Whether it's a cinematic reel or a complete website, every project is crafted with creativity, purpose and attention to detail.",
  },

  stats: [
    { value: 40, suffix: "+", label: "Projects Cut & Shipped" },
    { value: 3, suffix: "+", label: "Years Behind the Timeline" },
    { value: 25, suffix: "+", label: "Happy Collaborators" },
  ],

  services: {
    label: "what I create",
    title: "From frames to",
    titleHighlight: "digital spaces.",
    items: [
      {
        icon: "▶",
        title: "Video Editing",
        text: "Cinematic edits, reels and engaging short-form videos crafted to bring every moment to life.",
      },
      {
        icon: "◇",
        title: "Website Development",
        text: "Modern, responsive and creative websites designed to turn ideas into meaningful digital experiences.",
      },
      {
        icon: "✦",
        title: "Visual Stories",
        text: "Nature, travel and beautiful everyday moments captured through a thoughtful creative perspective.",
      },
    ],
  },

  work: {
    label: "selected work",
    title: "Stories &",
    titleHighlight: "digital experiences.",
    items: [
      {
        type: "video",
        category: "Reel Editing",
        title: "Creative Story",
        url: "https://res.cloudinary.com/db4faz2rs/video/upload/v1788245248/Task-1_yyfhwg.mp4",
      },
      {
        type: "website",
        category: "Website Development",
        title: "Infiflow Telugu",
        url: "https://www.infiflowtelugu.com",
      },
    ],
  },

  contact: {
    label: "let's create something",
    title: "Have an idea",
    titleHighlight: "in mind?",
    text:
      "Whether it's a cinematic video, a creative website, or a visual story — let's turn your idea into something meaningful.",
    note: "Good stories begin with a conversation.",
    formEmail: "evrameshcse2730@gmail.com",
    serviceOptions: ["Video Editing", "Website Development", "Visual Story", "Other"],
    smallText: "I'll get back to you as soon as possible ♡",
  },

  footer: {
    title: "CONNECTING FRAMES",
    text: "Every frame tells a story ♡",
  },
};

export default defaultContent;

// Fill any fields missing from saved content with defaults,
// so adding a new field later never breaks the live site.
export function withDefaults(saved) {
  if (!saved || typeof saved !== "object") return defaultContent;
  const out = {};
  for (const key of Object.keys(defaultContent)) {
    const def = defaultContent[key];
    const val = saved[key];
    if (Array.isArray(def)) out[key] = Array.isArray(val) ? val : def;
    else if (val && typeof val === "object") out[key] = { ...def, ...val };
    else out[key] = def;
  }
  return out;
}
