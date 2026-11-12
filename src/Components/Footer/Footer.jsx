import "./Footer.css";

export default function Footer({ content }) {
  return (
    <footer className="reveal">
      <h3>{content.title}</h3>
      <p>{content.text}</p>
    </footer>
  );
}
