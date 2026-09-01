import React, { Component } from "react";
import "./styles.css";

class App extends Component {
  render() {
    return (
      <div className="app">

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo-wrap">
            <img
              className="LOGO"
              src="https://res.cloudinary.com/db4faz2rs/image/upload/v1788244930/ChatGPT_Image_Aug_5_2026_03_39_16_PM_pok6sr.png"
              alt="Connecting Frames"
            />
          </div>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">

          <div className="hero-leaves left-leaves">❦</div>

          <div className="hero-content">

            <p className="small-title">
              VIDEO EDITOR • VISUAL STORYTELLER
            </p>

            <h1>
              Connecting
              <br />
              <span>Frames</span>
            </h1>

            <div className="hand-line"></div>

            <p className="handwritten">
              every frame tells a story ♡
            </p>

            <p className="intro">
              Turning raw footage into meaningful visual stories,
              cinematic moments and unforgettable memories.
            </p>

            <a href="#work" className="sketch-btn">
              Explore My Work →
            </a>

          </div>


          <div className="hero-art">

            <div className="sketch-circle">

              <img
                src="https://res.cloudinary.com/db4faz2rs/image/upload/v1788244930/ChatGPT_Image_Aug_5_2026_03_39_16_PM_pok6sr.png"
                alt="Connecting Frames"
              />

            </div>

            <div className="sun"></div>

            <div className="mountain">
              △ △ △
            </div>

            <div className="film-strip">
              🎞
            </div>

          </div>

        </section>


        {/* STORY LINE */}
        <section className="story-line">

          <span>✦</span>

          <p>
            Some stories are not just watched.
          </p>

          <h2>
            They're <span>felt.</span>
          </h2>

          <div className="camera-icon">
            ◉
          </div>

        </section>


        {/* ABOUT */}
        <section className="about" id="about">

          <div className="section-number">
            01
          </div>

          <div className="about-content">

            <p className="section-label">
              A LITTLE ABOUT ME
            </p>

            <h2>
              Turning moments
              <br />
              into <span>stories.</span>
            </h2>

            <p>
              I transform ordinary footage into engaging visual
              experiences. Every cut, transition and sound is
              carefully crafted to create something meaningful.
            </p>

          </div>

          <div className="about-leaf">
            🌿
          </div>

        </section>


        {/* SERVICES */}
        <section className="services">

          <div className="section-heading">

            <p className="section-label">
              WHAT I CREATE
            </p>

            <h2>
              Crafted with
              <span> creativity.</span>
            </h2>

          </div>


          <div className="service-grid">

            <div className="service-card">

              <span className="card-number">
                01
              </span>

              <div className="service-icon">
                ▶
              </div>

              <h3>
                Reels Editing
              </h3>

              <p>
                Short and engaging videos
                designed to capture attention.
              </p>

              <div className="card-line"></div>

            </div>


            <div className="service-card">

              <span className="card-number">
                02
              </span>

              <div className="service-icon">
                🎞
              </div>

              <h3>
                Video Editing
              </h3>

              <p>
                Story-driven edits that
                keep your audience watching.
              </p>

              <div className="card-line"></div>

            </div>


            <div className="service-card">

              <span className="card-number">
                03
              </span>

              <div className="service-icon">
                ✦
              </div>

              <h3>
                Short Form
              </h3>

              <p>
                Creative content designed
                for social media platforms.
              </p>

              <div className="card-line"></div>

            </div>

          </div>

        </section>


        {/* PORTFOLIO */}
        <section className="work" id="work">

          <div className="section-heading">

            <p className="section-label">
              SELECTED STORIES
            </p>

            <h2>
              Frames I've
              <span> created.</span>
            </h2>

          </div>


          <div className="portfolio-grid">


            {/* VIDEO */}
            <div className="video-project">

              <div className="film-frame">

                <video className="RE"
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

                <p>
                  01 / REEL EDITING
                </p>

                <h3>
                  Creative Story
                </h3>

              </div>

            </div>


            <div className="video-project">

              <div className="empty-project">

                <span>
                  ▶
                </span>

                <p>
                  Coming Soon
                </p>

              </div>

              <div className="video-details">

                <p>
                  02 / VIDEO EDIT
                </p>

                <h3>
                  Next Story
                </h3>

              </div>

            </div>

          </div>

        </section>


        {/* CONTACT */}
        <section className="contact" id="contact">

          <div className="contact-decoration">
            ❦
          </div>

          <p className="section-label">
            LET'S CREATE
          </p>

          <h2>
            Have a story
            <br />

            <span>to tell?</span>
          </h2>

          <p className="contact-text">
            Let's turn your ideas into frames
            worth remembering.
          </p>

          <a
            href="mailto:evrameshcse2730@gmail.com"
            className="contact-btn"
          >
            Start a Project →
          </a>

        </section>


        {/* FOOTER */}
        <footer>

          <h3>
            CONNECTING FRAMES
          </h3>

          <p>
            Every frame tells a story ♡
          </p>

        </footer>

      </div>
    );
  }
}

export default App;