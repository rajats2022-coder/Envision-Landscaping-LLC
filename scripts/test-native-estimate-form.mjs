import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { buildEstimateSummary, normalizePhoneE164 } from '../assets/native-estimate-form.mjs'

assert.equal(normalizePhoneE164('(984) 338-6483'), '+19843386483')
assert.equal(normalizePhoneE164(''), '')
assert.throws(() => normalizePhoneE164('123'), /valid phone number/)

const summary = buildEstimateSummary({
  service: 'Lawn maintenance',
  propertyLocation: 'Raleigh, NC 27603',
  timing: 'Within two weeks',
  details: 'Please estimate weekly mowing and edging.',
  sourcePage: 'https://envisionlandscapingllc.com/contact',
})
assert.match(summary, /Service requested: Lawn maintenance/)
assert.match(summary, /Property location: Raleigh, NC 27603/)
assert.match(summary, /Project details: Please estimate weekly mowing and edging\./)

const builder = await readFile(new URL('./build-pages.mjs', import.meta.url), 'utf8')
assert.match(builder, /id="envision-estimate-form"/)
assert.match(builder, /id="turnstile-challenge"/)
assert.match(builder, /emailServiceConsent/)
assert.match(builder, /smsServiceConsent/)
assert.match(builder, /Open Envision’s secure Jobber request form/)

const endpoint = await readFile(new URL('../api/leads.js', import.meta.url), 'utf8')
assert.match(endpoint, /envisionlandscapingllc\.com/)
assert.match(endpoint, /S4_PUBLIC_INTAKE_FORM_KEY/)
assert.match(endpoint, /app\.s4aiagency\.com\/api\/forms/)

console.log('Native estimate form checks passed.')
