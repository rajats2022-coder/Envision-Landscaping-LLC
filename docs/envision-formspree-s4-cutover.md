# Envision website-to-S4 intake cutover

## Implemented website contract

The native estimate form sends a JSON request to `https://formspree.io/f/<form ID>` only after its same-origin configuration endpoint confirms that intake is enabled. The public Formspree ID is injected by the Vercel environment; no S4 credential, Formspree signing secret, or tenant identifier is stored in this repository.

When the configuration is absent or invalid, the native submit button stays disabled and the existing Jobber link remains available. This is the expected state before cutover.

| Website field | Formspree field | S4 Formspree mapping |
| --- | --- | --- |
| First and last name | `name` | `name` -> `name` |
| Email | `email` | `email` -> `email` |
| Phone | `phone` | `phone` -> `phone` |
| Service needed | `service` | `service` -> `service` |
| Property, timing, details, source page | `message` | `message` -> `message` |
| Website origin | `lead_source=website` | retained in attributes |
| Honeypot | `website` | ignored by the existing webhook normalizer |

SMS consent is deliberately not sent by this form. No SMS should be queued or delivered as part of this change.

## Required cutover sequence

1. In Formspree, create or select one Envision-only form. Record its public form ID and create a webhook to `https://app.s4aiagency.com/api/webhooks/formspree` using Formspree's signing secret.
2. In the S4 Command Center, add that exact form ID to the Envision Landscaping tenant as `estimate_request`, store the signing secret there, and save this mapping: `name`, `email`, `phone`, `service`, `message`.
3. Confirm the Command Center reports a single Envision-scoped Formspree connection. Do not reuse a Mike or other tenant form ID.
4. Add the matching `ENVISION_FORMSPREE_FORM_ID` and `ENVISION_FORMSPREE_INTAKE_ENABLED=true` to the approved Envision Vercel project. These values are not enough to activate intake unless the Formspree webhook and S4 connection are already configured.
5. Deploy from current `main` after approval. Submit one owner-approved test estimate with a distinctive test marker. Verify the Formspree delivery, signed Command Center webhook receipt, and Envision-scoped CRM contact, opportunity, follow-up task, and lifecycle event.
6. Only after that readback, decide whether to remove the Jobber fallback. This branch keeps it available.

## Current state

The exact Envision Formspree ID, signing secret, tenant connection, and provider receipt are unverified. Therefore this document and the website code are an implementation artifact, not proof that website inquiries reach S4.
