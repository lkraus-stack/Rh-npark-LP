import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Info, Minus, Plus } from "lucide-react";
import { DateRangePicker, Drawer, StepIndicator } from "@franco/booking-ui";
import { track } from "@franco/tracking";
import { tagungDe } from "../locales/de";

const STORAGE_KEY = "franco-booking-rhoenpark-tagung-inquiry";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;
const PROPERTY_SLUG = "rhoenpark";
const FLOW_MODE = "inquiry";
const FORM_ID = "tagung-inquiry-form";
const STEP_HEADING_IDS = [
  "mtg-step-basics",
  "mtg-step-schedule",
  "mtg-step-stay",
  "mtg-step-contact",
];
const FOCUS_TECHNOLOGY_INDEX = {
  stage: 0,
  hybrid: 1,
  exhibition: 2,
};

function getLocalIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MIN_DATE = getLocalIsoDate();

const initialInquiry = {
  format: "",
  attendees: 120,
  startDate: "",
  endDate: "",
  datesFlexible: false,
  mainRoom: "recommendation",
  seating: "Noch offen",
  breakouts: 2,
  technology: ["Bühne & Präsentation"],
  overnight: true,
  rooms: 100,
  nights: 1,
  catering: ["Kaffeepausen", "Business-Lunch"],
  experience: [],
  transfer: false,
  accessibility: "",
  company: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  budget: "Noch offen",
  notes: "",
  privacy: false,
};

function getStoredInquiry() {
  if (typeof window === "undefined") return { ...initialInquiry };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...initialInquiry };
    const envelope = JSON.parse(stored);
    const savedAt = typeof envelope.savedAt === "number" ? envelope.savedAt : Date.now();

    if (Date.now() - savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return { ...initialInquiry };
    }

    const parsed = envelope.data && typeof envelope.data === "object" ? envelope.data : envelope;

    return {
      ...initialInquiry,
      ...parsed,
      technology: Array.isArray(parsed.technology) ? parsed.technology : initialInquiry.technology,
      catering: Array.isArray(parsed.catering) ? parsed.catering : initialInquiry.catering,
      experience: Array.isArray(parsed.experience) ? parsed.experience : initialInquiry.experience,
      privacy: false,
    };
  } catch {
    return { ...initialInquiry };
  }
}

function trackInquiry(event, payload = {}) {
  track(event, {
    property_slug: PROPERTY_SLUG,
    flow: FLOW_MODE,
    segment: "meeting",
    ...payload,
  });
}

function formatDate(value) {
  if (!value) return "offen";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function Choice({
  type = "checkbox",
  name,
  value,
  checked,
  onChange,
  children,
  description,
  required = false,
  ariaInvalid,
  ariaDescribedBy,
}) {
  return (
    <label className={`mtg-form-choice ${checked ? "is-selected" : ""}`}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <span className="mtg-form-choice-control" aria-hidden="true">
        {checked && <Check size={14} />}
      </span>
      <span>
        <strong>{children}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

export function TagungInquiryDrawer({ open, onClose, seed }) {
  const copy = tagungDe.form;
  const fields = copy.fields;
  const [step, setStep] = useState(1);
  const [inquiry, setInquiry] = useState(getStoredInquiry);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const persistenceReady = useRef(false);
  const successRef = useRef(null);

  useEffect(() => {
    if (!persistenceReady.current) {
      persistenceReady.current = true;
      return undefined;
    }

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            savedAt: Date.now(),
            data: { ...inquiry, privacy: false },
          }),
        );
      } catch {
        // Storage can be unavailable in private browsing; the form remains usable in memory.
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [inquiry]);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setErrors({});
    setSuccess(false);
    setInquiry((current) => {
      const seededTechnology = Array.isArray(seed?.focus)
        ? seed.focus
            .map((value) => fields.technologyOptions[FOCUS_TECHNOLOGY_INDEX[value]])
            .filter(Boolean)
        : current.technology;

      return {
        ...current,
        ...(seed?.attendees ? { attendees: seed.attendees } : {}),
        ...(seed?.room ? { mainRoom: seed.room } : {}),
        ...(seed?.seating ? { seating: seed.seating } : {}),
        ...(Array.isArray(seed?.focus)
          ? {
              breakouts: seed.focus.includes("breakouts") ? 2 : 0,
              technology: seededTechnology,
            }
          : {}),
        privacy: false,
      };
    });
  }, [open, seed]);

  useEffect(() => {
    if (!success) return;
    window.requestAnimationFrame(() => successRef.current?.focus());
  }, [success]);

  function updateField(field, value) {
    setInquiry((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const hasDependentError =
        (field === "datesFlexible" && current.dates) || (field === "overnight" && current.rooms);
      if (
        !current[field] &&
        !(field === "startDate" || field === "endDate") &&
        !hasDependentError
      ) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      if (field === "startDate" || field === "endDate") delete next.dates;
      if (field === "datesFlexible") delete next.dates;
      if (field === "overnight") delete next.rooms;
      return next;
    });
  }

  function toggleListValue(field, value) {
    const values = inquiry[field];
    updateField(
      field,
      values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
    );
  }

  function validateStep(currentStep) {
    const nextErrors = {};
    const attendeeCount = Number(inquiry.attendees);

    if (currentStep === 1) {
      if (!inquiry.format) nextErrors.format = copy.errors.format;
      if (!Number.isInteger(attendeeCount) || attendeeCount < 100 || attendeeCount > 400) {
        nextErrors.attendees = copy.errors.attendees;
      }
      if (!inquiry.datesFlexible && (!inquiry.startDate || !inquiry.endDate)) {
        nextErrors.dates = copy.errors.dates;
      } else if (
        !inquiry.datesFlexible &&
        inquiry.startDate &&
        inquiry.endDate &&
        inquiry.endDate < inquiry.startDate
      ) {
        nextErrors.dates = copy.errors.dateOrder;
      } else if (!inquiry.datesFlexible && inquiry.startDate < MIN_DATE) {
        nextErrors.dates = copy.errors.datesPast;
      }
    }

    if (currentStep === 3 && inquiry.overnight) {
      const roomCount = Number(inquiry.rooms);
      if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 313) {
        nextErrors.rooms = copy.errors.rooms;
      }
    }

    if (currentStep === 4) {
      if (!inquiry.company.trim()) nextErrors.company = copy.errors.company;
      if (!inquiry.firstName.trim()) nextErrors.firstName = copy.errors.firstName;
      if (!inquiry.lastName.trim()) nextErrors.lastName = copy.errors.lastName;
      if (!inquiry.email.trim()) {
        nextErrors.email = copy.errors.email;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
        nextErrors.email = copy.errors.emailInvalid;
      }
      if (!inquiry.privacy) nextErrors.privacy = copy.errors.privacy;
    }

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      window.setTimeout(() => {
        const field = document.querySelector(`[data-field="${firstError}"]`);
        const selectors = {
          format: ["input[type='radio']"],
          attendees: ["#tagung-attendees"],
          dates: [
            ".date-range-day:not(:disabled)",
            "input[type='date']",
            ".date-range-toolbar button:not(:disabled)",
          ],
          rooms: ["input[type='number']"],
          company: ["input"],
          firstName: ["input"],
          lastName: ["input"],
          email: ["input"],
          privacy: ["input"],
        };
        const selectorList = selectors[firstError] || ["input", "select", "textarea"];
        const target = selectorList
          .flatMap((selector) => Array.from(field?.querySelectorAll(selector) || []))
          .find((element) => element.offsetParent !== null && !element.disabled);
        target?.focus();
      }, 0);
    }

    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep(step)) return;

    trackInquiry("booking_step_complete", {
      step_index: step,
      step_name: copy.steps[step - 1],
    });
    const next = Math.min(step + 1, 4);
    setStep(next);
    window.setTimeout(() => document.getElementById(STEP_HEADING_IDS[next - 1])?.focus(), 0);
  }

  function previousStep() {
    setErrors({});
    const previous = Math.max(step - 1, 1);
    setStep(previous);
    window.setTimeout(() => document.getElementById(STEP_HEADING_IDS[previous - 1])?.focus(), 0);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (step < 4) nextStep();
    else submitInquiry();
  }

  function handleFormKeyDown(event) {
    const target = event.target;
    const excludedTypes = ["checkbox", "radio", "date"];

    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.tagName === "SELECT" ||
      excludedTypes.includes(target.type)
    ) {
      return;
    }

    event.preventDefault();
    if (step < 4) nextStep();
    else submitInquiry();
  }

  function submitInquiry() {
    if (!validateStep(4)) return;

    trackInquiry("booking_step_complete", {
      step_index: 4,
      step_name: copy.steps[3],
    });
    setInquiry((current) => ({ ...current, privacy: false }));
    setSuccess(true);
  }

  const selectedRoom = fields.mainRooms.find((room) => room.value === inquiry.mainRoom);
  const dateSummary = inquiry.datesFlexible
    ? "Termin flexibel"
    : `${formatDate(inquiry.startDate)} – ${formatDate(inquiry.endDate)}`;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      eyebrow={copy.eyebrow}
      title={success ? copy.successTitle : copy.title}
      closeLabel={copy.close}
      footer={
        success ? (
          <button
            className="mtg-button mtg-button-primary mtg-button-wide"
            type="button"
            onClick={onClose}
          >
            {copy.successClose}
          </button>
        ) : (
          <>
            <button
              className="mtg-button mtg-button-secondary"
              type="button"
              onClick={step === 1 ? onClose : previousStep}
            >
              {step === 1 ? copy.closeAction : copy.back}
            </button>
            {step < 4 ? (
              <button className="mtg-button mtg-button-primary" type="submit" form={FORM_ID}>
                {copy.next}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <button className="mtg-button mtg-button-primary" type="submit" form={FORM_ID}>
                {copy.submit}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
          </>
        )
      }
    >
      {success ? (
        <div className="booking-body mtg-booking-body">
          <div className="mtg-inquiry-success" role="status" tabIndex={-1} ref={successRef}>
            <span className="mtg-success-icon" aria-hidden="true">
              <Check size={28} />
            </span>
            <p>{copy.successText}</p>
            <div className="mtg-success-summary">
              <span>
                <small>Format</small>
                <strong>{inquiry.format}</strong>
              </span>
              <span>
                <small>Teilnehmende</small>
                <strong>{inquiry.attendees}</strong>
              </span>
              <span>
                <small>Zeitraum</small>
                <strong>{dateSummary}</strong>
              </span>
              <span>
                <small>Bereich</small>
                <strong>{selectedRoom?.label}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mtg-inquiry-intro">
            <span>{copy.draft}</span>
            <p>{copy.prototypeNote}</p>
          </div>
          <StepIndicator current={step} total={4} labels={[...copy.steps]} />
          <div className="booking-body mtg-booking-body">
            <div className="mtg-form-errors" aria-live="polite">
              {Object.keys(errors).length > 0 && copy.errors.summary}
            </div>

            <form
              id={FORM_ID}
              className="mtg-inquiry-form"
              onSubmit={handleFormSubmit}
              onKeyDown={handleFormKeyDown}
              noValidate
            >
              <button
                className="mtg-form-submit-proxy"
                type="submit"
                tabIndex={-1}
                aria-hidden="true"
              >
                {step < 4 ? copy.next : copy.submit}
              </button>
              {step === 1 && (
                <section className="mtg-inquiry-step" aria-labelledby="mtg-step-basics">
                  <div className="mtg-form-heading">
                    <span>01</span>
                    <div>
                      <h3 id="mtg-step-basics" tabIndex={-1}>
                        {copy.sections.basics}
                      </h3>
                      <p>{copy.sections.basicsText}</p>
                    </div>
                  </div>

                  <fieldset className="mtg-form-group" data-field="format">
                    <legend>{fields.format}</legend>
                    <div className="mtg-choice-grid mtg-choice-grid-one">
                      {fields.formats.map((format, index) => (
                        <Choice
                          type="radio"
                          name="format"
                          value={format}
                          checked={inquiry.format === format}
                          onChange={() => updateField("format", format)}
                          required
                          ariaInvalid={Boolean(errors.format)}
                          ariaDescribedBy={errors.format ? "tagung-format-error" : undefined}
                          key={format}
                        >
                          <span id={`tagung-format-${index}`}>{format}</span>
                        </Choice>
                      ))}
                    </div>
                    {errors.format && (
                      <p className="mtg-field-error" id="tagung-format-error">
                        {errors.format}
                      </p>
                    )}
                  </fieldset>

                  <div className="mtg-form-group" data-field="attendees">
                    <label htmlFor="tagung-attendees">{fields.attendees}</label>
                    <div className="mtg-attendee-control">
                      <button
                        type="button"
                        aria-label="Zehn Teilnehmende weniger"
                        onClick={() =>
                          updateField("attendees", Math.max(100, Number(inquiry.attendees) - 10))
                        }
                      >
                        <Minus size={18} aria-hidden="true" />
                      </button>
                      <input
                        id="tagung-attendees"
                        type="number"
                        min="100"
                        max="400"
                        inputMode="numeric"
                        name="attendees"
                        required
                        value={inquiry.attendees}
                        onChange={(event) => updateField("attendees", event.target.value)}
                        aria-invalid={Boolean(errors.attendees)}
                        aria-describedby={
                          errors.attendees ? "tagung-attendees-error" : "tagung-attendees-help"
                        }
                      />
                      <span>Personen</span>
                      <button
                        type="button"
                        aria-label="Zehn Teilnehmende mehr"
                        onClick={() =>
                          updateField("attendees", Math.min(400, Number(inquiry.attendees) + 10))
                        }
                      >
                        <Plus size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <small className="mtg-field-help" id="tagung-attendees-help">
                      {fields.attendeesHelp}
                    </small>
                    {errors.attendees && (
                      <p className="mtg-field-error" id="tagung-attendees-error">
                        {errors.attendees}
                      </p>
                    )}
                  </div>

                  <div
                    className="mtg-form-group"
                    data-field="dates"
                    aria-describedby={errors.dates ? "tagung-dates-error" : undefined}
                  >
                    <label className="mtg-switch-row">
                      <input
                        type="checkbox"
                        checked={inquiry.datesFlexible}
                        onChange={(event) => updateField("datesFlexible", event.target.checked)}
                      />
                      <span>{fields.datesFlexible}</span>
                    </label>
                    {inquiry.datesFlexible ? (
                      <p className="mtg-inline-note">
                        <Info size={17} aria-hidden="true" />
                        {fields.datesFlexibleHelp}
                      </p>
                    ) : (
                      <DateRangePicker
                        startDate={inquiry.startDate}
                        endDate={inquiry.endDate}
                        minDate={MIN_DATE}
                        startLabel={fields.dateStart}
                        endLabel={fields.dateEnd}
                        invalid={Boolean(errors.dates)}
                        ariaDescribedBy={errors.dates ? "tagung-dates-error" : undefined}
                        onChange={({ startDate, endDate }) => {
                          setInquiry((current) => ({ ...current, startDate, endDate }));
                          setErrors((current) => {
                            const next = { ...current };
                            delete next.dates;
                            return next;
                          });
                        }}
                      />
                    )}
                    {errors.dates && (
                      <p className="mtg-field-error" id="tagung-dates-error">
                        {errors.dates}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="mtg-inquiry-step" aria-labelledby="mtg-step-schedule">
                  <div className="mtg-form-heading">
                    <span>02</span>
                    <div>
                      <h3 id="mtg-step-schedule" tabIndex={-1}>
                        {copy.sections.schedule}
                      </h3>
                      <p>{copy.sections.scheduleText}</p>
                    </div>
                  </div>

                  <fieldset className="mtg-form-group">
                    <legend>{fields.mainRoom}</legend>
                    <div className="mtg-choice-grid mtg-choice-grid-one">
                      {fields.mainRooms.map((room) => (
                        <Choice
                          type="radio"
                          name="mainRoom"
                          value={room.value}
                          checked={inquiry.mainRoom === room.value}
                          onChange={() => updateField("mainRoom", room.value)}
                          key={room.value}
                        >
                          {room.label}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mtg-form-group">
                    <legend>{fields.seating}</legend>
                    <div className="mtg-choice-grid">
                      {fields.seatingOptions.map((seating) => (
                        <Choice
                          type="radio"
                          name="seating"
                          value={seating}
                          checked={inquiry.seating === seating}
                          onChange={() => updateField("seating", seating)}
                          key={seating}
                        >
                          {seating}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mtg-form-grid">
                    <label className="mtg-form-field">
                      <span>{fields.breakouts}</span>
                      <select
                        value={inquiry.breakouts}
                        onChange={(event) => updateField("breakouts", Number(event.target.value))}
                      >
                        {[0, 1, 2, 3, 4, 5].map((count) => (
                          <option value={count} key={count}>
                            {count === 0 ? "Keine" : count}
                          </option>
                        ))}
                      </select>
                      <small>{fields.breakoutsHelp}</small>
                    </label>
                  </div>

                  <fieldset className="mtg-form-group">
                    <legend>{fields.technology}</legend>
                    <div className="mtg-choice-grid">
                      {fields.technologyOptions.map((technology) => (
                        <Choice
                          value={technology}
                          checked={inquiry.technology.includes(technology)}
                          onChange={() => toggleListValue("technology", technology)}
                          key={technology}
                        >
                          {technology}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                </section>
              )}

              {step === 3 && (
                <section className="mtg-inquiry-step" aria-labelledby="mtg-step-stay">
                  <div className="mtg-form-heading">
                    <span>03</span>
                    <div>
                      <h3 id="mtg-step-stay" tabIndex={-1}>
                        {copy.sections.stay}
                      </h3>
                      <p>{copy.sections.stayText}</p>
                    </div>
                  </div>

                  <div className="mtg-form-group" data-field="rooms">
                    <label className="mtg-switch-row mtg-switch-row-prominent">
                      <input
                        type="checkbox"
                        checked={inquiry.overnight}
                        onChange={(event) => updateField("overnight", event.target.checked)}
                      />
                      <span>{fields.overnight}</span>
                    </label>
                    {inquiry.overnight && (
                      <div className="mtg-form-grid mtg-form-grid-two">
                        <label className="mtg-form-field">
                          <span>{fields.rooms}</span>
                          <input
                            type="number"
                            min="1"
                            max="313"
                            inputMode="numeric"
                            value={inquiry.rooms}
                            onChange={(event) => updateField("rooms", event.target.value)}
                            aria-invalid={Boolean(errors.rooms)}
                            aria-describedby={errors.rooms ? "tagung-rooms-error" : undefined}
                          />
                        </label>
                        <label className="mtg-form-field">
                          <span>{fields.nights}</span>
                          <select
                            value={inquiry.nights}
                            onChange={(event) => updateField("nights", Number(event.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map((night) => (
                              <option value={night} key={night}>
                                {night}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}
                    {errors.rooms && (
                      <p className="mtg-field-error" id="tagung-rooms-error">
                        {errors.rooms}
                      </p>
                    )}
                  </div>

                  <fieldset className="mtg-form-group">
                    <legend>{fields.catering}</legend>
                    <div className="mtg-choice-grid">
                      {fields.cateringOptions.map((catering) => (
                        <Choice
                          value={catering}
                          checked={inquiry.catering.includes(catering)}
                          onChange={() => toggleListValue("catering", catering)}
                          key={catering}
                        >
                          {catering}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mtg-form-group">
                    <legend>{fields.experience}</legend>
                    <div className="mtg-choice-grid">
                      {fields.experienceOptions.map((experience) => (
                        <Choice
                          value={experience}
                          checked={inquiry.experience.includes(experience)}
                          onChange={() => toggleListValue("experience", experience)}
                          key={experience}
                        >
                          {experience}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>

                  <label className="mtg-switch-row">
                    <input
                      type="checkbox"
                      checked={inquiry.transfer}
                      onChange={(event) => updateField("transfer", event.target.checked)}
                    />
                    <span>{fields.transfer}</span>
                  </label>

                  <label className="mtg-form-field mtg-form-field-full">
                    <span>{fields.accessibility}</span>
                    <textarea
                      rows="3"
                      value={inquiry.accessibility}
                      placeholder={fields.accessibilityPlaceholder}
                      onChange={(event) => updateField("accessibility", event.target.value)}
                    />
                  </label>
                </section>
              )}

              {step === 4 && (
                <section className="mtg-inquiry-step" aria-labelledby="mtg-step-contact">
                  <div className="mtg-form-heading">
                    <span>04</span>
                    <div>
                      <h3 id="mtg-step-contact" tabIndex={-1}>
                        {copy.sections.contact}
                      </h3>
                      <p>{copy.sections.contactText}</p>
                    </div>
                  </div>

                  <div className="mtg-brief-summary" aria-label="Zusammenfassung Ihrer Tagung">
                    <span>
                      <small>Format</small>
                      <strong>{inquiry.format}</strong>
                    </span>
                    <span>
                      <small>Größe</small>
                      <strong>{inquiry.attendees} Personen</strong>
                    </span>
                    <span>
                      <small>Termin</small>
                      <strong>{dateSummary}</strong>
                    </span>
                    <span>
                      <small>Übernachtung</small>
                      <strong>{inquiry.overnight ? `${inquiry.rooms} Zimmer` : "Nein"}</strong>
                    </span>
                  </div>

                  <div className="mtg-form-grid mtg-form-grid-two">
                    <label className="mtg-form-field mtg-form-field-full" data-field="company">
                      <span>{fields.company} *</span>
                      <input
                        type="text"
                        name="company"
                        autoComplete="organization"
                        required
                        value={inquiry.company}
                        onChange={(event) => updateField("company", event.target.value)}
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={errors.company ? "tagung-company-error" : undefined}
                      />
                      {errors.company && (
                        <small className="mtg-field-error" id="tagung-company-error">
                          {errors.company}
                        </small>
                      )}
                    </label>
                    <label className="mtg-form-field" data-field="firstName">
                      <span>{fields.firstName} *</span>
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        value={inquiry.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? "tagung-first-name-error" : undefined}
                      />
                      {errors.firstName && (
                        <small className="mtg-field-error" id="tagung-first-name-error">
                          {errors.firstName}
                        </small>
                      )}
                    </label>
                    <label className="mtg-form-field" data-field="lastName">
                      <span>{fields.lastName} *</span>
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        value={inquiry.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={errors.lastName ? "tagung-last-name-error" : undefined}
                      />
                      {errors.lastName && (
                        <small className="mtg-field-error" id="tagung-last-name-error">
                          {errors.lastName}
                        </small>
                      )}
                    </label>
                    <label className="mtg-form-field" data-field="email">
                      <span>{fields.email} *</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={inquiry.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "tagung-email-error" : undefined}
                      />
                      {errors.email && (
                        <small className="mtg-field-error" id="tagung-email-error">
                          {errors.email}
                        </small>
                      )}
                    </label>
                    <label className="mtg-form-field">
                      <span>{fields.phone}</span>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={inquiry.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                      />
                    </label>
                    <label className="mtg-form-field mtg-form-field-full">
                      <span>{fields.budget}</span>
                      <select
                        name="budget"
                        value={inquiry.budget}
                        onChange={(event) => updateField("budget", event.target.value)}
                      >
                        {fields.budgetOptions.map((budget) => (
                          <option value={budget} key={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mtg-form-field mtg-form-field-full">
                      <span>{fields.notes}</span>
                      <textarea
                        name="notes"
                        rows="4"
                        value={inquiry.notes}
                        placeholder={fields.notesPlaceholder}
                        onChange={(event) => updateField("notes", event.target.value)}
                      />
                    </label>
                  </div>

                  <div data-field="privacy">
                    <label className="mtg-privacy-row">
                      <input
                        type="checkbox"
                        name="privacy"
                        required
                        checked={inquiry.privacy}
                        onChange={(event) => updateField("privacy", event.target.checked)}
                        aria-invalid={Boolean(errors.privacy)}
                        aria-describedby={errors.privacy ? "tagung-privacy-error" : undefined}
                      />
                      <span>
                        {fields.privacy}{" "}
                        <a
                          href="https://tagung-event-rhoen-park-hotel.de/datenschutz/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {fields.privacyLink}
                        </a>
                      </span>
                    </label>
                    {errors.privacy && (
                      <p className="mtg-field-error" id="tagung-privacy-error">
                        {errors.privacy}
                      </p>
                    )}
                  </div>
                </section>
              )}
            </form>
          </div>
        </>
      )}
    </Drawer>
  );
}
