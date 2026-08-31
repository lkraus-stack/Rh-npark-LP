import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Coffee,
  MapPin,
  Menu,
  MonitorUp,
  MoonStar,
  Phone,
  Presentation,
  Route,
  UsersRound,
  X,
} from "lucide-react";
import { track } from "@franco/tracking";
import { tagungDe } from "../locales/de";
import { RoomExplorer } from "./RoomExplorer";
import { TagungInquiryDrawer } from "./TagungInquiryDrawer";

const FLOW_MODE = "inquiry";
const PROPERTY_SLUG = "rhoenpark";

const factIcons = [UsersRound, BedDouble, Car, MonitorUp];
const formatIcons = [CalendarDays, Presentation, MonitorUp, UsersRound];

function getInitialInquiryOpen() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("flow") === FLOW_MODE && params.get("segment") === "meeting";
}

function getInitialInquirySeed() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  const attendeeValue = Number(params.get("attendees"));
  const seating = params.get("seating");
  const focusParam = params.get("focus");
  const seed = {};

  if (room === "arena" || room === "rhoenum") seed.room = room;
  if (Number.isInteger(attendeeValue) && attendeeValue >= 100 && attendeeValue <= 400) {
    seed.attendees = attendeeValue;
  }
  if (tagungDe.form.fields.seatingOptions.includes(seating)) seed.seating = seating;
  if (focusParam) {
    const allowedFocus = new Set(tagungDe.venues.finder.focus.map((option) => option.value));
    seed.focus =
      focusParam === "none" ? [] : focusParam.split(",").filter((value) => allowedFocus.has(value));
  }

  return Object.keys(seed).length ? seed : null;
}

function writeInquiryUrl(sourceSection, seed) {
  const url = new URL(window.location.href);
  url.searchParams.set("flow", FLOW_MODE);
  url.searchParams.set("segment", "meeting");
  url.searchParams.set("source_section", sourceSection);
  if (seed?.room) url.searchParams.set("room", seed.room);
  else url.searchParams.delete("room");
  if (seed?.attendees) url.searchParams.set("attendees", String(seed.attendees));
  else url.searchParams.delete("attendees");
  if (seed?.seating) url.searchParams.set("seating", seed.seating);
  else url.searchParams.delete("seating");
  if (Array.isArray(seed?.focus)) {
    url.searchParams.set("focus", seed.focus.length ? seed.focus.join(",") : "none");
  } else {
    url.searchParams.delete("focus");
  }
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function cleanInquiryUrl() {
  const url = new URL(window.location.href);
  ["flow", "segment", "source_section", "room", "attendees", "seating", "focus"].forEach((param) =>
    url.searchParams.delete(param),
  );
  const query = url.searchParams.toString();
  window.history.replaceState({}, "", `${url.pathname}${query ? `?${query}` : ""}${url.hash}`);
}

function trackInquiry(event, payload = {}) {
  track(event, {
    property_slug: PROPERTY_SLUG,
    flow: FLOW_MODE,
    segment: "meeting",
    ...payload,
  });
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, text, align = "left" }) {
  return (
    <div className={`mtg-section-heading mtg-section-heading-${align}`}>
      <p className="mtg-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="mtg-section-intro">{text}</p>}
    </div>
  );
}

export function TagungPage() {
  const copy = tagungDe;
  const [inquiryOpen, setInquiryOpen] = useState(getInitialInquiryOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquirySeed, setInquirySeed] = useState(getInitialInquirySeed);
  const [mobileCtaVisible, setMobileCtaVisible] = useState(false);
  const [roomFinderVisible, setRoomFinderVisible] = useState(false);
  const initialInquiryTracked = useRef(false);
  const heroRef = useRef(null);
  const roomFinderRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    const openGraphImage = document.querySelector('meta[property="og:image"]');
    const previousDescription = description?.getAttribute("content") ?? "";
    const previousTheme = themeColor?.getAttribute("content") ?? "";
    const previousOpenGraphTitle = openGraphTitle?.getAttribute("content") ?? "";
    const previousOpenGraphDescription = openGraphDescription?.getAttribute("content") ?? "";
    const previousOpenGraphImage = openGraphImage?.getAttribute("content") ?? "";

    document.title = copy.meta.title;
    description?.setAttribute("content", copy.meta.description);
    themeColor?.setAttribute("content", "#123c2e");
    openGraphTitle?.setAttribute("content", copy.meta.title);
    openGraphDescription?.setAttribute("content", copy.meta.description);
    openGraphImage?.setAttribute("content", "/images/tagung/rhoenpark-arena.jpg");
    document.documentElement.classList.add("tagung-route");

    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
      themeColor?.setAttribute("content", previousTheme);
      openGraphTitle?.setAttribute("content", previousOpenGraphTitle);
      openGraphDescription?.setAttribute("content", previousOpenGraphDescription);
      openGraphImage?.setAttribute("content", previousOpenGraphImage);
      document.documentElement.classList.remove("tagung-route");
    };
  }, [copy.meta.description, copy.meta.title]);

  useEffect(() => {
    if (!inquiryOpen || initialInquiryTracked.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("flow") !== FLOW_MODE) return;

    initialInquiryTracked.current = true;
    trackInquiry("booking_drawer_open", {
      source_section: params.get("source_section") || "url",
    });
  }, [inquiryOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setMobileCtaVisible(!entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const roomFinder = roomFinderRef.current;
    if (!roomFinder || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setRoomFinderVisible(entry.isIntersecting),
      { threshold: 0.04 },
    );
    observer.observe(roomFinder);
    return () => observer.disconnect();
  }, []);

  function openInquiry(sourceSection, seed = null) {
    setInquirySeed(seed);
    writeInquiryUrl(sourceSection, seed);
    initialInquiryTracked.current = true;
    trackInquiry("booking_drawer_open", { source_section: sourceSection });
    if (menuOpen) menuButtonRef.current?.focus();
    setMenuOpen(false);
    setInquiryOpen(true);
  }

  function closeInquiry() {
    setInquiryOpen(false);
    cleanInquiryUrl();
  }

  return (
    <div className="tagung-page" id="top">
      <a className="mtg-skip-link" href="#main-content">
        Zum Inhalt springen
      </a>

      <header className="mtg-header">
        <a className="mtg-brand" href="/tagung" aria-label="Rhön Park Tagung Startseite">
          <img
            src="/images/tagung/rhoen-park-logo.png"
            alt="Rhön Park Aktiv Resort"
            width="1890"
            height="476"
          />
          <span>Tagung & Event</span>
        </a>

        <nav className="mtg-nav" aria-label={copy.nav.label}>
          <a href="#raeume">{copy.nav.rooms}</a>
          <a href="#campus">{copy.nav.campus}</a>
          <a href="#rahmenprogramm">{copy.nav.experience}</a>
          <a href="#lage">{copy.nav.location}</a>
          <a href="#faq">{copy.nav.faq}</a>
        </nav>

        <button
          className="mtg-button mtg-button-primary mtg-header-cta"
          type="button"
          onClick={() => openInquiry("header")}
        >
          {copy.nav.inquiry}
          <ArrowRight size={17} aria-hidden="true" />
        </button>

        <button
          ref={menuButtonRef}
          className="mtg-menu-button"
          type="button"
          aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="mtg-mobile-nav"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <nav
          className={`mtg-mobile-nav ${menuOpen ? "is-open" : ""}`}
          id="mtg-mobile-nav"
          aria-label="Mobile Tagungsnavigation"
          aria-hidden={!menuOpen}
        >
          <a href="#raeume" onClick={() => setMenuOpen(false)}>
            {copy.nav.rooms}
          </a>
          <a href="#campus" onClick={() => setMenuOpen(false)}>
            {copy.nav.campus}
          </a>
          <a href="#rahmenprogramm" onClick={() => setMenuOpen(false)}>
            {copy.nav.experience}
          </a>
          <a href="#lage" onClick={() => setMenuOpen(false)}>
            {copy.nav.location}
          </a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>
            {copy.nav.faq}
          </a>
          <button
            className="mtg-button mtg-button-primary"
            type="button"
            onClick={() => openInquiry("mobile_nav")}
          >
            {copy.nav.inquiry}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </nav>
      </header>

      <main id="main-content">
        <section ref={heroRef} className="mtg-hero" aria-labelledby="mtg-hero-title">
          <figure className="mtg-hero-media">
            <img
              src="/images/tagung/rhoenpark-arena.jpg"
              alt={copy.hero.imageAlt}
              width="1920"
              height="1244"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              <span>{copy.hero.imageLabel}</span>
              <strong>{copy.hero.imageMetric}</strong>
            </figcaption>
            <div className="mtg-hero-coordinate" aria-hidden="true">
              50.48° N · 10.11° E
            </div>
          </figure>

          <div className="mtg-hero-content">
            <div className="mtg-hero-copy">
              <p className="mtg-eyebrow mtg-eyebrow-light">{copy.hero.eyebrow}</p>
              <h1 id="mtg-hero-title">
                <span>{copy.hero.titleLead}</span>
                <em>{copy.hero.titleAccent}</em>
              </h1>
              <p className="mtg-hero-text">{copy.hero.text}</p>
              <div className="mtg-hero-actions">
                <button
                  className="mtg-button mtg-button-accent"
                  type="button"
                  onClick={() => openInquiry("hero")}
                >
                  {copy.hero.primaryCta}
                  <ArrowRight size={19} aria-hidden="true" />
                </button>
                <a className="mtg-button mtg-button-ghost" href="#raeume">
                  {copy.hero.secondaryCta}
                  <ChevronRight size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="mtg-hero-helper">
                <Check size={15} aria-hidden="true" />
                {copy.hero.helper}
              </p>
            </div>

            <aside className="mtg-hero-proof" aria-label={copy.hero.proofLabel}>
              <span>{copy.hero.proofLabel}</span>
              <ul>
                {copy.hero.proof.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="mtg-facts" aria-label="Tagungsfakten">
          {copy.facts.map((fact, index) => {
            const Icon = factIcons[index];
            return (
              <div className="mtg-fact" key={fact.label}>
                <Icon size={21} aria-hidden="true" />
                <span>
                  <strong>{fact.value}</strong>
                  <small>{fact.label}</small>
                </span>
              </div>
            );
          })}
        </section>

        <section className="mtg-section mtg-fit-section" id="fit-check">
          <div className="mtg-container">
            <div className="mtg-fit-intro-layout">
              <Reveal>
                <SectionHeading
                  eyebrow={copy.fit.eyebrow}
                  title={copy.fit.title}
                  text={copy.fit.text}
                />
              </Reveal>
              <Reveal className="mtg-fit-image" delay={0.08}>
                <img
                  src="/images/tagung/resort-aerial.jpg"
                  alt={copy.fit.imageAlt}
                  width="1124"
                  height="727"
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <Route size={17} aria-hidden="true" />
                  {copy.fit.imageCaption}
                </span>
              </Reveal>
            </div>
            <div className="mtg-format-grid">
              {copy.fit.formats.map((format, index) => {
                const Icon = formatIcons[index];
                return (
                  <Reveal className="mtg-format-card" delay={index * 0.045} key={format.title}>
                    <div className="mtg-format-card-top">
                      <span className="mtg-card-icon">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <span className="mtg-card-number">0{index + 1}</span>
                    </div>
                    <h3>{format.title}</h3>
                    <p>{format.text}</p>
                    <span className="mtg-format-meta">{format.meta}</span>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mtg-section mtg-venues-section" id="raeume" ref={roomFinderRef}>
          <div className="mtg-container">
            <div className="mtg-venues-heading-row">
              <Reveal>
                <SectionHeading
                  eyebrow={copy.venues.eyebrow}
                  title={copy.venues.title}
                  text={copy.venues.text}
                />
              </Reveal>
              <span className="mtg-venues-heading-index" aria-hidden="true">
                02
              </span>
            </div>

            <RoomExplorer
              copy={copy.venues}
              initialSeed={inquirySeed}
              onInquiry={(seed) => openInquiry(`room_finder_${seed.room}`, seed)}
            />
          </div>
        </section>

        <section className="mtg-section mtg-campus-section" id="campus">
          <div className="mtg-container">
            <div className="mtg-campus-head">
              <Reveal>
                <SectionHeading
                  eyebrow={copy.campus.eyebrow}
                  title={copy.campus.title}
                  text={copy.campus.text}
                />
              </Reveal>
              <div className="mtg-campus-proof">
                <Route size={22} aria-hidden="true" />
                <span>
                  <strong>Kurze Wege</strong>
                  <small>vom Plenum bis ins Zimmer</small>
                </span>
              </div>
            </div>

            <div className="mtg-campus-layout">
              <ol className="mtg-day-timeline">
                {copy.campus.steps.map((item, index) => (
                  <li key={item.time}>
                    <span className="mtg-time">{item.time}</span>
                    <span className="mtg-timeline-marker">0{index + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mtg-campus-gallery">
                <figure className="mtg-campus-panorama">
                  <img
                    src="/images/tagung/tagung-catering.jpg"
                    alt={copy.campus.imageAlt}
                    width="1920"
                    height="1280"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    <Coffee size={17} aria-hidden="true" />
                    {copy.campus.imageCaption}
                  </figcaption>
                  <div className="mtg-campus-inset">
                    <img
                      src="/images/tagung/arena-dinner.jpg"
                      alt={copy.campus.insetAlt}
                      width="1920"
                      height="1245"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>
                      <MoonStar size={16} aria-hidden="true" />
                      {copy.campus.insetCaption}
                    </span>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="mtg-section mtg-experience-section" id="rahmenprogramm">
          <div className="mtg-container">
            <Reveal>
              <SectionHeading
                eyebrow={copy.experience.eyebrow}
                title={copy.experience.title}
                text={copy.experience.text}
              />
            </Reveal>
            <div className="mtg-experience-grid">
              {copy.experience.items.map((item, index) => (
                <Reveal className="mtg-experience-card" delay={index * 0.06} key={item.title}>
                  <figure>
                    <img
                      src={item.image}
                      alt={item.alt}
                      width="1200"
                      height="800"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>0{index + 1}</span>
                  </figure>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mtg-caveat">
              <Check size={16} aria-hidden="true" />
              {copy.experience.caveat}
            </p>
          </div>
        </section>

        <section className="mtg-section mtg-location-section" id="lage">
          <div className="mtg-container mtg-location-grid">
            <Reveal className="mtg-location-copy">
              <SectionHeading
                eyebrow={copy.location.eyebrow}
                title={copy.location.title}
                text={copy.location.text}
              />
              <ul className="mtg-location-list">
                {copy.location.bullets.map((bullet) => (
                  <li key={bullet}>
                    <MapPin size={17} aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                className="mtg-button mtg-button-primary"
                type="button"
                onClick={() => openInquiry("location")}
              >
                Transferbedarf mit anfragen
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </Reveal>

            <Reveal className="mtg-map-card" delay={0.08}>
              <span className="mtg-map-label">Deutschland · Mitte</span>
              <img
                src="/images/tagung/deutschland-lage.png"
                alt={copy.location.imageAlt}
                width="771"
                height="1024"
                loading="lazy"
                decoding="async"
              />
              <div className="mtg-map-pin">
                <MapPin size={19} aria-hidden="true" />
                <span>
                  <strong>Rhön Park</strong>
                  <small>Hausen-Roth</small>
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mtg-funding-section">
          <div className="mtg-container mtg-funding-grid">
            <div>
              <p className="mtg-eyebrow mtg-eyebrow-light">{copy.funding.eyebrow}</p>
              <h2>{copy.funding.title}</h2>
            </div>
            <div>
              <p>{copy.funding.text}</p>
              <a
                href="https://www.stmelf.bayern.de/foerderung/kongressinitiative-fuer-die-bayerische/index.html"
                target="_blank"
                rel="noreferrer"
              >
                {copy.funding.link}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="mtg-section mtg-faq-section" id="faq">
          <div className="mtg-container mtg-faq-grid">
            <Reveal>
              <SectionHeading eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
              <button className="mtg-text-button" type="button" onClick={() => openInquiry("faq")}>
                Eigene Frage mitgeben
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </Reveal>
            <div className="mtg-faq-list">
              {copy.faq.items.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    <span>0{index + 1}</span>
                    <strong>{item.question}</strong>
                    <ChevronRight size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mtg-final-cta">
          <div className="mtg-final-cta-image" aria-hidden="true">
            <img
              src="/images/tagung/resort-aerial.jpg"
              alt=""
              width="1124"
              height="727"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="mtg-container mtg-final-cta-content">
            <p className="mtg-eyebrow mtg-eyebrow-light">{copy.finalCta.eyebrow}</p>
            <h2>{copy.finalCta.title}</h2>
            <p>{copy.finalCta.text}</p>
            <div>
              <button
                className="mtg-button mtg-button-accent"
                type="button"
                onClick={() => openInquiry("final_cta")}
              >
                {copy.finalCta.action}
                <ArrowRight size={19} aria-hidden="true" />
              </button>
              <a href="tel:+499779911857">
                <Phone size={17} aria-hidden="true" />
                {copy.finalCta.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mtg-footer">
        <div className="mtg-container mtg-footer-grid">
          <div className="mtg-footer-brand">
            <img
              src="/images/tagung/rhoen-park-logo.png"
              alt="Rhön Park Aktiv Resort"
              width="1890"
              height="476"
              loading="lazy"
            />
            <p>{copy.footer.claim}</p>
          </div>
          <div>
            <span>{copy.footer.concept}</span>
            <small>{copy.footer.legal}</small>
          </div>
        </div>
      </footer>

      <button
        className={`mtg-mobile-sticky-cta ${mobileCtaVisible && !roomFinderVisible && !inquiryOpen ? "is-visible" : ""}`}
        type="button"
        aria-hidden={!mobileCtaVisible || roomFinderVisible || inquiryOpen}
        tabIndex={mobileCtaVisible && !roomFinderVisible && !inquiryOpen ? 0 : -1}
        onClick={() => openInquiry("mobile_sticky")}
      >
        {copy.nav.inquiry}
        <ArrowRight size={18} aria-hidden="true" />
      </button>

      <TagungInquiryDrawer open={inquiryOpen} onClose={closeInquiry} seed={inquirySeed} />
    </div>
  );
}
