import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const findings = []

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const extractBalancedElement = (html, startIndex, tagName) => {
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tagPattern.lastIndex = startIndex
  let depth = 0
  for (let match = tagPattern.exec(html); match; match = tagPattern.exec(html)) {
    const tag = match[0]
    if (tag.startsWith('</')) {
      depth -= 1
      if (depth === 0) {
        return { html: html.slice(startIndex, tagPattern.lastIndex), start: startIndex, end: tagPattern.lastIndex }
      }
    } else if (!tag.endsWith('/>')) {
      depth += 1
    }
  }
  return null
}

const findElementByClass = (html, className) => {
  const openingTagPattern = /<([a-z][\w:-]*)\b[^>]*>/gi
  for (let match = openingTagPattern.exec(html); match; match = openingTagPattern.exec(html)) {
    const classes = match[0].match(/\bclass\s*=\s*(["'])(.*?)\1/i)?.[2]?.split(/\s+/) || []
    if (!classes.includes(className)) continue
    return extractBalancedElement(html, match.index, match[1])
  }
  return null
}

const imageSources = (html) =>
  [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi)].map(([, , src]) => src)

const isRealFinishedProjectImage = (src) =>
  src.startsWith('/assets/images/projects/') && !/(?:^|[\/_\-.])(?:before|during)(?:[\/_\-.]|$)/i.test(src)

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
const jobberEmbedId = '152dfe43-b7b8-4665-b208-c0f34dac1803-2057108'
const jobberEmbedCss = 'https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css'
const jobberEmbedScript =
  'https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js'
const jobberFormUrl =
  'https://clienthub.getjobber.com/client_hubs/152dfe43-b7b8-4665-b208-c0f34dac1803/public/work_request/embedded_work_request_form?form_id=2057108'

const stripFragments = (href) => href.split('#')[0].split('?')[0]

const expectedServices = [
  ['lawn-maintenance', 'Lawn Maintenance'],
  ['landscape-maintenance', 'Landscape Maintenance'],
  ['aeration-overseeding', 'Aeration & Overseeding'],
  ['spring-fall-cleanups', 'Spring & Fall Cleanups'],
  ['mulch-pine-straw', 'Mulch & Pine Straw'],
  ['landscape-design-planting', 'Design & Planting'],
]
const expectedAreas = [
  ['raleigh-nc', 'Raleigh'],
  ['cary-nc', 'Cary'],
  ['apex-nc', 'Apex'],
  ['morrisville-nc', 'Morrisville'],
  ['fuquay-varina-nc', 'Fuquay-Varina'],
  ['holly-springs-nc', 'Holly Springs'],
  ['durham-nc', 'Durham'],
  ['garner-nc', 'Garner'],
]
const expectedServicePath = (serviceSlug, areaSlug) =>
  areaSlug === 'raleigh-nc'
    ? `/services/${serviceSlug}`
    : `/services/${serviceSlug}/${areaSlug}`
const sitemapPaths = new Set(urls)
const pageTitles = new Map()
const pageHeadings = new Map()

for (const pathname of urls) {
  const relativePath = pagePath(pathname)
  if (!exists(relativePath)) {
    findings.push(`${pathname}: missing ${relativePath}`)
    continue
  }
  if (!exists(path.join('public', relativePath))) {
    findings.push(`${pathname}: missing deployable public/${relativePath}`)
  }

  const html = read(relativePath)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || ''
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim() || ''
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.trim() || ''
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length
  const h1 = html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '')?.trim() || ''

  if (title) {
    const previousPath = pageTitles.get(title)
    if (previousPath) findings.push(`${pathname}: duplicates title used by ${previousPath}`)
    else pageTitles.set(title, pathname)
  }
  if (h1) {
    const previousPath = pageHeadings.get(h1)
    if (previousPath) findings.push(`${pathname}: duplicates h1 used by ${previousPath}`)
    else pageHeadings.set(h1, pathname)
  }

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
  if (html.includes('sms:+19843386483')) findings.push(`${pathname}: still contains the retired SMS form handoff`)
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
  for (const removedService of ['Commercial Lawn Care', 'Hardscaping & Pavers', 'Holiday Lighting']) {
    if (html.includes(removedService)) {
      findings.push(`${pathname}: contains removed service ${removedService}`)
    }
  }
  for (const syntheticAsset of [
    'hero-truck-v1.jpg',
    'envision-truck-cutout-v2.png',
    'service-cleanup-crew-v2.jpg',
    'service-commercial-v2.jpg',
    'service-hardscaping-v2.jpg',
    'service-holiday-lighting-v2.jpg',
    'service-landscape-maintenance-v2.jpg',
    'service-lawn-crew-v2.jpg',
    'service-mulch-crew-v2.jpg',
    'service-planting-v2.jpg',
  ]) {
    if (html.includes(syntheticAsset)) {
      findings.push(`${pathname}: references synthetic image asset ${syntheticAsset}`)
    }
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

  if (html.toLowerCase().includes('formspree')) {
    findings.push(`${pathname}: still references the retired Formspree lead path`)
  }
  if (!html.includes(`href="${jobberEmbedCss}"`)) {
    findings.push(`${pathname}: Jobber embed stylesheet is missing`)
  }

  const jobberShellCount = (html.match(/data-jobber-request/g) || []).length
  const expectsJobber = !['/privacy', '/terms'].includes(pathname)
  if (expectsJobber && jobberShellCount !== 1) {
    findings.push(`${pathname}: expected exactly one Jobber request embed, found ${jobberShellCount}`)
  }
  if (!expectsJobber && jobberShellCount !== 0) {
    findings.push(`${pathname}: legal page unexpectedly contains a Jobber request embed`)
  }
  if (jobberShellCount) {
    if ((html.match(new RegExp(`<div id="${jobberEmbedId}"`, 'g')) || []).length !== 1) {
      findings.push(`${pathname}: Jobber mount ID is missing or duplicated`)
    }
    if (
      !html.includes(
        `<script src="${jobberEmbedScript}" clienthub_id="${jobberEmbedId}" form_url="${jobberFormUrl}"></script>`,
      )
    ) {
      findings.push(`${pathname}: Jobber script is missing its approved account or form configuration`)
    }
    if (!html.includes(`href="${jobberFormUrl}"`)) {
      findings.push(`${pathname}: direct Jobber fallback link is missing`)
    }
  }

  if (pathname.startsWith('/services/')) {
    const jobCards = (html.match(/<article class="service-job-card/g) || []).length
    const serviceSlug = pathname.split('/')[2]
    const expectedJobCards = serviceSlug === 'landscape-maintenance' ? 3 : 4
    if (jobCards !== expectedJobCards) {
      findings.push(`${pathname}: expected ${expectedJobCards} detailed service-job cards, found ${jobCards}`)
    }
    if (!html.includes('class="service-page-hero"')) {
      findings.push(`${pathname}: missing mobile-first service hero`)
    }
    const serviceHero = findElementByClass(html, 'service-page-hero')
    if (serviceHero) {
      const heroImages = imageSources(serviceHero.html)
      if (heroImages.length !== 1) {
        findings.push(`${pathname}: service hero must contain exactly one finished project image, found ${heroImages.length}`)
      } else if (!isRealFinishedProjectImage(heroImages[0])) {
        findings.push(`${pathname}: service hero must use one finished /assets/images/projects/ image, found ${heroImages[0]}`)
      }
      if (
        pathname === '/services/aeration-overseeding' &&
        heroImages[0] !== '/assets/images/projects/aeration-overseeding-hero.jpg'
      ) {
        findings.push(`${pathname}: service hero must use the client-selected finished lawn photo`)
      }
      if (
        serviceHero.html.includes('data-before-after') ||
        serviceHero.html.includes('before-after-range') ||
        serviceHero.html.includes('service-page-hero-slider')
      ) {
        findings.push(`${pathname}: before-and-after interaction must appear below the service hero`)
      }
    }
    if (!html.includes('"hasOfferCatalog"')) {
      findings.push(`${pathname}: missing structured subservice offer catalog`)
    }
    for (const [, image] of html.matchAll(/<article class="service-job-card[\s\S]*?<img src="([^"]+)"/g)) {
      if (/(?:before|during|seasonal-cleanup)/i.test(image)) {
        findings.push(`${pathname}: uses non-finished ${image} as a standalone service-job image`)
      }
    }
    const localizedMatch = pathname.match(/^\/services\/([^/]+)\/([^/]+)$/)
    if (localizedMatch) {
      const areaHub = `/service-areas/${localizedMatch[2]}`
      if (!html.includes(`href="${areaHub}"`)) {
        findings.push(`${pathname}: missing contextual link to ${areaHub}`)
      }
    }
  }

  if (pathname.startsWith('/service-areas/')) {
    const serviceLinks = new Set(
      [...html.matchAll(/href="(\/services\/[^"]+)"/g)].map(([, href]) => href),
    )
    if (serviceLinks.size < 4) {
      findings.push(`${pathname}: expected at least 4 contextual service links, found ${serviceLinks.size}`)
    }
  }
}

const expectedServiceLocationPaths = expectedServices.flatMap(([serviceSlug]) =>
  expectedAreas.map(([areaSlug]) => expectedServicePath(serviceSlug, areaSlug)),
)
if (expectedServiceLocationPaths.length !== 48) {
  findings.push(`service-location matrix expected 48 targets, found ${expectedServiceLocationPaths.length}`)
}

for (const [serviceSlug, serviceTitle] of expectedServices) {
  const serviceHubPath = `/services/${serviceSlug}`
  const serviceHubHtml = exists(pagePath(serviceHubPath)) ? read(pagePath(serviceHubPath)) : ''
  for (const [areaSlug, areaName] of expectedAreas) {
    const pathname = expectedServicePath(serviceSlug, areaSlug)
    const expectedHeading = `${serviceTitle} in ${areaName}, NC`
    if (!sitemapPaths.has(pathname)) {
      findings.push(`${pathname}: missing from the complete service-location sitemap matrix`)
      continue
    }
    const relativePath = pagePath(pathname)
    if (!exists(relativePath)) continue
    const html = read(relativePath)
    if (!html.includes(`<h1>${expectedHeading}</h1>`)) {
      findings.push(`${pathname}: expected exact localized h1 "${expectedHeading}"`)
    }
    if (!html.includes(`<title>${expectedHeading} |`)) {
      findings.push(`${pathname}: title does not lead with the exact localized service heading`)
    }
    if (!serviceHubHtml.includes(`href="${pathname}"`)) {
      findings.push(`${serviceHubPath}: missing crawlable link to ${pathname}`)
    }

    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
      .map(([, json]) => {
        try {
          return JSON.parse(json)
        } catch {
          return null
        }
      })
      .filter(Boolean)
    const serviceData = schemas.find((schema) => schema['@type'] === 'Service')
    const servedNames = Array.isArray(serviceData?.areaServed)
      ? serviceData.areaServed.map((area) => area?.name)
      : [serviceData?.areaServed?.name].filter(Boolean)
    if (serviceData?.name !== expectedHeading || servedNames.length !== 1 || servedNames[0] !== `${areaName}, NC`) {
      findings.push(`${pathname}: Service schema must match only ${expectedHeading}`)
    }
    if (!schemas.some((schema) => schema['@type'] === 'BreadcrumbList')) {
      findings.push(`${pathname}: missing BreadcrumbList schema`)
    }

    if (areaSlug !== 'raleigh-nc') {
      const areaHubPath = `/service-areas/${areaSlug}`
      const areaHubHtml = exists(pagePath(areaHubPath)) ? read(pagePath(areaHubPath)) : ''
      if (!areaHubHtml.includes(`href="${pathname}"`)) {
        findings.push(`${areaHubPath}: missing crawlable link to ${pathname}`)
      }
    }
  }
}

for (const [pathname, before, after] of [
  ['/services/landscape-maintenance', 'walkway-refresh-before.jpg', 'walkway-refresh-after.jpg'],
  ['/services/aeration-overseeding', 'backyard-makeover-before.jpg', 'backyard-makeover-after.jpg'],
  ['/services/spring-fall-cleanups', 'front-refresh-before.jpg', 'front-refresh-after.jpg'],
]) {
  const html = read(pagePath(pathname))
  const serviceHero = findElementByClass(html, 'service-page-hero')
  const belowHero = serviceHero ? html.slice(serviceHero.end) : ''
  const proof = findElementByClass(belowHero, 'service-proof')
  const slider = proof ? findElementByClass(proof.html, 'service-proof-slider') : null
  const proofImages = slider ? imageSources(slider.html) : []
  if (!proof) {
    findings.push(`${pathname}: missing its below-hero service-proof section`)
  } else if (
    !slider ||
    !slider.html.includes('data-before-after') ||
    !slider.html.includes('before-after-range') ||
    !proofImages.some((src) => src.endsWith(`/${before}`)) ||
    !proofImages.some((src) => src.endsWith(`/${after}`))
  ) {
    findings.push(`${pathname}: service-proof is missing its correct interactive verified pair (${before} / ${after})`)
  }
}

const homeHtml = read('index.html')
const homeHero = findElementByClass(homeHtml, 'home-hero')
const homeHeroVisual = homeHero ? findElementByClass(homeHero.html, 'home-hero-visual') : null
const homeHeroImages = homeHeroVisual ? imageSources(homeHeroVisual.html) : []
if (!homeHero) {
  findings.push('/: missing homepage hero')
} else {
  if (
    homeHero.html.includes('data-before-after') ||
    homeHero.html.includes('before-after-range') ||
    homeHero.html.includes('home-hero-slider')
  ) {
    findings.push('/: homepage hero must be a clean finished image, not a before-and-after slider')
  }
  if (homeHeroImages.length !== 1 || homeHeroImages[0] !== '/assets/images/projects/finished-lawn-wide.jpg') {
    findings.push('/: homepage hero visual must use only /assets/images/projects/finished-lawn-wide.jpg')
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
  ['/services/commercial-lawn-care-services', '/services'],
  ['/services/commercial-lawn-care', '/services'],
  ['/services/hardscaping-pavers', '/services'],
  ['/services/holiday-lighting', '/services'],
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
if (!home.includes('data-jobber-request')) findings.push('homepage Jobber request form is not wired')
if (!home.includes(`clienthub_id="${jobberEmbedId}"`) || !home.includes(`form_url="${jobberFormUrl}"`)) {
  findings.push('homepage request form is not connected to the approved Jobber account and form')
}
if (!home.includes('href="tel:+19843386483"')) findings.push('homepage missing normalized phone link')
if (!home.includes('data-map-canvas')) findings.push('homepage live service map is missing')
if (!home.includes('data-map-view="state"')) findings.push('homepage North Carolina map view is missing')
if (home.includes('hero-scroll') || home.includes('See the work')) {
  findings.push('homepage still contains the removed See the work control')
}
const homeIntro = findElementByClass(home, 'intro')
if (!homeIntro?.html.includes('/assets/images/projects/landscape-entry-after.jpg')) {
  findings.push('homepage intro is missing its approved bright finished-property photo')
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
  'projects/striped-lawn-hero.jpg',
  'projects/landscape-entry-after.jpg',
  'projects/front-refresh-after.jpg',
  'projects/backyard-makeover-after.jpg',
  'projects/mulch-curved-bed.jpg',
  'projects/backyard-makeover-after-wide.jpg',
]) {
  if (!home.includes(`/assets/images/${image}`)) findings.push(`homepage is missing ${image}`)
}

const gallery = read('gallery.html')
const featuredStory = findElementByClass(gallery, 'project-story')
const expectedStageImages = [
  'backyard-makeover-during-2.jpg',
  'backyard-makeover-before.jpg',
  'backyard-makeover-after.jpg',
]
if (!featuredStory) {
  findings.push('gallery is missing its featured three-stage project')
} else {
  const featuredImages = imageSources(featuredStory.html).map((src) => src.split('/').pop())
  if (
    featuredImages.length !== expectedStageImages.length ||
    expectedStageImages.some((image, index) => featuredImages[index] !== image)
  ) {
    findings.push(`gallery featured stages have the wrong order: ${featuredImages.join(', ')}`)
  }
}

const areaSignals = [...home.matchAll(/<button class="map-signal[^>]+data-area-signal[^>]+>/g)].map(
  ([markup]) => markup
)
if (areaSignals.length !== 8) {
  findings.push(`homepage expected 8 geographic map signals, found ${areaSignals.length}`)
}

const siteJs = read('assets/site.js')
if (siteJs.includes('sms:+19843386483')) findings.push('site script still contains the retired SMS form handoff')
if (/formspree|data-quote-form|fetch\(quoteForm\.action/i.test(siteJs)) {
  findings.push('site script still contains the retired Formspree submission flow')
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
