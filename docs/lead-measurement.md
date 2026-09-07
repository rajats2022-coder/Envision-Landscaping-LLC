# Envision lead measurement — implementation and verification

Date: 2026-09-07. Local implementation; release and provider configuration remain held for owner review.

## Observed wiring

- Generator: `scripts/build-pages.mjs`; browser entry: `assets/site.js`; analytics contract: `assets/lead-tracking.js`.
- Existing GTM container: `GTM-TK4WJG52`. Its source presence does not establish published tag mappings, a GA4 destination, consent behavior, or received events.
- Existing Jobber mount: `152dfe43-b7b8-4665-b208-c0f34dac1803-2057108`; form ID `2057108`. Contact and estimate sections preserve the same embed and external fallback.
- On September 7 the public Jobber loader was retrieved read-only at https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js. It creates an iframe, handles sizing/overlay messages, forwards UTM and page/referrer metadata, and optionally obtains gtag client/session IDs. This loader exposes no explicit request-success event that this site can safely treat as a submitted lead. The iframe contents and backend request delivery are separate verification steps.
- No production request, client message, GTM publish, analytics configuration change, or Jobber mutation was made.

## Event contract

| Event | Trigger | Meaning |
|---|---|---|
| `estimate_start` | Same-origin contact link, request anchor, or exact HTTPS Jobber-host fallback click | Visitor selected a request path; **not a submitted lead** |
| `phone_click` | Telephone link click | Visitor selected a phone link; **not an answered call or lead** |

Both retain the preexisting event names so existing GTM event-name triggers can continue matching. Each now has only the allowlisted `service_intent` and `interaction_type` parameters; old `link_url` and `link_text` fields were removed. Any existing tags relying on those fields must be reviewed before publishing. All contact links are now classified consistently, including concierge links.

`interaction_type`: `contact_link`, `request_anchor`, `jobber_fallback`, or `phone_link`.

`service_intent`: `landscape-projects`, `fall-cleanup`, `leaf-removal`, `christmas-lighting`, `lawn-maintenance`, `landscape-maintenance`, `mulch-pine-straw`, `aeration-overseeding`, or `unspecified`.

Intent precedence: allowed CTA/ancestor `data-service-intent`, current service-page route, then last service intent visited/selected in this tab's session storage. Generic visits remain unspecified. The session value is a browsing-interest signal, not the service Kyle ultimately quotes. Storage denial does not break navigation or current-page intent. No chat input, customer details, query strings, full URLs, phone numbers, or form-field values enter these custom event payloads. Third-party GTM/Jobber behavior needs its own provider review; this contract does not assert that their separate collection is disabled.

No event is emitted for a page load, iframe load, iframe resize, or a simulated form success. There is deliberately no `generate_lead` implementation until an authorized actual completion can be verified.

## Local verification

- `node scripts/test-lead-tracking.mjs`: passed. Covers service route and explicit intent, session persistence, one event per click, denied storage, invalid/non-element targets, strict Jobber hostname matching, PII-free field allowlist, and no false submitted-lead signal.
- `node scripts/test-concierge.mjs`: passed (74 assertions). Christmas lighting now routes to its existing service page with quote-only scope. Hardscape inquiries remain a confirmation handoff; no unsupported patio or wall promise.
- `node --check assets/site.js`: passed.
- `npm test` now includes the focused tracking suite. Root integration owns generated build, full-suite and browser verification.

## Concrete release and provider review

1. Approve/release the focused site change; review published GTM mappings for the retained event names and changed fields. Configure `service_intent` and `interaction_type` as event parameters/dimensions only in the correct Envision GA4 property. Do not classify either click event as a confirmed lead.
2. In an authorized browser session, verify the contact iframe and fallback on desktop/mobile, then use Tag Assistant/GA4 DebugView to confirm each interaction exactly once with the intended service parameter. Check consent and blocked-script behavior separately. A dataLayer event alone is not GA4 receipt.
3. With owner authorization, submit one clearly labeled real test request through Jobber; confirm its arrival in Kyle's correct Jobber queue and correlate the service and timestamp. Also check error/retry behavior. No fabricated production lead is needed for local tests.
4. Inspect the actual authorized Jobber/GA4 integration for a supported confirmed-submission signal. Only then implement or map a lead-completion event, prevent duplicate reporting, and verify delivery in GA4. An iframe load or click cannot substitute for this evidence.
5. Report submitted requests, qualified requests, quotes, booked work, and revenue from their respective provider records; keep click counts separate. No conversion-rate, lead-volume, or revenue result is claimed by this change.
