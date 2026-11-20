import InstagramIcon from "../Social/InstagramIcon.jsx";
import { instagramProfile } from "../../utils/social.js";
import "./Footer.css";

export default function Footer({ content }) {
  const insta = instagramProfile(content.instagram);
  return (
    <footer className="reveal">
      <h3>{content.title}</h3>
      {insta && (
        <a className="footer-social" href={insta.href} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${insta.handle}`}>
          <InstagramIcon size={20} />
          <span>{insta.handle}</span>
        </a>
      )}
      <p>{content.text}</p>
    </footer>
  );
}
