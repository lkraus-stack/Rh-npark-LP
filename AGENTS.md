# AGENTS.md - Franco Booking Engine

## Purpose

This monorepo hosts the Franco Consulting booking system: a white-label, per-customer
booking and inquiry tool. Each customer hotel gets its own deployable app under `apps/`.
Shared logic, components, theming, and adapters live under `packages/`.

The first customer is Rhön Park Hotel (luxury line). The first customer app is
`apps/rhoenpark-luxury`, originally a Vite/React landing page.

## Current Repository State

This repository is currently still a single Vite/React prototype at the root. The
monorepo layout below is the intended target architecture and should guide future
migration work. Do not create folders, move files, or restructure the project merely
because this document names the future layout.

## Rhön Park Luxury Line Context

The active customer experience is the Rhön Park Hotel Luxury Line pitch prototype.
It presents a premium subbrand for higher-value inquiries around Signature Suites,
Premium Apartments, future Private Chalets, Executive Retreats, and high-value
family upgrades.

Design and copy should sell the Rhön as a calm, central, nature-driven location in
Germany. The tone is premium, regional, quiet, authentic, and concrete. Avoid generic
hotel phrases such as "Willkommen in einer Welt der Entspannung". User-facing text
is German by default.

This is not a Next.js/Tailwind project. The active app is Vite/React under
`apps/rhoenpark-luxury`, using Framer Motion, Lucide icons, shared Franco booking UI
packages, and vanilla CSS/custom properties.

## Higgsfield / Creative AI Usage

Use Higgsfield more openly when the user asks for creative assets, such as:

- "generate image/video for ..."
- "nutze Higgsfield ..."
- "erstelle ein Hero-Video/Bild ..."
- "mach das visueller/luxuriöser mit generierten Assets ..."
- requests for hotel visuals, chalet concepts, wellness scenes, room atmospheres,
  campaign images, or video loops where AI generation clearly helps the pitch.

Do not require the exact phrase `generate video for [scene-description]`. If the
intent is clearly asset generation, proceed with Higgsfield. If the request is
ambiguous, briefly propose the Higgsfield asset direction before generating.

Never call Higgsfield automatically during ordinary build, deploy, test, lint, Git,
or code-only changes. Generated assets must be saved as files in the app repo and
referenced from code only after they exist.

Asset targets for Rhön Park:

- Images: `apps/rhoenpark-luxury/public/images/concepts/[asset-name].jpg`
- Videos: `apps/rhoenpark-luxury/public/videos/[asset-name].mp4`

Video output should be H.264 MP4, max 1920x1080, ideally below 8 MB per file.
Implement local videos with native `<video autoPlay muted playsInline loop>`.
Hero video assets should be treated as LCP-sensitive and preloaded where practical.

Planned creative directions:

- Hero: Rhön landscape at sunrise, light mist over hills, future private chalet
  village, quiet editorial luxury.
- Wellness: calm pool or sauna atmosphere, soft morning water movement, no crowded
  spa scene.
- Rooms: warm suite/chalet interior, soft light, natural materials, quiet Rhön view.
- Executive Retreat: premium breakout or boardroom atmosphere, central Germany,
  high-quality but restrained.

All AI-generated material is concept material until the hotel approves it. Avoid
fake operational claims, fake signage, third-party logos, unrealistic room sizes,
or imagery that implies finished chalets already exist unless the UI labels it as
concept/future vision.

## Two Flow Modes

Every booking interaction is one of two modes. Never mix them inside a single flow.

1. **`inquiry`** - qualified lead capture. No payment, no live availability. Used for
   events, meetings (Tagungen), executive retreats, family residence requests. Output
   is a record in the `inquiries` table plus a styled email to the property's
   reservation team.

2. **`transactional`** - real-time availability, instant booking, instant payment via
   Stripe. Used for direct-stay bookings of suites/rooms/apartments. Output is a
   record in the `bookings` table plus a confirmation email plus a webhook to the
   property's PMS (or manual sync queue for v1).

Both modes share: drawer/wizard chrome, step indicator, segment selector, date picker,
form primitives, persistence, tracking, theme, motion.

## UX Doctrine - Mandatory

These distinguish Franco Booking from DIRS21, Busy Rooms, Mews and similar.
Not optional.

1. **No page reloads.** All step transitions are in-place state changes with
   Framer Motion. Match the motion variants already used in `apps/rhoenpark-luxury`.

2. **State persistence.** All form state writes to localStorage on change, debounced
   300ms. Key: `franco-booking-{propertyId}-{mode}`. On reload, state restores.

3. **URL is the source of truth for entry.** Drawer opens via URL params
   (`?flow=inquiry&segment=meeting` or `?flow=booking&room=rother-kuppe`). Closing
   the drawer cleans the URL via `history.replaceState`.

4. **Date picker rule.** Mobile (`(pointer: coarse)`): native `<input type="date">`.
   Desktop: custom two-month range picker, built in `packages/booking-ui`.
   NEVER use a third-party date picker library.

5. **Transparent pricing.** VAT, city tax, and service fees are included in every
   price from the first display. Sticky total footer on mobile, always visible.

6. **Stripe Payment Element only.** Configure SEPA, Apple Pay, Google Pay, Klarna
   in the Stripe Dashboard. Never use the legacy Card Element.

7. **Human errors, German tone.** No "Validation failed for field X". Errors are
   short, warm German sentences that match the host site's voice.

8. **Skeletons, not spinners.** When loading availability or prices, render skeleton
   cards. Never block UI with a modal spinner.

9. **Reduced motion respected.** All animations check `prefers-reduced-motion` and
   gracefully degrade.

10. **A11y first class.** Drawer has focus trap. ESC closes. All interactive elements
    keyboard-navigable. Form errors announced via `aria-live="polite"`.

## Tracking - Already Live, Booking Tool Plugs In

Server-side GTM is already deployed at `tracking.rhoen-park-hotel.de`. The booking
tool MUST send events to this endpoint via the existing GTM Web Container on the
host page. Booking-tool events:

- `booking_drawer_open` (params: flow, segment, source_section)
- `booking_step_complete` (params: flow, step_index, step_name)
- `booking_form_submit` (params: flow, inquiry_id|booking_id, value, currency)
- `booking_payment_initiated` (transactional only)
- `booking_payment_succeeded` (transactional only)
- `booking_payment_failed` (transactional only)

All events go through `packages/tracking/track()` which:

1. Calls `window.dataLayer.push(...)` for the page's GTM container.
2. Sends a parallel `POST` to `/api/tracking-event` (Supabase Edge Function) which
   writes to the `tracking_events` table. This is the ground-truth attribution layer.

Never call `gtag()`, `fbq()`, or `dataLayer.push()` directly from components.
Only from `packages/tracking`.

## Stack

- **Frontend:** React 19, Vite 7, TypeScript strict, Framer Motion, vanilla CSS
  with custom properties.
- **Backend:** Supabase (Postgres + Edge Functions in Deno + Auth).
- **Payments:** Stripe Payment Element + Connect.
- **Email:** Resend.
- **Tracking:** Existing server-side GTM on `tracking.<customer-domain>`.
  Booking tool sends events; doesn't configure the container.
- **Deployment:** Vercel (one project per customer app).
- **Monorepo:** pnpm workspaces + Turborepo.

## Repo Layout

Target layout for the Franco Booking Engine monorepo:

```text
.
├── apps/
│   └── rhoenpark-luxury/
│       ├── src/
│       │   ├── locales/
│       │   │   └── de.ts
│       │   └── theme/
│       │       └── rhoenpark-theme.css
│       ├── public/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   ├── booking-core/
│   │   ├── src/
│   │   └── package.json
│   ├── booking-ui/
│   │   ├── src/
│   │   └── package.json
│   ├── booking-adapters/
│   │   ├── src/
│   │   └── package.json
│   ├── tracking/
│   │   ├── src/
│   │   └── package.json
│   ├── theme/
│   │   ├── src/
│   │   ├── tokens.css
│   │   └── package.json
├── supabase/
│   ├── functions/
│   │   └── tracking-event/
│   └── migrations/
├── docs/
├── eslint.config.js
├── package.json
├── pnpm-workspace.yaml
├── prettier.config.js
├── turbo.json
└── AGENTS.md
```

- `apps/rhoenpark-luxury` contains the Rhön Park deployable customer app.
- `packages/booking-core` contains framework-agnostic booking types,
  calculations, validation helpers, logging, and shared utilities.
- `packages/booking-ui` contains shared booking drawer, wizard, form, segment,
  date-picker, pricing, and motion primitives.
- `packages/booking-adapters` contains PMS, Supabase, Stripe, Resend, and
  manual-sync integration boundaries.
- `packages/tracking` owns the only allowed tracking API, including GTM
  `dataLayer` forwarding and `/api/tracking-event` posting.
- `packages/theme` contains shared design tokens, customer theme adapters, CSS
  custom properties, and motion defaults.
- `supabase/functions` contains Deno Edge Functions, including `tracking-event`.
- `docs` contains product, deployment, integration, and customer-specific notes
  that should not live inside implementation packages.

## Theme System

Components use semantic CSS variables defined in `packages/theme/src/tokens.css`.
Customer apps map their CI to these variables in a single theme file
(`apps/<customer>/src/theme/<customer>-theme.css`). Components NEVER hardcode
colors, fonts, spacing, or radii. Examples:

```css
/* In components */
background: var(--bk-surface);
color: var(--bk-text);
border-radius: var(--bk-radius-md);

/* In customer theme */
:root {
  --bk-primary: #163d32; /* maps to Rhönpark --forest */
  --bk-accent: #c6a96a; /* maps to Rhönpark --champagne */
  --bk-radius-md: 0; /* Rhönpark is square */
}
```

## Coding Standards

- TypeScript strict. No `any` without a `// reason: ...` comment.
- ESM imports only. No CommonJS.
- Function components only. No classes.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`.
- Prettier (config at root) + ESLint (config at root). Run on commit via
  lint-staged.
- Tests with Vitest + @testing-library/react.
- No `console.log` in committed code. Use `logger` from
  `packages/booking-core/utils`.
- All public package APIs documented with JSDoc.
- File naming: `PascalCase.tsx` for components, `kebab-case.ts` for utilities.

## Localization

Default language: German. All user-facing strings in German.
Strings live in `apps/<customer>/src/locales/de.ts` as a typed object.
No `i18next` for v1.

## Don't Do

- No Tailwind, no CSS-in-JS, no styled-components.
- No UI libraries (no shadcn, MUI, Mantine, Chakra).
- No date picker libraries.
- No state management library (Redux, Zustand). Use React state + Context.
- No data fetching in components. Use functions from `packages/booking-adapters`.
- No direct `gtag`/`fbq` calls. Use `packages/tracking`.
- No commits to `main` without passing build and lint.

## How to Run Locally

```bash
pnpm install
cp .env.example .env.local       # fill in Supabase + Stripe + Resend keys
pnpm db:start                     # local Supabase
pnpm dev                          # all apps in dev mode (turbo)
```

## Implementation Rules

- Keep `inquiry` and `transactional` flows separate in state, URLs, persistence
  keys, records, emails, and tracking payloads.
- Prefer shared primitives in `packages/booking-ui` before creating
  customer-specific UI in an app.
- Never add third-party date-picker packages.
- Never call analytics APIs directly from React components.
- Use German, warm, property-appropriate validation and status copy.
- Treat the root Vite prototype as temporary until the monorepo migration is
  explicitly requested.
