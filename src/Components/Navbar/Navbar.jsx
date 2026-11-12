import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar reveal">
      <div className="logo-wrap">
        <img className="LOGO" src="/logo.webp" alt="Connecting Frames" />
      </div>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
