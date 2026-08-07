import { defaultConciergeConfig } from '../assets/concierge.js'

const links = [
  ['Read Google reviews', defaultConciergeConfig.googleReviews],
  ['Leave a Google review', defaultConciergeConfig.googleWriteReview],
]

for (const [label, url] of links) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; EnvisionWebsiteLinkCheck/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}: ${response.url}`)
  }

  console.log(`${label}: HTTP ${response.status} -> ${response.url}`)
  await response.body?.cancel()
}
