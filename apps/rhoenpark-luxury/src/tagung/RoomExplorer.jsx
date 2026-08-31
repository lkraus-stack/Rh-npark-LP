import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Images,
  MonitorUp,
  Presentation,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

function clampAttendees(value) {
  return Math.min(400, Math.max(100, Math.round(value)));
}

function getRecommendation(attendees, seating, focus) {
  if (seating === "tables" && attendees > 300) return null;

  if (
    attendees > 180 ||
    seating === "tables" ||
    focus.includes("stage") ||
    focus.includes("exhibition")
  ) {
    return "arena";
  }

  return "rhoenum";
}

function getVenueStatus(venue, attendees, seating, copy) {
  const capacity = venue.capacities[seating];
  const hasPublishedCapacity = typeof capacity === "number";
  const fits = hasPublishedCapacity && attendees <= capacity;
  const state = fits ? "fits" : hasPublishedCapacity ? "exceeds" : "unknown";

  return {
    capacity,
    fits,
    state,
    label:
      state === "fits"
        ? copy.finder.fits
        : state === "exceeds"
          ? copy.finder.exceeds
          : copy.finder.review,
  };
}

export function RoomExplorer({ copy, initialSeed, onInquiry }) {
  const reduceMotion = useReducedMotion();
  const initialAttendees = clampAttendees(initialSeed?.attendees ?? 180);
  const initialSeating =
    copy.finder.seating.find((option) => option.label === initialSeed?.seating)?.value ?? "row";
  const allowedFocus = new Set(copy.finder.focus.map((option) => option.value));
  const initialFocus = Array.isArray(initialSeed?.focus)
    ? initialSeed.focus.filter((value) => allowedFocus.has(value))
    : ["breakouts"];
  const initialRecommendation = getRecommendation(initialAttendees, initialSeating, initialFocus);
  const initialVenue = copy.items.some((venue) => venue.id === initialSeed?.room)
    ? initialSeed.room
    : (initialRecommendation ?? "arena");
  const [attendees, setAttendees] = useState(initialAttendees);
  const [seating, setSeating] = useState(initialSeating);
  const [focus, setFocus] = useState(initialFocus);
  const recommendedVenueId = useMemo(
    () => getRecommendation(attendees, seating, focus),
    [attendees, focus, seating],
  );
  const [activeVenueId, setActiveVenueId] = useState(initialVenue);
  const [photoIndex, setPhotoIndex] = useState(0);
  const recommendationReady = useRef(false);
  const activeVenue = copy.items.find((venue) => venue.id === activeVenueId) ?? copy.items[0];
  const seatingLabel =
    copy.finder.seating.find((option) => option.value === seating)?.label ??
    copy.finder.seating.at(-1)?.label;
  const activeStatus = getVenueStatus(activeVenue, attendees, seating, copy);
  const activePhoto = activeVenue.gallery[photoIndex] ?? activeVenue.gallery[0];

  useEffect(() => {
    if (!recommendationReady.current) {
      recommendationReady.current = true;
      return;
    }
    setActiveVenueId(recommendedVenueId ?? "arena");
    setPhotoIndex(0);
  }, [recommendedVenueId]);

  function selectVenue(venueId) {
    setActiveVenueId(venueId);
    setPhotoIndex(0);
  }

  function toggleFocus(value) {
    setFocus((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function showPreviousPhoto() {
    setPhotoIndex((current) => (current === 0 ? activeVenue.gallery.length - 1 : current - 1));
  }

  function showNextPhoto() {
    setPhotoIndex((current) => (current === activeVenue.gallery.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="mtg-room-finder">
      <div className="mtg-room-controls" aria-label={copy.finder.controlsLabel}>
        <div className="mtg-room-control mtg-room-control-attendees">
          <div className="mtg-room-control-heading">
            <span className="mtg-room-control-icon" aria-hidden="true">
              <UsersRound size={18} />
            </span>
            <span>
              <label htmlFor="mtg-room-attendees">{copy.finder.attendeesLabel}</label>
              <small id="mtg-room-attendees-hint">{copy.finder.attendeesHint}</small>
            </span>
            <output htmlFor="mtg-room-attendees">{attendees}</output>
          </div>
          <input
            id="mtg-room-attendees"
            type="range"
            min="100"
            max="400"
            step="1"
            value={attendees}
            aria-describedby="mtg-room-attendees-hint"
            onChange={(event) => setAttendees(Number(event.target.value))}
          />
          <div className="mtg-room-presets" aria-label={copy.finder.presetLabel}>
            {copy.finder.presets.map((preset) => (
              <button
                type="button"
                aria-pressed={attendees === preset}
                onClick={() => setAttendees(preset)}
                key={preset}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mtg-room-control">
          <legend>
            <span className="mtg-room-control-icon" aria-hidden="true">
              <Presentation size={18} />
            </span>
            {copy.finder.seatingLabel}
          </legend>
          <div className="mtg-room-option-row">
            {copy.finder.seating.map((option) => (
              <button
                type="button"
                className={seating === option.value ? "is-selected" : ""}
                aria-pressed={seating === option.value}
                onClick={() => setSeating(option.value)}
                key={option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mtg-room-control">
          <legend>
            <span className="mtg-room-control-icon" aria-hidden="true">
              <SlidersHorizontal size={18} />
            </span>
            {copy.finder.focusLabel}
          </legend>
          <div className="mtg-room-option-row mtg-room-option-row-wrap">
            {copy.finder.focus.map((option) => (
              <button
                type="button"
                className={focus.includes(option.value) ? "is-selected" : ""}
                aria-pressed={focus.includes(option.value)}
                onClick={() => toggleFocus(option.value)}
                key={option.value}
              >
                {focus.includes(option.value) && <Check size={14} aria-hidden="true" />}
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mtg-room-workspace">
        <aside className="mtg-room-list" aria-label={copy.finder.venuesLabel}>
          <div className="mtg-room-list-heading">
            <span>{copy.finder.recommendation}</span>
            <small>{copy.finder.compareHint}</small>
          </div>
          {copy.items.map((venue, index) => {
            const status = getVenueStatus(venue, attendees, seating, copy);
            const recommended = Boolean(recommendedVenueId) && venue.id === recommendedVenueId;

            return (
              <button
                type="button"
                className={`mtg-room-list-item ${activeVenue.id === venue.id ? "is-active" : ""}`}
                aria-pressed={activeVenue.id === venue.id}
                onClick={() => selectVenue(venue.id)}
                key={venue.id}
              >
                <span className="mtg-room-list-index">0{index + 1}</span>
                <span className="mtg-room-list-copy">
                  <strong>{venue.name}</strong>
                  <small className={status.fits ? "is-fit" : ""}>
                    {status.fits ? <CircleCheck size={14} aria-hidden="true" /> : null}
                    {status.label}
                  </small>
                </span>
                {recommended && (
                  <span className="mtg-room-recommended">{copy.finder.recommendedShort}</span>
                )}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            );
          })}
        </aside>

        <div className="mtg-room-stage">
          <div className="mtg-room-visual">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={`${activeVenue.id}-${activePhoto.src}`}
                src={activePhoto.src}
                alt={activePhoto.alt}
                width="1920"
                height="1280"
                loading="lazy"
                decoding="async"
                initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
              />
            </AnimatePresence>

            <div className="mtg-room-image-meta">
              <span>
                <Images size={16} aria-hidden="true" />
                {activePhoto.label}
              </span>
              <span>
                {String(photoIndex + 1).padStart(2, "0")} /{" "}
                {String(activeVenue.gallery.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mtg-room-gallery-actions" aria-label={copy.finder.galleryLabel}>
              <button
                type="button"
                onClick={showPreviousPhoto}
                aria-label={copy.finder.previousImage}
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
              <button type="button" onClick={showNextPhoto} aria-label={copy.finder.nextImage}>
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mtg-room-thumbnails" aria-label={copy.finder.galleryLabel}>
            {activeVenue.gallery.map((photo, index) => (
              <button
                type="button"
                className={photoIndex === index ? "is-active" : ""}
                aria-pressed={photoIndex === index}
                aria-label={`${photo.label} ${copy.finder.viewImageSuffix}`}
                onClick={() => setPhotoIndex(index)}
                key={photo.src}
              >
                <img src={photo.src} alt="" width="240" height="160" loading="lazy" />
                <span>{photo.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="mtg-room-detail"
            key={activeVenue.id}
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }}
          >
            <div className={`mtg-room-status is-${activeStatus.state}`}>
              {activeStatus.fits ? (
                <CircleCheck size={16} aria-hidden="true" />
              ) : (
                <MonitorUp size={16} aria-hidden="true" />
              )}
              <span>{activeStatus.label}</span>
              {typeof activeStatus.capacity === "number" && (
                <small>
                  {copy.finder.capacityPrefix} {activeStatus.capacity}
                </small>
              )}
            </div>

            <p className="mtg-overline">{activeVenue.overline}</p>
            <h3>{activeVenue.name}</h3>
            <p className="mtg-room-description">{activeVenue.description}</p>

            <dl className="mtg-room-metrics">
              {activeVenue.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mtg-room-amenities" aria-label={copy.finder.amenitiesLabel}>
              {activeVenue.amenities.map((amenity) => (
                <span key={amenity}>
                  <Check size={14} aria-hidden="true" />
                  {amenity}
                </span>
              ))}
            </div>

            <div className="mtg-room-selection">
              <span>{copy.finder.choiceLabel}</span>
              <strong>
                {attendees} {copy.finder.people} · {seatingLabel} · {activeVenue.name}
              </strong>
              {activeStatus.state === "unknown" && <p>{copy.finder.capacityUnavailable}</p>}
              {activeStatus.state === "exceeds" && (
                <p>
                  {copy.finder.capacityExceeded} {activeStatus.capacity} {copy.finder.people}.
                </p>
              )}
              <small>{copy.finder.selectionNote}</small>
            </div>

            <button
              className="mtg-button mtg-button-accent mtg-button-wide"
              type="button"
              onClick={() =>
                onInquiry({
                  room: activeVenue.id,
                  attendees: clampAttendees(attendees),
                  seating: seatingLabel,
                  focus,
                })
              }
            >
              {copy.finder.inquiry}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
