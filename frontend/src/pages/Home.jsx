import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion } from "framer-motion";

import AgricultureParticles from "../components/AgricultureParticles";

import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    image: "/images/hero-1.jpg.png",
    eyebrow: "KisanDirect",
    title: ["Farming", "Smarter", "Together"],
    description:
      "A direct digital bridge between farmers, buyers and the opportunities that help Indian agriculture grow.",
  },
  {
    image: "/images/hero-2.jpg.png",
    eyebrow: "From Farm To Market",
    title: ["Better Produce", "Better Reach", "Better Returns"],
    description:
      "KisanDirect helps farmers reach buyers directly while making the journey from harvest to market simpler.",
  },
  {
    image: "/images/hero-3.jpg.png",
    eyebrow: "Powered By Intelligence",
    title: ["Data For", "Every", "Decision"],
    description:
      "Use demand insights, forecasts and practical information to make more confident agricultural decisions.",
  },
  {
    image: "/images/hero-4.jpg.jpg",
    eyebrow: "One Connected Ecosystem",
    title: ["Grow", "Connect", "Prosper"],
    description:
      "From farmers and FPOs to buyers and logistics, KisanDirect brings the agricultural value chain closer together.",
  },
];

export default function Home() {
  const homeRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentSlide = slides[activeSlide];

  useEffect(() => {
    setImageLoaded(false);

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [activeSlide]);

  const goToSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* =====================================================
       HERO
    ===================================================== */

      gsap.from(".home-hero-eyebrow", {
        opacity: 0,
        y: 35,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".home-hero-title span", {
        opacity: 0,
        y: 80,
        rotateX: -30,
        stagger: 0.12,
        duration: 1.15,
        delay: 0.15,
        ease: "power4.out",
      });

      gsap.from(".home-hero-description", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".home-hero-start", {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.8,
        delay: 0.7,
        ease: "back.out(1.7)",
      });

      /* =====================================================
       HERO PARALLAX
    ===================================================== */

      gsap.to(".home-hero-image", {
        yPercent: 10,
        scale: 1.1,
        ease: "none",

        scrollTrigger: {
          trigger: ".home-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      /* =====================================================
       HERO FADE
    ===================================================== */

      gsap.to(".home-hero-content", {
        opacity: 0,
        y: -100,

        scrollTrigger: {
          trigger: ".home-hero",
          start: "45% top",
          end: "100% top",
          scrub: true,
        },
      });

      /* =====================================================
       PROJECT STORY
    ===================================================== */

      gsap.from(".project-story-logo", {
        opacity: 0,
        scale: 0.6,
        rotation: -8,
        duration: 1.1,

        scrollTrigger: {
          trigger: ".project-story",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },

        ease: "back.out(1.5)",
      });

      gsap.from(".project-story-kicker", {
        opacity: 0,
        y: 30,
        duration: 0.8,

        scrollTrigger: {
          trigger: ".project-story",
          start: "top 70%",
        },
      });

      /* =====================================================
       PROJECT HEADING
    ===================================================== */

      gsap.from(".project-story h2", {
        opacity: 0,
        y: 100,
        scale: 0.92,
        duration: 1.2,

        scrollTrigger: {
          trigger: ".project-story h2",
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },

        ease: "power4.out",
      });

      gsap.from(".project-story-description", {
        opacity: 0,
        y: 50,
        duration: 1,

        scrollTrigger: {
          trigger: ".project-story-description",
          start: "top 85%",
          end: "top 55%",
          scrub: 1,
        },
      });

      /* =====================================================
       PROJECT IMAGE PARALLAX
    ===================================================== */

      gsap.to(".project-story-image", {
        yPercent: -8,
        scale: 1.15,
        ease: "none",

        scrollTrigger: {
          trigger: ".project-story",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      /* =====================================================
       WAVE MOVEMENT
    ===================================================== */

      gsap.fromTo(
        ".project-story-wave",
        {
          xPercent: -3,
        },
        {
          xPercent: 3,
          ease: "none",

          scrollTrigger: {
            trigger: ".project-story",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        },
      );

      /* =====================================================
       GLOBAL SECTION REVEALS
    ===================================================== */

      gsap.utils.toArray(".scroll-reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 70,
          duration: 1,

          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },

          ease: "power3.out",
        });
      });

      /* =====================================================
       STRIKETHROUGH ANIMATION
    ===================================================== */

      gsap.utils.toArray(".animated-strike").forEach((element) => {
        gsap.fromTo(
          element,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.9,

            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },

            ease: "power3.inOut",
          },
        );
      });
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="home-page min-h-screen bg-green-50">
      <Navbar />

      <main>
        <section className="home-hero" aria-label="KisanDirect introduction">
          <div className="home-hero-media" aria-hidden="true">
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                className={`home-hero-slide ${
                  index === activeSlide ? "is-active" : ""
                }`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="home-hero-image"
                  onLoad={() => index === activeSlide && setImageLoaded(true)}
                  onError={() => index === activeSlide && setImageLoaded(true)}
                />
              </div>
            ))}
            <div className="home-hero-wash" />
            <div className="home-hero-grain" />
          </div>

          <div className="home-hero-content">
            <div className="home-hero-copy" key={activeSlide}>
              <p className="home-hero-eyebrow">{currentSlide.eyebrow}</p>

              <h1 className="home-hero-title">
                {currentSlide.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>

              <p className="home-hero-description">
                {currentSlide.description}
              </p>

              <motion.div
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link to="/register" className="home-hero-start">
                  START NOW
                  <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </motion.div>
            </div>
          </div>

          <button
            type="button"
            className="home-carousel-arrow home-carousel-arrow-left"
            onClick={() => goToSlide(activeSlide - 1)}
            aria-label="Previous slide"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            className="home-carousel-arrow home-carousel-arrow-right"
            onClick={() => goToSlide(activeSlide + 1)}
            aria-label="Next slide"
          >
            <ArrowRight size={22} />
          </button>

          <div
            className="home-carousel-controls"
            aria-label="Carousel controls"
          >
            <div className="home-carousel-progress" aria-hidden="true">
              <span className={imageLoaded ? "is-loaded" : ""} />
            </div>

            <div className="home-carousel-dots">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  className={`home-carousel-dot ${
                    index === activeSlide ? "is-active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                />
              ))}
            </div>
          </div>

          <div className="home-hero-scroll">SCROLL TO EXPLORE</div>
        </section>

        <section
          className="project-story"
          aria-labelledby="project-story-title"
        >
          <div className="project-story-media" aria-hidden="true">
            <img
              src="/images/project-story.jpg"
              alt=""
              className="project-story-image"
            />
            <div className="project-story-overlay" />
          </div>

          <svg
            className="project-story-wave"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 C180,88 330,18 510,62 C700,108 820,126 1010,64 C1175,10 1300,55 1440,22 L1440,0 L0,0 Z" />
          </svg>

          <div className="project-story-content">
            <p className="project-story-kicker">OUR PROJECT</p>

            <h2 id="project-story-title">
              Connecting the people who grow our food
              <span>with the people who need it.</span>
            </h2>

            <p className="project-story-description">
              KisanDirect is a digital platform built to make agriculture more
              connected, transparent and rewarding. We bring farmers and buyers
              closer together, helping produce move from farm to market with
              better access, better information and better opportunities.
            </p>
          </div>

          <div className="project-story-scroll">SCROLL TO DISCOVER</div>
        </section>
        {/* ----------------------------------------------------------
    IMPACT / PROJECT EXPLAINER SECTION
----------------------------------------------------------- */}
        <section className="impact-story" aria-labelledby="impact-story-title">
          <div className="impact-story-media">
            <img
              src="/images/impact-story.png"
              alt=""
              className="impact-story-image"
            />

            <div className="impact-story-overlay" />
          </div>

          <div className="impact-story-content">
            <p className="impact-story-kicker">
              HOW KISANDIRECT MAKES A DIFFERENCE
            </p>

            <h2 id="impact-story-title" className="impact-story-title">
              <span className="impact-word impact-word-1">
                <span>Connect</span>
              </span>

              <span className="impact-word impact-word-2">
                <span>Farmers</span>
              </span>

              <span className="impact-word impact-word-3">
                <span>With</span>
              </span>

              <span className="impact-word impact-word-4">
                <span>Opportunity</span>
              </span>
            </h2>

            <p className="impact-story-description">
              KisanDirect creates a direct connection between farmers, buyers,
              markets and the information they need to make better decisions.
            </p>
          </div>

          <div className="impact-story-scroll">SCROLL TO EXPLORE</div>
        </section>

        {/* ----------------------------------------------------------
    PROJECT VIDEO SECTION
----------------------------------------------------------- */}
        <section className="project-video-section">
          <div className="project-video-heading">
            <p>SEE KISANDIRECT IN ACTION</p>

            <h2>
              Agriculture,
              <span>Connected.</span>
            </h2>
          </div>

          <div className="project-video-wrapper">
            <video
              className="project-video"
              controls
              playsInline
              preload="metadata"
              poster="/images/video-poster.jpg"
            >
              <source
                src="/videos/kisandirect-explainer.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
        {/* =========================================================
    KISANDIRECT STATISTICS / IMPACT SECTION
========================================================= */}

        <section className="stats-story">
          {/* Background */}
          <div className="stats-story-background">
            <img
              src="/images/stats-background.jpg"
              alt=""
              className="stats-story-background-image"
            />

            <div className="stats-story-overlay" />
          </div>

          {/* Main content */}
          <div className="stats-story-container">
            {/* Section heading */}
            <div className="stats-story-intro">
              <p className="stats-story-kicker">KISANDIRECT IMPACT</p>

              <h2 className="stats-story-title">
                <span>Better</span>
                <span>Connections</span>
                <span>For Agriculture</span>
              </h2>

              <p className="stats-story-intro-text">
                We are building a more connected agricultural ecosystem where
                farmers can reach better opportunities, buyers can source
                directly, and information can lead to better decisions.
              </p>
            </div>

            {/* Small progress dots */}
            <div className="stats-story-dots" aria-hidden="true">
              <span className="active"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* =====================================================
        STATISTICS
    ====================================================== */}

            <div className="stats-list">
              {/* STAT 01 */}
              <article className="stat-item">
                <div className="stat-image-wrapper">
                  <img src="/images/stat-1.png" alt="" className="stat-image" />
                </div>

                <div className="stat-content">
                  <h3 className="stat-name">Fair Market Prices</h3>
                  <p className="stat-label">
                    Farmers get direct access to buyers
                  </p>
                  <p className="stat-number">
                    <strong>25%</strong> MORE
                  </p>
                  <p className="stat-note">
                    Better earning opportunities through direct market access.
                  </p>
                </div>
              </article>

              {/* STAT 02 */}
              <article className="stat-item">
                <div className="stat-image-wrapper">
                  <img src="/images/stat-2.png" alt="" className="stat-image" />
                </div>

                <div className="stat-content">
                  <h3 className="stat-name">Fresh Produce</h3>
                  <p className="stat-label">
                    Farm-fresh products delivered to buyers
                  </p>
                  <p className="stat-number">
                    <strong>40%</strong> FASTER
                  </p>
                  <p className="stat-note">
                    Reducing unnecessary delays between farms and customers.
                  </p>
                </div>
              </article>

              {/* STAT 03 */}
              <article className="stat-item">
                <div className="stat-image-wrapper">
                  <img src="/images/stat-3.png" alt="" className="stat-image" />
                </div>

                <div className="stat-content">
                  <h3 className="stat-name">Direct Market Access</h3>
                  <p className="stat-label">
                    Farmers connected directly with buyers
                  </p>
                  <p className="stat-number">
                    <strong>60%</strong> MORE
                  </p>
                  <p className="stat-note">
                    Greater opportunities to connect with potential buyers.
                  </p>
                </div>
              </article>

              {/* STAT 04 */}
              <article className="stat-item">
                <div className="stat-image-wrapper">
                  <img src="/images/stat-4.png" alt="" className="stat-image" />
                </div>

                <div className="stat-content">
                  <h3 className="stat-name">Trusted Farmers</h3>
                  <p className="stat-label">
                    Building stronger connections with local farmers
                  </p>
                  <p className="stat-number">
                    <strong>100+</strong> FARMERS
                  </p>
                  <p className="stat-note">
                    Growing a community of farmers and agricultural producers.
                  </p>
                </div>
              </article>
            </div>

            {/* =====================================================
        CONCLUSION
    ====================================================== */}

            <div className="stats-story-conclusion">
              <div className="stats-conclusion-dot"></div>

              <p>
                Agriculture works better when everyone in the ecosystem can move
                forward together.
              </p>

              <a href="/register" className="stats-story-button">
                START WITH KISANDIRECT
                <span>→</span>
              </a>

              <h3>
                Connect.
                <br />
                Trade.
                <br />
                Grow.
              </h3>
            </div>
          </div>
        </section>
        {/* =========================================================
    KISANDIRECT FOOTER
========================================================= */}

        <footer className="kd-footer">
          {/* Wavy top */}
          <div className="kd-footer-wave" aria-hidden="true">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                d="
          M0,55
          C120,15 210,85 330,55
          C450,25 530,85 650,52
          C770,18 850,85 970,52
          C1090,20 1170,85 1290,52
          C1360,35 1400,50 1440,38
          L1440,0
          L0,0
          Z
        "
              />
            </svg>
          </div>

          <div className="kd-footer-decoration" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="kd-footer-main">
            {/* Logo */}
            <div className="kd-footer-brand">
              <p>
                Connecting farmers, buyers and opportunities for a smarter
                agricultural ecosystem.
              </p>
            </div>

            {/* Legal */}
            <div className="kd-footer-column">
              <h3>LEGAL</h3>
              <a href="/government-schemes">Government Schemes</a>
            </div>

            {/* Explore */}
            <div className="kd-footer-column">
              <h3>EXPLORE</h3>

              <a href="/">Home</a>

              <a href="/marketplace">Marketplace</a>

              <a href="/about">About KisanDirect</a>

              <a href="/contact">Contact</a>
            </div>

            {/* Contact */}
            <div className="kd-footer-column kd-footer-contact">
              <h3>CONTACT</h3>

              <a href="mailto:hello@kisandirect.com">hello@kisandirect.com</a>

              <a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="kd-footer-bottom">
            <div className="kd-footer-bottom-left">
              <div className="kd-footer-badge">KD</div>

              <span>
                KISANDIRECT — BUILDING A CONNECTED FUTURE FOR AGRICULTURE
              </span>
            </div>

            <div className="kd-footer-bottom-right">
              <span>© {new Date().getFullYear()} KisanDirect</span>

              <span>All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
