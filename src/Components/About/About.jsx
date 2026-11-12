import "./About.css";

export default function About({ content }) {
  return (
    <section className="about" id="about">
      <div className="section-number reveal-left">01</div>
      <div className="about-content">
        <p className="section-label reveal">{content.label}</p>
        <h2 className="reveal">
          {content.title}
          <br />
          <span>{content.titleHighlight}</span>
        </h2>
        <p className="reveal">{content.text}</p>
      </div>
      <div className="about-leaf reveal-right">🌿</div>
    </section>
  );
}
