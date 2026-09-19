import React, { Component } from "react";
import "./App.css";

const STATS = [
  { id: "projects", value: 40, suffix: "+", label: "Projects Cut & Shipped" },
  { id: "years", value: 3, suffix: "+", label: "Years Behind the Timeline" },
  { id: "clients", value: 25, suffix: "+", label: "Happy Collaborators" },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      showTopButton: false,
      counts: STATS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {}),
    };

    this.cursorDot = React.createRef();
    this.cursorRing = React.createRef();
    this.portfolioLabel = React.createRef();

    this.statsAnimated = false;
    this.mousePos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
  }

  componentDidMount() {
    // ==============================
    // PRELOADER
    // ==============================
    this.preloadTimer = setTimeout(() => {
      this.setState({ isLoaded: true });
      document.body.classList.add("is-loaded");
    }, 1400);

    // ==============================
    // SCROLL REVEAL
    // ==============================
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            this.revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    revealElements.forEach((element) => {
      this.revealObserver.observe(element);
    });

    // ==============================
    // STAT COUNTERS (animate once, on view)
    // ==============================
    this.statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
            this.statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (this.statsSection) {
      this.statsObserver.observe(this.statsSection);
    }

    // ==============================
    // SCROLL PROGRESS + NAVBAR + PARALLAX + BACK-TO-TOP
    // ==============================
    this.handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

      const progressBar = document.querySelector(".scroll-progress");

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      const navbar = document.querySelector(".navbar");

      if (navbar) {
        if (scrollTop > 40) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
      }

      if (window.innerWidth > 800 && this.heroArt) {
        const heroRect = this.heroArt.parentElement.getBoundingClientRect();
        const offset = Math.max(-50, Math.min(50, -heroRect.top * 0.08));
        this.heroArt.style.setProperty("--scroll-parallax", `${offset}px`);
      }

      this.setState((prev) => {
        const shouldShow = scrollTop > 700;
        if (shouldShow === prev.showTopButton) return null;
        return { showTopButton: shouldShow };
      });
    };

    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();

    // ==============================
    // HERO MOUSE PARALLAX
    // ==============================
    this.handleHeroMouseMove = (event) => {
      if (window.innerWidth <= 800) return;

      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      const sun = document.querySelector(".sun");
      const mountain = document.querySelector(".mountain");
      const film = document.querySelector(".film-strip");

      if (sun) {
        sun.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
      }
      if (mountain) {
        mountain.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
      }
      if (film) {
        film.style.transform = `translate(${x * 8}px, ${y * 8}px) rotate(20deg)`;
      }
    };

    if (this.hero) {
      this.hero.addEventListener("mousemove", this.handleHeroMouseMove);
    }

    // ==============================
    // SERVICE CARD TILT + SPOTLIGHT
    // ==============================
    this.serviceCards = document.querySelectorAll(".service-card");

    this.serviceCards.forEach((card) => {
      const handleMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--spot-x", `${x}px`);
        card.style.setProperty("--spot-y", `${y}px`);

        if (window.innerWidth <= 800) return;

        const rotateX = (y / rect.height - 0.5) * -5;
        const rotateY = (x / rect.width - 0.5) * 5;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      };

      const handleLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);

      card._handleMove = handleMove;
      card._handleLeave = handleLeave;
    });

    // ==============================
    // MAGNETIC BUTTONS
    // ==============================
    this.magneticEls = document.querySelectorAll("[data-magnetic]");

    this.magneticEls.forEach((el) => {
      const strength = 22;

      const handleMove = (event) => {
        if (window.innerWidth <= 800) return;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${(x / rect.width) * strength}px, ${
          (y / rect.height) * strength
        }px)`;
      };

      const handleLeave = () => {
        el.style.transform = "";
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);

      el._handleMove = handleMove;
      el._handleLeave = handleLeave;
    });

    // ==============================
    // CUSTOM CURSOR
    // ==============================
    this.hasFinePointer =
      window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth > 800;

    if (this.hasFinePointer) {
      document.body.classList.add("has-custom-cursor");

      this.handleCursorMove = (event) => {
        this.mousePos = { x: event.clientX, y: event.clientY };
        if (this.cursorDot.current) {
          this.cursorDot.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        }
      };

      window.addEventListener("mousemove", this.handleCursorMove, {
        passive: true,
      });

      this.cursorRaf = () => {
        this.ringPos.x += (this.mousePos.x - this.ringPos.x) * 0.16;
        this.ringPos.y += (this.mousePos.y - this.ringPos.y) * 0.16;

        if (this.cursorRing.current) {
          this.cursorRing.current.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;
        }

        this.cursorRafId = requestAnimationFrame(this.cursorRaf);
      };
      this.cursorRafId = requestAnimationFrame(this.cursorRaf);

      this.cursorHoverTargets = document.querySelectorAll(
        "a, button, .service-card, input, textarea, select"
      );

      this.addCursorHover = () =>
        document.body.classList.add("cursor-hover");
      this.removeCursorHover = () =>
        document.body.classList.remove("cursor-hover");

      this.cursorHoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", this.addCursorHover);
        el.addEventListener("mouseleave", this.removeCursorHover);
      });
    }

    // ==============================
    // PORTFOLIO HOVER LABEL
    // ==============================
    this.portfolioItems = document.querySelectorAll(
      "[data-portfolio-label]"
    );

    this.portfolioItems.forEach((item) => {
      const labelText = item.getAttribute("data-portfolio-label");

      const handleEnter = () => {
        if (window.innerWidth <= 800) return;
        if (this.portfolioLabel.current) {
          this.portfolioLabel.current.textContent = labelText;
          this.portfolioLabel.current.classList.add("is-active");
        }
      };

      const handleMove = (event) => {
        if (window.innerWidth <= 800) return;
        if (this.portfolioLabel.current) {
          this.portfolioLabel.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        }
      };

      const handleLeave = () => {
        if (this.portfolioLabel.current) {
          this.portfolioLabel.current.classList.remove("is-active");
        }
      };

      item.addEventListener("mouseenter", handleEnter);
      item.addEventListener("mousemove", handleMove);
      item.addEventListener("mouseleave", handleLeave);

      item._handleEnter = handleEnter;
      item._handleMove = handleMove;
      item._handleLeave = handleLeave;
    });
  }

  animateStats() {
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const nextCounts = {};
      STATS.forEach((s) => {
        nextCounts[s.id] = Math.round(s.value * eased);
      });

      this.setState({ counts: nextCounts });

      if (progress < 1) {
        this.statsRaf = requestAnimationFrame(tick);
      }
    };

    this.statsRaf = requestAnimationFrame(tick);
  }

  componentWillUnmount() {
    clearTimeout(this.preloadTimer);

    if (this.revealObserver) this.revealObserver.disconnect();
    if (this.statsObserver) this.statsObserver.disconnect();
    if (this.statsRaf) cancelAnimationFrame(this.statsRaf);
    if (this.cursorRafId) cancelAnimationFrame(this.cursorRafId);

    if (this.handleScroll) {
      window.removeEventListener("scroll", this.handleScroll);
    }

    if (this.hero && this.handleHeroMouseMove) {
      this.hero.removeEventListener("mousemove", this.handleHeroMouseMove);
    }

    if (this.serviceCards) {
      this.serviceCards.forEach((card) => {
        card.removeEventListener("mousemove", card._handleMove);
        card.removeEventListener("mouseleave", card._handleLeave);
      });
    }

    if (this.magneticEls) {
      this.magneticEls.forEach((el) => {
        el.removeEventListener("mousemove", el._handleMove);
        el.removeEventListener("mouseleave", el._handleLeave);
      });
    }

    if (this.handleCursorMove) {
      window.removeEventListener("mousemove", this.handleCursorMove);
    }

    if (this.cursorHoverTargets) {
      this.cursorHoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", this.addCursorHover);
        el.removeEventListener("mouseleave", this.removeCursorHover);
      });
    }

    if (this.portfolioItems) {
      this.portfolioItems.forEach((item) => {
        item.removeEventListener("mouseenter", item._handleEnter);
        item.removeEventListener("mousemove", item._handleMove);
        item.removeEventListener("mouseleave", item._handleLeave);
      });
    }
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    const { isLoaded, showTopButton, counts } = this.state;

    return (
      <div className="app">
        {/* ==============================
            PRELOADER
        ============================== */}
        <div className={`preloader ${isLoaded ? "preloader-done" : ""}`}>
          <div className="preloader-mark">
            <svg viewBox="0 0 120 120" className="preloader-ring">
              <circle cx="60" cy="60" r="52" />
            </svg>
            <span>CF</span>
          </div>
          <p className="preloader-text">connecting frames</p>
        </div>

        {/* ==============================
            FILM GRAIN OVERLAY
        ============================== */}
        <div className="film-grain" aria-hidden="true"></div>

        {/* ==============================
            CUSTOM CURSOR
        ============================== */}
        <div className="cursor-dot" ref={this.cursorDot}></div>
        <div className="cursor-ring" ref={this.cursorRing}></div>
        <div className="portfolio-cursor-label" ref={this.portfolioLabel}></div>

        {/* ==============================
            SCROLL PROGRESS
        ============================== */}
        <div className="scroll-progress"></div>

        {/* ==============================
            NAVBAR
        ============================== */}
        <nav className="navbar reveal">
          <div className="logo-wrap">
            <img
              className="LOGO"
              src="https://res.cloudinary.com/db4faz2rs/image/upload/v1788244930/ChatGPT_Image_Aug_5_2026_03_39_16_PM_pok6sr.png"
              alt="Connecting Frames"
            />
          </div>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        {/* ==============================
            HERO
        ============================== */}
        <section
          className="hero"
          ref={(element) => {
            this.hero = element;
          }}
        >
          <div className="hero-leaves left-leaves">❦</div>

          <div className="hero-content">
            <p className="small-title reveal">
              Video editor and web creator based in Telangana
            </p>

            <h1 className="hero-title split-reveal">
              {"Connecting".split("").map((char, i) => (
                <span
                  key={`c-${i}`}
                  className="split-char"
                  style={{ transitionDelay: `${0.25 + i * 0.045}s` }}
                >
                  {char}
                </span>
              ))}
              <br />
              <span className="script">
                {"Frames".split("").map((char, i) => (
                  <span
                    key={`f-${i}`}
                    className="split-char"
                    style={{
                      transitionDelay: `${0.25 + (10 + i) * 0.045}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>

            <div className="hand-line reveal-scale"></div>

            <p className="handwritten reveal">every frame tells a story ♡</p>

            <p className="intro reveal">
              I create meaningful videos and thoughtful digital experiences —
              from cinematic edits to modern websites, every detail is
              crafted to tell a story.
            </p>

            <a href="#work" className="sketch-btn reveal" data-magnetic="true">
              <span>Explore My Work</span>
              <em>→</em>
            </a>
          </div>

          <div
            className="hero-art reveal-scale"
            ref={(element) => {
              this.heroArt = element;
            }}
          >
            <div className="sketch-circle">
              <img
                src="https://res.cloudinary.com/db4faz2rs/image/upload/v1788244930/ChatGPT_Image_Aug_5_2026_03_39_16_PM_pok6sr.png"
                alt="Connecting Frames"
              />
            </div>

            <div className="sun"></div>
            <div className="mountain">△ △ △</div>
            <div className="film-strip">🎞</div>
          </div>
        </section>

        {/* ==============================
            MARQUEE STRIP
        ============================== */}
        <div className="marquee-strip">
          <div className="marquee-track">
            {Array(2)
              .fill(null)
              .map((_, loopIndex) => (
                <div className="marquee-group" key={loopIndex} aria-hidden={loopIndex === 1}>
                  <span>Reel Editing</span>
                  <span className="marquee-dot">✦</span>
                  <span>Colour Grading</span>
                  <span className="marquee-dot">✦</span>
                  <span>Web Development</span>
                  <span className="marquee-dot">✦</span>
                  <span>Motion Graphics</span>
                  <span className="marquee-dot">✦</span>
                  <span>Visual Storytelling</span>
                  <span className="marquee-dot">✦</span>
                </div>
              ))}
          </div>
        </div>

        {/* ==============================
            STORY
        ============================== */}
        <section className="story-line">
          <span className="reveal-scale">✦</span>

          <p className="reveal">Some stories are not just watched.</p>

          <h2 className="reveal">
            They're <span>felt.</span>
          </h2>

          <div className="camera-icon reveal-scale">◉</div>
        </section>

        {/* ==============================
            ABOUT
        ============================== */}
        <section className="about" id="about">
          <div className="section-number reveal-left">01</div>

          <div className="about-content">
            <p className="section-label reveal">a little about me</p>

            <h2 className="reveal">
              From frames to
              <br />
              <span>digital stories.</span>
            </h2>

            <p className="reveal">
              I work across video editing and website development,
              transforming ideas into engaging visual stories and thoughtful
              digital experiences. Whether it's a cinematic reel or a
              complete website, every project is crafted with creativity,
              purpose and attention to detail.
            </p>
          </div>

          <div className="about-leaf reveal-right">🌿</div>
        </section>

        {/* ==============================
            STATS
        ============================== */}
        <section
          className="stats"
          ref={(element) => {
            this.statsSection = element;
          }}
        >
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div
                className={`stat-card reveal-scale`}
                key={stat.id}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <h3>
                  {counts[stat.id]}
                  <span>{stat.suffix}</span>
                </h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==============================
            SERVICES
        ============================== */}
        <section className="services" id="services">
          <div className="section-heading">
            <p className="section-label reveal">what I create</p>

            <h2 className="reveal">
              From frames to
              <span> digital spaces.</span>
            </h2>
          </div>

          <div className="service-grid">
            <div className="service-card reveal-left">
              <div className="service-icon">▶</div>
              <h3>Video Editing</h3>
              <p>
                Cinematic edits, reels and engaging short-form videos crafted
                to bring every moment to life.
              </p>
              <div className="card-line"></div>
            </div>

            <div className="service-card reveal-scale">
              <div className="service-icon">◇</div>
              <h3>Website Development</h3>
              <p>
                Modern, responsive and creative websites designed to turn
                ideas into meaningful digital experiences.
              </p>
              <div className="card-line"></div>
            </div>

            <div className="service-card reveal-right">
              <div className="service-icon">✦</div>
              <h3>Visual Stories</h3>
              <p>
                Nature, travel and beautiful everyday moments captured
                through a thoughtful creative perspective.
              </p>
              <div className="card-line"></div>
            </div>
          </div>
        </section>

        {/* ==============================
            PORTFOLIO
        ============================== */}
        <section className="work" id="work">
          <div className="section-heading">
            <p className="section-label reveal">selected work</p>

            <h2 className="reveal">
              Stories &<span> digital experiences.</span>
            </h2>
          </div>

          <div className="portfolio-grid">
            {/* VIDEO PROJECT */}
            <div
              className="video-project reveal-left"
              data-portfolio-label="▶ Play Reel"
            >
              <div className="film-frame">
                <video
                  className="RE"
                  src="https://res.cloudinary.com/db4faz2rs/video/upload/v1788245248/Task-1_yyfhwg.mp4"
                  controls
                  muted
                  loop
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="video-details">
                <p>01 / REEL EDITING</p>
                <h3>Creative Story</h3>
              </div>
            </div>

            {/* WEBSITE PROJECT */}
            <div
              className="video-project reveal-right"
              data-portfolio-label="↗ Visit Site"
            >
              <a
                href="https://www.infiflowtelugu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="website-project"
                aria-label="Visit Infiflow Telugu live website"
              >
                <div className="empty-project website-preview">
                  <div className="browser-bar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="browser-content">
                    <p className="live-label">LIVE WEBSITE ↗</p>
                    <h4>Infiflow Telugu</h4>
                    <p>Designed &amp; Developed</p>

                    <div className="website-lines">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                    <div className="visit-site">
                      <span>View Live Website</span>
                      <em>→</em>
                    </div>
                  </div>
                </div>
              </a>

              <div className="video-details">
                <p>02 / WEBSITE DEVELOPMENT</p>
                <h3>Infiflow Telugu</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================
            CONTACT
        ============================== */}
        <section className="contact" id="contact">
          <div className="contact-decoration">❦</div>

          <div className="contact-inner">
            <div className="contact-info">
              <p className="section-label reveal-left">let's create something</p>

              <h2 className="reveal-left">
                Have an idea
                <br />
                <span>in mind?</span>
              </h2>

              <p className="contact-text reveal-left">
                Whether it's a cinematic video, a creative website, or a
                visual story — let's turn your idea into something
                meaningful.
              </p>

              <div className="contact-note reveal-left">
                <span>✦</span>
                <p>Good stories begin with a conversation.</p>
              </div>
            </div>

            {/* CONTACT FORM */}
            <form
              className="contact-form reveal-right"
              action="https://formsubmit.co/evrameshcse2730@gmail.com"
              method="POST"
            >
              <input
                type="hidden"
                name="_subject"
                value="New Project Inquiry - Connecting Frames"
              />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input
                type="hidden"
                name="_next"
                value="https://www.infiflowtelugu.com"
              />

              <div className="form-group reveal">
                <label htmlFor="name">YOUR NAME</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group reveal">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group reveal">
                <label htmlFor="service">WHAT DO YOU NEED?</label>
                <select id="service" name="service" defaultValue="" required>
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Website Development">
                    Website Development
                  </option>
                  <option value="Visual Story">Visual Story</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group reveal">
                <label htmlFor="message">TELL ME ABOUT YOUR IDEA</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell me a little about your project..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit reveal"
                data-magnetic="true"
              >
                <span>Send Message</span>
                <strong>→</strong>
              </button>

              <p className="form-small reveal">
                I'll get back to you as soon as possible ♡
              </p>
            </form>
          </div>
        </section>

        {/* ==============================
            FOOTER
        ============================== */}
        <footer className="reveal">
          <h3>CONNECTING FRAMES</h3>
          <p>Every frame tells a story ♡</p>
        </footer>

        {/* ==============================
            BACK TO TOP
        ============================== */}
        <button
          type="button"
          className={`back-to-top ${showTopButton ? "is-visible" : ""}`}
          onClick={this.scrollToTop}
          aria-label="Back to top"
        >
          <span>🎞</span>
        </button>
      </div>
    );
  }
}

export default App;