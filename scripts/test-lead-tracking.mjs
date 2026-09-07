import assert from 'node:assert/strict'
import { interactionFor, initLeadTracking, serviceIntentForPath } from '../assets/lead-tracking.js'

const home = 'https://envisionlandscapingllc.com/'
const lighting = `${home}services/christmas-light-installation`
const inspect = (href, extra = {}) => interactionFor({ href, pageUrl: lighting, ...extra })
assert.deepEqual(inspect('/contact?email=private@example.com'), {
  event: 'estimate_start', service_intent: 'christmas-lighting', interaction_type: 'contact_link',
})
assert.equal(inspect('tel:+19843386483').event, 'phone_click')
assert.equal(inspect('#jobber-request').interaction_type, 'request_anchor')
assert.equal(inspect('https://clienthub.getjobber.com/client_hubs/example?private=value').interaction_type, 'jobber_fallback')
for (const href of ['https://clienthub.getjobber.com.evil.test/', 'https://evil.test/?clienthub.getjobber.com', 'javascript:alert(1)', '/gallery']) {
  assert.equal(inspect(href), null, `Should not track ${href}`)
}
assert.equal(inspect('/contact', { explicitIntent: 'leaf-removal' }).service_intent, 'leaf-removal')
assert.equal(inspect('/contact', { explicitIntent: 'private@example.com' }).service_intent, 'christmas-lighting')
assert.equal(inspect('/contact', { pageUrl: home, rememberedIntent: 'fall-cleanup' }).service_intent, 'fall-cleanup')
assert.equal(inspect('/contact', { pageUrl: home, rememberedIntent: 'private@example.com' }).service_intent, 'unspecified')
assert.equal(serviceIntentForPath('/services/landscape-design-planting/'), 'landscape-projects')

for (const city of ['cary-nc', 'apex-nc', 'morrisville-nc', 'fuquay-varina-nc', 'holly-springs-nc', 'durham-nc', 'garner-nc']) {
  assert.equal(serviceIntentForPath(`/services/landscape-design-planting/${city}`), 'landscape-projects')
}
for (const path of ['/services/christmas-lighting', '/services/landscape-design-planting/unknown-nc', '/services/landscape-design-planting/cary-nc/extra', '/services/unknown/cary-nc']) {
  assert.equal(serviceIntentForPath(path), 'unspecified')
}

function harness({ path = '/', blockedStorage = false } = {}) {
  const storage = new Map()
  const location = new URL(path, home)
  const window = { location, sessionStorage: {
    getItem(key) { if (blockedStorage) throw Error('blocked'); return storage.get(key) },
    setItem(key, value) { if (blockedStorage) throw Error('blocked'); storage.set(key, value) },
  } }
  let handler
  const document = { addEventListener(name, callback) { assert.equal(name, 'click'); handler = callback } }
  initLeadTracking(document, window)
  const click = (href, intent) => handler({ target: { closest: () => ({
    getAttribute: () => href,
    closest: () => intent ? { dataset: { serviceIntent: intent } } : null,
  }) } })
  return { window, click, handler }
}
const session = harness()
assert.deepEqual(session.window.dataLayer, []) // Loading the form/page is not a conversion.
session.click('/services/leaf-removal')
assert.deepEqual(session.window.dataLayer, [])
session.click('/contact')
assert.equal(session.window.dataLayer[0].service_intent, 'leaf-removal')
assert.equal(session.window.dataLayer.length, 1) // Exactly one signal per click.
session.handler({ target: {} }) // Non-element targets are safe.
const blocked = harness({ path: '/services/christmas-light-installation', blockedStorage: true })
blocked.click('/contact')
assert.equal(blocked.window.dataLayer[0].service_intent, 'christmas-lighting')
for (const event of [...session.window.dataLayer, ...blocked.window.dataLayer]) {
  assert.notEqual(event.event, 'generate_lead')
  assert.deepEqual(Object.keys(event).sort(), ['event', 'interaction_type', 'service_intent'])
}
console.log('Lead tracking tests passed: intent attribution, allowlist/privacy, storage denial, no false submission, and one-event-per-click.')
