import "./Story.css";

export default function Story({ content }) {
  return (
    <section className="story-line">
      <span className="reveal-scale">✦</span>
      <p className="reveal">{content.line1}</p>
      <h2 className="reveal">
        {content.line2} <span>{content.line2Highlight}</span>
      </h2>
      <div className="camera-icon reveal-scale">◉</div>
    </section>
  );
}
