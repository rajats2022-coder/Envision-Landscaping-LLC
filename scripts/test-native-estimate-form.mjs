import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { buildEstimateSummary, formspreeFields, normalizePhoneE164 } from '../assets/native-estimate-form.mjs'

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

const formData = new FormData()
formData.set('firstName', 'Jordan')
formData.set('lastName', 'Lee')
formData.set('email', 'Jordan@example.com')
formData.set('phone', '(984) 338-6483')
formData.set('service', 'Lawn maintenance')
formData.set('propertyLocation', 'Raleigh, NC 27603')
formData.set('timing', 'Within two weeks')
formData.set('details', 'Please estimate weekly mowing and edging.')
formData.set('sourcePage', 'https://envisionlandscapingllc.com/contact')
formData.set('website', '')
const fields = formspreeFields(formData)
assert.equal(fields.name, 'Jordan Lee')
assert.equal(fields.email, 'jordan@example.com')
assert.equal(fields.phone, '+19843386483')
assert.equal(fields.lead_source, 'website')
assert.match(fields.message, /Property location: Raleigh, NC 27603/)

const builder = await readFile(new URL('./build-pages.mjs', import.meta.url), 'utf8')
assert.match(builder, /id="envision-estimate-form"/)
assert.doesNotMatch(builder, /turnstile-challenge/)
assert.doesNotMatch(builder, /smsServiceConsent/)
assert.match(builder, /Open Envision’s secure Jobber request form/)

const endpoint = await readFile(new URL('../api/leads.js', import.meta.url), 'utf8')
assert.match(endpoint, /envisionlandscapingllc\.com/)
assert.match(endpoint, /ENVISION_FORMSPREE_FORM_ID/)
assert.match(endpoint, /ENVISION_FORMSPREE_INTAKE_ENABLED/)

console.log('Native estimate form checks passed.')
