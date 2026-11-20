import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { whatsappLink } from "../../utils/whatsapp.js";
import "./WhatsApp.css";

// Floating "chat on WhatsApp" button, always visible in the bottom-right corner
export default function WhatsAppButton({ number, message }) {
  const href = whatsappLink(number, message);
  if (!href) return null;

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon size={30} />
      <span className="whatsapp-float-label">Chat with me</span>
    </a>
  );
}
