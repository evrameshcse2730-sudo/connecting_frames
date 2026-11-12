import React, { Component } from "react";

// Section imports keep the original stylesheet order (global styles come from index.css)
import Cursor from "../../Components/Cursor/Cursor.jsx";
import Preloader from "../../Components/Preloader/Preloader.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Hero from "../../Components/Hero/Hero.jsx";
import Marquee from "../../Components/Marquee/Marquee.jsx";
import Story from "../../Components/Story/Story.jsx";
import About from "../../Components/About/About.jsx";
import Services from "../../Components/Services/Services.jsx";
import Portfolio from "../../Components/Portfolio/Portfolio.jsx";
import Stats from "../../Components/Stats/Stats.jsx";
import Contact from "../../Components/Contact/Contact.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import BackToTop from "../../Components/BackToTop/BackToTop.jsx";

// Page layout + all scroll/mouse interactions (reveal, parallax, cursor, counters).
// Each section's markup and styles live in src/Components/<Name>/.

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      showTopButton: false,
      counts: props.content.stats.map(() => 0),
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

      const nextCounts = this.props.content.stats.map((stat) =>
        Math.round((Number(stat.value) || 0) * eased)
      );
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

  render() {
    const { isLoaded, showTopButton, counts } = this.state;
    const c = this.props.content;

    return (
      <div className="app">
        <Preloader done={isLoaded} />
        <div className="film-grain" aria-hidden="true"></div>
        <Cursor dotRef={this.cursorDot} ringRef={this.cursorRing} labelRef={this.portfolioLabel} />
        <div className="scroll-progress"></div>

        <Navbar />
        <Hero
          content={c.hero}
          heroRef={(el) => { this.hero = el; }}
          artRef={(el) => { this.heroArt = el; }}
        />
        <Marquee items={c.marquee} />
        <Story content={c.story} />
        <About content={c.about} />
        <Stats stats={c.stats} counts={counts} sectionRef={(el) => { this.statsSection = el; }} />
        <Services content={c.services} />
        <Portfolio content={c.work} />
        <Contact content={c.contact} />
        <Footer content={c.footer} />

        <BackToTop visible={showTopButton} />
      </div>
    );
  }
}

export default HomeView;
