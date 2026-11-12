import { useState } from "react";
import { saveMessage } from "../../firebase/publicApi.js";
import "./Contact.css";

export default function Contact({ content }) {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    // Honeypot filled → silently drop (bot)
    if (form.elements._honey && form.elements._honey.value) return;
    if (sending) return;
    setSending(true);

    try {
      await saveMessage(Object.fromEntries(new FormData(form)));
    } catch {
      // Inbox save failed; the email via FormSubmit still goes out below
    }
    form.submit();
  };

  const formEmail = String(content.formEmail).replace(/[^\w.@+-]/g, "");

  return (
    <section className="contact" id="contact">
      <div className="contact-decoration">❦</div>

      <div className="contact-inner">
        <div className="contact-info">
          <p className="section-label reveal-left">{content.label}</p>
          <h2 className="reveal-left">
            {content.title}
            <br />
            <span>{content.titleHighlight}</span>
          </h2>
          <p className="contact-text reveal-left">{content.text}</p>
          <div className="contact-note reveal-left">
            <span>✦</span>
            <p>{content.note}</p>
          </div>
        </div>

        <form
          className="contact-form reveal-right"
          action={`https://formsubmit.co/${formEmail}`}
          method="POST"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_subject" value="New Project Inquiry - Connecting Frames" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value="https://connectingframes.in/thanks.html" />

          {/* Honeypot: bots fill this, humans never see it */}
          <input
            type="text"
            name="_honey"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />

          <div className="form-group reveal">
            <label htmlFor="name">YOUR NAME</label>
            <input id="name" type="text" name="name" placeholder="Your name" autoComplete="name" maxLength="100" required />
          </div>

          <div className="form-group reveal">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength="200"
              required
            />
          </div>

          <div className="form-group reveal">
            <label htmlFor="service">WHAT DO YOU NEED?</label>
            <select id="service" name="service" defaultValue="" required>
              <option value="" disabled>
                Select a service
              </option>
              {content.serviceOptions.map((opt) => (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group reveal">
            <label htmlFor="message">TELL ME ABOUT YOUR IDEA</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              maxLength="5000"
              placeholder="Tell me a little about your project..."
              required
            ></textarea>
          </div>

          <button type="submit" className="contact-submit reveal" data-magnetic="true" disabled={sending}>
            <span>{sending ? "Sending..." : "Send Message"}</span>
            <strong>→</strong>
          </button>

          <p className="form-small reveal">{content.smallText}</p>
        </form>
      </div>
    </section>
  );
}
