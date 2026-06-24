# ecom-experts — Security Bundle Builder

A multi-step bundle builder for a home security system, built as a React take-home: a 4-step accordion (Cameras → Plan → Sensors → Accessories) on the left, with a live "Your security system" review panel on the right that stays in sync as the shopper makes selections.

## Stack

- **Client**: Vite + React 19 + TypeScript, Zustand for state, Axios for data fetching, `lucide-react` for icons, plain CSS (no Tailwind/CSS-in-JS).
- **Server**: a minimal Express app that serves the product catalog from a local JSON file via `GET /api/products`. No database — this is intentionally the "bonus" backend requirement at its simplest: a thin read-only API in front of a JSON file.
- **Persistence**: "Save my system for later" writes the full configuration (quantities, active variants, open accordion step) to `localStorage`. On load, if a saved config exists, it's merged over the catalog's seeded defaults so a returning visitor sees exactly what they left.

## Run instructions

Two processes, run in separate terminals from a clean clone:

```bash
# Terminal 1 — backend (serves /api/products on :4000)
cd server
npm install
npm run dev

# Terminal 2 — frontend (Vite dev server on :5173)
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173). The frontend expects the API at `http://localhost:4000` (hardcoded in `src/modules/bundleBuilder/shares/api/bundleBuilder.api.ts` — fine for this take-home, would move to an env var for anything beyond a local demo).

`npm run build` (root) type-checks with `tsc -b` and produces a production build via Vite.

## Project structure

```text
ecom-experts/
  src/modules/bundleBuilder/   # the entire feature, isolated as one module
    components/                # Accordion, ProductCard, ReviewPanel, QuantityStepper
    shares/
      api/                     # axios calls only
      services/                # business logic / data-transform, called by the store
      store/                   # Zustand store — all UI + derived state lives here
      interfaces/              # all TypeScript types
      utils/, hooks/
  server/
    index.js                   # Express app, one route: GET /api/products
    data/products.json         # the catalog — steps, products, variants, review copy
  public/products/              # placeholder SVG product images
```

## Key implementation decisions

- **Per-variant quantities.** Quantities are stored in one flat map keyed by `"${productId}::${variantId}"`. Switching a card's active color only changes which key the stepper reads/writes — it never moves or merges quantities between variants. The review panel iterates every `(product, variant)` pair and renders a line for each one with `qty > 0`, so two colors of the same product can both appear as separate lines simultaneously.
- **Shared state, not duplicated state.** The product card and the review-panel line for the same product+variant read from and write to the exact same store slot, so they're trivially kept in sync — there's no separate "sync" step.
- **Derived values computed outside the store, memoized in components.** Totals and review line items are pure functions (`computeReviewLineItems`, `computeTotals`) called via `useMemo` in the components that need them, rather than as Zustand selectors that internally call `get()`. (Calling a Zustand selector that returns a freshly-allocated array/object on every invocation breaks React's `useSyncExternalStore` snapshot caching and causes an infinite render loop — this was caught and fixed during manual verification.)
- **Pre-seeded categories with no add control.** Sensors, accessories, and the plan are seeded with non-zero quantities in `products.json`'s `initialQuantities`, so they show up in the review panel on first load exactly as the design shows, even though their step UI is what drives changes to them going forward.

## What I didn't do / known gaps

- **Figma fidelity is approximate, not pixel-exact.** I built this from a set of exported screenshots rather than live Figma inspect values (no Figma API access), so exact spacing/typography/hex values are eyeballed, not measured. Colors (purple/indigo accent, orange-red selected border), border radii, and layout proportions are close approximations.
- **Product images are placeholder SVGs**, not real product photography — there was no asset export available, so I generated simple placeholder graphics per product.
- **Some product data (prices, badges, which products have which variants) is inferred from a single mid-resolution Figma export** and may not match the source design exactly down to the cent — the behavior and structure are accurate, the specific numbers are best-effort.
- **Checkout is a placeholder** (`window.alert`), as the spec allows — no real navigation or order flow.
- **No automated test suite** — verification was done via a manual Playwright script exercising the accordion, variant/quantity sync, totals, and save/reload persistence, plus visual screenshot review at desktop and mobile widths. Given more time, I'd add component tests around the store's quantity/variant logic (highest-risk area) and a couple of Playwright e2e specs.
- **No server-side persistence** — "Save my system for later" is `localStorage`-only, per the spec; the Express backend only serves the read-only catalog.
