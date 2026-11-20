// Builds a WhatsApp chat link (wa.me) from the admin-editable contact settings.
export function whatsappLink(number, message) {
  const digits = String(number || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
