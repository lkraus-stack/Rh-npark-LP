# Rhön Park Luxury Line Landingpage

## Summary

Build a polished local landingpage prototype for **Rhön Park Luxury Line**: a premium "hotel-within-a-resort" concept for both **Executive Retreats** and **Premium Families**. The page reframes Rhön Park's scale as operational excellence while making the luxury line feel private, calm, curated, and higher-value.

Research basis: [Rhön Park Zimmer](https://www.rhoen-park-hotel.de/zimmer/), [Rhön Park Tagungen](https://www.rhoen-park-hotel.de/tagungen/rahmenprogramm/), [Hotel Majestic](https://www.hotel-majestic.it/), [Majestic Zimmer/Suiten](https://www.hotel-majestic.it/zimmer-suiten-kronplatz/), [Fairmont Gold](https://www.fairmont.com/fairmont-gold/), [MSC Yacht Club](https://www.msccruises.com/our-cruises/msc-yacht-club).

## Key Changes

- Scaffold a new Vite/React landingpage in the empty repo, German-first, single route `/`.
- Visual direction: Majestic-inspired full-bleed imagery, warm natural luxury, editorial spacing, muted ivory/charcoal/forest/champagne palette, refined serif headings plus clean sans body text.
- Use real Rhön Park assets for suites/apartments and nature where they help credibility; use one aspirational chalet concept visual for the future 30-chalet area, clearly treated as concept imagery.
- Page structure:
  - Hero: "Rhön Park Luxury Line" with premium nature-retreat promise and CTAs `Private Anfrage` / `Luxury Line entdecken`.
  - Luxury promise: private arrival, concierge-style planning, reserved dining/lounge, priority wellness/activity access, curated business/family experiences.
  - Stay section: existing top suites now elevated into the line, plus planned private chalets as the future flagship.
  - Dual-segment section with tabs/cards: `Executive Retreats` for 50-300 person premium meetings and `Private Family Residence` for holiday-season luxury family stays.
  - Dining/service section: upgraded half-board/private dinner/chef's table style offer, presented as a premium package concept.
  - Conversion section: static inquiry form with fields for segment, dates, guests/participants, accommodation type, and message; no backend, only frontend success state and mail/contact CTA.
- Positioning copy avoids "mass hotel" language and translates scale into trust: central Germany, nature reserve calm, event competence, large-resort infrastructure, private luxury layer.

## Interfaces

- Public anchors: `#erlebnis`, `#suiten-chalets`, `#retreats`, `#familien`, `#anfrage`.
- CTAs scroll to inquiry or open existing contact paths via mailto/phone where useful.
- No live booking API or CRM integration in this prototype.
- Use lucide icons for service benefits and subtle controls; no emoji or decorative UI clutter.

## Test Plan

- Run `npm install`, `npm run dev`, and `npm run build`.
- Verify desktop and mobile layouts at roughly 1440px, 1024px, 768px, and 390px.
- Check hero crop, CTA visibility, no horizontal scroll, readable contrast, stable image dimensions, form states, keyboard focus, and reduced-motion behavior.
- Final browser QA should confirm the page feels presentation-ready for a hotel director, not like a generic template.

## Assumptions

- This is an internal pitch/prototype, not a production relaunch.
- Existing Rhön Park imagery may be used for the presentation prototype.
- Chalet imagery can be aspirational as long as it is framed as a concept.
- The Luxury Line offer itself is conceptual: private lounge/concierge/dining perks are proposed product packaging, not claimed as already live.
