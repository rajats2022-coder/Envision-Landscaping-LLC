import assert from 'node:assert/strict'
import {
  buildEstimateHandoff,
  classifyIntent,
  defaultConciergeConfig,
  detectService,
  responseFor,
} from '../assets/concierge.js'

assert.match(defaultConciergeConfig.googleReviews, /ChIJ3xWsRgz1rIkR7xzJrM3_Fy0/)
assert.match(defaultConciergeConfig.googleWriteReview, /ChIJ3xWsRgz1rIkR7xzJrM3_Fy0/)
assert.doesNotMatch(defaultConciergeConfig.googleReviews, /ChIJjRfUHps6RysRA6PtjRQlYYc/)
assert.doesNotMatch(defaultConciergeConfig.googleWriteReview, /ChIJjRfUHps6RysRA6PtjRQlYYc/)

const intentCases = [
  ['Hi there', 'greeting'],
  ['Thanks for the help', 'thanks'],
  ['What services do you offer?', 'service-picker'],
  ['Can you mow and edge my grass?', 'lawn'],
  ['I manage a commercial storefront', 'commercial'],
  ['Our shrubs and hedges need trimming', 'landscape-maintenance'],
  ['We need leaves and sticks cleaned up', 'cleanup'],
  ['Can you install pine straw?', 'mulch'],
  ['I need new sod and some planting', 'planting'],
  ['We want a paver patio and fire pit', 'hardscape'],
  ['Can you install Christmas lights?', 'holiday'],
  ['Do you serve Cary?', 'area'],
  ['How much would an estimate cost?', 'estimate'],
  ['Are you available after the rain today?', 'availability'],
  ['What time are you open Sunday?', 'hours'],
  ['Show me your Google reviews', 'reviews'],
  ['I want to leave a Google review', 'leave-review'],
  ['Do you have any coupons or specials?', 'offers'],
  ['I need to reschedule my appointment', 'schedule-change'],
  ['I have a complaint about a missed visit', 'customer-care'],
  ['Can I pay an invoice here?', 'billing'],
  ['Are you licensed and insured?', 'credentials'],
  ['Show me pictures of your work', 'gallery'],
  ['Are you hiring?', 'careers'],
  ['What is Kyle’s email?', 'contact'],
  ['Who owns Envision?', 'about'],
  ['Do you offer pressure washing?', 'unlisted-service'],
  ['A tree fell on a power line', 'urgent'],
  ['Can you explain something else?', 'fallback'],
]

for (const [message, expected] of intentCases) {
  assert.equal(classifyIntent(message), expected, `Unexpected intent for: ${message}`)
  assert.equal(
    responseFor(message).actions.some((item) => item.href === '/contact'),
    true,
    `Missing contact-form handoff for: ${message}`,
  )
}

assert.equal(detectService('mowing quote')?.label, 'Lawn maintenance')
assert.equal(detectService('retaining wall project')?.label, 'Hardscaping and pavers')

const estimate = responseFor('I need a lawn mowing estimate')
assert.equal(estimate.intent, 'estimate')
assert.equal(estimate.startEstimate, undefined)
assert.equal(estimate.actions.at(-1).href, '/contact')

const readReviews = responseFor('Show me customer reviews')
assert.equal(readReviews.actions[0].href, defaultConciergeConfig.googleReviews)
assert.match(readReviews.actions[0].href, /^https:\/\/www\.google\.com\/maps\/search\//)

const leaveReview = responseFor('I want to write a Google review')
assert.equal(leaveReview.actions[0].href, defaultConciergeConfig.googleWriteReview)
assert.match(leaveReview.actions[0].href, /^https:\/\/search\.google\.com\/local\/writereview/)

const handoff = buildEstimateHandoff({
  service: 'Seasonal cleanup',
  location: 'Cary, NC 27513',
  details: 'Leaves in the front and back yard before next month',
})
assert.match(handoff.summary, /Seasonal cleanup/)
assert.equal(handoff.actions.length, 1)
assert.equal(handoff.actions[0].href, '/contact')

console.log(`Concierge tests passed: ${intentCases.length * 2 + 12} assertions.`)
