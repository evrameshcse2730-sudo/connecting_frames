import "./Preloader.css";

export default function Preloader({ done }) {
  return (
    <div className={`preloader ${done ? "preloader-done" : ""}`}>
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
