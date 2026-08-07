import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const findings = []

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const sitemap = read('sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>https:\/\/envisionlandscapingllc\.com([^<]*)<\/loc>/g)].map(
  ([, pathname]) => pathname || '/'
)

const pagePath = (pathname) => {
  if (pathname === '/') return 'index.html'
  const clean = pathname.replace(/^\/|\/$/g, '')
  return path.extname(clean) ? clean : `${clean}.html`
}

const connectedGooglePlaceId = 'ChIJ3xWsRgz1rIkR7xzJrM3_Fy0'
const staleGooglePlaceId = 'ChIJjRfUHps6RysRA6PtjRQlYYc'

const stripFragments = (href) => href.split('#')[0].split('?')[0]

for (const pathname of urls) {
  const relativePath = pagePath(pathname)
  if (!exists(relativePath)) {
    findings.push(`${pathname}: missing ${relativePath}`)
    continue
  }

  const html = read(relativePath)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || ''
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim() || ''
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.trim() || ''
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length

  if (!title || title.length > 65) findings.push(`${pathname}: title length ${title.length}`)
  if (!description || description.length > 165) {
    findings.push(`${pathname}: meta description length ${description.length}`)
  }
  const expectedCanonical = `https://envisionlandscapingllc.com${pathname === '/' ? '/' : pathname}`
  if (canonical !== expectedCanonical) {
    findings.push(`${pathname}: canonical ${canonical || 'missing'}; expected ${expectedCanonical}`)
  }
  if (h1Count !== 1) findings.push(`${pathname}: expected one h1, found ${h1Count}`)
  if (!['/privacy', '/terms'].includes(pathname) && !html.includes('<script type="application/ld+json">')) {
    findings.push(`${pathname}: missing JSON-LD`)
  }
  if (!html.includes('/assets/styles.css')) findings.push(`${pathname}: missing shared stylesheet`)
  if (!html.includes('/assets/site.js')) findings.push(`${pathname}: missing shared interaction script`)
  if (!html.includes('/assets/concierge.js')) findings.push(`${pathname}: missing concierge script`)
  if (!html.includes('data-concierge')) findings.push(`${pathname}: missing site concierge`)
  if (!html.includes('mailto:Kyle@envisionlandscapingllc.com')) {
    findings.push(`${pathname}: missing Kyle email link`)
  }
  if (html.includes('search.google.com/local/reviews?placeid=')) {
    findings.push(`${pathname}: contains obsolete Google review-reading URL`)
  }
  if (html.includes(staleGooglePlaceId)) {
    findings.push(`${pathname}: contains stale Google place ID`)
  }
  if (!html.includes(connectedGooglePlaceId)) {
    findings.push(`${pathname}: missing connected Google place ID`)
  }
  if (
    html.includes('openingHoursSpecification') ||
    html.includes('Monday–Sunday, 8:00 AM–12:00 AM') ||
    html.includes('Mon–Sun: 8 AM–12 AM') ||
    html.includes('8 AM to midnight') ||
    html.includes('Published hours')
  ) {
    findings.push(`${pathname}: contains unconfirmed published hours`)
  }
  if (html.includes('Chapel Hill')) {
    findings.push(`${pathname}: contains a service-area claim not configured on the connected Google Business Profile`)
  }
  if (html.includes('"aggregateRating"')) {
    findings.push(`${pathname}: contains self-serving LocalBusiness aggregate rating markup`)
  }
  for (const [, rating] of html.matchAll(/data-review-rating="([^"]+)"/g)) {
    if (Number(rating) !== 5) {
      findings.push(pathname + ': contains a non-five-star displayed review')
    }
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try {
      JSON.parse(json)
    } catch {
      findings.push(`${pathname}: invalid JSON-LD`)
    }
  }

  for (const [, src, alt] of html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/g)) {
    if (!alt.trim()) findings.push(`${pathname}: image ${src} has empty alt text`)
    if (src.startsWith('/') && !exists(src.slice(1))) {
      findings.push(`${pathname}: missing image ${src}`)
    }
  }

  for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const clean = stripFragments(href)
    if (!clean || clean === '/' || !clean.startsWith('/') || clean.startsWith('//')) continue
    if (clean.startsWith('/assets/')) continue
    const target = pagePath(clean)
    if (!exists(target)) findings.push(`${pathname}: broken internal link ${href}`)
  }

  if (pathname.startsWith('/services/')) {
    const jobCards = (html.match(/<article class="service-job-card/g) || []).length
    if (jobCards !== 4) {
      findings.push(`${pathname}: expected 4 detailed service-job cards, found ${jobCards}`)
    }
    if (!html.includes('class="service-page-hero"')) {
      findings.push(`${pathname}: missing mobile-first service hero`)
    }
    if (!html.includes('"hasOfferCatalog"')) {
      findings.push(`${pathname}: missing structured subservice offer catalog`)
    }
    const areaLinks = new Set(
      [...html.matchAll(/href="(\/service-areas#[^"]+)"/g)].map(([, href]) => href),
    )
    if (areaLinks.size !== 8) {
      findings.push(`${pathname}: expected 8 contextual service-area links, found ${areaLinks.size}`)
    }
  }

  if (pathname.startsWith('/service-areas/')) {
    const serviceLinks = new Set(
      [...html.matchAll(/href="(\/services\/[^"]+)"/g)].map(([, href]) => href),
    )
    if (serviceLinks.size !== 8) {
      findings.push(`${pathname}: expected 8 contextual service links, found ${serviceLinks.size}`)
    }
  }
}

for (const required of [
  '404.html',
  'assets/site.js',
  'assets/concierge.js',
  'assets/styles.css',
  'assets/vendor/maplibre-gl.css',
  'assets/vendor/maplibre-gl.js',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'privacy.html',
]) {
  if (!exists(required)) findings.push(`missing required file: ${required}`)
}

const vercelConfig = JSON.parse(read('vercel.json'))
for (const [source, destination] of [
  ['/service-areas/holland-nc', '/service-areas'],
  ['/services/mulching-services', '/services/mulch-pine-straw'],
  ['/services/commercial-lawn-care-services', '/services/commercial-lawn-care'],
  ['/services/landscaping-consultationdesign', '/services/landscape-design-planting'],
  ['/services/residential-lawn-care-services', '/services/lawn-maintenance'],
  ['/projects/lawn-care-and-maintenance-project', '/gallery'],
]) {
  const redirect = vercelConfig.redirects?.find((item) => item.source === source)
  if (!redirect || redirect.destination !== destination || redirect.permanent !== true) {
    findings.push(`${source}: missing evidence-aligned permanent redirect to ${destination}`)
  }
}

const home = read('index.html')
for (const field of ['name', 'phone', 'service', 'location']) {
  if (!new RegExp(`<[^>]+name="${field}"`).test(home)) findings.push(`quote form missing ${field}`)
}
if (!home.includes('data-quote-form')) findings.push('homepage quote form is not wired')
if (!home.includes('href="tel:+19843386483"')) findings.push('homepage missing normalized phone link')
if (!home.includes('data-map-canvas')) findings.push('homepage live service map is missing')
if (!home.includes('data-map-view="state"')) findings.push('homepage North Carolina map view is missing')
if (home.includes('hero-scroll') || home.includes('See the work')) {
  findings.push('homepage still contains the removed See the work control')
}
if (!home.includes('data-review-stack')) findings.push('homepage staggered Google review stack is missing')
if (!home.includes('42 Google reviews')) findings.push('homepage synced Google review count is missing')
if (!home.includes('https://search.google.com/local/writereview?placeid=')) {
  findings.push('homepage direct Google review action is missing')
}
if (!home.includes('https://www.google.com/maps/search/?api=1&query=Envision%20Landscaping%20LLC&query_place_id=')) {
  findings.push('homepage verified Google Maps review-reading link is missing')
}
if (!home.includes('mailto:Kyle@envisionlandscapingllc.com')) {
  findings.push('homepage Kyle email link is missing')
}
if (!home.includes('meta name="google-site-verification" content="-LK9I0YqBf9eNzXHW7bNKepdZbfF2hQ2-NrThUllYmA"')) {
  findings.push('homepage Search Console verification tag is missing')
}
if (!home.includes('data-area-slug="garner-nc"') || home.includes('data-area-slug="chapel-hill-nc"')) {
  findings.push('homepage service-area signals do not match the connected Google Business Profile')
}
for (const image of [
  'service-lawn-crew-v2.jpg',
  'service-commercial-v2.jpg',
  'service-landscape-maintenance-v2.jpg',
  'service-cleanup-crew-v2.jpg',
  'service-mulch-crew-v2.jpg',
  'service-planting-v2.jpg',
  'service-hardscaping-v2.jpg',
  'service-holiday-lighting-v2.jpg',
]) {
  if (!home.includes(`/assets/images/${image}`)) findings.push(`homepage is missing ${image}`)
}

const areaSignals = [...home.matchAll(/<button class="map-signal[^>]+data-area-signal[^>]+>/g)].map(
  ([markup]) => markup
)
if (areaSignals.length !== 8) {
  findings.push(`homepage expected 8 geographic map signals, found ${areaSignals.length}`)
}
for (const signal of areaSignals) {
  if (!/data-area-latitude="-?\d+(?:\.\d+)?"/.test(signal)) {
    findings.push('map signal is missing a valid latitude')
  }
  if (!/data-area-longitude="-?\d+(?:\.\d+)?"/.test(signal)) {
    findings.push('map signal is missing a valid longitude')
  }
}

if (findings.length) {
  console.error(`Site audit failed with ${findings.length} finding${findings.length === 1 ? '' : 's'}:`)
  findings.forEach((finding) => console.error(`- ${finding}`))
  process.exit(1)
}

console.log(`Site audit passed: ${urls.length} sitemap pages, internal links, metadata, assets, and lead path verified.`)
