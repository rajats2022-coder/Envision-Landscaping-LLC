import assert from 'node:assert/strict'
import { initJobberInlineScroll } from '../assets/jobber-inline-scroll.js'

const listeners = []
const scrolls = []
const formWindow = {}
const shell = { scrollIntoView: (options) => scrolls.push(options) }
const iframe = { contentWindow: formWindow, closest: () => shell }
const document = {
  querySelector: () => shell,
  querySelectorAll: () => [iframe],
}
const window = {
  addEventListener: (type, callback, capture = false) => listeners.push({ type, callback, capture }),
}

// The vendor can register first; our capture listener must still run before it.
let vendorCalls = 0
window.addEventListener('message', () => { vendorCalls += 1 })
initJobberInlineScroll(document, window)
const dispatch = (changes = {}) => {
  let stopped = false
  const event = {
    data: 'scrolltop', origin: 'https://clienthub.getjobber.com', source: formWindow,
    stopImmediatePropagation: () => { stopped = true }, ...changes,
  }
  for (const listener of [...listeners].sort((a, b) => Number(b.capture) - Number(a.capture))) {
    listener.callback(event)
    if (stopped) break
  }
  return stopped
}

assert.equal(dispatch(), true)
assert.equal(vendorCalls, 0, 'Do not invoke the missing-dialog vendor scroll handler')
assert.deepEqual(scrolls, [{ behavior: 'smooth', block: 'start' }])
for (const changes of [
  { data: '800px' }, // Keep vendor iframe resizing intact.
  { data: 'recaptcha-setup' },
  { data: 'close' },
  { data: { type: 'scrolltop' } },
  { origin: 'https://example.com' },
  { origin: 'https://clienthub.getjobber.com.evil.test' },
  { source: {} }, // Other Jobber tabs/frames cannot scroll this form.
]) {
  assert.equal(dispatch(changes), false)
}
assert.equal(scrolls.length, 1)
assert.equal(vendorCalls, 7)
iframe.closest = () => null
assert.equal(dispatch(), false, 'A removed form must not cause a scroll error')

initJobberInlineScroll({ querySelector: () => null }, {
  addEventListener: () => assert.fail('Legal pages do not need an embed listener'),
})
console.log('Jobber inline scroll tests passed: capture order, correct form, trusted origin/source, and unaffected vendor messages.')
