import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DetailOverlay, Drawer, SegmentSelector, StepIndicator } from "@franco/booking-ui";
import {
  ArrowDown,
  ArrowRight,
  Bath,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  ConciergeBell,
  DoorOpen,
  Dumbbell,
  Gem,
  MapPin,
  Menu,
  Mountain,
  Phone,
  UsersRound,
  Utensils,
  Waves
} from "lucide-react";
import "./theme/rhoenpark-theme.css";
import "@franco/booking-ui/styles.css";
import "./styles.css";

const images = {
  hero:
    "https://images.unsplash.com/photo-1755795922314-a74332360877?auto=format&fit=crop&w=2400&q=86",
  suite:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2023/06/RPH_Family_Suite_Deluxe_72dpi_2.jpg",
  apartment:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2022/01/Rhoen-Park-Hotel-Apartment-Deluxe-Wohn-und-Schlafzimmer-72dpi-2048x1365.jpg",
  family:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2026/05/RPH_Familien_Komfort_Apartment_300dpi_3.jpg",
  chalet:
    "https://images.unsplash.com/photo-1755795922314-a74332360877?auto=format&fit=crop&w=1800&q=82",
  dining:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2024/11/RPH-24_DSC_3667_CT_72dpi.jpg",
  meetingRoom:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2022/08/RPH_Tagungsraum_Milseburg.jpg",
  roomRotherKuppe:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2021/08/Bildschirmfoto-2021-08-31-um-13.04.16.jpg",
  roomKreuzberg:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2021/08/Bildschirmfoto-2021-08-31-um-13.19.03.jpg"
};

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } }
};

const strategyLayers = [
  {
    icon: UsersRound,
    number: "01",
    title: "Resort-Kapazität",
    metric: "1000+ Gäste",
    text: "Die operative Stärke des Hauses bleibt das Fundament: große Gruppen, Familien und Events werden souverän getragen."
  },
  {
    icon: ConciergeBell,
    number: "02",
    title: "Private Layer",
    metric: "Host, Suite, Dinner",
    text: "Darüber entsteht eine kuratierte Premium-Schicht mit weniger Wegen, ruhigen Räumen und persönlicher Betreuung."
  },
  {
    icon: Gem,
    number: "03",
    title: "Higher AUV",
    metric: "Upgrade statt Rabatt",
    text: "Der höhere Buchungswert wird über Privilegien, Exklusivität und bessere Anlässe verkauft, nicht über Masse."
  }
];

const strategySteps = [
  "Top-Suiten und Deluxe Apartments als sofort buchbares Luxury-Inventory bündeln",
  "Meeting- und Familien-Journeys sauber trennen, damit beide Zielgruppen präziser kaufen",
  "Chalets als separiertes Flagship-Village für den nächsten Preisanker inszenieren"
];

const meetingFacts = [
  "Tagungsebene RhönUm bis 240 Personen",
  "Event- und Arena-Setups bis 400 Personen",
  "Moderne Technik, Breakout-Räume und kurze Wege",
  "Zentrale Lage in Deutschland mit Natur-Reset in der Rhön"
];

const roomConfigImages = [
  {
    src: images.roomRotherKuppe,
    label: "Boardroom"
  },
  {
    src: images.roomKreuzberg,
    label: "U-Form"
  }
];

const promiseItems = [
  {
    icon: DoorOpen,
    title: "Private Arrival",
    text: "Ruhige Ankunft, separater Check-in und ein erster Moment, der bewusst nicht nach Großbetrieb wirkt."
  },
  {
    icon: ConciergeBell,
    title: "Dedicated Host",
    text: "Ein fester Ansprechpartner kuratiert Meeting, Familienprogramm, Kulinarik und besondere Wünsche."
  },
  {
    icon: Utensils,
    title: "Signature Dining",
    text: "Private Dinner, ruhige Frühstückszeiten und regionale Menüs statt Standard-Buffet-Gefühl."
  },
  {
    icon: Waves,
    title: "Priority Relax",
    text: "Bevorzugte Zeitslots für Wellness, Pool, Fitness und ruhige Rückzugsbereiche im Resort."
  }
];

const stayOptions = [
  {
    detailId: "stay-suite",
    bookingSegment: "executive",
    label: "Sofort buchbar",
    title: "Signature Suites",
    image: images.suite,
    text: "Die besten bestehenden Suiten werden zum ersten Luxury-Line-Inventory mit höherem Preisanker.",
    facts: ["bis ca. 90 m²", "separate Schlafbereiche", "Panoramablick in die Rhön"]
  },
  {
    detailId: "stay-apartment",
    bookingSegment: "family-upgrade",
    label: "Upgrade aus dem Bestand",
    title: "Deluxe Apartments",
    image: images.apartment,
    text: "Für Familien und kleinere Führungsteams, die mehr Raum, Ruhe und Service erwarten.",
    facts: ["Wohn- und Essbereich", "Balkon", "Kitchenette"]
  },
  {
    detailId: "stay-chalet",
    bookingSegment: "chalet",
    label: "Konzeptvorschau",
    title: "Private Chalets",
    image: images.chalet,
    text: "Die geplanten 30 Chalets werden als separiertes Village und emotionales Flagship verkauft.",
    facts: ["separierte Lage", "private Terrasse", "Flagship-Preislogik"]
  }
];

const journeyTracks = {
  meeting: {
    bookingSegment: "executive",
    nav: "Tagungen",
    eyebrow: "Corporate & Tagung",
    title: "Die Tagung wird nicht größer, sie wird wertiger.",
    text:
      "Für Firmen bleibt Rhön Park der zentrale Ort mit hoher Kapazität. Die Luxury Line legt darüber eine private Executive-Ebene: beste Zimmer, ruhige Lounges, kuratierte Dinner und ein Ablauf, der Entscheider ernst nimmt.",
    image: images.meetingRoom,
    icon: Building2,
    cta: "Executive Retreat anfragen",
    stats: ["RhönUm bis 240 Personen", "Event-Setups bis 400 Personen", "Breakouts & moderne Technik"],
    highlights: [
      "Private Arrival für Geschäftsführung und Speaker",
      "Premium Breakouts neben den großen Tagungsflächen RhönUm",
      "Abendessen als Signature Dinner statt Standardgruppe",
      "Naturmodule für Konzentration, Reset und Teamgefühl in zentraler Lage"
    ],
    flow: [
      { label: "Ankunft", detailId: "flow-meeting-arrival" },
      { label: "Meeting", detailId: "flow-meeting-room" },
      { label: "Private Dinner", detailId: "flow-meeting-dinner" },
      { label: "Nature Reset", detailId: "flow-meeting-reset" }
    ]
  },
  family: {
    bookingSegment: "family-upgrade",
    nav: "Familienurlaub",
    eyebrow: "Ferien & Familie",
    title: "Der normale Familienurlaub bleibt aktiv. Die Luxury Line macht ihn ruhiger.",
    text:
      "Das Aktivresort bleibt für Familien der Grund der Reise: Pool, Programm, Kinderangebote, viel Platz. Die Luxury Line ist das Upgrade für Familien, die diesen Nutzen wollen, aber mehr Privatsphäre, bessere Zimmer und weniger Reibung buchen.",
    image: images.family,
    icon: UsersRound,
    cta: "Familien-Upgrade anfragen",
    stats: ["Ferienzeiten", "Suiten & Apartments", "Priority für Aktivbereiche"],
    highlights: [
      "Familienurlaub als normales Resortprodukt bleibt klar erkennbar",
      "Luxury Upgrade mit Suiten, Host und ruhigem Dining",
      "Priority Slots für Pool, Aktivprogramm und entspannte Abläufe",
      "Chalets als künftige Premium-Familienresidenzen"
    ],
    flow: [
      { label: "Ankommen", detailId: "flow-family-arrival" },
      { label: "Aktivtag", detailId: "flow-family-active" },
      { label: "Private Dining", detailId: "flow-family-dining" },
      { label: "Ruhezone", detailId: "flow-family-calm" }
    ]
  }
};

const marketCards = [
  {
    detailId: "market-meeting",
    bookingSegment: "executive",
    icon: Building2,
    title: "Tagungen & Executive Retreats",
    text: "Nicht als Familienhotel erklären, sondern als zentralen Corporate-Rückzugsort mit großer operativer Sicherheit.",
    points: ["Meeting-Logik", "Entscheiderkomfort", "höherer Paketwert"]
  },
  {
    detailId: "market-family",
    bookingSegment: "family",
    icon: UsersRound,
    title: "Normaler Familienurlaub",
    text: "Das bestehende Aktivresort bleibt breit, klar und familiennah. Es muss nicht künstlich luxuriös werden.",
    points: ["Ferienprogramm", "Pool & Aktivitäten", "Familienzimmer"]
  },
  {
    detailId: "market-luxury-family",
    bookingSegment: "family-upgrade",
    icon: Gem,
    title: "Luxury Family Upgrade",
    text: "Für zahlungsbereite Familien entsteht ein separater Upsell: mehr Ruhe, bessere Zimmer, Priority und Host-Service.",
    points: ["Suiten & Chalets", "Private Dining", "weniger Reibung"]
  }
];

const detailPages = {
  "market-meeting": {
    eyebrow: "Corporate & Tagung",
    title: "Executive Retreats mit operativer Resort-Sicherheit.",
    image: images.meetingRoom,
    intro:
      "Für Unternehmen wird Rhön Park als zentrale, verlässliche Tagungsadresse inszeniert. Die Luxury Line ergänzt das um Privatsphäre, bessere Räume und einen Ablauf, der Geschäftsführung, Speaker und Gäste spürbar entlastet.",
    facts: ["RhönUm bis 240 Personen", "Event-Setups bis 400 Personen", "Breakout-Räume", "Zentrale Lage"],
    benefits: [
      "Private Arrival und Speaker-Betreuung",
      "Premium-Zimmer als klarer Upsell zum Tagungspaket",
      "Signature Dinner statt Standardgruppen-Abend",
      "Naturmodule als Ruhe- und Konzentrationsmoment"
    ],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "market-family": {
    eyebrow: "Resort-Familienurlaub",
    title: "Das breite Familienprodukt bleibt klar, aktiv und zugänglich.",
    image: images.family,
    intro:
      "Der normale Familienurlaub bleibt das starke Volumenprodukt. Pool, Aktivprogramm und Familienzimmer werden nicht künstlich luxuriös gemacht, sondern sauber von der Premium-Schicht getrennt.",
    facts: ["Ferienzeiten", "Pool & Aktivprogramm", "Familienzimmer", "Klare Preislogik"],
    benefits: [
      "Keine Verwässerung der Luxury-Line-Positionierung",
      "Einfach verständlicher Einstieg für Familien",
      "Aktivresort bleibt als Hauptnutzen sichtbar",
      "Upgrade-Pfad bleibt jederzeit anschlussfähig"
    ],
    bookingSegment: "family",
    accommodation: "Deluxe Apartment"
  },
  "market-luxury-family": {
    eyebrow: "Luxury Family Upgrade",
    title: "Mehr Ruhe, bessere Räume und weniger Reibung für Familien.",
    image: images.apartment,
    intro:
      "Zahlungsbereite Familien kaufen nicht nur Quadratmeter, sondern Kontrolle über den Aufenthalt: Prioritäten, ruhigere Abläufe, kuratierte Kulinarik und eine Unterkunft, die sich deutlich vom Standardprodukt abhebt.",
    facts: ["Suiten & Apartments", "Priority Slots", "Host-Service", "Private Dining"],
    benefits: [
      "Upgrade ohne das Familienresort zu verlassen",
      "Bessere Zimmer als sofort verständlicher Preisanker",
      "Reservierte Genussmomente statt Buffet-Druck",
      "Chalets als nächster emotionaler Schritt"
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Deluxe Apartment"
  },
  "stay-suite": {
    eyebrow: "Signature Suites",
    title: "Die besten Suiten werden zum ersten buchbaren Luxury-Inventory.",
    image: images.suite,
    intro:
      "Signature Suites setzen sofort einen höheren Preisanker, ohne auf Neubau warten zu müssen. Sie eignen sich für Entscheider, Paare und Familien, die mehr Raum und einen klaren Premium-Rahmen erwarten.",
    facts: ["bis ca. 90 m²", "Panoramablick", "separate Schlafbereiche", "sofort aktivierbar"],
    benefits: [
      "Schnelle Monetarisierung des bestehenden Top-Inventars",
      "Ideal für Executive-Gäste und Premium-Familien",
      "Klares Upgrade gegenüber Standardzimmern",
      "Perfekte Brücke zu Host- und Dining-Privilegien"
    ],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "stay-apartment": {
    eyebrow: "Deluxe Apartments",
    title: "Mehr Raum für Familien und kleinere Führungsteams.",
    image: images.apartment,
    intro:
      "Deluxe Apartments schaffen ein wohnlicheres Premiumgefühl. Sie funktionieren für längere Familienaufenthalte, kleine Leadership-Teams oder Gäste, die im Resort bleiben, aber mehr Ruhe benötigen.",
    facts: ["Wohnbereich", "Balkon", "Kitchenette", "flexibel paketierbar"],
    benefits: [
      "Hoher Nutzwert ohne Chalet-Neubau",
      "Gute Basis für Family-Upgrade-Pakete",
      "Separierbare Schlaf- und Aufenthaltsbereiche",
      "Verständlicher Mehrwert für höhere Buchungswerte"
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Deluxe Apartment"
  },
  "stay-chalet": {
    eyebrow: "Private Chalet Village",
    title: "Die geplanten Chalets werden zum Flagship der Submarke.",
    image: images.chalet,
    intro:
      "Die 30 geplanten Chalets sollten wie ein privates Village verkauft werden: separiert, ruhiger, naturnah und mit eigener Dramaturgie. Damit entsteht der stärkste emotionale Anker der Luxury Line.",
    facts: ["30 geplante Einheiten", "private Terrasse", "separierte Lage", "Flagship-Preislogik"],
    benefits: [
      "Eigenständiges Premium-Narrativ auf dem Resortgelände",
      "Höherer AUV durch Exklusivität und Privatsphäre",
      "Starkes Bildmaterial für Kampagnen und Sales",
      "Ideal für Familien, Retreats und längere Aufenthalte"
    ],
    bookingSegment: "chalet",
    accommodation: "Private Chalet"
  },
  "flow-meeting-arrival": {
    eyebrow: "Journey Step 01",
    title: "Private Arrival nimmt dem Großbetrieb die Kante.",
    image: images.meetingRoom,
    intro:
      "Geschäftsführung, Speaker und VIP-Gäste starten nicht an der normalen Resort-Rezeption, sondern werden sichtbar kuratiert empfangen.",
    facts: ["separater Check-in", "Speaker Briefing", "Gepäck-Handling", "Welcome Ritual"],
    benefits: ["Ruhiger erster Eindruck", "Weniger Wartezeit", "Besserer Auftakt für Entscheider", "Direkter Übergang zum Meeting"],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "flow-meeting-room": {
    eyebrow: "Journey Step 02",
    title: "Das Meeting bleibt leistungsfähig, aber wird hochwertiger gerahmt.",
    image: images.meetingRoom,
    intro:
      "RhönUm und Eventflächen bleiben die operative Basis. Die Luxury Line ergänzt Premium-Breakouts, bessere Pausenmomente und Host-geführte Abläufe.",
    facts: ["RhönUm bis 240", "Event bis 400", "Breakouts", "moderne Technik"],
    benefits: ["Klare Agenda-Führung", "Ruhigere Breakout-Zonen", "Premium-Catering-Pausen", "Weniger Reibung für Organizer"],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "flow-meeting-dinner": {
    eyebrow: "Journey Step 03",
    title: "Private Dinner macht aus der Gruppe einen kuratierten Abend.",
    image: images.dining,
    intro:
      "Der Abend wird nicht als Standardgruppenessen verkauft, sondern als gesetzter Signature-Moment mit regionalem Menü und ruhigem Service.",
    facts: ["Private Dining", "regionale Menüs", "ruhige Zeiten", "Host-Koordination"],
    benefits: ["Mehr Wertigkeit im Paket", "Besserer Sales-Hebel", "Stärkerer Abschluss des Tages", "Geeignet für Geschäftsführung und Teams"],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "flow-meeting-reset": {
    eyebrow: "Journey Step 04",
    title: "Nature Reset übersetzt die Rhön in Konzentration.",
    image: images.hero,
    intro:
      "Natur wird nicht nur Kulisse, sondern Teil der Retreat-Logik: kurze Wege nach draußen, geführte Reset-Momente und Raum für echte Ruhe.",
    facts: ["Biosphärenreservat", "kurze Naturwege", "Team-Reset", "ruhige Slots"],
    benefits: ["Differenzierung gegenüber Stadthotels", "Besserer mentaler Ausgleich", "Stärkerer Erinnerungswert", "Passend für Leadership-Formate"],
    bookingSegment: "executive",
    accommodation: "Signature Suite"
  },
  "flow-family-arrival": {
    eyebrow: "Family Step 01",
    title: "Ankommen ohne Reibung, bevor der Aktivurlaub startet.",
    image: images.family,
    intro:
      "Familien kaufen Entlastung. Die Luxury Line kann Wartezeiten reduzieren und Orientierung geben, bevor Pool, Programm und Resort starten.",
    facts: ["Family Welcome", "Zimmer-Priorität", "Programm-Überblick", "Host-Hilfe"],
    benefits: ["Weniger Stress bei Anreise", "Schneller Überblick", "Bessere Familienzufriedenheit", "Upgrade sofort spürbar"],
    bookingSegment: "family-upgrade",
    accommodation: "Deluxe Apartment"
  },
  "flow-family-active": {
    eyebrow: "Family Step 02",
    title: "Der Aktivtag bleibt breit, bekommt aber Priorität.",
    image: images.family,
    intro:
      "Der normale Familienurlaub bleibt aktiv und lebendig. Premium-Familien bekommen bessere Zeitslots, weniger Reibung und klare Empfehlungen.",
    facts: ["Pool", "Aktivprogramm", "Kinderangebote", "Priority Slots"],
    benefits: ["Aktivresort bleibt Hauptnutzen", "Weniger Planungsstress", "Bessere Tagesrhythmen", "Mehr wahrgenommene Exklusivität"],
    bookingSegment: "family-upgrade",
    accommodation: "Deluxe Apartment"
  },
  "flow-family-dining": {
    eyebrow: "Family Step 03",
    title: "Private Dining macht den Familienabend ruhiger.",
    image: images.dining,
    intro:
      "Familien mit höherem Budget suchen nicht immer mehr Programm, sondern bessere Pausen. Ruhigere Dining-Momente werden zum starken Upgrade-Hebel.",
    facts: ["ruhige Zeiten", "Family Menü", "reservierte Plätze", "Host-Abstimmung"],
    benefits: ["Weniger Buffet-Reibung", "Besserer Abendabschluss", "Eltern fühlen Premiumwert", "Kinder bleiben trotzdem eingebunden"],
    bookingSegment: "family-upgrade",
    accommodation: "Deluxe Apartment"
  },
  "flow-family-calm": {
    eyebrow: "Family Step 04",
    title: "Die Ruhezone macht den Unterschied zum normalen Familienurlaub.",
    image: images.chalet,
    intro:
      "Die Luxury Line muss nicht lauter sein. Sie gewinnt, wenn Familien den vollen Resortnutzen bekommen und trotzdem einen privaten Rückzugsort haben.",
    facts: ["Rückzugsbereich", "Suiten", "Chalets", "Wellness Slots"],
    benefits: ["Mehr Privatsphäre", "Besserer Schlaf- und Tagesrhythmus", "Premiumgefühl ohne Distanz zum Resort", "Starker Chalet-Vorgeschmack"],
    bookingSegment: "chalet",
    accommodation: "Private Chalet"
  }
};

const bookingSegments = [
  {
    id: "executive",
    title: "Executive Retreat",
    text: "Für Tagungen, Leadership-Formate und Entscheidergruppen.",
    icon: Building2,
    guests: "120 Personen",
    occasion: "Tagung / Executive Retreat",
    accommodation: "Signature Suite",
    privileges: ["Private Arrival", "Dedicated Host", "Signature Dining"]
  },
  {
    id: "family",
    title: "Normaler Familienurlaub",
    text: "Für den klassischen Aktivurlaub mit Pool, Programm und Familienzimmer.",
    icon: UsersRound,
    guests: "4 Personen",
    occasion: "Familienurlaub",
    accommodation: "Deluxe Apartment",
    privileges: ["Pool & Aktiv", "Familienprogramm"]
  },
  {
    id: "family-upgrade",
    title: "Luxury Family Upgrade",
    text: "Für Familien, die Aktivresort und mehr Ruhe kombinieren wollen.",
    icon: Gem,
    guests: "4 Personen",
    occasion: "Premium-Familienurlaub",
    accommodation: "Deluxe Apartment",
    privileges: ["Priority Relax", "Dedicated Host", "Signature Dining"]
  },
  {
    id: "chalet",
    title: "Chalet Preview",
    text: "Für das künftige private Chalet Village als Flagship-Anfrage.",
    icon: Mountain,
    guests: "2-6 Personen",
    occasion: "Private Chalet Stay",
    accommodation: "Private Chalet",
    privileges: ["Private Arrival", "Priority Relax", "Private Terrasse"]
  }
];

const privilegeOptions = [
  "Private Arrival",
  "Dedicated Host",
  "Signature Dining",
  "Priority Relax",
  "Pool & Aktiv",
  "Familienprogramm",
  "Private Terrasse"
];

const accommodationOptions = ["Signature Suite", "Deluxe Apartment", "Private Chalet", "Individuell kuratieren"];

const initialBookingData = {
  segment: "executive",
  period: "",
  guests: "120 Personen",
  occasion: "Tagung / Executive Retreat",
  accommodation: "Signature Suite",
  privileges: ["Private Arrival", "Dedicated Host", "Signature Dining"]
};

function Reveal({ children, className = "", delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [journey, setJourney] = useState("meeting");
  const [activeDetail, setActiveDetail] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, shouldReduceMotion ? 1 : 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, shouldReduceMotion ? 0 : 52]);
  const journeyImageY = useTransform(scrollYProgress, [0.46, 0.78], [shouldReduceMotion ? 0 : -22, shouldReduceMotion ? 0 : 26]);
  const journeyImageScale = useTransform(scrollYProgress, [0.46, 0.78], [1.04, shouldReduceMotion ? 1.04 : 1]);
  const activeJourney = journeyTracks[journey];
  const JourneyIcon = activeJourney.icon;
  const activeDetailContent = activeDetail ? detailPages[activeDetail] : null;
  const selectedBookingSegment = bookingSegments.find((segment) => segment.id === bookingData.segment) || bookingSegments[0];
  const segmentSelectorItems = bookingSegments.map((segment) => {
    const Icon = segment.icon;

    return {
      id: segment.id,
      title: segment.title,
      description: segment.text,
      icon: <Icon size={22} aria-hidden="true" />
    };
  });

  function getBookingPreset(segmentId, overrides = {}) {
    const segment = bookingSegments.find((item) => item.id === segmentId) || bookingSegments[0];
    return {
      segment: segment.id,
      guests: segment.guests,
      occasion: segment.occasion,
      accommodation: segment.accommodation,
      privileges: segment.privileges,
      ...overrides
    };
  }

  function openBooking(preset = {}) {
    const nextPreset = getBookingPreset(preset.segment || preset.bookingSegment || bookingData.segment);
    if (preset.accommodation) {
      nextPreset.accommodation = preset.accommodation;
    }
    if (preset.privileges) {
      nextPreset.privileges = preset.privileges;
    }

    setBookingData((current) => ({
      ...current,
      ...nextPreset,
      period: current.period
    }));
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingOpen(true);
  }

  function openDetail(detailId) {
    setActiveDetail(detailId);
  }

  function handleDetailKey(event, detailId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(detailId);
    }
  }

  function closeBooking() {
    setBookingOpen(false);
  }

  function updateBookingField(field, value) {
    setBookingSuccess(false);
    setBookingData((current) => ({ ...current, [field]: value }));
  }

  function selectBookingSegment(segmentId) {
    const segment = bookingSegments.find((item) => item.id === segmentId) || bookingSegments[0];
    setBookingSuccess(false);
    setBookingData((current) => ({
      ...current,
      segment: segment.id,
      guests: segment.guests,
      occasion: segment.occasion,
      accommodation: segment.accommodation,
      privileges: segment.privileges
    }));
  }

  function togglePrivilege(privilege) {
    const exists = bookingData.privileges.includes(privilege);
    updateBookingField(
      "privileges",
      exists ? bookingData.privileges.filter((item) => item !== privilege) : [...bookingData.privileges, privilege]
    );
  }

  function nextBookingStep() {
    setBookingSuccess(false);
    setBookingStep((step) => Math.min(step + 1, 4));
  }

  function previousBookingStep() {
    setBookingSuccess(false);
    setBookingStep((step) => Math.max(step - 1, 1));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <header className="site-header" aria-label="Hauptnavigation">
        <a className="brand" href="#top" aria-label="Rhön Park Luxury Line Start">
          <span className="brand-mark">RPL</span>
          <span>
            <strong>Rhön Park</strong>
            <small>Luxury Line</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Seitennavigation">
          <a href="#erlebnis">Erlebnis</a>
          <a href="#suiten-chalets">Suiten & Chalets</a>
          <a href="#tagungen">Tagungen</a>
          <a href="#familienurlaub">Familienurlaub</a>
        </nav>
        <button className="header-cta" type="button" onClick={() => openBooking({ segment: "executive" })}>
          <CalendarDays size={18} />
          Private Anfrage
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={22} />
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile Seitennavigation">
            <a href="#erlebnis" onClick={() => setMenuOpen(false)}>
              Erlebnis
            </a>
            <a href="#suiten-chalets" onClick={() => setMenuOpen(false)}>
              Suiten & Chalets
            </a>
            <a href="#tagungen" onClick={() => setMenuOpen(false)}>
              Tagungen
            </a>
            <a href="#familienurlaub" onClick={() => setMenuOpen(false)}>
              Familienurlaub
            </a>
            <button
              className="mobile-booking-link"
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBooking({ segment: "executive" });
              }}
            >
              Private Anfrage
            </button>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <motion.img
            className="hero-image"
            src={images.hero}
            alt="Aspiratives Konzeptvisual eines gläsernen Chalets im Wald"
            style={{ scale: heroScale, y: heroY }}
          />
          <div className="hero-scrim" />
          <motion.div className="hero-content" initial="hidden" animate="show" variants={stagger}>
            <motion.p className="eyebrow" variants={reveal}>
              Neue Premium Submarke im Biosphärenreservat Rhön
            </motion.p>
            <motion.h1 id="hero-title" variants={reveal}>
              Rhön Park Luxury Line
            </motion.h1>
            <motion.p className="hero-copy" variants={reveal}>
              Ein privater Rückzugsort innerhalb eines der leistungsfähigsten Resorts in der Mitte Deutschlands:
              für Executive Retreats, hochwertige Familienzeiten und Aufenthalte mit spürbar höherem Anspruch.
            </motion.p>
            <motion.div className="hero-actions" variants={reveal}>
              <button className="button primary" type="button" onClick={() => openBooking({ segment: "executive" })}>
                Private Anfrage
                <ArrowRight size={19} />
              </button>
              <a className="button secondary" href="#erlebnis">
                Luxury Line entdecken
                <ArrowDown size={18} />
              </a>
            </motion.div>
          </motion.div>
          <motion.aside
            className="hero-proof"
            aria-label="Kernargumente"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>50-300 Tagungsgäste</span>
            <span>normaler Familienurlaub bleibt separat</span>
            <span>Luxury Upgrade mit Suiten & Chalets</span>
          </motion.aside>
        </section>

        <section className="intro-band strategy-section" id="erlebnis">
          <motion.div
            className="section-kicker strategy-kicker"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Hotel im Resort</span>
            <span>Privatsphäre, Service, Natur</span>
          </motion.div>

          <div className="strategy-grid">
            <motion.div
              className="strategy-copy"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.24 }}
            >
              <motion.p className="eyebrow dark" variants={reveal}>
                Strategischer Shift
              </motion.p>
              <motion.h2 variants={reveal}>Aus Kapazität wird kuratierte Klasse.</motion.h2>
              <motion.p variants={reveal}>
                Rhön Park bleibt das Haus für große Gruppen, Familien und Events. Die Luxury Line legt darüber eine
                private Premium-Schicht: ruhigere Räume, klarere Privilegien, persönliche Betreuung und reservierte
                Genussmomente, ohne die Stärke des Resorts zu verlieren.
              </motion.p>

              <motion.div className="strategy-timeline" variants={stagger}>
                {strategySteps.map((step, index) => (
                  <motion.div className="strategy-step" key={step} variants={reveal}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="strategy-visual"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="strategy-panel" variants={reveal}>
                <div className="strategy-panel-top">
                  <span>Luxury Architecture</span>
                  <strong>3 Layer</strong>
                </div>
                <div className="strategy-layers">
                  {strategyLayers.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <motion.article className="strategy-layer" key={layer.title} variants={reveal} whileHover={{ y: -8 }}>
                        <div className="strategy-layer-head">
                          <span>{layer.number}</span>
                          <Icon size={24} aria-hidden="true" />
                        </div>
                        <div>
                          <small>{layer.metric}</small>
                          <h3>{layer.title}</h3>
                          <p>{layer.text}</p>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>

              <motion.aside className="strategy-facts" variants={stagger} aria-label="Tagungsfakten Rhön Park">
                {meetingFacts.map((fact) => (
                  <motion.span key={fact} variants={reveal}>
                    {fact}
                  </motion.span>
                ))}
              </motion.aside>
            </motion.div>
          </div>
        </section>

        <section className="market-section" id="tagungen">
          <Reveal className="section-heading">
            <p className="eyebrow dark">Angebotsarchitektur</p>
            <h2>Drei Produkte, damit Luxus nicht mit Familienhotel verwechselt wird.</h2>
          </Reveal>
          <motion.div
            className="market-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {marketCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.article
                  className="market-card detail-trigger"
                  key={card.title}
                  variants={reveal}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} Details öffnen`}
                  onClick={() => openDetail(card.detailId)}
                  onKeyDown={(event) => handleDetailKey(event, card.detailId)}
                >
                  <Icon size={26} aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <ul>
                    {card.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <span className="card-detail-link">
                    Details ansehen
                    <ArrowRight size={16} />
                  </span>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="promise-section">
          <Reveal className="section-heading">
            <p className="eyebrow dark">Luxury-Line-Versprechen</p>
            <h2>Der Mehrpreis wird nicht über Möbel verkauft, sondern über Reibungslosigkeit.</h2>
          </Reveal>
          <motion.div
            className="promise-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.16 }}
          >
            {promiseItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article className="promise-card" key={item.title} variants={reveal} whileHover={{ y: -8 }}>
                  <Icon size={26} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="stay-section" id="suiten-chalets">
          <Reveal className="section-heading center">
            <p className="eyebrow dark">Suiten & Chalet Village</p>
            <h2>Erst Bestand monetarisieren, dann Chalets als Flagship inszenieren.</h2>
            <p>
              Die besten bestehenden Zimmer schaffen sofort buchbare Premium-Erlebnisse. Die Chalets werden als
              separierte Zukunftskategorie zum emotionalen Zentrum der Luxury Line.
            </p>
          </Reveal>
          <motion.div
            className="stay-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {stayOptions.map((option) => (
              <motion.article
                className="stay-card detail-trigger"
                key={option.title}
                variants={reveal}
                role="button"
                tabIndex={0}
                aria-label={`${option.title} Details öffnen`}
                onClick={() => openDetail(option.detailId)}
                onKeyDown={(event) => handleDetailKey(event, option.detailId)}
              >
                <div className="image-wrap">
                  <img
                    src={option.image}
                    alt={
                      option.title === "Private Chalets"
                        ? "Konzeptvisual eines privaten Luxury-Line-Chalets im Wald"
                        : `${option.title} der Rhön Park Luxury Line`
                    }
                    loading="lazy"
                  />
                  <span>{option.label}</span>
                </div>
                <div className="stay-body">
                  <h3>{option.title}</h3>
                  <p>{option.text}</p>
                  <ul>
                    {option.facts.map((fact) => (
                      <li key={fact}>
                        <Check size={16} />
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <span className="card-detail-link dark">
                    Details ansehen
                    <ArrowRight size={16} />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="journey-section" id="familienurlaub">
          <div className="journey-shell">
            <Reveal className="journey-heading">
              <p className="eyebrow">Zwei Journeys</p>
              <h2>Tagungen und Familienurlaub brauchen getrennte Dramaturgien.</h2>
              <p>
                Die Luxury Line ist keine neue Zielgruppe für alle. Sie ist ein Upgrade-System, das je nach Anlass
                anders verkauft wird.
              </p>
            </Reveal>

            <div className="journey-tabs" role="tablist" aria-label="Journey wählen">
              {Object.entries(journeyTracks).map(([key, track]) => (
                <button
                  key={key}
                  className={journey === key ? "active" : ""}
                  type="button"
                  onClick={() => setJourney(key)}
                  role="tab"
                  aria-selected={journey === key}
                >
                  {track.nav}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                className="journey-panel"
                key={journey}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="journey-copy">
                  <JourneyIcon size={32} aria-hidden="true" />
                  <p className="eyebrow">{activeJourney.eyebrow}</p>
                  <h3>{activeJourney.title}</h3>
                  <p>{activeJourney.text}</p>
                  <div className="journey-stats">
                    {activeJourney.stats.map((stat) => (
                      <span key={stat}>{stat}</span>
                    ))}
                  </div>
                  <ul>
                    {activeJourney.highlights.map((item) => (
                      <li key={item}>
                        <ChevronRight size={17} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="text-link light inline-action" type="button" onClick={() => openBooking({ segment: activeJourney.bookingSegment })}>
                    {activeJourney.cta}
                    <ArrowRight size={18} />
                  </button>
                </div>
                <motion.div className="journey-media" whileHover={shouldReduceMotion ? undefined : { y: -6 }}>
                  <motion.img
                    src={activeJourney.image}
                    alt={`${activeJourney.nav} der Rhön Park Luxury Line`}
                    loading="lazy"
                    style={{ y: journeyImageY, scale: journeyImageScale }}
                  />
                  {journey === "meeting" && (
                    <div className="meeting-configs" aria-label="Meeting Config Overlays">
                      {roomConfigImages.map((config) => (
                        <span key={config.label}>
                          <img src={config.src} alt={`RhönUm ${config.label} Konfiguration`} loading="lazy" />
                          <small>{config.label}</small>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="journey-flow">
                    {activeJourney.flow.map((step, index) => (
                      <button
                        type="button"
                        key={step.label}
                        onClick={() => openDetail(step.detailId)}
                        aria-label={`${step.label} Details öffnen`}
                      >
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        {step.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section className="experience-band">
          <Reveal className="experience-copy">
            <p className="eyebrow">Kulinarik & Ruhe</p>
            <h2>Ein Upgrade, das Gäste fühlen, bevor sie den Preis vergleichen.</h2>
            <p>
              Höhere Zahlungsbereitschaft entsteht über klare Privilegien: reservierte Zeiten, bessere Kulinarik,
              ein Host, gute Routinen und die Sicherheit, dass Business oder Familienurlaub reibungslos ablaufen.
            </p>
            <div className="experience-list">
              <span>
                <Utensils size={18} /> Signature Dinner
              </span>
              <span>
                <Dumbbell size={18} /> Fitness & Aktiv
              </span>
              <span>
                <Bath size={18} /> Wellness Slots
              </span>
              <span>
                <Mountain size={18} /> Naturprogramm
              </span>
            </div>
          </Reveal>
          <Reveal className="experience-image">
            <img src={images.dining} alt="Gedeckter Tisch als Symbol für gehobene Rhön Park Kulinarik" loading="lazy" />
          </Reveal>
        </section>

        <section className="value-section">
          <motion.div
            className="metric"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <strong>1</strong>
            <span>Submarke für höhere Preispunkte</span>
          </motion.div>
          <motion.div className="metric" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}>
            <strong>30</strong>
            <span>geplante Chalets als Flagship</span>
          </motion.div>
          <motion.div className="metric" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}>
            <strong>300</strong>
            <span>Premium-Tagungsgäste adressierbar</span>
          </motion.div>
          <motion.div className="metric" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}>
            <strong>1000+</strong>
            <span>Resort-Kapazität als Vertrauenssignal</span>
          </motion.div>
        </section>

        <section className="inquiry-section" id="anfrage">
          <Reveal className="inquiry-copy">
            <p className="eyebrow dark">Private Anfrage</p>
            <h2>Luxury Line als Anfrageprodukt verkaufen.</h2>
            <p>
              Der Prototyp führt nicht direkt in eine Standardbuchung, sondern in ein höherwertiges Gespräch. So kann
              das Team Bedarf, Budget, Saison, Gruppe und passende Privilegien kuratieren.
            </p>
            <div className="contact-stack">
              <a href="tel:+499779910">
                <Phone size={18} />
                09779 910
              </a>
              <a href="mailto:rph@rhoen-park-hotel.de?subject=Anfrage%20Rh%C3%B6n%20Park%20Luxury%20Line">
                <Compass size={18} />
                rph@rhoen-park-hotel.de
              </a>
              <span>
                <MapPin size={18} />
                Rother Kuppe 2, 97647 Hausen-Roth
              </span>
            </div>
          </Reveal>

          <motion.form
            className="inquiry-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.62 }}
          >
            <label>
              Segment
              <select defaultValue="Executive Retreat">
                <option>Executive Retreat</option>
                <option>Normaler Familienurlaub</option>
                <option>Luxury Family Upgrade</option>
                <option>Chalet Preview</option>
              </select>
            </label>
            <label>
              Zeitraum
              <input type="text" placeholder="z. B. September 2026" />
            </label>
            <label>
              Gäste / Teilnehmer
              <input type="text" placeholder="z. B. 120 Personen" />
            </label>
            <label>
              Unterkunft
              <select defaultValue="Signature Suite">
                <option>Signature Suite</option>
                <option>Deluxe Apartment</option>
                <option>Private Chalet</option>
                <option>Individuell kuratieren</option>
              </select>
            </label>
            <label className="full">
              Wunsch
              <textarea placeholder="Kurze Beschreibung des Aufenthalts, der Gruppe oder des gewünschten Niveaus" />
            </label>
            <button className="button primary form-button" type="submit">
              Anfrage vorbereiten
              <ArrowRight size={19} />
            </button>
            <AnimatePresence>
              {submitted && (
                <motion.p
                  className="form-success"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Anfrage vorbereitet. Für den Livebetrieb würde dieses Formular an Verkauf oder Reservierung angebunden.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </section>
      </main>

      <footer className="footer">
        <span>Rhön Park Luxury Line</span>
        <span>Konzept-Prototyp für höherwertige Buchungsanfragen</span>
      </footer>

      <DetailOverlay
        detail={activeDetailContent}
        onClose={() => setActiveDetail(null)}
        onPrimaryAction={(detail) => {
          setActiveDetail(null);
          openBooking({ segment: detail.bookingSegment, accommodation: detail.accommodation });
        }}
      />
      <Drawer
        open={bookingOpen}
        onClose={closeBooking}
        eyebrow="Private Anfrage"
        title="Luxury Line konfigurieren."
        closeLabel="Buchungsfenster schließen"
        footer={
          <>
            <button className="button secondary dark" type="button" onClick={bookingStep === 1 ? closeBooking : previousBookingStep}>
              {bookingStep === 1 ? "Schließen" : "Zurück"}
            </button>
            {bookingStep < 4 ? (
              <button className="button primary" type="button" onClick={nextBookingStep}>
                Weiter
                <ArrowRight size={18} />
              </button>
            ) : (
              <button className="button primary" type="button" onClick={() => setBookingSuccess(true)}>
                Anfrage vorbereiten
                <ArrowRight size={18} />
              </button>
            )}
          </>
        }
      >
        <StepIndicator current={bookingStep} total={4} />

        <div className="booking-body">
          {bookingStep === 1 && (
            <section className="booking-step" aria-label="Segment wählen">
              <h3>Welcher Anlass soll verkauft werden?</h3>
              <SegmentSelector
                segments={segmentSelectorItems}
                value={bookingData.segment}
                onChange={selectBookingSegment}
                columns={1}
              />
            </section>
          )}

          {bookingStep === 2 && (
            <section className="booking-step" aria-label="Rahmendaten">
              <h3>Rahmen der Anfrage</h3>
              <div className="booking-fields">
                <label>
                  Zeitraum
                  <input
                    type="text"
                    value={bookingData.period}
                    onChange={(event) => updateBookingField("period", event.target.value)}
                    placeholder="z. B. September 2026"
                  />
                </label>
                <label>
                  Gäste / Teilnehmer
                  <input
                    type="text"
                    value={bookingData.guests}
                    onChange={(event) => updateBookingField("guests", event.target.value)}
                    placeholder="z. B. 120 Personen"
                  />
                </label>
                <label className="full">
                  Anlass
                  <input
                    type="text"
                    value={bookingData.occasion}
                    onChange={(event) => updateBookingField("occasion", event.target.value)}
                    placeholder="z. B. Executive Retreat"
                  />
                </label>
              </div>
            </section>
          )}

          {bookingStep === 3 && (
            <section className="booking-step" aria-label="Unterkunft und Privilegien">
              <h3>Unterkunft und Privilegien</h3>
              <div className="booking-fields">
                <label className="full">
                  Unterkunft
                  <select value={bookingData.accommodation} onChange={(event) => updateBookingField("accommodation", event.target.value)}>
                    {accommodationOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="privilege-grid">
                {privilegeOptions.map((privilege) => (
                  <label className="privilege-toggle" key={privilege}>
                    <input
                      type="checkbox"
                      checked={bookingData.privileges.includes(privilege)}
                      onChange={() => togglePrivilege(privilege)}
                    />
                    <span>{privilege}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {bookingStep === 4 && (
            <section className="booking-step" aria-label="Zusammenfassung">
              <h3>Anfrage-Zusammenfassung</h3>
              {bookingSuccess && (
                <motion.p className="booking-success" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  Anfrage vorbereitet. Das ist der Moment, den der Direktor live sehen kann: kein Standardformular,
                  sondern eine kuratierte Premium-Anfrage.
                </motion.p>
              )}
              <div className="booking-summary">
                <span>
                  <small>Segment</small>
                  <strong>{selectedBookingSegment.title}</strong>
                </span>
                <span>
                  <small>Zeitraum</small>
                  <strong>{bookingData.period || "Noch offen"}</strong>
                </span>
                <span>
                  <small>Gäste</small>
                  <strong>{bookingData.guests || "Noch offen"}</strong>
                </span>
                <span>
                  <small>Anlass</small>
                  <strong>{bookingData.occasion || "Noch offen"}</strong>
                </span>
                <span>
                  <small>Unterkunft</small>
                  <strong>{bookingData.accommodation}</strong>
                </span>
                <span>
                  <small>Privilegien</small>
                  <strong>{bookingData.privileges.length ? bookingData.privileges.join(", ") : "Individuell kuratieren"}</strong>
                </span>
              </div>
            </section>
          )}
        </div>
      </Drawer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
