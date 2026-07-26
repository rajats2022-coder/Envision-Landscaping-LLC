# Envision Landscaping LLC Website

Static, conversion-focused website for Envision Landscaping LLC. The visual direction adapts the bold, photo-led hierarchy of ZS Exteriors to Envision's own forest-green identity and verified Raleigh/Triangle service offering.

## Local development

```bash
npm run build
npm run dev
```

The local server runs at `http://127.0.0.1:3017`.

## Verification

```bash
npm run audit
npm test
npm run screenshot
npm run screenshot:mobile
```

## Source of truth

- Edit page data and shared templates in `scripts/build-pages.mjs`.
- Edit global styling in `assets/styles.css`.
- Edit interactions in `assets/site.js`.
- Run `npm run build` after template or content changes.

## Lead path

The quote form creates a prefilled SMS to `(984) 338-6483`; it does not collect or store visitor information on a third-party form service. Phone and text actions are therefore live without requiring an unverified inbox or API credential.

## Deployment

`vercel.json`, `robots.txt`, `sitemap.xml`, canonical URLs, JSON-LD, and a custom 404 page are included. Connect this directory to the approved Envision Vercel/domain account before production publication.

## Content guardrails

Published copy is limited to the services, service areas, offers, contact details, public reviews, and business facts verified during the July 24, 2026 audit. Do not add claims about licensing, insurance, awards, warranties, years in business, or project counts without client confirmation.
