# Envision lead measurement — implementation and verification

Date: 2026-09-22. Native S4 intake is configured; release and protected delivery verification remain held for owner review.

## Observed wiring

- Generator: `scripts/build-pages.mjs`; browser entry: `assets/site.js`; analytics contract: `assets/lead-tracking.js`.
- Existing GTM container: `GTM-TK4WJG52`. Its source presence does not establish published tag mappings, a GA4 destination, consent behavior, or received events.
- The native form loads public configuration from the Envision site `/api/leads` route, verifies a Cloudflare Turnstile challenge, and submits to the S4 Command Center `/api/forms/{formKey}` route. The key is public but the tenant and allowed origins are resolved server-side.
- The Command Center route requires an enabled, verified form registry entry, exact allowed origin, Turnstile validation, an idempotency key, and a hashed IP rate limit before it calls the tenant-resolving `ingest_native_website_lead` RPC.
- Production readback on September 22 confirmed the Envision site exposes a configured native-intake response, and the active Envision tenant has an enabled, verified form registry row with the Envision apex and www origins. This is configuration evidence; it does not establish a new genuine website lead or Kyle's portal readback.
- No new production request, client message, GTM publish, or analytics configuration change was made for this change.

## Event contract

| Event | Trigger | Meaning |
|---|---|---|
| `estimate_start` | Same-origin contact link or native-form request anchor | Visitor selected a request path; **not a submitted lead** |
| `phone_click` | Telephone link click | Visitor selected a phone link; **not an answered call or lead** |

Both retain the preexisting event names so existing GTM event-name triggers can continue matching. Each now has only the allowlisted `service_intent` and `interaction_type` parameters; old `link_url` and `link_text` fields were removed. Any existing tags relying on those fields must be reviewed before publishing. All contact links are now classified consistently, including concierge links.

`interaction_type`: `contact_link`, `request_anchor`, or `phone_link`.

`service_intent`: `landscape-projects`, `fall-cleanup`, `leaf-removal`, `christmas-lighting`, `lawn-maintenance`, `landscape-maintenance`, `mulch-pine-straw`, `aeration-overseeding`, or `unspecified`.

Intent precedence: allowed CTA/ancestor `data-service-intent`, current service-page route, then last service intent visited/selected in this tab's session storage. Generic visits remain unspecified. The session value is a browsing-interest signal, not the service Kyle ultimately quotes. Storage denial does not break navigation or current-page intent. No chat input, customer details, query strings, full URLs, phone numbers, or form-field values enter these custom event payloads.

No event is emitted for a page load or a simulated form success. `generate_lead` runs only after the native S4 endpoint returns its accepted response; a data-layer event still does not prove a qualified lead, booking, or revenue.

## Local verification

- `node scripts/test-lead-tracking.mjs`: passed. Covers service route and explicit intent, session persistence, one event per click, denied storage, invalid/non-element targets, PII-free field allowlist, and no false submitted-lead signal.
- `node scripts/test-concierge.mjs`: passed (74 assertions). Christmas lighting now routes to its existing service page with quote-only scope. Hardscape inquiries remain a confirmation handoff; no unsupported patio or wall promise.
- `node --check assets/site.js`: passed.
- `npm test` now includes the focused tracking suite. Root integration owns generated build, full-suite and browser verification.

## Concrete release and provider review

1. Approve/release the focused site change; review published GTM mappings for the retained event names and changed fields. Configure `service_intent` and `interaction_type` as event parameters/dimensions only in the correct Envision GA4 property. Do not classify either click event as a confirmed lead.
2. In an authorized browser session, verify the native form on desktop/mobile, then use Tag Assistant/GA4 DebugView to confirm each interaction exactly once with the intended service parameter. Check consent and blocked-script behavior separately. A dataLayer event alone is not GA4 receipt.
3. With owner authorization, submit one clearly labeled protected test request through the native form; confirm its accepted response, tenant-scoped CRM contact/opportunity/lifecycle event, and Kyle's portal visibility. Also check error/retry behavior. No fabricated production lead is needed for local tests.
4. Inspect the actual authorized GA4 configuration for a supported native-form completion signal. Only then verify delivery in GA4 and prevent duplicate reporting.
5. Report submitted requests, qualified requests, quotes, booked work, and revenue from their respective provider records; keep click counts separate. No conversion-rate, lead-volume, or revenue result is claimed by this change.
