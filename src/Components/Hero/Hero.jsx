import { safeUrl } from "../../utils/safeUrl.js";
import "./Hero.css";

const SplitText = ({ text, offset, prefix }) =>
  text.split("").map((char, i) => (
    <span key={`${prefix}-${i}`} className="split-char" style={{ transitionDelay: `${0.25 + (offset + i) * 0.045}s` }}>
      {char}
    </span>
  ));

export default function Hero({ content, heroRef, artRef }) {
  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-leaves left-leaves">❦</div>

      <div className="hero-content">
        <p className="small-title reveal">{content.tagline}</p>

        <h1 className="hero-title split-reveal">
          <SplitText text={content.titleLine1} offset={0} prefix="c" />
          <br />
          <span className="script">
            <SplitText text={content.titleLine2} offset={content.titleLine1.length} prefix="f" />
          </span>
        </h1>

        <div className="hand-line reveal-scale"></div>
        <p className="handwritten reveal">{content.handwritten}</p>
        <p className="intro reveal">{content.intro}</p>

        <a href={safeUrl(content.ctaLink)} className="sketch-btn reveal" data-magnetic="true">
          <span>{content.ctaText}</span>
          <em>→</em>
        </a>
      </div>

      <div className="hero-art reveal-scale" ref={artRef}>
        <div className="sketch-circle">
          <img src="/logo.webp" alt="Connecting Frames" />
        </div>
        <div className="sun"></div>
        <div className="mountain">△ △ △</div>
        <div className="film-strip">🎞</div>
      </div>
    </section>
  );
}
