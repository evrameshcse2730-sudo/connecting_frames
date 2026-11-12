import { safeUrl } from "../../utils/safeUrl.js";
import "./Portfolio.css";

const pad = (n) => String(n).padStart(2, "0");

function WebsiteProject({ item, number, side }) {
  return (
    <div className={`video-project ${side}`} data-portfolio-label="↗ Visit Site">
      <a
        href={safeUrl(item.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="website-project"
        aria-label={`Visit ${item.title} live website`}
      >
        <div className="empty-project website-preview">
          <div className="browser-bar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="browser-content">
            <p className="live-label">LIVE WEBSITE ↗</p>
            <h4>{item.title}</h4>
            <p>Designed &amp; Developed</p>
            <div className="website-lines">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="visit-site">
              <span>View Live Website</span>
              <em>→</em>
            </div>
          </div>
        </div>
      </a>
      <div className="video-details">
        <p>{number}</p>
        <h3>{item.title}</h3>
      </div>
    </div>
  );
}

function VideoProject({ item, number, side }) {
  return (
    <div className={`video-project ${side}`} data-portfolio-label="▶ Play Reel">
      <div className="film-frame">
        <video className="RE" src={safeUrl(item.url)} controls muted loop playsInline preload="metadata">
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="video-details">
        <p>{number}</p>
        <h3>{item.title}</h3>
      </div>
    </div>
  );
}

export default function Portfolio({ content }) {
  return (
    <section className="work" id="work">
      <div className="section-heading">
        <p className="section-label reveal">{content.label}</p>
        <h2 className="reveal">
          {content.title}
          <span> {content.titleHighlight}</span>
        </h2>
      </div>

      <div className="portfolio-grid">
        {content.items.map((item, i) => {
          const props = {
            item,
            side: i % 2 === 0 ? "reveal-left" : "reveal-right",
            number: `${pad(i + 1)} / ${String(item.category || "").toUpperCase()}`,
          };
          return item.type === "website" ? <WebsiteProject key={i} {...props} /> : <VideoProject key={i} {...props} />;
        })}
      </div>
    </section>
  );
}
