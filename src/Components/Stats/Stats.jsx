import "./Stats.css";

// `counts` holds the animated numbers (driven from pages/Home/HomeView.jsx)
export default function Stats({ stats, counts, sectionRef }) {
  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card reveal-scale" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
            <h3>
              {counts[i] ?? 0}
              <span>{stat.suffix}</span>
            </h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
