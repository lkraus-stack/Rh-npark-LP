import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DetailOverlay, Drawer, SegmentSelector, StepIndicator } from "@franco/booking-ui";
import { track } from "@franco/tracking";
import {
  ArrowDown,
  ArrowRight,
  Bath,
  Building2,
  CalendarDays,
  ChevronRight,
  Compass,
  ConciergeBell,
  DoorOpen,
  Dumbbell,
  Gem,
  Leaf,
  MapPin,
  Menu,
  Moon,
  Mountain,
  Phone,
  UsersRound,
  Utensils,
  Waves,
} from "lucide-react";
import "./theme/rhoenpark-theme.css";
import "@franco/booking-ui/styles.css";
import "./styles.css";

const images = {
  suite:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2023/06/RPH_Family_Suite_Deluxe_72dpi_2.jpg",
  apartment:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2022/01/Rhoen-Park-Hotel-Apartment-Deluxe-Wohn-und-Schlafzimmer-72dpi-2048x1365.jpg",
  family:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2026/05/RPH_Familien_Komfort_Apartment_300dpi_3.jpg",
  dining: "https://www.rhoen-park-hotel.de/wp-content/uploads/2024/11/RPH-24_DSC_3667_CT_72dpi.jpg",
  meetingRoom:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2022/08/RPH_Tagungsraum_Milseburg.jpg",
  roomRotherKuppe:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2021/08/Bildschirmfoto-2021-08-31-um-13.04.16.jpg",
  roomKreuzberg:
    "https://www.rhoen-park-hotel.de/wp-content/uploads/2021/08/Bildschirmfoto-2021-08-31-um-13.19.03.jpg",
};

const generatedAssetRegistry = {
  heroFilm: {
    publicUrl: "/videos/luxury-line-hero.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/luxury-line-hero-poster.jpg",
    alt: "Cinematische Drohnenaufnahme über die Rhön mit Resort-Konzept im Morgenlicht",
    metaDescription:
      "Hero-Video für die Luxury Line: Rhön-Landschaft, Morgenlicht, Nebel und ruhige Resort-Premiumstimmung.",
    bestFor: ["Hero", "Luxury-Line-Einstieg", "Rhön-Natur"],
    avoidFor: ["Kulinarik", "Innenraum", "Wellness-Detail"],
    status: "AI-Konzeptvideo, lokal optimiert",
  },
  chaletStill: {
    publicUrl: "/images/concepts/private-chalet-village.jpg",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/private-chalet-village.jpg",
    alt: "Konzeptbild für geplante private Chalets in der Rhön-Landschaft",
    metaDescription:
      "Konzeptmotiv für RhönVillage: private Chalets, Morgennebel, Waldhänge und ruhige Rhön-Natur.",
    bestFor: ["Private Chalets", "RhönVillage", "Zukunftsvision"],
    avoidFor: ["bestehende Zimmer", "operative Ist-Zustände"],
    status: "AI-Konzeptbild, lokal optimiert",
  },
  wellnessStill: {
    publicUrl: "/images/concepts/priority-wellness.jpg",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/spa-infinity-pool-poster.jpg",
    alt: "Konzeptmotiv für ruhige Wellness-Atmosphäre",
    metaDescription:
      "Prompt-ready Wellnessmotiv für Pool, Sauna oder Ruhebereich; noch nicht lokal generiert.",
    bestFor: ["Wellness", "Spa", "Ruhebereich"],
    avoidFor: ["Kulinarik", "Zimmer", "Tagung"],
    status: "Prompt-ready, nicht generiert",
  },
  natureFilm: {
    publicUrl: "/videos/rhoen-biosphere-sunrise.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/rhoen-biosphere-sunrise-poster.jpg",
    alt: "Drohnenflug über mistige Hügel der Rhön-Biosphäre bei Sonnenaufgang",
    metaDescription:
      "Naturvideo für die Rhön-Biosphäre: Waldhügel, Morgennebel, goldene Stunde und weite Landschaft.",
    bestFor: ["Rhön-Natur", "Biosphäre", "Weitblick"],
    avoidFor: ["Hotelprodukt", "Kulinarik", "Innenraum"],
    status: "AI-Naturvideo, lokal optimiert",
  },
  spaFilm: {
    publicUrl: "/videos/spa-infinity-pool.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/spa-infinity-pool-poster.jpg",
    alt: "Ruhiger Indoor-Infinitypool mit warmem Licht und Waldblick",
    metaDescription:
      "Wellnessvideo für Spa-Erlebnis: stilles Wasser, Dampf, Abendlicht und ruhige Luxus-Atmosphäre.",
    bestFor: ["Wellness", "Pool", "Luxury-Line-Erlebnis"],
    avoidFor: ["Kulinarik", "Frühstück", "Tagung"],
    status: "AI-Wellnessvideo, lokal optimiert",
  },
  outdoorPoolFilm: {
    publicUrl: "/videos/outdoor-infinity-pool-rhoen.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/outdoor-infinity-pool-rhoen-poster.jpg",
    alt: "Sonniger Outdoor-Infinitypool mit Blick auf grüne Rhön-Hügel",
    metaDescription:
      "Outdoor-Wellnessclip für sonnige Pool- und Rhönblick-Inhalte: klares Wasser, warme Tagesstimmung und grüne Hügellandschaft.",
    bestFor: ["Outdoor-Pool", "Wellness", "Rhönblick", "Sommer"],
    avoidFor: ["Indoor-Spa", "Kulinarik", "Frühstück", "Tagung"],
    status: "AI-Wellnessvideo, lokal optimiert",
  },
  suiteFilm: {
    publicUrl: "/videos/suite-forest-view.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/suite-forest-view-poster.jpg",
    alt: "Langsame Kamerafahrt durch eine elegante Suite mit Rhön-Waldblick",
    metaDescription:
      "Suitenvideo für Charles-Suiten: Holz, Leinen, Tageslicht, Wald- und Hügelblick.",
    bestFor: ["Charles-Suiten", "Suite", "Premium-Aufenthalt"],
    avoidFor: ["Kulinarik", "Wellness", "Natur-only"],
    status: "AI-Suitenvideo, lokal optimiert",
  },
  breakfastFilm: {
    publicUrl: "/videos/breakfast-suite-morning.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/breakfast-suite-morning-poster.jpg",
    alt: "Suiten-Frühstück mit Kaffee, Brot, Ei und Beeren im sanften Morgenlicht",
    metaDescription:
      "Frühstücksclip für den Morgen-Tab: helles Tageslicht, ruhiger Tisch, Kaffee, Brot, Eier und regionale Frische.",
    bestFor: ["Frische am Morgen", "Suiten-Frühstück", "Morgenmoment"],
    avoidFor: ["A-la-carte am Abend", "Signature Dinner", "Candlelight"],
    status: "AI-Frühstücksvideo, lokal optimiert",
  },
  diningFilm: {
    publicUrl: "/videos/dining-signature-dish.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/dining-signature-dish-poster.jpg",
    alt: "Fein angerichtetes A-la-carte-Gericht bei warmem Abendlicht",
    metaDescription:
      "Dinnerclip für A-la-carte am Abend: warmes Licht, Tellergericht, Kerzenstimmung und Fine-Dining-Anmutung.",
    bestFor: ["A-la-carte am Abend", "Dinner", "RhönEck"],
    avoidFor: ["Frische am Morgen", "Suiten-Frühstück", "Signature Dining"],
    status: "AI-Kulinarikvideo, lokal optimiert",
  },
  signatureDiningFilm: {
    publicUrl: "/videos/signature-chefs-table.mp4",
    manifestPath: "/generated/asset-manifest.json",
    fallback: "/images/concepts/signature-chefs-table-poster.jpg",
    alt: "Privater Signature-Dining-Moment mit Menükarte, Kristallglas und Kerzenlicht",
    metaDescription:
      "Signature-Clip für Chef's Table und besondere Anlässe: privater Tisch, Menükarte, Pairing-Glas und ruhige Abenddramaturgie.",
    bestFor: ["Signature Dining", "Chef's Table", "besondere Anlässe"],
    avoidFor: ["Frische am Morgen", "Suiten-Frühstück", "Tageslicht-Frühstück"],
    status: "AI-Kulinarikvideo, lokal optimiert",
  },
};

const PROPERTY_ID = "rhoenpark-luxury";
const PROPERTY_SLUG = "rhoenpark";
const FLOW_MODE = "inquiry";
const BOOKING_STORAGE_KEY = `franco-booking-${PROPERTY_ID}-${FLOW_MODE}`;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const strategyLayers = [
  {
    icon: UsersRound,
    number: "01",
    title: "Resort-Basis",
    metric: "Aktivresort als Fundament",
    text: "Familien, Gruppen und Tagungen behalten die Resort-Stärke: Kapazität, Programm, kurze Wege.",
  },
  {
    icon: ConciergeBell,
    number: "02",
    title: "Luxus im Hotel",
    metric: "Charles-Suiten als dritte Stufe",
    text: "Charles-Suiten werden als eigene Premiumwelt geführt: ruhiger, persönlicher, sofort erzählbar.",
  },
  {
    icon: Gem,
    number: "03",
    title: "Private Naturresidenz",
    metric: "RhönVillage in Planung",
    text: "RhönVillage bleibt eine klare Zukunftsvision: private Rückzugsorte in der geschützten Rhön-Natur.",
  },
];

const strategySteps = [
  "Charles-Suiten als eigenes Premiumprodukt führen",
  "Kulinarik und Wellness früh als Wertanker zeigen",
  "RhönVillage nur als klare Zukunftsvision erzählen",
];

const roomConfigImages = [
  {
    src: images.roomRotherKuppe,
    label: "Boardroom",
  },
  {
    src: images.roomKreuzberg,
    label: "U-Form",
  },
];

const promiseItems = [
  {
    icon: DoorOpen,
    step: "01",
    title: "Private Ankunft",
    text: "Ruhige Orientierung, flexible Anreise und ein erster Moment, der die Premium-Schicht sofort spürbar macht.",
  },
  {
    icon: ConciergeBell,
    step: "02",
    title: "Persönlicher Ansprechpartner",
    text: "Ein fester Kontakt führt durch Aufenthalt, Kulinarik, ruhige Zeiten und besondere Wünsche.",
  },
  {
    icon: Utensils,
    step: "03",
    title: "Suiten-Frühstück",
    text: "Rhöner Frische, A-la-carte-Momente und ein Frühstücksrahmen, der zur Suite passt.",
  },
  {
    icon: Waves,
    step: "04",
    title: "Ruhige SPA-Zeiten",
    text: "Priorisierte Wohlfühlmomente für Gäste, die das Resort nutzen und dennoch mehr Ruhe erwarten.",
  },
];

const stayOptions = [
  {
    detailId: "stay-charles-suite",
    bookingSegment: "executive",
    label: "Luxus im Hotel",
    title: "Charles-Suiten",
    subtitle: "Die neue Premiumstufe im Hauptgebäude",
    image: images.suite,
    text: "Die Charles-Suiten werden nicht als größere Zimmer erzählt, sondern als eigene Premiumwelt im Hotel: mit Naturblick, separatem Wohn-/Schlafbereich, hochwertigen Materialien und persönlicher Begleitung.",
    facts: [
      "ca. 350-500 Euro/Nacht geplant",
      "schneller verfügbar als Chalets",
      "Suiten-Frühstück oder A-la-carte",
    ],
    rail: ["Naturblick", "Wohn-/Schlafbereich", "SPA-Priorität", "flexible Anreise"],
    cta: "Charles-Suite anfragen",
  },
  {
    detailId: "stay-apartment",
    bookingSegment: "family-upgrade",
    label: "Upgrade aus dem Bestand",
    title: "Premium Apartments",
    subtitle: "Mehr Raum, bessere Abläufe",
    image: images.apartment,
    text: "Premium Apartments sind das großzügige Upgrade für Familien, Großeltern oder kleine Leadership-Gruppen, die das Resort nutzen und trotzdem mehr Ruhe, Wohnlichkeit und Kontrolle im Tagesablauf brauchen.",
    facts: ["Familien & Großeltern", "kleine Leadership-Gruppen", "mehr Raum im Bestand"],
    rail: ["Wohnbereich", "Balkon", "Kitchenette", "ruhigere Abläufe"],
    cta: "Apartment-Upgrade anfragen",
  },
  {
    detailId: "stay-chalet",
    bookingSegment: "chalet",
    label: "Konzeptvorschau",
    title: "Private Chalets / RhönVillage",
    subtitle: "Zukünftige Naturresidenzen",
    image: generatedAssetRegistry.chaletStill.fallback,
    text: "RhönVillage ist die künftige exklusive Naturkategorie: separierter Rückzugsort, private Terrasse, weiter Blick und Sternenhimmel. In der UI bleibt sie bewusst als Konzeptvorschau gekennzeichnet.",
    facts: ["zukünftige Naturkategorie", "Terrasse & Weitblick", "klar als Konzept markiert"],
    rail: ["separiert", "private Terrasse", "Sternenhimmel", "Rhönblick"],
    cta: "RhönVillage vormerken",
    featured: true,
  },
];

const natureSignals = [
  {
    id: "biosphere",
    icon: Leaf,
    title: "Biosphäre",
    signal: "UNESCO-Biosphärenreservat Rhön",
    text: "Der Aufenthalt liegt im Kontext der geschützten Rhön-Natur: ruhig, weit, regional und glaubwürdig statt austauschbar.",
  },
  {
    id: "air",
    icon: Waves,
    title: "Höhenluft",
    signal: "spürbar frische Rhön-Luft",
    text: "Klare Höhenluft wird sinnlich erzählt, ohne medizinische Versprechen: morgens am Hang, nach dem Meeting, vor dem Dinner.",
  },
  {
    id: "view",
    icon: Compass,
    title: "Weitblick",
    signal: "Land der offenen Fernen",
    text: "Weite Sicht und offene Landschaft geben der Luxury Line eine stille Qualität, die Stadthotels kaum nachbauen können.",
  },
  {
    id: "stars",
    icon: Moon,
    title: "Sternenpark",
    signal: "ruhige Nachtlandschaft",
    text: "Der Sternenpark Rhön liefert den emotionalen Abendanker: leise Terrasse, dunkler Himmel, ein Aufenthalt mit Abstand.",
  },
];

const culinarySteps = [
  {
    id: "morning",
    icon: Utensils,
    label: "01",
    title: "Frische am Morgen",
    kicker: "Suiten-Frühstück",
    mediaKey: "breakfastFilm",
    text: "Rhöner Produkte, frische Eierstation und ein A-la-carte- oder Suiten-Frühstück machen den ersten Genussmoment premiumfähig.",
    facts: ["Rhöner Frische", "Suiten-Frühstück", "A-la-carte"],
    service: [
      { label: "Zeit", value: "ruhiger Morgen" },
      { label: "Ort", value: "Suite oder RhönEck" },
      { label: "Ton", value: "hell & regional" },
    ],
    mediaLabel: "Morning Ritual",
    mediaMeta: "Frühstück, Tageslicht, regionale Frische",
    ctaLabel: "Frühstücksrahmen anfragen",
  },
  {
    id: "evening",
    icon: ConciergeBell,
    label: "02",
    title: "A-la-carte am Abend",
    kicker: "Ruhiger Abend",
    mediaKey: "diningFilm",
    text: "Ein Abend im RhönEck wird als ruhiger Genussmoment erzählt: reserviert, regional, weniger Reibung, mehr Aufenthalt.",
    facts: ["RhönEck", "regionale Zutaten", "reservierter Moment"],
    service: [
      { label: "Zeit", value: "nach Spa oder Meeting" },
      { label: "Ort", value: "reservierter Tisch" },
      { label: "Ton", value: "warm & ruhig" },
    ],
    mediaLabel: "A-la-carte",
    mediaMeta: "Tellergericht, Kerzenlicht, Abendruhe",
    ctaLabel: "Dinner-Moment anfragen",
  },
  {
    id: "signature",
    icon: Gem,
    label: "03",
    title: "Signature Dining",
    kicker: "Besondere Anlässe",
    mediaKey: "signatureDiningFilm",
    text: "Signature Dinner oder optionaler Chef's Table geben Charles-Suiten und Chalets den kulinarischen Anker, den Premiumpreise brauchen.",
    facts: ["Signature Dinner", "Chef's Table optional", "Chalet- & Suiten-Gäste"],
    service: [
      { label: "Anlass", value: "Jubiläum & Retreat" },
      { label: "Format", value: "Chef's Table optional" },
      { label: "Ton", value: "exklusiv & persönlich" },
    ],
    mediaLabel: "Signature Moment",
    mediaMeta: "privater Tisch, Pairing, Menüdramaturgie",
    ctaLabel: "Signature Dining anfragen",
  },
];

const journeyTracks = {
  meeting: {
    bookingSegment: "executive",
    nav: "Tagungen",
    eyebrow: "Corporate & Tagung",
    title: "Board-Level Retreat statt Tagungsbetrieb.",
    text: "Für Unternehmen bleibt Rhön Park der zentrale Ort mit hoher Kapazität. Die Luxury Line übersetzt diese Stärke in eine ruhigere Executive-Ebene: beste Zimmer, klare Hosts, Premium-Breakouts und Abende, die wertig und persönlich geführt werden.",
    image: images.meetingRoom,
    icon: Building2,
    cta: "Retreat anfragen",
    stats: [
      "RhönUm bis 240 Personen",
      "Event-Setups bis 400 Personen",
      "Breakouts & moderne Technik",
    ],
    highlights: [
      "Private Ankunft für Geschäftsführung, Speaker und Key Accounts",
      "Premium Breakouts neben den großen RhönUm-Flächen",
      "Signature Dinner als wertiger, regionaler Abschluss",
      "Natur-Reset für Konzentration, Abstand und Teamgefühl",
    ],
    flow: [
      { label: "Ankunft", detailId: "flow-meeting-arrival" },
      { label: "Meeting", detailId: "flow-meeting-room" },
      { label: "Private Dinner", detailId: "flow-meeting-dinner" },
      { label: "Rhön-Reset", detailId: "flow-meeting-reset" },
    ],
  },
  family: {
    bookingSegment: "family-upgrade",
    nav: "Familienurlaub",
    eyebrow: "Ferien & Familie",
    title: "Aktivresort nutzen, privat wohnen.",
    text: "Der normale Familienurlaub bleibt lebendig: Pool, Programm, Kinderangebote, viel Platz. Die Premium Family Residence richtet sich an Familien, die genau diesen Nutzen wollen, aber privater wohnen, ruhiger essen und weniger Reibung im Tagesablauf kaufen.",
    image: images.family,
    icon: UsersRound,
    cta: "Familien-Upgrade anfragen",
    stats: ["Ferienzeiten", "Suiten & Apartments", "Priority für Aktivbereiche"],
    highlights: [
      "Normaler Familienurlaub bleibt als breites Resortprodukt klar erkennbar",
      "Premium Family Residence mit Charles-Suite, Host und ruhigem Dining",
      "Priority Slots für Pool, Aktivprogramm und entspanntere Abläufe",
      "Private Chalets als geplante Premium Family Residence",
    ],
    flow: [
      { label: "Ankommen", detailId: "flow-family-arrival" },
      { label: "Aktivtag", detailId: "flow-family-active" },
      { label: "Private Dining", detailId: "flow-family-dining" },
      { label: "Ruhezone", detailId: "flow-family-calm" },
    ],
  },
};

const detailPages = {
  "market-meeting": {
    eyebrow: "Corporate & Tagung",
    title: "Executive Retreats mit verlässlicher Resort-Struktur.",
    image: images.meetingRoom,
    intro:
      "Für Unternehmen wird Rhön Park als zentrale, verlässliche Tagungsadresse inszeniert. Die Luxury Line ergänzt das um Privatsphäre, bessere Räume und einen Ablauf, der Geschäftsführung, Speaker und Gäste spürbar entlastet.",
    facts: [
      "RhönUm bis 240 Personen",
      "Event-Setups bis 400 Personen",
      "Breakout-Räume",
      "Zentrale Lage",
    ],
    benefits: [
      "Private Ankunft und Speaker-Betreuung",
      "Premium-Zimmer als klare Erweiterung zum Tagungspaket",
      "Signature Dinner mit regionalem Genussrahmen",
      "Naturmodule als Ruhe- und Konzentrationsmoment",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "market-family": {
    eyebrow: "Resort-Familienurlaub",
    title: "Das breite Familienprodukt bleibt klar, aktiv und zugänglich.",
    image: images.family,
    intro:
      "Der normale Familienurlaub bleibt das starke Volumenprodukt. Pool, Aktivprogramm und Familienzimmer werden nicht künstlich luxuriös gemacht, sondern sauber von der Premium-Schicht getrennt.",
    facts: ["Ferienzeiten", "Pool & Aktivprogramm", "Familienzimmer", "Klare Angebotslogik"],
    benefits: [
      "Keine Verwässerung der Luxury-Line-Positionierung",
      "Einfach verständlicher Einstieg für Familien",
      "Aktivresort bleibt als Hauptnutzen sichtbar",
      "Upgrade-Pfad bleibt jederzeit anschlussfähig",
    ],
    bookingSegment: "family",
    accommodation: "Familienzimmer / Apartment",
  },
  "market-luxury-family": {
    eyebrow: "Premium Family Residence",
    title: "Privater, ruhiger Familienaufenthalt mit Resort-Anbindung.",
    image: images.apartment,
    intro:
      "Familien mit höherem Anspruch buchen nicht nur Quadratmeter, sondern einen ruhigeren Aufenthaltsrahmen: Prioritäten, entspanntere Abläufe, kuratierte Kulinarik und eine Unterkunft, die sich deutlich vom Standardprodukt abhebt.",
    facts: ["Suiten & Apartments", "Priority Slots", "Host-Service", "Private Dining"],
    benefits: [
      "Premium-Erweiterung ohne das Familienresort zu verlassen",
      "Bessere Zimmer als sofort verständlicher Premiumwert",
      "Reservierte Genussmomente mit mehr Ruhe im Tagesablauf",
      "Chalets als nächster emotionaler Schritt",
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Premium Apartment",
  },
  "stay-charles-suite": {
    eyebrow: "Charles-Suiten",
    title: "Luxus im Hauptgebäude, nicht einfach eine größere Zimmerkategorie.",
    image: images.suite,
    intro:
      "Die Charles-Suiten schließen die Lücke zwischen Standardzimmern und künftigen Chalets. Sie sind als eigene Premiumwelt im Hauptgebäude gedacht: wertiger, ruhiger, kulinarisch stärker und schneller verfügbar als ein Neubauprodukt.",
    facts: ["ca. 350-500 Euro/Nacht geplant", "Hauptgebäude", "Naturblick", "Suiten-Frühstück"],
    benefits: [
      "Separater Wohn- und Schlafbereich als spürbarer Premiumwert",
      "Persönlicher Ansprechpartner für Anreise, Genussmomente und ruhige Zeiten",
      "A-la-carte-Frühstück oder Suiten-Frühstück als glaubwürdiger Preisanker",
      "SPA-Priorität und flexible Anreise als eigener Leistungsrahmen",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "stay-apartment": {
    eyebrow: "Premium Apartments",
    title: "Großzügiges Upgrade aus dem Bestand.",
    image: images.apartment,
    intro:
      "Premium Apartments sind die glaubwürdige Zwischenlösung für Gäste, die mehr Raum und bessere Abläufe brauchen, aber nicht zwingend eine separate Naturresidenz suchen.",
    facts: ["Wohnbereich", "Balkon", "Kitchenette", "Familien & kleine Gruppen"],
    benefits: [
      "Mehr Raum für Familien, Großeltern oder kleine Leadership-Gruppen",
      "Gute Basis für Family-Upgrade-Pakete mit weniger Reibung",
      "Separierbare Schlaf- und Aufenthaltsbereiche",
      "Verständlicher Mehrwert aus dem bestehenden Resort-Inventar",
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Premium Apartment",
  },
  "stay-chalet": {
    eyebrow: "Private Chalets / RhönVillage",
    title: "Die künftige exklusive Naturkategorie bleibt klar als Konzept markiert.",
    image: generatedAssetRegistry.chaletStill.fallback,
    intro:
      "RhönVillage erzählt die geplanten Private Chalets als separierten Rückzugsort mit Terrasse, Weitblick und ruhiger Nachtlandschaft. Die Darstellung bleibt bewusst Konzeptvorschau, solange die Anlage nicht freigegeben ist.",
    facts: ["zukünftige Naturkategorie", "private Terrasse", "weiter Blick", "Konzeptvorschau"],
    benefits: [
      "Eigenständige Premium-Erzählung im Kontext der Rhön-Natur",
      "Mehr Premiumwert durch Exklusivität und Privatsphäre",
      "Sternenhimmel und Terrasse als emotionale Signale",
      "Ideal für Familien, Retreats und längere Aufenthalte in Planung",
    ],
    bookingSegment: "chalet",
    accommodation: "Private Chalet / RhönVillage",
  },
  "flow-meeting-arrival": {
    eyebrow: "Journey Step 01",
    title: "Private Ankunft macht den ersten Moment ruhig und persönlich.",
    image: images.meetingRoom,
    intro:
      "Geschäftsführung, Speaker und VIP-Gäste starten nicht an der normalen Resort-Rezeption, sondern werden sichtbar kuratiert empfangen.",
    facts: ["separater Check-in", "Speaker Briefing", "Gepäck-Handling", "Welcome Ritual"],
    benefits: [
      "Ruhiger erster Eindruck",
      "Weniger Wartezeit",
      "Besserer Auftakt für Entscheider",
      "Direkter Übergang zum Meeting",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "flow-meeting-room": {
    eyebrow: "Journey Step 02",
    title: "Das Meeting bleibt leistungsfähig, aber wird hochwertiger gerahmt.",
    image: images.meetingRoom,
    intro:
      "RhönUm und Eventflächen bleiben die operative Basis. Die Luxury Line ergänzt Premium-Breakouts, bessere Pausenmomente und Host-geführte Abläufe.",
    facts: ["RhönUm bis 240", "Event bis 400", "Breakouts", "moderne Technik"],
    benefits: [
      "Klare Agenda-Führung",
      "Ruhigere Breakout-Zonen",
      "Premium-Catering-Pausen",
      "Weniger Reibung für Organizer",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "flow-meeting-dinner": {
    eyebrow: "Journey Step 03",
    title: "Private Dinner macht aus der Gruppe einen kuratierten Abend.",
    image: generatedAssetRegistry.signatureDiningFilm.fallback,
    intro:
      "Der Abend wird als gesetzter Signature-Moment mit regionalem Menü, ruhigem Service und wertigem Rhythmus erzählt.",
    facts: ["Private Dining", "regionale Menüs", "ruhige Zeiten", "Host-Koordination"],
    benefits: [
      "Mehr Wertigkeit im Paket",
      "Besserer Sales-Hebel",
      "Stärkerer Abschluss des Tages",
      "Geeignet für Geschäftsführung und Teams",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "flow-meeting-reset": {
    eyebrow: "Journey Step 04",
    title: "Rhön-Reset übersetzt die Landschaft in Konzentration.",
    image: generatedAssetRegistry.natureFilm.fallback,
    intro:
      "Natur wird nicht nur Kulisse, sondern Teil der Retreat-Logik: kurze Wege nach draußen, geführte Reset-Momente und Raum für echte Ruhe.",
    facts: ["UNESCO-Biosphärenreservat Rhön", "kurze Naturwege", "Team-Reset", "ruhige Slots"],
    benefits: [
      "Differenzierung gegenüber Stadthotels",
      "Besserer mentaler Ausgleich",
      "Stärkerer Erinnerungswert",
      "Passend für Leadership-Formate",
    ],
    bookingSegment: "executive",
    accommodation: "Charles-Suite",
  },
  "flow-family-arrival": {
    eyebrow: "Familien-Step 01",
    title: "Ankommen ohne Reibung, bevor der Aktivurlaub startet.",
    image: images.family,
    intro:
      "Familien kaufen Entlastung. Die Luxury Line kann Wartezeiten reduzieren und Orientierung geben, bevor Pool, Programm und Resort starten.",
    facts: ["Familien-Welcome", "Zimmer-Priorität", "Programm-Überblick", "Host-Hilfe"],
    benefits: [
      "Weniger Stress bei Anreise",
      "Schneller Überblick",
      "Bessere Familienzufriedenheit",
      "Upgrade sofort spürbar",
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Premium Apartment",
  },
  "flow-family-active": {
    eyebrow: "Familien-Step 02",
    title: "Der Aktivtag bleibt breit, bekommt aber Priorität.",
    image: images.family,
    intro:
      "Der normale Familienurlaub bleibt aktiv und lebendig. Premium-Familien bekommen bessere Zeitslots, weniger Reibung und klare Empfehlungen.",
    facts: ["Pool", "Aktivprogramm", "Kinderangebote", "Priority Slots"],
    benefits: [
      "Aktivresort bleibt Hauptnutzen",
      "Weniger Planungsstress",
      "Bessere Tagesrhythmen",
      "Mehr wahrgenommene Exklusivität",
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Premium Apartment",
  },
  "flow-family-dining": {
    eyebrow: "Familien-Step 03",
    title: "Private Dining macht den Familienabend ruhiger.",
    image: generatedAssetRegistry.diningFilm.fallback,
    intro:
      "Familien mit höherem Budget suchen nicht immer mehr Programm, sondern bessere Pausen. Ruhigere Dining-Momente werden zum starken Upgrade-Hebel.",
    facts: ["ruhige Zeiten", "Familienmenü", "reservierte Plätze", "Host-Abstimmung"],
    benefits: [
      "Mehr Ruhe beim Abendessen",
      "Besserer Abendabschluss",
      "Eltern spüren Premiumwert",
      "Kinder bleiben trotzdem eingebunden",
    ],
    bookingSegment: "family-upgrade",
    accommodation: "Premium Apartment",
  },
  "flow-family-calm": {
    eyebrow: "Familien-Step 04",
    title: "Die Ruhezone macht den Unterschied zum normalen Familienurlaub.",
    image: generatedAssetRegistry.chaletStill.fallback,
    intro:
      "Die Luxury Line muss nicht lauter sein. Sie gewinnt, wenn Familien den vollen Resortnutzen bekommen und trotzdem einen privaten Rückzugsort haben.",
    facts: ["Rückzugsbereich", "Suiten", "RhönVillage", "Wellness Slots"],
    benefits: [
      "Mehr Privatsphäre",
      "Besserer Schlaf- und Tagesrhythmus",
      "Premiumgefühl ohne Distanz zum Resort",
      "Starker Chalet-Vorgeschmack",
    ],
    bookingSegment: "chalet",
    accommodation: "Private Chalet / RhönVillage",
  },
};

const bookingSegments = [
  {
    id: "executive",
    title: "Executive Retreat",
    text: "Für Tagungen, Leadership-Formate und Entscheidergruppen mit Charles-Suite als Premiumanker.",
    icon: Building2,
    guests: "120 Personen",
    occasion: "Tagung / Executive Retreat",
    accommodation: "Charles-Suite",
    privileges: ["Private Ankunft", "Persönlicher Ansprechpartner", "Signature Dinner"],
  },
  {
    id: "family",
    title: "Normaler Familienurlaub",
    text: "Für den klassischen Aktivurlaub mit Pool, Programm und Familienzimmer.",
    icon: UsersRound,
    guests: "4 Personen",
    occasion: "Familienurlaub",
    accommodation: "Familienzimmer / Apartment",
    privileges: ["Pool & Aktiv", "Familienprogramm"],
  },
  {
    id: "family-upgrade",
    title: "Premium Family Residence",
    text: "Für Familien, die Aktivresort und private Ruhe kombinieren wollen.",
    icon: Gem,
    guests: "4 Personen",
    occasion: "Premium Family Residence",
    accommodation: "Premium Apartment",
    privileges: ["Ruhige SPA-Zeiten", "Persönlicher Ansprechpartner", "Suiten-Frühstück"],
  },
  {
    id: "chalet",
    title: "RhönVillage-Konzeptvorschau",
    text: "Für die künftigen Private Chalets als geplantes Highlight der Luxury Line.",
    icon: Mountain,
    guests: "2-6 Personen",
    occasion: "Private Chalet / RhönVillage",
    accommodation: "Private Chalet / RhönVillage",
    privileges: ["Private Ankunft", "Ruhige SPA-Zeiten", "Private Terrasse"],
  },
];

const privilegeOptions = [
  "Private Ankunft",
  "Persönlicher Ansprechpartner",
  "Suiten-Frühstück",
  "Signature Dining",
  "Signature Dinner",
  "Ruhige SPA-Zeiten",
  "Pool & Aktiv",
  "Familienprogramm",
  "Private Terrasse",
  "Chef's Table optional",
];

const accommodationOptions = [
  "Charles-Suite",
  "Familienzimmer / Apartment",
  "Premium Apartment",
  "Private Chalet / RhönVillage",
  "Individuell kuratieren",
];

const accommodationAliases = {
  "Signature Suite": "Charles-Suite",
  "Deluxe Apartment": "Premium Apartment",
  "Private Chalet": "Private Chalet / RhönVillage",
};

const bookingStepLabels = [
  "Anlass",
  "Zeitraum und Gäste",
  "Unterkunft und Privilegien",
  "Zusammenfassung",
];

const initialBookingData = {
  segment: "executive",
  period: "",
  guests: "120 Personen",
  occasion: "Tagung / Executive Retreat",
  accommodation: "Charles-Suite",
  privileges: ["Private Ankunft", "Persönlicher Ansprechpartner", "Signature Dinner"],
};

const segmentAliases = {
  meeting: "executive",
  tagung: "executive",
  executive: "executive",
  family: "family",
  familienurlaub: "family",
  "family-upgrade": "family-upgrade",
  premium: "family-upgrade",
  chalet: "chalet",
  rhoenvillage: "chalet",
  rhönvillage: "chalet",
};

const roomPresets = {
  "charles-suite": { segment: "executive", accommodation: "Charles-Suite" },
  "signature-suite": { segment: "executive", accommodation: "Charles-Suite" },
  "premium-apartment": { segment: "family-upgrade", accommodation: "Premium Apartment" },
  apartment: { segment: "family-upgrade", accommodation: "Premium Apartment" },
  "private-chalet": { segment: "chalet", accommodation: "Private Chalet / RhönVillage" },
  chalet: { segment: "chalet", accommodation: "Private Chalet / RhönVillage" },
  rhoenvillage: { segment: "chalet", accommodation: "Private Chalet / RhönVillage" },
  rhönvillage: { segment: "chalet", accommodation: "Private Chalet / RhönVillage" },
};

function normalizeSegment(segmentId) {
  if (!segmentId) return null;
  return segmentAliases[String(segmentId).toLowerCase()] || null;
}

function getBookingPreset(segmentId, overrides = {}) {
  const normalizedSegmentId = normalizeSegment(segmentId) || "executive";
  const segment =
    bookingSegments.find((item) => item.id === normalizedSegmentId) || bookingSegments[0];
  return {
    segment: segment.id,
    guests: segment.guests,
    occasion: segment.occasion,
    accommodation: segment.accommodation,
    privileges: segment.privileges,
    ...overrides,
  };
}

function getStoredBookingData() {
  if (typeof window === "undefined") return initialBookingData;

  try {
    const stored = window.localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!stored) return initialBookingData;
    const parsed = JSON.parse(stored);

    const accommodation =
      accommodationAliases[parsed.accommodation] ||
      parsed.accommodation ||
      initialBookingData.accommodation;
    const segment = normalizeSegment(parsed.segment) || initialBookingData.segment;

    return {
      ...initialBookingData,
      ...parsed,
      segment,
      accommodation: accommodationOptions.includes(accommodation)
        ? accommodation
        : initialBookingData.accommodation,
      privileges: Array.isArray(parsed.privileges)
        ? parsed.privileges
        : initialBookingData.privileges,
    };
  } catch {
    return initialBookingData;
  }
}

function getEntryPresetFromUrl() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const flow = params.get("flow");
  if (flow !== FLOW_MODE) return null;

  const room = params.get("room");
  const roomPreset = room ? roomPresets[room.toLowerCase()] : null;
  const segment = normalizeSegment(params.get("segment")) || roomPreset?.segment || "executive";
  const sourceSection = params.get("source_section") || "url";

  return getBookingPreset(segment, {
    ...(roomPreset || {}),
    sourceSection,
  });
}

function getInitialBookingData(urlPreset) {
  const stored = getStoredBookingData();
  if (!urlPreset) return stored;
  const { sourceSection, ...presetData } = urlPreset;
  void sourceSection;

  return {
    ...stored,
    ...presetData,
    period: stored.period,
  };
}

function writeInquiryUrl({ segment, accommodation, sourceSection = "page" }) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("flow", FLOW_MODE);
  url.searchParams.set("segment", segment);
  const roomEntry = Object.entries(roomPresets).find(
    ([, preset]) => preset.accommodation === accommodation && preset.segment === segment,
  );
  if (roomEntry) {
    url.searchParams.set("room", roomEntry[0]);
  } else {
    url.searchParams.delete("room");
  }
  url.searchParams.set("source_section", sourceSection);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function cleanInquiryUrl() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  ["flow", "segment", "room", "source_section"].forEach((param) => url.searchParams.delete(param));
  const query = url.searchParams.toString();
  window.history.replaceState({}, "", `${url.pathname}${query ? `?${query}` : ""}${url.hash}`);
}

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

function trackBookingEvent(event, payload = {}) {
  track(event, {
    property_slug: PROPERTY_SLUG,
    ...payload,
  });
}

function App() {
  const [initialUrlPreset] = useState(() => getEntryPresetFromUrl());
  const [journey, setJourney] = useState("meeting");
  const [activeStayId, setActiveStayId] = useState(stayOptions[0].detailId);
  const [activeNatureId, setActiveNatureId] = useState(natureSignals[0].id);
  const [activeCulinaryId, setActiveCulinaryId] = useState(culinarySteps[0].id);
  const [activeDetail, setActiveDetail] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(() => Boolean(initialUrlPreset));
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState(() => getInitialBookingData(initialUrlPreset));
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileNavId = "mobile-primary-nav";
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, shouldReduceMotion ? 1 : 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, shouldReduceMotion ? 0 : 52]);
  const journeyImageY = useTransform(
    scrollYProgress,
    [0.46, 0.78],
    [shouldReduceMotion ? 0 : -22, shouldReduceMotion ? 0 : 26],
  );
  const journeyImageScale = useTransform(
    scrollYProgress,
    [0.46, 0.78],
    [1.04, shouldReduceMotion ? 1.04 : 1],
  );
  const activeJourney = journeyTracks[journey];
  const JourneyIcon = activeJourney.icon;
  const activeStay =
    stayOptions.find((option) => option.detailId === activeStayId) || stayOptions[0];
  const activeStayVideo =
    activeStay.detailId === "stay-charles-suite" ? generatedAssetRegistry.suiteFilm : null;
  const activeNature =
    natureSignals.find((signal) => signal.id === activeNatureId) || natureSignals[0];
  const ActiveNatureIcon = activeNature.icon;
  const activeCulinary =
    culinarySteps.find((step) => step.id === activeCulinaryId) || culinarySteps[0];
  const activeCulinaryMedia =
    generatedAssetRegistry[activeCulinary.mediaKey] || generatedAssetRegistry.diningFilm;
  const ActiveCulinaryIcon = activeCulinary.icon;
  const activeDetailContent = activeDetail ? (detailPages[activeDetail] ?? null) : null;
  const selectedBookingSegment =
    bookingSegments.find((segment) => segment.id === bookingData.segment) || bookingSegments[0];
  const segmentSelectorItems = bookingSegments.map((segment) => {
    const Icon = segment.icon;

    return {
      id: segment.id,
      title: segment.title,
      description: segment.text,
      icon: <Icon size={22} aria-hidden="true" />,
    };
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingData));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [bookingData]);

  useEffect(() => {
    if (!initialUrlPreset) return;

    trackBookingEvent("booking_drawer_open", {
      flow: FLOW_MODE,
      segment: initialUrlPreset.segment,
      source_section: initialUrlPreset.sourceSection || "url",
    });
  }, [initialUrlPreset]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function openBooking(preset = {}) {
    const sourceSection = preset.sourceSection || preset.source_section || "page";
    const nextPreset = getBookingPreset(
      preset.segment || preset.bookingSegment || bookingData.segment,
    );
    if (preset.accommodation) {
      nextPreset.accommodation = preset.accommodation;
    }
    if (preset.privileges) {
      nextPreset.privileges = preset.privileges;
    }

    writeInquiryUrl({
      segment: nextPreset.segment,
      accommodation: nextPreset.accommodation,
      sourceSection,
    });
    trackBookingEvent("booking_drawer_open", {
      flow: FLOW_MODE,
      segment: nextPreset.segment,
      source_section: sourceSection,
    });
    setBookingData((current) => ({
      ...current,
      ...nextPreset,
      period: current.period,
    }));
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingOpen(true);
  }

  function openDetail(detailId) {
    if (!detailPages[detailId]) return;
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
    cleanInquiryUrl();
  }

  function updateBookingField(field, value) {
    setBookingSuccess(false);
    setBookingData((current) => ({ ...current, [field]: value }));
  }

  function selectBookingSegment(segmentId) {
    const segment =
      bookingSegments.find((item) => item.id === normalizeSegment(segmentId)) || bookingSegments[0];
    setBookingSuccess(false);
    if (bookingOpen) {
      writeInquiryUrl({
        segment: segment.id,
        accommodation: segment.accommodation,
        sourceSection: "drawer_segment",
      });
    }
    setBookingData((current) => ({
      ...current,
      segment: segment.id,
      guests: segment.guests,
      occasion: segment.occasion,
      accommodation: segment.accommodation,
      privileges: segment.privileges,
    }));
  }

  function togglePrivilege(privilege) {
    const exists = bookingData.privileges.includes(privilege);
    updateBookingField(
      "privileges",
      exists
        ? bookingData.privileges.filter((item) => item !== privilege)
        : [...bookingData.privileges, privilege],
    );
  }

  function nextBookingStep() {
    setBookingSuccess(false);
    trackBookingEvent("booking_step_complete", {
      flow: FLOW_MODE,
      step_index: bookingStep,
      step_name: bookingStepLabels[bookingStep - 1] || `Schritt ${bookingStep}`,
    });
    setBookingStep((step) => Math.min(step + 1, 4));
  }

  function previousBookingStep() {
    setBookingSuccess(false);
    setBookingStep((step) => Math.max(step - 1, 1));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    trackBookingEvent("booking_form_submit", {
      flow: FLOW_MODE,
      inquiry_id: "inline-form-preview",
      value: 0,
      currency: "EUR",
    });
  }

  function prepareInquiry() {
    setBookingSuccess(true);
    trackBookingEvent("booking_form_submit", {
      flow: FLOW_MODE,
      inquiry_id: "drawer-preview",
      value: 0,
      currency: "EUR",
    });
  }

  return (
    <>
      <header className="site-header" aria-label="Hauptnavigation" ref={headerRef}>
        <a className="brand" href="#top" aria-label="Rhön Park Luxury Line Start">
          <span className="brand-mark">RPL</span>
          <span>
            <strong>Rhön Park</strong>
            <small>Luxury Line</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Seitennavigation">
          <a href="#erlebnis">Erlebnis</a>
          <a href="#tagungen">Tagungen</a>
          <a href="#suiten-chalets">Suiten & Chalets</a>
          <a href="#biosphaere">Rhön-Natur</a>
          <a href="#kulinarik">Kulinarik</a>
        </nav>
        <button
          className="header-cta"
          type="button"
          onClick={() => openBooking({ segment: "executive", sourceSection: "header" })}
        >
          <CalendarDays size={18} />
          Private Anfrage starten
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={menuOpen}
          aria-controls={mobileNavId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu size={22} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id={mobileNavId}
              className="mobile-nav"
              aria-label="Mobile Seitennavigation"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#erlebnis" onClick={() => setMenuOpen(false)}>
                Erlebnis
              </a>
              <a href="#tagungen" onClick={() => setMenuOpen(false)}>
                Tagungen
              </a>
              <a href="#suiten-chalets" onClick={() => setMenuOpen(false)}>
                Suiten & Chalets
              </a>
              <a href="#biosphaere" onClick={() => setMenuOpen(false)}>
                Rhön-Natur
              </a>
              <a href="#kulinarik" onClick={() => setMenuOpen(false)}>
                Kulinarik
              </a>
              <button
                className="mobile-booking-link"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openBooking({ segment: "executive", sourceSection: "mobile_nav" });
                }}
              >
                Private Anfrage starten
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          {shouldReduceMotion ? (
            <motion.img
              className="hero-image"
              src={generatedAssetRegistry.heroFilm.fallback}
              alt="Konzeptvisual eines privaten Chalet-Rückzugsorts im Wald"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
              style={{ scale: heroScale, y: heroY }}
            />
          ) : (
            <motion.video
              className="hero-image"
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              poster={generatedAssetRegistry.heroFilm.fallback}
              aria-label="Cinematischer Drohnenflug über ein ruhiges Resort in der Rhön am Morgen"
              style={{ scale: heroScale, y: heroY }}
            >
              <source src={generatedAssetRegistry.heroFilm.publicUrl} type="video/mp4" />
            </motion.video>
          )}
          <div className="hero-scrim" />
          <span className="hero-concept-label" aria-hidden="true">
            Konzeptvisual
          </span>
          <motion.div className="hero-content" initial="hidden" animate="show" variants={stagger}>
            <motion.p className="eyebrow" variants={reveal}>
              Neue Premium-Submarke · Charles-Suiten · RhönVillage in Planung
            </motion.p>
            <motion.h1 id="hero-title" variants={reveal}>
              Rhön Park Luxury Line
            </motion.h1>
            <motion.p className="hero-copy" variants={reveal}>
              Ein privater Luxury Layer innerhalb eines der leistungsfähigsten Resorts in der Mitte
              Deutschlands: mit Charles-Suiten als sofort erzählbarer Premiumstufe, Rhöner Genuss
              als Vertrauensanker und RhönVillage als künftiger Naturresidenz im
              UNESCO-Biosphärenreservat Rhön.
            </motion.p>
            <motion.div className="hero-actions" variants={reveal}>
              <button
                className="button primary"
                type="button"
                onClick={() => openBooking({ segment: "executive", sourceSection: "hero" })}
              >
                Private Anfrage starten
                <ArrowRight size={19} />
              </button>
              <a className="button secondary" href="#suiten-chalets">
                Suiten & Chalets entdecken
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
            <span>
              <small>Charles-Suiten</small>
              <strong>Luxus im Hauptgebäude</strong>
            </span>
            <span>
              <small>Kulinarik</small>
              <strong>Rhöner Frische als Preisanker</strong>
            </span>
            <span>
              <small>UNESCO-Biosphäre</small>
              <strong>Weitblick, Höhenluft, Sternenpark</strong>
            </span>
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
                Angebotsidee
              </motion.p>
              <motion.h2 variants={reveal}>Ein ruhiger Premium-Raum über dem Resort.</motion.h2>
              <motion.p variants={reveal}>
                Rhön Park bleibt das Haus für große Gruppen, Familien und Events. Die Luxury Line
                nutzt diese operative Sicherheit als Fundament und legt darüber eine private
                Schicht: klare Privilegien, persönliche Betreuung und ruhige Genussmomente.
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
                  <span>Angebotsstruktur</span>
                  <strong>3 Layer</strong>
                </div>
                <div className="strategy-layers">
                  {strategyLayers.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <motion.article
                        className="strategy-layer"
                        key={layer.title}
                        variants={reveal}
                      >
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
            </motion.div>
          </div>
        </section>

        <section className="promise-section luxury-experience-section">
          <Reveal className="section-heading">
            <p className="eyebrow dark">Wellness & Rhythmus</p>
            <h2>Der Mehrpreis wird über Ruhe, Wasser und kuratierte Momente spürbar.</h2>
          </Reveal>
          <div className="luxury-moments">
            <Reveal className="moment-feature">
              {shouldReduceMotion ? (
                <img
                  src={generatedAssetRegistry.outdoorPoolFilm.fallback}
                  alt="Sonniger Outdoor-Infinitypool mit Rhönblick als Teil der Rhön Park Luxury Line"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="none"
                  poster={generatedAssetRegistry.outdoorPoolFilm.fallback}
                  aria-label="Cinematischer Outdoor-Infinitypool mit sonnigem Rhönblick"
                >
                  <source src={generatedAssetRegistry.outdoorPoolFilm.publicUrl} type="video/mp4" />
                </video>
              )}
              <div className="moment-feature-card">
                <span>Premium-Rhythmus</span>
                <strong>Rhönblick, Wasser, Gastgeberkontakt und ruhige Slots</strong>
                <p>
                  Die Seite zeigt nicht mehr nur Kategorien, sondern den konkreten Wert eines ruhig
                  geführten Aufenthalts.
                </p>
              </div>
            </Reveal>
            <motion.div
              className="promise-grid moment-grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.16 }}
            >
              {promiseItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    className="promise-card moment-card"
                    key={item.title}
                    variants={reveal}
                  >
                    <span className="moment-step">{item.step}</span>
                    <Icon size={26} aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="stay-section" id="suiten-chalets">
          <Reveal className="section-heading center">
            <p className="eyebrow dark">Suiten & RhönVillage</p>
            <h2>Drei Produktwelten, drei klare Gründe für Premiumwert.</h2>
            <p>
              Charles-Suiten, Premium Apartments und Private Chalets erfüllen unterschiedliche
              Aufgaben. Gemeinsam machen sie sichtbar, dass Luxus hier nicht über Glanz entsteht,
              sondern über Raum, Ruhe, Genuss und Rhön-Natur.
            </p>
          </Reveal>

          <div className="product-showcase">
            <div className="product-tabs tab-bar" role="tablist" aria-label="Produktwelt wählen">
              {stayOptions.map((option) => (
                <button
                  key={option.detailId}
                  id={`stay-tab-${option.detailId}`}
                  className={activeStayId === option.detailId ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={activeStayId === option.detailId}
                  aria-controls={`stay-panel-${option.detailId}`}
                  onClick={() => setActiveStayId(option.detailId)}
                >
                  <span>{option.label}</span>
                  <strong>{option.title}</strong>
                  <small>{option.subtitle}</small>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                className="product-spotlight"
                key={activeStay.detailId}
                role="tabpanel"
                id={`stay-panel-${activeStay.detailId}`}
                aria-labelledby={`stay-tab-${activeStay.detailId}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="product-visual">
                  {activeStayVideo && !shouldReduceMotion ? (
                    <video
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="none"
                      poster={activeStayVideo.fallback}
                      aria-label="Cinematischer Blick durch eine ruhige Premium-Suite mit Waldsicht"
                    >
                      <source src={activeStayVideo.publicUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={activeStay.image}
                      alt={`${activeStay.title} der Rhön Park Luxury Line`}
                      loading="lazy"
                      decoding="async"
                      width={1365}
                      height={1024}
                    />
                  )}
                  <span>{activeStay.featured ? "Konzeptvorschau" : activeStay.label}</span>
                </div>
                <div className="product-copy">
                  <p className="eyebrow dark">{activeStay.label}</p>
                  <h3>{activeStay.title}</h3>
                  <p>{activeStay.text}</p>
                  <div
                    className="product-fact-rail"
                    aria-label={`${activeStay.title} Leistungsrahmen`}
                  >
                    {activeStay.rail.map((fact) => (
                      <span key={fact}>{fact}</span>
                    ))}
                  </div>
                  <div className="product-actions">
                    <button
                      className="button primary"
                      type="button"
                      onClick={() =>
                        openBooking({
                          segment: activeStay.bookingSegment,
                          accommodation: detailPages[activeStay.detailId]?.accommodation,
                          sourceSection: "product_spotlight",
                        })
                      }
                    >
                      {activeStay.cta}
                      <ArrowRight size={18} />
                    </button>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() => openDetail(activeStay.detailId)}
                    >
                      Details ansehen
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section className="nature-section" id="biosphaere">
          <Reveal className="section-heading">
            <p className="eyebrow dark">UNESCO-Biosphärenreservat Rhön</p>
            <h2>Die Rhön ist kein Hintergrund. Sie ist der emotionale USP.</h2>
            <p>
              Weite Sicht, klare Höhenluft, geschützte Rhön-Natur und der Sternenpark Rhön geben der
              Luxury Line eine ruhige, zentrale und glaubwürdige Premiumqualität.
            </p>
          </Reveal>

          <div className="nature-stage">
            <div className="nature-visual">
              {shouldReduceMotion ? (
                <motion.img
                  src={generatedAssetRegistry.natureFilm.fallback}
                  alt="Weite Rhön-Landschaft als Konzeptvisual für klare Höhenluft und offene Fernen"
                  loading="lazy"
                  style={{ y: journeyImageY }}
                />
              ) : (
                <motion.video
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="none"
                  poster={generatedAssetRegistry.natureFilm.fallback}
                  aria-label="Cinematischer Drohnenflug über die bewaldeten Hügel der Rhön bei Sonnenaufgang"
                  style={{ y: journeyImageY }}
                >
                  <source src={generatedAssetRegistry.natureFilm.publicUrl} type="video/mp4" />
                </motion.video>
              )}
              <div className="nature-ambient">
                <ActiveNatureIcon size={24} aria-hidden="true" />
                <span>{activeNature.title}</span>
                <strong>{activeNature.signal}</strong>
                <p>{activeNature.text}</p>
              </div>
            </div>
            <div className="nature-signal-panel" aria-label="Nature Signal">
              {natureSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <button
                    key={signal.id}
                    className={activeNatureId === signal.id ? "active" : ""}
                    type="button"
                    onClick={() => setActiveNatureId(signal.id)}
                  >
                    <Icon size={22} aria-hidden="true" />
                    <span>{signal.title}</span>
                    <small>{signal.signal}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="culinary-section" id="kulinarik">
          <Reveal className="section-heading center culinary-heading">
            <p className="eyebrow dark">Kulinarik, die den Premiumpreis trägt</p>
            <h2>Vom Suiten-Frühstück bis zum Signature Dinner.</h2>
            <p>
              Die Luxury Line verkauft keinen Standardtisch, sondern eine ruhige Genussdramaturgie:
              regional am Morgen, reserviert am Abend, besonders inszeniert für Anlässe mit höherem
              Wert.
            </p>
          </Reveal>

          <div className="culinary-stage">
            <div
              className="culinary-tabs tab-bar"
              role="tablist"
              aria-label="Kulinarische Progression wählen"
            >
              {culinarySteps.map((step) => (
                <button
                  key={step.id}
                  id={`culinary-tab-${step.id}`}
                  className={activeCulinaryId === step.id ? "active" : ""}
                  data-culinary-step={step.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCulinaryId === step.id}
                  aria-controls={`culinary-panel-${step.id}`}
                  onClick={() => setActiveCulinaryId(step.id)}
                >
                  <span>{step.label}</span>
                  <strong>{step.title}</strong>
                  <small>{step.kicker}</small>
                </button>
              ))}
            </div>

            <motion.article
              className="culinary-panel"
              key={activeCulinary.id}
              role="tabpanel"
              id={`culinary-panel-${activeCulinary.id}`}
              aria-labelledby={`culinary-tab-${activeCulinary.id}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="culinary-copy">
                <div className="culinary-mark">
                  <ActiveCulinaryIcon size={24} aria-hidden="true" />
                  <span>{activeCulinary.kicker}</span>
                </div>
                <p className="eyebrow dark">Rhöner Genuss</p>
                <h3>{activeCulinary.title}</h3>
                <p>{activeCulinary.text}</p>
                <div
                  className="culinary-service"
                  aria-label={`${activeCulinary.title} Servicerahmen`}
                >
                  {activeCulinary.service.map((item) => (
                    <span key={item.label}>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </span>
                  ))}
                </div>
                <div className="culinary-facts">
                  {activeCulinary.facts.map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </div>
                <button
                  className="button primary"
                  type="button"
                  onClick={() =>
                    openBooking({
                      segment: "executive",
                      accommodation: "Charles-Suite",
                      sourceSection: "culinary",
                    })
                  }
                >
                  {activeCulinary.ctaLabel}
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="culinary-image">
                <div className="culinary-frame-label" aria-hidden="true">
                  <span>{activeCulinary.mediaLabel}</span>
                  <small>{activeCulinary.mediaMeta}</small>
                </div>
                {shouldReduceMotion ? (
                  <img
                    src={activeCulinaryMedia.fallback}
                    alt={activeCulinaryMedia.alt}
                    loading="lazy"
                  />
                ) : (
                  <video
                    key={activeCulinaryMedia.publicUrl}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="none"
                    poster={activeCulinaryMedia.fallback}
                    aria-label={activeCulinaryMedia.alt}
                  >
                    <source src={activeCulinaryMedia.publicUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            </motion.article>
          </div>
        </section>

        <section className="journey-section" id="tagungen">
          <div className="journey-shell">
            <Reveal className="journey-heading">
              <p className="eyebrow">Zwei Journeys</p>
              <h2>Tagungen und Familienurlaub kaufen nicht dieselbe Form von Luxus.</h2>
              <p>
                Die Luxury Line ist kein pauschales Premium-Etikett. Sie ist ein Anlass-System:
                konzentriert und repräsentativ für Firmen, privat und entlastend für Familien.
              </p>
            </Reveal>

            <div className="journey-tabs tab-bar" role="tablist" aria-label="Journey wählen">
              {Object.entries(journeyTracks).map(([key, track]) => (
                <button
                  key={key}
                  id={`journey-tab-${key}`}
                  className={journey === key ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={journey === key}
                  aria-controls={`journey-panel-${key}`}
                  onClick={() => setJourney(key)}
                >
                  {track.nav}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                className="journey-panel"
                key={journey}
                role="tabpanel"
                id={`journey-panel-${journey}`}
                aria-labelledby={`journey-tab-${journey}`}
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
                  <button
                    className="text-link light inline-action"
                    type="button"
                    onClick={() =>
                      openBooking({
                        segment: activeJourney.bookingSegment,
                        sourceSection: `journey_${journey}`,
                      })
                    }
                  >
                    {activeJourney.cta}
                    <ArrowRight size={18} />
                  </button>
                </div>
                <div
                  className="journey-media"
                >
                  <motion.img
                    src={activeJourney.image}
                    alt={`${activeJourney.nav} der Rhön Park Luxury Line`}
                    loading="lazy"
                    decoding="async"
                    width={2048}
                    height={1365}
                    style={{ y: journeyImageY, scale: journeyImageScale }}
                  />
                  {journey === "meeting" && (
                    <div className="meeting-configs" aria-label="Meeting Config Overlays">
                      {roomConfigImages.map((config) => (
                        <span key={config.label}>
                          <img
                            src={config.src}
                            alt={`RhönUm ${config.label} Konfiguration`}
                            loading="lazy"
                          />
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
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section className="experience-band">
          <Reveal className="experience-copy">
            <p className="eyebrow">Private Concierge Logic</p>
            <h2>Aus Anfrage wird ein ruhiger, hochwertiger Aufenthaltsplan.</h2>
            <p>
              Höhere Zahlungsbereitschaft entsteht, wenn Gäste nicht selbst sortieren müssen. Der
              Concierge-Flow fragt Anlass, Zeitraum, Gästezahl, Unterkunft und Privilegien ab und
              übersetzt daraus ein hochwertiges Gespräch für Reservierung oder Sales.
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
            <img
              src={generatedAssetRegistry.signatureDiningFilm.fallback}
              alt="Privater Signature-Dining-Moment als Symbol für kuratierte Luxury-Line-Anfragen"
              loading="lazy"
              decoding="async"
              width={1920}
              height={1080}
            />
          </Reveal>
        </section>

        <section className="inquiry-section" id="anfrage">
          <Reveal className="inquiry-copy">
            <p className="eyebrow dark">Private Anfrage</p>
            <h2>Luxury Line als kuratierte Anfrage starten.</h2>
            <p>
              Der Einstieg führt nicht in eine Standardbuchung, sondern in ein persönliches
              Gespräch. So kann das Team Zeitraum, Anlass, Gruppe und passende Privilegien sauber
              kuratieren.
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
              <select name="segment" autoComplete="off" defaultValue="Executive Retreat">
                <option>Executive Retreat</option>
                <option>Normaler Familienurlaub</option>
                <option>Premium Family Residence</option>
                <option>RhönVillage-Konzeptvorschau</option>
              </select>
            </label>
            <label>
              Zeitraum
              <input
                type="text"
                name="period"
                autoComplete="off"
                placeholder="z. B. September 2026"
              />
            </label>
            <label>
              Gäste / Teilnehmer
              <input
                type="text"
                name="guests"
                autoComplete="off"
                placeholder="z. B. 120 Personen"
              />
            </label>
            <label>
              Unterkunft
              <select name="accommodation" autoComplete="off" defaultValue="Charles-Suite">
                <option>Charles-Suite</option>
                <option>Familienzimmer / Apartment</option>
                <option>Premium Apartment</option>
                <option>Private Chalet / RhönVillage</option>
                <option>Individuell kuratieren</option>
              </select>
            </label>
            <label className="full">
              Wunsch
              <textarea
                name="message"
                autoComplete="off"
                placeholder="Kurze Beschreibung des Aufenthalts, der Gruppe oder des gewünschten Niveaus"
              />
            </label>
            <button className="button primary form-button" type="submit">
              Private Anfrage starten
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
                  Anfrage vorbereitet. Das Rhön Park Team kann daraus ein persönliches Angebot
                  kuratieren.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </section>
      </main>

      <footer className="footer">
        <span>Rhön Park Luxury Line</span>
        <span>Luxury-Line-Konzept für höherwertige Anfragen</span>
      </footer>

      <DetailOverlay
        detail={activeDetailContent}
        onClose={() => setActiveDetail(null)}
        primaryActionLabel="Concierge-Anfrage öffnen"
        onPrimaryAction={(detail) => {
          setActiveDetail(null);
          openBooking({
            segment: detail.bookingSegment,
            accommodation: detail.accommodation,
            sourceSection: "detail_overlay",
          });
        }}
      />
      <Drawer
        open={bookingOpen}
        onClose={closeBooking}
        eyebrow="Private Concierge"
        title="Luxury Line kuratieren."
        closeLabel="Buchungsfenster schließen"
        footer={
          <>
            <button
              className="button secondary dark"
              type="button"
              onClick={bookingStep === 1 ? closeBooking : previousBookingStep}
            >
              {bookingStep === 1 ? "Schließen" : "Zurück"}
            </button>
            {bookingStep < 4 ? (
              <button className="button primary" type="button" onClick={nextBookingStep}>
                Weiter
                <ArrowRight size={18} />
              </button>
            ) : (
              <button className="button primary" type="button" onClick={prepareInquiry}>
                Private Anfrage vorbereiten
                <ArrowRight size={18} />
              </button>
            )}
          </>
        }
      >
        <div className="booking-concierge-note">
          <span>{selectedBookingSegment.title}</span>
          <p>
            Diese Anfrage sammelt Anlass, Aufenthaltsrahmen und Privilegien, damit das Rhön Park
            Team daraus ein kuratiertes Angebot vorbereiten kann.
          </p>
        </div>
        <StepIndicator current={bookingStep} total={4} labels={bookingStepLabels} />

        <div className="booking-body">
          {bookingStep === 1 && (
            <section className="booking-step" aria-label="Segment wählen">
              <h3>Anlass wählen</h3>
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
              <h3>Zeitraum und Gäste</h3>
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
                  <select
                    value={bookingData.accommodation}
                    onChange={(event) => updateBookingField("accommodation", event.target.value)}
                  >
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
              <h3>Private Anfrage prüfen</h3>
              <p className="booking-premium-copy">
                Wir bereiten daraus eine kuratierte Anfrage für das Rhön Park Team vor: mit Anlass,
                Zeitraum, Unterkunft und den gewünschten Privilegien.
              </p>
              {bookingSuccess && (
                <motion.p
                  className="booking-success"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Anfrage vorbereitet. Das Rhön Park Team kann daraus ein persönliches Angebot
                  ableiten.
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
                  <strong>
                    {bookingData.privileges.length
                      ? bookingData.privileges.join(", ")
                      : "Individuell kuratieren"}
                  </strong>
                </span>
              </div>
            </section>
          )}
        </div>
      </Drawer>
    </>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  rootElement.francoRoot ??= createRoot(rootElement);
  rootElement.francoRoot.render(<App />);
}
