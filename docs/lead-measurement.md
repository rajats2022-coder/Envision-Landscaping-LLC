# Envision website lead path

Updated: 2026-09-22. This replaces the September 7 Jobber measurement plan.

The public estimate form sends directly to S4 Command Center. `/api/leads` exposes the exact Envision form key, Turnstile site key, and consent disclosures only when the intake configuration is enabled. The browser submits to the S4 `/api/forms/[formKey]` endpoint with a Turnstile proof and stable retry key. The S4 endpoint validates the exact site origin and registered form, then writes the lead to Envision's tenant-scoped CRM. The Jobber fallback link has been removed from the generated site.

`estimate_start` records a visitor choosing the contact path. `phone_click` records a phone-link click. Neither event proves a submitted lead. The browser emits `generate_lead` only after the S4 endpoint returns an accepted response. A returned response, the resulting CRM record, and Kyle's portal readback are distinct checks.

The current production intake form has been observed enabled and verified for `envisionlandscapingllc.com` and `www.envisionlandscapingllc.com`; the S4 database contained six `s4_form` lead-received events for Envision on September 22. These observations do not establish that a new submission, acknowledgement, or Kyle's browser view was tested during this site change.

For release: build the site, run its tests, review the generated HTML for any Jobber URL, obtain approval to deploy, then verify the live page and `/api/leads`. A clearly labeled end-to-end test request needs separate approval. Check its exact Envision CRM opportunity and task, and Kyle's portal view before reporting that new intake is end-to-end verified.
