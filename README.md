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

`npm run build` generates a clean `public/` deployment bundle for Vercel. The repository also includes `vercel.json`, `robots.txt`, `sitemap.xml`, canonical URLs, JSON-LD, and a custom 404 page. Connect the repository to the approved Envision Vercel/domain account before production publication.

## Content guardrails

Published copy is limited to the services, service areas, offers, contact details, public reviews, and business facts verified during the July 24 and August 7, 2026 audits. Do not add claims about licensing, insurance, awards, warranties, years in business, or project counts without client confirmation.

As of August 7, 2026, the connected Google Business Profile is the operating source for the current Google Place ID and these configured service areas: Apex, Cary, Durham, Garner, Raleigh, Morrisville, Fuquay-Varina, and Holly Springs. The site intentionally omits business-hours markup until the owner confirms public hours. Future service-area, address, hours, or service changes require owner confirmation before publication.

The previously published Place ID (`ChIJjRfUHps6RysRA6PtjRQlYYc`) and the connected managed Place ID (`ChIJ3xWsRgz1rIkR7xzJrM3_Fy0`) both resolve to Envision but have different Google feature identifiers. Treat the former as a possible duplicate for owner/Google support review; do not merge, remove, or redirect a Google profile automatically.
