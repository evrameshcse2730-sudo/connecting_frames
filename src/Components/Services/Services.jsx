import "./Services.css";

const SIDES = ["reveal-left", "reveal-scale", "reveal-right"];

export default function Services({ content }) {
  return (
    <section className="services" id="services">
      <div className="section-heading">
        <p className="section-label reveal">{content.label}</p>
        <h2 className="reveal">
          {content.title}
          <span> {content.titleHighlight}</span>
        </h2>
      </div>
      <div className="service-grid">
        {content.items.map((item, i) => (
          <div className={`service-card ${SIDES[i % 3]}`} key={i}>
            <div className="service-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="card-line"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
