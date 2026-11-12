import "./BackToTop.css";

export default function BackToTop({ visible }) {
  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <span>🎞</span>
    </button>
  );
}
